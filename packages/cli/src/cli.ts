#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, extname, basename } from "node:path";
import { globby } from "globby";
import { compile } from "@proto-typed/core";

const args = process.argv.slice(2);
const outIdx = args.indexOf("-o");
const outDir = outIdx >= 0 ? resolve(args[outIdx + 1] ?? "dist") : resolve("dist");
const inputPatterns: string[] = [];
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "-o") {
    i += 1;
    continue;
  }
  if (arg.startsWith("-")) {
    continue;
  }
  inputPatterns.push(arg);
}

if (inputPatterns.length === 0) {
  console.error("Usage: proto-typed <fileOrGlob.pty> [-o dist]");
  process.exit(1);
}

const main = async () => {
  const files = (await globby(inputPatterns)).filter(file => extname(file) === ".pty");
  if (files.length === 0) {
    console.error("No .pty files matched the provided patterns.");
    process.exit(1);
  }

  mkdirSync(outDir, { recursive: true });

  for (const file of files) {
    const text = readFileSync(file, "utf8");
    const { html, diagnostics } = await compile(text, { standaloneHtml: true });
    const outFile = resolve(outDir, basename(file).replace(/\.pty$/, ".html"));
    writeFileSync(outFile, html, "utf8");
    const issues = diagnostics?.length ?? 0;
    const suffix = issues ? `  (${issues} issues)` : "";
    console.log(`✓ ${file} → ${outFile}${suffix}`);
  }
};

main().catch(error => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exit(1);
});
