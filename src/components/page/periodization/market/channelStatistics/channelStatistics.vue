<template>
  <div class="channelStatistics" v-loading.body="loading" element-loading-text="拼命加载中"
  >
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
        <span class="managerFront">渠道：</span>
        <el-select v-model.trim="channel_name" filterable clearable size="mini" placeholder="不限"
                   class="channelStatisticsSelect">
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
        <el-button class="refreshButton" v-if='isRefreshData' type="primary" size="mini" :loading="buttonLoading"
                   @click.prevent.stop="refreshData">一键刷新
        </el-button>
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe style="width: 100%;overflow: auto;" :height="height"
              class="channelStatistics-table" @sort-change="sort">
      <el-table-column property="d_date" fixed sortable="custom" label="日期"  min-width="90"></el-table-column>
      <el-table-column property="channel_name" label="渠道" min-width="100"></el-table-column>
      <el-table-column property="register_num" sortable="custom" label="注册人数" min-width="100"></el-table-column>
      <el-table-column property="login_num" sortable="custom" label="登录人数" min-width="100"></el-table-column>
      <el-table-column property="realname_auth_num" sortable="custom" label="实名认证" min-width="100"></el-table-column>
      <el-table-column property="emergency_contact_num" sortable="custom" label="紧急联系人" min-width="120"></el-table-column>
      <el-table-column property="operator_auth_num" sortable="custom" label="运营商认证" min-width="105"></el-table-column>
      <el-table-column property="card_bound_num" sortable="custom" label="绑卡人数" min-width="120"></el-table-column>
      <el-table-column property="all_auth_num" sortable="custom" label="全要素认证" min-width="120"></el-table-column>
      <el-table-column property="jobinfo_auth_num" sortable="custom" label="工作信息人数" min-width="140"></el-table-column>
      <el-table-column property="Sesame_auth_num" sortable="custom" label="芝麻信用" min-width="120"></el-table-column>
      <el-table-column property="Alipay_auth_num" sortable="custom" label="支付宝" min-width="120"></el-table-column>
      <el-table-column property="taobao_auth_num" sortable="custom" label="淘宝认证" min-width="120"></el-table-column>
      <el-table-column property="credit_auth_num" sortable="custom" label="信用卡" min-width="120"></el-table-column>
      <el-table-column property="gjj_auth_num" sortable="custom" label="公积金认证" min-width="120"></el-table-column>
      <el-table-column property="Appl_quota_num" sortable="custom" label="申请额度人数" min-width="120"></el-table-column>
      <el-table-column property="blacklist_num" sortable="custom" label="黑名单人数" min-width="120"></el-table-column>
      <el-table-column property="succ_quota_num" sortable="custom" label="成功获取额度" min-width="120"></el-table-column>
      <el-table-column property="Pass_rate" sortable="custom" label="通过率" min-width="140"></el-table-column>
      <el-table-column property="member_new_num" sortable="custom" label="购买会员(新用户)" min-width="140"></el-table-column>
      <el-table-column property="member_old_num" sortable="custom" label="购买会员(老用户)" min-width="140"></el-table-column>
      <el-table-column property="loan_new" sortable="custom" label="借款(新用户)" min-width="120"></el-table-column>
      <el-table-column property="loan_old" sortable="custom" label="借款(老用户)" min-width="120"></el-table-column>
      <el-table-column property="loan_amount_new" sortable="custom" label="放款金额(新用户)" min-width="140"></el-table-column>
      <el-table-column property="loan_amount_old" sortable="custom" label="放款金额(老用户)" min-width="140"></el-table-column>
      <el-table-column property="Overdue_rate" sortable="custom" label="逾期率" min-width="100"></el-table-column>
      <el-table-column property="Overdue_rate_new" sortable="custom" label="新用户逾期率(金额)" min-width="160"></el-table-column>
      <el-table-column property="Overdue_rate_old" sortable="custom" label="老用户逾期率(金额)" min-width="160"></el-table-column>
      <el-table-column property="update_time" label="修改时间" min-width="140"></el-table-column>
    </el-table>
    <div class="pop1">
      <p class="popTop">通过率=成功激活人数/激活人数</p>
    </div>
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
    getChannelStatistics,
    getChannelStatisticsCount,
    getChannelStatisticsRefresh,
    getChannelStatisticsSelect
  } from '../../../../../common/js/api'
  import {mapGetters} from 'vuex'

  export default {
    data() {
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
        isShowExcel: false,
        channel_name: '',
        options: []
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
        return 'api/channelStatistics/excel?startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"&channel_name="' + [this.channel_name, 'SELECT'] + '"'
      },
      ...mapGetters([
        'permission'
      ])
    },
    updated () {
      if (document.getElementsByClassName('el-table__row').length > 0) {
        let header = document.getElementsByClassName('el-table__header')[0]
        let pops = ['18']
        for (let i = 0; i < pops.length; i++) {
          let j = pops[i]
          if (!header.getElementsByTagName('thead')[0].getElementsByClassName('elextra-icon-info').length) {
            header.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[j].style.position = 'relative'
            header.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[j].insertAdjacentHTML('beforeEnd', '<i class="elextra-icon-info"></i>')
          }
        }
        let popName = [document.getElementsByClassName('pop1')[0]]
        let clientWidth = document.documentElement.clientWidth
        for (let i = 0; i < pops.length; i++) {
          let j = pops[i]
          header.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[j].getElementsByClassName('elextra-icon-info')[0].addEventListener('mouseover', function (event) {
            let x = clientWidth - event.clientX + 20
            let y = event.clientY - 30
            popName[i].style.display = 'block'
            popName[i].style.top = y + 'px'
            popName[i].style.right = x + 'px'
          })
          header.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[j].getElementsByClassName('elextra-icon-info')[0].addEventListener('mouseout', function () {
            popName[i].style.display = 'none'
          })
        }
      }
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
        return getChannelStatistics({
          limit: this.limit,
          offset: this.offset,
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          channel_name: [this.channel_name, 'SELECT'],
          order: this.order
        })
      },
      getCount() {
        return getChannelStatisticsCount({
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          channel_name: [this.channel_name, 'SELECT']
        })
      },
      search() {
        this.loading = true
        this.getDataInit()
      },
      refreshData() {
        this.buttonLoading = true
        getChannelStatisticsRefresh().then((response) => {
          if (response.data.code === '200') {
            this.getDataInit()
            this.buttonLoading = false
            this.$message({
              message: '数据刷新完毕，请查看',
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
              this.$message.error('一键刷新出现错误，请检查网络或联系管理员')
            }, 1000)
          }
        }).catch(() => {
          this.buttonLoading = false
          this.$message.error('一键刷新出现错误，请检查网络或联系管理员')
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
      getSelectOptions() {
        getChannelStatisticsSelect().then((response) => {
          this.options = response.data
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .channelStatistics
    height: 100%
    .date-filter
      li
        .dateSelect
          width: 165px
        .channelStatisticsSelect
          width: 165px

    .pop1
      display: none
      position: absolute
      padding: 5px
      border: 1px solid #cccccc
      border-radius: 5px
      font-size: 12px
      background-color: #fff
      box-shadow: 5px 5px 5px #999

    .popTop
      padding-bottom: 5px

    .elextra-icon-info
      position: absolute
      top: 15px
      right: 12px
      font-size: 16px
      color: rgb(102, 102, 102)
      font-weight: 400 !important
</style>

