<template>
  <div class="repaymentMinutia" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront mfname">姓名：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText"
                  v-model.trim="user_name"></el-input>
      </li>
      <li>
        <span class="managerFront">手机号：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="user_phone"></el-input>
      </li>
      <li>
        <span class="managerFront">实际还款时间：</span>
        <el-date-picker v-model.trim="startTime" type="date" size="mini" placeholder="从"
                        class="minutiaTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
        <el-date-picker v-model.trim="endTime" type="date" size="mini" placeholder="到"
                        class="minutiaTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
      </li>
      <li>
        <span class="managerFront">还款方式：</span>
        <el-select v-model.trim="repayment_channel" size="mini" placeholder="不限" class="minutiaSelect">
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
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe class="repaymentMinutia-table"
              style="width: 100%;overflow: auto" :height="height" @sort-change="sort">
      <el-table-column property="user_id" fixed label="用户ID"></el-table-column>
      <el-table-column property="user_name" label="借款人姓名" width="90"></el-table-column>
      <el-table-column property="user_phone" label="手机号" width="100"></el-table-column>
      <el-table-column property="order_id" label="债权ID" width="170"></el-table-column>
      <el-table-column property="loan_id" label="还款ID" width="150"></el-table-column>
      <el-table-column property="loan_money" label="借款金额(元)" width="110"></el-table-column>
      <el-table-column property="repayment_amount" label="总应还款金额(元)" width="115"></el-table-column>
      <el-table-column property="repaymented_amount" label="已还金额(元)" width="110"></el-table-column>
      <el-table-column property="repayment_real_money" label="实还金额(元)" width="110"></el-table-column>
      <el-table-column property="return_money" label="退款金额(元)" width="110"></el-table-column>
      <el-table-column property="repayment_channel" label="还款方式" width="110"></el-table-column>
      <el-table-column property="repayment_detail" label="还款详情" width="110"></el-table-column>
      <el-table-column property="credit_repayment_time" sortable="custom" label="放款时间" width="140"></el-table-column>
      <el-table-column property="repayment_time" sortable="custom" label="应还款时间" width="140"></el-table-column>
      <el-table-column property="repayment_real_time" sortable="custom" label="实际还款时间" width="140"></el-table-column>
      <el-table-column property="late_day" label="逾期天数" width="70"></el-table-column>
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
  import {getNowFormatDate, formatDate} from '../../../../common/js/utils'
  import {
    getRepaymentMinutia,
    getRepaymentMinutiaCount
  } from '../../../../common/js/api'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        fundData: [],
        loading: false,
        buttonLoading: false,
        user_name: '',
        user_phone: '',
        repayment_channel: '',
        currentRow: null,
        options: [{
          value: '',
          label: '不限'
        }, {
          value: '富友',
          label: '富友'
        }, {
          value: '连连',
          label: '连连'
        }, {
          value: '减免',
          label: '减免'
        }, {
          value: '优惠',
          label: '优惠'
        }, {
          value: '支付宝',
          label: '支付宝'
        }, {
          value: '拉卡拉',
          label: '拉卡拉'
        }, {
          value: '新连连',
          label: '新连连'
        }, {
          value: '招财猫连连',
          label: '招财猫连连'
        }, {
          value: '益码通支付宝',
          label: '益码通支付宝'
        }, {
          value: '合利宝',
          label: '合利宝'
        }, {
          value: '线下还款',
          label: '线下还款'
        }],
        offset: 0,
        limit: 20,
        count: 0,
        currentPage: 1,
        startTime: '',
        endTime: '',
        pageContent: 'sizes',
        height: 500,
        order: '',
        isRefreshData: false,
        isShowExcel: false
      }
    },
    computed: {
      mosaicLink() {
        return 'api/repaymentMinutia/excel?user_name="' + [this.user_name, 'INPUT'] + '"&user_phone="' + [this.user_phone, 'INPUT'] + '"&repayment_channel="' + [this.repayment_channel, 'SELECT'] + '"&startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE', 'M'] + '"'
      },
      ...mapGetters([
        'permission'
      ])
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
        return getRepaymentMinutia({
          user_name: [this.user_name, 'INPUT'],
          user_phone: [this.user_phone, 'INPUT'],
          repayment_channel: [this.repayment_channel, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        })
      },
      getCount() {
        return getRepaymentMinutiaCount({
          user_name: [this.user_name, 'INPUT'],
          user_phone: [this.user_phone, 'INPUT'],
          repayment_channel: [this.repayment_channel, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M']
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
  .repaymentMinutia
    height: 100%
    .date-filter
      li
        .managerText
          width: 160px
        .minutiaSelect
          width: 160px
        .minutiaTimeSelect
          width: 160px

  @media (min-width: 1080px) and (max-width: 1436px)
    .repaymentMinutia
      .date-filter
        width: 870px
        li
          .mfname
            width: 60px

  @media (max-width: 1079px)
    .repaymentMinutia
      .date-filter
        li
          display: block
          .managerFront
            width: 84px
</style>
