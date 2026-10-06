# 📁 Project Structure & Setup Guide

## Directory Structure

```
payload-cms-mcp-server/
├── src/
│   └── index.ts                 # Main server implementation
├── build/                       # Compiled JavaScript (generated)
│   └── index.js
├── package.json
├── tsconfig.json
├── README.md
├── .gitignore
└── examples/
    ├── claude-desktop-config.json
    ├── test-scenarios.md
    └── integration-examples.md
```

## Setup Steps

### 1. Initial Setup

```bash
# Create project directory
mkdir payload-cms-mcp-server
cd payload-cms-mcp-server

# Copy the files
# - src/index.ts (main server code)
# - package.json
# - tsconfig.json
# - README.md

# Install dependencies
npm install

# Build the server
npm run build
```

### 2. Configure Claude Desktop

**macOS Path**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "payload-cms": {
      "command": "node",
      "args": [
        "/Users/tony/ghq/github.com/tony-sn/mcp/payload-cms-mcp-server/build/index.js"
      ]
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/tony/projects",
        "/Users/tony/ghq"
      ]
    }
  }
}
```

### 3. Restart Claude Desktop

After adding the configuration:
1. Quit Claude Desktop completely
2. Reopen Claude Desktop
3. Look for the 🔌 icon to verify server connection

### 4. Verify Connection

In Claude, try:
```
Can you list the available Payload CMS field types?
```

If successful, you should see a list of field types!

## Integration with Filesystem MCP

The Payload CMS MCP server works best when combined with the filesystem MCP server. This allows Claude to:

1. Read actual project files
2. Write generated code to disk
3. Browse project structures
4. Make real-time updates

### Example Workflow

```
1. User: "Create a new Payload CMS project for my blog"

2. Claude uses payload-cms MCP to:
   - Generate project structure
   - Create collection definitions
   - Generate configuration files

3. Claude uses filesystem MCP to:
   - Write files to disk
   - Create directory structure
   - Save all generated code

4. Result: Complete, working Payload CMS project on disk
```

## Working with Multiple Agents

### Scenario 1: Full-Stack Blog Platform

```
Step 1: Project Initialization
@payload-cms scaffold a blog project with posts, categories, and authors

Step 2: React Components
@react-specialist create components to display posts from the Payload API

Step 3: Next.js Integration
@nextjs-developer set up Next.js routes and API integration

Step 4: UI Design
@ui-designer create a custom admin dashboard design

Step 5: Deployment
@vercel deploy the project with MongoDB Atlas
```

### Scenario 2: E-commerce Platform

```
Step 1: Schema Design
User: I need an e-commerce platform with products, orders, and customers

Claude (using payload-cms):
- Generates product collection with variants
- Creates order collection with relationships
- Sets up customer authentication
- Implements role-based access control

Step 2: Frontend Development
@frontend-developer create product catalog and cart functionality

Step 3: API Integration
@nextjs-developer set up API routes and checkout flow
```

### Scenario 3: Code Review & Migration

```
Step 1: Legacy Code Analysis
User: Review my Payload 2.x code and suggest v3 migration

Claude (using payload-cms):
- Validates current code
- Identifies deprecated patterns
- Generates migration suggestions

Step 2: Automated Migration
Claude (using payload-cms + filesystem):
- Reads existing files
- Generates v3-compatible code
- Updates configuration files
- Creates backup of old code
```

## Best Practices for Using the MCP Server

### 1. Always Specify Project Paths

**Good:**
```
Read the posts collection from /Users/tony/projects/my-blog
```

**Bad:**
```
Read the posts collection from my blog project
```

### 2. Be Specific About Requirements

**Good:**
```
Generate a products collection with:
- Name (required, unique)
- SKU (required, unique, indexed)
- Price (number with currency)
- Images (array of uploads)
- Categories (relationship to categories collection)
- Inventory tracking
- Draft/published status
```

**Bad:**
```
Create a products collection
```

### 3. Use Prompts for Complex Tasks

**Good:**
```
Use the create-collection prompt for a user authentication system
```

**Bad:**
```
Make a user collection
```

### 4. Combine with File Operations

**Good:**
```
1. Generate the collection
2. Write it to src/collections/products.ts
3. Update payload.config.ts to import it
4. Show me the changes
```

**Bad:**
```
Generate a collection (and then manually copy-paste)
```

## Testing Your Setup

### Test 1: Basic Connectivity
```
What field types are available in Payload CMS?
```

Expected: List of field types

### Test 2: Code Validation
```
Validate this collection:
export const Test = {
  slug: 'test',
  fields: []
}
```

Expected: Validation results with suggestions

### Test 3: Code Generation
```
Generate a simple blog post collection
```

Expected: Complete TypeScript collection definition

### Test 4: File Operations (requires filesystem MCP)
```
List the files in /Users/tony/projects/my-payload-project
```

Expected: Project file structure

### Test 5: Project Scaffolding
```
Scaffold a new project at /Users/tony/projects/test-cms with MongoDB
```

Expected: Complete project structure created

## Troubleshooting

### Server Not Showing Up

**Check 1: Verify Build**
```bash
cd payload-cms-mcp-server
npm run build
# Should complete without errors
```

**Check 2: Test Standalone**
```bash
node build/index.js
# Should start without errors
```

**Check 3: Check Logs**
- macOS: `~/Library/Logs/Claude/mcp*.log`
- Look for connection errors

### Commands Not Working

**Issue**: Claude doesn't seem to use the MCP tools

**Solution**:
1. Be explicit: "Use the Payload CMS MCP to..."
2. Restart Claude Desktop
3. Check that 🔌 shows "payload-cms" server

### File Operations Failing

**Issue**: Can't read/write files

**Solution**:
1. Add filesystem MCP server to config
2. Use absolute paths
3. Check file permissions
4. Verify paths exist

## Advanced Configuration

### Multiple Project Directories

```json
{
  "mcpServers": {
    "payload-cms": {
      "command": "node",
      "args": ["/path/to/payload-cms-mcp-server/build/index.js"]
    },
    "filesystem-work": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/tony/work-projects"
      ]
    },
    "filesystem-personal": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/tony/personal-projects"
      ]
    }
  }
}
```

### Environment Variables

If you need to pass environment variables to the server:

```json
{
  "mcpServers": {
    "payload-cms": {
      "command": "node",
      "args": ["/path/to/payload-cms-mcp-server/build/index.js"],
      "env": {
        "DEBUG": "true",
        "PAYLOAD_VERSION": "3.0"
      }
    }
  }
}
```

## Development Workflow

### Typical Session Flow

```
1. Start Claude Desktop
2. Verify MCP connection (🔌 icon)
3. Begin conversation about Payload CMS needs
4. Claude automatically uses appropriate tools:
   - Validation tools for code review
   - Generation tools for new code
   - File tools for reading/writing
   - Resources for best practices
5. Review generated code
6. Iterate as needed
```

### Example Commands

```
# Start a new project
"Create a new Payload CMS blog project at ~/projects/my-blog"

# Add a collection
"Add a comments collection with moderation to my blog project"

# Review existing code
"Review the users collection in ~/projects/my-blog for security issues"

# Update code
"Update the posts collection to add SEO fields"

# Get help
"What are the best practices for implementing access control?"

# Migrate
"Help me migrate my Payload 2.x project to version 3"
```

## Next Steps

1. ✅ Complete setup following this guide
2. ✅ Test with simple commands
3. ✅ Create your first project
4. ✅ Integrate with other agents
5. ✅ Build something awesome!

## Resources

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [MCP Documentation](https://modelcontextprotocol.io)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

Ready to build? Start with a simple test and work your way up! 🚀
