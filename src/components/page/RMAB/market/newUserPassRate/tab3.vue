<template>
  <div class="tab3" v-loading.fullscreen="loading" element-loading-text="拼命加载中">
    <div class="row1">
      <el-select v-model.trim="channel_trader_name_rejected" filterable clearable size="mini" placeholder="不限"
                 class="tab3Select select1">
        <el-option
          v-for="item in options1"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model.trim="date_rejected" filterable clearable size="mini" placeholder="请选择时间段"
                 class="tab3Select select2">
        <el-option
          v-for="item in options2"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div class="A1" :style="{ height: height1 + 'px' }">
        <rejected-resons20 :times="date_rejected" :channelTiTle="channel_trader_name_rejected"></rejected-resons20>
      </div>
    </div>
    <div class="row2">
      <el-select v-model.trim="channel_trader_name_daily" filterable clearable size="mini" placeholder="请选择被拒原因"
                 class="tab3Select">
        <el-option
          v-for="item in options3"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div class="A2" :style="{ height: height2 + 'px' }">
        <daily-rejected-num-trends :prop="channel_trader_name_daily"></daily-rejected-num-trends>
      </div>
      <el-select v-model.trim="period" filterable clearable size="mini" placeholder="请选择时间段"
                 class="tab3Select selectBottom">
        <el-option
          v-for="item in options4"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div class="A3" :style="{ height: height2 + 'px' }">
        <channel-rejected-reason :prop="period"></channel-rejected-reason>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import rejectedResons20 from '../../../../charts/tab3/rejectedResons20/rejectedResons20'
  import dailyRejectedNumTrends from '../../../../charts/tab3/dailyRejectedNumTrends/dailyRejectedNumTrends'
  import channelRejectedReason from '../../../../charts/tab3/channelRejectedReason/channelRejectedReason'
  import { getTab3SelectOptions, getTab3DailyOptions } from '../../../../../common/js/api'

  export default {
    data () {
      return {
        channel_trader_name_rejected: '',
        date_rejected: '',
        channel_trader_name_daily: '',
        period: '',
        options1: [],
        options2: [{
          value: '日',
          label: '本日'
        }, {
          value: '周',
          label: '本周'
        }, {
          value: '月',
          label: '本月'
        }],
        options3: [],
        options4: [{
          value: '日',
          label: '本日'
        }, {
          value: '周',
          label: '本周'
        }, {
          value: '月',
          label: '本月'
        }],
        loading: false,
        height1: 700,
        height2: 300
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
      this.getSelectOptions()
      this.getDailyOptions()
    },
    methods: {
      resizeHeight () {
        this.setHeight()
        window.onresize = this.setHeight
      },
      setHeight () {
        let docH = document.documentElement.clientHeight
        let height1 = docH - 222 - 10
        let height2 = (height1 - 60 - 20) / 2
        if (height1 > 450) {
          this.height1 = height1
        } else {
          this.height = 450
        }
        if (height2 > 210) {
          this.height2 = height2
        } else {
          this.height2 = 210
        }
      },
      getSelectOptions () {
        getTab3SelectOptions().then((res) => {
          if (res.data) {
            this.options1 = res.data
          } else {
            this.options1 = []
            this.$message({
              message: '数据正在更新，请稍候',
              type: 'warning'
            })
          }
        }).catch(() => {
          this.options1 = []
          this.$message({
            message: '数据正在更新，请稍候',
            type: 'warning'
          })
        })
      },
      getDailyOptions () {
        getTab3DailyOptions().then((res) => {
          if (res.data) {
            this.options3 = res.data
          } else {
            this.options3 = []
            this.$message({
              message: '数据正在更新，请稍候',
              type: 'warning'
            })
          }
        }).catch(() => {
          this.options3 = []
          this.$message({
            message: '数据正在更新，请稍候',
            type: 'warning'
          })
        })
      }
    },
    components: {
      rejectedResons20,
      dailyRejectedNumTrends,
      channelRejectedReason
    }
  }

</script>

<style lang="stylus" rel="stylesheet/stylus">
  .tab3
    display: flex
    flex-wrap: wrap
    padding: 20px 20px 0 20px
    box-sizing: border-box
    .row1
      flex: 4
      margin-right: 20px
      min-width: 500px
      .A1
        /*height: 700px*/
      .title
        display: inline-block
        margin: 0 10px 20px 0
        width: 20%
        height: 30px
        border: 1px solid #cccccc
        border-radius: 5px
      .select1
        width: 170px
        margin-left: -20px
      .select2
        width: 170px
    @media (max-width: 1200px)
      .select2
        margin: 10px 0 0 0
    @media (max-width: 992px)
      .select2
        margin: 0
    @media (max-width: 768px)
      .select2
        margin: 10px 0 0 -20px
    .row2
      flex: 5
      min-width: 500px
      .A2
        height: 300px
      .A3
        height: 330px
      .tab3Select
        margin-left: 30px
      .selectBottom
        margin-top: 20px
</style>
