import { createAxiosWithToken } from "../utils/api";
import indexdb from "../utils/indexdb";
import { ref, onMounted } from "vue";
import { weekCount } from "../utils/today";
import {
  setting,
  colors,
  singleClassCardHeight,
  ranColor,
} from "../components/classTableDefaultConfig";
export { useClassTable };
const indexDbkey = "classtable";
const isFinished = ref(false);
var data = ref([]);
const currentIndex = ref(weekCount);
const status = ref(0);
function useClassTable({ fromDb = true } = { fromDb: true }) {
  onMounted(async () => {
    //先从缓存加载，如果过期再http更新
    const hasKey = await indexdb.hasKey(indexDbkey);
    if (hasKey) {
      console.log("从IndexDb中获取课表");
      data.value = (await indexdb.get(indexDbkey)).data;
      isFinished.value = true;
    }
    const hasDataInDbIn1hour = await indexdb.hasKey(indexDbkey, 1); //1小时过期
    if (fromDb && hasDataInDbIn1hour) {
      return; //数据更新未超过一个小时就不请求
    }
    const dataModel = [];
    let http = await (await createAxiosWithToken()).get(`/webapi/class/days`);
    status.value = http.status;
    if (http.status == 200) {
      var classLog = [];
      var week = [];
      http.data.forEach((element) => {
        var day = [];
        // 计算遍历每一天，每节课的课程开始位置，终止未知，像素高度，课程信息
        element.forEach((singleClass) => {
          var startPosi = parseInt(singleClass[6]);
          var classLength = parseInt(singleClass[7]);
          var endPosi = startPosi + classLength - 1;
          var cardHeight = classLength * singleClassCardHeight;
          var className = singleClass[0];
          var color;
          if (!classLog.includes(className)) {
            classLog.push(className);
          }
          if (classLog.length <= colors.length) {
            color = colors[classLog.indexOf(className)];
          } else color = ranColor();
          var room = singleClass[1];
          var teacher = singleClass[2];
          var primativeData = [singleClass];
          day.push({
            startPosi,
            endPosi,
            classLength,
            cardHeight,
            className,
            room,
            badge: 1,
            teacher,
            primativeData,
            isEmpty: false,
            color,
          });
        });
        if (day.length > 1) {
          // 开始按照开始位置排序
          day
            .sort((a, b) => a.startPosi - b.startPosi)
            .forEach((x) => (x.display = true));
          //开始检查并合并重复项
          var dayCopyed = [...day];
          for (var i = 1; i <= dayCopyed.length - 1; i++) {
            //如果本节课的开始位置在上节课或者上上节课里面，说明重复了
            if (
              dayCopyed[i - 1].endPosi > dayCopyed[i].startPosi ||
              (i >= 2 && dayCopyed[i - 2].endPosi > dayCopyed[i].startPosi)
            ) {
              // 如果本节课结束位置在上节课结束位置之上或相同，说明上节课覆盖了本节课
              if (dayCopyed[i - 1].endPosi >= dayCopyed[i].endPosi) {
                day[i - 1].primativeData.push(dayCopyed[i].primativeData[0]); //上节课加入本节课信息
                day[i - 1].badge++; //角标加一
                day[i].display = false; //不显示本节课
                console.log("type1", day[i - 1]);
              } else if (
                // 如果本节课结束位置在上上节课结束位置之上或相同，说明上上节课覆盖了本节课
                i >= 2 &&
                dayCopyed[i - 2].endPosi >= dayCopyed[i].endPosi
              ) {
                day[i - 2].primativeData.push(dayCopyed[i].primativeData[0]); //上节课加入本节课信息
                day[i - 2].badge++; //角标加一
                day[i].display = false; //不显示本节课
                console.log("type3", day[i - 2], day[i]);
              } else {
                // 两节课有部分重复的情况，本节课标记重复，上节课缩短
                day[i].primativeData.push(dayCopyed[i - 1].primativeData[0]);
                day[i].badge++;

                day[i - 1].endPosi = day[i].startPosi - 1;
                day[i - 1].classLength =
                  day[i].startPosi - day[i - 1].startPosi;
                day[i - 1].cardHeight =
                  day[i - 1].classLength * singleClassCardHeight;
                console.log("type2", day[i - 1], day[i]);
              }
            }
          }
          day = day.filter((x) => x.display); //滤除不显示的课程，为填充占位做准备
          //合并重复项结束
        }
        // 开始插入空课占位
        var newDay = [];
        var total = 0;
        day.forEach((element) => {
          total += element.classLength;
        });
        var emptyCount = 14 - total;
        for (var a = 0; a < emptyCount; a++) {
          newDay.push({
            isEmpty: true,
            cardHeight: singleClassCardHeight,
          });
        }
        var totolPosi = 0;
        var insertTime = 0;
        for (var m = 0; m < day.length; m++) {
          newDay.splice(day[m].startPosi - totolPosi + insertTime, 0, day[m]);
          totolPosi += day[m].classLength;
          insertTime++;
        }
        // 插入空课占位结束
        week.push(newDay);
        if (week.length == 7) {
          if (setting.daysPerWeek < 7) {
            week = week.slice(0, setting.daysPerWeek);
          }
          dataModel.push([...week]);
          week = [];
        }
      });
      await indexdb.set(indexDbkey, dataModel);
      data.value = dataModel;
      isFinished.value = true;
      console.log("课表http请求:", dataModel);
    }
  });
  return {
    setting,
    isFinished,
    currentIndex,
    data,
    status,
  };
}
