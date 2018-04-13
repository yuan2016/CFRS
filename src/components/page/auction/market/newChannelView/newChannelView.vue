<template>
  <div class="newChannelView" v-loading.body="loading" element-loading-text="拼命加载中"
  >
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">渠道名称：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText"
                  v-model.trim="channel_name"></el-input>
      </li>
      <li>
        <span class="managerFront">负责人：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText"
                  v-model.trim="fz_person"></el-input>
      </li>
      <li>
        <span class="managerFront">对接人：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText"
                  v-model.trim="dj_person"></el-input>
      </li>
      <li>
        <span class="managerFront">联系方式：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText"
                  v-model.trim="contact_info"></el-input>
      </li>
      <li>
        <span class="managerFront">推广链接：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText"
                  v-model.trim="Extension_link"></el-input>
      </li>
      <li>
        <el-button class="searchButton" type="primary" size="mini" @click.prevent.stop="search">搜索</el-button><el-button class="refreshButton" v-if='isRefreshData' type="primary" size="mini" :loading="buttonLoading" @click.prevent.stop="refreshData">一键刷新
      </el-button>
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe style="width: 100%;overflow: auto;" :height="height"
              class="newChannelView-table" @sort-change="sort">
      <el-table-column property="channel_name" label="渠道名称" min-width="120"></el-table-column>
      <el-table-column property="channel_id" label="渠道编码" sortable="custom" min-width="140"></el-table-column>
      <el-table-column property="fz_person" label="负责人"></el-table-column>
      <el-table-column property="dj_person" label="对接人"></el-table-column>
      <el-table-column property="contact_info" label="联系方式" min-width="100"></el-table-column>
      <el-table-column property="contact_mailbox" label="联系邮箱" min-width="160"></el-table-column>
      <el-table-column property="Province" label="省份"></el-table-column>
      <el-table-column property="city" label="城市"></el-table-column>
      <el-table-column property="region" label="地区"></el-table-column>
      <el-table-column property="cooperation" label="合作方式"></el-table-column>
      <el-table-column property="cooperation_name" label="合作方式描述" min-width="120"></el-table-column>
      <el-table-column property="settleprice" label="结算单价(元)" min-width="120"></el-table-column>
      <el-table-column prop="Extension_link" label="推广链接" min-width="100">
        <template slot-scope="scope"><a :href="scope.row.Extension_link">点击查看</a></template>
      </el-table-column>
      <el-table-column prop="General_code" label="推广二维码" min-width="100">
        <template slot-scope="scope"><a :href="scope.row.General_code">点击查看</a></template>
      </el-table-column>
      <el-table-column property="start_time" label="开始时间" min-width="120"></el-table-column>
      <el-table-column property="end_time" label="结束时间" min-width="120"></el-table-column>
      <el-table-column property="update_time" label="更新时间" min-width="140"></el-table-column>
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
    getNewChannelView,
    getNewChannelViewCount,
    getNewChannelViewRefresh
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
        channel_name: '',
        fz_person: '',
        dj_person: '',
        contact_info: '',
        Extension_link: '',
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
        return 'api/newChannelView/excel?channel_name="' + [this.channel_name, 'INPUT'] + '"&fz_person="' + [this.fz_person, 'INPUT'] + '"' + '"&dj_person="' + [this.dj_person, 'INPUT'] + '"' + '"&contact_info="' + [this.contact_info, 'INPUT'] + '"' + '"&Extension_link="' + [this.Extension_link, 'INPUT'] + '"'
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
        return getNewChannelView({
          limit: this.limit,
          offset: this.offset,
          channel_name: [this.channel_name, 'INPUT'],
          fz_person: [this.fz_person, 'INPUT'],
          dj_person: [this.dj_person, 'INPUT'],
          contact_info: [this.contact_info, 'INPUT'],
          Extension_link: [this.Extension_link, 'INPUT'],
          order: this.order
        })
      },
      getCount() {
        return getNewChannelViewCount({
          channel_name: [this.channel_name, 'INPUT'],
          fz_person: [this.fz_person, 'INPUT'],
          dj_person: [this.dj_person, 'INPUT'],
          contact_info: [this.contact_info, 'INPUT'],
          Extension_link: [this.Extension_link, 'INPUT']
        })
      },
      search() {
        this.loading = true
        this.getDataInit()
      },
      refreshData() {
        this.buttonLoading = true
        getNewChannelViewRefresh().then((response) => {
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
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .newChannelView
    height: 100%
    .date-filter
      li
        .managerText
          width: 160px

</style>

