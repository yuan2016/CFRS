<template>
  <div class="achievements" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">部门：</span>
        <el-select multiple v-model.trim="department" size="mini" placeholder="不限" class="achievementsSelectLong">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <span class="managerFront">达标结果：</span>
        <el-select v-model.trim="reach" size="mini" placeholder="不限" class="achievementsSelect">
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
    </div>
    <el-table :data="fundData" highlight-current-row border stripe class="promotionChannel-table"
              style="width: 100%;overflow: auto" :height="height" @sort-change="sort">
      <el-table-column property="m_month" label="月份" min-width="150"></el-table-column>
      <el-table-column property="department" label="部门" min-width="150"></el-table-column>
      <el-table-column property="quota" label="指标" min-width="150"></el-table-column>
      <el-table-column property="kpi" label="本月工作指标" min-width="120"></el-table-column>
      <el-table-column property="kpi_result" label="本月绩效完成情况" min-width="130"></el-table-column>
      <el-table-column property="reach" label="达标结果" min-width="150"></el-table-column>
      <el-table-column property="creator" label="创建人" min-width="150"></el-table-column>
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
    getAchievements,
    getAchievementsCount
  } from '../../../../common/js/api'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        department: '',
        reach: '',
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
        status: '',
        height: 500,
        options1: [{
          value: '市场',
          label: '市场'
        }, {
          value: '运营',
          label: '运营'
        }, {
          value: '催收',
          label: '催收'
        }, {
          value: '数据',
          label: '数据'
        }, {
          value: '商务',
          label: '商务'
        }],
        options2: [{
          value: '',
          label: '不限'
        }, {
          value: '1',
          label: '达标'
        }, {
          value: '0',
          label: '未达标'
        }]
      }
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
    computed: {
      mosaicLink() {
        let startTime
        let endTime
        if (this.startTime === '') {
          startTime = this.startTime
        } else {
          startTime = formatDate(new Date(this.startTime), 'yyyy-MM-dd')
        }
        if (this.endTime === '') {
          endTime = this.endTime
        } else {
          endTime = formatDate(new Date(this.endTime), 'yyyy-MM-dd')
        }
        return 'api/achievements/excel?t.department="' + [this.department, 'SELECT'] + '"&reach="' + [this.reach, 'SELECT'] + '"'
      },
      ...mapGetters([
        'permission'
      ])
    },
    methods: {
      change(a) {
        if (a.length > 26) {
          return a.slice(0, 26) + '...'
        } else {
          return a
        }
      },
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
        return getAchievements({
          department: [this.department, 'SELECT'],
          reach: [this.reach, 'SELECT'],
//          channel_tel: this.channel_tel,
//          startTime__D: this.startTime,
//          endTime__DM: this.endTime,
          limit: this.limit,
          offset: this.offset
        })
      },
      getCount() {
        return getAchievementsCount({
          department: [this.department, 'SELECT'],
          reach: [this.reach, 'SELECT']
        })
      },
      search() {
        this.loading = true
        this.pageContent = ''
        if (this.startTime !== '') {
          this.startTime = formatDate(new Date(this.startTime), 'yyyy-MM-dd')
        }
        if (this.endTime !== '') {
          this.endTime = formatDate(new Date(this.endTime), 'yyyy-MM-dd')
        }
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
          this.order = ' order by ' + 't.' + info.prop + ' asc'
        } else if (info.order === 'descending') {
          this.order = ' order by ' + 't.' + info.prop + ' desc'
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
  .achievements
    height: 100%
    .date-filter
      li
        .managerText
          width: 160px
        .achievementsSelect
          width: 160px
        .achievementsSelectLong
          width: 160px

  @media (min-width: 548px)
    .achievements
      .date-filter
        li
          .managerFront
            width: 60px

</style>
