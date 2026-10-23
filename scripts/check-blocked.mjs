import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const BLOCKED = [
  ["미투디스크", "me2disk"],
  ["파일캐스트", "filecast"],
  ["파일이즈", "fileis"],
  ["애플파일", "applefile"],
];
const SKIP = new Set(["scripts/check-blocked.mjs", "CLAUDE.md"]);
const TEXT = /\.(html|js|mjs|json|txt|xml|css|svg|yml|md)$/;

const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean);
const found = [];
for (const file of files) {
  if (SKIP.has(file)) continue;
  const lower = file.toLowerCase();
  const text = TEXT.test(file) ? readFileSync(file, "utf8").toLowerCase() : "";
  for (const [name, id] of BLOCKED) {
    if (lower.includes(id) || text.includes(name) || text.includes(id)) found.push(`${file}: ${name}`);
  }
}
if (found.length) {
  console.error("다루지 않기로 한 웹하드가 들어 있습니다. 넣기 전에 소유자에게 확인하세요.");
  console.error(found.join("\n"));
  process.exit(1);
}
console.log(`제외 웹하드 검사 통과: 파일 ${files.length}개`);
