<template>
  <div class="userBasePortrait" v-loading.body="loading" element-loading-text="拼命加载中"
       >
    <banner></banner>
    <el-table :data="fundData" highlight-current-row border stripe
              style="width: 100%;overflow: auto" :height="height" @sort-change="sort" class="userBasePortrait-table">
      <el-table-column property="user_age" label="年龄" width="50"></el-table-column>
      <el-table-column property="user_sex" label="性别" width="50"></el-table-column>
      <el-table-column property="addr_birth" label="出生地" width="100"></el-table-column>
      <el-table-column property="addr_now" label="居住地" width="100"></el-table-column>
      <el-table-column property="user_cot" sortable="custom" label="用户数" width="100"></el-table-column>
      <el-table-column property="loan_cot_avg" sortable="custom" label="平均申请次数" width="120"></el-table-column>
      <el-table-column property="loan_cot_savg" sortable="custom" label="平均申请成功次数" width="150"></el-table-column>
      <el-table-column property="loan_day14_acot" sortable="custom" label="14天单期" width="100px"></el-table-column>
      <el-table-column property="loan_stg21_acot" sortable="custom" label="21天分期" width="100px"></el-table-column>
      <el-table-column property="loan_stg90_acot" sortable="custom" label="90天分期" width="190px"></el-table-column>
      <el-table-column property="loan_amt_savg" sortable="custom" label="平均借款金额(元)" width="140"></el-table-column>
      <el-table-column property="time_avg" sortable="custom" label="平均申请间隔(天)" width="140"></el-table-column>
      <el-table-column property="tgl_snew" sortable="custom" label="新用户通过率" width="120"></el-table-column>
      <el-table-column property="tgl_sold" sortable="custom" label="老用户通过率" width="120"></el-table-column>
      <el-table-column property="xq_avg" sortable="custom" label="平均续期次数" width="120"></el-table-column>
      <el-table-column property="yql_avg_new" sortable="custom" label="新用户逾期率" width="120"></el-table-column>
      <el-table-column property="yql_avg_old" sortable="custom" label="老用户逾期率" width="120"></el-table-column>
      <el-table-column property="hk1_avg_new" sortable="custom" label="新用户还款率" width="120"></el-table-column>
      <el-table-column property="hk1_avg_old" sortable="custom" label="老用户还款率" width="120"></el-table-column>
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
    <div class="pop1">
      <p class="popTop">平均14天单期借款次数</p>
      <p>(申请成功次数)</p>
    </div>
    <div class="pop2">
      <p class="popTop">平均21天分期借款次数</p>
      <p>(申请成功次数)</p>
    </div>
    <div class="pop3">
      <p class="popTop">平均90分期借款次数</p>
      <p>(申请成功次数)</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import banner from '../../../../common/banner/banner'
  import { getNowFormatDate, formatDate } from '../../../../../common/js/utils'
  import { getUserBasePortrait, getUserBasePortraitCount } from '../../../../../common/js/api'

  export default {
    data () {
      return {
        fundData: [],
        loading: false,
        currentRow: null,
        offset: 0,
        limit: 20,
        count: 0,
        currentPage: 1,
        pageContent: 'sizes',
        height: 500,
        buttonLoading: false,
        order: ''
      }
    },
    components: {
      banner
    },
    created () {
      // this.loading = true
      // this.getDataInit()
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
        return getUserBasePortrait({
          order: this.order,
          limit: this.limit,
          offset: this.offset
        })
      },
      getCount () {
        return getUserBasePortraitCount()
      },
      search () {
        // this.loading = true
        // if (this.startTime !== '') {
        //   this.startTime = formatDate(new Date(this.startTime), 'yyyy-MM-dd')
        // }
        // if (this.endTime !== '') {
        //   this.endTime = formatDate(new Date(this.endTime), 'yyyy-MM-dd')
        // }
        // this.getDataInit()
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
        this.height = docH - filterH - bannerH - pageH - 125
      }
    },
    updated () {
      if (document.getElementsByClassName('el-table__row').length > 0) {
        let header = document.getElementsByClassName('el-table__header')[0]
        let pops = [7, 8, 9]
        for (let i = 0; i < pops.length; i++) {
          let j = pops[i]
          header.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[j].style.position = 'relative'
        }
        let popName = [document.getElementsByClassName('pop1')[0], document.getElementsByClassName('pop2')[0],
          document.getElementsByClassName('pop3')[0]]
        let clientWidth = document.documentElement.clientWidth
        for (let i = 0; i < pops.length; i++) {
          let j = pops[i]
          header.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[j].addEventListener('mouseover', function (event) {
            let x = clientWidth - event.clientX + 20
            let y = event.clientY - 30
            popName[i].style.display = 'block'
            popName[i].style.top = y + 'px'
            popName[i].style.right = x + 'px'
          })
          header.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[j].addEventListener('mouseout', function () {
            popName[i].style.display = 'none'
          })
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .userBasePortrait
    height: 100%
    .userBasePortrait-table
      margin-top: 20px
    .pop1, .pop2, .pop3
      display: none
      position: absolute
      padding: 5px
      border: 1px solid #cccccc
      border-radius: 5px
      font-size: 12px
      background-color: #fff
      box-shadow: 5px 5px 5px #999
      z-index: 5
      .popTop
        padding-bottom: 5px

  .elextra-icon-info
    position: absolute
    top: 9px
    right: -7px
    font-size: 20px
    color: rgb(102, 102, 102)

  .el-pagination
    overflow: auto

</style>
