<template>
  <div class="promotionChannel" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">渠道商名称：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText"
                  v-model.trim="channel_name"></el-input>
      </li>
      <li>
        <span class="managerFront">负责人：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText"
                  v-model.trim="operator_name"></el-input>
      </li>
      <li>
        <span class="managerFront">联系方式：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText"
                  v-model.trim="channel_tel"></el-input>
      </li>
      <li>
        <span class="managerFront mftime">添加时间：</span>
        <el-date-picker v-model.trim="startTime" type="date" size="mini" placeholder="从"
                        class="userListTimeSelect" value-format="yyyy-MM-dd" ></el-date-picker>
        <el-date-picker v-model.trim="endTime" type="date" size="mini" placeholder="到"
                        class="userListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
      </li>
      <li>
        <el-button type="primary" size="mini" class="searchButton" @click.prevent.stop="search">搜索</el-button>
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe class="promotionChannel-table"
              style="width: 100%;overflow: auto" :height="height" @sort-change="sort">
      <el-table-column property="channel_name" label="渠道商名称"></el-table-column>
      <el-table-column property="channel_code" label="渠道商编码" min-width="100"></el-table-column>
      <el-table-column property="operator_name" label="负责人"></el-table-column>
      <el-table-column property="channel_tel" label="联系方式" min-width="100"></el-table-column>
      <el-table-column property="channel_province" label="省份"></el-table-column>
      <el-table-column property="channel_city" label="城市"></el-table-column>
      <el-table-column property="channel_area" label="地区"></el-table-column>
      <el-table-column property="canal_rate_name" label="计费方式" min-width="100"></el-table-column>
      <el-table-column property="created_at" sortable="custom" label="创建时间" width="140px"></el-table-column>

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
    getPromotionChannel,
    getPromotionChannelCount
  } from '../../../../common/js/api'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        channel_name: '',
        operator_name: '',
        channel_tel: '',
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
        order: '',
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
        return 'api/promotionChannel/excel?t.channel_name="' + [this.channel_name, 'INPUT'] + '"&t.operator_name="' + [this.operator_name, 'INPUT'] + '"&t.channel_tel="' + [this.channel_tel, 'INPUT'] + '"&startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE', 'M'] + '"'
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
        return getPromotionChannel({
          channel_name: [this.channel_name, 'INPUT'],
          operator_name: [this.operator_name, 'INPUT'],
          channel_tel: [this.channel_tel, 'INPUT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        })
      },
      getCount() {
        return getPromotionChannelCount({
          channel_name: [this.channel_name, 'INPUT'],
          operator_name: [this.operator_name, 'INPUT'],
          channel_tel: [this.channel_tel, 'INPUT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M']
        })
      },
      search() {
        this.loading = true
        this.pageContent = ''
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
  .promotionChannel
    height: 100%
    .date-filter
      li
        .managerText
          width: 160px
        .userListTimeSelect
          width: 160px
        .userListSelect
          width: 160px

  @media (min-width: 903px) and (max-width: 1448px)
    .promotionChannel
      .date-filter
        li
          .mftime
            width: 72px

  @media (max-width: 902px)
    .promotionChannel
      .date-filter
        li
          display: block
          .managerFront
            width: 72px
</style>
