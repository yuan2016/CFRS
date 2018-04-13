<template>
  <div class="fundAnalysisProduct" v-loading.body="loading" element-loading-text="拼命加载中" >
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
        <el-button class="refreshButton"  v-if='isRefreshData' type="primary" size="mini" :loading="buttonLoading" @click.prevent.stop="refreshData">一键刷新</el-button>
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe style="width: 100%;overflow: auto" :height="height" class="fundAnalysisProduct-table" @sort-change="sort">
      <el-table-column property="D_DATE" sortable="custom" fixed label="日期" width="90"></el-table-column>
      <el-table-column label="当日应还总额(元)">
      <el-table-column property="TOTAL_AMOUNT_14" label="14天" min-width="100"></el-table-column>
      <el-table-column property="TOTAL_AMOUNT_21F" label="21天" min-width="100"></el-table-column>
      <el-table-column property="TOTAL_AMOUNT_90F" label="90天" min-width="100"></el-table-column>
      </el-table-column>
      <el-table-column label="实际还款金额(元)">
      <el-table-column property="ACTUAL_REPAYMENT_AMOUNT_14" label="14天" min-width="100"></el-table-column>
      <el-table-column property="ACTUAL_REPAYMENT_AMOUNT_21F" label="21天" min-width="100"></el-table-column>
      <el-table-column property="ACTUAL_REPAYMENT_AMOUNT_90F" label="90天" min-width="100"></el-table-column>
      </el-table-column>
      <el-table-column label="还款比例">
      <el-table-column property="REPAYMENT_RATIO_14" label="14天" min-width="100"></el-table-column>
      <el-table-column property="REPAYMENT_RATIO_21F" label="21天" min-width="100"></el-table-column>
      <el-table-column property="REPAYMENT_RATIO_90F" label="90天" min-width="100"></el-table-column>
      </el-table-column>
      <el-table-column property="RENEWAL_AMOUNT_14" label="续期金额-14天(元)" min-width="120"></el-table-column>
      <el-table-column property="RENEWAL_COMMISSION_14" label="续期手续费收入-14天(元)" min-width="160"></el-table-column>
      <el-table-column property="RENEWAL_RATIO_14" label="续期比例-14天" min-width="110"></el-table-column>
      <el-table-column label="逾期金额(元)">
      <el-table-column property="OVERDUE_AMOUNT_14" label="14天" min-width="100"></el-table-column>
      <el-table-column property="OVERDUE_AMOUNT_21F" label="21天" min-width="100"></el-table-column>
      <el-table-column property="OVERDUE_AMOUNT_90F" label="90天" min-width="100"></el-table-column>
      </el-table-column>
      <el-table-column label="逾期比例">
      <el-table-column property="OVERDUE_PROPORTION_14" label="14天" min-width="100"></el-table-column>
      <el-table-column property="OVERDUE_PROPORTION_21F" label="21天" min-width="100"></el-table-column>
      <el-table-column property="OVERDUE_PROPORTION_90F" label="90天" min-width="100"></el-table-column>
      </el-table-column>
      <el-table-column label="逾期还款金额(元)">
      <el-table-column property="OVERDUE_PAYMENT_AMOUNT_14" label="14天" min-width="100"></el-table-column>
      <el-table-column property="OVERDUE_PAYMENT_AMOUNT_21F" label="21天" min-width="100"></el-table-column>
      <el-table-column property="OVERDUE_PAYMENT_AMOUNT_90F" label="90天" min-width="100"></el-table-column>
      </el-table-column>
      <el-table-column label="滞纳金收入(元)">
      <el-table-column property="LATE_FEES_INCOME_14" label="14天" min-width="100"></el-table-column>
      <el-table-column property="LATE_FEES_INCOME_21F" label="21天" min-width="100"></el-table-column>
      <el-table-column property="LATE_FEES_INCOME_90F" label="90天" min-width="100"></el-table-column>
      </el-table-column>
      <el-table-column label="综合服务费收入(元)">
      <el-table-column property="COMP_SERVICE_INCOME_14" label="14天" min-width="100"></el-table-column>
      <el-table-column property="COMP_SERVICE_INCOME_21F" label="21天" min-width="100"></el-table-column>
      <el-table-column property="COMP_SERVICE_INCOME_90F" label="90天" min-width="100"></el-table-column>
      </el-table-column>
      <el-table-column label="实收服务费(元)">
      <el-table-column property="SERVICE_CHARGE_14" label="14天" min-width="100"></el-table-column>
      <el-table-column property="SERVICE_CHARGE_21F" label="21天" min-width="100"></el-table-column>
      <el-table-column property="SERVICE_CHARGE_90F" label="90天" min-width="100"></el-table-column>
      </el-table-column>
      <el-table-column label="同等金额收益(元)">
      <el-table-column property="EQUAL_AMOUNT_INCOME_14" label="14天" min-width="100"></el-table-column>
      <el-table-column property="EQUAL_AMOUNT_INCOME_21F" label="21天" min-width="100"></el-table-column>
      <el-table-column property="EQUAL_AMOUNT_INCOME_90F" label="90天" min-width="100"></el-table-column>
      </el-table-column>
      <el-table-column label="当日资金盈余(元)">
      <el-table-column property="CAPITAL_SURPLUS_14" label="14天" min-width="100"></el-table-column>
      <el-table-column property="CAPITAL_SURPLUS_21F" label="21天" min-width="100"></el-table-column>
      <el-table-column property="CAPITAL_SURPLUS_90F" label="90天" min-width="100"></el-table-column>
      </el-table-column>
      <el-table-column property="UPDATE_TIME" sortable="custom" label="更新时间" width="140"></el-table-column>
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
  import { getNowFormatDate, formatDate } from '../../../../../common/js/utils'
  import {
    getFundAnalysisProduct,
    getFundAnalysisProductCount,
    getFundAnalysisProductRefresh
  } from '../../../../../common/js/api'
  import { mapGetters } from 'vuex'

  export default {
    data () {
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
        endTime: '',
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
    created () {
      this.loading = true
      this.getDataInit()
      this.isShowRefreshAndExcel()
    },
    mounted () {
      this.resizeHeight()
    },
    computed: {
      mosaicLink () {
        return 'api/fundAnalysisProduct/excel?startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"'
      },
      ...mapGetters([
        'permission'
      ])
    },
    methods: {
      //每页显示数据量变更
      handleSizeChange (val) {
        this.limit = val
        this.loading = true
        this.getDataInit()
      },
      //页码变更
      handleCurrentChange (val) {
        this.currentPage = val
        this.offset = (val - 1) * this.limit
        this.loading = true
        this.getDataInit()
      },
      getDataInit () {
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
      getData () {
        return getFundAnalysisProduct({
          limit: this.limit,
          offset: this.offset,
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          order: this.order
        })
      },
      getCount () {
        return getFundAnalysisProductCount({
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE']
        })
      },
      search () {
        this.loading = true
        this.getDataInit()
      },
      refreshData () {
        this.buttonLoading = true
        getFundAnalysisProductRefresh().then((response) => {
          if (response.data.code === '200') {
            this.getDataInit()
            this.buttonLoading = false
            this.$message({
              message: '资金分析(产品)刷新完毕，请查看',
              type: 'success'
            })
          } else if (response.data.code === '400') {
            this.buttonLoading = false
            this.$message({
              message: '已经有用户在尝试刷新，请稍后刷新页面即可',
              type: 'warning'
            })
          } else {
            setTimeout(() => {
              this.buttonLoading = false
              this.$message.error('资金分析(分产品)一键刷新出现错误，请检查网络或联系管理员')
            }, 1000)
          }
        }).catch(() => {
          this.buttonLoading = false
          this.$message.error('资金分析(分产品)一键刷新出现错误，请检查网络或联系管理员')
        })
      },
      resizeHeight () {
        this.setHeight()
        window.onresize = this.setHeight
      },
      setHeight () {
        let docH = document.documentElement.clientHeight
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
      sort (info) {
        if (info.order === 'ascending') {
          this.order = ' order by ' + info.prop + ' asc'
        } else if (info.order === 'descending') {
          this.order = ' order by ' + info.prop + ' desc'
        } else {
          this.order = ''
        }
        this.search(this.order)
      },
      isShowRefreshAndExcel () {
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
.fundAnalysisProduct
  height :100%
  .date-filter
    li
      .dateSelect
        width: 165px


</style>
