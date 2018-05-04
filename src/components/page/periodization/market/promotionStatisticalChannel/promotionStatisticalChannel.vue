<template>
  <div class="promotionStatisticalChannel" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">渠道商名称：</span>
        <el-select v-model.trim="channel_trader_name" filterable clearable size="mini" placeholder="不限"
                   class="promotionChannelSelect">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <span class="managerFront">日期：</span>
        <el-date-picker v-model.trim="startTime" type="date" size="mini" placeholder="从"
                        class="userListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
        <el-date-picker v-model.trim="endTime" type="date" size="mini" placeholder="到"
                        class="userListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
      </li>
      <li>
        <el-button type="primary" size="mini" class="searchButton" @click.prevent.stop="search">搜索</el-button>
        <el-button type="primary" size="mini" v-if='isRefreshData' :loading="buttonLoading"
                   @click.prevent.stop="refreshData" class="refreshButton">一键刷新
        </el-button>
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe style="width: 100%;overflow: auto" :height="height"
              class="promotionStatisticalChannel-table" @sort-change="sort">
      <el-table-column property="d_date" fixed sortable="custom" label="日期" min-width="90"></el-table-column>
      <el-table-column property="channel_trader_name" label="渠道商名称" min-width="100"></el-table-column>
      <el-table-column property="settle_method" label="结算方式" min-width="130"></el-table-column>
      <el-table-column property="effe_cust_acqu_cost" sortable="custom" label="有效获客成本(元)" min-width="140"></el-table-column>
      <el-table-column property="day_consumption" sortable="custom" label="当日消耗(元)" min-width="120"></el-table-column>
      <el-table-column property="register_num" sortable="custom" label="注册量" min-width="110">></el-table-column>
      <el-table-column property="all_fact_auth_num" sortable="custom" label="全要素认证人数" min-width="140"></el-table-column>
      <el-table-column property="apply_loan_num" sortable="custom" label="申请借款人数" min-width="120"></el-table-column>
      <el-table-column property="apply_loan_num_new" sortable="custom" label="新用户申请借款人数" min-width="160"></el-table-column>
      <el-table-column property="apply_loan_num_old" sortable="custom" label="老用户申请借款人数" min-width="160"></el-table-column>
      <el-table-column property="blacklist_num" sortable="custom" label="黑名单人数" min-width="120"></el-table-column>
      <!--<el-table-column property="entries_num" label="进件数"></el-table-column>-->
      <el-table-column property="nuser_apply_succ_num" sortable="custom" label="新用户申请成功人数" min-width="160"></el-table-column>
      <el-table-column property="ouser_apply_succ_num" sortable="custom" label="老用户申请成功人数" min-width="160"></el-table-column>
      <el-table-column property="nuser_loan_ratio" sortable="custom" label="新用户借款率" min-width="120"></el-table-column>
      <el-table-column property="nuser_adoption_rate" sortable="custom" label="新用户通过率" min-width="120"></el-table-column>
      <el-table-column property="nuser_loan_amount" sortable="custom" label="新用户放款金额(元)" min-width="150"></el-table-column>
      <el-table-column property="ouser_adoption_rate" sortable="custom" label="老用户通过率" min-width="120"></el-table-column>
      <el-table-column property="ouser_loan_amount" sortable="custom" label="老用户放款金额(元)" min-width="150"></el-table-column>
      <el-table-column property="DUE_AMOUNT" sortable="custom" label="到期金额(元)" min-width="120"></el-table-column>
      <el-table-column property="overdue_num" sortable="custom" label="逾期人数" min-width="120"></el-table-column>
      <el-table-column property="OVERDUE_AMOUNT" sortable="custom" label="逾期金额(元)" min-width="120"></el-table-column>
      <el-table-column property="BADDEBT_RATE" sortable="custom" label="坏账率" min-width="100"></el-table-column>
      <el-table-column property="BADDEBT_amount" sortable="custom" label="坏账金额(元)" min-width="120"></el-table-column>
      <el-table-column property="UNITGROSS_PROFIT" sortable="custom" label="单位毛利润(元)" min-width="130"></el-table-column>
      <el-table-column property="baddebt_amount_unit" sortable="custom" label="单位坏账金额(元)" min-width="140"></el-table-column>
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
    getPromotionStatisticalChannel,
    getPromotionStatisticalChannelCount,
    getPromotionStatisticalChannelSelect,
    getPromotionStatisticalChannelRefresh
  } from '../../../../../common/js/api'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        channel_trader: '',
        channel_trader_name: '',
        fundData: [],
        loading: false,
        options: [],
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
    created() {
      this.loading = true
      this.getSelectOptions()
      this.getDataInit()
      this.isShowRefreshAndExcel()
    },
    mounted() {
      this.resizeHeight()
    },
    computed: {
      mosaicLink() {
        return 'api/promotionStatisticalChannel/excel?channel_trader_name="' + [this.channel_trader_name, 'SELECT'] + '"&startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"'
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
        return getPromotionStatisticalChannel({
          channel_trader: [this.channel_trader, 'INPUT'],
          channel_trader_name: [this.channel_trader_name, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        })
      },
      getCount() {
        return getPromotionStatisticalChannelCount({
          channel_trader: [this.channel_trader, 'INPUT'],
          channel_trader_name: [this.channel_trader_name, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE']
        })
      },
      getSelectOptions() {
        getPromotionStatisticalChannelSelect().then((response) => {
          this.options = response.data
        })
      },
      search() {
        this.loading = true
        this.getDataInit()
      },
      refreshData() {
        this.buttonLoading = true
        getPromotionStatisticalChannelRefresh().then((response) => {
          if (response.data.code === '200') {
            this.getDataInit()
            this.buttonLoading = false
            this.$message({
              message: '推广统计(渠道)刷新完毕，请查看',
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
              this.$message.error('推广统计(渠道)一键刷新出现错误，请检查网络或联系管理员')
            }, 1000)
          }
        }).catch(() => {
          this.buttonLoading = false
          this.$message.error('推广统计(渠道)一键刷新出现错误，请检查网络或联系管理员')
        })
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
  .promotionStatisticalChannel
    height: 100%
    .date-filter
      li
        .managerText
          width: 165px
        .promotionChannelSelect, .userListTimeSelect
          width: 165px


  @media (max-width: 847px)
    .promotionStatisticalChannel
      .date-filter
        li
          .managerFront
            width: 72px

</style>
