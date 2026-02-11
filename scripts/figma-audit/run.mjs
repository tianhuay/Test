#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const DEFAULT_RULES_PATH = path.resolve(
  process.cwd(),
  "skills/figma-design-audit/rules/default-rules.json",
);
const DEFAULT_OUTPUT_DIR = path.resolve(process.cwd(), "reports/figma-audit");
const DEFAULT_MODEL = "gemini-2.5-flash";

const DEFAULT_SEVERITY = {
  missing_variable_reference: "high",
  unknown_variable_reference: "high",
  spacing_off_scale: "medium",
  radius_off_scale: "medium",
  color_off_brand: "high",
  typography_family_violation: "medium",
  typography_weight_violation: "medium",
  typography_scale_violation: "medium",
  layout_off_grid: "low",
};

const SEVERITY_ORDER = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const PROPERTY_KEYWORDS = {
  color: ["color", "fill", "stroke", "background"],
  spacing: ["spacing", "padding", "margin", "gap", "gutter", "inset"],
  radius: ["radius", "corner"],
  typography: ["font", "lineheight", "letterspacing", "text", "typography"],
};

const HELP_TEXT = `
Figma Design Audit CLI

Usage:
  node scripts/figma-audit/run.mjs --selection <path> [options]

Required:
  --selection <path>      JSON or pasted MCP output for design selection/context

Optional:
  --variables <path>      JSON or pasted MCP output for variable definitions
  --rules <path>          Rules JSON (default: skills/figma-design-audit/rules/default-rules.json)
  --output-dir <path>     Output directory for report files (default: reports/figma-audit)
  --report-name <name>    Report filename prefix (default: derived from selection filename)
  --model <name>          Gemini model for AI summary (default: gemini-2.5-flash)
  --ai                    Force-enable AI summary generation (default: enabled)
  --no-ai                 Disable AI summary generation
  --max-ai-violations <n> Max violations to send to AI model (default: 100)
  --help                  Print this help

Environment:
  GEMINI_API_KEY or API_KEY must be set for AI summaries.
`;

