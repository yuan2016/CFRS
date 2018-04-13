<template>
  <div class="repaymentDetails" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront mfphone">手机号：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="user_phone"></el-input>
      </li>
      <li>
        <span class="managerFront">还款时间：</span>
        <el-date-picker v-model.trim="startTime" type="date" size="mini" placeholder="从"
                        class="userListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
        <el-date-picker v-model.trim="endTime" type="date" size="mini" placeholder="到"
                        class="userListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
      </li>
      <li>
        <span class="managerFront">还款方式：</span>
        <el-select v-model.trim="repayment_type" size="mini" placeholder="不限" class="repaySelect">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" class="searchButton" @click.prevent.stop="search">搜索</el-button>
      </li>
    </div>
    <el-table :data="fundData" class="repaymentDetails-table"
              highlight-current-row border stripe style="width: 100%;overflow: auto;" :height="height"
              @sort-change="sort">
      <el-table-column property="id" label="详情ID"></el-table-column>
      <el-table-column property="order_id" label="订单号" width="150"></el-table-column>
      <el-table-column property="realname" label="姓名"></el-table-column>
      <el-table-column property="user_phone" label="手机号" width="100"></el-table-column>
      <el-table-column property="customer_type" label="用户类型"></el-table-column>
      <el-table-column property="repayment_principal" label="借款到账金额(元)" width="120"></el-table-column>
      <el-table-column property="repayment_interest" label="服务费(元)"></el-table-column>
      <el-table-column property="repayment_amount" label="总还款金额(元)" width="120"></el-table-column>
      <el-table-column property="repaymented_amount" label="已还款金额(元)" width="110"></el-table-column>
      <el-table-column property="true_repayment_money" label="实还金额(元)" width="100"></el-table-column>
      <el-table-column property="credit_repayment_time" sortable="custom" label="放款时间" width="140"></el-table-column>
      <el-table-column property="repayment_time" sortable="custom" label="到期时间" width="140"></el-table-column>
      <el-table-column property="repayment_type" label="还款方式" width="110"></el-table-column>
      <el-table-column property="order_time" sortable="custom" label="还款时间" width="140"></el-table-column>
      <el-table-column property="repayment_real_time" sortable="custom" label="订单还款时间" width="140"></el-table-column>
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
  import {getRepaymentDetails, getRepaymentDetailsCount} from '../../../../../common/js/api'

  export default {
    data() {
      return {
        user_phone: '',
        repayment_type: '',
        fundData: [],
        loading: false,
        currentRow: null,
        offset: 0,
        limit: 20,
        count: 0,
        currentPage: 1,
        startTime: '',
        endTime: '',
        isShowPage: false,
        pageContent: 'sizes',
        options: [{
          value: '',
          label: '不限'
        }, {
          value: '1',
          label: '支付宝'
        }, {
          value: '2',
          label: '富友'
        }, {
          value: '3',
          label: '连连'
        }, {
          value: '4',
          label: '连连代扣服务费'
        }, {
          value: '5',
          label: '对公银行卡转账'
        }, {
          value: '6',
          label: '减免'
        }, {
          value: '7',
          label: '线下还款'
        }, {
          value: '8',
          label: '益码通支付宝'
        }, {
          value: '9',
          label: '借款优惠服务费'
        }],
        height: 500,
        order: ''
      }
    },
    components: {
      banner
    },
    created() {
      this.loading = true
      this.getDataInit()
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
        getRepaymentDetails({
          user_phone: [this.user_phone, 'INPUT'],
          repayment_type: [this.repayment_type, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        }).then((res) => {
          if (res.data) {
            this.fundData = res.data
            this.loading = false
          } else {
            this.fundData = []
            this.loading = false
            this.$message({
              message: '数据正在更新，请稍候',
              type: 'warning'
            })
          }
        }).catch(() => {
          this.fundData = []
          this.loading = false
          this.$message({
            message: '数据正在更新，请稍候',
            type: 'warning'
          })
        })
      },
      getData() {
        return getRepaymentDetails({
          user_phone: [this.user_phone, 'INPUT', 'NONE'],
          repayment_type: [this.repayment_type, 'SELECT', 'NONE'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        })
      },
      getCount() {
        return getRepaymentDetailsCount({
          user_phone: [this.user_phone, 'INPUT', 'NONE'],
          repayment_type: [this.repayment_type, 'SELECT', 'NONE'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M']
        })
      },
      search() {
        this.loading = true
        this.pageContent = ''
        if (this.user_phone === '' && this.repayment_type === '' && this.startTime === '' && this.endTime === '') {
          this.isShowPage = false
          this.pageContent = 'sizes'
          this.getDataInit()
        } else {
          this.isShowPage = true
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
        }
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
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .repaymentDetails
    height: 100%
    .date-filter
      li
        .managerText
          width: 160px
        .repaySelect, .userListTimeSelect
          width: 160px

  @media (max-width: 1123px)
    .repaymentDetails
      .date-filter
        li
          .mfphone
            width: 60px



</style>
