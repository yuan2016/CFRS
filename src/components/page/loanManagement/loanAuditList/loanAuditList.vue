<template>
  <div class="loanAuditList" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <ul class="date-filter">
      <li>
        <span class="managerFront mfphone">手机号：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="user_phone"></el-input>
      </li>
      <li>
        <span class="managerFront mfname">姓名：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="realname"></el-input>
      </li>
      <li>
        <span class="managerFront">订单号：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerTextLong"
                  v-model.trim="out_trade_no"></el-input>
      </li>
      <li>
        <span class="managerFront">用户类型：</span>
        <el-select v-model.trim="customer_type" size="mini" placeholder="不限" class="loanAuditSelect">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <span class="managerFront">放款时间：</span>
        <el-date-picker v-model.trim="startTime" type="date" size="mini" placeholder="从"
                        class="loanAuditTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
        <el-date-picker v-model.trim="endTime" type="date" size="mini" placeholder="到"
                        class="loanAuditTimeSelect" value-format="yyyy-MM-dd"></el-date-picker></li>
      <li>
        <span class="managerFront">放款状态：</span>
        <el-select v-model.trim="status" size="mini" placeholder="不限" class="loanAuditSelectLong">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <el-button type="primary" size="mini" class="searchButton" @click.prevent.stop="search">搜索</el-button>
      </li>
    </ul>
    <el-table :data="fundData"
              highlight-current-row border stripe style="width: 100%;overflow: auto" :height="height"
              class="loanAuditList-table" @sort-change="sort">
      <el-table-column property="id" fixed label="主键"></el-table-column>
      <el-table-column property="out_trade_no" label="订单号" width="150"></el-table-column>
      <el-table-column property="yurref" label="打款订单" width="180"></el-table-column>
      <el-table-column property="realname" label="姓名"></el-table-column>
      <el-table-column property="user_phone" label="手机号" width="120"></el-table-column>
      <el-table-column property="customer_type" label="用户类型"></el-table-column>
      <el-table-column property="money_amount" label="借款金额(元)" width="100"></el-table-column>
      <el-table-column property="loan_term" label="天数"></el-table-column>
      <el-table-column property="apr" label="服务费利率(万分之一)" width="150"></el-table-column>
      <el-table-column property="loan_interests" label="手续费(元)"></el-table-column>
      <el-table-column property="into_money" sortable="custom" label="到账金额(元)" width="120"></el-table-column>
      <el-table-column property="order_time" sortable="custom" label="下单时间" width="140"></el-table-column>
      <el-table-column property="loan_time" sortable="custom" label="放款时间" width="140"></el-table-column>
      <el-table-column property="loan_end_time" sortable="custom" label="预计还款时间" width="140"></el-table-column>
      <el-table-column property="updated_at" sortable="custom" label="更新时间" width="140"></el-table-column>
      <el-table-column property="child_type" label="子类型"></el-table-column>
      <el-table-column property="states" label="放款状态" width="120px"></el-table-column>
      <el-table-column property="pay_remark" label="放款备注" width="180"></el-table-column>

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
  import {getLoanAuditList, getLoanAuditListCount} from '../../../../common/js/api'

  export default {
    data() {
      return {
        out_trade_no: '',
        realname: '',
        user_phone: '',
        customer_type: '',
        status: '',
        fundData: [],
        loading: false,
        currentRow: null,
        isShowPage: false,
        pageContent: 'sizes',
        offset: 0,
        limit: 20,
        count: 0,
        currentPage: 1,
        startTime: '',
        endTime: '',
        options1: [{
          value: '',
          label: '不限'
        }, {
          value: '0',
          label: '新用户'
        }, {
          value: '1',
          label: '老用户'
        }],
        options2: [{
          value: '',
          label: '不限'
        }, {
          value: '22',
          label: '放款中'
        }, {
          value: '-5',
          label: '放款驳回'
        }, {
          value: '-10',
          label: '放款失败'
        }, {
          value: '21',
          label: '已放款，还款中'
        }, {
          value: '20',
          label: '复审通过,待放款'
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
        /*getLoanAuditList({
          options: {
            out_trade_no: this.out_trade_no,
            realname: this.realname,
            user_phone: this.user_phone,
            customer_type: this.customer_type,
            status: this.status
          },
          startTime: this.startTime,
          endTime: this.endTime,
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
        })*/
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
        return getLoanAuditList({
          out_trade_no: [this.out_trade_no, 'INPUT'],
          realname: [this.realname, 'INPUT'],
          user_phone: [this.user_phone, 'INPUT'],
          customer_type: [this.customer_type, 'SELECT'],
          status: [this.status, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        })
      },
      getCount() {
        return getLoanAuditListCount({
          out_trade_no: [this.out_trade_no, 'INPUT'],
          realname: [this.realname, 'INPUT'],
          user_phone: [this.user_phone, 'INPUT'],
          customer_type: [this.customer_type, 'SELECT'],
          status: [this.status, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M']
        })
      },
      search() {
        this.loading = true
        this.pageContent = ''
        if (this.out_trade_no === '' && this.realname === '' && this.user_phone === '' && this.customer_type === '' && this.status === '' && this.startTime === '' && this.endTime === '') {
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
  .loanAuditList
    height: 100%
    .date-filter
      li
        .managerTextLong
          width: 165px
        .managerText
          width: 165px
        .loanAuditSelect
          width: 165px
        .loanAuditSelectLong
          width: 165px
        .loanAuditTimeSelect
          width: 165px

  @media (max-width: 1817px)
    .loanAuditList
      .date-filter
        li
          .mfphone
            width: 60px

  @media (min-width: 1120px) and (max-width: 1125px)
    .loanAuditList
      .date-filter
        width:910px

  @media (max-width: 1119px)
    .loanAuditList
      .date-filter
        max-width:472px
        li
          .managerFront
            width: 60px

</style>
