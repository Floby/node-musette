#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

VERSION=$(cat ../package.json | jq -r .version)

echo Building flobyiv/musette:${VERSION}...
docker build -t flobyiv/musette:${VERSION} ../
