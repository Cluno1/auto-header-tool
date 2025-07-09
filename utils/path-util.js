import { platform } from "os";
import { sep, posix } from "path";

/**
 * 路径转换工具类
 */
export class PathUtil {
  /**
   * 将路径转换为当前系统正确的格式
   * @param {string} path 原始路径
   * @returns {string} 转换后的路径
   */
  static toSystemPath(path) {
    if (!path) return path;

    // 获取当前系统的路径分隔符
    const systemSeparator = sep;

    // 标准化路径：统一转换为正斜杠
    let normalized = path.replace(/\\/g, "/");

    // 移除重复的分隔符
    normalized = normalized.replace(/\/+/g, "/");

    // 如果是Windows系统且路径是绝对路径
    if (platform() === "win32" && /^[a-zA-Z]:\//.test(normalized)) {
      normalized = normalized.replace(/\//g, "\\");
    } else if (platform() !== "win32") {
      // 非Windows系统保持正斜杠
      normalized = normalized.replace(/\\/g, "/");
    }

    return normalized;
  }

  /**
   * 将路径转换为POSIX格式(使用/)
   * @param {string} path 原始路径
   * @returns {string} POSIX格式路径
   */
  static toPosixPath(path) {
    if (!path) return path;
    return path.replace(/\\/g, "/").replace(/\/+/g, "/");
  }

  /**
   * 将路径转换为Windows格式(使用\)
   * @param {string} path 原始路径
   * @returns {string} Windows格式路径
   */
  static toWindowsPath(path) {
    if (!path) return path;
    return path.replace(/\//g, "\\").replace(/\\+/g, "\\");
  }

  /**
   * 判断路径是否是绝对路径
   * @param {string} path 要检查的路径
   * @returns {boolean} 是否是绝对路径
   */
  static isAbsolute(path) {
    if (platform() === "win32") {
      // Windows下的绝对路径: C:\ 或 \\server\share
      return /^([a-zA-Z]:\\)|(\\{2}[^\\]+\\[^\\]+)/.test(path);
    }
    // POSIX下的绝对路径: /开头
    return path.startsWith("/");
  }

}
