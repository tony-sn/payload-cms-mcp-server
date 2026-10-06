#!/usr/bin/env bash

# Universal Setup script for Payload CMS MCP Server
# Supports: Claude Code CLI, OpenAI Codex CLI, Antigravity CLI, Claude Desktop, Cursor

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
MCP_SERVER_PATH="${ROOT_DIR}/build/index.js"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🚀 Payload CMS MCP Server - Multi-CLI Setup${NC}"
echo "Server path: ${MCP_SERVER_PATH}"
echo ""

# Ensure server is built
check_build() {
  if [ ! -f "$MCP_SERVER_PATH" ]; then
    echo -e "${YELLOW}⚠️  MCP server not built yet. Building now...${NC}"
    (cd "$ROOT_DIR" && npm run build)
  fi
  echo -e "${GREEN}✅ MCP server built and ready${NC}"
}

# 1. Claude Code CLI Setup
setup_claude_code() {
  echo ""
  echo -e "${BLUE}📦 Configuring Claude Code CLI...${NC}"
  
  if command -v claude >/dev/null 2>&1; then
    echo "Running: claude mcp add payload-cms node \"$MCP_SERVER_PATH\""
    claude mcp add payload-cms node "$MCP_SERVER_PATH" 2>/dev/null || true
  fi

  GLOBAL_CLAUDE_DIR="$HOME/.claude"
  mkdir -p "$GLOBAL_CLAUDE_DIR"
  GLOBAL_MCP_CONFIG="$GLOBAL_CLAUDE_DIR/mcp.json"

  # If jq is available, update or merge; otherwise write/replace
  if [ -f "$GLOBAL_MCP_CONFIG" ] && command -v jq >/dev/null 2>&1; then
    cp "$GLOBAL_MCP_CONFIG" "$GLOBAL_MCP_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"
    jq --arg path "$MCP_SERVER_PATH" \
      '.mcpServers["payload-cms"] = {"command": "node", "args": [$path]}' \
      "$GLOBAL_MCP_CONFIG" > "${GLOBAL_MCP_CONFIG}.tmp" && mv "${GLOBAL_MCP_CONFIG}.tmp" "$GLOBAL_MCP_CONFIG"
  else
    cat > "$GLOBAL_MCP_CONFIG" <<EOF
{
  "mcpServers": {
    "payload-cms": {
      "command": "node",
      "args": ["$MCP_SERVER_PATH"]
    }
  }
}
EOF
  fi

  echo -e "${GREEN}✅ Claude Code configured at $GLOBAL_MCP_CONFIG${NC}"
}

# 2. OpenAI Codex CLI Setup
setup_codex() {
  echo ""
  echo -e "${BLUE}📦 Configuring OpenAI Codex CLI...${NC}"
  
  if command -v codex >/dev/null 2>&1; then
    echo "Running: codex mcp add payload-cms -- node \"$MCP_SERVER_PATH\""
    codex mcp add payload-cms -- node "$MCP_SERVER_PATH" 2>/dev/null || true
  fi

  CODEX_DIR="$HOME/.codex"
  CODEX_CONFIG="$CODEX_DIR/config.toml"
  mkdir -p "$CODEX_DIR"

  if [ -f "$CODEX_CONFIG" ]; then
    if ! grep -q "mcp_servers.payload-cms" "$CODEX_CONFIG"; then
      cat >> "$CODEX_CONFIG" <<EOF

[mcp_servers.payload-cms]
command = "node"
args = ["$MCP_SERVER_PATH"]
EOF
      echo -e "${GREEN}✅ Added payload-cms to $CODEX_CONFIG${NC}"
    else
      echo -e "${GREEN}✅ payload-cms already exists in $CODEX_CONFIG${NC}"
    fi
  else
    cat > "$CODEX_CONFIG" <<EOF
[mcp_servers.payload-cms]
command = "node"
args = ["$MCP_SERVER_PATH"]
EOF
    echo -e "${GREEN}✅ Created $CODEX_CONFIG${NC}"
  fi
}

# 3. Antigravity CLI Setup
setup_antigravity() {
  echo ""
  echo -e "${BLUE}📦 Configuring Antigravity CLI (AGY)...${NC}"

  AGY_DIR="$HOME/.gemini/config"
  mkdir -p "$AGY_DIR"
  AGY_CONFIG="$AGY_DIR/mcp_config.json"

  if [ -s "$AGY_CONFIG" ] && command -v jq >/dev/null 2>&1; then
    cp "$AGY_CONFIG" "$AGY_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"
    jq --arg path "$MCP_SERVER_PATH" \
      '.mcpServers["payload-cms"] = {"command": "node", "args": [$path]}' \
      "$AGY_CONFIG" > "${AGY_CONFIG}.tmp" && mv "${AGY_CONFIG}.tmp" "$AGY_CONFIG"
  else
    cat > "$AGY_CONFIG" <<EOF
{
  "mcpServers": {
    "payload-cms": {
      "command": "node",
      "args": ["$MCP_SERVER_PATH"]
    }
  }
}
EOF
  fi

  echo -e "${GREEN}✅ Antigravity CLI configured at $AGY_CONFIG${NC}"
}

