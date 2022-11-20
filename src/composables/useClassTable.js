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
    const hasDataInDb = await indexdb.hasKey(indexDbkey, 1); //1小时过期
    if (fromDb && hasDataInDb) {
      console.log("从IndexDb中获取课表");
      data.value = (await indexdb.get(indexDbkey)).data;
      isFinished.value = true;
      return;
    }
    const dataModel = [];
    let http = await (await createAxiosWithToken()).get(`/webapi/class/days`);
    status.value = http.status;
    if (http.status == 200) {
      var classLog = [];
      var week = [];
      http.data.forEach((element) => {
        var day = [];
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
          day.sort((a, b) => a.startPosi - b.startPosi);
          //合并重复项
          var dayCopyed = [...day];
          for (var i = 1; i <= dayCopyed.length - 1; i++) {
            if (dayCopyed[i - 1].endPosi > dayCopyed[i].startPosi) {
              if (dayCopyed[i - 1].endPosi >= dayCopyed[i].endPosi) {
                day[i - 1].primativeData.push(dayCopyed[i].primativeData[0]);
                day[i - 1].badge = 2;
                day.splice(i);
                console.log("type1", day[i - 1]);
              } else {
                day[i].primativeData.push(dayCopyed[i - 1].primativeData[0]);
                day[i].badge = 2;
                day[i - 1].endPosi = day[i].startPosi - 1;
                day[i - 1].classLength =
                  day[i].startPosi - day[i - 1].startPosi;
                day[i - 1].cardHeight =
                  day[i - 1].classLength * singleClassCardHeight;
                day.splice(i - 1);
                console.log("type2", day[i - 1], day[i]);
              }
            }
          }
        }
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
        // console.log(newDay);
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
      console.log(dataModel);
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
