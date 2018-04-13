<template>
  <div class="channelDODData" v-loading.body="loading" element-loading-text="拼命加载中"
  >
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">渠道名称：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText"
                  v-model.trim="channel_name"></el-input>
      </li>
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
        <el-button class="refreshButton" v-if='isRefreshData' type="primary" size="mini" :loading="buttonLoading"
                   @click.prevent.stop="refreshData">一键刷新
        </el-button>
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe style="width: 100%;overflow: auto;" :height="height"
              class="channelDODData-table" @sort-change="sort">
      <el-table-column property="d_date" fixed sortable="custom" label="日期" width="90"></el-table-column>
      <el-table-column property="channel_name" label="渠道名称"></el-table-column>
      <el-table-column label="渠道日数据">
        <el-table-column property="channel_pv" label="PV"></el-table-column>
        <el-table-column property="channel_uv" label="UV"></el-table-column>
        <el-table-column property="registration_num" label="注册数"></el-table-column>
        <el-table-column property="nusercharge_num" label="新用户充值人数" min-width="120"></el-table-column>
        <el-table-column property="nusercharge_amt" label="新用户充值金额(元)" min-width="130"></el-table-column>
        <el-table-column property="ousercharge_num" label="老用户充值人数"  min-width="120"></el-table-column>
        <el-table-column property="ousercharge_amt" label="老用户充值金额(元)"  min-width="130"></el-table-column>
        <el-table-column property="bid_cnt" label="竞拍出价总次数"  min-width="130"></el-table-column>
        <el-table-column property="bidperson_cnt" label="参与竞拍人数"  min-width="120"></el-table-column>
        <el-table-column property="nuser_recharge_cost" label="新用户充值成本(元)" min-width="130"></el-table-column>
        <el-table-column property="auser_recharge_cost" label="总用户充值成本(元)" min-width="130"></el-table-column>
        <el-table-column property="Unit_Maori" label="单位毛利(元)" min-width="100"></el-table-column>
        <el-table-column property="total_maori" label="总毛利(元)"></el-table-column>
      </el-table-column>
      <el-table-column label="渠道日环比数据">
        <el-table-column property="channel_pv_ratio" label="PV"></el-table-column>
        <el-table-column property="channel_uv_ratio" label="UV"></el-table-column>
        <el-table-column property="registration_num_ratio" label="注册数"></el-table-column>
        <el-table-column property="nusercharge_num_ratio" label="新用户充值人数" min-width="120"></el-table-column>
        <el-table-column property="nusercharge_amt_ratio" label="新用户充值金额(元)" min-width="130"></el-table-column>
        <el-table-column property="ousercharge_num_ratio" label="老用户充值人数"  min-width="120"></el-table-column>
        <el-table-column property="ousercharge_amt_ratio" label="老用户充值金额(元)"  min-width="130"></el-table-column>
        <el-table-column property="bid_cnt_ratio" label="竞拍出价总次数"  min-width="130"></el-table-column>
        <el-table-column property="bidperson_cnt_ratio" label="参与竞拍人数"  min-width="120"></el-table-column>
        <el-table-column property="nuser_recharge_cost_ratio" label="新用户充值成本(元)" min-width="130"></el-table-column>
        <el-table-column property="auser_recharge_cost_ratio" label="总用户充值成本(元)" min-width="130"></el-table-column>
        <el-table-column property="Unit_Maori_ratio" label="单位毛利(元)" min-width="100"></el-table-column>
        <el-table-column property="total_maori_ratio" label="总毛利(元)"></el-table-column>
      </el-table-column>
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
    getChannelDODData,
    getChannelDODDataCount
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
        return 'api/channelDODData/excel?startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"&channel_name="' + [this.channel_name, 'INPUT'] + '"'
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
        return getChannelDODData({
          limit: this.limit,
          offset: this.offset,
          channel_name: [this.channel_name, 'INPUT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          order: this.order
        })
      },
      getCount() {
        return getChannelDODDataCount({
          channel_name: [this.channel_name, 'INPUT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE']
        })
      },
      search() {
        this.loading = true
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
  .channelDODData
    height: 100%
    .date-filter
      li
        .dateSelect
          width: 160px
        .managerText
          width: 160px

</style>

