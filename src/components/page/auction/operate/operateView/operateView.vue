<template>
  <div class="operateView" v-loading.fullscreen="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <el-row class="line1">
      <el-col :span="4">
        <span class="A1 A" >
        <span class="operateView-title">今日注册用户数</span>
        <span class="operateView-value">{{dregister_num}}</span>
      </span>
      </el-col>
      <el-col :span="4">
        <span class="A2 A" >
        <span class="operateView-title">今日活跃用户</span>
        <span class="operateView-value">{{dactive_num}}</span>
      </span>
      </el-col>
      <el-col :span="4">
        <span class="A3 A" >
        <span class="operateView-title">总用户数</span>
        <span class="operateView-value">{{register_num}}</span>
      </span>
      </el-col>
      <el-col :span="4">
        <span class="A4 A" >
        <span class="operateView-title">今日首充总额</span>
        <span class="operateView-value">{{dfrecharge_amt}}</span>
      </span>
      </el-col>
      <el-col :span="4">
        <span class="A5 A" >
        <span class="operateView-title">今日充值总额</span>
        <span class="operateView-value">{{drecharge_amt}}</span>
      </span>
      </el-col>
      <el-col :span="4">
        <span class="A6 A" >
        <span class="operateView-title">今日拍币消耗总额</span>
        <span class="operateView-value">{{dcoin1_consumption}}</span>
      </span>
      </el-col>
      <el-col :span="4">
        <span class="A7 A" >
        <span class="operateView-title">今日毛利</span>
        <span class="operateView-value">{{dprofit}}</span>
      </span>
      </el-col>
      <el-col :span="4">
        <span class="A8 A" >
        <span class="operateView-title">有效订单数</span>
        <span class="operateView-value">{{dreal_order7_num}}</span>
      </span>
      </el-col>
      <el-col :span="4">
        <span class="A9 A">
          <span class="operateView-title">总订单数</span>
          <span class="operateView-value">{{dreal_order_num}}</span>
      </span>
      </el-col>
      <el-col :span="4">
        <span class="A10 A">
          <span class="operateView-title">有效订单额</span>
          <span class="operateView-value">{{dreal_order7_amt}}</span>
      </span>
        </el-col>
      <el-col :span="4">
        <span class="A11 A" >
          <span class="operateView-title">总订单额</span>
          <span class="operateView-value">{{dreal_order_amt}}</span>
      </span>
      </el-col>
    </el-row>
    <div class="line2">
      <span class="B1" :style="{ height: height + 'px' }">
         <!--<el-select v-model="day" placeholder="请选择" class="operateViewTimeSelect" size="mini" >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>-->
           <el-radio-group v-model="day" size="mini">
              <el-radio-button label="7天"></el-radio-button>
              <el-radio-button label="15天"></el-radio-button>
              <el-radio-button label="30天"></el-radio-button>
            </el-radio-group>
        <daily-new-user :message="day"></daily-new-user>
      </span>
     <!-- <span class="B2" :style="{ height: height + 'px' }">
        <user-retention></user-retention>
      </span>-->
      <span class="B3" :style="{ height: height + 'px' }">
        <el-radio-group v-model="dType" size="mini">
              <el-radio-button label="日"></el-radio-button>
              <el-radio-button label="周"></el-radio-button>
              <el-radio-button label="月"></el-radio-button>
            </el-radio-group>
       <income-detail :message="dType"></income-detail>
      </span>
    </div>
    <div class="line3">
      <span class="B4" :style="{ height: height + 'px' }">
        <el-radio-group v-model="dType3" size="mini">
              <el-radio-button label="日"></el-radio-button>
              <el-radio-button label="周"></el-radio-button>
              <el-radio-button label="月"></el-radio-button>
            </el-radio-group>
        <active-user :message="dType3"></active-user>
      </span>
      <span class="B5" :style="{ height: height + 'px' }">