function parseArgs(argv) {
  const options = {
    ai: true,
    rulesPath: DEFAULT_RULES_PATH,
    outputDir: DEFAULT_OUTPUT_DIR,
    model: DEFAULT_MODEL,
    maxAiViolations: 100,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "--help" || token === "-h") {
      options.help = true;
      continue;
    }

    if (token === "--ai") {
      options.ai = true;
      continue;
    }

    if (token === "--no-ai") {
      options.ai = false;
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
      case "selection":
        options.selectionPath = resolvePath(value);
        break;
      case "variables":
        options.variablesPath = resolvePath(value);
        break;
      case "rules":
        options.rulesPath = resolvePath(value);
        break;
      case "output-dir":
        options.outputDir = resolvePath(value);
        break;
      case "report-name":
        options.reportName = value;
        break;
      case "model":
        options.model = value;
        break;
      case "max-ai-violations":
        options.maxAiViolations = Number.parseInt(value, 10);
        if (!Number.isFinite(options.maxAiViolations) || options.maxAiViolations <= 0) {
          throw new Error(`Invalid --max-ai-violations value: ${value}`);
        }
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

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function asString(value) {
  return typeof value === "string" ? value : undefined;
}

function asNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function normalizeHex(color) {
  if (!color || typeof color !== "string") {
    return undefined;
  }

  const trimmed = color.trim();
  if (!trimmed) {
    return undefined;
  }

  const hexMatch = trimmed.match(/^#([0-9a-fA-F]{3,8})$/);
  if (hexMatch) {
    const raw = hexMatch[1];
    if (raw.length === 3) {
      return `#${raw
        .split("")
        .map((char) => `${char}${char}`)
        .join("")
        .toUpperCase()}`;
    }
    if (raw.length === 4) {
      return `#${raw
        .split("")
        .map((char) => `${char}${char}`)
        .join("")
        .toUpperCase()}`;
    }
    if (raw.length === 6 || raw.length === 8) {
      return `#${raw.toUpperCase()}`;
    }
    return undefined;
  }

  const rgbMatch = trimmed.match(
    /^rgba?\(\s*([0-9.]+)\s*[, ]\s*([0-9.]+)\s*[, ]\s*([0-9.]+)(?:\s*[,/]\s*([0-9.]+))?\s*\)$/i,
  );
  if (rgbMatch) {
    const r = Number.parseFloat(rgbMatch[1]);
    const g = Number.parseFloat(rgbMatch[2]);
    const b = Number.parseFloat(rgbMatch[3]);
    const alpha = rgbMatch[4] === undefined ? 1 : Number.parseFloat(rgbMatch[4]);
    if (![r, g, b, alpha].every(Number.isFinite)) {
      return undefined;
    }
    return rgbaToHex(r, g, b, alpha);
  }

  return undefined;
}

function rgbaToHex(r, g, b, alpha = 1) {
  const toByte = (channel) => {
    const clamped = Math.max(0, Math.min(255, Math.round(channel)));
    return clamped.toString(16).padStart(2, "0").toUpperCase();
  };
  const rgb = `#${toByte(r)}${toByte(g)}${toByte(b)}`;

  if (alpha === undefined || alpha >= 1) {
    return rgb;
  }
  const alphaByte = toByte(alpha * 255);
  return `${rgb}${alphaByte}`;
}

function colorObjectToHex(colorObject) {
  if (!isObject(colorObject)) {
    return undefined;
  }
  const rValue = asNumber(colorObject.r);
  const gValue = asNumber(colorObject.g);
  const bValue = asNumber(colorObject.b);
  if (rValue === undefined || gValue === undefined || bValue === undefined) {
    return undefined;
  }

  const alpha = asNumber(colorObject.a) ?? 1;
  const convert = (value) => (value <= 1 ? value * 255 : value);
  return rgbaToHex(convert(rValue), convert(gValue), convert(bValue), alpha);
}

function stableStringify(value) {
  return JSON.stringify(
    value,
    (_, nested) => {
      if (isObject(nested)) {
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

function parseLooseJson(rawText) {
  const raw = rawText.trim();
  if (!raw) {
    throw new Error("Input file is empty.");
  }

  const direct = tryParseJson(raw);
  if (direct.ok) {
    return direct.value;
  }

  const fencedMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch) {
    const fenced = tryParseJson(fencedMatch[1].trim());
    if (fenced.ok) {
      return fenced.value;
    }
  }

  const curlyStart = raw.indexOf("{");
  const curlyEnd = raw.lastIndexOf("}");
  if (curlyStart >= 0 && curlyEnd > curlyStart) {
    const attempt = tryParseJson(raw.slice(curlyStart, curlyEnd + 1));
    if (attempt.ok) {
      return attempt.value;
    }
  }

  const arrayStart = raw.indexOf("[");
  const arrayEnd = raw.lastIndexOf("]");
  if (arrayStart >= 0 && arrayEnd > arrayStart) {
    const attempt = tryParseJson(raw.slice(arrayStart, arrayEnd + 1));
    if (attempt.ok) {
      return attempt.value;
    }
  }

  throw new Error("Unable to parse JSON content from file.");
}

function tryParseJson(candidate) {
  try {
    return { ok: true, value: JSON.parse(candidate) };
  } catch {
    return { ok: false };
  }
}

async function readJsonInput(filePath) {
  const content = await fs.readFile(filePath, "utf8");
  return parseLooseJson(content);
}

function inferTokenCategory(variable) {
  const name = (variable.name || "").toLowerCase();
  const resolvedType = (variable.resolvedType || "").toLowerCase();

  if (resolvedType.includes("color") || name.includes("color") || name.includes("brand")) {
    return "color";
  }
  if (
    name.includes("spacing") ||
    name.includes("space/") ||
    name.includes("padding") ||
    name.includes("margin") ||
    name.includes("gap")
  ) {
    return "spacing";
  }
  if (name.includes("radius") || name.includes("corner")) {
    return "radius";
  }
  if (
    name.includes("font") ||
    name.includes("typography") ||
    name.includes("line-height") ||
    name.includes("letter-spacing")
  ) {
    return "typography";
  }
  return "other";
}

function variableValueFromObject(variableObject) {
  if (!isObject(variableObject)) {
    return undefined;
  }

  if ("value" in variableObject) {
    return variableObject.value;
  }
  if ("resolvedValue" in variableObject) {
    return variableObject.resolvedValue;
  }
  if (isObject(variableObject.valuesByMode)) {
    const modeValues = Object.values(variableObject.valuesByMode);
    if (modeValues.length > 0) {
      return modeValues[0];
    }
  }
  if (Array.isArray(variableObject.modes) && variableObject.modes.length > 0) {
    const firstMode = variableObject.modes[0];
    if (isObject(firstMode)) {
      if ("value" in firstMode) {
        return firstMode.value;
      }
      if ("resolvedValue" in firstMode) {
        return firstMode.resolvedValue;
      }
    }
  }
  return undefined;
}

function normalizeVariableValue(rawValue) {
  if (typeof rawValue === "string") {
    const hex = normalizeHex(rawValue);
    return hex ?? rawValue;
  }
  if (typeof rawValue === "number" || typeof rawValue === "boolean") {
    return rawValue;
  }
  if (isObject(rawValue)) {
    const asHex = colorObjectToHex(rawValue);
    if (asHex) {
      return asHex;
    }
    return rawValue;
  }
  return rawValue;
}

function collectVariables(payload) {
  const variables = [];
  const seenObjects = new WeakSet();
  const dedupe = new Set();

  const walk = (value, keyPath = []) => {
    if (value === null || value === undefined) {
      return;
    }
    if (typeof value !== "object") {
      return;
    }
    if (seenObjects.has(value)) {
      return;
    }
    seenObjects.add(value);

    if (Array.isArray(value)) {
      value.forEach((entry, index) => walk(entry, keyPath.concat(String(index))));
      return;
    }

    const id = asString(value.id ?? value.variableId ?? value.key);
    const name = asString(value.name ?? value.variableName);
    const resolvedType = asString(value.resolvedType ?? value.valueType ?? value.type);
    const joinedPath = keyPath.join(".").toLowerCase();
    const hasVariableMarker =
      "valuesByMode" in value ||
      "resolvedType" in value ||
      "variableCollectionId" in value ||
      "scopes" in value ||
      "codeSyntax" in value;
    const isLikelyTokenContext = /(variable|token|style)/i.test(joinedPath);
    const extractedValue = variableValueFromObject(value);

    if ((id || name) && (hasVariableMarker || isLikelyTokenContext) && extractedValue !== undefined) {
      const normalizedValue = normalizeVariableValue(extractedValue);
      const dedupeKey = `${id ?? ""}|${name ?? ""}|${stableStringify(normalizedValue)}`;
      if (!dedupe.has(dedupeKey)) {
        dedupe.add(dedupeKey);
        variables.push({
          id,
          name,
          resolvedType,
          value: normalizedValue,
          rawValue: extractedValue,
        });
      }
    }

    Object.entries(value).forEach(([key, nested]) => {
      walk(nested, keyPath.concat(key));
    });
  };

  walk(payload);

  return variables.map((variable) => ({
    ...variable,
    category: inferTokenCategory(variable),
  }));
}

function buildVariableIndex(variables) {
  const byId = new Map();
  const byName = new Map();

  variables.forEach((variable) => {
    if (variable.id) {
      byId.set(variable.id, variable);
    }
    if (variable.name) {
      byName.set(variable.name.toLowerCase(), variable);
    }
  });

  return { byId, byName };
}

function isNodeLike(entry) {
  if (!isObject(entry)) {
    return false;
  }
  const hasType = typeof entry.type === "string";
  const hasId = typeof entry.id === "string" || typeof entry.nodeId === "string";
  const hasName = typeof entry.name === "string";
  const hasChildren = Array.isArray(entry.children);
  const hasDesignProperties =
    "fills" in entry || "strokes" in entry || "layoutMode" in entry || "boundVariables" in entry;
  return (hasType && (hasId || hasName || hasDesignProperties)) || (hasChildren && (hasId || hasName));
}

function collectNodes(payload) {
  const nodes = [];
  const seenObjects = new WeakSet();
  const dedupe = new Set();

  const walk = (value, currentPath = "") => {
    if (value === null || value === undefined) {
      return;
    }
    if (typeof value !== "object") {
      return;
    }
    if (seenObjects.has(value)) {
      return;
    }
    seenObjects.add(value);

    if (Array.isArray(value)) {
      value.forEach((entry) => walk(entry, currentPath));
      return;
    }

    let nextPath = currentPath;
    if (isNodeLike(value)) {
      const id = asString(value.id ?? value.nodeId ?? value.key) ?? "";
      const type = asString(value.type) ?? "UNKNOWN";
      const name = asString(value.name) ?? type;
      nextPath = currentPath ? `${currentPath} > ${name}` : name;
      const nodeKey = `${id}|${nextPath}`;
      if (!dedupe.has(nodeKey)) {
        dedupe.add(nodeKey);
        nodes.push({
          id: id || nextPath,
          type,
          name,
          path: nextPath,
          raw: value,
        });
      }
    }

    Object.values(value).forEach((nested) => walk(nested, nextPath));
  };

  walk(payload);
  return nodes;
}

function normalizeVariableRefs(value) {
  if (value === null || value === undefined) {
    return [];
  }
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap((entry) => normalizeVariableRefs(entry));
  }
  if (isObject(value)) {
    if (typeof value.id === "string") {
      return [value.id];
    }
    if (typeof value.variableId === "string") {
      return [value.variableId];
    }
    if (typeof value.key === "string") {
      return [value.key];
    }
    return Object.values(value).flatMap((entry) => normalizeVariableRefs(entry));
  }
  return [];
}

function extractBoundVariables(nodeRaw) {
  const entries = [];
  const seenObjects = new WeakSet();

  const walk = (value, keyPath = "") => {
    if (value === null || value === undefined) {
      return;
    }
    if (typeof value !== "object") {
      return;
    }
    if (seenObjects.has(value)) {
      return;
    }
    seenObjects.add(value);

    if (Array.isArray(value)) {
      value.forEach((entry, index) => walk(entry, keyPath ? `${keyPath}.${index}` : `${index}`));
      return;
    }

    Object.entries(value).forEach(([key, nested]) => {
      if (key === "children") {
        return;
      }
      const nextPath = keyPath ? `${keyPath}.${key}` : key;
      if (key === "boundVariables" && isObject(nested)) {
        Object.entries(nested).forEach(([property, reference]) => {
          const variableIds = [...new Set(normalizeVariableRefs(reference))];
          entries.push({
            propertyPath: keyPath ? `${keyPath}.${property}` : property,
            variableIds,
          });
        });
      } else {
        walk(nested, nextPath);
      }
    });
  };

  walk(nodeRaw);
  return entries;
}

function extractNumericProperties(rawNode, keyPattern) {
  const results = [];
  const seenObjects = new WeakSet();
  const dedupe = new Set();

  const walk = (value, keyPath = "") => {
    if (value === null || value === undefined) {
      return;
    }
    if (typeof value !== "object") {
      return;
    }
    if (seenObjects.has(value)) {
      return;
    }
    seenObjects.add(value);

    if (Array.isArray(value)) {
      value.forEach((entry, index) => walk(entry, keyPath ? `${keyPath}.${index}` : `${index}`));
      return;
    }

    Object.entries(value).forEach(([key, nested]) => {
      if (key === "children") {
        return;
      }
      const nextPath = keyPath ? `${keyPath}.${key}` : key;
      if (typeof nested === "number" && Number.isFinite(nested) && keyPattern.test(key)) {
        const dedupeKey = `${nextPath}|${nested}`;
        if (!dedupe.has(dedupeKey)) {
          dedupe.add(dedupeKey);
          results.push({
            propertyPath: nextPath,
            value: nested,
          });
        }
      } else {
        walk(nested, nextPath);
      }
    });
  };

  walk(rawNode);
  return results;
}

function extractColors(rawNode) {
  const colors = [];
  const seenObjects = new WeakSet();
  const dedupe = new Set();

  const pushColor = (propertyPath, rawValue) => {
    let normalized;
    if (typeof rawValue === "string") {
      normalized = normalizeHex(rawValue);
    } else if (isObject(rawValue)) {
      normalized = colorObjectToHex(rawValue);
    }

    if (!normalized) {
      return;
    }
    const key = `${propertyPath}|${normalized}`;
    if (!dedupe.has(key)) {
      dedupe.add(key);
      colors.push({
        propertyPath,
        value: normalized,
      });
    }
  };

  const walk = (value, keyPath = "") => {
    if (value === null || value === undefined) {
      return;
    }
    if (typeof value !== "object") {
      return;
    }
    if (seenObjects.has(value)) {
      return;
    }
    seenObjects.add(value);

    if (Array.isArray(value)) {
      value.forEach((entry, index) => walk(entry, keyPath ? `${keyPath}.${index}` : `${index}`));
      return;
    }

    if (asNumber(value.r) !== undefined && asNumber(value.g) !== undefined && asNumber(value.b) !== undefined) {
      pushColor(keyPath || "color", value);
    }

    Object.entries(value).forEach(([key, nested]) => {
      if (key === "children") {
        return;
      }
      const nextPath = keyPath ? `${keyPath}.${key}` : key;
      const lowerKey = key.toLowerCase();

      if (/(color|background)/i.test(lowerKey)) {
        pushColor(nextPath, nested);
      }

      if (Array.isArray(nested) && /(fills|strokes|backgrounds)/i.test(lowerKey)) {
        nested.forEach((paint, index) => {
          if (isObject(paint) && paint.color) {
            pushColor(`${nextPath}.${index}.color`, paint.color);
          }
        });
      }

      walk(nested, nextPath);
    });
  };

  walk(rawNode);
  return colors;
}

function extractTypography(rawNode) {
  const typography = [];
  const seenObjects = new WeakSet();
  const dedupe = new Set();

  const readLineHeight = (objectValue) => {
    if (!isObject(objectValue)) {
      return undefined;
    }
    const direct = asNumber(objectValue.lineHeightPx ?? objectValue.lineHeight ?? objectValue.lineHeightValue);
    if (direct !== undefined) {
      return direct;
    }
    if (isObject(objectValue.lineHeight)) {
      return asNumber(objectValue.lineHeight.value);
    }
    return undefined;
  };

  const walk = (value, keyPath = "") => {
    if (value === null || value === undefined) {
      return;
    }
    if (typeof value !== "object") {
      return;
    }
    if (seenObjects.has(value)) {
      return;
    }
    seenObjects.add(value);

    if (Array.isArray(value)) {
      value.forEach((entry, index) => walk(entry, keyPath ? `${keyPath}.${index}` : `${index}`));
      return;
    }

    const fontFamily = asString(value.fontFamily);
    const fontSize = asNumber(value.fontSize);
    const fontWeight = asNumber(value.fontWeight);
    const lineHeight = readLineHeight(value);
    const letterSpacing = asNumber(value.letterSpacing);

    if (
      fontFamily !== undefined ||
      fontSize !== undefined ||
      fontWeight !== undefined ||
      lineHeight !== undefined ||
      letterSpacing !== undefined
    ) {
      const entry = {
        propertyPath: keyPath || "typography",
        fontFamily,
        fontSize,
        fontWeight,
        lineHeight,
        letterSpacing,
      };
      const dedupeKey = stableStringify(entry);
      if (!dedupe.has(dedupeKey)) {
        dedupe.add(dedupeKey);
        typography.push(entry);
      }
    }

    Object.entries(value).forEach(([key, nested]) => {
      if (key === "children") {
        return;
      }
      const nextPath = keyPath ? `${keyPath}.${key}` : key;
      walk(nested, nextPath);
    });
  };

  walk(rawNode);
  return typography;
}

function extractBounds(rawNode) {
  const bounds = [];
  const seenObjects = new WeakSet();

  const pushBounds = (propertyPath, candidate) => {
    if (!isObject(candidate)) {
      return;
    }
    const x = asNumber(candidate.x);
    const y = asNumber(candidate.y);
    const width = asNumber(candidate.width);
    const height = asNumber(candidate.height);
    if ([x, y, width, height].every((entry) => entry !== undefined)) {
      bounds.push({
        propertyPath,
        x,
        y,
        width,
        height,
      });
    }
  };

  const walk = (value, keyPath = "") => {
    if (value === null || value === undefined) {
      return;
    }
    if (typeof value !== "object") {
      return;
    }
    if (seenObjects.has(value)) {
      return;
    }
    seenObjects.add(value);

    if (Array.isArray(value)) {
      value.forEach((entry, index) => walk(entry, keyPath ? `${keyPath}.${index}` : `${index}`));
      return;
    }

    pushBounds(keyPath || "bounds", value);

    Object.entries(value).forEach(([key, nested]) => {
      if (key === "children") {
        return;
      }
      const nextPath = keyPath ? `${keyPath}.${key}` : key;
      walk(nested, nextPath);
    });
  };

  walk(rawNode);
  return bounds;
}

function inferJourney(nodePath) {
  if (!nodePath) {
    return "unknown";
  }
  const [firstSegment] = nodePath.split(" > ");
  return firstSegment || "unknown";
}

function findVariableByRef(variableRef, variableIndex) {
  if (!variableRef) {
    return undefined;
  }
  return variableIndex.byId.get(variableRef) ?? variableIndex.byName.get(variableRef.toLowerCase());
}

function hasVariableReference(boundEntries, propertyType, propertyPath, variableIndex) {
  const keywords = PROPERTY_KEYWORDS[propertyType] ?? [];
  const normalizedPath = propertyPath.toLowerCase();

  return boundEntries.some((entry) => {
    if (!Array.isArray(entry.variableIds) || entry.variableIds.length === 0) {
      return false;
    }

    const lowerBoundPath = (entry.propertyPath || "").toLowerCase();
    const keywordMatch =
      keywords.some((keyword) => normalizedPath.includes(keyword)) ||
      keywords.some((keyword) => lowerBoundPath.includes(keyword));
    if (!keywordMatch) {
      return false;
    }

    return entry.variableIds.some((variableId) => {
      const variable = findVariableByRef(variableId, variableIndex);
      if (!variable) {
        return true;
      }
      return variable.category === propertyType || variable.category === "other";
    });
  });
}

function isOnScale(value, scale, tolerance = 0.01) {
  if (!Array.isArray(scale) || scale.length === 0) {
    return true;
  }
  return scale.some((step) => Math.abs(step - value) <= tolerance);
}

function nearestScaleValue(value, scale) {
  if (!Array.isArray(scale) || scale.length === 0) {
    return undefined;
  }
  return scale.reduce((nearest, candidate) => {
    if (nearest === undefined) {
      return candidate;
    }
    return Math.abs(candidate - value) < Math.abs(nearest - value) ? candidate : nearest;
  }, undefined);
}

function buildAllowedColorSet(rules, variables) {
  const allowed = new Set();
  const configured = Array.isArray(rules?.color?.allowedHex) ? rules.color.allowedHex : [];
  configured.forEach((hex) => {
    const normalized = normalizeHex(hex);
    if (normalized) {
      allowed.add(normalized);
    }
  });

  if (rules?.color?.allowTokenValues) {
    variables.forEach((variable) => {
      if (variable.category !== "color") {
        return;
      }
      const normalized = typeof variable.value === "string" ? normalizeHex(variable.value) : undefined;
      if (normalized) {
        allowed.add(normalized);
      }
    });
  }

  return allowed;
}

function formatValue(value) {
  if (value === undefined) {
    return "n/a";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return stableStringify(value);
}

function escapeMarkdownCell(value) {
  return String(value ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\n/g, "<br/>");
}

function normalizeRules(rules) {
  return {
    project: rules?.project ?? "Figma design audit",
    requireVariableReference: {
      color: Boolean(rules?.requireVariableReference?.color),
      spacing: Boolean(rules?.requireVariableReference?.spacing),
      radius: Boolean(rules?.requireVariableReference?.radius),
      typography: Boolean(rules?.requireVariableReference?.typography),
    },
    spacingScale: Array.isArray(rules?.spacingScale) ? rules.spacingScale : [],
    radiusScale: Array.isArray(rules?.radiusScale) ? rules.radiusScale : [],
    layoutGrid: {
      base: Number.isFinite(rules?.layoutGrid?.base) ? rules.layoutGrid.base : undefined,
    },
    color: {
      allowedHex: Array.isArray(rules?.color?.allowedHex) ? rules.color.allowedHex : [],
      allowTokenValues: rules?.color?.allowTokenValues !== false,
    },
    typography: {
      allowedFamilies: Array.isArray(rules?.typography?.allowedFamilies)
        ? rules.typography.allowedFamilies
        : [],
      allowedWeights: Array.isArray(rules?.typography?.allowedWeights)
        ? rules.typography.allowedWeights
        : [],
      sizeLineHeightPairs: Array.isArray(rules?.typography?.sizeLineHeightPairs)
        ? rules.typography.sizeLineHeightPairs
        : [],
    },
    severityOverrides: isObject(rules?.severityOverrides) ? rules.severityOverrides : {},
  };
}

function getSeverity(ruleId, rules) {
  return rules.severityOverrides[ruleId] ?? DEFAULT_SEVERITY[ruleId] ?? "medium";
}

function auditNodes(nodes, rules, variableIndex, variables) {
  const violations = [];
  let violationNumber = 1;

  const addViolation = ({
    ruleId,
    node,
    property,
    actual,
    expected,
    suggestion,
    before,
    after,
    severity,
  }) => {
    violations.push({
      id: `V-${String(violationNumber).padStart(4, "0")}`,
      ruleId,
      severity: severity ?? getSeverity(ruleId, rules),
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      nodePath: node.path,
      journey: inferJourney(node.path),
      property,
      actual: formatValue(actual),
      expected: formatValue(expected),
      suggestion,
      before: before ?? formatValue(actual),
      after: after ?? formatValue(expected),
    });
    violationNumber += 1;
  };

  const allowedColors = buildAllowedColorSet(rules, variables);

  nodes.forEach((node) => {
    const boundVariables = extractBoundVariables(node.raw);

    boundVariables.forEach((binding) => {
      binding.variableIds.forEach((variableRef) => {
        const resolved = findVariableByRef(variableRef, variableIndex);
        if (!resolved) {
          addViolation({
            ruleId: "unknown_variable_reference",
            node,
            property: binding.propertyPath,
            actual: variableRef,
            expected: "Known variable ID/name from active token source",
            suggestion:
              "Re-bind this property to a valid published variable from your current collection/mode.",
            before: `Variable ref: ${variableRef}`,
            after: "Variable ref: <valid-token-id>",
          });
        }
      });
    });

    const spacingProps = extractNumericProperties(node.raw, /(spacing|padding|margin|gap|gutter|inset)/i);
    spacingProps.forEach((entry) => {
      if (!isOnScale(entry.value, rules.spacingScale)) {
        const nearest = nearestScaleValue(entry.value, rules.spacingScale);
        addViolation({
          ruleId: "spacing_off_scale",
          node,
          property: entry.propertyPath,
          actual: entry.value,
          expected: nearest ?? "Allowed spacing scale",
          suggestion:
            nearest !== undefined
              ? `Use nearest spacing token/value ${nearest}.`
              : "Use an approved spacing token/value.",
          before: `${entry.propertyPath}: ${entry.value}`,
          after: nearest !== undefined ? `${entry.propertyPath}: ${nearest}` : "Use approved spacing token",
        });
      }

      if (
        rules.requireVariableReference.spacing &&
        !hasVariableReference(boundVariables, "spacing", entry.propertyPath, variableIndex)
      ) {
        addViolation({
          ruleId: "missing_variable_reference",
          node,
          property: entry.propertyPath,
          actual: entry.value,
          expected: "Variable reference for spacing",
          suggestion: "Bind spacing value to the spacing token in your variable collection.",
          before: `${entry.propertyPath}: ${entry.value}`,
          after: `${entry.propertyPath}: {spacing/token-name}`,
        });
      }
    });

    const radiusProps = extractNumericProperties(node.raw, /(radius|corner)/i);
    radiusProps.forEach((entry) => {
      if (!isOnScale(entry.value, rules.radiusScale)) {
        const nearest = nearestScaleValue(entry.value, rules.radiusScale);
        addViolation({
          ruleId: "radius_off_scale",
          node,
          property: entry.propertyPath,
          actual: entry.value,
          expected: nearest ?? "Allowed radius scale",
          suggestion:
            nearest !== undefined
              ? `Use nearest radius token/value ${nearest}.`
              : "Use an approved radius token/value.",
          before: `${entry.propertyPath}: ${entry.value}`,
          after: nearest !== undefined ? `${entry.propertyPath}: ${nearest}` : "Use approved radius token",
        });
      }

      if (
        rules.requireVariableReference.radius &&
        !hasVariableReference(boundVariables, "radius", entry.propertyPath, variableIndex)
      ) {
        addViolation({
          ruleId: "missing_variable_reference",
          node,
          property: entry.propertyPath,
          actual: entry.value,
          expected: "Variable reference for radius",
          suggestion: "Bind corner radius to the radius token in your variable collection.",
          before: `${entry.propertyPath}: ${entry.value}`,
          after: `${entry.propertyPath}: {radius/token-name}`,
        });
      }
    });

    const colorProps = extractColors(node.raw);
    colorProps.forEach((entry) => {
      if (allowedColors.size > 0 && !allowedColors.has(entry.value)) {
        addViolation({
          ruleId: "color_off_brand",
          node,
          property: entry.propertyPath,
          actual: entry.value,
          expected: "Approved brand color token/value",
          suggestion: "Replace this color with a brand-approved token from the active theme/mode.",
          before: `${entry.propertyPath}: ${entry.value}`,
          after: `${entry.propertyPath}: {color/brand/...}`,
        });
      }

      if (
        rules.requireVariableReference.color &&
        !hasVariableReference(boundVariables, "color", entry.propertyPath, variableIndex)
      ) {
        addViolation({
          ruleId: "missing_variable_reference",
          node,
          property: entry.propertyPath,
          actual: entry.value,
          expected: "Variable reference for color",
          suggestion: "Bind color to a published semantic token.",
          before: `${entry.propertyPath}: ${entry.value}`,
          after: `${entry.propertyPath}: {color/semantic/...}`,
        });
      }
    });

    const typographyProps = extractTypography(node.raw);
    typographyProps.forEach((entry) => {
      if (
        entry.fontFamily &&
        rules.typography.allowedFamilies.length > 0 &&
        !rules.typography.allowedFamilies.includes(entry.fontFamily)
      ) {
        addViolation({
          ruleId: "typography_family_violation",
          node,
          property: `${entry.propertyPath}.fontFamily`,
          actual: entry.fontFamily,
          expected: rules.typography.allowedFamilies.join(", "),
          suggestion: "Use one of the approved design-system typefaces.",
          before: `fontFamily: ${entry.fontFamily}`,
          after: `fontFamily: ${rules.typography.allowedFamilies[0]}`,
        });
      }

      if (
        entry.fontWeight !== undefined &&
        rules.typography.allowedWeights.length > 0 &&
        !rules.typography.allowedWeights.includes(entry.fontWeight)
      ) {
        addViolation({
          ruleId: "typography_weight_violation",
          node,
          property: `${entry.propertyPath}.fontWeight`,
          actual: entry.fontWeight,
          expected: rules.typography.allowedWeights.join(", "),
          suggestion: "Use one of the approved typography weights.",
          before: `fontWeight: ${entry.fontWeight}`,
          after: `fontWeight: ${rules.typography.allowedWeights[0]}`,
        });
      }

      if (
        entry.fontSize !== undefined &&
        entry.lineHeight !== undefined &&
        rules.typography.sizeLineHeightPairs.length > 0
      ) {
        const pairMatch = rules.typography.sizeLineHeightPairs.some(
          (pair) =>
            Math.abs(pair.fontSize - entry.fontSize) <= 0.01 &&
            Math.abs(pair.lineHeight - entry.lineHeight) <= 0.01,
        );
        if (!pairMatch) {
          const nearestPair = rules.typography.sizeLineHeightPairs.reduce((best, pair) => {
            if (!best) {
              return pair;
            }
            const bestDistance =
              Math.abs(best.fontSize - entry.fontSize) + Math.abs(best.lineHeight - entry.lineHeight);
            const nextDistance =
              Math.abs(pair.fontSize - entry.fontSize) + Math.abs(pair.lineHeight - entry.lineHeight);
            return nextDistance < bestDistance ? pair : best;
          }, undefined);

          addViolation({
            ruleId: "typography_scale_violation",
            node,
            property: `${entry.propertyPath}.fontSize+lineHeight`,
            actual: `${entry.fontSize}/${entry.lineHeight}`,
            expected: nearestPair ? `${nearestPair.fontSize}/${nearestPair.lineHeight}` : "Approved pair",
            suggestion: "Switch to a supported font-size/line-height pair from your typography scale.",
            before: `fontSize: ${entry.fontSize}, lineHeight: ${entry.lineHeight}`,
            after: nearestPair
              ? `fontSize: ${nearestPair.fontSize}, lineHeight: ${nearestPair.lineHeight}`
              : "Use approved size-lineHeight pair",
          });
        }
      }

      if (
        rules.requireVariableReference.typography &&
        !hasVariableReference(boundVariables, "typography", entry.propertyPath, variableIndex)
      ) {
        addViolation({
          ruleId: "missing_variable_reference",
          node,
          property: entry.propertyPath,
          actual: {
            fontFamily: entry.fontFamily,
            fontSize: entry.fontSize,
            fontWeight: entry.fontWeight,
            lineHeight: entry.lineHeight,
          },
          expected: "Variable reference for typography style",
          suggestion: "Bind typography properties to text style variables/tokens.",
          before: "Hardcoded typography values",
          after: "{typography/token-name}",
        });
      }
    });

    const gridBase = rules.layoutGrid.base;
    if (Number.isFinite(gridBase) && gridBase > 0) {
      const bounds = extractBounds(node.raw);
      bounds.forEach((entry) => {
        ["x", "y", "width", "height"].forEach((axis) => {
          const value = entry[axis];
          const remainder = Math.abs(value % gridBase);
          const offGrid = remainder > 0.01 && Math.abs(remainder - gridBase) > 0.01;
          if (offGrid) {
            const suggested = Math.round(value / gridBase) * gridBase;
            addViolation({
              ruleId: "layout_off_grid",
              node,
              property: `${entry.propertyPath}.${axis}`,
              actual: value,
              expected: `Multiple of ${gridBase}`,
              suggestion: `Snap to grid. Suggested value: ${suggested}.`,
              before: `${axis}: ${value}`,
              after: `${axis}: ${suggested}`,
            });
          }
        });
      });
    }
  });

  const dedupe = new Set();
  const unique = [];
  violations.forEach((violation) => {
    const key = `${violation.ruleId}|${violation.nodeId}|${violation.property}|${violation.actual}`;
    if (!dedupe.has(key)) {
      dedupe.add(key);
      unique.push(violation);
    }
  });

  unique.sort((left, right) => {
    const severityDelta = (SEVERITY_ORDER[left.severity] ?? 99) - (SEVERITY_ORDER[right.severity] ?? 99);
    if (severityDelta !== 0) {
      return severityDelta;
    }
    return left.nodePath.localeCompare(right.nodePath);
  });

  return unique;
}

function summarizeResults(nodes, violations) {
  const bySeverity = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
  const byRule = {};
  const byJourney = {};

  violations.forEach((violation) => {
    bySeverity[violation.severity] = (bySeverity[violation.severity] ?? 0) + 1;
    byRule[violation.ruleId] = (byRule[violation.ruleId] ?? 0) + 1;
    byJourney[violation.journey] = (byJourney[violation.journey] ?? 0) + 1;
  });

  return {
    nodeCount: nodes.length,
    violationCount: violations.length,
    bySeverity,
    byRule,
    byJourney: Object.fromEntries(
      Object.entries(byJourney).sort((left, right) => right[1] - left[1]).slice(0, 10),
    ),
  };
}

async function generateAiInsights({
  enabled,
  model,
  maxAiViolations,
  rules,
  summary,
  violations,
}) {
  if (!enabled) {
    return {
      status: "disabled",
      note: "AI summary disabled by --no-ai flag.",
    };
  }

  const apiKey = process.env.GEMINI_API_KEY ?? process.env.API_KEY;
  if (!apiKey) {
    return {
      status: "skipped",
      note: "Set GEMINI_API_KEY or API_KEY to generate AI remediation summary.",
    };
  }

  let GoogleGenAI;
  try {
    ({ GoogleGenAI } = await import("@google/genai"));
  } catch {
    return {
      status: "skipped",
      note: "Package @google/genai is not installed. Run `npm install` to enable AI summaries.",
    };
  }

  const clippedViolations = violations.slice(0, maxAiViolations).map((entry) => ({
    id: entry.id,
    severity: entry.severity,
    ruleId: entry.ruleId,
    journey: entry.journey,
    nodePath: entry.nodePath,
    property: entry.property,
    actual: entry.actual,
    expected: entry.expected,
    suggestion: entry.suggestion,
  }));

  const prompt = `
You are auditing a regulated internet-banking product design system.
Produce a concise remediation plan from deterministic rule violations.

Return strict JSON with this shape:
{
  "executiveSummary": "string",
  "topRisks": [
    { "risk": "string", "impact": "string", "priority": "critical|high|medium|low" }
  ],
  "priorityFixes": [
    { "title": "string", "why": "string", "actions": ["string"] }
  ],
  "quickWins": ["string"]
}

Context:
Rules: ${stableStringify(rules)}
Summary: ${stableStringify(summary)}
Violations: ${stableStringify(clippedViolations)}
`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = parseLooseJson(response.text);
    return {
      status: "generated",
      model,
      ...parsed,
    };
  } catch (error) {
    return {
      status: "error",
      note: `AI summary generation failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

function buildMarkdownReport({
  reportMeta,
  summary,
  violations,
  aiInsights,
}) {
  const lines = [];

  lines.push(`# ${reportMeta.title}`);
  lines.push("");
  lines.push(`- Generated at: ${reportMeta.generatedAt}`);
  lines.push(`- Selection source: \`${reportMeta.selectionPath}\``);
  if (reportMeta.variablesPath) {
    lines.push(`- Variables source: \`${reportMeta.variablesPath}\``);
  }
  lines.push(`- Rules: \`${reportMeta.rulesPath}\``);
  lines.push("");

  lines.push("## Audit summary");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---:|");
  lines.push(`| Nodes audited | ${summary.nodeCount} |`);
  lines.push(`| Violations | ${summary.violationCount} |`);
  lines.push(`| Critical | ${summary.bySeverity.critical ?? 0} |`);
  lines.push(`| High | ${summary.bySeverity.high ?? 0} |`);
  lines.push(`| Medium | ${summary.bySeverity.medium ?? 0} |`);
  lines.push(`| Low | ${summary.bySeverity.low ?? 0} |`);
  lines.push("");

  lines.push("```mermaid");
  lines.push("pie showData");
  lines.push(`  "Critical" : ${summary.bySeverity.critical ?? 0}`);
  lines.push(`  "High" : ${summary.bySeverity.high ?? 0}`);
  lines.push(`  "Medium" : ${summary.bySeverity.medium ?? 0}`);
  lines.push(`  "Low" : ${summary.bySeverity.low ?? 0}`);
  lines.push("```");
  lines.push("");

  if (Object.keys(summary.byJourney).length > 0) {
    lines.push("## Most impacted journeys/screens");
    lines.push("");
    lines.push("| Journey / Screen | Violation count |");
    lines.push("|---|---:|");
    Object.entries(summary.byJourney).forEach(([journey, count]) => {
      lines.push(`| ${escapeMarkdownCell(journey)} | ${count} |`);
    });
    lines.push("");
  }

  lines.push("## Detailed violations");
  lines.push("");
  lines.push(
    "| ID | Severity | Rule | Journey | Node | Property | Actual | Expected | Suggested fix |",
  );
  lines.push("|---|---|---|---|---|---|---|---|---|");
  violations.forEach((violation) => {
    lines.push(
      `| ${violation.id} | ${escapeMarkdownCell(violation.severity)} | ${escapeMarkdownCell(
        violation.ruleId,
      )} | ${escapeMarkdownCell(violation.journey)} | ${escapeMarkdownCell(
        violation.nodePath,
      )} | ${escapeMarkdownCell(violation.property)} | ${escapeMarkdownCell(
        violation.actual,
      )} | ${escapeMarkdownCell(violation.expected)} | ${escapeMarkdownCell(violation.suggestion)} |`,
    );
  });
  lines.push("");

  lines.push("## Before / after fix suggestions");
  lines.push("");
  violations.slice(0, 25).forEach((violation) => {
    lines.push(`### ${violation.id} · ${violation.ruleId}`);
    lines.push("");
    lines.push(`- Node: \`${violation.nodePath}\``);
    lines.push(`- Property: \`${violation.property}\``);
    lines.push("");
    lines.push("**Before**");
    lines.push("```text");
    lines.push(String(violation.before));
    lines.push("```");
    lines.push("");
    lines.push("**After**");
    lines.push("```text");
    lines.push(String(violation.after));
    lines.push("```");
    lines.push("");
    lines.push(`**Why:** ${violation.suggestion}`);
    lines.push("");
  });

  lines.push("## AI remediation summary");
  lines.push("");
  lines.push(`Status: **${aiInsights.status}**`);
  if (aiInsights.note) {
    lines.push("");
    lines.push(aiInsights.note);
  }

  if (aiInsights.status === "generated") {
    lines.push("");
    if (aiInsights.executiveSummary) {
      lines.push(`**Executive summary:** ${aiInsights.executiveSummary}`);
      lines.push("");
    }
    if (Array.isArray(aiInsights.topRisks) && aiInsights.topRisks.length > 0) {
      lines.push("### Top risks");
      aiInsights.topRisks.forEach((risk) => {
        lines.push(
          `- **${risk.priority ?? "medium"}** · ${risk.risk ?? "Risk"} — ${risk.impact ?? "Impact not provided."}`,
        );
      });
      lines.push("");
    }
    if (Array.isArray(aiInsights.priorityFixes) && aiInsights.priorityFixes.length > 0) {
      lines.push("### Priority fixes");
      aiInsights.priorityFixes.forEach((fix) => {
        lines.push(`- **${fix.title ?? "Fix"}**: ${fix.why ?? ""}`);
        if (Array.isArray(fix.actions) && fix.actions.length > 0) {
          fix.actions.forEach((action) => {
            lines.push(`  - ${action}`);
          });
        }
      });
      lines.push("");
    }
    if (Array.isArray(aiInsights.quickWins) && aiInsights.quickWins.length > 0) {
      lines.push("### Quick wins");
      aiInsights.quickWins.forEach((win) => lines.push(`- ${win}`));
      lines.push("");
    }
  }

  return lines.join("\n");
}

function defaultReportName(selectionPath) {
  const base = path.basename(selectionPath);
  const withoutExt = base.replace(/\.[^.]+$/, "");
  return withoutExt || "figma-audit";
}

function timestampLabel() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function ensureDirectory(directoryPath) {
  await fs.mkdir(directoryPath, { recursive: true });
}

async function writeReportFiles({ outputDir, reportPrefix, report }) {
  await ensureDirectory(outputDir);
  const jsonPath = path.join(outputDir, `${reportPrefix}.json`);
  const markdownPath = path.join(outputDir, `${reportPrefix}.md`);

  await fs.writeFile(jsonPath, `${stableStringify(report)}\n`, "utf8");
  await fs.writeFile(markdownPath, `${report.markdown}\n`, "utf8");

  return { jsonPath, markdownPath };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(`${HELP_TEXT}\n`);
    return;
  }

  if (!options.selectionPath) {
    throw new Error("Missing required argument: --selection <path>");
  }

  const rulesRaw = await readJsonInput(options.rulesPath);
  const rules = normalizeRules(rulesRaw);

  const selectionPayload = await readJsonInput(options.selectionPath);
  const variablesPayload = options.variablesPath ? await readJsonInput(options.variablesPath) : null;

  const nodes = collectNodes(selectionPayload);
  if (nodes.length === 0) {
    throw new Error(
      "No design nodes found in selection input. Provide JSON from Figma MCP get_design_context/get_metadata output.",
    );
  }

  const variablesFromSelection = collectVariables(selectionPayload);
  const variablesFromSource = variablesPayload ? collectVariables(variablesPayload) : [];
  const mergedVariablesMap = new Map();

  [...variablesFromSelection, ...variablesFromSource].forEach((variable) => {
    const key = variable.id ?? variable.name;
    if (key) {
      mergedVariablesMap.set(key, variable);
    }
  });
  const variables = [...mergedVariablesMap.values()];
  const variableIndex = buildVariableIndex(variables);

  const violations = auditNodes(nodes, rules, variableIndex, variables);
  const summary = summarizeResults(nodes, violations);
  const aiInsights = await generateAiInsights({
    enabled: options.ai,
    model: options.model,
    maxAiViolations: options.maxAiViolations,
    rules,
    summary,
    violations,
  });

  const generatedAt = new Date().toISOString();
  const title = `Figma Design Audit Report · ${rules.project}`;
  const reportMeta = {
    title,
    generatedAt,
    selectionPath: options.selectionPath,
    variablesPath: options.variablesPath,
    rulesPath: options.rulesPath,
    model: options.model,
  };

  const report = {
    metadata: reportMeta,
    summary,
    violations,
    aiInsights,
    markdown: "",
  };
  report.markdown = buildMarkdownReport({
    reportMeta,
    summary,
    violations,
    aiInsights,
  });

  const prefixBase = options.reportName ?? defaultReportName(options.selectionPath);
  const reportPrefix = `${prefixBase}-${timestampLabel()}`;
  const { jsonPath, markdownPath } = await writeReportFiles({
    outputDir: options.outputDir,
    reportPrefix,
    report,
  });

  process.stdout.write(`Audit complete.\n`);
  process.stdout.write(`Nodes audited: ${summary.nodeCount}\n`);
  process.stdout.write(`Violations: ${summary.violationCount}\n`);
  process.stdout.write(`JSON report: ${jsonPath}\n`);
  process.stdout.write(`Markdown report: ${markdownPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`Audit failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
