<template>
  <div class="roomPVUV" v-loading.body="loading" element-loading-text="拼命加载中"
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
        <el-button class="searchButton" type="primary" size="mini" @click.prevent.stop="search">搜索</el-button>
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe style="width: 100%;overflow: auto;" :height="height"
              class="roomPVUV-table" @sort-change="sort">
      <el-table-column property="d_date" sortable="custom" label="日期" min-width="160"></el-table-column>
      <!--<el-table-column property="room_id" label="各房间id"></el-table-column>-->
      <el-table-column property="room_name" label="各房间名称" min-width="140"></el-table-column>
      <el-table-column property="room_pv" label="各房间点击数" min-width="100"></el-table-column>
      <el-table-column property="avg_room_times" label="各房间人均停留时间(上机&排队&观看)" min-width="230"></el-table-column>
      <el-table-column property="modified_time" label="更新时间" min-width="140"></el-table-column>
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
  import {
    getRoomPVUV,
    getRoomPVUVCount,
    getRoomPVUVSUM
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
        isShowExcel: false
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
        if (this.startTime === this.endTime || this.startTime === formatDate(new Date(), 'yyyy-MM-dd') || (!this.startTime && !this.endTime)) {
          return 'api/roomPVUV/excel?startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"'
        } else {
          return 'api/roomPVUV/excelSUM?startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"'
        }
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
        if (this.startTime === this.endTime || this.startTime === formatDate(new Date(), 'yyyy-MM-dd') || (!this.startTime && !this.endTime)) {
          this.getDataInit()
        } else {
          this.getDataSearch()
        }
      },
      //页码变更
      handleCurrentChange(val) {
        this.currentPage = val
        this.offset = (val - 1) * this.limit
        this.loading = true
        if (this.startTime === this.endTime || this.startTime === formatDate(new Date(), 'yyyy-MM-dd') || (!this.startTime && !this.endTime)) {
          this.getDataInit()
        } else {
          this.getDataSearch()
        }
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
      getDataSearch() {
        this.axios.all([this.getCount(), this.getDataSUM()])
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
        return getRoomPVUV({
          limit: this.limit,
          offset: this.offset,
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          order: this.order
        })
      },
      getDataSUM() {
        return getRoomPVUVSUM({
          limit: this.limit,
          offset: this.offset,
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          order: this.order
        })
      },
      getCount() {
        return getRoomPVUVCount({
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE']
        })
      },
      search() {
        this.loading = true
        if (this.startTime === this.endTime || this.startTime === formatDate(new Date(), 'yyyy-MM-dd') || (!this.startTime && !this.endTime)) {
          this.getDataInit()
        } else {
          this.getDataSearch()
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
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .roomPVUV
    height: 100%
    .date-filter
      li
        .dateSelect
          width: 150px
</style>