<el-date-picker v-model.trim="startTime" type="date" class="operateViewTimeSelect" size="mini" placeholder="请选择日期" @change="change" value-format="yyyy-MM-dd"></el-date-picker>        <coin1-cancellation-deposit :message="startTime"></coin1-cancellation-deposit>
      </span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import banner from '../../../../common/banner/banner'
  import dailyNewUser from '../../../../charts/operateView/dailyNewUser/dailyNewUser'
  import userRetention from '../../../../charts/operateView/userRetention/userRetention'
  import incomeDetail from '../../../../charts/operateView/incomeDetail/incomeDetail'
  import activeUser from '../../../../charts/operateView/activeUser/activeUser'
  import coin1CancellationDeposit from '../../../../charts/operateView/coin1CancellationDeposit/coin1CancellationDeposit'
  import { formatDate } from '../../../../../common/js/utils'
  import { getOperateView } from '../../../../../common/js/api'

  export default {
    data () {
      return {
        loading: false,
        height: 320,
        dregister_num: '',
        dactive_num: '',
        register_num: '',
        drecharge_amt: '',
        dfrecharge_amt: '',
        dcoin1_consumption: '',
        dprofit: '',
        dreal_order7_num: '',
        dreal_order_num: '',
        dreal_order7_amt: '',
        dreal_order_amt: '',
        day: '7天',
        dType: '日',
        dType3: '日',
        startTime: '' || this.getToday()
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
      dailyNewUser,
      userRetention,
      incomeDetail,
      activeUser,
      coin1CancellationDeposit
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
        getOperateView().then((res) => {
          if (res.data) {
            let result = res.data[0]
            this.dregister_num = result.dregister_num || '0'
            this.dactive_num = result.dactive_num || '0'
            this.register_num = result.register_num || '0'
            this.drecharge_amt = result.drecharge_amt || '0.00'
            this.dfrecharge_amt = result.dfrecharge_amt || '0.00'
            this.dcoin1_consumption = result.dcoin1_consumption || '0.00'
            this.dprofit = result.dprofit || '0.00'
            this.dreal_order7_num = result.dreal_order7_num || '0'
            this.dreal_order_num = result.dreal_order_num || '0'
            this.dreal_order7_amt = result.dreal_order7_amt || '0.00'
            this.dreal_order_amt = result.dreal_order_amt || '0.00'
          } else {
            this.dregister_num = '0'
            this.dactive_num = '0'
            this.register_num = '0'
            this.drecharge_amt = '0.00'
            this.dfrecharge_amt = '0.00'
            this.dcoin1_consumption = '0.00'
            this.dprofit = '0.00'
            this.dreal_order7_num = '0'
            this.dreal_order_num = '0'
            this.dreal_order7_amt = '0.00'
            this.dreal_order_amt = '0.00'
            this.$message({
              message: '数据正在更新，请稍候',
              type: 'warning'
            })
          }
        }).catch(() => {
          this.dregister_num = '0'
          this.dactive_num = '0'
          this.register_num = '0'
          this.drecharge_amt = '0.00'
          this.dfrecharge_amt = '0.00'
          this.dcoin1_consumption = '0.00'
          this.dprofit = '0.00'
          this.dreal_order7_num = '0'
          this.dreal_order_num = '0'
          this.dreal_order7_amt = '0.00'
          this.dreal_order_amt = '0.00'
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
  .operateView
    box-sizing: border-box
    margin-top: 10px
    padding: px 20px 0 20px
    .line2, .line3
      display: flex
      margin-bottom: 20px
      .el-radio-group
        display: block
        text-align: left
        padding-left: 15px
    .line1
      width: 98%
      min-width: 700px
      text-align: center
      padding: 10px 0
      border: 1px solid #ebeef5
      margin: 15px 0
      .A1, .A2, .A3, .A4, .A5, .A6, .A7, .A8, .A9, .A10, .A11
        display: inline-block
        line-height: 25px
        min-width: 110px
        padding: 0 10px
        margin-bottom: 15px
        border-right: 1px solid #e4e4e4
        text-align: center
        &:hover
          color: #409eff
        .operateView-title
          display: block
          text-align: left
          font-size: 12px
          color: #808492
        .operateView-value
          display: block
          position: relative
          font-size: 20px
          color: #5a5b5d
          transition: all .1s ease-out .1s
          &:hover
            color: #409eff
            transform: scale(1.2, 1.2)
      .A6, .A11
        border-right: none
      @media (min-width: 1440px )
        width: 98%
      @media (max-width: 1024px )
        width: 100%
      @media (max-width: 960px )
        .A
          padding: 0
    .line2
      flex-wrap: wrap
      width: 100%
      text-align: center
      .B2
        overflow: auto
      .B1, .B2, .B3
        flex: 1
        margin-right: 10px
        min-width: 400px
        min-height:250px
      .B3
        min-width: 472px
      @media (max-width: 1440px )
        .B1
          margin-bottom: 10px
      @media (max-width: 992px )
        .B3
          margin-left: 25px
    .line3
      flex-wrap: wrap
      width: 100%
      .B4, .B5
        margin-right: 10px
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
    .operateViewTimeSelect
      display: block
      width: 150px
      margin-left: 15px
</style>
