import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";

// Payload CMS field types
const PAYLOAD_FIELD_TYPES = [
  "text",
  "textarea",
  "richText",
  "number",
  "email",
  "code",
  "json",
  "select",
  "radio",
  "checkbox",
  "date",
  "upload",
  "relationship",
  "array",
  "blocks",
  "group",
  "tabs",
  "row",
  "collapsible",
  "point",
] as const;

const PAYLOAD_DATABASES = ["mongodb", "postgres"] as const;

// Create the MCP server
const server = new McpServer({
  name: "payload-cms-server",
  version: "1.0.0",
});

// Best practices and validation rules
const PAYLOAD_BEST_PRACTICES = {
  collections: [
    "Always use TypeScript for type safety",
    "Use slug naming convention: lowercase with hyphens",
    "Include timestamps unless explicitly not needed",
    "Add admin.useAsTitle for better UX",
    "Implement proper access control",
    "Consider versioning for important content",
    "Use hooks for data transformation",
    "Add proper field validation",
  ],
  fields: [
    "Use required: true for mandatory fields",
    "Add admin.description for field guidance",
    "Use localized for multi-language content",
    "Implement proper validation rules",
    "Use index: true for frequently queried fields",
    "Add unique: true where appropriate",
    "Consider defaultValue for better UX",
  ],
  hooks: [
    "Use beforeValidate for data sanitization",
    "Use afterRead for data transformation",
    "Implement beforeChange for business logic",
    "Use afterChange for side effects",
    "Keep hooks pure and predictable",
    "Handle errors gracefully",
  ],
  access: [
    "Default to secure (deny by default)",
    "Use field-level access when needed",
    "Implement role-based access control",
    "Consider read vs write permissions separately",
    "Test access rules thoroughly",
  ],
};

// =====================
// RESOURCES
// =====================

// Best practices resource
server.registerResource(
  "best-practices",
  new ResourceTemplate("payload://best-practices/{category}", {
    list: async () => ({
      resources: [
        {
          uri: "payload://best-practices/collections",
          name: "Collections Best Practices",
          title: "Collections Best Practices",
          mimeType: "text/plain",
        },
        {
          uri: "payload://best-practices/fields",
          name: "Fields Best Practices",
          title: "Fields Best Practices",
          mimeType: "text/plain",
        },
        {
          uri: "payload://best-practices/hooks",
          name: "Hooks Best Practices",
          title: "Hooks Best Practices",
          mimeType: "text/plain",
        },
        {
          uri: "payload://best-practices/access",
          name: "Access Control Best Practices",
          title: "Access Control Best Practices",
          mimeType: "text/plain",
        },
      ],
    }),
  }),
  {
    title: "Payload CMS Best Practices",
    description: "Best practices for Payload CMS development",
    mimeType: "text/plain",
  },
  async (uri, { category }) => {
    const practices =
      PAYLOAD_BEST_PRACTICES[category as keyof typeof PAYLOAD_BEST_PRACTICES];
    return {
      contents: [
        {
          uri: uri.href,
          text: `Best Practices for ${category}:\n\n${practices.map((p, i) => `${i + 1}. ${p}`).join("\n")}`,
        },
      ],
    };
  },
);

// Field types resource
server.registerResource(
  "field-types",
  "payload://field-types",
  {
    title: "Payload CMS Field Types",
    description: "Available field types in Payload CMS 3.0",
    mimeType: "application/json",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        text: JSON.stringify(PAYLOAD_FIELD_TYPES, null, 2),
      },
    ],
  }),
);

