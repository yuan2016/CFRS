<template>
  <div class="userRechargeIntervalAnalysisWeekly" v-loading.body="loading" element-loading-text="拼命加载中"
  >
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">日期：</span>
        <el-date-picker
          size="mini"
          v-model.trim="startTime"
          type="week"
          class="dateSelect"
          placeholder="选择周"
          format="yyyy 第 WW 周"
          :picker-options="{firstDayOfWeek: 1}">
        </el-date-picker>
      </li>
      <li>
        <el-button class="searchButton" type="primary" size="mini" @click.prevent.stop="search">搜索</el-button>
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe style="width: 100%;overflow: auto;" :height="height"
              class="userRechargeIntervalAnalysisWeekly-table" @sort-change="sort">
      <el-table-column property="d_date" fixed sortable="custom" label="日期" min-width="140"></el-table-column>
      <el-table-column property="d_year" sortable="custom" label="年份" min-width="100"></el-table-column>
      <el-table-column property="money_amount" label="用户充值金额" min-width="120"></el-table-column>
      <el-table-column property="first2second_time" sortable="custom" label="首次到二次充值时间间隔(秒)" min-width="210"></el-table-column>
      <el-table-column property="second2third_time" sortable="custom" label="二次到三次充值时间间隔(秒)" min-width="210"></el-table-column>
      <el-table-column property="last2_time" sortable="custom" label="近两次充值间隔(秒)"  min-width="160"></el-table-column>
      <el-table-column property="recharge" sortable="custom" label="充值次数" min-width="150"></el-table-column>
      <el-table-column property="avg_money" sortable="custom" label="平均充值金额(元)" min-width="150"></el-table-column>
      <el-table-column property="avg_coin" sortable="custom" label="平均充值币" min-width="150"></el-table-column>
      <el-table-column property="modified_time" sortable="custom" label="修改时间" min-width="140"></el-table-column>
    </el-table>
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
</template>

<script type="text/ecmascript-6">
  import banner from '../../../../common/banner/banner'
  import {getNowFormatDate, formatDate} from '../../../../../common/js/utils'
  import {
    getUserRechargeIntervalAnalysisWeeklyQE,
    getUserRechargeIntervalAnalysisWeeklyQECount
  } from '../../../../../common/js/api'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        fundData: [],
        loading: false,
        pageContent: 'sizes',
        currentRow: null,
        offset: 0,
        limit: 20,
        count: 0,
        currentPage: 1,
        startTime: '',
        height: 500,
        buttonLoading: false,
        order: '',
        isRefreshData: false,
        isShowExcel: false
      }
    },
    components: {
      banner
    },
    created() {
      this.loading = true
      this.getDataInit()
      this.isShowRefreshAndExcel()
    },
    mounted() {
      this.resizeHeight()
    },
    computed: {
      mosaicLink() {
          return 'api/userRechargeIntervalAnalysisWeeklyQE/excel?startTime="' + this.startTime + '"'
      },
      ...mapGetters([
        'permission'
      ])
    },
    methods: {
      //每页显示数据量变更
      handleSizeChange(val) {
        this.limit = val
        this.loading = true
        this.getDataInit()
      },
      //页码变更
      handleCurrentChange(val) {
        this.currentPage = val
        this.offset = (val - 1) * this.limit
        this.loading = true
        this.getDataInit()
      },
      getDataInit() {
        this.axios.all([this.getCount(), this.getData()])
          .then(this.axios.spread((acct, perms) => {
            if (perms.data.code === '404' || acct.data.code === '404') {
              this.$router.push('./404')
            } else if (perms.data.code === '1024' || acct.data.code === '1024') {
              this.fundData = []
              this.loading = false
              this.$message({
                message: '请求超时，请增加搜索条件以便搜索',
                type: 'warning'
              })
            } else {
              this.count = acct.data[0].count
              this.fundData = perms.data
              this.loading = false
              this.pageContent = 'total, sizes, prev, pager, next, jumper'
            }
          })).catch(() => {
          this.fundData = []
          this.loading = false
          this.$message({
            message: '数据正在更新，请稍候',
            type: 'warning'
          })
        })
      },
      getData() {
        return getUserRechargeIntervalAnalysisWeeklyQE({
          limit: this.limit,
          offset: this.offset,
          startTime: [this.startTime, 'DATE'],
          order: this.order
        })
      },
      getCount() {
        return getUserRechargeIntervalAnalysisWeeklyQECount({
          startTime: [this.startTime, 'DATE']
        })
      },
      search() {
        this.loading = true
        this.getDataInit()
      },
      resizeHeight() {
        this.setHeight()
        window.onresize = this.setHeight
      },
      setHeight() {
        let docH = document.documentElement.clientHeight
        let docW = document.documentElement.clientWidth
        let banner = document.getElementsByClassName('banner')[0]
        let bannerH = 0
        let filter = document.getElementsByClassName('date-filter')[0]
        let filterH = 0
        let page = document.getElementsByClassName('el-pagination')[0]
        let pageH = 0
        if (banner) {
          bannerH = banner.offsetHeight
        }
        if (filter) {
          filterH = filter.clientHeight
        }
        if (page) {
          if (page.offsetHeight !== 0) {
            pageH = page.offsetHeight
          } else {
            pageH = 32
          }
        } else {
          pageH = 60
        }
        this.height = docH - filterH - bannerH - pageH - 105
      },
      sort(info) {
        if (info.order === 'ascending') {
          this.order = ' order by ' + info.prop + ' asc'
        } else if (info.order === 'descending') {
          this.order = ' order by ' + info.prop + ' desc'
        } else {
          this.order = ''
        }
        this.search(this.order)
      },
      isShowRefreshAndExcel() {
        if (this.permission.indexOf('refreshed') > -1) {
          this.isRefreshData = 'refreshed'
        } else {
          this.isRefreshData = false
        }
        if (this.permission.indexOf('excel') > -1) {
          this.isShowExcel = 'excel'
        } else {
          this.isShowExcel = false
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .userRechargeIntervalAnalysisWeekly
    height: 100%
    .date-filter
      li
        .dateSelect
          width: 150px
</style>
