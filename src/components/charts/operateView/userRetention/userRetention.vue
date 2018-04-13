<template>
  <div class="platformData" v-loading.body="loading" element-loading-text="拼命加载中">
    <el-table :data="fundData" highlight-current-row border class="platformData-table"
              style="width: 100%overflow: auto" :height="height" @sort-change="sort">
      <el-table-column property="d_date" fixed sortable="custom" label="日期" width="90"></el-table-column>
      <el-table-column property="register_num" label="注册人数" width="100"></el-table-column>
      <el-table-column property="realname_auth_num" label="实名认证人数" width="100"></el-table-column>
      <el-table-column property="realname_auth_freq" label="实名认证次数" width="100"></el-table-column>
      <el-table-column property="operator_auth_num" label="运营商认证数" width="100"></el-table-column>
      <el-table-column property="generate_report_num" label="生成报告人数" width="100"></el-table-column>
      <el-table-column property="card_bound_num" label="绑卡人数" width="100"></el-table-column>
      <el-table-column property="Sesame_auth_num" label="芝麻认证人数" width="100"></el-table-column>
      <el-table-column property="auth_work_num" label="认证工作人数" width="100"></el-table-column>
      <el-table-column property="Alipay_auth_num" label="支付宝认证人数" width="110"></el-table-column>
      <el-table-column property="total_apply_loan_num" label="借款申请总数" width="100"></el-table-column>
      <el-table-column property="total_audit_num" label="通过审核总数" width="100"></el-table-column>
      <el-table-column property="succ_loan_num" label="放款成功笔数" width="100"></el-table-column>
      <el-table-column property="outstand_num" label="未到账笔数" width="90"></el-table-column>
      <el-table-column property="total_failsingular_num" label="打款失败总订单数" width="120"></el-table-column>
      <el-table-column property="total_passuser_num" label="通过用户总数" width="100"></el-table-column>
      <el-table-column property="passuser_rate" label="用户通过率" width="100"></el-table-column>
      <el-table-column property="counter_fraud_num" label="反欺诈人数" width="100"></el-table-column>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getNowFormatDate, formatDate} from '../../../../common/js/utils'
  import {
    getPlatformData,
    getPlatformDataCount,
    getPlatformDataRefresh
  } from '../../../../common/js/api'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        fundData: [],
        loading: false,
        currentRow: null,
        offset: 0,
        limit: 20,
        count: 0,
        currentPage: 1,
        startTime: '',
        endTime: '',
        pageContent: 'sizes',
        height: 500,
        buttonLoading: false,
        order: '',
        isRefreshData: false,
        isShowExcel: false
      }
    },
    created() {
      this.loading = true
      this.getDataInit()
      this.isShowRefreshAndExcel()
    },
    mounted() {
      this.resizeHeight()
    },
    updated() {
      this.retain()
    },
    computed: {
      mosaicLink() {
        return 'api/platformData/excel?startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"'
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
        return getPlatformData({
          limit: this.limit,
          offset: this.offset,
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          order: this.order
        })
      },
      getCount() {
        return getPlatformDataCount({
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE']
        })
      },
      search() {
        this.loading = true
        this.getDataInit()
      },
      refreshData() {
        this.buttonLoading = true
        getPlatformDataRefresh().then((response) => {
          if (response.data.code === '200') {
            this.getDataInit()
            this.buttonLoading = false
            this.$message({
              message: '平台数据刷新完毕，请查看',
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
              this.$message.error('平台数据一键刷新出现错误，请检查网络或联系管理员')
            }, 1000)
          }
        }).catch(() => {
          this.buttonLoading = false
          this.$message.error('平台数据一键刷新出现错误，请检查网络或联系管理员')
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
      },
      retain () {
        let tbody = document.querySelector('tbody')
        let tds = tbody.querySelectorAll('td')
        let len = tds.length
        let arrTd = []
        if (len) {
          for (let i = 0; i < len; i++) {
            let param = this.checkRate(tds[i].innerText.trim().replace(',', ''))
            if (param) {
              arrTd.push(param)
            }
          }
          let maxValue = Math.max.apply(null, arrTd)
          let minValue = Math.min.apply(null, arrTd)
          let dValue = maxValue - minValue
          for (let i = 0; i < len; i++) {
            let value = this.checkRate(tds[i].innerText.trim().replace(',', ''))
            let a = 255
            let b = 255 - Math.round((255 / dValue) * (value - minValue))
            tds[i].style.backgroundColor = 'rgb(' + b + ',' + b + ',' + a + ')'
          }
        }
      },
      checkRate (input) {
        var re = /^[0-9]+.?[0-9]*/
        if (!re.test(input)) {
          return null
        } else {
          return Number(input)
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .platformData
    height: 100%
    .date-filter
      li
        .dateSelect
          width: 165px



</style>
