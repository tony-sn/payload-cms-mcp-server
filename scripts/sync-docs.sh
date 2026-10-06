#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
DATA_DIR="${ROOT_DIR}/data"

mkdir -p "${DATA_DIR}"

echo "🔄 Syncing Payload CMS documentation..."
curl --fail --retry 3 --retry-connrefused --retry-delay 2 -sSL "https://payloadcms.com/llms.txt" -o "${DATA_DIR}/llms.txt"
curl --fail --retry 3 --retry-connrefused --retry-delay 2 -sSL "https://payloadcms.com/llms-full.txt" -o "${DATA_DIR}/llms-full.txt"

LLMS_SIZE=$(wc -c < "${DATA_DIR}/llms.txt" | tr -d ' ')
FULL_SIZE=$(wc -c < "${DATA_DIR}/llms-full.txt" | tr -d ' ')

echo "✅ Successfully synced Payload CMS documentation:"
echo "   - data/llms.txt (${LLMS_SIZE} bytes)"
echo "   - data/llms-full.txt (${FULL_SIZE} bytes)"
