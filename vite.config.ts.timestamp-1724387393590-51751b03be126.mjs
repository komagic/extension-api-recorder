// vite.config.ts
import react from "file:///Users/mac/Desktop/github-project/extension-api-recorder/node_modules/.pnpm/@vitejs+plugin-react@4.2.0_vite@5.0.12_@types+node@20.8.10_sass@1.72.0_terser@5.31.6_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import autoprefixer from "file:///Users/mac/Desktop/github-project/extension-api-recorder/node_modules/.pnpm/autoprefixer@10.4.20_postcss@8.4.41/node_modules/autoprefixer/lib/autoprefixer.js";
import { defineConfig } from "file:///Users/mac/Desktop/github-project/extension-api-recorder/node_modules/.pnpm/vite@5.0.12_@types+node@20.8.10_sass@1.72.0_terser@5.31.6/node_modules/vite/dist/node/index.js";
import tailwindcss from "file:///Users/mac/Desktop/github-project/extension-api-recorder/node_modules/.pnpm/tailwindcss@3.4.10/node_modules/tailwindcss/lib/index.js";
import path3, { resolve as resolve3 } from "path";

// utils/plugins/make-manifest.ts
import * as fs from "fs";
import * as path from "path";
import url from "url";
import * as process2 from "process";

// utils/log.ts
function colorLog(message, type) {
  let color;
  switch (type) {
    case "success":
      color = COLORS.FgGreen;
      break;
    case "info":
      color = COLORS.FgBlue;
      break;
    case "error":
      color = COLORS.FgRed;
      break;
    case "warning":
      color = COLORS.FgYellow;
      break;
    default:
      color = COLORS[type];
      break;
  }
  console.log(color, message);
}
var COLORS = {
  Reset: "\x1B[0m",
  Bright: "\x1B[1m",
  Dim: "\x1B[2m",
  Underscore: "\x1B[4m",
  Blink: "\x1B[5m",
  Reverse: "\x1B[7m",
  Hidden: "\x1B[8m",
  FgBlack: "\x1B[30m",
  FgRed: "\x1B[31m",
  FgGreen: "\x1B[32m",
  FgYellow: "\x1B[33m",
  FgBlue: "\x1B[34m",
  FgMagenta: "\x1B[35m",
  FgCyan: "\x1B[36m",
  FgWhite: "\x1B[37m",
  BgBlack: "\x1B[40m",
  BgRed: "\x1B[41m",
  BgGreen: "\x1B[42m",
  BgYellow: "\x1B[43m",
  BgBlue: "\x1B[44m",
  BgMagenta: "\x1B[45m",
  BgCyan: "\x1B[46m",
  BgWhite: "\x1B[47m"
};
var is_debug_mode;
try {
  is_debug_mode = window.location.href.includes("alipay.net");
} catch (error) {
  console.warn("localStorage error");
}

// utils/manifest-parser/index.ts
var ManifestParser = class {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
  }
  static convertManifestToString(manifest) {
    if (process.env.__FIREFOX__) {
      manifest = this.convertToFirefoxCompatibleManifest(manifest);
    }
    return JSON.stringify(manifest, null, 2);
  }
  static convertToFirefoxCompatibleManifest(manifest) {
    const manifestCopy = {
      ...manifest
    };
    manifestCopy.background = {
      scripts: [manifest.background?.service_worker],
      type: "module"
    };
    manifestCopy.options_ui = {
      page: manifest.options_page,
      browser_style: false
    };
    manifestCopy.content_security_policy = {
      extension_pages: "script-src 'self'; object-src 'self'"
    };
    delete manifestCopy.options_page;
    return manifestCopy;
  }
};
var manifest_parser_default = ManifestParser;

// utils/plugins/make-manifest.ts
var __vite_injected_original_dirname = "/Users/mac/Desktop/github-project/extension-api-recorder/utils/plugins";
var { resolve } = path;
var rootDir = resolve(__vite_injected_original_dirname, "..", "..");
var distDir = resolve(rootDir, "dist");
var manifestFile = resolve(rootDir, "manifest.js");
var getManifestWithCacheBurst = () => {
  const withCacheBurst = (path4) => `${path4}?${Date.now().toString()}`;
  if (process2.platform === "win32") {
    return import(withCacheBurst(url.pathToFileURL(manifestFile).href));
  }
  return import(withCacheBurst(manifestFile));
};
function makeManifest(config) {
  function makeManifest2(manifest, to, cacheKey) {
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to);
    }
    const manifestPath = resolve(to, "manifest.json");
    if (cacheKey && manifest.content_scripts) {
      manifest.content_scripts.forEach((script) => {
        script.css &&= script.css.map((css) => css.replace("<KEY>", cacheKey));
      });
    }
    fs.writeFileSync(manifestPath, manifest_parser_default.convertManifestToString(manifest));
    colorLog(`Manifest file copy complete: ${manifestPath}`, "success");
  }
  return {
    name: "make-manifest",
    buildStart() {
      this.addWatchFile(manifestFile);
    },
    async writeBundle() {
      const invalidationKey = config.getCacheInvalidationKey?.();
      const manifest = await getManifestWithCacheBurst();
      makeManifest2(manifest.default, distDir, invalidationKey);
    }
  };
}

// utils/plugins/custom-dynamic-import.ts
function customDynamicImport() {
  return {
    name: "custom-dynamic-import",
    renderDynamicImport({ moduleId }) {
      if (!moduleId.includes("node_modules") && process.env.__FIREFOX__) {
        return {
          left: `
          {
            const dynamicImport = (path) => import(path);
            dynamicImport(browser.runtime.getURL('./') + 
            `,
          right: ".split('../').join(''))}"
        };
      }
      return {
        left: "import(",
        right: ")"
      };
    }
  };
}

// utils/plugins/add-hmr.ts
import * as path2 from "path";
import { readFileSync } from "fs";
var __vite_injected_original_dirname2 = "/Users/mac/Desktop/github-project/extension-api-recorder/utils/plugins";
var DUMMY_CODE = `export default function(){};`;
function getInjectionCode(fileName) {
  return readFileSync(path2.resolve(__vite_injected_original_dirname2, "..", "reload", "injections", fileName), { encoding: "utf8" });
}
function addHmr(config) {
  const { background, view, isDev: isDev2 } = config;
  const idInBackgroundScript = "virtual:reload-on-update-in-background-script";
  const idInView = "virtual:reload-on-update-in-view";
  const scriptHmrCode = isDev2 ? getInjectionCode("script.js") : DUMMY_CODE;
  const viewHmrCode = isDev2 ? getInjectionCode("view.js") : DUMMY_CODE;
  return {
    name: "add-hmr",
    resolveId(id) {
      if (id === idInBackgroundScript || id === idInView) {
        return getResolvedId(id);
      }
    },
    load(id) {
      if (id === getResolvedId(idInBackgroundScript)) {
        return background ? scriptHmrCode : DUMMY_CODE;
      }
      if (id === getResolvedId(idInView)) {
        return view ? viewHmrCode : DUMMY_CODE;
      }
    }
  };
}
function getResolvedId(id) {
  return "\0" + id;
}

// utils/plugins/watch-rebuild.ts
import { WebSocket } from "file:///Users/mac/Desktop/github-project/extension-api-recorder/node_modules/.pnpm/ws@8.14.2/node_modules/ws/wrapper.mjs";

