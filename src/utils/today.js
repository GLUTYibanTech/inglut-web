import dayjs from "dayjs";
const startDate = dayjs("2022-02-20");
const now = dayjs();
const year = now.year();
const month = now.month(); //0-11
const term = month < 8 && month > 1 ? "1" : "2"; //"1"春季”2“秋季
const dayCount = now.diff(startDate, "day");
let weekCount = now.diff(startDate, "week");
let todayofWeek = now.day();
//dayjs每周第一天是周日，纠正为周一
todayofWeek--;
if (todayofWeek == -1) {
  weekCount--; //周日是下周第一天，拉回”上周“
  todayofWeek = 6;
}
const dayIndextoChineseChar = (num) =>
  ["一", "二", "三", "四", "五", "六", "日"][num];
const calcDateFromWeekandDay = (weekCount, dayCount) =>
  dayjs(startDate).add(dayCount, "day").add(weekCount, "week").date();
export {
  year,
  month, //从0开始计
  term, //"1"春季”2“秋季
  dayCount, //从0开始计
  weekCount, //从0开始计
  todayofWeek, //从0开始计
  dayIndextoChineseChar,
  calcDateFromWeekandDay,
};
export default dayCount;
