import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const publicDir = path.join(root, "public");
const dest = path.join(publicDir, "pdf.worker.min.js");

const candidates = [
  path.join(root, "node_modules", "pdfjs-dist", "build", "pdf.worker.min.js"),
  path.join(root, "node_modules", "pdfjs-dist", "legacy", "build", "pdf.worker.min.js"),
  path.join(root, "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs"),
];

const found = candidates.find((p) => fs.existsSync(p));

if (!found) {
  console.error("Could not find pdfjs worker. Tried:", candidates);
  process.exit(1);
}

fs.mkdirSync(publicDir, { recursive: true });
fs.copyFileSync(found, dest);

console.log(`Copied pdfjs worker from ${found} -> ${dest}`);

