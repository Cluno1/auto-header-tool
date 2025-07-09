import { readFileSync, writeFileSync } from "fs";
import chokidar from "chokidar";
import {
  watchPatterns,
  getHeader,
  updateExistingHeader,
} from "./watch-config.js";
import { relative } from "path";

// 配置选项
const config = {
  verbose: true,
  maxConcurrent: 10,
  editors: ["zld"],
};

let processingCount = 0;

const watcher = chokidar.watch(watchPatterns, {
  ignored: /(^|[\/\\])\../,
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 500,
    pollInterval: 100,
  },
});

async function handleFileChange(filePath) {
  if (processingCount >= config.maxConcurrent) {
    if (config.verbose) {
      console.log(
        `⏳ 跳过处理 (达到最大并发数): ${relative(process.cwd(), filePath)}`
      );
    }
    return;
  }

  processingCount++;

  try {
    let content = readFileSync(filePath, "utf8");
    let updated = false;

    // 检查是否已经有头部注释
    const hasExistingHeader =
      content.trim().startsWith("/**") && content.includes("@LastEditTime");

    if (!hasExistingHeader) {
      // 没有头部注释，添加完整header
      content = getHeader(config.editors) + content;
      updated = true;
    } else {
      // 已有头部注释，更新LastEditors和LastEditTime
      const newContent = updateExistingHeader(content, config.editors);
      if (newContent !== content) {
        content = newContent;
        updated = true;
      }
    }

    if (updated) {
      writeFileSync(filePath, content);
      if (config.verbose) {
        console.log("✅ 更新文件:", relative(process.cwd(), filePath));
      }
    } else if (config.verbose) {
      console.log("ℹ️ 无需更新:", relative(process.cwd(), filePath));
    }
  } catch (err) {
    console.error(
      "❌ 处理失败:",
      relative(process.cwd(), filePath),
      err.message
    );
  } finally {
    processingCount--;
  }
}

watcher.on("change", handleFileChange);
watcher.on("error", (error) => console.error("❌ 监听错误:", error));

watcher.on("ready", () => {
  console.log(
    `🚀 开始监听以下路径:\n${watchPatterns.map((p) => `- ${p}`).join("\n")}`
  );
  console.log("\n🛑 按 Ctrl+C 停止监听");
});

process.on("SIGINT", () => {
  watcher.close().then(() => {
    console.log("\n👋 已停止监听");
    process.exit(0);
  });
});
