<template>
  <div class="naturalChannelStatistics" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">日期：</span>
        <el-date-picker
          size="mini"
          v-model.trim="startTime"
          type="date"
          class="dateSelect"
          placeholder="从"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-date-picker
          size="mini"
          v-model.trim="endTime"
          type="date"
          class="dateSelect"
          placeholder="到"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </li>
      <li>
        <el-button class="searchButton" type="primary" size="mini" @click.prevent.stop="search">搜索</el-button>
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe class="naturalChannelStatistics-table"
              style="width: 100%;overflow: auto" :height="height" @sort-change="sort">
      <el-table-column property="D_DATE" fixed sortable="custom" label="日期" width="90"></el-table-column>
      <el-table-column property="REGISTER_NUM" label="注册量" width="100px"></el-table-column>
      <el-table-column property="ALL_FACT_AUTH_NUM" label="全要素认证人数" width="110"></el-table-column>
      <el-table-column property="BLACKLIST_NUM" label="黑名单人数" width="100"></el-table-column>
      <el-table-column property="APPLY_LOAN_NUM" label="申请借款人数" width="100"></el-table-column>
      <el-table-column property="NUSER_APPLY_SUCC_NUM" label="新用户申请成功人数" width="130"></el-table-column>
      <el-table-column property="OUSER_APPLY_SUCC_NUM" label="老用户申请成功人数" width="130"></el-table-column>
      <el-table-column property="NUSER_LOAN_RATIO" label="新用户借款率" width="100"></el-table-column>
      <el-table-column property="NUSER_ADOPTION_RATE" label="新用户通过率" width="100"></el-table-column>
      <el-table-column property="NUSER_LOAN_AMOUNT" label="新用户放款金额(元)" width="130"></el-table-column>
      <el-table-column property="OUSER_ADOPTION_RATE" label="老用户通过率" width="100"></el-table-column>
      <el-table-column property="OUSER_LOAN_AMOUNT" label="老用户放款金额(元)" width="130"></el-table-column>
      <el-table-column property="RATE_FULL" label="满额率" width="100"></el-table-column>
      <el-table-column property="LOANED_AMOUNT_AVG" label="平均借款金额" width="100"></el-table-column>
      <el-table-column property="OLD_LOANED_CNT_AVG" label="老用户平均借款次数" width="130"></el-table-column>
      <el-table-column property="DUE_AMOUNT" label="到期金额(元)" width="100px"></el-table-column>
      <el-table-column property="PREPAYMENT_BEFORE_RATE" label="提前还款率" width="100"></el-table-column>
      <el-table-column property="OVERDUE_AMOUNT" label="逾期金额(元)" width="100"></el-table-column>
      <el-table-column property="OVERDUE_RATE" label="逾期率" width="100"></el-table-column>
      <el-table-column property="OVER_DUE_RATE_3" label="3日剩余逾期率" width="110"></el-table-column>
      <el-table-column property="OVER_DUE_RATE_10" label="10日剩余逾期率" width="110"></el-table-column>
      <el-table-column property="OVER_DUE_RATE_90" label="坏账率" width="100px"></el-table-column>
      <el-table-column property="COLLECTION_PRINCIPAL_DOING" label="在催金额(元)" width="110"></el-table-column>
      <el-table-column property="OVER_DUE_REPAYMENTED_AMOUNT" label="逾期回款" width="100"></el-table-column>
      <el-table-column property="LATE_FEE_INCOME" label="滞纳金收入" width="100"></el-table-column>
      <el-table-column label="新用户">
        <el-table-column property="OVERDUE_RATE_NUSER_14" label="14天逾期率" width="100"></el-table-column>
        <el-table-column property="OVERDUE_RATE_NUSER_21" label="21天逾期率" width="100"></el-table-column>
        <el-table-column property="OVER_DUE_RATE_3_NUSER_14" label="14天3天剩余逾期率" width="110"></el-table-column>
        <el-table-column property="OVER_DUE_RATE_10_NUSER_14" label="14天10天剩余逾期率" width="115"></el-table-column>
        <el-table-column property="OVER_DUE_RATE_3_NUSER_21" label="21天3天剩余逾期率" width="110"></el-table-column>
        <el-table-column property="OVER_DUE_RATE_10_NUSER_21" label="21天10天剩余逾期率" width="115"></el-table-column>
      </el-table-column>
      <el-table-column label="老用户">
        <el-table-column property="OVERDUE_RATE_OUSER_14" label="14天逾期率" width="100"></el-table-column>
        <el-table-column property="OVERDUE_RATE_OUSER_21" label="21天逾期率" width="100"></el-table-column>
        <el-table-column property="OVER_DUE_RATE_3_OUSER_14" label="14天3天剩余逾期率" width="110"></el-table-column>
        <el-table-column property="OVER_DUE_RATE_10_OUSER_14" label="14天10天剩余逾期率" width="115"></el-table-column>
        <el-table-column property="OVER_DUE_RATE_3_OUSER_21" label="21天3天剩余逾期率" width="110"></el-table-column>
        <el-table-column property="OVER_DUE_RATE_10_OUSER_21" label="21天10天剩余逾期率" width="115"></el-table-column>
      </el-table-column>
      <el-table-column property="CREATE_TIME" label="创建时间" width="140"></el-table-column>
      <el-table-column property="UPDATE_TIME" label="更新时间" width="140"></el-table-column>
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
    getNaturalChannelStatistics,
    getNaturalChannelStatisticsCount
  } from '../../../../../common/js/api'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        fundData: [],
        loading: false,
        currentRow: null,
        offset: 0,
        limit: 20,
        count: 0,
        currentPage: 1,
        startTime: '',
        endTime: '',
        pageContent: 'sizes',
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
      // this.loading = true
      // this.getDataInit()
      // this.isShowRefreshAndExcel()
    },
    mounted() {
      this.resizeHeight()
    },
    computed: {
      mosaicLink() {
        return 'api/naturalChannelStatistics/excel?startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"'
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
        return getNaturalChannelStatistics({
          limit: this.limit,
          offset: this.offset,
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          order: this.order
        })
      },
      getCount() {
        return getNaturalChannelStatisticsCount({
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE']
        })
      },
      search() {
        // this.loading = true
        // this.getDataInit()
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
  .naturalChannelStatistics
    height: 100%
    .date-filter
      li
        .dateSelect
          width: 165px

</style>