# 4. Claude Desktop Setup
setup_claude_desktop() {
  echo ""
  echo -e "${BLUE}📦 Configuring Claude Desktop...${NC}"

  if [[ "$OSTYPE" == "darwin"* ]]; then
    DESKTOP_DIR="$HOME/Library/Application Support/Claude"
  else
    DESKTOP_DIR="${APPDATA:-$HOME/.config}/Claude"
  fi

  mkdir -p "$DESKTOP_DIR"
  DESKTOP_CONFIG="$DESKTOP_DIR/claude_desktop_config.json"

  if [ -f "$DESKTOP_CONFIG" ] && command -v jq >/dev/null 2>&1; then
    cp "$DESKTOP_CONFIG" "$DESKTOP_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"
    jq --arg path "$MCP_SERVER_PATH" \
      '.mcpServers["payload-cms"] = {"command": "node", "args": [$path]}' \
      "$DESKTOP_CONFIG" > "${DESKTOP_CONFIG}.tmp" && mv "${DESKTOP_CONFIG}.tmp" "$DESKTOP_CONFIG"
  else
    cat > "$DESKTOP_CONFIG" <<EOF
{
  "mcpServers": {
    "payload-cms": {
      "command": "node",
      "args": ["$MCP_SERVER_PATH"]
    }
  }
}
EOF
  fi

  echo -e "${GREEN}✅ Claude Desktop configured at $DESKTOP_CONFIG${NC}"
}

# 5. Cursor Setup
setup_cursor() {
  echo ""
  echo -e "${BLUE}📦 Configuring Cursor...${NC}"

  CURSOR_DIR=".cursor"
  mkdir -p "$CURSOR_DIR"
  CURSOR_CONFIG="$CURSOR_DIR/mcp.json"

  cat > "$CURSOR_CONFIG" <<EOF
{
  "mcpServers": {
    "payload-cms": {
      "command": "node",
      "args": ["$MCP_SERVER_PATH"]
    }
  }
}
EOF

  echo -e "${GREEN}✅ Project Cursor configured at $CURSOR_CONFIG${NC}"
}

show_instructions() {
  echo ""
  echo -e "${CYAN}🎉 Setup complete! You can now use Payload CMS MCP across your AI tools:${NC}"
  echo ""
  echo -e "${BLUE}Claude Code:${NC}       Restart Claude Code and ask: 'Show Payload CMS best practices' or 'Search Payload docs for Postgres'"
  echo -e "${BLUE}Codex CLI:${NC}         Run 'codex' and ask: 'Search Payload CMS docs for relationship fields'"
  echo -e "${BLUE}Antigravity CLI:${NC}   Run 'agy' and your agent will automatically have access to payload-cms tools"
  echo -e "${BLUE}Claude Desktop:${NC}    Restart Claude Desktop and check the 🔌 icon for 'payload-cms'"
  echo ""
}

main() {
  check_build

  # Handle command line flag arguments if provided
  if [ $# -gt 0 ]; then
    for arg in "$@"; do
      case "$arg" in
        --claude) setup_claude_code ;;
        --codex) setup_codex ;;
        --antigravity|--agy) setup_antigravity ;;
        --desktop) setup_claude_desktop ;;
        --cursor) setup_cursor ;;
        --all)
          setup_claude_code
          setup_codex
          setup_antigravity
          setup_claude_desktop
          setup_cursor
          ;;
        *)
          echo "Unknown flag: $arg"
          echo "Usage: $0 [--claude] [--codex] [--antigravity] [--desktop] [--cursor] [--all]"
          exit 1
          ;;
      esac
    done
    show_instructions
    exit 0
  fi

  echo "Select AI environment to configure:"
  echo "  1) Claude Code CLI"
  echo "  2) OpenAI Codex CLI"
  echo "  3) Antigravity CLI (AGY)"
  echo "  4) Claude Desktop"
  echo "  5) Cursor (project .cursor/mcp.json)"
  echo "  6) All of the above (Recommended)"
  echo ""
  read -p "Enter choice [1-6]: " choice

  case "$choice" in
    1) setup_claude_code ;;
    2) setup_codex ;;
    3) setup_antigravity ;;
    4) setup_claude_desktop ;;
    5) setup_cursor ;;
    6)
      setup_claude_code
      setup_codex
      setup_antigravity
      setup_claude_desktop
      setup_cursor
      ;;
    *)
      echo "Invalid choice. Exiting."
      exit 1
      ;;
  esac

  show_instructions
}

main "$@"
