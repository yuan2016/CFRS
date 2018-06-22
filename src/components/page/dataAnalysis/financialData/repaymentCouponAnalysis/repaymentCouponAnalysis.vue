 <template>
  <div class="repaymentCouponAnalysis" v-loading.body="loading" element-loading-text="拼命加载中">
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
        <el-button class="searchButton" type="primary" size="mini" @click.prevent.stop="search">搜索</el-button>
        <el-button class="refreshButton" v-if='isRefreshData' type="primary" size="mini" :loading="buttonLoading"
                   @click.prevent.stop="refreshData">一键刷新
        </el-button>
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe class="repaymentCouponAnalysis-table"
              style="width: 100%;overflow: auto" :height="height" @sort-change="sort">
      <el-table-column property="d_date" sortable="custom" label="日期" width="90"></el-table-column>
      <el-table-column label="到期用户数">
        <el-table-column property="d_Expuser_cnt" label="当日到期"></el-table-column>
        <el-table-column property="n_Expuser_cnt" label="次日到期"></el-table-column>
      </el-table-column>
      <el-table-column label="发券用户数">
        <el-table-column label="当日到期">
          <el-table-column property="d_uncoupon_cnt" label="未发券"></el-table-column>
          <el-table-column property="d_Fiftycoupon_cnt" label="50元券"></el-table-column>
          <el-table-column property="d_hundredcoupon_cnt" label="100元券"></el-table-column>
        </el-table-column>
        <el-table-column label="次日到期">
          <el-table-column property="n_uncoupon_cnt" label="未发券"></el-table-column>
          <el-table-column property="n_Fiftycoupon_cnt" label="50元券"></el-table-column>
          <el-table-column property="n_hundredcoupon_cnt" label="100元券"></el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="还款/用券用户数">
        <el-table-column label="当日到期">
          <el-table-column property="d_uncouponrep_cnt" label="未发券"></el-table-column>
          <el-table-column property="d_Fiftycouponrep_cnt" label="50元券"></el-table-column>
          <el-table-column property="d_hundredcouponrep_cnt" label="100元券"></el-table-column>
        </el-table-column>
        <el-table-column label="次日到期">
          <el-table-column property="n_uncouponrep_cnt" label="未发券"></el-table-column>
          <el-table-column property="n_Fiftycouponrep_cnt" label="50元券"></el-table-column>
          <el-table-column property="n_hundredcouponrep_cnt" label="100元券"></el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="还款/用券率">
        <el-table-column label="当日到期">
          <el-table-column property="d_unreprate_cnt" label="未发券"></el-table-column>
          <el-table-column property="d_Fiftyreprate_cnt" label="50元券"></el-table-column>
          <el-table-column property="d_hundredreprate_cnt" label="100元券"></el-table-column>
        </el-table-column>
        <el-table-column label="次日到期">
          <el-table-column property="n_unreprate_cnt" label="未发券"></el-table-column>
          <el-table-column property="n_Fiftyreprate_cnt" label="50元券"></el-table-column>
          <el-table-column property="n_hundredreprate_cnt" label="100元券"></el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column property="CREATE_TIME" label="刷新时间" width="140"></el-table-column>
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
    getRepaymentCouponAnalysis,
    getRepaymentCouponAnalysisCount,
    getRepaymentCouponAnalysisRefresh
  } from '../../../../../common/js/api'
  import {mapGetters} from 'vuex'

  export default {
    data() {
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
      mosaicLink() {
        return 'api/repaymentCouponAnalysis/excel?startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"'
      },
      ...mapGetters([
        'permission'
      ])
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
        return getRepaymentCouponAnalysis({
          limit: this.limit,
          offset: this.offset,
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          order: this.order
        })
      },
      getCount() {
        return getRepaymentCouponAnalysisCount({
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE']
        })
      },
      search() {
        // this.loading = true
        // if (this.startTime !== '') {
        //   this.startTime = formatDate(new Date(this.startTime), 'yyyy-MM-dd')
        // }
        // if (this.endTime !== '') {
        //   this.endTime = formatDate(new Date(this.endTime), 'yyyy-MM-dd')
        // }
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
      },
      refreshData() {
        this.buttonLoading = true
        getRepaymentCouponAnalysisRefresh().then((response) => {
          if (response.data.code === '200') {
            this.getDataInit()
            this.buttonLoading = false
            this.$message({
              message: '数据刷新完毕，请查看',
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
              this.$message.error('一键刷新出现错误，请检查网络或联系管理员')
            }, 1000)
          }
        }).catch(() => {
          this.buttonLoading = false
          this.$message.error('一键刷新出现错误，请检查网络或联系管理员')
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .repaymentCouponAnalysis
    height: 100%
    .date-filter
      li
        .minutiaTimeSelect
          width: 150px

</style>
