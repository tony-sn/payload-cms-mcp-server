# ⚡ Quick Start Commands

Copy and paste these commands to get started quickly with your Payload CMS MCP Server.

## 🛠️ Installation

```bash
# Navigate to your MCP directory
cd /Users/tony/ghq/github.com/tony-sn/mcp/payload-cms

# Create the server directory
mkdir -p payload-cms-mcp-server
cd payload-cms-mcp-server

# Create source directory
mkdir -p src

# Copy the main server file to src/index.ts
# (Use the code from the first artifact)

# Copy package.json and tsconfig.json
# (Use the code from the respective artifacts)

# Install dependencies
npm install

# Build the server
npm run build

# Verify build succeeded
ls -la build/
```

## ⚙️ Claude Desktop Configuration

```bash
# macOS - Edit Claude Desktop config
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

Add this configuration:

```json
{
  "mcpServers": {
    "payload-cms": {
      "command": "node",
      "args": [
        "/Users/tony/ghq/github.com/tony-sn/mcp/payload-cms/payload-cms-mcp-server/build/index.js"
      ]
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/tony/ghq",
        "/Users/tony/projects"
      ]
    }
  }
}
```

## 🔄 Restart Claude Desktop

```bash
# Quit Claude Desktop completely
osascript -e 'quit app "Claude"'

# Wait a moment
sleep 2

# Reopen Claude Desktop
open -a Claude
```

## ✅ Verify Installation

Open Claude Desktop and try these commands:

### Test 1: Basic Connection
```
What field types are available in Payload CMS?
```

### Test 2: Generate Code
```
Generate a simple blog post collection with title and content
```

### Test 3: Validate Code
```
Validate this collection:

export const Posts = {
  slug: 'posts',
  fields: [
    { name: 'title', type: 'text', required: true }
  ]
}
```

## 🚀 Create Your First Project

```
Scaffold a Payload CMS project named "my-first-blog" with:
- MongoDB database
- Authentication enabled
- Collections: posts, categories, authors
- TypeScript enabled
- Create it at /Users/tony/projects/my-first-blog
```

Then in terminal:

```bash
cd /Users/tony/projects/my-first-blog
npm install

# Set up your database URL in .env
echo "DATABASE_URI=mongodb://localhost:27017/my-first-blog" > .env
echo "PAYLOAD_SECRET=$(openssl rand -base64 32)" >> .env

# Start the development server
npm run dev
```

Visit: http://localhost:3000/admin

## 📁 Project Structure Commands

```bash
# View the structure
cd payload-cms-mcp-server
tree -L 3

# Expected structure:
# .
# ├── src/
# │   └── index.ts
# ├── build/
# │   ├── index.js
# │   ├── index.d.ts
# │   └── index.js.map
# ├── node_modules/
# ├── package.json
# ├── tsconfig.json
# ├── README.md
# └── .gitignore
```

## 🔧 Development Commands

```bash
# Watch mode (rebuilds on changes)
npm run watch

# Clean build
rm -rf build && npm run build

# Check for errors
npm run build 2>&1 | grep -i error

# View logs (macOS)
tail -f ~/Library/Logs/Claude/mcp*.log
```

## 🧪 Quick Tests

### Test Resource Access
```
Show me the best practices for Payload CMS collections
```

### Test Tool Execution
```
Generate a products collection with name, price, and description fields
```

### Test File Operations (with filesystem MCP)
```
List the files in my Payload project at /Users/tony/projects/my-first-blog
```

### Test Multi-Agent Collaboration
```
@payload-cms Generate a posts collection

@react-specialist Create a React component to display these posts
```

## 🐛 Troubleshooting Commands

### Check if MCP server is running
```bash
# Look for the process
ps aux | grep payload-cms-mcp

