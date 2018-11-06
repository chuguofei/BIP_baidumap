import moment from 'moment'
moment.locale('zh-cn')
export default {
  install (Vue, options) {
    Vue.prototype.getFirstDayOfMonth = function (value) {
      return this.getCommonStartDay(value, 'month')
    }

    Vue.prototype.getLastDayOfMonth = function (value) {
      return this.getCommonEndDay(value, 'month')
    }

    Vue.prototype.getFirstDayOfYear = function (value) {
      return this.getCommonStartDay(value, 'year')
    }

    Vue.prototype.getLastDayOfYear = function (value) {
      return this.getCommonEndDay(value, 'year')
    }

    Vue.prototype.getCommonEndDay = function (value, type) {
      var mdate
      if (value.length === 4) {
        mdate = moment().year(value)
      } else {
        mdate = moment(value)
      }
      return moment(mdate.endOf(type)).format('YYYY-MM-DD')
    }

    Vue.prototype.getCommonStartDay = function (value, type) {
      var mdate
      if (value.length === 4) {
        mdate = moment().year(value)
      } else {
        mdate = moment(value)
      }
      return moment(mdate.startOf(type)).format('YYYY-MM-DD')
    }
  }
}
