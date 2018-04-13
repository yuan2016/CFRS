<template>
  <div class="onlineStatisticsHourlyQE" v-loading.fullscreen="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <el-date-picker v-model.trim="startTime" type="date" size="mini" placeholder="请选择日期"
                    class="tab1TimeSelect" @change="change" value-format="yyyy-MM-dd"></el-date-picker>
    <div class="line">
      <span class="can" :style="{ height: height + 'px' }">
        <online-statistics-hourly :message="startTime"></online-statistics-hourly>
      </span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import onlineStatisticsHourly from '../../../../charts/onlineStatisticsHourly/onlineStatisticsHourly'
  import banner from '../../../../common/banner/banner'
  import { formatDate } from '../../../../../common/js/utils'
  import { getRatio } from '../../../../../common/js/api'

  export default {
    data () {
      return {
        startTime: '' || this.getToday(),
        loading: false,
        height: 320
      }
    },
    mounted () {
      this.resizeHeight()
    },
    components: {
      onlineStatisticsHourly,
      banner
    },
    methods: {
      resizeHeight () {
        this.setHeight()
        window.onresize = this.setHeight
      },
      setHeight () {
        let docH = document.documentElement.clientHeight
        this.height = docH / 2
      },
      change (val) {
        this.startTime = val
      },
      getToday () {
        let seperator = '-'
        let day = new Date()
        day.setTime(day.getTime())
        let month = day.getMonth() + 1
        let strDate = day.getDate()
        if (month >= 1 && month <= 9) {
          month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = '0' + strDate
        }
        return day.getFullYear() + seperator + month + seperator + strDate
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .onlineStatisticsHourlyQE
    box-sizing: border-box
    .elextra-icon-table2
      position :relative
      top: 8px
      left: 5px
      margin-left: 5px
      font-size :35px
      cursor: pointer
      color: #1D8CE0
      &:hover
        color: #58B7FF
    .table-to-pic
      position: absolute
      right: 30px
      top: 135px
      width: 60px
    .line
      width: 100%
      .can
        display: inline-block
        width: 100%
        margin-right: 10px
        text-align: center
    .tab1TimeSelect
      margin: 20px 0 30px 20px
</style>
