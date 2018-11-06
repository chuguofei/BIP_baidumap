<style lang="scss" scoped>
$dateWidth:300px;
$dateFW:300;
.cov-date-body {
  background: #2196f3;
  overflow: hidden;
  font-size: 16px;
  font-family: 'san';
  font-weight: $dateFW;
  display: block;
  width: $dateWidth;
  max-width: 100%;
}
.cov-picker-box {
  background: #fff;
  width: 100%;
  display: inline-block;
  padding: 20px;
  box-sizing: border-box !important;
  -moz-box-sizing: border-box !important;
  -webkit-box-sizing: border-box !important;
  -ms-box-sizing: border-box !important;
  width: $dateWidth;
  max-width: 100%;
  height: 250px;
  text-align: start!important;
}
.cov-picker-box td {
  height: 32px;
  width: 32px;
  padding: 0;
  line-height: 32px;
  color: #000;
  background: #fff;
  text-align: center;
  cursor: pointer;
}
.cov-picker-box td:hover {
  background: #E6E6E6;
}

.day {
  width: 14.2857143%;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  height: 30px;
  padding: 0;
  line-height: 30px;
  color: #000;
  background: #fff;
  vertical-align: middle;
}
.week ul {
  margin: 0 0 8px;
  padding: 0;
  list-style: none;
}
.week ul li {
  width: 14.2%;
  display: inline-block;
  text-align: center;
  background: transparent;
  color: #000;
  font-weight: bold;
}
.passive-day {
  color: #bbb;
}
.checked {
  background: #F50057;
  color: #FFF !important;
  border-radius: 3px;
}
.unavailable {
  color: #ccc;
  cursor: not-allowed;
}
.cov-date-monthly {
  height:60px;
}
.cov-date-monthly > div {
  padding: 0;
  margin: 0;
  vertical-align: middle;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
.cov-date-previous,
.cov-date-next {
  position: relative;
  width: 20% !important;
  text-indent: -300px;
  overflow: hidden;
  color: #fff;
}
.cov-date-caption {
  font-size: 18px;
}
.cov-date-caption span:hover {
  color: rgba(255, 255, 255, 0.7);
}
.cov-date-previous:hover,
.cov-date-next:hover {
  background: rgba(255, 255, 255, 0.1);
}
.day:hover {
  background: #EAEAEA;
}
.unavailable:hover {
  background: none;
}
.checked:hover {
  background: #FF4F8E;
}
.cov-date-next::before,
.cov-date-previous::before {
  width: 20px;
  height: 2px;
  text-align: center;
  position: absolute;
  background: #fff;
  top: 50%;
  margin-top: -7px;
  margin-left: -7px;
  left: 50%;
  line-height: 0;
  content: '';
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  transform: rotate(45deg);
}
.cov-date-next::after,
.cov-date-previous::after {
  width: 20px;
  height: 2px;
  text-align: center;
  position: absolute;
  background: #fff;
  margin-top: 6px;
  margin-left: -7px;
  top: 50%;
  left: 50%;
  line-height: 0;
  content: '';
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.cov-date-previous::after {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  transform: rotate(45deg);
}
.cov-date-previous::before {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.date-item {
  text-align: center;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  display: inline-block;
  width: 30%;
  text-align: center;
}
.date-item:hover {
  background: #e0e0e0;
}
.date-item.md-active{
  background: #F50057;
  color: #FFF;
}
.date-list {
  overflow: auto;
  vertical-align: top;
  padding: 0;
}
.cov-vue-date {
  width: 100%;
  color: #5D5D5D;
}
.button-box {
  background: #fff;
  vertical-align: top;
  height: 50px;
  line-height: 50px;
  text-align: right;
  padding-right: 20px;
}
.button-box span {
  cursor: pointer;
  padding: 10px 20px;
}
.watch-box {
  height: 100%;
  overflow: hidden;
}
.hour-box,
.min-box {
  display: inline-block;
  width: 50%;
  text-align: center;
  height: 100%;
  overflow: auto;
  float: left;
}
.hour-box ul,
.min-box ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.hour-item,
.min-item {
  padding: 10px;
  font-size: 36px;
  cursor: pointer;
}
.hour-item:hover,
.min-item:hover {
  background: #E3E3E3;
}
.hour-box .active,
.min-box .active {
  background: #F50057;
  color: #FFF !important;
}
::-webkit-scrollbar {
  width: 2px;
}
::-webkit-scrollbar-track {
  background: #E3E3E3;
}
::-webkit-scrollbar-thumb {
  background: #C1C1C1;
  border-radius: 2px;
}
</style>
<template>
    <md-menu class="md-select-date" ref="menu" @open="onOpen" @close="onClose">
      <div md-menu-trigger>
        <slot>
          <md-button class="md-icon-button" :disabled="disabled" v-if="!disabled"><md-icon>date_range</md-icon></md-button>
        </slot>
      </div>
      <md-menu-content>
        <div class="cov-date-body">
          <div class="cov-date-monthly layout">
            <div class="cov-date-previous" @click="nextMonth('pre')">«</div>
            <div class="cov-date-caption layout layout-column flex layout-align-center-center">
              <span @click="showYear">{{checked.year}}</span>
              <span @click="showMonth">{{displayInfo.month}}</span>
            </div>
            <div class="cov-date-next" @click="nextMonth('next')">»</div>
          </div>
          <div class="cov-date-box" v-if="showInfo.day">
            <div class="cov-picker-box">
              <div class="week">
                <ul>
                  <li v-for="(weekie,index) in library.week" :key="index">{{weekie}}</li>
                </ul>
              </div>
              <div class="day" v-for="(day,index) in dayList" :key="index" @click="checkDay(day)" :class="{'checked':day.checked,'unavailable':day.unavailable,'passive-day': !(day.inMonth)}" :style="day.checked ? (option.color && option.color.checkedDay ? { background: option.color.checkedDay } : { background: '#F50057' }) : {}">{{day.value}}</div>
            </div>
          </div>
          <div class="cov-date-box list-box" v-if="showInfo.year">
            <div class="cov-picker-box date-list" id="yearList">
              <div class="date-item" v-for="(yearItem,index) in library.year" :class="{'md-active':yearItem===checked.year}" :key="index" @click="setYear(yearItem)">{{yearItem}}</div>
            </div>
          </div>
          <div class="cov-date-box list-box" v-if="showInfo.month">
            <div class="cov-picker-box date-list">
              <div class="date-item" v-for="(monthItem,index) in library.month" :class="{'md-active':(index+1)===parseInt(checked.month)}" :key="index" @click="setMonth(monthItem)">{{monthItem}}</div>
            </div>
          </div>
          <div class="cov-date-box list-box" v-if="showInfo.hour">
            <div class="cov-picker-box date-list">
              <div class="watch-box">
                <div class="hour-box">
                  <div class="mui-pciker-rule mui-pciker-rule-ft"></div>
                  <ul>
                    <li class="hour-item" v-for="(hitem,index) in hours" :key="index" @click="setTime('hour', hitem, hours)" :class="{'active':hitem.checked}">{{hitem.value}}</li>
                  </ul>
                </div>
                <div class="min-box">
                  <div class="mui-pciker-rule mui-pciker-rule-ft"></div>
                  <div class="min-item" v-for="(mitem,index) in mins" :key="index" @click="setTime('min',mitem, mins)" :class="{'active':mitem.checked}">{{mitem.value}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="button-box">
            <span @click="cancel">{{option.buttons? option.buttons.cancel : 'Cancel' }}</span>
            <span @click="picked">{{option.buttons? option.buttons.ok : 'Ok'}}</span>
          </div>
        </div>
      </md-menu-content>
    </md-menu>
 
</template>

<script>
import moment from 'moment';
export default {
  props: {
    value: [String, Number, Object],
    option: {
      type: Object,
      default () {
        return {
          type: 'day',
          SundayFirst: false,
          week: ['一', '二', '三', '四', '五', '六', '日'],
          month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          format: 'YYYY-MM-DD',
          color: {
            checked: '#F50057',
            header: '#3f51b5',
            headerText: '#fff'
          },
          wrapperClass: '',
          placeholder: '',
          buttons: {
            ok: '确定',
            cancel: '取消'
          },
          overlayOpacity: 0.5,
          dismissible: true
        }
      },
    },
    disabled:false,
    limit: {
      type: Array,
      default () {
        return []
      }
    }
  },
  watch: {
    value(value) {
      value = this.formattedValue(value);
      this.updateValue(value);
    },
  },
  data() {
    function hours() {
      let list = [];
      let hour = 24;
      let now = moment().hour();
      while (hour > 0) {
        hour--;
        var item = {
          checked: now=== hour?true:false,
          value: hour < 10 ? '0' + hour : hour
        };
        list.push(item);
      }
      return list;
    }

    function mins() {
      let list = []
      let min = 60;
      let now = moment().minute();
      while (min > 0) {
        min--;
        list.push({
          checked: min==now?true:false,
          value: min < 10 ? '0' + min : min
        })
      }
      return list
    }
    return {
      hours: hours(),
      mins: mins(),
      showInfo: {
        hour: false,
        day: false,
        month: false,
        year: false,
        check: false
      },
      displayInfo: {
        month: ''
      },
      library: {
        week: this.option.week,
        month: this.option.month,
        year: []
      },
      checked: {
        oldtime: '',
        currentMoment: null,
        year: '',
        month: '',
        day: '',
        hour: '00',
        min: '00'
      },
      dayList: [],
      selectedDays: []
    }
  },

  methods: {
    pad(n) {
      n = Math.floor(n)
      return n < 10 ? '0' + n : n
    },
    nextMonth(type) {
      let next = null
      type === 'next' ? next = moment(this.checked.currentMoment).add(1, 'M') : next = moment(this.checked.currentMoment).add(-1, 'M')
      this.showDay(next)
    },
    showDay(time) {
      if (time === undefined || !Date.parse(time)) {
        this.checked.currentMoment = moment()
      } else {
        this.checked.currentMoment = moment(time, this.option.format)
      }
      this.showOne('day')
      this.checked.year =parseInt(moment(this.checked.currentMoment).format('YYYY'));
      this.checked.month = moment(this.checked.currentMoment).format('MM')
      this.checked.day = moment(this.checked.currentMoment).format('DD')
      this.displayInfo.month = this.library.month[moment(this.checked.currentMoment).month()]
      let days = []
      let currentMoment = this.checked.currentMoment
      let firstDay = moment(currentMoment).date(1).day()
      // gettting previous and next month
      // let currentMonth = moment(currentMoment)
      let previousMonth = moment(currentMoment)
      let nextMonth = moment(currentMoment)
      nextMonth.add(1, 'months')
      previousMonth.subtract(1, 'months')
      let monthDays = moment(currentMoment).daysInMonth()
      let oldtime = this.checked.oldtime
      for (let i = 1; i <= monthDays; ++i) {
        days.push({
          value: i,
          inMonth: true,
          unavailable: false,
          checked: false,
          moment: moment(currentMoment).date(i)
        })
        if (i === Math.ceil(moment(currentMoment).format('D')) && moment(oldtime, this.option.format).year() === moment(currentMoment).year() && moment(oldtime, this.option.format).month() === moment(currentMoment).month()) {
          days[i - 1].checked = true
        }else if(this.checked.day == i){
          days[i - 1].checked = true;
        }
        this.checkBySelectDays(i, days)
      }
      if (firstDay === 0) firstDay = 7
      for (let i = 0; i < firstDay - (this.option.SundayFirst ? 0 : 1); i++) {
        let passiveDay = {
          value: previousMonth.daysInMonth() - (i),
          inMonth: false,
          action: 'previous',
          unavailable: false,
          checked: false,
          moment: moment(currentMoment).date(1).subtract(i + 1, 'days')
        }
        days.unshift(passiveDay)
      }
      var passiveDaysAtFinal = 42 - days.length
      for (let i = 1; i <= passiveDaysAtFinal; i++) {
        let passiveDay = {
          value: i,
          inMonth: false,
          action: 'next',
          unavailable: false,
          checked: false,
          moment: moment(currentMoment).add(1, 'months').date(i)
        }
        days.push(passiveDay)
      }
      if (this.limit.length > 0) {
        for (let li of this.limit) {
          switch (li.type) {
            case 'fromto':
              days = this.limitFromTo(li, days)
              break
            case 'weekday':
              days = this.limitWeekDay(li, days)
              break
          }
        }
      }
      this.dayList = days
    },
    checkBySelectDays(d, days) {
      this.selectedDays.forEach(day => {
        if (this.checked.year === moment(day).format('YYYY') && this.checked.month === moment(day).format('MM') && d === Math.ceil(moment(day).format('D'))) {
          days[d - 1].checked = true
        }
      })
    },
    limitWeekDay(limit, days) {
      days.map((day) => {
        if (limit.available.indexOf(Math.floor(day.moment.format('d'))) === -1) {
          day.unavailable = true
        }
      })
      return days
    },
    limitFromTo(limit, days) {
      if (limit.from || limit.to) {
        days.map((day) => {
          if (this.getLimitCondition(limit, day)) {
            day.unavailable = true
          }
        })
      }
      return days
    },
    getLimitCondition(limit, day) {
      let tmpMoment = moment(day.moment.year() + '-' + this.pad(day.moment.month() + 1) + '-' + this.pad(day.value))
      if (limit.from && !limit.to) {
        return !tmpMoment.isAfter(limit.from)
      } else if (!limit.from && limit.to) {
        return !tmpMoment.isBefore(limit.to)
      } else {
        return !tmpMoment.isBetween(limit.from, limit.to)
      }
    },
    checkDay(obj) {
      if (obj.unavailable || obj.value === '') {
        return false
      }
      if (!(obj.inMonth)) {
        this.nextMonth(obj.action)
      }
      if (this.option.type === 'day' || this.option.type === 'min') {
        this.dayList.forEach((x) => {
          x.checked = false
        })
        this.checked.day = this.pad(obj.value)
        obj.checked = true
      } else {
        let day = this.pad(obj.value)
        let ctime = this.checked.year + '-' + this.checked.month + '-' + day
        if (obj.checked === true) {
          obj.checked = false
          this.selectedDays.$remove(ctime)
        } else {
          this.selectedDays.push(ctime)
          obj.checked = true
        }
      }
      switch (this.option.type) {
        case 'day':
          this.picked()
          break
        case 'min':
          this.showOne('hour')
          // shift activated time items to visible position.
          this.shiftActTime()
          break
      }
    },
    showMonth() {
      if(this.showInfo.month){
        this.showOne('day');
        return;
      }
      this.showOne('month')
    },
    showYear() {
      if(this.showInfo.year){
        this.showOne('day');
        return;
      }
      let year = moment(this.checked.currentMoment).year()
      this.library.year = []
      let yearTmp = []
      for (let i = year - 100; i < year + 5; ++i) {
        yearTmp.push(i)
      }
      this.library.year = yearTmp
      this.showOne('year');
      this.$nextTick(() => {
        let listDom = document.getElementById('yearList')
        listDom.scrollTop = (listDom.scrollHeight - 100)
        this.addYear()
      })
    },
    showOne(type) {
      switch (type) {
        case 'year':
          this.showInfo.hour = false
          this.showInfo.day = false
          this.showInfo.year = true
          this.showInfo.month = false
          break
        case 'month':
          this.showInfo.hour = false
          this.showInfo.day = false
          this.showInfo.year = false
          this.showInfo.month = true
          break
        case 'day':
          this.showInfo.hour = false
          this.showInfo.day = true
          this.showInfo.year = false
          this.showInfo.month = false
          break
        case 'hour':
          this.showInfo.hour = true
          this.showInfo.day = false
          this.showInfo.year = false
          this.showInfo.month = false
          break
        default:
          this.showInfo.day = true
          this.showInfo.year = false
          this.showInfo.month = false
          this.showInfo.hour = false
      }
    },
    addYear() {
      let listDom = document.getElementById('yearList')
      listDom.addEventListener('scroll', (e) => {
        if (listDom.scrollTop < listDom.scrollHeight - 100) {
          let len = this.library.year.length
          let lastYear = this.library.year[len - 1]
          this.library.year.push(lastYear + 1)
        }
      }, false)
    },
    setYear(year) {
      this.checked.currentMoment = moment(year + '-' + this.checked.month + '-' + this.checked.day)
      this.showDay(this.checked.currentMoment)
    },
    setMonth(month) {
      let mo = (this.library.month.indexOf(month) + 1)
      if (mo < 10) {
        mo = '0' + '' + mo
      }
      this.checked.currentMoment = moment(this.checked.year + '-' + mo + '-' + this.checked.day)
      this.showDay(this.checked.currentMoment)
    },
    showCheck() {
      if (this.value === '') {
        this.showDay()
      } else {
        if (this.option.type === 'day' || this.option.type === 'min') {
          this.checked.oldtime = this.value
          this.showDay(this.value)
        } else {
          this.selectedDays = JSON.parse(this.value)
          if (this.selectedDays.length) {
            this.checked.oldtime = this.selectedDays[0]
            this.showDay(this.selectedDays[0])
          } else {
            this.showDay()
          }
        }
      }
      this.showInfo.check = true
    },
    setTime(type, obj, list) {
      for (let item of list) {
        item.checked = false
        if (item.value === obj.value) {
          item.checked = true
          this.checked[type] = item.value
        }
      }
    },
    picked() {
      var newValue = '';
      if (this.option.type === 'day' || this.option.type === 'min') {
        let ctime = this.checked.year + '-' + this.checked.month + '-' + this.checked.day + ' ' + this.checked.hour + ':' + this.checked.min
        this.checked.currentMoment = moment(ctime, 'YYYY-MM-DD HH:mm')
        newValue = moment(this.checked.currentMoment).format(this.option.format);
      } else {
        newValue = JSON.stringify(this.selectedDays)
      }
      this.showInfo.check = false;
      this.updateValue(newValue);

      this.$refs.menu.close();
    },
    formattedValue(value) {
      return moment(value || this.value).format(this.option.format);
    },
    updateValue: function(value) {
      var formattedValue = this.formattedValue(value);
      this.$emit('input', formattedValue);
      this.$emit('change', formattedValue);
    },
    shiftActTime() {
      this.$nextTick(() => {
        if (!document.querySelector('.hour-item.active')) {
          return false
        }
        document.querySelector('.hour-box').scrollTop = (document.querySelector('.hour-item.active').offsetTop || 0) - 250
        document.querySelector('.min-box').scrollTop = (document.querySelector('.min-item.active').offsetTop || 0) - 250
      })
    },
    onOpen() {
      this.showCheck();
    },
    onClose() {
      this.showInfo.check=false;
    },
    cancel(){
      this.$refs.menu.close();
    }
  },
  mounted() {
    this.checked.hour = moment().hour();
    this.checked.min = moment().minute();
  }
};
</script>
