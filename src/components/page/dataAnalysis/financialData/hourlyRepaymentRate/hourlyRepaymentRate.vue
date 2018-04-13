<template>
  <div class="hourlyRepaymentRate" v-loading.fullscreen="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <el-date-picker v-model.trim="startTime" type="date" size="mini" placeholder="请选择日期"
                    class="tab1TimeSelect" @change="change1" value-format="yyyy-MM-dd"></el-date-picker>
    <el-select v-model.trim="hour" size="mini" placeholder="不限" class="loanAppSelect">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        @change="change2">
      </el-option>
    </el-select>
    <el-select v-model.trim="model" size="mini" placeholder="请选择" class="table-to-pic" @change="goto">
      <el-option
        v-for="item in options1"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <div class="line">
      <span class="can" :style="{ height: height + 'px' }">
        <hourly-repayment-rate-pic :message="startTime" :info="hour"></hourly-repayment-rate-pic>
      </span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import hourlyRepaymentRatePic from '../../../../charts/hourlyRepaymentRatePic/hourlyRepaymentRatePic'
  import banner from '../../../../common/banner/banner'
  import { formatDate } from '../../../../../common/js/utils'
  import { getRatio } from '../../../../../common/js/api'

  export default {
    data () {
      return {
        startTime: '' || this.getToday(),
        loading: false,
        height: 320,
        hour: this.getHour() || '_09',
        options: [{
          value: '_00',
          label: '0时'
        }, {
          value: '_01',
          label: '1时'
        }, {
          value: '_02',
          label: '2时'
        }, {
          value: '_03',
          label: '3时'
        }, {
          value: '_04',
          label: '4时'
        }, {
          value: '_05',
          label: '5时'
        }, {
          value: '_06',
          label: '6时'
        }, {
          value: '_07',
          label: '7时'
        }, {
          value: '_08',
          label: '8时'
        }, {
          value: '_09',
          label: '9时'
        }, {
          value: '_10',
          label: '10时'
        }, {
          value: '_11',
          label: '11时'
        }, {
          value: '_12',
          label: '12时'
        }, {
          value: '_13',
          label: '13时'
        }, {
          value: '_14',
          label: '14时'
        }, {
          value: '_15',
          label: '15时'
        }, {
          value: '_16',
          label: '16时'
        }, {
          value: '_17',
          label: '17时'
        }, {
          value: '_18',
          label: '18时'
        }, {
          value: '_19',
          label: '19时'
        }, {
          value: '_20',
          label: '20时'
        }, {
          value: '_21',
          label: '21时'
        }, {
          value: '_22',
          label: '22时'
        }, {
          value: '_23',
          label: '23时'
        }],
        model: './hourlyRepaymentRate',
        options1: [{
          label: '图',
          value: './hourlyRepaymentRate'
        }, {
          label: '表',
          value: './hourlyRepaymentRateT'
        }]
      }
    },
    mounted () {
      this.resizeHeight()
    },
    components: {
      hourlyRepaymentRatePic,
      banner
    },
    methods: {
      getHour () {
        let hour = new Date().getHours()
        if (hour < 10) {
          return '_0' + hour
        }
        return '_' + hour
      },
      goto () {
        this.$router.push(this.model)
      },
      resizeHeight () {
        this.setHeight()
        window.onresize = this.setHeight
      },
      setHeight () {
        let docH = document.documentElement.clientHeight
        this.height = docH / 2
      },
      change1 (val) {
        this.startTime = val
      },
      change2 (val) {
        this.hour = val
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
  .hourlyRepaymentRate
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
