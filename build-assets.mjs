import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { build, transform } from "esbuild";

const jsSourceDir = "static/js/src";
const cssSourceDir = "static/css";
const jsDistDir = "static/js/dist";
const appDistDir = path.join(jsDistDir, "app");
const cssDistDir = "static/css/dist";

const vendorScripts = [
  "jquery.js",
  "bootstrap.min.js",
  "moment.min.js",
  "papaparse.min.js",
  "d3.min.js",
  "topojson.min.js",
  "datamaps.min.js",
  "jquery.dataTables.min.js",
  "dataTables.bootstrap.js",
  "datetime-moment.js",
  "jquery.ui.widget.js",
  "jquery.fileupload.js",
  "jquery.iframe-transport.js",
  "sweetalert2.min.js",
  "bootstrap-datetime.js",
  "select2.min.js",
  "core.min.js",
  "highcharts.js",
  "ua-parser.min.js",
].map((file) => path.join(jsSourceDir, "vendor", file));

const appScripts = [
  "autocomplete.js",
  "campaign_results.js",
  "campaigns.js",
  "dashboard.js",
  "groups.js",
  "landing_pages.js",
  "sending_profiles.js",
  "settings.js",
  "templates.js",
  "gophish.js",
  "users.js",
  "webhooks.js",
];

const bundledAppScripts = new Set(["passwords.js"]);

const styleSheets = [
  "bootstrap.min.css",
  "main.css",
  "dashboard.css",
  "flat-ui.css",
  "dataTables.bootstrap.css",
  "font-awesome.min.css",
  "chartist.min.css",
  "bootstrap-datetime.css",
  "checkbox.css",
  "sweetalert2.min.css",
  "select2.min.css",
  "select2-bootstrap.min.css",
].map((file) => path.join(cssSourceDir, file));

async function readAll(files) {
  const contents = await Promise.all(files.map((file) => readFile(file, "utf8")));
  return contents.join("\n");
}

async function buildVendorScripts() {
  const source = await readAll(vendorScripts);
  const result = await transform(source, {
    loader: "js",
    minify: true,
    target: "es2015",
  });
  await writeFile(path.join(jsDistDir, "vendor.min.js"), result.code);
}

async function buildGlobalAppScripts() {
  await Promise.all(
    appScripts
      .filter((script) => !bundledAppScripts.has(script))
      .map(async (script) => {
        const sourcePath = path.join(jsSourceDir, "app", script);
        const source = await readFile(sourcePath, "utf8");
        const result = await transform(source, {
          loader: "js",
          minify: true,
          target: "es2015",
        });
        const outputName = script.replace(/\.js$/, ".min.js");
        await writeFile(path.join(appDistDir, outputName), result.code);
      }),
  );
}

async function buildBundledAppScripts() {
  await Promise.all(
    Array.from(bundledAppScripts).map((script) =>
      build({
        entryPoints: [path.join(jsSourceDir, "app", script)],
        bundle: true,
        minify: true,
        target: "es2015",
        format: "iife",
        outfile: path.join(appDistDir, script.replace(/\.js$/, ".min.js")),
        logLevel: "info",
      }),
    ),
  );
}

async function buildStyles() {
  const source = await readAll(styleSheets);
  const result = await transform(source, {
    loader: "css",
    minify: true,
  });
  await writeFile(path.join(cssDistDir, "gophish.css"), result.code);
}

await Promise.all([mkdir(appDistDir, { recursive: true }), mkdir(cssDistDir, { recursive: true })]);
await Promise.all([buildVendorScripts(), buildGlobalAppScripts(), buildBundledAppScripts(), buildStyles()]);
