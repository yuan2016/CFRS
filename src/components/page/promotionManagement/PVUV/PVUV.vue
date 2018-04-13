<template>
  <div class="PVUV" v-loading.body="loading" element-loading-text="拼命加载中" >
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">渠道名称：</span>
        <el-select v-model.trim="title" filterable clearable size="mini" placeholder="不限"
                   class="promotionChannelSelect">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <span class="managerFront">日期：</span>
        <el-date-picker v-model.trim="startTime" type="date" size="mini" placeholder="从"
                        class="userListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
        <el-date-picker v-model.trim="endTime" type="date" size="mini" placeholder="到"
                        class="userListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
      </li>
      <li>
        <el-button type="primary" size="mini" class="searchButton" @click.prevent.stop="search">搜索</el-button>
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe class="PVUV-table"
              style="width: 100%;overflow: auto" :height="height" @sort-change="sort">
      <el-table-column property="d_date" sortable="custom" label="日期" min-width="100"></el-table-column>
      <el-table-column property="element" label="指标元素" min-width="150"></el-table-column>
      <el-table-column property="element_id" label="指标元素id"></el-table-column>
      <el-table-column property="title" label="渠道名称"></el-table-column>
      <el-table-column property="pv" label="用户点击量pv" min-width="120"></el-table-column>
      <el-table-column property="uv" label="线上用户量统计" min-width="120"></el-table-column>
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
  import {
    getPVUV,
    getPVUVCount,
    getPVUVSelect
  } from '../../../../common/js/api'
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
        fundData: [],
        options: [],
        title: '',
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
        order: '',
        isShowExcel: false
      }
    },
    components: {
      banner
    },
    created () {
      this.loading = true
      this.getSelectOptions()
      this.getDataInit()
      this.isShowRefreshAndExcel()
    },
    mounted () {
      this.resizeHeight()
    },
    computed: {
      mosaicLink () {
        return 'api/PVUV/excel?title="' + [this.title, 'SELECT'] + '"&startTime="' + [this.startTime, 'DATE', 'M'] + '"&endTime="' + [this.endTime, 'DATE'] + '"'
      },
      ...mapGetters([
        'permission'
      ])
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
        return getPVUV({
          title: [this.title, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        })
      },
      getCount () {
        return getPVUVCount({
          title: [this.title, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE']
        })
      },
      getSelectOptions () {
        getPVUVSelect().then((response) => {
          this.options = response.data
        })
      },
      search () {
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
        this.height = docH - filterH - bannerH - pageH - 105
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
      isShowRefreshAndExcel () {
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
  .PVUV
    height: 100%
    .date-filter
      li
        .managerText
          width: 160px
        .userListTimeSelect, userListTimeSelect
          width: 160px
        .promotionChannelSelect
          width: 160px


  @media (max-width: 820px)
    .PVUV
      .date-filter
        li
          .managerFront
            width: 60px

</style>
