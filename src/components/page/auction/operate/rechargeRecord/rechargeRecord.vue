<template>
  <div class="rechargeRecord" v-loading.body="loading" element-loading-text="拼命加载中"
  >
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">充值时间：</span>
        <el-date-picker v-model.trim="startTime" type="date" size="mini" placeholder="从"
                        class="rechargeRecordTimeSelect" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        <el-date-picker v-model.trim="endTime" type="date" size="mini" placeholder="到"
                        class="rechargeRecordTimeSelect" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </li>
      <li>
        <span class="managerFront">充值状态：</span>
        <el-select v-model.trim="recharge_status" filterable clearable size="mini" placeholder="不限"
                   class="rechargeRecordSelect">
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
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe style="width: 100%;overflow: auto;" :height="height"
              class="rechargeRecord-table" @sort-change="sort">
      <el-table-column property="user_id" label="用户id" min-width="130"></el-table-column>
      <el-table-column property="user_name" label="用户名" min-width="130"></el-table-column>
      <el-table-column property="recharge_no" label="充值序号"></el-table-column>
      <el-table-column property="recharge_money" sortable="custom" label="充值金额(元)" min-width="130"></el-table-column>
      <el-table-column property="recharge_coin" sortable="custom" label="充值拍币数" min-width="130"></el-table-column>
      <el-table-column property="recharge_time" sortable="custom" label="充值时间" min-width="140"></el-table-column>
      <el-table-column property="recharge_status" label="充值状态" min-width="150"></el-table-column>
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
    getRechargeRecord,
    getRechargeRecordCount
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
        bid_detail_id: '',
        product_id: '',
        startTime: '',
        endTime: '',
        recharge_status: '',
        options: [{
          value: '',
          label: '不限'
        }, {
          value: '1',
          label: '充值中'
        }, {
          value: '2',
          label: '充值成功'
        }, {
          value: '3',
          label: '充值失败'
        }],
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
        return 'api/rechargeRecord/excel?startTime="' + [this.startTime, 'DATE'] + '"' + '"&endTime="' + [this.endTime, 'DATE'] + '"&recharge_status="' + [this.recharge_status, 'SELECT'] + '"'
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
        return getRechargeRecord({
          limit: this.limit,
          offset: this.offset,
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          recharge_status: [this.recharge_status, 'SELECT'],
          order: this.order
        })
      },
      getCount() {
        return getRechargeRecordCount({
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          recharge_status: [this.recharge_status, 'SELECT']
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
  .rechargeRecord
    height: 100%
    .date-filter
      li
        .managerText
          width: 160px
        .rechargeRecordSelect
          width: 150px
        .rechargeRecordTimeSelect
          width: 160px

</style>

