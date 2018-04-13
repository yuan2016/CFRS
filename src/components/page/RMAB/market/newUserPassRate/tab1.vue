<template>
  <div class="tab1" v-loading.fullscreen="loading" element-loading-text="拼命加载中">
    <el-row class="line1">
      <el-col :span="4">
        <span class="A1" v-if="todayPassRateRatio">
        <span class="tab1-title">今日通过率</span>
        <span class="tab1-value">{{todayPassRateRatio}}</span>
      </span>
      </el-col>
      <el-col :span="4">
        <span class="A2" v-if="dailyPassRateRatio">
          <span class="tab1-title">通过率日环比</span>
          <span class="tab1-value">{{dailyPassRateRatio}}</span>
      </span>
      </el-col>
      <el-col :span="4">
        <span class="A3" v-if="weeklyPassRateRatio">
          <span class="tab1-title">通过率周同比</span>
          <span class="tab1-value">{{weeklyPassRateRatio}}</span>
      </span>
      </el-col>
      <el-col :span="4">
        <span class="A4" v-if="monthlyPassRateRatio">
          <span class="tab1-title">通过率月同比</span>
          <span class="tab1-value">{{monthlyPassRateRatio}}</span>
      </span>
      </el-col>
      <el-col :span="4">
        <span class="A5" v-if="daysPassRateRatio7">
          <span class="tab1-title">通过率近7天平均值</span>
          <span class="tab1-value">{{daysPassRateRatio7}}</span>
      </span>
      </el-col>
      <el-col :span="4">
        <span class="A6" v-if="daysPassRateRatio30">
          <span class="tab1-title">通过率近30天平均值</span>
          <span class="tab1-value">{{daysPassRateRatio30}}</span>
      </span>
      </el-col>
    </el-row>
    <div class="line2">
      <span class="B1" :style="{ height: height + 'px' }">
        <monthly-pass-rate-trends></monthly-pass-rate-trends>
      </span>
      <span class="B2" :style="{ height: height + 'px' }">
        <weekly-pass-rate-trends></weekly-pass-rate-trends>
      </span>
      <span class="B3" :style="{ height: height + 'px' }">
       <dayly-pass-rate-trends></dayly-pass-rate-trends>
      </span>
    </div>
    <el-date-picker v-model.trim="endTime" type="date" size="mini" placeholder="请选择日期"
                    class="tab1TimeSelect" @change="change1" value-format="yyyy-MM-dd"></el-date-picker>
    <el-date-picker v-model.trim="startTime" type="date" size="mini" placeholder="请选择日期"
                    class="tab1TimeSelect" @change="change2" value-format="yyyy-MM-dd"></el-date-picker>
    <div class="line3">
      <span class="B4" :style="{ height: height + 'px' }">
        <pass-rate-compare :message="startTime" :info="endTime"></pass-rate-compare>
      </span>
      <span class="B5" :style="{ height: height + 'px' }">
        <hours-pass-rate-trends></hours-pass-rate-trends>
      </span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import weeklyPassRateTrends from '../../../../charts/tab1/weeklyPassRateTrends/weeklyPassRateTrends'
  import monthlyPassRateTrends from '../../../../charts/tab1/monthlyPassRateTrends/monthlyPassRateTrends'
  import daylyPassRateTrends from '../../../../charts/tab1/daylyPassRateTrends/daylyPassRateTrends'
  import hoursPassRateTrends from '../../../../charts/tab1/hoursPassRateTrends/hoursPassRateTrends'
  import passRateCompare from '../../../../charts/tab1/passRateCompare/passRateCompare'
  import { formatDate } from '../../../../../common/js/utils'
  import { getRatio } from '../../../../../common/js/api'

  export default {
    data () {
      return {
        startTime: '' || this.getYesterday(),
        endTime: '' || this.getToday(),
        todayPassRateRatio: '',
        dailyPassRateRatio: '',
        weeklyPassRateRatio: '',
        monthlyPassRateRatio: '',
        daysPassRateRatio7: '',
        daysPassRateRatio30: '',
        loading: false,
        height: 320
      }
    },
    mounted () {
      this.resizeHeight()
    },
    created () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 800)
      this.getDataInit()
    },
    components: {
      weeklyPassRateTrends,
      monthlyPassRateTrends,
      daylyPassRateTrends,
      hoursPassRateTrends,
      passRateCompare
    },
    methods: {
      resizeHeight () {
        this.setHeight()
        window.onresize = this.setHeight
      },
      setHeight () {
        let docH = document.documentElement.offsetHeight
        let height = (docH - 372) / 2
        if (height > 190) {
          this.height = height
        } else {
          this.height = 190
        }
      },
      change1 (val) {
        this.endTime = val
      },
      change2 (val) {
        this.startTime = val
      },
      getDataInit () {
        getRatio().then((res) => {
          if (res.data) {
            let result = res.data
            this.todayPassRateRatio = result.dr_tgl
            this.dailyPassRateRatio = result.rtb_tgl
            this.weeklyPassRateRatio = result.zhb_tgl
            this.monthlyPassRateRatio = result.yhb_tgl
            this.daysPassRateRatio7 = result.day7_avg_tgl
            this.daysPassRateRatio30 = result.day30_avg_tgl
          } else {
            this.$message({
              message: '数据正在更新，请稍候',
              type: 'warning'
            })
          }
        }).catch(() => {
          this.$message({
            message: '数据正在更新，请稍候',
            type: 'warning'
          })
        })
      },
      getYesterday () {
        let seperator = '-'
        let day = new Date()
        day.setTime(day.getTime() - 24 * 60 * 60 * 1000)
        let month = day.getMonth() + 1
        let strDate = day.getDate()
        if (month >= 1 && month <= 9) {
          month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = '0' + strDate
        }
        return day.getFullYear() + seperator + month + seperator + strDate
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
  .tab1
    box-sizing: border-box
    margin-top: 10px
    padding: px 20px 0 20px
    .line2, .line3
      display: flex
      margin-bottom: 20px
    .line1
      width: 60%
      text-align: center
      padding: 10px 0
      .A1, .A2, .A3, .A4, .A5, .A6
        display: inline-block
        line-height: 25px
        min-width: 110px
        border-radius: 10px
        padding: 0 10px
        box-shadow: 10px 10px 10px #ccc
        color: #ffffff
        .tab1-title
          display: block
          text-align: left
          font-size: 12px
        .tab1-value
          display: block
          position: relative
          top: -5px
          right: -20px
          font-size: 20px
          transition: all .1s ease-out .1s
          &:hover
            transform: scale(1.2, 1.2)
      .A1
        background-color: #20A0FF
      .A2
        background-color: #FF7F50
      .A3
        background-color: #FFA500
      .A4
        background-color: #da6262
      .A5
        background-color: #28b968
      .A6
        background-color: #483D8B
      @media (max-width: 1440px )
        width: 85%
      @media (max-width: 1024px )
        width: 100%
    .line2
      flex-wrap: wrap
      width: 100%
      text-align: center
      .B1, .B2, .B3
        flex: 1
        margin-right: 10px
        min-width: 400px
        min-height:250px
      @media (max-width: 992px )
        .B3
          margin-left: 25px
    .line3
      flex-wrap: wrap
      width: 100%
      .B4, .B5
        margin-right: 10px
        line-height: 300px
        text-align: center
        min-width: 400px
        min-height:250px
      .B4
        flex: 1
      .B5
        flex: 1
      @media (max-width: 992px )
        .B5
          margin-left: 25px
    .tab1TimeSelect
      margin: -10px 0 30px 38px
</style>
