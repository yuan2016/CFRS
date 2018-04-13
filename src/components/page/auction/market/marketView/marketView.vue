<template>
  <div class="marketView" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <div class="marketView-table">
      <div class="line1">
        <el-row >
          <el-col :span="5">
        <span class="A1">
          <span class="marketView-title">今日渠道总注册数与昨日环比</span>
          <span class="marketView-value">{{regist_num_hb}}</span>
        </span>
          </el-col>
          <el-col :span="5">
        <span class="A2">
          <span class="marketView-title">今日新用户充值数与昨日环比</span>
          <span class="marketView-value">{{nuser_num_hb}}</span>
        </span>
          </el-col>
          <el-col :span="5">
        <span class="A3">
          <span class="marketView-title">今日新用户充值金额与昨日环比</span>
          <span class="marketView-value">{{nuser_amt_hb}}</span>
        </span>
          </el-col>
          <el-col :span="5">
        <span class="A4">
          <span class="marketView-title">今日渠道总充值人数与昨日环比</span>
          <span class="marketView-value">{{user_num_hb}}</span>
        </span>
          </el-col>
          <el-col :span="5">
        <span class="A5">
          <span class="marketView-title">今日渠道总充值金额与昨日环比</span>
          <span class="marketView-value">{{user_amt_hb}}</span>
        </span>
          </el-col>
          <el-col :span="5">
        <span class="A6">
          <span class="marketView-title">累计充值人数</span>
          <span class="marketView-value">{{user_num_lj}}</span>
        </span>
          </el-col>
          <el-col :span="5">
        <span class="A7">
          <span class="marketView-title">累计充值金额</span>
          <span class="marketView-value">{{user_amt_lj}}</span>
        </span>
          </el-col>
        </el-row>
        <el-row>

        </el-row>
      </div>
      <div class="line2">
      <span class="B1" :style="{ height: height + 'px' }">
        <user-area-ratio></user-area-ratio>
      </span>
        <span class="B2" :style="{ height: height + 'px' }">
          <user-area-recharge></user-area-recharge>
      </span>
        <!--<span class="B3" :style="{ height: height + 'px' }">
        &lt;!&ndash;<recharge-consumption></recharge-consumption>&ndash;&gt;
      </span>-->
      </div>
      <!--<div class="line3">
      <span class="B4" :style="{ height: height + 'px' }">
      </span>
        <span class="B5" :style="{ height: height + 'px' }">
          &lt;!&ndash;<conversion-funnel></conversion-funnel>&ndash;&gt;
      </span>
      </div>-->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import banner from '../../../../common/banner/banner'
  import userAreaRatio from '../../../../charts/marketView/userAreaRatio/userAreaRatio'
  import userAreaRecharge from '../../../../charts/marketView/userAreaRecharge/userAreaRecharge'
  import { formatDate } from '../../../../../common/js/utils'
  import { getMarketView } from '../../../../../common/js/api'

  export default {
    data () {
      return {
        loading: false,
        height: 320,
        regist_num_hb: '',
        nuser_num_hb: '',
        nuser_amt_hb: '',
        user_num_hb: '',
        user_amt_hb: '',
        user_num_lj: '',
        user_amt_lj: ''
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
      userAreaRatio,
      userAreaRecharge
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
        getMarketView().then((res) => {
          if (res.data) {
            let result = res.data[0]
            this.regist_num_hb = result.regist_num_hb || '0.00%'
            this.nuser_num_hb = result.nuser_num_hb || '0.00%'
            this.nuser_amt_hb = result.nuser_amt_hb || '0.00%'
            this.user_num_hb = result.user_num_hb || '0.00%'
            this.user_amt_hb = result.user_amt_hb || '0.00%'
            this.user_num_lj = result.user_num_lj || '0'
            this.user_amt_lj = result.user_amt_lj || '0.00'
          } else {
            this.regist_num_hb = '0.00%'
            this.nuser_num_hb = '0.00%'
            this.nuser_amt_hb = '0.00%'
            this.user_num_hb = '0.00%'
            this.user_amt_hb = '0.00%'
            this.user_num_lj = '0'
            this.user_amt_lj = '0.00'
            this.$message({
              message: '数据正在更新，请稍候',
              type: 'warning'
            })
          }
        }).catch(() => {
          this.regist_num_hb = '0.00%'
          this.nuser_num_hb = '0.00%'
          this.nuser_amt_hb = '0.00%'
          this.user_num_hb = '0.00%'
          this.user_amt_hb = '0.00%'
          this.user_num_lj = '0'
          this.user_amt_lj = '0.00'
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
  .marketView
    .marketView-table
      position: relative
      box-sizing: border-box
      margin-top: 10px
      padding: px 20px 0 20px
    .line2, .line3
      display: flex
      margin-bottom: 20px
    .line1
      width: 99%
      min-width: 716px
      text-align: center
      padding: 10px 0
      border: 1px solid #ebeef5
      margin: 15px 0
      .el-col
        min-width: 178px
      .A1, .A2, .A3, .A4, .A5, .A6, .A7
        display: inline-block
        line-height: 25px
        width: 100%
        min-width: 173px
        margin-bottom: 15px
        border-right: 1px solid #e4e4e4
        text-align: center
        span
          display: block
        .marketView-title
          display: block
          padding-left: 5px
          /*text-align: left*/
          font-size: 12px
          color: #808492
        .marketView-value
          display: block
          position: relative
          font-size: 20px
          color: #5a5b5d
          transition: all .1s ease-out .1s
          &:hover
            color: #409eff
            transform: scale(1.2, 1.2)
      .A4, .A7
        border-right: none
    .line2
      flex-wrap: wrap
      width: 100%
      text-align: center
      margin-top: 80px
      .B1, .B2, .B3
        flex: 1
        margin-right: 10px
        min-width: 450px
        min-height:450px
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
    .marketViewTimeSelect
      margin: -10px 0 30px 38px
</style>
