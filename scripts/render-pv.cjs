// 把 public/pv/index.html 逐帧渲染成 MP4（含配乐）。
// 依赖：playwright（及其 Chromium）、ffmpeg
// 用法：node scripts/render-pv.cjs [输出文件=pv.mp4] [--fps 30] [--crf 18]
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { chromium } = require("playwright");

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1] : def; };
const FPS = +opt("--fps", 30);
const CRF = opt("--crf", "18");
const OUT = path.resolve(args[0] || "pv.mp4");
const ROOT = path.join(__dirname, "..", "public", "pv");

const MIME = { ".html": "text/html", ".jpg": "image/jpeg", ".png": "image/png", ".gif": "image/gif", ".webp": "image/webp" };
const server = http.createServer((req, res) => {
  const file = path.join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const url = `http://127.0.0.1:${server.address().port}/index.html?capture`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => window.PV.ready);
  const DUR = await page.evaluate(() => window.PV.DUR);

  console.log("合成配乐…");
  const wav = path.join(os.tmpdir(), `pv-audio-${process.pid}.wav`);
  fs.writeFileSync(wav, Buffer.from(await page.evaluate(() => window.PV.audioWavBase64()), "base64"));

  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-", "-i", wav,
    "-c:v", "libx264", "-preset", "medium", "-crf", CRF, "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", OUT], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((r, j) => ff.on("close", (c) => (c ? j(new Error("ffmpeg exit " + c)) : r())));

  const total = Math.round(DUR * FPS);
  for (let f = 0; f < total; f++) {
    await page.evaluate((t) => window.PV.seek(t), f / FPS);
    const jpg = await page.screenshot({ type: "jpeg", quality: 92 });
    if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once("drain", r));
    if (f % FPS === 0) process.stdout.write(`\r帧 ${f}/${total}`);
  }
  ff.stdin.end();
  await done;
  await browser.close();
  server.close();
  fs.unlinkSync(wav);
  console.log(`\n完成：${OUT}`);
})().catch((e) => { console.error(e); process.exit(1); });
