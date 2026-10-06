import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface DocSection {
  title: string;
  slug: string;
  sourceUrl?: string;
  content: string;
}

let cachedSections: DocSection[] | null = null;
let cachedIndexText: string | null = null;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function findDataFile(filename: string): Promise<string | null> {
  const candidateDirs = [
    path.resolve(__dirname, "../data"),
    path.resolve(__dirname, "data"),
    path.resolve(process.cwd(), "data"),
  ];

  for (const dir of candidateDirs) {
    const fullPath = path.join(dir, filename);
    try {
      await fs.access(fullPath);
      return fullPath;
    } catch {
      // Try next candidate
    }
  }

  return null;
}

export async function loadDocSections(): Promise<DocSection[]> {
  if (cachedSections) {
    return cachedSections;
  }

  const filePath = await findDataFile("llms-full.txt");
  if (!filePath) {
    return [];
  }

  try {
    const rawContent = await fs.readFile(filePath, "utf-8");
    const rawSections = rawContent.split(/\n(?=# [^\n]+)/);
    const sections: DocSection[] = [];

    for (const raw of rawSections) {
      const trimmed = raw.trim();
      if (!trimmed) continue;

      const firstLineEnd = trimmed.indexOf("\n");
      const headingLine = (
        firstLineEnd === -1 ? trimmed : trimmed.slice(0, firstLineEnd)
      ).trim();
      const title = headingLine.replace(/^#\s+/, "").trim();
      if (!title) continue;

      const slug = slugify(title);
      const sourceMatch = trimmed.match(/^Source:\s*([^\n]+)/m);
      const sourceUrl = sourceMatch ? sourceMatch[1].trim() : undefined;

      sections.push({
        title,
        slug,
        sourceUrl,
        content: trimmed,
      });
    }

    cachedSections = sections;
    return sections;
  } catch (error) {
    console.error("Failed to load llms-full.txt:", error);
    return [];
  }
}

export async function loadDocIndex(): Promise<string> {
  if (cachedIndexText) {
    return cachedIndexText;
  }

  const filePath = await findDataFile("llms.txt");
  if (!filePath) {
    return "Documentation index not found. Run `npm run sync-docs` to download documentation.";
  }

  try {
    const content = await fs.readFile(filePath, "utf-8");
    cachedIndexText = content;
    return content;
  } catch (error) {
    return `Error reading doc index: ${(error as Error).message}`;
  }
}

export interface SearchResult {
  title: string;
  slug: string;
  sourceUrl?: string;
  excerpt: string;
  score: number;
}

export async function searchDocs(
  query: string,
  limit: number = 5,
): Promise<SearchResult[]> {
  const sections = await loadDocSections();
  if (sections.length === 0) {
    return [];
  }

  const lowerQuery = query.toLowerCase().trim();
  const queryWords = lowerQuery.split(/\s+/).filter(Boolean);

  const results: SearchResult[] = [];

  for (const section of sections) {
    const lowerTitle = section.title.toLowerCase();
    const lowerContent = section.content.toLowerCase();

    let score = 0;

    // Exact title match
    if (lowerTitle === lowerQuery) {
      score += 100;
    } else if (lowerTitle.includes(lowerQuery)) {
      score += 50;
    }

    // Title word matches
    for (const word of queryWords) {
      if (lowerTitle.includes(word)) {
        score += 15;
      }
    }

    // Content match
    if (lowerContent.includes(lowerQuery)) {
      score += 20;
    }

    // Content word matches
    for (const word of queryWords) {
      const matchCount = (lowerContent.match(new RegExp(word, "g")) || []).length;
      score += Math.min(matchCount * 2, 20);
    }

    if (score > 0) {
      // Generate excerpt
      let excerpt = "";
      const matchIdx = lowerContent.indexOf(lowerQuery);
      if (matchIdx !== -1) {
        const start = Math.max(0, matchIdx - 80);
        const end = Math.min(section.content.length, matchIdx + 220);
        excerpt =
          (start > 0 ? "..." : "") +
          section.content.slice(start, end).replace(/\n+/g, " ") +
          (end < section.content.length ? "..." : "");
      } else {
        // First few lines as excerpt
        const lines = section.content
          .split("\n")
          .filter((l) => l.trim() && !l.startsWith("#") && !l.startsWith("Source:"))
          .slice(0, 3);
        excerpt = lines.join(" ").slice(0, 200) + "...";
      }

      results.push({
        title: section.title,
        slug: section.slug,
        sourceUrl: section.sourceUrl,
        excerpt,
        score,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

export async function getDoc(topic: string): Promise<DocSection | null> {
  const sections = await loadDocSections();
  if (sections.length === 0) {
    return null;
  }

  const lowerTopic = topic.toLowerCase().trim();
  const targetSlug = slugify(topic);

  // Exact slug match
  let matched = sections.find(
    (s) => s.slug === targetSlug || s.slug === lowerTopic,
  );
  if (matched) return matched;

  // Exact title match
  matched = sections.find((s) => s.title.toLowerCase() === lowerTopic);
  if (matched) return matched;

  // Partial slug or title match
  matched = sections.find(
    (s) =>
      s.slug.includes(targetSlug) ||
      s.title.toLowerCase().includes(lowerTopic),
  );
  if (matched) return matched;

  return null;
}

export async function listDocTopics(filter?: string): Promise<{ title: string; slug: string }[]> {
  const sections = await loadDocSections();
  let list = sections.map((s) => ({ title: s.title, slug: s.slug }));

  if (filter && filter.trim()) {
    const lowerFilter = filter.toLowerCase().trim();
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerFilter) ||
        item.slug.includes(lowerFilter),
    );
  }

  return list;
}
