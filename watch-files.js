/*
 * @Author: zld 17875477802@163.com
 * @Date: 2025-07-09 11:34:18
 * @LastEditors: zld 17875477802@163.com
 * @LastEditTime: 2025-08-09 11:11:55
 * @FilePath: \auto-header-tool\watch-files.js
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */import { readFileSync, writeFileSync } from "fs";
import chokidar from "chokidar";
import {
  watchPatterns,
  getHeader,
  updateExistingHeader,
  config
} from "./watch-config.js";
import { relative } from "path";

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

    // 获取文件类型
    const fileType = filePath.includes('.vue') ? '.vue' :
      filePath.includes('.ts') ? '.ts' : '.js';

    // 检查是否已经有头部注释
    const hasExistingHeader =
      (fileType === '.vue' ? content.trim().startsWith("<!--") : content.trim().startsWith("/**")) &&
      content.includes("@LastEditTime");

    if (!hasExistingHeader) {
      // 没有头部注释，添加完整header
      content = getHeader(fileType) + content;
      updated = true;
    } else {
      // 已有头部注释，更新LastEditors和LastEditTime
      const newContent = updateExistingHeader(content, fileType);
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
