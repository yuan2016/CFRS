<template>
  <div class="operatingSituation" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <div class="operatingSituation-table">
      <el-row class="line1">
        <el-col :span="4">
        <span class="A1">
          <span class="operatingSituation-title">总充值金额</span>
          <span class="operatingSituation-value">{{recharge_amt}}</span>
        </span>
        </el-col>
        <el-col :span="4">
        <span class="A2">
          <span class="operatingSituation-title">总消耗金额</span>
          <span class="operatingSituation-value">{{coin_consumption}}</span>
        </span>
        </el-col>
        <el-col :span="4">
        <span class="A3">
          <span class="operatingSituation-title">总订单成交金额</span>
          <span class="operatingSituation-value">{{order_amt}}</span>
        </span>
        </el-col>
        <el-col :span="4">
        <span class="A4">
          <span class="operatingSituation-title">总注册用户数量</span>
          <span class="operatingSituation-value">{{register_num}}</span>
        </span>
        </el-col>
        <el-col :span="4">
        <span class="A5">
          <span class="operatingSituation-title">总充值人数</span>
          <span class="operatingSituation-value">{{recharge_num}}</span>
        </span>
        </el-col>
        <el-col :span="4">
        <span class="A6">
          <span class="operatingSituation-title">当日充值人数</span>
          <span class="operatingSituation-value">{{drecharge_num}}</span>
        </span>
        </el-col>
      </el-row>
      <div class="line2">
      <span class="B1" :style="{ height: height + 'px' }">
        <active-user-trends ></active-user-trends>
      </span>
        <span class="B2" :style="{ height: height + 'px' }">
        <new-registered-user></new-registered-user>
      </span>
      <!--  <span class="B3" :style="{ height: height + 'px' }">
        <recharge-consumption></recharge-consumption>
      </span>-->
      </div>
      <div class="line3">
      <span class="B4" :style="{ height: height + 'px' }">
<recharge-consumption></recharge-consumption>
      </span>
        <span class="B5" :style="{ height: height + 'px' }">
          <conversion-funnel></conversion-funnel>
      </span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import banner from '../../../common/banner/banner'
  import activeUserTrends from '../../../charts/operatingSituation/activeUserTrends/activeUserTrends'
  import newRegisteredUser from '../../../charts/operatingSituation/newRegisteredUser/newRegisteredUser'
  import rechargeConsumption from '../../../charts/operatingSituation/rechargeConsumption/rechargeConsumption'
  import conversionFunnel from '../../../charts/operatingSituation/conversionFunnel/conversionFunnel'
  import { formatDate } from '../../../../common/js/utils'
  import { getOperatingSituation } from '../../../../common/js/api'

  export default {
    data () {
      return {
        loading: false,
        height: 320,
        recharge_amt: '',
        coin_consumption: '',
        order_amt: '',
        register_num: '',
        recharge_num: '',
        drecharge_num: ''
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
      banner,
      activeUserTrends,
      newRegisteredUser,
      rechargeConsumption,
      conversionFunnel
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
      change (val) {
        this.startTime = val
      },
      getDataInit () {
        getOperatingSituation().then((res) => {
          if (res.data) {
            let result = res.data[0]
            this.recharge_amt = result.recharge_amt || '0.00'
            this.coin_consumption = result.coin_consumption || '0.00'
            this.order_amt = result.order_amt || '0.00'
            this.register_num = result.register_num || '0'
            this.recharge_num = result.recharge_num || '0'
            this.drecharge_num = result.drecharge_num || '0'
          } else {
            this.recharge_amt = '0.00'
            this.coin_consumption = '0.00'
            this.order_amt = '0.00'
            this.register_num = '0'
            this.recharge_num = '0'
            this.drecharge_num = '0'
            this.$message({
              message: '数据正在更新，请稍候',
              type: 'warning'
            })
          }
        }).catch(() => {
          this.recharge_amt = '0.00'
          this.coin_consumption = '0.00'
          this.order_amt = '0.00'
          this.register_num = '0'
          this.recharge_num = '0'
          this.drecharge_num = '0'
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
  .operatingSituation
    .operatingSituation-table
      position: relative
      box-sizing: border-box
      margin-top: 10px
      padding: px 20px 0 20px
    .line2, .line3
      display: flex
      margin-bottom: 20px
    .line1
      width: 90%
      min-width: 929px
      text-align: center
      padding: 10px 0
      border: 1px solid #ebeef5
      margin: 15px 0
      .A1, .A2, .A3, .A4, .A5, .A6
        display: inline-block
        line-height: 32px
        min-width: 144px
        border-radius: 10px
        padding: 0 10px
        border-right: 1px solid #e4e4e4
        &:hover
          color: #409eff
        .operatingSituation-title
          display: block
          text-align: left
          font-size: 12px
          color: #808492
        .operatingSituation-value
          display: block
          position: relative
          font-size: 20px
          color: #5a5b5d
          transition: all .1s ease-out .1s
          &:hover
            color: #409eff
            transform: scale(1.2, 1.2)
      .A6
        border-right: none
      @media (max-width: 1273px )
        width: 100%
    .line2
      flex-wrap: wrap
      width: 100%
      text-align: center
      margin-top: 20px
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
    .operatingSituationTimeSelect
      margin: -10px 0 30px 38px
</style>