// Project file browser resource
server.registerResource(
  "project-files",
  new ResourceTemplate("payload://project/{projectPath}/files", {
    list: undefined,
  }),
  {
    title: "Payload Project Files",
    description: "Browse files in a Payload CMS project",
    mimeType: "application/json",
  },
  async (uri, { projectPath }) => {
    try {
      // Ensure projectPath is a string
      const pathStr = Array.isArray(projectPath) ? projectPath[0] : projectPath;
      const files = await listPayloadFiles(pathStr);
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(files, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to list project files: ${(error as Error).message}`,
      );
    }
  },
);

// =====================
// TOOLS
// =====================

// Validate Payload code
server.registerTool(
  "validate",
  {
    title: "Validate Payload Code",
    description: "Validate Payload CMS code for syntax and best practices",
    inputSchema: {
      code: z.string().describe("The code to validate"),
      fileType: z
        .enum(["collection", "field", "global", "config"])
        .describe("Type of file being validated"),
    },
  },
  async ({ code, fileType }) => {
    const issues: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (!code.trim()) {
      issues.push("Code cannot be empty");
    }

    // TypeScript check
    if (!code.includes("export")) {
      warnings.push("Consider exporting your configuration");
    }

    // Collection-specific validation
    if (fileType === "collection") {
      if (!code.includes("slug:")) {
        issues.push("Collection must have a 'slug' property");
      }
      if (!code.includes("fields:")) {
        issues.push("Collection must have a 'fields' array");
      }
      if (!code.includes("admin:") && !code.includes("useAsTitle")) {
        warnings.push("Consider adding 'admin.useAsTitle' for better UX");
      }
    }

    // Field validation
    if (fileType === "field" || fileType === "collection") {
      if (
        code.includes("type:") &&
        !PAYLOAD_FIELD_TYPES.some((t) => code.includes(`"${t}"`))
      ) {
        warnings.push(
          "Field type may not be valid. Check against available types.",
        );
      }
    }

    const result = {
      valid: issues.length === 0,
      issues,
      warnings,
      suggestions:
        PAYLOAD_BEST_PRACTICES[
          fileType === "collection" ? "collections" : "fields"
        ],
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },
);

// Query best practices
server.registerTool(
  "query",
  {
    title: "Query Best Practices",
    description: "Query validation rules and best practices for Payload CMS",
    inputSchema: {
      query: z.string().describe("Query string"),
      fileType: z
        .enum(["collection", "field", "global", "config"])
        .optional()
        .describe("Optional: Type of file to query about"),
    },
  },
  async ({ query, fileType }) => {
    let response = "";

    // Search through best practices
    const allPractices = Object.entries(PAYLOAD_BEST_PRACTICES);
    const matches = allPractices.filter(([category, practices]) => {
      if (fileType && category !== fileType) return false;
      return practices.some(
        (p) =>
          p.toLowerCase().includes(query.toLowerCase()) ||
          category.toLowerCase().includes(query.toLowerCase()),
      );
    });

    if (matches.length > 0) {
      response = matches
        .map(
          ([category, practices]) =>
            `${category.toUpperCase()}:\n${practices.join("\n")}`,
        )
        .join("\n\n");
    } else {
      response = `No specific best practices found for "${query}". Consider checking the documentation or being more specific with your query.`;
    }

    return {
      content: [
        {
          type: "text",
          text: response,
        },
      ],
    };
  },
);

// Generate collection
server.registerTool(
  "generate_collection",
  {
    title: "Generate Collection",
    description: "Generate a complete Payload CMS collection definition",
    inputSchema: {
      slug: z.string().describe("Collection slug"),
      fields: z.array(z.any()).optional().describe("Array of field objects"),
      auth: z
        .boolean()
        .optional()
        .describe("Whether this is an auth collection"),
      timestamps: z
        .boolean()
        .optional()
        .default(true)
        .describe("Include timestamps"),
      admin: z.any().optional().describe("Admin panel configuration"),
      hooks: z.boolean().optional().describe("Include hooks template"),
      access: z.boolean().optional().describe("Include access control"),
      versions: z.boolean().optional().describe("Enable versioning"),
    },
  },
  async ({
    slug,
    fields,
    auth,
    timestamps,
    admin,
    hooks,
    access,
    versions,
  }) => {
    const collection = generateCollection({
      slug,
      fields: fields || [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea" },
      ],
      auth,
      timestamps,
      admin: admin || { useAsTitle: "title" },
      hooks,
      access,
      versions,
    });

    return {
      content: [
        {
          type: "text",
          text: collection,
        },
      ],
    };
  },
);

// Generate field
server.registerTool(
  "generate_field",
  {
    title: "Generate Field",
    description: "Generate a Payload CMS field definition",
    inputSchema: {
      name: z.string().describe("Field name"),
      type: z.string().describe("Field type"),
      required: z.boolean().optional().describe("Whether field is required"),
      unique: z.boolean().optional().describe("Whether field should be unique"),
      localized: z
        .boolean()
        .optional()
        .describe("Whether field should be localized"),
      access: z.boolean().optional().describe("Include access control"),
      admin: z.any().optional().describe("Admin panel configuration"),
      validation: z.boolean().optional().describe("Include validation"),
      defaultValue: z.any().optional().describe("Default value"),
    },
  },
  async (params) => {
    const field = generateField(params);
    return {
      content: [
        {
          type: "text",
          text: field,
        },
      ],
    };
  },
);

// Scaffold project
server.registerTool(
  "scaffold_project",
  {
    title: "Scaffold Project",
    description: "Scaffold a complete Payload CMS project structure",
    inputSchema: {
      projectName: z.string().describe("Name of the project"),
      projectPath: z.string().describe("Path where project should be created"),
      description: z.string().optional().describe("Project description"),
      database: z
        .enum(PAYLOAD_DATABASES)
        .default("mongodb")
        .describe("Database type"),
      auth: z
        .boolean()
        .optional()
        .default(true)
        .describe("Include authentication"),
      typescript: z
        .boolean()
        .optional()
        .default(true)
        .describe("Use TypeScript"),
      collections: z
        .array(z.string())
        .optional()
        .describe("Collection names to create"),
    },
  },
  async ({
    projectName,
    projectPath,
    description,
    database,
    auth,
    typescript,
    collections,
  }) => {
    try {
      const result = await scaffoldProject({
        projectName,
        projectPath,
        description,
        database,
        auth,
        typescript,
        collections: collections || ["posts", "pages"],
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error scaffolding project: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  },
);

// Read project file
server.registerTool(
  "read_project_file",
  {
    title: "Read Project File",
    description: "Read a file from a Payload CMS project",
    inputSchema: {
      projectPath: z.string().describe("Path to the project"),
      filePath: z.string().describe("Relative path to the file"),
    },
  },
  async ({ projectPath, filePath }) => {
    try {
      const fullPath = path.join(projectPath, filePath);
      const content = await fs.readFile(fullPath, "utf-8");

      return {
        content: [
          {
            type: "text",
            text: content,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error reading file: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  },
);

// Write project file
server.registerTool(
  "write_project_file",
  {
    title: "Write Project File",
    description: "Write a file to a Payload CMS project",
    inputSchema: {
      projectPath: z.string().describe("Path to the project"),
      filePath: z.string().describe("Relative path to the file"),
      content: z.string().describe("File content"),
    },
  },
  async ({ projectPath, filePath, content }) => {
    try {
      const fullPath = path.join(projectPath, filePath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content, "utf-8");

      return {
        content: [
          {
            type: "text",
            text: `Successfully wrote file: ${filePath}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error writing file: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  },
);

// =====================
// PROMPTS
// =====================

server.registerPrompt(
  "review-collection",
  {
    title: "Review Collection",
    description: "Review a Payload CMS collection for best practices",
    argsSchema: {
      code: z.string().describe("Collection code to review"),
    },
  },
  ({ code }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Please review this Payload CMS collection code and provide feedback on best practices, potential issues, and improvements:\n\n${code}`,
        },
      },
    ],
  }),
);

server.registerPrompt(
  "create-collection",
  {
    title: "Create Collection",
    description: "Guide to create a new Payload CMS collection",
    argsSchema: {
      collectionName: z.string().describe("Name of the collection to create"),
      purpose: z.string().describe("Purpose of the collection"),
    },
  },
  ({ collectionName, purpose }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Create a Payload CMS collection named "${collectionName}" for ${purpose}. Include appropriate fields, validation, and access control following best practices.`,
        },
      },
    ],
  }),
);