// utils/reload/interpreter/index.ts
var MessageInterpreter = class {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
  }
  static send(message) {
    return JSON.stringify(message);
  }
  static receive(serializedMessage) {
    return JSON.parse(serializedMessage);
  }
};

// utils/reload/constant.ts
var LOCAL_RELOAD_SOCKET_PORT = 8081;
var LOCAL_RELOAD_SOCKET_URL = `ws://localhost:${LOCAL_RELOAD_SOCKET_PORT}`;

// utils/plugins/watch-rebuild.ts
function watchRebuild(config) {
  const ws = new WebSocket(LOCAL_RELOAD_SOCKET_URL);
  return {
    name: "watch-rebuild",
    writeBundle() {
      ws.send(MessageInterpreter.send({ type: "build_complete" }));
      sendNextQueue(() => {
        config.afterWriteBundle();
      });
    }
  };
}
function sendNextQueue(callback) {
  setTimeout(() => {
    callback();
  }, 0);
}

// utils/plugins/inline-vite-preload-script.ts
import MagicString from "file:///Users/mac/Desktop/github-project/extension-api-recorder/node_modules/.pnpm/magic-string@0.30.11/node_modules/magic-string/dist/magic-string.es.mjs";
function inlineVitePreloadScript() {
  let __vitePreload = "";
  return {
    name: "replace-vite-preload-script-plugin",
    async renderChunk(code, chunk, options, meta) {
      if (!/content/.test(chunk.fileName)) {
        return null;
      }
      if (!__vitePreload) {
        const chunkName = Object.keys(meta.chunks).find((key) => /preload/.test(key));
        const modules = meta.chunks?.[chunkName]?.modules;
        __vitePreload = modules?.[Object.keys(modules)?.[0]]?.code;
        __vitePreload = __vitePreload?.replaceAll("const ", "var ");
        if (!__vitePreload) {
          return null;
        }
      }
      return {
        code: __vitePreload + code.split(`
`).slice(1).join(`
`),
        map: new MagicString(code).generateMap({ hires: true })
      };
    }
  };
}

// utils/vite.ts
var getPlugins = (isDev2) => [
  makeManifest({ getCacheInvalidationKey }),
  customDynamicImport(),
  // You can toggle enable HMR in background script or view
  addHmr({ background: true, view: true, isDev: isDev2 }),
  isDev2 && watchRebuild({ afterWriteBundle: regenerateCacheInvalidationKey }),
  // For fix issue#177 (https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/177)
  inlineVitePreloadScript()
];
var cacheInvalidationKeyRef = { current: generateKey() };
function getCacheInvalidationKey() {
  return cacheInvalidationKeyRef.current;
}
function regenerateCacheInvalidationKey() {
  cacheInvalidationKeyRef.current = generateKey();
  return cacheInvalidationKeyRef;
}
function generateKey() {
  return `${Date.now().toFixed()}`;
}

