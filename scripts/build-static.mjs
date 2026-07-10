import { cp, mkdir, rm } from "node:fs/promises";

const output = new URL("../static-dist/", import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const file of ["index.html", "styles.css", "script.js", "favicon.svg", "robots.txt", "sitemap.xml", "llms.txt"]) {
  await cp(new URL(`../${file}`, import.meta.url), new URL(file, output));
}

await cp(new URL("../assets/", import.meta.url), new URL("assets/", output), {
  recursive: true,
});
