<template>
  <div class="renewalsList" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <ul class="date-filter">
      <li>
        <span class="managerFront mfname">姓名：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="realname"></el-input>
      </li>
      <li>
        <span class="managerFront">手机号：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="user_phone"></el-input>
      </li>

      <li>
        <span class="managerFront">还款时间：</span>
        <el-date-picker v-model.trim="startTime" type="date" size="mini" placeholder="从"
                        class="renewalsListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
        <el-date-picker v-model.trim="endTime" type="date" size="mini" placeholder="到"
                        class="renewalsListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
      </li>
      <li>
        <span class="managerFront mfsta">状态：</span>
        <el-select v-model.trim="status" size="mini" placeholder="不限" class="repaySelect">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" class="searchButton" @click.prevent.stop="search">搜索</el-button>

      </li>
    </ul>
    <el-table :data="fundData" class="renewalsList-table"
              highlight-current-row border stripe style="width: 100%;overflow: auto" :height="height"
              @sort-change="sort">
      <el-table-column property="order_id" label="订单号" min-width="150"></el-table-column>
      <el-table-column property="realname" label="姓名" min-width="100"></el-table-column>
      <el-table-column property="user_phone" label="手机号" min-width="100"></el-table-column>
      <el-table-column property="renewal_type" label="续期类型" min-width="100"></el-table-column>
      <el-table-column property="sum_fee" label="续期总额(元)" min-width="110"></el-table-column>
      <el-table-column property="repayment_interest" label="服务费(元)"></el-table-column>
      <el-table-column property="renewal_fee" label="续期费(元)"></el-table-column>
      <el-table-column property="renewal_day" label="续期期限"></el-table-column>
      <el-table-column property="status" label="续期状态"></el-table-column>
      <el-table-column property="repayment_time" sortable="custom" label="续期到期还款时间" min-width="170"></el-table-column>
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
  import {getRenewalsList, getRenewalsListCount} from '../../../../../common/js/api'

  export default {
    data() {
      return {
        realname: '',
        user_phone: '',
        status: '',
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
          value: '0',
          label: '付款中'
        }, {
          value: '1',
          label: '付款成功'
        }, {
          value: '2',
          label: '付款失败'
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
        return getRenewalsList({
          realname: [this.realname, 'INPUT'],
          user_phone: [this.user_phone, 'INPUT'],
          status: [this.status, 'SELECT', 'NONE'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        })
      },
      getCount() {
        return getRenewalsListCount({
          realname: [this.realname, 'INPUT'],
          user_phone: [this.user_phone, 'INPUT'],
          status: [this.status, 'SELECT', 'NONE'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M'],
          limit: this.limit,
          offset: this.offset
        })
      },
      search() {
        this.loading = true
        this.pageContent = ''
        if (this.realname === '' && this.user_phone === '' && this.status === '' && this.startTime === '' && this.endTime === '') {
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
  .renewalsList
    height: 100%
    .date-filter
      li
        .managerText
          width: 160px
        .repaySelect
          width: 160px
        .renewalsListTimeSelect
          width: 160px

  @media (min-width: 893px) and (max-width: 1130px)
    .renewalsList
      .date-filter
        width: 821px
        li
          .mfname
            width: 60px

  @media (max-width: 892px)
    .renewalsList
      .date-filter
        li
          display: block
          .managerFront
            width: 60px
</style>
