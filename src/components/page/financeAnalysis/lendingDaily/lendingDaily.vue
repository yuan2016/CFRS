<template>
  <div class="lendingDaily" v-loading.body="loading" element-loading-text="拼命加载中" :style="{ height: dHeight + 'px' }">
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">日期：</span>
        <el-date-picker v-model.trim="startTime" type="date" size="mini" placeholder="从"
                        class="minutiaTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
        <el-date-picker v-model.trim="endTime" type="date" size="mini" placeholder="到"
                        class="minutiaTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
      </li>
      <li>
        <span class="managerFront">期限：</span>
        <el-select v-model.trim="loan_term" filterable clearable size="mini" placeholder="不限"
                   class="lendingDailySelect">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <el-button class="searchButton" type="primary" size="mini" @click.prevent.stop="search">搜索</el-button>
        <a :href="mosaicLink"  v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe class="lendingDaily-table"
              style="width: 100%;overflow: auto" :height="height"  @sort-change="sort">
      <el-table-column property="D_DATE" fixed sortable="custom" label="日期" min-width="90"></el-table-column>
      <el-table-column property="LOAN_TERM"  label="期限"></el-table-column>
      <el-table-column  label="放款金额">
        <el-table-column property="MONEY_AMOUNT_A"  label="A类" width="120"></el-table-column>
        <el-table-column property="MONEY_AMOUNT_B"  label="B类"  width="120"></el-table-column>
        <el-table-column property="MONEY_AMOUNT_C"  label="C类" width="120" ></el-table-column>
        <el-table-column property="MONEY_AMOUNT_D"  label="D类" width="120"></el-table-column>
        <el-table-column property="MONEY_AMOUNT_O"  label="其他借款" width="120"></el-table-column>
        <el-table-column property="MONEY_AMOUNT_SUM"  label="小计" width="120"></el-table-column>
      </el-table-column>
      <el-table-column  label="实际放款金额">
        <el-table-column property="INTO_MONEY_A"  label="A类" width="120"></el-table-column>
        <el-table-column property="INTO_MONEY_B"  label="B类" width="120"></el-table-column>
        <el-table-column property="INTO_MONEY_C"  label="C类" width="120"></el-table-column>
        <el-table-column property="INTO_MONEY_D"  label="D类" width="120"></el-table-column>
        <el-table-column property="INTO_MONEY_O"  label="其他借款" width="120"></el-table-column>
        <el-table-column property="INTO_MONEY_SUM"  label="小计" width="120"></el-table-column>
      </el-table-column>
      <el-table-column  label="放款笔数">
        <el-table-column property="TRADE_CNT_A"  label="A类" width="100"></el-table-column>
        <el-table-column property="TRADE_CNT_B"  label="B类" width="100"></el-table-column>
        <el-table-column property="TRADE_CNT_C"  label="C类" width="100"></el-table-column>
        <el-table-column property="TRADE_CNT_D"  label="D类" width="100"></el-table-column>
        <el-table-column property="TRADE_CNT_O"  label="其他借款" width="100"></el-table-column>
        <el-table-column property="TRADE_CNT_SUM"  label="小计" width="100"></el-table-column>
      </el-table-column>
      <el-table-column  label="应收服务费和加急费">
        <el-table-column property="FEE_A"  label="A类" width="120"></el-table-column>
        <el-table-column property="FEE_B"  label="B类" width="120"></el-table-column>
        <el-table-column property="FEE_C"  label="C类" width="120"></el-table-column>
        <el-table-column property="FEE_D"  label="D类" width="120"></el-table-column>
        <el-table-column property="FEE_O"  label="其他借款" width="120"></el-table-column>
        <el-table-column property="FEE_SUM"  label="小计" width="120"></el-table-column>
      </el-table-column>
      <el-table-column property="CREATE_TIME"  label="创建时间" width="140"></el-table-column>
      <el-table-column property="UPDATE_TIME"  label="更新时间" width="140"></el-table-column>
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
  import banner from '../../../common/banner/banner'
  import { getNowFormatDate, formatDate } from '../../../../common/js/utils'
  import {
    getLendingDaily,
    getLendingDailyCount,
    getLendingDailySum
  } from '../../../../common/js/api'
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
        fundData: [],
        loading: false,
        buttonLoading: false,
        d_date: '',
        currentRow: null,
        offset: 0,
        limit: 20,
        count: 0,
        currentPage: 1,
        startTime: '',
        endTime: '',
        pageContent: 'sizes',
        height: 500,
        dHeight: 500,
        order: '',
        loan_term: '',
        options: [{
          value: '',
          label: '不限'
        }, {
          value: '7',
          label: '7天'
        }, {
          value: '14',
          label: '14天'
        }, {
          value: '21',
          label: '21天'
        }, {
          value: '90',
          label: '90天'
        }],
        isRefreshData: false,
        isShowExcel: false
      }
    },
    computed: {
      mosaicLink () {
        return 'api/lendingDaily/excel?startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"&loan_term="' + [this.loan_term, 'SELECT'] + '"'
      },
      ...mapGetters([
        'permission'
      ])
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
        this.axios.all([this.getCount(), this.getData(), this.getSum()])
          .then(this.axios.spread((acct, perms, sum) => {
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
              let newdata = perms.data
              newdata.unshift(sum.data[0])
              this.fundData = newdata
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
        return getLendingDaily({
          limit: this.limit,
          offset: this.offset,
          order: this.order,
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          loan_term: [this.loan_term, 'SELECT']
        })
      },
      getCount () {
        return getLendingDailyCount({
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          loan_term: [this.loan_term, 'SELECT']
        })
      },
      getSum () {
        return getLendingDailySum({
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          loan_term: [this.loan_term, 'SELECT']
        })
      },
      search () {
        this.loading = true
        this.getDataInit()
      },
      resizeHeight () {
        this.setHeight()
        window.onresize = this.setHeight
      },
      setHeight () {
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

<style lang="stylus" rel="stylesheet/stylus" >
  .lendingDaily
    height: 100%
    .date-filter
      li
        .minutiaTimeSelect
          width: 150px
        .lendingDailySelect
          width: 100px
    .el-table
      tbody
        tr:first-of-type
          td
            .cell
              color: #ff4949

</style>
