import dayjs from 'dayjs';
/**格式时间*/
export function formatTime(time='') {
	if (!time) return null;

	const date = time instanceof Date ? time : new Date(time);

	// Format as yyyy-MM-dd HH:mm:ss
	const pad = num => num.toString().padStart(2, '0');

	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
		`${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/**
 * 格式化日期为YY-MM-DD
 * @param dateString 日期字符串
 * @returns 格式化后的日期字符串
 */
export const formatDateYMD = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD');
};

/**
 * 格式化日期为YY-MM-DD
 * @param dateString 日期字符串
 * @returns 格式化后的日期字符串
 */
export const formatDateHMS = (dateString) => {
  return dayjs(dateString).format('hh:mm:ss');
};

/**
 * 判断两个日期是否是同一天
 * @param date1 日期字符串1
 * @param date2 日期字符串2
 * @returns 是否是同一天
 */
export const isSameDay = (date1, date2) => {
  return dayjs(date1).format('YYYY-MM-DD') === dayjs(date2).format('YYYY-MM-DD');
};