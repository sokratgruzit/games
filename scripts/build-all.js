const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, ".."); // корень репки, т.е. games
const gamesDir = repoRoot; // папки с играми лежат прямо здесь
const outRoot = path.join(repoRoot, "docs", "games"); // куда копировать сборку

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

if (!fs.existsSync(outRoot)) fs.mkdirSync(outRoot, { recursive: true });

const games = fs.readdirSync(gamesDir).filter((name) => {
  const gamePath = path.join(gamesDir, name);
  const pkgJson = path.join(gamePath, "package.json");
  return fs.statSync(gamePath).isDirectory() && fs.existsSync(pkgJson);
});

for (const g of games) {
  const gamePath = path.join(gamesDir, g);
  console.log(`\n=== build: ${g} ===`);

  // если нужно заново ставить зависимости
  // execSync('npm ci', { cwd: gamePath, stdio: 'inherit' });

  // запуск сборки игры (vite build)
  execSync('npm run build', { cwd: gamePath, stdio: 'inherit' });

  const dist = path.join(gamePath, "dist");
  const target = path.join(outRoot, g);

  // очистка старой папки
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(target, { recursive: true });

  copyRecursive(dist, target);
  console.log(`-> copied to docs/games/${g}`);
}

console.log("\nALL BUILDS FINISHED");
