<template>
  <div class="monthlyPromotionEffect" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">渠道商名称：</span>
        <el-select v-model.trim="channel_name" filterable clearable size="mini" placeholder="不限"
                   class="monthlyPromotionEffectSelect">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <span class="demonstration">日期：</span>
        <el-date-picker size="mini" v-model.trim="startTime" type="month" class="monthlyPromotionEffectSelect" placeholder="从"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-date-picker size="mini" v-model.trim="endTime" type="month" class="monthlyPromotionEffectSelect" placeholder="到"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </li>
      <li>
        <el-button type="primary" size="mini" class="searchButton" @click.prevent.stop="search">搜索</el-button>
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe style="width: 100%;overflow: auto;" :height="height" class="monthlyPromotionEffect-table" @sort-change="sort">
      <el-table-column property="channel_name" fixed label="渠道名称" min-width="100"></el-table-column>
      <el-table-column property="y_year" sortable="custom" label="年份" min-width="90"></el-table-column>
      <el-table-column property="mm_month" sortable="custom" label="月份" min-width="90"></el-table-column>
      <el-table-column property="unit_price" sortable="custom" label="结算单价(元)" min-width="120"></el-table-column>
      <el-table-column property="channel_consumption" sortable="custom" label="渠道消耗(元)" min-width="120"></el-table-column>
      <el-table-column property="pv" label="PV数量" sortable="custom" min-width="100"></el-table-column>
      <el-table-column property="uv" label="UV数量" sortable="custom" min-width="100"></el-table-column>
      <el-table-column property="click_num" sortable="custom" label="点击次数" min-width="100"></el-table-column>
      <el-table-column property="click_people" sortable="custom" label="点击人数" min-width="110"></el-table-column>
      <el-table-column property="register_num" sortable="custom" label="注册数" min-width="110"></el-table-column>
      <el-table-column property="uv_conversion_rate" sortable="custom" label="UV转化率" min-width="110"></el-table-column>       
      <el-table-column property="click_conversion_rate" sortable="custom" label="点击转化率" min-width="110"></el-table-column>
      <el-table-column property="uv_output_value" label="UV产值" sortable="custom" min-width="100"></el-table-column>
      <el-table-column property="register_conversion_rate" sortable="custom" label="注册转化率" min-width="120"></el-table-column>
      <el-table-column property="element4_authentication" sortable="custom" label="全要素认证数" min-width="120"></el-table-column>
      <el-table-column property="credit_suss_num" sortable="custom" label="授信成功人数" min-width="120"></el-table-column>
      <el-table-column property="credit_fail_num" sortable="custom" label="授信失败人数" min-width="120"></el-table-column>
      <el-table-column property="hmd_num" sortable="custom" label="黑名单人数" min-width="120"></el-table-column>
      <el-table-column property="hmd_rate" sortable="custom" label="黑名单率" min-width="120"></el-table-column>
      <el-table-column property="nuser_buy_num" sortable="custom" label="新用户购买商品人数" min-width="160"></el-table-column>
      <el-table-column property="ouser_buy_num" sortable="custom" label="老用户购买商品人数" min-width="160"></el-table-column>
      <el-table-column property="buy_num" sortable="custom" label="购买总人数" min-width="110"></el-table-column>
      <el-table-column property="nuser_buy_rate" sortable="custom" label="新用户购买率" min-width="140"></el-table-column>
      <el-table-column property="ouser_buy_rate" sortable="custom" label="老用户购买率" min-width="130"></el-table-column>
      <el-table-column property="nuser_buyback_num" sortable="custom" label="新用户回购成功人数" min-width="160"></el-table-column>
      <el-table-column property="ouser_buyback_num" sortable="custom" label="老用户回购成功人数" min-width="160"></el-table-column>
      <el-table-column property="nuser_buyback_rate" sortable="custom" label="新用户回购成功率" min-width="160"></el-table-column>
      <el-table-column property="ouser_buyback_rate" sortable="custom" label="老用户回购成功率" min-width="160"></el-table-column>
      <el-table-column property="nuser_buycard_num" sortable="custom" label="新用户购买会员卡数" min-width="160"></el-table-column>
      <el-table-column property="nuser_buyback_apply_num" sortable="custom" label="新用户购买会员申请数" min-width="170"></el-table-column>
      <el-table-column property="ouser_buycard_num" sortable="custom" label="老用户购买会员卡数" min-width="160"></el-table-column>
      <el-table-column property="ouser_buyback_apply_num" sortable="custom" label="老用户购买会员申请数" min-width="170"></el-table-column>
      <el-table-column property="nuser_loan_amount" sortable="custom" label="新用户放款金额(元)" min-width="150"></el-table-column>
      <el-table-column property="ouser_loan_amount" sortable="custom" label="老用户放款金额(元)" min-width="150"></el-table-column>
      <el-table-column property="loan_amount" sortable="custom" label="总放款金额(元)" min-width="130"></el-table-column>
      <el-table-column property="overdue_amount" sortable="custom" label="逾期金额(元)" min-width="120"></el-table-column>
      <el-table-column property="overdue_rate" sortable="custom" label="逾期率" min-width="100"></el-table-column>
      <el-table-column property="recovery_rate" sortable="custom" label="催回率" min-width="100"></el-table-column>
      <el-table-column property="bad_debt_rate" sortable="custom" label="坏账率" min-width="100"></el-table-column>
      <el-table-column property="unit_bad_debts" sortable="custom" label="单位坏账额(元)" min-width="130"></el-table-column>
      <el-table-column property="average_price" sortable="custom" label="件均" min-width="100"></el-table-column>
      <el-table-column property="credit_cost" sortable="custom" label="单位征信成本(元)" min-width="140"></el-table-column>
      <el-table-column property="annual_rate" sortable="custom" label="年化率" min-width="100"></el-table-column>
      <el-table-column property="annual_income" sortable="custom" label="年化收入(元)" min-width="120"></el-table-column>
      <el-table-column property="interest" sortable="custom" label="利息(元)" min-width="100"></el-table-column>
      <el-table-column property="new_customer_cost" sortable="custom" label="新用户单位获客成本(元)" min-width="180"></el-table-column>
      <el-table-column property="new_unit_maori" sortable="custom" label="新用户单位毛利(元)" min-width="150"></el-table-column>
      <el-table-column property="update_time" sortable="custom" label="更新时间" min-width="140"></el-table-column>
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
    getMonthlyPromotionEffect,
    getMonthlyPromotionEffectCount,
    getMonthlyPromotionEffectSelect
  } from '../../../../../common/js/api'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        channel_name: '',
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
        return 'api/monthlyPromotionEffect/excel?channel_name="' + [this.channel_name, 'SELECT'] + '"&startTime="' + [this.startTime, 'MONTH'] + '"&endTime="' + [this.endTime, 'MONTH'] + '"'
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
        return getMonthlyPromotionEffect({
          channel_name: [this.channel_name, 'SELECT'],
          startTime: [this.startTime, 'MONTH'],
          endTime: [this.endTime, 'MONTH'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        })
      },
      getCount() {
        return getMonthlyPromotionEffectCount({
          channel_name: [this.channel_name, 'SELECT'],
          startTime: [this.startTime, 'MONTH'],
          endTime: [this.endTime, 'MONTH']
        })
      },
      getSelectOptions() {
        getMonthlyPromotionEffectSelect().then((response) => {
          this.options = response.data
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
  .monthlyPromotionEffect
    height: 100%
    .date-filter
      li
        .managerText
          width: 165px
        .monthlyPromotionEffectSelect
          width:140px
</style>

