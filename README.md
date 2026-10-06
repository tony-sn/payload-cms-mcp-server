# 🚀 Payload CMS 3.0 MCP Server

A specialized Model Context Protocol (MCP) server for Payload CMS 3.0 development. This server provides AI-powered assistance for validating code, generating templates, and scaffolding Payload CMS projects following best practices.

## ✨ Features

### 🔍 Code Validation
- Validate Payload CMS collections, fields, globals, and config files
- Get detailed feedback on syntax errors and best practices
- Receive actionable suggestions for improvements

### 📝 Code Generation
- Generate complete collection definitions with proper TypeScript types
- Create field definitions with validation and access control
- Scaffold entire Payload CMS projects with your chosen database

### 🗂️ File System Integration
- Read and write files in your Payload CMS projects
- Browse project structure and files
- Seamless integration with filesystem operations

### 🤝 Multi-Agent Collaboration
Works seamlessly with other Claude agents:
- **react-specialist**: For React component integration
- **nextjs-developer**: For Next.js + Payload integration
- **ui-designer**: For admin panel customization
- **frontend-developer**: For frontend implementation
- **gemini-cli-manager**: For CLI operations

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Install

```bash
# Clone or download the server
cd payload-cms-mcp-server

# Install dependencies
npm install

# Build the server
npm run build
```

## 🔧 Configuration

### For Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "payload-cms": {
      "command": "node",
      "args": ["/absolute/path/to/payload-cms-mcp-server/build/index.js"]
    }
  }
}
```

### For Other MCP Clients

Use stdio transport:

```typescript
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["/path/to/payload-cms-mcp-server/build/index.js"]
});
```

## 🎯 Usage Examples

### Validate Collection Code

```
Can you validate this Payload CMS collection code?

export const Posts = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    }
  ]
}
```

### Generate a New Collection

```
Generate a Payload CMS collection for a blog with:
- Title (required)
- Content (rich text)
- Author relationship
- Published date
- Include timestamps and versioning
```

### Scaffold a New Project

```
Scaffold a Payload CMS project called "e-commerce-platform" with:
- MongoDB database
- Authentication enabled
- Collections: products, categories, orders, customers
- TypeScript enabled
```

### Query Best Practices

```
What are the best practices for implementing access control in Payload CMS collections?
```

### Read/Write Project Files

```
Read the posts collection from my project at /Users/tony/projects/my-blog
```

```
Update the users collection in my project to add an email verification field
```

## 🛠️ Available Tools

### Validation Tools

#### `validate`
Validates Payload CMS code for syntax and best practices.

**Parameters:**
- `code` (string): The code to validate
- `fileType` (enum): "collection" | "field" | "global" | "config"

#### `query`
Query validation rules and best practices.

**Parameters:**
- `query` (string): Query string
- `fileType` (optional): Specific file type to query about

### Code Generation Tools

#### `generate_collection`
Generate a complete collection definition.

**Parameters:**
- `slug` (string): Collection slug
- `fields` (array, optional): Field definitions
- `auth` (boolean, optional): Enable authentication
- `timestamps` (boolean, optional): Include timestamps
- `admin` (object, optional): Admin configuration
- `hooks` (boolean, optional): Include hooks template
- `access` (boolean, optional): Include access control
- `versions` (boolean, optional): Enable versioning

#### `generate_field`
Generate a field definition.

**Parameters:**
- `name` (string): Field name
- `type` (string): Field type
- `required` (boolean, optional): Required field
- `unique` (boolean, optional): Unique constraint
- `localized` (boolean, optional): Localization support
- `access` (boolean, optional): Access control
- `admin` (object, optional): Admin configuration
- `validation` (boolean, optional): Validation rules
- `defaultValue` (any, optional): Default value

### Project Management Tools

#### `scaffold_project`
Scaffold a complete Payload CMS project.

**Parameters:**
- `projectName` (string): Project name
- `projectPath` (string): Path for project creation
- `description` (string, optional): Project description
- `database` (enum): "mongodb" | "postgres"
- `auth` (boolean, optional): Enable authentication
- `typescript` (boolean, optional): Use TypeScript
- `collections` (array, optional): Collection names

#### `read_project_file`
Read a file from a Payload project.

**Parameters:**
- `projectPath` (string): Path to project
- `filePath` (string): Relative file path

#### `write_project_file`
Write a file to a Payload project.

**Parameters:**
- `projectPath` (string): Path to project
- `filePath` (string): Relative file path
- `content` (string): File content

## 📚 Available Resources

### `payload://best-practices/{category}`
Access best practices for specific categories:
- `collections`
- `fields`
- `hooks`
- `access`

