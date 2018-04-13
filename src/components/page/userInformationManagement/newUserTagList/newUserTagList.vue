<template>
  <div class="newUserTagList" v-loading.body="loading" element-loading-text="拼命加载中" >
    <banner></banner>
    <ul class="date-filter">
      <li>
        <span class="managerFront phonemf">手机号：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="user_phone"
                  @keyup.enter.native="search"></el-input>
      </li>
      <li>
        <span class="managerFront ramf">注册时间：</span>
        <el-date-picker v-model.trim="startTime1" type="date" size="mini" placeholder="从"
                        class="newUserTagListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
        <el-date-picker v-model.trim="endTime1" type="date" size="mini" placeholder="到"
                        class="newUserTagListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
      </li>
      <li>
        <span class="managerFront">当前逾期天数：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="late_day"
                  @keyup.enter.native="search"></el-input>
      </li>
      <li>
        <span class="managerFront">认证时间：</span>
        <el-date-picker v-model.trim="startTime2" type="date" size="mini" placeholder="从"
                        class="newUserTagListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
        <el-date-picker v-model.trim="endTime2" type="date" size="mini" placeholder="到"
                        class="newUserTagListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
      </li>
      <li>
        <span class="managerFront">首贷借款金额：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="money_amount"
                  @keyup.enter.native="search"></el-input>
      </li>
      <li>
        <span class="managerFront">申请首贷时间：</span>
        <el-date-picker v-model.trim="startTime3" type="date" size="mini" placeholder="从"
                        class="newUserTagListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
        <el-date-picker v-model.trim="endTime3" type="date" size="mini" placeholder="到"
                        class="newUserTagListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
      </li>

      <li>
        <span class="managerFront hmdmf">是否黑名单：</span>
        <el-select v-model.trim="hmd" size="mini" placeholder="不限" class="newUserTagListSelect2">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <span class="managerFront">申请复贷时间：</span>
        <el-date-picker v-model.trim="startTime4" type="date" size="mini" placeholder="从"
                        class="newUserTagListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
        <el-date-picker v-model.trim="endTime4" type="date" size="mini" placeholder="到"
                        class="newUserTagListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
      </li>
      <li>
        <span class="managerFront backmf">还款状态：</span>
        <el-select v-model.trim="status" size="mini" placeholder="不限" class="newUserTagListSelect">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <span class="managerFront">首贷还款时间：</span>
        <el-date-picker v-model.trim="startTime5" type="date" size="mini" placeholder="从"
                        class="newUserTagListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
        <el-date-picker v-model.trim="endTime5" type="date" size="mini" placeholder="到"
                        class="newUserTagListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
      </li>
      <li>
        <el-button type="primary" size="mini" class="searchButton" @click.prevent.stop="search">搜索</el-button>
        <a :href="mosaicLink"  v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>

    </ul>
    <el-table stripe :data="fundData" highlight-current-row border
              :height="height" style="width:100%;overflow: auto" @sort-change="sort" class="newUserTagList-table">
      <el-table-column property="user_phone" fixed label="手机号" min-width="110"></el-table-column>
      <el-table-column property="registe_at" label="注册时间" sortable="custom" min-width="140"></el-table-column>
      <el-table-column property="authentication_at" label="认证时间" sortable="custom" min-width="140"></el-table-column>
      <el-table-column property="order_time" label="申请首贷时间"  sortable="custom" min-width="140"></el-table-column>
      <el-table-column property="second_time" label="申请复贷时间" sortable="custom" min-width="140"></el-table-column>
      <el-table-column property="repayment_real_time" label="首贷还款时间"  sortable="custom" min-width="140"></el-table-column>
      <el-table-column property="money_amount" label="首贷借款金额" min-width="110"></el-table-column>
      <el-table-column property="hmd" label="黑名单" min-width="110"></el-table-column>
      <el-table-column property="status" label="还款状态" min-width="110"></el-table-column>
      <el-table-column property="late_day" label="当前逾期天数" sortable="custom" min-width="120"></el-table-column>
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
  import { getNowFormatDate, formatDate } from '../../../../common/js/utils'
  import { getNewUserTagList, getNewUserTagListCount } from '../../../../common/js/api'
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
        user_phone: '',
        registe_at: '',
        authentication_at: '',
        order_time: '',
        second_time: '',
        repayment_real_time: '',
        money_amount: '',
        hmd: '',
        status: '',
        late_day: '',
        startTime1: '',
        endTime1: '',
        startTime2: '',
        endTime2: '',
        startTime3: '',
        endTime3: '',
        startTime4: '',
        endTime4: '',
        startTime5: '',
        endTime5: '',
        fundData: [],
        currentRow: null,
        offset: 0,
        limit: 20,
        count: 0,
        currentPage: 1,
        isShowPage: false,
        pageContent: 'sizes',
        loading: false,
        options1: [{
          value: '',
          label: '不限'
        }, {
          value: '0',
          label: '待初审(待机审)'
        }, {
          value: '-3',
          label: '初审驳回'
        }, {
          value: '1',
          label: '初审通过'
        }, {
          value: '-4',
          label: '复审驳回'
        }, {
          value: '20',
          label: '复审通过,待放款'
        }, {
          value: '-5',
          label: '放款驳回'
        }, {
          value: '22',
          label: '放款中'
        }, {
          value: '-10',
          label: '放款失败'
        }, {
          value: '21',
          label: '已放款，还款中'
        }, {
          value: '23',
          label: '部分还款'
        }, {
          value: '30',
          label: '已还款'
        }, {
          value: '-11',
          label: '已逾期'
        }, {
          value: '-20',
          label: '已坏账'
        }, {
          value: '34',
          label: '逾期已还款'
        }],
        options2: [{
          value: '',
          label: '不限'
        }, {
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }],
        height: 500,
        order: '',
        isRefreshData: false,
        isShowExcel: false
      }
    },
    computed: {
      mosaicLink () {
        return 'api/newUserTagList/excel?user_phone="' + [this.user_phone, 'INPUT'] + '"&money_amount="' + [this.money_amount, 'INPUT', 'E'] + '"&hmd="' + [this.hmd, 'SELECT'] + '"&status="' + [this.status, 'SELECT'] + '"&late_day="' + [this.late_day, 'INPUT', 'E'] + '"&startTime1="' + [this.startTime1, 'DATE'] + '"&endTime1="' + [this.endTime1, 'DATE', 'M'] + '"&startTime2="' + [this.startTime2, 'DATE'] + '"&endTime2="' + [this.endTime2, 'DATE', 'M'] + '"&startTime3="' + [this.startTime3, 'DATE'] + '"&endTime3="' + [this.endTime3, 'DATE', 'M'] + '"&startTime4="' + [this.startTime4, 'DATE'] + '"&endTime4="' + [this.endTime4, 'DATE', 'M'] + '"&startTime5="' + [this.startTime5, 'DATE'] + '"&endTime5="' + [this.endTime5, 'DATE', 'M'] + '"'
      },
      ...mapGetters([
        'permission'
      ])
    },
    components: {
      banner
    },
    created () {
      this.loading = true
      this.getDataInit()
      this.isShowRefreshAndExcel()
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
        return getNewUserTagList({
          user_phone: [this.user_phone, 'INPUT'],
          money_amount: [this.money_amount, 'INPUT', 'E'],
          hmd: [this.hmd, 'SELECT'],
          status: [this.status, 'SELECT'],
          late_day: [this.late_day, 'INPUT', 'E'],
          startTime1: [this.startTime1, 'DATE'],
          endTime1: [this.endTime1, 'DATE', 'M'],
          startTime2: [this.startTime2, 'DATE'],
          endTime2: [this.endTime2, 'DATE', 'M'],
          startTime3: [this.startTime3, 'DATE'],
          endTime3: [this.endTime3, 'DATE', 'M'],
          startTime4: [this.startTime4, 'DATE'],
          endTime4: [this.endTime4, 'DATE', 'M'],
          startTime5: [this.startTime5, 'DATE'],
          endTime5: [this.endTime5, 'DATE', 'M'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        })
      },
      getCount () {
        return getNewUserTagListCount({
          user_phone: [this.user_phone, 'INPUT'],
          money_amount: [this.money_amount, 'INPUT', 'E'],
          hmd: [this.hmd, 'SELECT'],
          status: [this.status, 'SELECT'],
          late_day: [this.late_day, 'INPUT', 'E'],
          startTime1: [this.startTime1, 'DATE'],
          endTime1: [this.endTime1, 'DATE', 'M'],
          startTime2: [this.startTime2, 'DATE'],
          endTime2: [this.endTime2, 'DATE', 'M'],
          startTime3: [this.startTime3, 'DATE'],
          endTime3: [this.endTime3, 'DATE', 'M'],
          startTime4: [this.startTime4, 'DATE'],
          endTime4: [this.endTime4, 'DATE', 'M'],
          startTime5: [this.startTime5, 'DATE'],
          endTime5: [this.endTime5, 'DATE', 'M']
        })
      },
      search () {
        this.loading = true
        this.getDataInit()
      },
      sort (info) {
        if (info.order === 'ascending') {
          this.order = ' order by ' + info.prop + ' asc'
        } else if (info.order === 'descending') {
          this.order = ' order by ' + info.prop + ' desc'
        } else {
          this.order = ''
        }
        this.search()
      },
      resizeHeight () {
        this.setHeight()
        window.onresize = this.setHeight
      },
      setHeight () {
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
      isShowRefreshAndExcel () {
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
  .newUserTagList
    height: 100%
    .date-filter
      li
        .managerFront
          width: 84px
        .managerText
          width: 140px
        .newUserTagListTimeSelect
          width: 140px
        .newUserTagListSelect
          width: 140px
        .newUserTagListSelect2
          width: 140px
        &.timeHorizon
          white-space: normal

  @media (min-width:1438px)
    .newUserTagList
      .date-filter
        width: 1228px

  @media (max-width:1437px)
    .newUserTagList
      .date-filter
        max-width: 764px

</style>
