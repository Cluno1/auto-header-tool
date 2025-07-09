import { formatTime } from "./format.js";
import { PathUtil } from "./utils/path-util.js";

// 使用路径分隔符兼容不同操作系统
const basePaths = ["D:/code/xingye-wechat"];

// 监听规则
const watchRule = (basePath) => {
  return [
    `${basePath}/**/*.js`,
    `${basePath}/**/*.vue`,
    `${basePath}/**/*.ts`,
    `${basePath}/**/*.jsx`,
    `${basePath}/**/*.tsx`,
  ];
};

// 排除规则
const forbitRule = () => {
  return [
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/.git/**",
    "!**/.vscode/**",
    "!**/.idea/**",
    "!**/uni_modules/**",
    "!**/.hbuilderx/**",
    "!**/.hbuilder/**",
  ];
};

export const watchPatterns = [];

basePaths.map((_) => {
  const basePath = PathUtil.toSystemPath(_);
  watchPatterns.unshift(...watchRule(basePath));
});

if (watchPatterns.length > 0) {
  watchPatterns.push(...forbitRule());
}

/**
 * 生成头部注释
 * @param {string[]} editors 编辑者列表
 * @returns {string} 生成的头部注释
 */
export const getHeader = (editors = []) => {
  const now = new Date();
  const editorList =
    editors.length > 0
      ? ` * Editors: [${editors.map((e) => `'${e}'`).join(", ")}]\n`
      : " * Editors: []\n";

  return `/**
 * @Author: zld 17875477802@163.com
 * @FirstDate: ${formatTime(now)}
 * 
 * @LastEditors: zld 17875477802@163.com
 * @LastEditTime: ${formatTime(now)}
 * 
${editorList} */\n\n`;
};

/**
 * 更新已有头部注释中的 LastEditors 和 LastEditTime
 * @param {string} content 文件内容
 * @param {string[]} editors 编辑者列表
 * @returns {string} 更新后的内容
 */
export const updateExistingHeader = (content, editors = []) => {
  const now = new Date();
  const editorName = editors.length > 0 ? editors[0] : "zld";

  // 更新 LastEditors
  let updatedContent = content.replace(
    /@LastEditors:\s*.+/,
    `@LastEditors: ${editorName} 17875477802@163.com`
  );

  // 更新 LastEditTime
  updatedContent = updatedContent.replace(
    /@LastEditTime:\s*.+/,
    `@LastEditTime: ${formatTime(now)}`
  );

  return updatedContent;
};