### `payload://field-types`
Get a list of all available Payload CMS field types.

### `payload://project/{projectPath}/files`
Browse files in a Payload CMS project.

## 💡 Available Prompts

### `review-collection`
Review a collection for best practices and improvements.

**Arguments:**
- `code`: Collection code to review

### `create-collection`
Guide to create a new collection with best practices.

**Arguments:**
- `collectionName`: Name of the collection
- `purpose`: Purpose of the collection

### `migrate-to-v3`
Help migrate code from Payload CMS 2.x to 3.0.

**Arguments:**
- `code`: Legacy code to migrate

## 🔗 Integration with Other Agents

### With react-specialist
```
@react-specialist Create a React component that displays posts from my Payload CMS collection
```

### With nextjs-developer
```
@nextjs-developer Set up a Next.js app with Payload CMS integration using the blog template
```

### With ui-designer
```
@ui-designer Design a custom admin dashboard for my Payload CMS e-commerce site
```

### With Vercel MCP
```
Deploy my Payload CMS project to Vercel with MongoDB Atlas
```

## 🎓 Payload CMS Best Practices

### Collections
- ✅ Always use TypeScript for type safety
- ✅ Use slug naming convention: lowercase with hyphens
- ✅ Include timestamps unless explicitly not needed
- ✅ Add `admin.useAsTitle` for better UX
- ✅ Implement proper access control
- ✅ Consider versioning for important content
- ✅ Use hooks for data transformation
- ✅ Add proper field validation

### Fields
- ✅ Use `required: true` for mandatory fields
- ✅ Add `admin.description` for field guidance
- ✅ Use `localized` for multi-language content
- ✅ Implement proper validation rules
- ✅ Use `index: true` for frequently queried fields
- ✅ Add `unique: true` where appropriate
- ✅ Consider `defaultValue` for better UX

### Hooks
- ✅ Use `beforeValidate` for data sanitization
- ✅ Use `afterRead` for data transformation
- ✅ Implement `beforeChange` for business logic
- ✅ Use `afterChange` for side effects
- ✅ Keep hooks pure and predictable
- ✅ Handle errors gracefully

### Access Control
- ✅ Default to secure (deny by default)
- ✅ Use field-level access when needed
- ✅ Implement role-based access control
- ✅ Consider read vs write permissions separately
- ✅ Test access rules thoroughly

## 📖 Field Types Reference

Payload CMS 3.0 supports these field types:

- **Text Fields**: `text`, `textarea`, `richText`, `code`, `json`
- **Number Fields**: `number`
- **Contact Fields**: `email`
- **Selection Fields**: `select`, `radio`, `checkbox`
- **Date/Time**: `date`
- **Files**: `upload`
- **Relationships**: `relationship`
- **Arrays**: `array`, `blocks`
- **Layout**: `group`, `tabs`, `row`, `collapsible`
- **Geolocation**: `point`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 🔗 Links

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Payload CMS 3.0 Migration Guide](https://payloadcms.com/docs/3.0/migration-guide)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## 🐛 Troubleshooting

### Server not connecting
1. Verify Node.js version (18+)
2. Check the build completed successfully
3. Verify the path in your MCP configuration is absolute
4. Check Claude Desktop logs

### Commands not working
1. Restart Claude Desktop after configuration changes
2. Verify the server appears in the 🔌 icon menu
3. Check server logs for errors

### File operations failing
1. Verify project paths are absolute
2. Check file permissions
3. Ensure the project structure is valid

## 📞 Support

For issues or questions:
1. Check the documentation above
2. Review Payload CMS docs
3. Check MCP documentation
4. Open an issue on GitHub

---

Built with ❤️ for the Payload CMS and MCP communities