# Check Claude logs
ls -lt ~/Library/Logs/Claude/ | head -5
cat ~/Library/Logs/Claude/mcp-server-payload-cms.log
```

### Rebuild server
```bash
cd /Users/tony/ghq/github.com/tony-sn/mcp/payload-cms/payload-cms-mcp-server
rm -rf build node_modules package-lock.json
npm install
npm run build
```

### Reset Claude Desktop config
```bash
# Backup current config
cp ~/Library/Application\ Support/Claude/claude_desktop_config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json.backup

# Edit config
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Restart Claude
osascript -e 'quit app "Claude"'
sleep 2
open -a Claude
```

### Test MCP server standalone
```bash
cd /Users/tony/ghq/github.com/tony-sn/mcp/payload-cms/payload-cms-mcp-server
node build/index.js

# Should output: "Payload CMS MCP Server running on stdio"
# Press Ctrl+C to exit
```

## 📚 Common Use Cases

### Create a blog
```
Create a complete blog setup at ~/projects/my-blog with:
- Posts collection (title, content, author, categories, tags)
- Authors collection (name, bio, avatar)
- Categories collection
- Comments with moderation
- MongoDB database
```

### Create an e-commerce site
```
Build an e-commerce platform at ~/projects/my-shop with:
- Products with variants and inventory
- Orders with line items
- Customers with addresses
- Reviews and ratings
- PostgreSQL database
```

### Migrate existing project
```
I have a Payload 2.x project at ~/projects/old-site
Help me migrate it to Payload 3.0
```

### Review and improve code
```
Read the collections from ~/projects/my-site
Review them for security issues and best practices
Suggest improvements
```

## 🔗 Integration Examples

### With Vercel
```
1. @payload-cms Create a blog project at ~/projects/vercel-blog
2. @vercel Deploy this project to Vercel with MongoDB Atlas
```

### With Next.js
```
1. @payload-cms Generate a products collection
2. @nextjs-developer Create Next.js app with API routes for these products
3. @frontend-developer Build the product listing page
```

### With React
```
1. @payload-cms Create a posts collection
2. @react-specialist Build a blog component using the Payload REST API
3. @ui-designer Style the blog with a modern design
```

## 📖 Documentation Commands

### View all available tools
```
What tools are available in the Payload CMS MCP server?
```

### Get help with a specific feature
```
How do I implement access control in Payload CMS?
```

### Learn about field types
```
Explain all the field types in Payload CMS with examples
```

## 🎯 Pro Tips

### Use specific paths
```
✅ Good: "at /Users/tony/projects/my-blog"
❌ Bad: "in my blog folder"
```

### Be detailed in requirements
```
✅ Good: "with title (required), content (richText), and author (relationship)"
❌ Bad: "with some blog fields"
```

### Combine multiple agents
```
✅ Good: "@payload-cms ... then @nextjs-developer ..."
❌ Bad: Do everything manually
```

### Review before writing
```
✅ Good: "Generate and show me, then I'll tell you to write it"
❌ Bad: Immediately write without review
```

## 🎉 Success Checklist

- [ ] MCP server built successfully
- [ ] Claude Desktop configured
- [ ] Server appears in 🔌 menu
- [ ] Basic commands work
- [ ] Can generate collections
- [ ] Can validate code
- [ ] Can scaffold projects
- [ ] File operations work (with filesystem MCP)
- [ ] Multi-agent collaboration works

## 📞 Need Help?

### Check documentation
```
Open the README.md in the payload-cms-mcp-server directory
```

### View logs
```bash
tail -f ~/Library/Logs/Claude/mcp*.log
```

### Test server directly
```bash
cd /Users/tony/ghq/github.com/tony-sn/mcp/payload-cms/payload-cms-mcp-server
node build/index.js
# Should run without errors
```

---

## 🚀 You're Ready!

Start building amazing Payload CMS projects with AI assistance!

**First project suggestion:**
```
Create a personal blog at ~/projects/my-blog with posts, categories, and an about page. Use MongoDB and include authentication.
```

Happy coding! 🎉