server.registerPrompt(
  "migrate-to-v3",
  {
    title: "Migrate to Payload 3.0",
    description: "Help migrate code from Payload CMS 2.x to 3.0",
    argsSchema: {
      code: z.string().describe("Legacy code to migrate"),
    },
  },
  ({ code }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Migrate this Payload CMS 2.x code to version 3.0, following the new patterns and best practices:\n\n${code}`,
        },
      },
    ],
  }),
);

// =====================
// HELPER FUNCTIONS
// =====================

function generateCollection(config: any): string {
  const { slug, fields, auth, timestamps, admin, hooks, access, versions } =
    config;

  let code = `import { CollectionConfig } from 'payload'\n\n`;

  code += `export const ${capitalizeFirstLetter(slug)}: CollectionConfig = {\n`;
  code += `  slug: '${slug}',\n`;

  if (auth) {
    code += `  auth: true,\n`;
  }

  code += `  fields: [\n`;
  fields.forEach((field: any) => {
    code += `    {\n`;
    code += `      name: '${field.name}',\n`;
    code += `      type: '${field.type}',\n`;
    if (field.required) code += `      required: true,\n`;
    code += `    },\n`;
  });
  code += `  ],\n`;

  if (admin) {
    code += `  admin: ${JSON.stringify(admin, null, 2).split("\n").join("\n  ")},\n`;
  }

  if (timestamps !== false) {
    code += `  timestamps: true,\n`;
  }

  if (versions) {
    code += `  versions: {\n`;
    code += `    drafts: true,\n`;
    code += `  },\n`;
  }

  if (access) {
    code += `  access: {\n`;
    code += `    read: () => true,\n`;
    code += `    create: ({ req: { user } }) => !!user,\n`;
    code += `    update: ({ req: { user } }) => !!user,\n`;
    code += `    delete: ({ req: { user } }) => !!user,\n`;
    code += `  },\n`;
  }

  if (hooks) {
    code += `  hooks: {\n`;
    code += `    beforeChange: [async ({ data, req }) => {\n`;
    code += `      // Add your hook logic here\n`;
    code += `      return data;\n`;
    code += `    }],\n`;
    code += `  },\n`;
  }

  code += `}\n`;

  return code;
}

function generateField(params: any): string {
  const {
    name,
    type,
    required,
    unique,
    localized,
    access,
    admin,
    validation,
    defaultValue,
  } = params;

  let field = `{\n`;
  field += `  name: '${name}',\n`;
  field += `  type: '${type}',\n`;

  if (required) field += `  required: true,\n`;
  if (unique) field += `  unique: true,\n`;
  if (localized) field += `  localized: true,\n`;
  if (defaultValue !== undefined) {
    field += `  defaultValue: ${JSON.stringify(defaultValue)},\n`;
  }

  if (admin) {
    field += `  admin: ${JSON.stringify(admin, null, 2).split("\n").join("\n  ")},\n`;
  }

  if (access) {
    field += `  access: {\n`;
    field += `    read: () => true,\n`;
    field += `    update: ({ req: { user } }) => !!user,\n`;
    field += `  },\n`;
  }

  if (validation) {
    field += `  validate: (value) => {\n`;
    field += `    // Add your validation logic\n`;
    field += `    return true;\n`;
    field += `  },\n`;
  }

  field += `}`;

  return field;
}

async function scaffoldProject(config: any): Promise<any> {
  const {
    projectName,
    projectPath,
    description,
    database,
    auth,
    typescript,
    collections,
  } = config;

  const fullPath = path.join(projectPath, projectName);

  // Create directory structure
  const dirs = [
    "src/collections",
    "src/globals",
    "src/blocks",
    "src/fields",
    "src/access",
    "src/hooks",
    "public",
  ];

  const createdFiles: string[] = [];

  try {
    // Create directories
    for (const dir of dirs) {
      await fs.mkdir(path.join(fullPath, dir), { recursive: true });
    }

    // Create package.json
    const packageJson = {
      name: projectName,
      version: "1.0.0",
      description: description || `Payload CMS project: ${projectName}`,
      scripts: {
        dev: "payload dev",
        build: "payload build",
        serve: "payload serve",
        generate: "payload generate:types",
      },
      dependencies: {
        payload: "^3.0.0",
        [database === "mongodb" ? "mongodb" : "@payloadcms/db-postgres"]:
          "latest",
        "@payloadcms/richtext-lexical": "^3.0.0",
        react: "^18.3.1",
        "react-dom": "^18.3.1",
      },
      devDependencies: typescript
        ? {
            "@types/node": "^20.0.0",
            "@types/react": "^18.3.0",
            typescript: "^5.0.0",
          }
        : {},
    };

    await fs.writeFile(
      path.join(fullPath, "package.json"),
      JSON.stringify(packageJson, null, 2),
    );
    createdFiles.push("package.json");

    // Create payload.config.ts
    const configExt = typescript ? "ts" : "js";
    const configContent = generatePayloadConfig(
      projectName,
      database,
      auth,
      collections,
    );
    await fs.writeFile(
      path.join(fullPath, `payload.config.${configExt}`),
      configContent,
    );
    createdFiles.push(`payload.config.${configExt}`);

    // Create collections
    for (const collectionName of collections) {
      const collectionContent = generateCollection({
        slug: collectionName,
        fields: [
          { name: "title", type: "text", required: true },
          { name: "description", type: "textarea" },
          { name: "content", type: "richText" },
        ],
        timestamps: true,
        admin: { useAsTitle: "title" },
        access: true,
        versions: true,
      });

      await fs.writeFile(
        path.join(fullPath, `src/collections/${collectionName}.${configExt}`),
        collectionContent,
      );
      createdFiles.push(`src/collections/${collectionName}.${configExt}`);
    }

    // Create .env file
    const envContent =
      database === "mongodb"
        ? `DATABASE_URI=mongodb://localhost:27017/${projectName}\nPAYLOAD_SECRET=your-secret-key-here\n`
        : `DATABASE_URI=postgres://localhost:5432/${projectName}\nPAYLOAD_SECRET=your-secret-key-here\n`;

    await fs.writeFile(path.join(fullPath, ".env"), envContent);
    createdFiles.push(".env");

    // Create README
    const readmeContent = generateReadme(projectName, database);
    await fs.writeFile(path.join(fullPath, "README.md"), readmeContent);
    createdFiles.push("README.md");

    return {
      success: true,
      projectPath: fullPath,
      createdFiles,
      message: `Successfully scaffolded Payload CMS project: ${projectName}`,
      nextSteps: [
        `cd ${projectName}`,
        "npm install",
        "Update .env with your database connection",
        "npm run dev",
      ],
    };
  } catch (error) {
    throw new Error(`Failed to scaffold project: ${(error as Error).message}`);
  }
}

function generatePayloadConfig(
  _projectName: string,
  database: string,
  _auth: boolean,
  collections: string[],
): string {
  let config = `import { buildConfig } from 'payload'\n`;

  if (database === "mongodb") {
    config += `import { mongooseAdapter } from '@payloadcms/db-mongodb'\n`;
  } else {
    config += `import { postgresAdapter } from '@payloadcms/db-postgres'\n`;
  }

  config += `import { lexicalEditor } from '@payloadcms/richtext-lexical'\n`;

  collections.forEach((col) => {
    config += `import { ${capitalizeFirstLetter(col)} } from './src/collections/${col}'\n`;
  });

  config += `\nexport default buildConfig({\n`;
  config += `  serverURL: process.env.SERVER_URL || 'http://localhost:3000',\n`;
  config += `  collections: [\n`;
  collections.forEach((col) => {
    config += `    ${capitalizeFirstLetter(col)},\n`;
  });
  config += `  ],\n`;
  config += `  editor: lexicalEditor(),\n`;
  config += `  secret: process.env.PAYLOAD_SECRET || '',\n`;

  if (database === "mongodb") {
    config += `  db: mongooseAdapter({\n`;
    config += `    url: process.env.DATABASE_URI || '',\n`;
    config += `  }),\n`;
  } else {
    config += `  db: postgresAdapter({\n`;
    config += `    pool: {\n`;
    config += `      connectionString: process.env.DATABASE_URI || '',\n`;
    config += `    },\n`;
    config += `  }),\n`;
  }

  config += `  typescript: {\n`;
  config += `    outputFile: './payload-types.ts',\n`;
  config += `  },\n`;
  config += `})\n`;

  return config;
}

function generateReadme(projectName: string, database: string): string {
  return `# ${projectName}

Payload CMS 3.0 Project

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Set up your database:
- Database: ${database}
- Update the \`.env\` file with your database connection string

3. Start development server:
\`\`\`bash
npm run dev
\`\`\`

4. Access the admin panel:
- URL: http://localhost:3000/admin

## Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run serve\` - Serve production build
- \`npm run generate\` - Generate TypeScript types

## Documentation

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Payload CMS 3.0 Migration Guide](https://payloadcms.com/docs/3.0/migration-guide)
`;
}

async function listPayloadFiles(projectPath: string): Promise<any> {
  const result: any = {
    collections: [],
    globals: [],
    blocks: [],
    config: null,
  };

  try {
    // List collections
    const collectionsPath = path.join(projectPath, "src/collections");
    const collections = await fs.readdir(collectionsPath);
    result.collections = collections.filter(
      (f) => f.endsWith(".ts") || f.endsWith(".js"),
    );

    // List globals
    const globalsPath = path.join(projectPath, "src/globals");
    try {
      const globals = await fs.readdir(globalsPath);
      result.globals = globals.filter(
        (f) => f.endsWith(".ts") || f.endsWith(".js"),
      );
    } catch (e) {
      // Globals directory may not exist
    }

    // Check for config
    const configFiles = ["payload.config.ts", "payload.config.js"];
    for (const configFile of configFiles) {
      try {
        await fs.access(path.join(projectPath, configFile));
        result.config = configFile;
        break;
      } catch (e) {
        // Config file doesn't exist
      }
    }
  } catch (error) {
    throw new Error(
      `Failed to list project files: ${(error as Error).message}`,
    );
  }

  return result;
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// =====================
// START SERVER
// =====================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Payload CMS MCP Server running on stdio");
}

main().catch(console.error);
