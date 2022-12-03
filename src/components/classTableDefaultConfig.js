var singleClassCardHeight = 60;
var colors = [
  "#FF1744",
  "#FA6278",
  "#2979FF",
  "#1DE9B6",
  "#A375FF",
  "#FF9100",
  "#FF3D00",
  "#2196F3",
  "#005CAF",
  "#FF1477",
  "#FA6278",
  "#2979FF",
  "#1DE9B6",
  "#A375FF",
  "#FF9100",
  "#FF3D00",
  "#2196F3",
  "#005CAF",
  "#FF1477",
  "#FA6278",
  "#2979FF",
  "#1DE9B6",
  "#A375FF",
  "#FF9100",
];
var times = [
  { startTime: "08:30", endTime: "09:15" },
  { startTime: "09:20", endTime: "10:05" },
  { startTime: "10:25", endTime: "11:10" },
  { startTime: "11:20", endTime: "12:00" },
  { startTime: "", endTime: "" },
  { startTime: "", endTime: "" },
  { startTime: "14:30", endTime: "15:15" },
  { startTime: "15:20", endTime: "16:05" },
  { startTime: "16:15", endTime: "17:00" },
  { startTime: "17:05", endTime: "17:50" },
  { startTime: "18:20", endTime: "19:05" },
  { startTime: "19:10", endTime: "19:55" },
  { startTime: "20:05", endTime: "21:50" },
  { startTime: "20:55", endTime: "21:40" },
];

var times_pingfeng = [
  { startTime: "08:10", endTime: "08:55" },
  { startTime: "09:05", endTime: "09:50" },
  { startTime: "10:20", endTime: "11:05" },
  { startTime: "11:05", endTime: "11:50" },
  { startTime: "", endTime: "" },
  { startTime: "", endTime: "" },
  { startTime: "14:30", endTime: "15:15" },
  { startTime: "15:25", endTime: "16:10" },
  { startTime: "16:20", endTime: "17:05" },
  { startTime: "17:15", endTime: "18:00" },
  { startTime: "18:30", endTime: "19:15" },
  { startTime: "19:25", endTime: "20:10" },
  { startTime: "20:20", endTime: "21:05" },
  { startTime: "21:15", endTime: "22:00" },
];
let school = localStorage.getItem("school");
if (school == "pingfeng") {
  times = times_pingfeng;
}
let daysPerWeek = 7;
let daysPerWeekString = localStorage.getItem("school");
if (daysPerWeekString == "5") {
  daysPerWeek = 5;
}
var setting = {
  times,
  colors: {
    generalCharColor: {
      des: "界面文本颜色",
      color: { hex: "#000" },
    },
    classCharColor: {
      des: "课程文本颜色",
      color: { hex: "#fff" },
    },
    // pureBackGroundColor: {
    //   des: "背景色",
    //   color: { hex: "#fff" },
    // },
  },
  daysPerWeek,
  image: null,
};
function ranColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
export { setting, colors, singleClassCardHeight, ranColor };
