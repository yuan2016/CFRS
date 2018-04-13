<template>
  <div class="operationUserPortrait" v-loading.body="loading" element-loading-text="拼命加载中"
       >
    <banner></banner>
    <el-table :data="fundData" highlight-current-row border stripe style="width: 100%;overflow: auto" :height="height"
              @sort-change="sort" class="operationUserPortrait-table">
      <el-table-column property="age" label="年龄"></el-table-column>
      <el-table-column property="sex" label="性别"></el-table-column>
      <el-table-column property="birth" label="出生地" width="110"></el-table-column>
      <el-table-column property="addr_now" label="居住地"></el-table-column>
      <el-table-column property="zcl" sortable="custom" label="注册量" width="110"></el-table-column>
      <el-table-column property="zcl_zb" sortable="custom" label="注册量占比" width="110"></el-table-column>
      <el-table-column property="yxzcl" sortable="custom" label="有效注册占比" width="120"></el-table-column>
      <el-table-column property="qysrz" sortable="custom" label="全要素认证占比" width="130"></el-table-column>
      <el-table-column property="hmd" sortable="custom" label="黑名单占比" width="110"></el-table-column>
      <el-table-column property="jjs" sortable="custom" label="进件数占比" width="110"></el-table-column>
      <el-table-column property="loan" sortable="custom" label="申请借款占比" width="120"></el-table-column>
      <el-table-column property="new_loan" sortable="custom" label="新用户申请借款占比" width="160"></el-table-column>
      <el-table-column property="old_loan" sortable="custom" label="老用户申请借款占比" width="160"></el-table-column>
      <el-table-column property="loan_suss" sortable="custom" label="申请成功占比" width="120"></el-table-column>
      <el-table-column property="new_loan_suss" sortable="custom" label="新用户申请成功占比" width="160"></el-table-column>
      <el-table-column property="old_loan_suss" sortable="custom" label="老用户申请成功占比" width="160"></el-table-column>
      <el-table-column property="zdq" sortable="custom" label="正当期占比" width="110"></el-table-column>
      <el-table-column property="new_zdq" sortable="custom" label="新用户正当期占比" width="150"></el-table-column>
      <el-table-column property="old_zdq" sortable="custom" label="老用户正当期占比" width="150"></el-table-column>
      <el-table-column property="dq" sortable="custom" label="到期占比" width="100"></el-table-column>
      <el-table-column property="new_dq" sortable="custom" label="新用户到期占比" width="130"></el-table-column>
      <el-table-column property="old_dq" sortable="custom" label="老用户到期占比" width="130"></el-table-column>
      <el-table-column property="yq" sortable="custom" label="逾期占比" width="100"></el-table-column>
      <el-table-column property="new_yq" sortable="custom" label="新用户逾期占比" width="130"></el-table-column>
      <el-table-column property="old_yq" sortable="custom" label="老用户逾期占比" width="130"></el-table-column>
      <el-table-column property="syyq" sortable="custom" label="剩余逾期占比" width="120"></el-table-column>
      <el-table-column property="new_syyq" sortable="custom" label="新用户剩余逾期占比" width="160"></el-table-column>
      <el-table-column property="old_syyq" sortable="custom" label="老用户剩余逾期占比" width="160"></el-table-column>
      <el-table-column property="loan_day14" sortable="custom" label="用户借款14天单期占比" width="170"></el-table-column>
      <el-table-column property="loan_stages21" sortable="custom" label="用户借款21天分期占比" width="170"></el-table-column>
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
      <p class="popTop">注册量占比</p>
      <p>(注册量/总注册量)</p>
    </div>
    <div class="pop2">
      <p class="popTop">有效注册量占比</p>
      <p>(有效注册量/注册量)</p>
      <p>(有效注册量=注册量-黑名单)</p>
    </div>
    <div class="pop3">
      <p class="popTop">全要素认证人数占比</p>
      <p>(全要素认证人数/注册量)</p>
    </div>
    <div class="pop4">
      <p class="popTop">黑名单人数占比</p>
      <p>(黑名单人数/注册量)</p>
    </div>
    <div class="pop5">
      <p class="popTop">进件数占比</p>
      <p>(进件数/注册量)</p>
      <p>(进件数=全要素认证人数-黑名单人数)</p>
    </div>
    <div class="pop6">
      <p class="popTop">申请借款占比</p>
      <p>(申请借款人数/注册量)</p>
    </div>
    <div class="pop7">
      <p class="popTop">新用户申请借款占比</p>
      <p>(新用户申请借款人数/注册量)</p>
    </div>
    <div class="pop8">
      <p class="popTop">申请借款占比</p>
      <p>(申请借款人数/注册量)</p>
    </div>
    <div class="pop9">
      <p class="popTop">申请成功占比</p>
      <p>(申请成功人数/注册量)</p>
    </div>
    <div class="pop10">
      <p class="popTop">新用户申请成功占比</p>
      <p>(新用户申请成功人数/注册量)</p>
    </div>
    <div class="pop11">
      <p class="popTop">老用户申请成功占比</p>
      <p>(老用户申请成功人数/注册量)</p>
    </div>
    <div class="pop12">
      <p class="popTop">正当期人数占比</p>
      <p>(正当期人数/注册量)</p>
    </div>
    <div class="pop13">
      <p class="popTop">新用户正当期人数占比</p>
      <p>(新用户正当期人数/注册量)</p>
    </div>
    <div class="pop14">
      <p class="popTop">老用户正当期人数占比</p>
      <p>(老用户正当期人数/注册量)</p>
    </div>
    <div class="pop15">
      <p class="popTop">到期人数占比</p>
      <p>(到期人数/注册量)</p>
    </div>
    <div class="pop16">
      <p class="popTop">新用户到期人数占比</p>
      <p>(新用户到期人数/注册量)</p>
    </div>
    <div class="pop17">
      <p class="popTop">老用户到期人数占比</p>
      <p>(老用户到期人数/注册量)</p>
    </div>
    <div class="pop18">
      <p class="popTop">逾期人数占比</p>
      <p>(逾期人数/注册量)</p>
    </div>
    <div class="pop19">
      <p class="popTop">新用户逾期人数占比</p>
      <p>(新用户逾期人数/注册量)</p>
    </div>
    <div class="pop20">
      <p class="popTop">老用户逾期人数占比</p>
      <p>(老用户逾期人数/注册量)</p>
    </div>
    <div class="pop21">
      <p class="popTop">剩余逾期人数占比</p>
      <p>(剩余逾期人数/注册量)</p>
    </div>
    <div class="pop22">
      <p class="popTop">新用户剩余逾期人数占比</p>
      <p>(新用户剩余逾期人数/注册量)</p>
    </div>
    <div class="pop23">
      <p class="popTop">老用户剩余逾期人数占比</p>
      <p>(老用户剩余逾期人数/注册量)</p>
    </div>
    <div class="pop24">
      <p class="popTop">用户借款14天单期人数占比</p>
      <p>(用户借款14天单期申请成功人数/注册量)</p>
    </div>
    <div class="pop25">
      <p class="popTop">用户借款21天分期人数占比</p>
      <p>(用户借款21天分期申请成功人数/注册量)</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import banner from '../../../../common/banner/banner'
  import { getNowFormatDate, formatDate } from '../../../../../common/js/utils'
  import { getOperationUserPortrait, getOperationUserPortraitCount } from '../../../../../common/js/api'

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
      this.loading = true
      this.getDataInit()
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
        return getOperationUserPortrait({
          order: this.order,
          limit: this.limit,
          offset: this.offset
        })
      },
      getCount () {
        return getOperationUserPortraitCount()
      },
      search () {
        this.loading = true
        if (this.startTime !== '') {
          this.startTime = formatDate(new Date(this.startTime), 'yyyy-MM-dd')
        }
        if (this.endTime !== '') {
          this.endTime = formatDate(new Date(this.endTime), 'yyyy-MM-dd')
        }
        this.getDataInit()
      },
      sort (info) {
        if (info.order === 'ascending') {
          this.order = ' order by ' + info.prop + '<>0 desc,' + info.prop + ' asc'
        } else if (info.order === 'descending') {
          this.order = ' order by ' + info.prop + '<>0 desc,' + info.prop + ' desc'
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
        let pops = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
        for (let i = 0; i < pops.length; i++) {
          let j = pops[i]
          header.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[j].style.position = 'relative'
        }
        /*let popName = [$('.pop1'), $('.pop2'), $('.pop3'), $('.pop4'), $('.pop5'), $('.pop6'), $('.pop7'), $('.pop8'), $('.pop9'), $('.pop10'), $('.pop11'), $('.pop12'), $('.pop13'), $('.pop14'), $('.pop15'), $('.pop16'), $('.pop17'), $('.pop18'), $('.pop19'), $('.pop20'), $('.pop21'), $('.pop22'), $('.pop23'), $('.pop24'), $('.pop25')]
        let clientWidth = document.documentElement.clientWidth
        for (let i = 0; i < pops.length; i++) {
          $('.el-table__header>thead>tr>th:eq(' + pops[i] + ') ').on('mouseover', function (event) {
            let x = clientWidth - event.clientX + 20
            let y = event.clientY - 30
            popName[i].css('display', 'block').css('top', y).css('right', x)
          }).on('mouseout', function () {
            popName[i].css('display', 'none')
          })
        }*/
        let popName = [document.getElementsByClassName('pop1')[0], document.getElementsByClassName('pop2')[0],
          document.getElementsByClassName('pop3')[0], document.getElementsByClassName('pop4')[0],
          document.getElementsByClassName('pop5')[0], document.getElementsByClassName('pop6')[0],
          document.getElementsByClassName('pop7')[0], document.getElementsByClassName('pop8')[0],
          document.getElementsByClassName('pop9')[0], document.getElementsByClassName('pop10')[0],
          document.getElementsByClassName('pop11')[0], document.getElementsByClassName('pop12')[0],
          document.getElementsByClassName('pop13')[0], document.getElementsByClassName('pop14')[0],
          document.getElementsByClassName('pop15')[0], document.getElementsByClassName('pop16')[0],
          document.getElementsByClassName('pop17')[0], document.getElementsByClassName('pop18')[0],
          document.getElementsByClassName('pop19')[0], document.getElementsByClassName('pop20')[0],
          document.getElementsByClassName('pop21')[0], document.getElementsByClassName('pop22')[0],
          document.getElementsByClassName('pop23')[0], document.getElementsByClassName('pop24')[0],
          document.getElementsByClassName('pop25')[0]]
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
  .operationUserPortrait
    height: 100%
    .operationUserPortrait-table
      margin-top: 20px
    .pop1, .pop2, .pop3, .pop4, .pop5, .pop6, .pop7, .pop8, .pop9, .pop10, .pop11, .pop12, .pop13, .pop14, .pop15, .pop16, .pop17, .pop18, .pop19, .pop20, .pop21, .pop22, .pop23, .pop24, .pop25
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
