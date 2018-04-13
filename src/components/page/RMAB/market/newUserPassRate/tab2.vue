<template>
  <div class="tab2" v-loading.fullscreen="loading" element-loading-text="拼命加载中">
    <div class="row1">
      <span class="top">
           <el-select v-model.trim="channel_trader_name_daily" filterable clearable size="mini" placeholder="不限"
                      class="tab2Select select">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="A1" :style="{ height: height1 + 'px',width: width1 + 'px'}">
          <dailypass-rate-and-overdue-trends :prop="channel_trader_name_daily"></dailypass-rate-and-overdue-trends>
        </div>
      </span>
      <span class="bottom">
       <el-select v-model.trim="channel_trader_name_weekly" filterable clearable size="mini" placeholder="不限"
                  class="tab2Select select">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="A2" :style="{ height: height1 + 'px',width: width1 + 'px'}">
          <weeklypass-rate-and-overdue-trends :prop="channel_trader_name_weekly"></weeklypass-rate-and-overdue-trends>
        </div>
      </span>
    </div>
    <div class="row2">
      <el-select v-model.trim="channelName" filterable clearable size="mini" placeholder="不限"
                 class="tab2Select" @change="getDataInit">
        <el-option
          v-for="item in options3"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker v-model.trim="date" type="date" size="mini" placeholder="申请日"
                      class="userListTimeSelect" @change="search" value-format="yyyy-MM-dd"></el-date-picker>
      <p class="tab2-title">渠道基本信息</p>
      <div class="table-container" :style="{ width: width2 + 'px' }">
        <el-table :data="fundData" highlight-current-row border stripe class="tab2-table"
                  style="width:100%;overflow: auto" :height="height2" @sort-change="sort" >
          <el-table-column property="d_date" label="申请日" min-width="90"></el-table-column>
          <el-table-column property="qdmc" label="渠道名称"></el-table-column>
          <el-table-column property="sqzrs" sortable="custom"  label="申请人数" min-width="100"></el-table-column>
          <el-table-column property="sqtgrs" sortable="custom" label="申请成功人数" min-width="120"></el-table-column>
          <el-table-column property="tgl" sortable="custom" label="通过率" min-width="100"></el-table-column>
          <el-table-column property="sq_fkamt" sortable="custom" label="放款金额(元)" min-width="120"></el-table-column>
          <el-table-column property="sq_dqamt" sortable="custom" label="到期金额(元)" min-width="120"></el-table-column>
          <el-table-column property="sq_yqamt" sortable="custom" label="逾期金额(元)" min-width="120"></el-table-column>
          <el-table-column property="sq_yql" sortable="custom" label="逾期率" min-width="100"></el-table-column>
        </el-table>
      </div>
      <div style="text-align: center;margin-top: 10px;" v-show="fundData.length!=0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          :layout="pageContent"
          :total="count">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import dailypassRateAndOverdueTrends from '../../../../charts/tab2/dailypassRateAndOverdueTrends/dailypassRateAndOverdueTrends'
  import weeklypassRateAndOverdueTrends from '../../../../charts/tab2/weeklypassRateAndOverdueTrends/weeklypassRateAndOverdueTrends'
  import { mapState } from 'vuex'
  import { getTab2SelectOptions, getTab2TableInfo, getTab2TableCount } from '../../../../../common/js/api'

  export default {
    data () {
      return {
        channel_trader_name_daily: '',
        channel_trader_name_weekly: '',
        channelName: '',
        date: '',
        currentRow: null,
        options1: [],
        options2: [],
        options3: [],
        dueDate: '',
        offset: 0,
        limit: 20,
        count: 0,
        currentPage: 1,
        pageContent: 'total, prev, pager, next, jumper',
        fundData: [],
        loading: false,
        height1: 310,
        height2: 596,
        width1: 500,
        width2: 500,
        order: ''
      }
    },
    computed: {
      ...mapState({
        sidebar: state => state.app.sidebar.opened
      })
    },
    watch: {
      sidebar: function () {
        this.resizeHeight()
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
      this.getDataInit()
    },
    methods: {
      resizeHeight () {
        this.setHeight()
        window.onresize = this.setHeight
      },
      setHeight () {
        let docH = document.documentElement.offsetHeight
        let docW = document.documentElement.offsetWidth
        let width
        let height
        let height1
        let height2
        //大屏
        if (!this.sidebar) {
          if (docW > 1521) {
            width = docW - 130
            this.width1 = width / 16 * 6
            this.width2 = width / 16 * 10
            height1 = (docH - 333) / 2
            if (height1 > 200) {
              this.height1 = height1
            } else {
              this.height1 = 200
            }
            height2 = docH - 360
            if (height2 > 370) {
              this.height2 = height2
            } else {
              this.height2 = 370
            }
          } else if (docW > 1261) {
            width = docW - 110
            this.width1 = width / 2
            this.width2 = width
          } else {
            width = docW - 110
            if (width > 650) {
              this.width1 = width
              this.width2 = width
            } else {
              this.width1 = 650
              this.width2 = 650
            }
          }
          //小屏
        } else {
          if (docW > 1521) {
            width = docW - 330
            this.width1 = width / 16 * 6
            this.width2 = width / 16 * 10
            height1 = (docH - 333) / 2
            if (height1 > 200) {
              this.height1 = height1
            } else {
              this.height1 = 200
            }
            height2 = docH - 360
            if (height2 > 370) {
              this.height2 = height2
            } else {
              this.height2 = 370
            }
          } else if (docW > 1261) {
            width = docW - 310
            this.width1 = width / 2
            this.width2 = width
          } else {
            width = docW - 310
            if (width > 650) {
              this.width1 = width
              this.width2 = width
            } else {
              this.width1 = 650
              this.width2 = 650
            }
          }
        }
      },
      //每页显示数据量变更
      handleSizeChange (val) {
        this.limit = val
        this.getDataInit()
      },
      //页码变更
      handleCurrentChange (val) {
        this.currentPage = val
        this.offset = (val - 1) * this.limit
        this.getDataInit()
      },
      getDataInit () {
        this.axios.all([this.getCount(), this.getData()])
          .then(this.axios.spread((acct, perms) => {
            if (perms.data.code === '404' || acct.data.code === '404') {
              this.$router.push('./404')
            } else if (perms.data.code === '1024' || acct.data.code === '1024') {
              this.fundData = []
              this.$message({
                message: '请求超时，请增加搜索条件以便搜索',
                type: 'warning'
              })
            } else {
              this.count = acct.data[0].count
              this.fundData = perms.data
              this.pageContent = 'total, sizes, prev, pager, next, jumper'
            }
          })).catch(() => {
          this.fundData = []
          this.$message({
            message: '数据正在更新，请稍候',
            type: 'warning'
          })
        })
      },
      getData () {
        return getTab2TableInfo({
          channelName: this.channelName,
          date: this.date,
          offset: this.offset,
          limit: this.limit,
          order: this.order
        })
      },
      getCount () {
        return getTab2TableCount({
          channelName: this.channelName,
          date: this.date
        })
      },
      search (val) {
        this.date = val
        this.getDataInit()
      },
      getSelectOptions () {
        getTab2SelectOptions().then((res) => {
          if (res.data) {
            this.options1 = res.data
            this.options2 = res.data
            this.options3 = res.data
          } else {
            this.options1 = []
            this.options2 = []
            this.options3 = []
            this.$message({
              message: '数据正在更新，请稍候',
              type: 'warning'
            })
          }
        }).catch(() => {
          this.options1 = []
          this.options2 = []
          this.options3 = []
          this.$message({
            message: '数据正在更新，请稍候',
            type: 'warning'
          })
        })
      },
      sort (info) {
        if (info.order === 'ascending') {
          this.order = ' order by ' + info.prop + ' asc'
        } else if (info.order === 'descending') {
          this.order = ' order by ' + info.prop + ' desc'
        }
        this.search()
      }
    },
    components: {
      dailypassRateAndOverdueTrends,
      weeklypassRateAndOverdueTrends
    }
  }

</script>

<style lang="stylus" rel="stylesheet/stylus">
  .tab2
    display: flex
    flex-wrap: nowrap
    padding: 20px 20px 0 20px
    box-sizing: border-box
    .row1
      flex: 6
      margin-right: 20px
      .top
        min-width: 500px
        .A1
          margin-bottom: 20px
        .title
          display: inline-block
          margin-bottom: 20px
          width: 50%
          height: 30px
          border: 1px solid #cccccc
          border-radius: 5px
        .select
          margin-left: -20px
          margin-bottom: 20px
      .bottom
        min-width: 500px
        .A2
          height: 310px
        .title
          display: inline-block
          margin-bottom: 20px
          width: 50%
          height: 30px
          border: 1px solid #cccccc
          border-radius: 5px
        .select
          margin-left: -20px
          margin-bottom: 20px
    .row2
      flex: 10
      .tab2Select
        margin-bottom: 20px
      .title
        display: inline-block
        margin-bottom: 20px
        width: 30%
        height: 30px
        border: 1px solid #cccccc
        border-radius: 5px
      .tab2-title
        text-align: center
        margin: 5px 10px 20px 10px
        font-size: 14px
        font-weight: 600
        color: #575757
      .table-container
        .tab2-table
          border-radius: 10px

  @media (max-width: 1521px )
    .tab2
      display: block
      .row1
        display: flex
        width: 100%
        .top, .bottom
          flex: 1
      .row2
        width: 100%
        .table-container
          margin: 0 auto

  @media (max-width: 1261px )
    .tab2
      display: block
      .row1
        display: block
        .top, .bottom
          display: block
      .row2
        width: 100%
        .table-container
          margin: 0 auto
</style>
