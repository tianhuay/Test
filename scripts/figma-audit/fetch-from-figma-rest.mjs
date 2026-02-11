#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const FIGMA_API_BASE = "https://api.figma.com/v1";

const HELP_TEXT = `
Figma REST Fetch Helper (MCP fallback)

Usage:
  node scripts/figma-audit/fetch-from-figma-rest.mjs --figma-link <url> [options]

Required:
  --figma-link <url>          Figma file/design URL with node-id query

Optional:
  --file-key <key>            Override parsed file key
  --node-id <id>              Override parsed node id (e.g. 5:1229 or 5-1229)
  --out-dir <path>            Output directory (default: inputs/figma)
  --prefix <name>             Output filename prefix (default: figma-<nodeId>)
  --token <token>             Figma personal access token
  --include-file              Also fetch minimal file metadata (depth=2)
  --help                      Print this help

Environment:
  FIGMA_ACCESS_TOKEN or FIGMA_TOKEN can be used instead of --token
`;

function parseArgs(argv) {
  const options = {
    outDir: path.resolve(process.cwd(), "inputs/figma"),
    includeFile: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "--help" || token === "-h") {
      options.help = true;
      continue;
    }

    if (token === "--include-file") {
      options.includeFile = true;
      continue;
    }

    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for argument: ${token}`);
    }

    switch (key) {
      case "figma-link":
        options.figmaLink = value;
        break;
      case "file-key":
        options.fileKey = value;
        break;
      case "node-id":
        options.nodeId = normalizeNodeId(value);
        break;
      case "out-dir":
        options.outDir = resolvePath(value);
        break;
      case "prefix":
        options.prefix = value;
        break;
      case "token":
        options.token = value;
        break;
      default:
        throw new Error(`Unknown argument: ${token}`);
    }
    i += 1;
  }

  return options;
}

function resolvePath(targetPath) {
  if (path.isAbsolute(targetPath)) {
    return targetPath;
  }
  return path.resolve(process.cwd(), targetPath);
}

function normalizeNodeId(input) {
  const raw = String(input ?? "").trim();
  if (!raw) {
    return raw;
  }
  if (raw.includes(":")) {
    return raw;
  }
  return raw.replace(/-/g, ":");
}

function parseFigmaLink(figmaLink) {
  const parsed = new URL(figmaLink);
  const pathSegments = parsed.pathname.split("/").filter(Boolean);
  const fileSegmentIndex = pathSegments.findIndex((entry) => entry === "file" || entry === "design");
  if (fileSegmentIndex < 0 || !pathSegments[fileSegmentIndex + 1]) {
    throw new Error("Could not parse file key from Figma link.");
  }

  const fileKey = pathSegments[fileSegmentIndex + 1];
  const rawNodeId = parsed.searchParams.get("node-id");
  const nodeId = rawNodeId ? normalizeNodeId(rawNodeId) : undefined;
  return { fileKey, nodeId };
}

async function ensureDirectory(directoryPath) {
  await fs.mkdir(directoryPath, { recursive: true });
}

async function requestFigmaJson({ endpoint, token }) {
  const response = await fetch(`${FIGMA_API_BASE}${endpoint}`, {
    method: "GET",
    headers: {
      "X-Figma-Token": token,
    },
  });

  if (!response.ok) {
    const bodyText = await response.text();
    const summary = bodyText.length > 500 ? `${bodyText.slice(0, 500)}...` : bodyText;
    throw new Error(`Figma API ${response.status} at ${endpoint}: ${summary}`);
  }

  return response.json();
}

function stableStringify(value) {
  return JSON.stringify(
    value,
    (_, nested) => {
      if (nested && typeof nested === "object" && !Array.isArray(nested)) {
        return Object.keys(nested)
          .sort()
          .reduce((acc, key) => {
            acc[key] = nested[key];
            return acc;
          }, {});
      }
      return nested;
    },
    2,
  );
}

function makeDefaultPrefix(nodeId, fileKey) {
  const token = nodeId ?? fileKey ?? "selection";
  return `figma-${token.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

async function tryFetchVariables(fileKey, token) {
  const candidates = [
    { key: "local", endpoint: `/files/${encodeURIComponent(fileKey)}/variables/local` },
    { key: "published", endpoint: `/files/${encodeURIComponent(fileKey)}/variables/published` },
    { key: "legacy", endpoint: `/files/${encodeURIComponent(fileKey)}/variables` },
  ];

  const responses = {};
  const endpointsUsed = [];

  for (const candidate of candidates) {
    try {
      const json = await requestFigmaJson({ endpoint: candidate.endpoint, token });
      responses[candidate.key] = json;
      endpointsUsed.push(candidate.endpoint);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!/ 404 | 403 | 400 /.test(` ${message} `)) {
        throw error;
      }
    }
  }

  if (endpointsUsed.length === 0) {
    return null;
  }

  return {
    endpoint: endpointsUsed.join(", "),
    json: {
      error: false,
      fileKey,
      fetchedAt: new Date().toISOString(),
      sources: responses,
    },
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(`${HELP_TEXT}\n`);
    return;
  }

  if (!options.figmaLink) {
    throw new Error("Missing required argument: --figma-link <url>");
  }

  const parsed = parseFigmaLink(options.figmaLink);
  const fileKey = options.fileKey ?? parsed.fileKey;
  const nodeId = options.nodeId ?? parsed.nodeId;
  if (!fileKey) {
    throw new Error("Unable to determine file key.");
  }
  if (!nodeId) {
    throw new Error("Unable to determine node-id. Add node-id to link or pass --node-id.");
  }

  const token =
    options.token ??
    process.env.FIGMA_ACCESS_TOKEN ??
    process.env.FIGMA_TOKEN;
  if (!token) {
    throw new Error(
      "Missing Figma token. Set FIGMA_ACCESS_TOKEN/FIGMA_TOKEN or pass --token.",
    );
  }

  await ensureDirectory(options.outDir);

  const prefix = options.prefix ?? makeDefaultPrefix(nodeId, fileKey);
  const selectionPath = path.join(options.outDir, `${prefix}-selection.json`);
  const variablesPath = path.join(options.outDir, `${prefix}-variables.json`);
  const filePath = path.join(options.outDir, `${prefix}-file.json`);

  const selectionPayload = await requestFigmaJson({
    endpoint: `/files/${encodeURIComponent(fileKey)}/nodes?ids=${encodeURIComponent(nodeId)}&depth=8`,
    token,
  });
  await fs.writeFile(selectionPath, `${stableStringify(selectionPayload)}\n`, "utf8");

  const variablesResult = await tryFetchVariables(fileKey, token);
  if (variablesResult) {
    await fs.writeFile(variablesPath, `${stableStringify(variablesResult.json)}\n`, "utf8");
  }

  if (options.includeFile) {
    const filePayload = await requestFigmaJson({
      endpoint: `/files/${encodeURIComponent(fileKey)}?depth=2`,
      token,
    });
    await fs.writeFile(filePath, `${stableStringify(filePayload)}\n`, "utf8");
  }

  process.stdout.write("Figma fetch complete.\n");
  process.stdout.write(`File key: ${fileKey}\n`);
  process.stdout.write(`Node id: ${nodeId}\n`);
  process.stdout.write(`Selection JSON: ${selectionPath}\n`);
  if (variablesResult) {
    process.stdout.write(`Variables JSON: ${variablesPath}\n`);
    process.stdout.write(`Variables endpoint: ${variablesResult.endpoint}\n`);
  } else {
    process.stdout.write("Variables JSON: not fetched (endpoint unavailable or unauthorized).\n");
  }
  if (options.includeFile) {
    process.stdout.write(`File JSON: ${filePath}\n`);
  }

  process.stdout.write("\nNext step:\n");
  if (variablesResult) {
    process.stdout.write(
      `npm run figma:audit -- --selection "${selectionPath}" --variables "${variablesPath}" --report-name "${prefix}"\n`,
    );
  } else {
    process.stdout.write(
      `npm run figma:audit -- --selection "${selectionPath}" --report-name "${prefix}"\n`,
    );
  }
}

main().catch((error) => {
  process.stderr.write(`Figma fetch failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
