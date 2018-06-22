<template>
  <div class="collectionManagement" v-loading.body="loading" element-loading-text="拼命加载中" >
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
    <el-table :data="fundData" highlight-current-row border stripe style="width: 100%;overflow: auto" :height="height" class="collectionManagement-table" @sort-change="sort" >
      <el-table-column property="d_date" fixed sortable="custom" label="日期" min-width="90"></el-table-column>
      <el-table-column property="overdue_total" label="当日逾期总额(元)" min-width="120"></el-table-column>
      <el-table-column label="S1">
        <el-table-column property="overdue_payment_s1" label="S1逾期回款(元)" min-width="110"></el-table-column>
        <el-table-column property="overdue_index_s1" label="S1-K/D"></el-table-column>
        <el-table-column property="late_fee_s1" label="S1滞纳金收入(元)" min-width="120"></el-table-column>
      </el-table-column>
      <el-table-column label="S2">
        <el-table-column property="overdue_payment_s2" label="S2逾期回款(元)" min-width="110"></el-table-column>
        <el-table-column property="overdue_index_s2" label="S2-K/D"></el-table-column>
        <el-table-column property="late_fee_s2" label="S2滞纳金收入(元)" min-width="120"></el-table-column>
      </el-table-column>
      <el-table-column label="M2">
        <el-table-column property="overdue_payment_m2" label="M2逾期回款(元)" min-width="110"></el-table-column>
        <el-table-column property="overdue_index_m2" label="M2-K/D"></el-table-column>
        <el-table-column property="late_fee_m2" label="M2滞纳金收入(元)" min-width="120"></el-table-column>
      </el-table-column>
      <el-table-column label="M3">
        <el-table-column property="overdue_payment_m3" label="M3逾期回款(元)" min-width="110"></el-table-column>
        <el-table-column property="overdue_index_m3" label="M3-K/D"></el-table-column>
        <el-table-column property="late_fee_m3" label="M3滞纳金收入(元)" min-width="120"></el-table-column>
      </el-table-column>
      <el-table-column label="M3+">
        <el-table-column property="bad_debt_m3" label="M3+逾期回款(元)" min-width="120"></el-table-column>
        <el-table-column property="overdue_index_m4" label="M3+-K/D"></el-table-column>
        <el-table-column property="comp_late_fee" label="M3+滞纳金收入(元)" min-width="130"></el-table-column>
      </el-table-column>
      <el-table-column property="due_debt_m3" label="当日M3+逾期金额(元)" min-width="140"></el-table-column>
      <el-table-column property="accu_late_fee" label="累计滞纳金收入(元)" min-width="130"></el-table-column>
      <el-table-column property="create_time" sortable="custom" label="更新时间" min-width="140"></el-table-column>
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
    getCollectionManagement,
    getCollectionManagementCount,
    getCollectionManagementRefresh
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
      // this.loading = true
      // this.getDataInit()
      // this.isShowRefreshAndExcel()
    },
    mounted () {
      this.resizeHeight()
    },
    computed: {
      mosaicLink () {
        return 'api/collectionManagement/excel?startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"'
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
        return getCollectionManagement({
          limit: this.limit,
          offset: this.offset,
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          order: this.order
        })
      },
      getCount () {
        return getCollectionManagementCount({
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE']
        })
      },
      search () {
        // this.loading = true
        // this.getDataInit()
      },
      refreshData () {
        this.buttonLoading = true
        getCollectionManagementRefresh().then((response) => {
          if (response.data.code === '200') {
            this.getDataInit()
            this.buttonLoading = false
            this.$message({
              message: '催收管理刷新完毕，请查看',
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
              this.$message.error('催收管理一键刷新出现错误，请检查网络或联系管理员')
            }, 1000)
          }
        }).catch(() => {
          this.buttonLoading = false
          this.$message.error('催收管理一键刷新出现错误，请检查网络或联系管理员')
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
.collectionManagement
  height: 100%
  .date-filter
    li
      .dateSelect
        width: 165px

</style>
