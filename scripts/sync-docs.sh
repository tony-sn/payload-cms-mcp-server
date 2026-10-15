#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
DATA_DIR="${ROOT_DIR}/data"
DOCS_VERSION="${PAYLOAD_DOCS_VERSION:-v3}"
DOCS_BASE_URL="https://payloadcms.com/docs/${DOCS_VERSION}"

if [[ "${DOCS_VERSION}" != "v3" && "${DOCS_VERSION}" != "v4" ]]; then
  echo "Unsupported Payload docs version: ${DOCS_VERSION}. Expected v3 or v4." >&2
  exit 1
fi

mkdir -p "${DATA_DIR}"

echo "🔄 Syncing Payload CMS ${DOCS_VERSION} documentation..."
curl --fail --retry 3 --retry-connrefused --retry-delay 2 -sSL "${DOCS_BASE_URL}/llms.txt" -o "${DATA_DIR}/llms.txt"
curl --fail --retry 3 --retry-connrefused --retry-delay 2 -sSL "${DOCS_BASE_URL}/llms-full.txt" -o "${DATA_DIR}/llms-full.txt"

LLMS_SIZE=$(wc -c < "${DATA_DIR}/llms.txt" | tr -d ' ')
FULL_SIZE=$(wc -c < "${DATA_DIR}/llms-full.txt" | tr -d ' ')

echo "✅ Successfully synced Payload CMS documentation:"
echo "   - data/llms.txt (${LLMS_SIZE} bytes)"
echo "   - data/llms-full.txt (${FULL_SIZE} bytes)"
