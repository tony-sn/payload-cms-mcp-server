#!/bin/bash

# Setup script for Payload CMS MCP with Claude Code
# This script sets up both global and local configurations

set -e

echo "🚀 Setting up Payload CMS MCP for Claude Code"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MCP_SERVER_PATH="${SCRIPT_DIR}/build/index.js"
GLOBAL_CLAUDE_DIR="$HOME/.claude"
GLOBAL_MCP_CONFIG="$GLOBAL_CLAUDE_DIR/mcp.json"
LOCAL_CLAUDE_DIR=".claude"
LOCAL_MCP_CONFIG="$LOCAL_CLAUDE_DIR/mcp.json"
LOCAL_COMMANDS_CONFIG="$LOCAL_CLAUDE_DIR/commands.json"

# Function to check if MCP server is built
check_mcp_server() {
	if [ ! -f "$MCP_SERVER_PATH" ]; then
		echo -e "${YELLOW}⚠️  MCP server not found at $MCP_SERVER_PATH${NC}"
		echo "Please build it first:"
		echo "  cd /Users/tony/ghq/github.com/tony-sn/mcp/payload-cms/payload-cms-mcp-server"
		echo "  npm run build"
		exit 1
	fi
	echo -e "${GREEN}✅ MCP server found${NC}"
}

# Function to setup global configuration
setup_global() {
	echo ""
	echo -e "${BLUE}📦 Setting up global configuration${NC}"

	# Create directory if it doesn't exist
	mkdir -p "$GLOBAL_CLAUDE_DIR"

	# Backup existing config
	if [ -f "$GLOBAL_MCP_CONFIG" ]; then
		backup_file="$GLOBAL_MCP_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"
		cp "$GLOBAL_MCP_CONFIG" "$backup_file"
		echo -e "${YELLOW}📋 Backed up existing config to: $backup_file${NC}"
	fi

	# Create config
	cat >"$GLOBAL_MCP_CONFIG" <<EOF
{
  "mcpServers": {
    "payload-cms": {
      "command": "node",
      "args": [
        "$MCP_SERVER_PATH"
      ],
      "env": {}
    }
  }
}
EOF

	echo -e "${GREEN}✅ Global configuration created at: $GLOBAL_MCP_CONFIG${NC}"
}

# Function to setup local configuration
setup_local() {
	echo ""
	echo -e "${BLUE}📦 Setting up local project configuration${NC}"

	# Create directory if it doesn't exist
	mkdir -p "$LOCAL_CLAUDE_DIR"

	# Create MCP config
	cat >"$LOCAL_MCP_CONFIG" <<EOF
{
  "mcpServers": {
    "payload-cms": {
      "command": "node",
      "args": [
        "$MCP_SERVER_PATH"
      ],
      "env": {
        "PROJECT_ROOT": "."
      }
    }
  }
}
EOF

	echo -e "${GREEN}✅ Local MCP configuration created at: $LOCAL_MCP_CONFIG${NC}"

	# Create commands config
	cat >"$LOCAL_COMMANDS_CONFIG" <<'EOF'
{
  "commands": [
    {
      "name": "payload-new-collection",
      "description": "Generate a new Payload CMS collection",
      "prompt": "Use the Payload CMS MCP server to generate a new collection. Ask me for: slug, fields, and any special requirements."
    },
    {
      "name": "payload-validate",
      "description": "Validate Payload CMS code",
      "prompt": "Use the Payload CMS MCP server to validate the Payload CMS code I provide. Give detailed feedback."
    },
    {
      "name": "payload-scaffold",
      "description": "Scaffold a new Payload CMS project",
      "prompt": "Use the Payload CMS MCP server to scaffold a new Payload CMS project. Ask me for: project name, database type, and collections needed."
    },
    {
      "name": "payload-best-practices",
      "description": "Show Payload CMS best practices",
      "prompt": "Use the Payload CMS MCP server to show best practices for Payload CMS. Ask me which category: collections, fields, hooks, or access."
    },
    {
      "name": "payload-field-types",
      "description": "List all available Payload CMS field types",
      "prompt": "Use the Payload CMS MCP server to list all available field types in Payload CMS 3.0 with descriptions."
    },
    {
      "name": "payload-review",
      "description": "Review a Payload CMS collection",
      "prompt": "Use the Payload CMS MCP server to review a Payload CMS collection for best practices, security, and performance. Ask me for the code or file path."
    }
  ]
}
EOF

	echo -e "${GREEN}✅ Local commands configuration created at: $LOCAL_COMMANDS_CONFIG${NC}"
}

# Function to display usage instructions
show_instructions() {
	echo ""
	echo -e "${BLUE}📖 Usage Instructions${NC}"
	echo ""
	echo "In Claude Code, you can now use these slash commands:"
	echo ""
	echo "  /payload-new-collection    - Generate a new collection"
	echo "  /payload-validate          - Validate Payload code"
	echo "  /payload-scaffold          - Scaffold a project"
	echo "  /payload-best-practices    - Show best practices"
	echo "  /payload-field-types       - List field types"
	echo "  /payload-review            - Review collection code"
	echo ""
	echo "Or use the MCP tools directly:"
	echo ""
	echo "  Use the Payload CMS MCP server to generate a blog collection"
	echo "  Validate this Payload code: [paste code]"
	echo "  Show me Payload CMS best practices for access control"
	echo ""
}

# Main execution
main() {
	check_mcp_server

	echo ""
	echo "Choose setup type:"
	echo "  1) Global (available in all projects)"
	echo "  2) Local (available in current project only)"
	echo "  3) Both"
	echo ""
	read -p "Enter choice [1-3]: " choice

	case $choice in
	1)
		setup_global
		;;
	2)
		setup_local
		;;
	3)
		setup_global
		setup_local
		;;
	*)
		echo "Invalid choice. Exiting."
		exit 1
		;;
	esac

	show_instructions

	echo ""
	echo -e "${GREEN}🎉 Setup complete!${NC}"
	echo ""
	echo "Next steps:"
	echo "  1. Restart Claude Code if it's running"
	echo "  2. Type / in Claude Code to see available commands"
	echo "  3. Try: /payload-field-types"
	echo ""
}

# Run main function
main