// vite.config.ts
var __vite_injected_original_dirname3 = "/Users/mac/Desktop/github-project/extension-api-recorder";
var rootDir2 = resolve3(__vite_injected_original_dirname3);
var srcDir = resolve3(rootDir2, "src");
var pagesDir = resolve3(srcDir, "pages");
var isDev = process.env.__DEV__ === "true";
var isProduction = !isDev;
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@root": rootDir2,
      "@src": srcDir,
      "@assets": resolve3(srcDir, "assets"),
      "@pages": pagesDir
    }
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer]
    }
  },
  // plugins: [...getPlugins(isDev), react()],
  publicDir: resolve3(rootDir2, "public"),
  optimizeDeps: {
    include: ["react", "react-dom", "faker"]
  },
  build: {
    outDir: resolve3(rootDir2, "dist"),
    /** Can slow down build speed. */
    // sourcemap: isDev,
    minify: isProduction,
    modulePreload: false,
    reportCompressedSize: isProduction,
    emptyOutDir: !isDev,
    rollupOptions: {
      input: {
        contentInjected: resolve3(pagesDir, "content", "injected", "index.ts"),
        contentUI: resolve3(pagesDir, "content", "ui", "index.ts"),
        background: resolve3(pagesDir, "background", "index.ts"),
        contentStyle: resolve3(pagesDir, "content", "style.scss"),
        popup: resolve3(pagesDir, "popup", "index.html"),
        options: resolve3(pagesDir, "options", "index.html")
      },
      output: [
        {
          entryFileNames: "src/pages/content/injected/xhr.ts",
          format: "iife",
          assetFileNames: "assets/[ext]/[name].[ext]",
          inlineDynamicImports: false,
          plugins: [
            // You can toggle enable HMR in background script or view
            addHmr({ background: true, view: true, isDev }),
            inlineVitePreloadScript()
          ]
        },
        {
          plugins: [...getPlugins(isDev), react()],
          entryFileNames: "src/pages/[name]/index.js",
          // chunkFileNames: isDev ? 'assets/js/[name].[hash].js' : 'assets/js/[name].[hash].js',
          chunkFileNames: isDev ? "assets/js/[name].js" : "assets/js/[name].js",
          assetFileNames: (assetInfo) => {
            const { name } = path3.parse(assetInfo.name);
            const assetFileName = name === "contentStyle" ? `${name}` : name;
            return `assets/[ext]/${assetFileName}.chunk.[ext]`;
          }
        }
      ]
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["**/*.test.ts", "**/*.test.tsx"],
    setupFiles: "./test-utils/vitest.setup.js"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidXRpbHMvcGx1Z2lucy9tYWtlLW1hbmlmZXN0LnRzIiwgInV0aWxzL2xvZy50cyIsICJ1dGlscy9tYW5pZmVzdC1wYXJzZXIvaW5kZXgudHMiLCAidXRpbHMvcGx1Z2lucy9jdXN0b20tZHluYW1pYy1pbXBvcnQudHMiLCAidXRpbHMvcGx1Z2lucy9hZGQtaG1yLnRzIiwgInV0aWxzL3BsdWdpbnMvd2F0Y2gtcmVidWlsZC50cyIsICJ1dGlscy9yZWxvYWQvaW50ZXJwcmV0ZXIvaW5kZXgudHMiLCAidXRpbHMvcmVsb2FkL2NvbnN0YW50LnRzIiwgInV0aWxzL3BsdWdpbnMvaW5saW5lLXZpdGUtcHJlbG9hZC1zY3JpcHQudHMiLCAidXRpbHMvdml0ZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9tYWMvRGVza3RvcC9naXRodWItcHJvamVjdC9leHRlbnNpb24tYXBpLXJlY29yZGVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWFjL0Rlc2t0b3AvZ2l0aHViLXByb2plY3QvZXh0ZW5zaW9uLWFwaS1yZWNvcmRlci92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWFjL0Rlc2t0b3AvZ2l0aHViLXByb2plY3QvZXh0ZW5zaW9uLWFwaS1yZWNvcmRlci92aXRlLmNvbmZpZy50c1wiOy8vLyA8cmVmZXJlbmNlIHR5cGVzPVwidml0ZXN0XCIgLz5cbi8qKiBAdHlwZSB7aW1wb3J0KCd2aXRlJykuVXNlckNvbmZpZ30gKi9cbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJztcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5cbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICd0YWlsd2luZGNzcyc7XG5cbmltcG9ydCBwYXRoLCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcblxuaW1wb3J0IHsgZ2V0UGx1Z2lucyB9IGZyb20gJy4vdXRpbHMvdml0ZSc7XG5pbXBvcnQgYWRkSG1yIGZyb20gJy4vdXRpbHMvcGx1Z2lucy9hZGQtaG1yJztcbmltcG9ydCBpbmxpbmVWaXRlUHJlbG9hZFNjcmlwdCBmcm9tICcuL3V0aWxzL3BsdWdpbnMvaW5saW5lLXZpdGUtcHJlbG9hZC1zY3JpcHQnO1xuaW1wb3J0IHdhdGNoUmVidWlsZCBmcm9tICcuL3V0aWxzL3BsdWdpbnMvd2F0Y2gtcmVidWlsZCc7XG5cbmNvbnN0IHJvb3REaXIgPSByZXNvbHZlKF9fZGlybmFtZSk7XG5jb25zdCBzcmNEaXIgPSByZXNvbHZlKHJvb3REaXIsICdzcmMnKTtcbmNvbnN0IHBhZ2VzRGlyID0gcmVzb2x2ZShzcmNEaXIsICdwYWdlcycpO1xuXG5jb25zdCBpc0RldiA9IHByb2Nlc3MuZW52Ll9fREVWX18gPT09ICd0cnVlJztcbmNvbnN0IGlzUHJvZHVjdGlvbiA9ICFpc0RldjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQHJvb3QnOiByb290RGlyLFxuICAgICAgJ0BzcmMnOiBzcmNEaXIsXG4gICAgICAnQGFzc2V0cyc6IHJlc29sdmUoc3JjRGlyLCAnYXNzZXRzJyksXG4gICAgICAnQHBhZ2VzJzogcGFnZXNEaXIsXG4gICAgfSxcbiAgfSxcbiAgY3NzOiB7XG4gICAgcG9zdGNzczoge1xuICAgICAgcGx1Z2luczogW3RhaWx3aW5kY3NzLCBhdXRvcHJlZml4ZXJdLFxuICAgIH0sXG4gIH0sXG4gIC8vIHBsdWdpbnM6IFsuLi5nZXRQbHVnaW5zKGlzRGV2KSwgcmVhY3QoKV0sXG4gIHB1YmxpY0RpcjogcmVzb2x2ZShyb290RGlyLCAncHVibGljJyksXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ2Zha2VyJ10sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiByZXNvbHZlKHJvb3REaXIsICdkaXN0JyksXG4gICAgLyoqIENhbiBzbG93IGRvd24gYnVpbGQgc3BlZWQuICovXG4gICAgLy8gc291cmNlbWFwOiBpc0RldixcbiAgICBtaW5pZnk6IGlzUHJvZHVjdGlvbixcbiAgICBtb2R1bGVQcmVsb2FkOiBmYWxzZSxcbiAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogaXNQcm9kdWN0aW9uLFxuICAgIGVtcHR5T3V0RGlyOiAhaXNEZXYsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgY29udGVudEluamVjdGVkOiByZXNvbHZlKHBhZ2VzRGlyLCAnY29udGVudCcsICdpbmplY3RlZCcsICdpbmRleC50cycpLFxuICAgICAgICBjb250ZW50VUk6IHJlc29sdmUocGFnZXNEaXIsICdjb250ZW50JywgJ3VpJywgJ2luZGV4LnRzJyksXG4gICAgICAgIGJhY2tncm91bmQ6IHJlc29sdmUocGFnZXNEaXIsICdiYWNrZ3JvdW5kJywgJ2luZGV4LnRzJyksXG4gICAgICAgIGNvbnRlbnRTdHlsZTogcmVzb2x2ZShwYWdlc0RpciwgJ2NvbnRlbnQnLCAnc3R5bGUuc2NzcycpLFxuICAgICAgICBwb3B1cDogcmVzb2x2ZShwYWdlc0RpciwgJ3BvcHVwJywgJ2luZGV4Lmh0bWwnKSxcbiAgICAgICAgb3B0aW9uczogcmVzb2x2ZShwYWdlc0RpciwgJ29wdGlvbnMnLCAnaW5kZXguaHRtbCcpLFxuICAgICAgfSxcblxuICAgICAgb3V0cHV0OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ3NyYy9wYWdlcy9jb250ZW50L2luamVjdGVkL3hoci50cycsXG4gICAgICAgICAgZm9ybWF0OiAnaWlmZScsXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW2V4dF0vW25hbWVdLltleHRdJyxcbiAgICAgICAgICBpbmxpbmVEeW5hbWljSW1wb3J0czpmYWxzZSxcbiAgICAgICAgICBwbHVnaW5zOltcbiAgICAgICAgICAgIC8vIFlvdSBjYW4gdG9nZ2xlIGVuYWJsZSBITVIgaW4gYmFja2dyb3VuZCBzY3JpcHQgb3Igdmlld1xuICAgICAgICAgICAgYWRkSG1yKHsgYmFja2dyb3VuZDogdHJ1ZSwgdmlldzogdHJ1ZSwgaXNEZXYgfSksXG4gICAgICAgICAgICBpbmxpbmVWaXRlUHJlbG9hZFNjcmlwdCgpLFxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHBsdWdpbnM6Wy4uLmdldFBsdWdpbnMoaXNEZXYpLCByZWFjdCgpXSxcbiAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ3NyYy9wYWdlcy9bbmFtZV0vaW5kZXguanMnLFxuICAgICAgICAgIC8vIGNodW5rRmlsZU5hbWVzOiBpc0RldiA/ICdhc3NldHMvanMvW25hbWVdLltoYXNoXS5qcycgOiAnYXNzZXRzL2pzL1tuYW1lXS5baGFzaF0uanMnLFxuICAgICAgICAgIGNodW5rRmlsZU5hbWVzOiBpc0RldiA/ICdhc3NldHMvanMvW25hbWVdLmpzJyA6ICdhc3NldHMvanMvW25hbWVdLmpzJyxcbiAgICAgICAgICBhc3NldEZpbGVOYW1lczogYXNzZXRJbmZvID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgbmFtZSB9ID0gcGF0aC5wYXJzZShhc3NldEluZm8ubmFtZSk7XG4gICAgICAgICAgICBjb25zdCBhc3NldEZpbGVOYW1lID0gbmFtZSA9PT0gJ2NvbnRlbnRTdHlsZScgPyBgJHtuYW1lfWAgOiBuYW1lO1xuICAgICAgICAgICAgcmV0dXJuIGBhc3NldHMvW2V4dF0vJHthc3NldEZpbGVOYW1lfS5jaHVuay5bZXh0XWA7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcbiAgdGVzdDoge1xuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgaW5jbHVkZTogWycqKi8qLnRlc3QudHMnLCAnKiovKi50ZXN0LnRzeCddLFxuICAgIHNldHVwRmlsZXM6ICcuL3Rlc3QtdXRpbHMvdml0ZXN0LnNldHVwLmpzJyxcbiAgfSxcbn0pO1xuXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9tYWMvRGVza3RvcC9naXRodWItcHJvamVjdC9leHRlbnNpb24tYXBpLXJlY29yZGVyL3V0aWxzL3BsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tYWMvRGVza3RvcC9naXRodWItcHJvamVjdC9leHRlbnNpb24tYXBpLXJlY29yZGVyL3V0aWxzL3BsdWdpbnMvbWFrZS1tYW5pZmVzdC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWFjL0Rlc2t0b3AvZ2l0aHViLXByb2plY3QvZXh0ZW5zaW9uLWFwaS1yZWNvcmRlci91dGlscy9wbHVnaW5zL21ha2UtbWFuaWZlc3QudHNcIjtpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5cbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCB0eXBlIHsgUGx1Z2luT3B0aW9uIH0gZnJvbSAndml0ZSc7XG5cbmltcG9ydCB1cmwgZnJvbSAndXJsJztcblxuaW1wb3J0ICogYXMgcHJvY2VzcyBmcm9tICdwcm9jZXNzJztcblxuaW1wb3J0IGNvbG9yTG9nIGZyb20gJy4uL2xvZyc7XG5pbXBvcnQgTWFuaWZlc3RQYXJzZXIgZnJvbSAnLi4vbWFuaWZlc3QtcGFyc2VyJztcblxuY29uc3QgeyByZXNvbHZlIH0gPSBwYXRoO1xuXG5jb25zdCByb290RGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsICcuLicsICcuLicpO1xuY29uc3QgZGlzdERpciA9IHJlc29sdmUocm9vdERpciwgJ2Rpc3QnKTtcbmNvbnN0IG1hbmlmZXN0RmlsZSA9IHJlc29sdmUocm9vdERpciwgJ21hbmlmZXN0LmpzJyk7XG5cbmNvbnN0IGdldE1hbmlmZXN0V2l0aENhY2hlQnVyc3QgPSAoKTogUHJvbWlzZTx7IGRlZmF1bHQ6IGNocm9tZS5ydW50aW1lLk1hbmlmZXN0VjMgfT4gPT4ge1xuICBjb25zdCB3aXRoQ2FjaGVCdXJzdCA9IChwYXRoOiBzdHJpbmcpID0+IGAke3BhdGh9PyR7RGF0ZS5ub3coKS50b1N0cmluZygpfWA7XG4gIC8qKlxuICAgKiBJbiBXaW5kb3dzLCBpbXBvcnQoKSBkb2Vzbid0IHdvcmsgd2l0aG91dCBmaWxlOi8vIHByb3RvY29sLlxuICAgKiBTbywgd2UgbmVlZCB0byBjb252ZXJ0IHBhdGggdG8gZmlsZTovLyBwcm90b2NvbC4gKHVybC5wYXRoVG9GaWxlVVJMKVxuICAgKi9cbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcbiAgICByZXR1cm4gaW1wb3J0KHdpdGhDYWNoZUJ1cnN0KHVybC5wYXRoVG9GaWxlVVJMKG1hbmlmZXN0RmlsZSkuaHJlZikpO1xuICB9XG4gIHJldHVybiBpbXBvcnQod2l0aENhY2hlQnVyc3QobWFuaWZlc3RGaWxlKSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYWtlTWFuaWZlc3QoY29uZmlnPzogeyBnZXRDYWNoZUludmFsaWRhdGlvbktleT86ICgpID0+IHN0cmluZyB9KTogUGx1Z2luT3B0aW9uIHtcbiAgZnVuY3Rpb24gbWFrZU1hbmlmZXN0KG1hbmlmZXN0OiBjaHJvbWUucnVudGltZS5NYW5pZmVzdFYzLCB0bzogc3RyaW5nLCBjYWNoZUtleT86IHN0cmluZykge1xuICAgIGlmICghZnMuZXhpc3RzU3luYyh0bykpIHtcbiAgICAgIGZzLm1rZGlyU3luYyh0byk7XG4gICAgfVxuICAgIGNvbnN0IG1hbmlmZXN0UGF0aCA9IHJlc29sdmUodG8sICdtYW5pZmVzdC5qc29uJyk7XG4gICAgaWYgKGNhY2hlS2V5ICYmIG1hbmlmZXN0LmNvbnRlbnRfc2NyaXB0cykge1xuICAgICAgLy8gTmFtaW5nIGNoYW5nZSBmb3IgY2FjaGUgaW52YWxpZGF0aW9uXG4gICAgICBtYW5pZmVzdC5jb250ZW50X3NjcmlwdHMuZm9yRWFjaChzY3JpcHQgPT4ge1xuICAgICAgICBzY3JpcHQuY3NzICYmPSBzY3JpcHQuY3NzLm1hcChjc3MgPT4gY3NzLnJlcGxhY2UoJzxLRVk+JywgY2FjaGVLZXkpKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZzLndyaXRlRmlsZVN5bmMobWFuaWZlc3RQYXRoLCBNYW5pZmVzdFBhcnNlci5jb252ZXJ0TWFuaWZlc3RUb1N0cmluZyhtYW5pZmVzdCkpO1xuXG4gICAgY29sb3JMb2coYE1hbmlmZXN0IGZpbGUgY29weSBjb21wbGV0ZTogJHttYW5pZmVzdFBhdGh9YCwgJ3N1Y2Nlc3MnKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ21ha2UtbWFuaWZlc3QnLFxuICAgIGJ1aWxkU3RhcnQoKSB7XG4gICAgICB0aGlzLmFkZFdhdGNoRmlsZShtYW5pZmVzdEZpbGUpO1xuICAgIH0sXG4gICAgYXN5bmMgd3JpdGVCdW5kbGUoKSB7XG4gICAgICBjb25zdCBpbnZhbGlkYXRpb25LZXkgPSBjb25maWcuZ2V0Q2FjaGVJbnZhbGlkYXRpb25LZXk/LigpO1xuICAgICAgY29uc3QgbWFuaWZlc3QgPSBhd2FpdCBnZXRNYW5pZmVzdFdpdGhDYWNoZUJ1cnN0KCk7XG4gICAgICBtYWtlTWFuaWZlc3QobWFuaWZlc3QuZGVmYXVsdCwgZGlzdERpciwgaW52YWxpZGF0aW9uS2V5KTtcbiAgICB9LFxuICB9O1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWFjL0Rlc2t0b3AvZ2l0aHViLXByb2plY3QvZXh0ZW5zaW9uLWFwaS1yZWNvcmRlci91dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL21hYy9EZXNrdG9wL2dpdGh1Yi1wcm9qZWN0L2V4dGVuc2lvbi1hcGktcmVjb3JkZXIvdXRpbHMvbG9nLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tYWMvRGVza3RvcC9naXRodWItcHJvamVjdC9leHRlbnNpb24tYXBpLXJlY29yZGVyL3V0aWxzL2xvZy50c1wiO3R5cGUgQ29sb3JUeXBlID0gJ3N1Y2Nlc3MnIHwgJ2luZm8nIHwgJ2Vycm9yJyB8ICd3YXJuaW5nJyB8IGtleW9mIHR5cGVvZiBDT0xPUlM7XG50eXBlIFZhbHVlT2Y8VD4gPSBUW2tleW9mIFRdO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb2xvckxvZyhtZXNzYWdlOiBzdHJpbmcsIHR5cGU6IENvbG9yVHlwZSkge1xuICBsZXQgY29sb3I6IFZhbHVlT2Y8dHlwZW9mIENPTE9SUz47XG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnc3VjY2Vzcyc6XG4gICAgICBjb2xvciA9IENPTE9SUy5GZ0dyZWVuO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnaW5mbyc6XG4gICAgICBjb2xvciA9IENPTE9SUy5GZ0JsdWU7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdlcnJvcic6XG4gICAgICBjb2xvciA9IENPTE9SUy5GZ1JlZDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3dhcm5pbmcnOlxuICAgICAgY29sb3IgPSBDT0xPUlMuRmdZZWxsb3c7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgY29sb3IgPSBDT0xPUlNbdHlwZV07XG4gICAgICBicmVhaztcbiAgfVxuXG4gIGNvbnNvbGUubG9nKGNvbG9yLCBtZXNzYWdlKTtcbn1cblxuY29uc3QgQ09MT1JTID0ge1xuICBSZXNldDogJ1xceDFiWzBtJyxcbiAgQnJpZ2h0OiAnXFx4MWJbMW0nLFxuICBEaW06ICdcXHgxYlsybScsXG4gIFVuZGVyc2NvcmU6ICdcXHgxYls0bScsXG4gIEJsaW5rOiAnXFx4MWJbNW0nLFxuICBSZXZlcnNlOiAnXFx4MWJbN20nLFxuICBIaWRkZW46ICdcXHgxYls4bScsXG4gIEZnQmxhY2s6ICdcXHgxYlszMG0nLFxuICBGZ1JlZDogJ1xceDFiWzMxbScsXG4gIEZnR3JlZW46ICdcXHgxYlszMm0nLFxuICBGZ1llbGxvdzogJ1xceDFiWzMzbScsXG4gIEZnQmx1ZTogJ1xceDFiWzM0bScsXG4gIEZnTWFnZW50YTogJ1xceDFiWzM1bScsXG4gIEZnQ3lhbjogJ1xceDFiWzM2bScsXG4gIEZnV2hpdGU6ICdcXHgxYlszN20nLFxuICBCZ0JsYWNrOiAnXFx4MWJbNDBtJyxcbiAgQmdSZWQ6ICdcXHgxYls0MW0nLFxuICBCZ0dyZWVuOiAnXFx4MWJbNDJtJyxcbiAgQmdZZWxsb3c6ICdcXHgxYls0M20nLFxuICBCZ0JsdWU6ICdcXHgxYls0NG0nLFxuICBCZ01hZ2VudGE6ICdcXHgxYls0NW0nLFxuICBCZ0N5YW46ICdcXHgxYls0Nm0nLFxuICBCZ1doaXRlOiAnXFx4MWJbNDdtJyxcbn0gYXMgY29uc3Q7XG5cbmNvbnN0IEtFWV9ERUJVRyA9ICdhcGlfcmVjb3JkZXJfZGVidWcnO1xubGV0IGlzX2RlYnVnX21vZGU7XG50cnkge1xuICBpc19kZWJ1Z19tb2RlID0gd2luZG93LmxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoJ2FsaXBheS5uZXQnKTtcbn0gY2F0Y2ggKGVycm9yKSB7XG4gIGNvbnNvbGUud2FybignbG9jYWxTdG9yYWdlIGVycm9yJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dnZXIoLi4uYXJncykge1xuICBpZiAoIWlzX2RlYnVnX21vZGUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGFyZ3MubGVuZ3RoID09PSAyICYmIFsnc3VjY2VzcyddLmluY2x1ZGVzKGFyZ3NbMV0pKSB7XG4gICAgY29sb3JMb2coYXJnc1sxXSwgYXJnc1swXSk7XG4gIH1cbiAgY29uc29sZS5sb2coQ09MT1JTLkZnR3JlZW4sIC4uLmFyZ3MpO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWFjL0Rlc2t0b3AvZ2l0aHViLXByb2plY3QvZXh0ZW5zaW9uLWFwaS1yZWNvcmRlci91dGlscy9tYW5pZmVzdC1wYXJzZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tYWMvRGVza3RvcC9naXRodWItcHJvamVjdC9leHRlbnNpb24tYXBpLXJlY29yZGVyL3V0aWxzL21hbmlmZXN0LXBhcnNlci9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWFjL0Rlc2t0b3AvZ2l0aHViLXByb2plY3QvZXh0ZW5zaW9uLWFwaS1yZWNvcmRlci91dGlscy9tYW5pZmVzdC1wYXJzZXIvaW5kZXgudHNcIjt0eXBlIE1hbmlmZXN0ID0gY2hyb21lLnJ1bnRpbWUuTWFuaWZlc3RWMztcblxuY2xhc3MgTWFuaWZlc3RQYXJzZXIge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWVtcHR5LWZ1bmN0aW9uXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxuXG4gIHN0YXRpYyBjb252ZXJ0TWFuaWZlc3RUb1N0cmluZyhtYW5pZmVzdDogTWFuaWZlc3QpOiBzdHJpbmcge1xuICAgIGlmIChwcm9jZXNzLmVudi5fX0ZJUkVGT1hfXykge1xuICAgICAgbWFuaWZlc3QgPSB0aGlzLmNvbnZlcnRUb0ZpcmVmb3hDb21wYXRpYmxlTWFuaWZlc3QobWFuaWZlc3QpO1xuICAgIH1cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobWFuaWZlc3QsIG51bGwsIDIpO1xuICB9XG5cbiAgc3RhdGljIGNvbnZlcnRUb0ZpcmVmb3hDb21wYXRpYmxlTWFuaWZlc3QobWFuaWZlc3Q6IE1hbmlmZXN0KSB7XG4gICAgY29uc3QgbWFuaWZlc3RDb3B5ID0ge1xuICAgICAgLi4ubWFuaWZlc3QsXG4gICAgfSBhcyB7IFtrZXk6IHN0cmluZ106IHVua25vd24gfTtcblxuICAgIG1hbmlmZXN0Q29weS5iYWNrZ3JvdW5kID0ge1xuICAgICAgc2NyaXB0czogW21hbmlmZXN0LmJhY2tncm91bmQ/LnNlcnZpY2Vfd29ya2VyXSxcbiAgICAgIHR5cGU6ICdtb2R1bGUnLFxuICAgIH07XG4gICAgbWFuaWZlc3RDb3B5Lm9wdGlvbnNfdWkgPSB7XG4gICAgICBwYWdlOiBtYW5pZmVzdC5vcHRpb25zX3BhZ2UsXG4gICAgICBicm93c2VyX3N0eWxlOiBmYWxzZSxcbiAgICB9O1xuICAgIG1hbmlmZXN0Q29weS5jb250ZW50X3NlY3VyaXR5X3BvbGljeSA9IHtcbiAgICAgIGV4dGVuc2lvbl9wYWdlczogXCJzY3JpcHQtc3JjICdzZWxmJzsgb2JqZWN0LXNyYyAnc2VsZidcIixcbiAgICB9O1xuICAgIGRlbGV0ZSBtYW5pZmVzdENvcHkub3B0aW9uc19wYWdlO1xuICAgIHJldHVybiBtYW5pZmVzdENvcHkgYXMgTWFuaWZlc3Q7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFuaWZlc3RQYXJzZXI7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9tYWMvRGVza3RvcC9naXRodWItcHJvamVjdC9leHRlbnNpb24tYXBpLXJlY29yZGVyL3V0aWxzL3BsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tYWMvRGVza3RvcC9naXRodWItcHJvamVjdC9leHRlbnNpb24tYXBpLXJlY29yZGVyL3V0aWxzL3BsdWdpbnMvY3VzdG9tLWR5bmFtaWMtaW1wb3J0LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tYWMvRGVza3RvcC9naXRodWItcHJvamVjdC9leHRlbnNpb24tYXBpLXJlY29yZGVyL3V0aWxzL3BsdWdpbnMvY3VzdG9tLWR5bmFtaWMtaW1wb3J0LnRzXCI7aW1wb3J0IHR5cGUgeyBQbHVnaW5PcHRpb24gfSBmcm9tICd2aXRlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3VzdG9tRHluYW1pY0ltcG9ydCgpOiBQbHVnaW5PcHRpb24ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdjdXN0b20tZHluYW1pYy1pbXBvcnQnLFxuICAgIHJlbmRlckR5bmFtaWNJbXBvcnQoeyBtb2R1bGVJZCB9KSB7XG4gICAgICBpZiAoIW1vZHVsZUlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSAmJiBwcm9jZXNzLmVudi5fX0ZJUkVGT1hfXykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGxlZnQ6IGBcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBkeW5hbWljSW1wb3J0ID0gKHBhdGgpID0+IGltcG9ydChwYXRoKTtcbiAgICAgICAgICAgIGR5bmFtaWNJbXBvcnQoYnJvd3Nlci5ydW50aW1lLmdldFVSTCgnLi8nKSArIFxuICAgICAgICAgICAgYCxcbiAgICAgICAgICByaWdodDogXCIuc3BsaXQoJy4uLycpLmpvaW4oJycpKX1cIixcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxlZnQ6ICdpbXBvcnQoJyxcbiAgICAgICAgcmlnaHQ6ICcpJyxcbiAgICAgIH07XG4gICAgfSxcbiAgfTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL21hYy9EZXNrdG9wL2dpdGh1Yi1wcm9qZWN0L2V4dGVuc2lvbi1hcGktcmVjb3JkZXIvdXRpbHMvcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL21hYy9EZXNrdG9wL2dpdGh1Yi1wcm9qZWN0L2V4dGVuc2lvbi1hcGktcmVjb3JkZXIvdXRpbHMvcGx1Z2lucy9hZGQtaG1yLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tYWMvRGVza3RvcC9naXRodWItcHJvamVjdC9leHRlbnNpb24tYXBpLXJlY29yZGVyL3V0aWxzL3BsdWdpbnMvYWRkLWhtci50c1wiO2ltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQgdHlwZSB7IFBsdWdpbk9wdGlvbiB9IGZyb20gJ3ZpdGUnO1xuXG5jb25zdCBEVU1NWV9DT0RFID0gYGV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCl7fTtgO1xuXG5mdW5jdGlvbiBnZXRJbmplY3Rpb25Db2RlKGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLicsICdyZWxvYWQnLCAnaW5qZWN0aW9ucycsIGZpbGVOYW1lKSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xufVxuXG50eXBlIENvbmZpZyA9IHtcbiAgaXNEZXY6IGJvb2xlYW47XG4gIGJhY2tncm91bmQ6IGJvb2xlYW47XG4gIHZpZXc6IGJvb2xlYW47XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRIbXIoY29uZmlnOiBDb25maWcpOiBQbHVnaW5PcHRpb24ge1xuICBjb25zdCB7IGJhY2tncm91bmQsIHZpZXcsIGlzRGV2IH0gPSBjb25maWc7XG4gIGNvbnN0IGlkSW5CYWNrZ3JvdW5kU2NyaXB0ID0gJ3ZpcnR1YWw6cmVsb2FkLW9uLXVwZGF0ZS1pbi1iYWNrZ3JvdW5kLXNjcmlwdCc7XG4gIGNvbnN0IGlkSW5WaWV3ID0gJ3ZpcnR1YWw6cmVsb2FkLW9uLXVwZGF0ZS1pbi12aWV3JztcblxuICBjb25zdCBzY3JpcHRIbXJDb2RlID0gaXNEZXYgPyBnZXRJbmplY3Rpb25Db2RlKCdzY3JpcHQuanMnKSA6IERVTU1ZX0NPREU7XG4gIGNvbnN0IHZpZXdIbXJDb2RlID0gaXNEZXYgPyBnZXRJbmplY3Rpb25Db2RlKCd2aWV3LmpzJykgOiBEVU1NWV9DT0RFO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ2FkZC1obXInLFxuICAgIHJlc29sdmVJZChpZCkge1xuICAgICAgaWYgKGlkID09PSBpZEluQmFja2dyb3VuZFNjcmlwdCB8fCBpZCA9PT0gaWRJblZpZXcpIHtcbiAgICAgICAgcmV0dXJuIGdldFJlc29sdmVkSWQoaWQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgbG9hZChpZCkge1xuICAgICAgaWYgKGlkID09PSBnZXRSZXNvbHZlZElkKGlkSW5CYWNrZ3JvdW5kU2NyaXB0KSkge1xuICAgICAgICByZXR1cm4gYmFja2dyb3VuZCA/IHNjcmlwdEhtckNvZGUgOiBEVU1NWV9DT0RFO1xuICAgICAgfVxuXG4gICAgICBpZiAoaWQgPT09IGdldFJlc29sdmVkSWQoaWRJblZpZXcpKSB7XG4gICAgICAgIHJldHVybiB2aWV3ID8gdmlld0htckNvZGUgOiBEVU1NWV9DT0RFO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldFJlc29sdmVkSWQoaWQ6IHN0cmluZykge1xuICByZXR1cm4gJ1xcMCcgKyBpZDtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL21hYy9EZXNrdG9wL2dpdGh1Yi1wcm9qZWN0L2V4dGVuc2lvbi1hcGktcmVjb3JkZXIvdXRpbHMvcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL21hYy9EZXNrdG9wL2dpdGh1Yi1wcm9qZWN0L2V4dGVuc2lvbi1hcGktcmVjb3JkZXIvdXRpbHMvcGx1Z2lucy93YXRjaC1yZWJ1aWxkLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tYWMvRGVza3RvcC9naXRodWItcHJvamVjdC9leHRlbnNpb24tYXBpLXJlY29yZGVyL3V0aWxzL3BsdWdpbnMvd2F0Y2gtcmVidWlsZC50c1wiO2ltcG9ydCB0eXBlIHsgUGx1Z2luT3B0aW9uIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBXZWJTb2NrZXQgfSBmcm9tICd3cyc7XG5pbXBvcnQgTWVzc2FnZUludGVycHJldGVyIGZyb20gJy4uL3JlbG9hZC9pbnRlcnByZXRlcic7XG5pbXBvcnQgeyBMT0NBTF9SRUxPQURfU09DS0VUX1VSTCB9IGZyb20gJy4uL3JlbG9hZC9jb25zdGFudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHdhdGNoUmVidWlsZChjb25maWc6IHsgYWZ0ZXJXcml0ZUJ1bmRsZTogKCkgPT4gdm9pZCB9KTogUGx1Z2luT3B0aW9uIHtcbiAgY29uc3Qgd3MgPSBuZXcgV2ViU29ja2V0KExPQ0FMX1JFTE9BRF9TT0NLRVRfVVJMKTtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnd2F0Y2gtcmVidWlsZCcsXG4gICAgd3JpdGVCdW5kbGUoKSB7XG4gICAgICAvKipcbiAgICAgICAqIFdoZW4gdGhlIGJ1aWxkIGlzIGNvbXBsZXRlLCBzZW5kIGEgbWVzc2FnZSB0byB0aGUgcmVsb2FkIHNlcnZlci5cbiAgICAgICAqIFRoZSByZWxvYWQgc2VydmVyIHdpbGwgc2VuZCBhIG1lc3NhZ2UgdG8gdGhlIGNsaWVudCB0byByZWxvYWQgb3IgcmVmcmVzaCB0aGUgZXh0ZW5zaW9uLlxuICAgICAgICovXG4gICAgICB3cy5zZW5kKE1lc3NhZ2VJbnRlcnByZXRlci5zZW5kKHsgdHlwZTogJ2J1aWxkX2NvbXBsZXRlJyB9KSk7XG5cbiAgICAgIHNlbmROZXh0UXVldWUoKCkgPT4ge1xuICAgICAgICBjb25maWcuYWZ0ZXJXcml0ZUJ1bmRsZSgpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gc2VuZE5leHRRdWV1ZShjYWxsYmFjazogKCkgPT4gdm9pZCkge1xuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBjYWxsYmFjaygpO1xuICB9LCAwKTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL21hYy9EZXNrdG9wL2dpdGh1Yi1wcm9qZWN0L2V4dGVuc2lvbi1hcGktcmVjb3JkZXIvdXRpbHMvcmVsb2FkL2ludGVycHJldGVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWFjL0Rlc2t0b3AvZ2l0aHViLXByb2plY3QvZXh0ZW5zaW9uLWFwaS1yZWNvcmRlci91dGlscy9yZWxvYWQvaW50ZXJwcmV0ZXIvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL21hYy9EZXNrdG9wL2dpdGh1Yi1wcm9qZWN0L2V4dGVuc2lvbi1hcGktcmVjb3JkZXIvdXRpbHMvcmVsb2FkL2ludGVycHJldGVyL2luZGV4LnRzXCI7aW1wb3J0IHR5cGUgeyBXZWJTb2NrZXRNZXNzYWdlLCBTZXJpYWxpemVkTWVzc2FnZSB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlSW50ZXJwcmV0ZXIge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWVtcHR5LWZ1bmN0aW9uXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxuXG4gIHN0YXRpYyBzZW5kKG1lc3NhZ2U6IFdlYlNvY2tldE1lc3NhZ2UpOiBTZXJpYWxpemVkTWVzc2FnZSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpO1xuICB9XG4gIHN0YXRpYyByZWNlaXZlKHNlcmlhbGl6ZWRNZXNzYWdlOiBTZXJpYWxpemVkTWVzc2FnZSk6IFdlYlNvY2tldE1lc3NhZ2Uge1xuICAgIHJldHVybiBKU09OLnBhcnNlKHNlcmlhbGl6ZWRNZXNzYWdlKTtcbiAgfVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWFjL0Rlc2t0b3AvZ2l0aHViLXByb2plY3QvZXh0ZW5zaW9uLWFwaS1yZWNvcmRlci91dGlscy9yZWxvYWRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tYWMvRGVza3RvcC9naXRodWItcHJvamVjdC9leHRlbnNpb24tYXBpLXJlY29yZGVyL3V0aWxzL3JlbG9hZC9jb25zdGFudC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWFjL0Rlc2t0b3AvZ2l0aHViLXByb2plY3QvZXh0ZW5zaW9uLWFwaS1yZWNvcmRlci91dGlscy9yZWxvYWQvY29uc3RhbnQudHNcIjtleHBvcnQgY29uc3QgTE9DQUxfUkVMT0FEX1NPQ0tFVF9QT1JUID0gODA4MTtcbmV4cG9ydCBjb25zdCBMT0NBTF9SRUxPQURfU09DS0VUX1VSTCA9IGB3czovL2xvY2FsaG9zdDoke0xPQ0FMX1JFTE9BRF9TT0NLRVRfUE9SVH1gO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWFjL0Rlc2t0b3AvZ2l0aHViLXByb2plY3QvZXh0ZW5zaW9uLWFwaS1yZWNvcmRlci91dGlscy9wbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWFjL0Rlc2t0b3AvZ2l0aHViLXByb2plY3QvZXh0ZW5zaW9uLWFwaS1yZWNvcmRlci91dGlscy9wbHVnaW5zL2lubGluZS12aXRlLXByZWxvYWQtc2NyaXB0LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tYWMvRGVza3RvcC9naXRodWItcHJvamVjdC9leHRlbnNpb24tYXBpLXJlY29yZGVyL3V0aWxzL3BsdWdpbnMvaW5saW5lLXZpdGUtcHJlbG9hZC1zY3JpcHQudHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbk9wdGlvbiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IE1hZ2ljU3RyaW5nIGZyb20gJ21hZ2ljLXN0cmluZyc7XG5cbi8qKlxuICogc29sdXRpb24gZm9yIG11bHRpcGxlIGNvbnRlbnQgc2NyaXB0c1xuICogaHR0cHM6Ly9naXRodWIuY29tL0pvbmdoYWtzZW8vY2hyb21lLWV4dGVuc2lvbi1ib2lsZXJwbGF0ZS1yZWFjdC12aXRlL2lzc3Vlcy8xNzcjaXNzdWVjb21tZW50LTE3ODQxMTI1MzZcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW5saW5lVml0ZVByZWxvYWRTY3JpcHQoKTogUGx1Z2luT3B0aW9uIHtcbiAgbGV0IF9fdml0ZVByZWxvYWQgPSAnJztcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAncmVwbGFjZS12aXRlLXByZWxvYWQtc2NyaXB0LXBsdWdpbicsXG4gICAgYXN5bmMgcmVuZGVyQ2h1bmsoY29kZSwgY2h1bmssIG9wdGlvbnMsIG1ldGEpIHtcbiAgICAgIGlmICghL2NvbnRlbnQvLnRlc3QoY2h1bmsuZmlsZU5hbWUpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKCFfX3ZpdGVQcmVsb2FkKSB7XG4gICAgICAgIGNvbnN0IGNodW5rTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gT2JqZWN0LmtleXMobWV0YS5jaHVua3MpLmZpbmQoa2V5ID0+IC9wcmVsb2FkLy50ZXN0KGtleSkpO1xuICAgICAgICBjb25zdCBtb2R1bGVzID0gbWV0YS5jaHVua3M/LltjaHVua05hbWVdPy5tb2R1bGVzO1xuICAgICAgICBfX3ZpdGVQcmVsb2FkID0gbW9kdWxlcz8uW09iamVjdC5rZXlzKG1vZHVsZXMpPy5bMF1dPy5jb2RlO1xuICAgICAgICBfX3ZpdGVQcmVsb2FkID0gX192aXRlUHJlbG9hZD8ucmVwbGFjZUFsbCgnY29uc3QgJywgJ3ZhciAnKTtcbiAgICAgICAgaWYgKCFfX3ZpdGVQcmVsb2FkKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvZGU6IF9fdml0ZVByZWxvYWQgKyBjb2RlLnNwbGl0KGBcXG5gKS5zbGljZSgxKS5qb2luKGBcXG5gKSxcbiAgICAgICAgbWFwOiBuZXcgTWFnaWNTdHJpbmcoY29kZSkuZ2VuZXJhdGVNYXAoeyBoaXJlczogdHJ1ZSB9KSxcbiAgICAgIH07XG4gICAgfSxcbiAgfTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL21hYy9EZXNrdG9wL2dpdGh1Yi1wcm9qZWN0L2V4dGVuc2lvbi1hcGktcmVjb3JkZXIvdXRpbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tYWMvRGVza3RvcC9naXRodWItcHJvamVjdC9leHRlbnNpb24tYXBpLXJlY29yZGVyL3V0aWxzL3ZpdGUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL21hYy9EZXNrdG9wL2dpdGh1Yi1wcm9qZWN0L2V4dGVuc2lvbi1hcGktcmVjb3JkZXIvdXRpbHMvdml0ZS50c1wiO2ltcG9ydCB7IHR5cGUgUGx1Z2luT3B0aW9uIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgbWFrZU1hbmlmZXN0IGZyb20gJy4vcGx1Z2lucy9tYWtlLW1hbmlmZXN0JztcbmltcG9ydCBjdXN0b21EeW5hbWljSW1wb3J0IGZyb20gJy4vcGx1Z2lucy9jdXN0b20tZHluYW1pYy1pbXBvcnQnO1xuaW1wb3J0IGFkZEhtciBmcm9tICcuL3BsdWdpbnMvYWRkLWhtcic7XG5pbXBvcnQgd2F0Y2hSZWJ1aWxkIGZyb20gJy4vcGx1Z2lucy93YXRjaC1yZWJ1aWxkJztcbmltcG9ydCBpbmxpbmVWaXRlUHJlbG9hZFNjcmlwdCBmcm9tICcuL3BsdWdpbnMvaW5saW5lLXZpdGUtcHJlbG9hZC1zY3JpcHQnO1xuXG5leHBvcnQgY29uc3QgZ2V0UGx1Z2lucyA9IChpc0RldjogYm9vbGVhbik6IFBsdWdpbk9wdGlvbltdID0+IFtcbiAgbWFrZU1hbmlmZXN0KHsgZ2V0Q2FjaGVJbnZhbGlkYXRpb25LZXkgfSksXG4gIGN1c3RvbUR5bmFtaWNJbXBvcnQoKSxcbiAgLy8gWW91IGNhbiB0b2dnbGUgZW5hYmxlIEhNUiBpbiBiYWNrZ3JvdW5kIHNjcmlwdCBvciB2aWV3XG4gIGFkZEhtcih7IGJhY2tncm91bmQ6IHRydWUsIHZpZXc6IHRydWUsIGlzRGV2IH0pLFxuICBpc0RldiAmJiB3YXRjaFJlYnVpbGQoeyBhZnRlcldyaXRlQnVuZGxlOiByZWdlbmVyYXRlQ2FjaGVJbnZhbGlkYXRpb25LZXkgfSksXG4gIC8vIEZvciBmaXggaXNzdWUjMTc3IChodHRwczovL2dpdGh1Yi5jb20vSm9uZ2hha3Nlby9jaHJvbWUtZXh0ZW5zaW9uLWJvaWxlcnBsYXRlLXJlYWN0LXZpdGUvaXNzdWVzLzE3NylcbiAgaW5saW5lVml0ZVByZWxvYWRTY3JpcHQoKSxcbl07XG5cbmNvbnN0IGNhY2hlSW52YWxpZGF0aW9uS2V5UmVmID0geyBjdXJyZW50OiBnZW5lcmF0ZUtleSgpIH07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDYWNoZUludmFsaWRhdGlvbktleSgpIHtcbiAgcmV0dXJuIGNhY2hlSW52YWxpZGF0aW9uS2V5UmVmLmN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIHJlZ2VuZXJhdGVDYWNoZUludmFsaWRhdGlvbktleSgpIHtcbiAgY2FjaGVJbnZhbGlkYXRpb25LZXlSZWYuY3VycmVudCA9IGdlbmVyYXRlS2V5KCk7XG4gIHJldHVybiBjYWNoZUludmFsaWRhdGlvbktleVJlZjtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVLZXkoKTogc3RyaW5nIHtcbiAgcmV0dXJuIGAke0RhdGUubm93KCkudG9GaXhlZCgpfWA7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBRUEsT0FBTyxXQUFXO0FBRWxCLE9BQU8sa0JBQWtCO0FBRXpCLFNBQVMsb0JBQW9CO0FBRTdCLE9BQU8saUJBQWlCO0FBRXhCLE9BQU9BLFNBQVEsV0FBQUMsZ0JBQWU7OztBQ1YwVyxZQUFZLFFBQVE7QUFFNVosWUFBWSxVQUFVO0FBSXRCLE9BQU8sU0FBUztBQUVoQixZQUFZQyxjQUFhOzs7QUNMVixTQUFSLFNBQTBCLFNBQWlCLE1BQWlCO0FBQ2pFLE1BQUk7QUFFSixVQUFRLE1BQU07QUFBQSxJQUNaLEtBQUs7QUFDSCxjQUFRLE9BQU87QUFDZjtBQUFBLElBQ0YsS0FBSztBQUNILGNBQVEsT0FBTztBQUNmO0FBQUEsSUFDRixLQUFLO0FBQ0gsY0FBUSxPQUFPO0FBQ2Y7QUFBQSxJQUNGLEtBQUs7QUFDSCxjQUFRLE9BQU87QUFDZjtBQUFBLElBQ0Y7QUFDRSxjQUFRLE9BQU8sSUFBSTtBQUNuQjtBQUFBLEVBQ0o7QUFFQSxVQUFRLElBQUksT0FBTyxPQUFPO0FBQzVCO0FBRUEsSUFBTSxTQUFTO0FBQUEsRUFDYixPQUFPO0FBQUEsRUFDUCxRQUFRO0FBQUEsRUFDUixLQUFLO0FBQUEsRUFDTCxZQUFZO0FBQUEsRUFDWixPQUFPO0FBQUEsRUFDUCxTQUFTO0FBQUEsRUFDVCxRQUFRO0FBQUEsRUFDUixTQUFTO0FBQUEsRUFDVCxPQUFPO0FBQUEsRUFDUCxTQUFTO0FBQUEsRUFDVCxVQUFVO0FBQUEsRUFDVixRQUFRO0FBQUEsRUFDUixXQUFXO0FBQUEsRUFDWCxRQUFRO0FBQUEsRUFDUixTQUFTO0FBQUEsRUFDVCxTQUFTO0FBQUEsRUFDVCxPQUFPO0FBQUEsRUFDUCxTQUFTO0FBQUEsRUFDVCxVQUFVO0FBQUEsRUFDVixRQUFRO0FBQUEsRUFDUixXQUFXO0FBQUEsRUFDWCxRQUFRO0FBQUEsRUFD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QixrQkFBTSxFQUFFLEtBQUssSUFBSUUsTUFBSyxNQUFNLFVBQVUsSUFBSTtBQUMxQyxrQkFBTSxnQkFBZ0IsU0FBUyxpQkFBaUIsR0FBRyxJQUFJLEtBQUs7QUFDNUQsbUJBQU8sZ0JBQWdCLGFBQWE7QUFBQSxVQUN0QztBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNKLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLFNBQVMsQ0FBQyxnQkFBZ0IsZUFBZTtBQUFBLElBQ3pDLFlBQVk7QUFBQSxFQUNkO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCIsICJyZXNvbHZlIiwgInByb2Nlc3MiLCAicGF0aCIsICJtYWtlTWFuaWZlc3QiLCAicGF0aCIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJpc0RldiIsICJpc0RldiIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJyb290RGlyIiwgInJlc29sdmUiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAicGF0aCJdCn0K
