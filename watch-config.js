import { formatTime } from "./format.js";
import { PathUtil } from "./utils/path-util.js";

// 全局配置
const config = {
  // 基础作者信息
  author: "zld 17875477802@163.com",

  // 默认编辑者列表
  editors: ["zld"],

  // 监听的基础路径
  basePaths: ["D:/code/xingye-wechat"],

  // 是否显示详细日志
  verbose: true,

  // 最大并发处理数
  maxConcurrent: 10
};

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
    "!**/build/**",
  ];
};

export const watchPatterns = [];

config.basePaths.map((path) => {
  const basePath = PathUtil.toSystemPath(path);
  watchPatterns.unshift(...watchRule(basePath));
});

if (watchPatterns.length > 0) {
  watchPatterns.push(...forbitRule());
}

/**
 * 生成规范的头部注释
 * @param {string} fileType 文件类型
 * @returns {string} 生成的头部注释
 */
export const getHeader = (fileType = '.js') => {
  const now = new Date();
  const isVueFile = fileType === '.vue';
  const editorList = config.editors.length > 0
    ? ` * Editors: [${config.editors.map((e) => `'${e}'`).join(", ")}]\n`
    : " * Editors: []\n";

  return isVueFile
    ? `<!--
 * @Author: ${config.author}
 * @FirstDate: ${formatTime(now.toString())}
 * 
 * @LastEditors: ${config.author}
 * @LastEditTime: ${formatTime(now.toString())}
 * 
${editorList} -->\n\n`
    : `/**
 * @Author: ${config.author}
 * @FirstDate: ${formatTime(now.toString())}
 * 
 * @LastEditors: ${config.author}
 * @LastEditTime: ${formatTime(now.toString())}
 * 
${editorList} */\n\n`;
};

/**
 * 更新已有头部注释
 * @param {string} content 文件内容
 * @param {string} fileType 文件类型
 * @returns {string} 更新后的内容
 */
export const updateExistingHeader = (content, fileType = '.js') => {
  const now = new Date();

  // 更新 LastEditors
  let updatedContent = content.replace(
    /@LastEditors:\s*.+/,
    `@LastEditors: ${config.author}`
  );

  // 更新 LastEditTime
  updatedContent = updatedContent.replace(
    /@LastEditTime:\s*.+/,
    `@LastEditTime: ${formatTime(now.toString())}`
  );

  return updatedContent;
};

// 导出配置
export { config };