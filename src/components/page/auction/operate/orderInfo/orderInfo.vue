<template>
  <div class="orderInfo" v-loading.body="loading" element-loading-text="拼命加载中"
  >
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">是否晒单：</span>
        <el-select v-model.trim="varchar1" filterable clearable size="mini" placeholder="不限"
                   class="orderInfoSelect">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <span class="managerFront">支付状态：</span>
        <el-select v-model.trim="order_status" filterable clearable size="mini" placeholder="正在拍"
                   class="orderInfoSelect">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <span class="managerFront">是否特权用户订单：</span>
        <el-select v-model.trim="user_type" filterable clearable size="mini" placeholder="不限"
                   class="orderInfoSelect">
          <el-option
            v-for="item in options3"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <!--<li>
        <span class="managerFront">商品分类：</span>
        <el-select v-model.trim="channel_trader_name" filterable clearable size="mini" placeholder="不限"
                   class="orderInfoSelect">
          <el-option
            v-for="item in options4"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>-->
      <li>
        <span class="managerFront">订单时间：</span>
        <el-date-picker v-model.trim="startTime" type="date" size="mini" placeholder="从"
                        class="orderInfoTimeSelect" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        <el-date-picker v-model.trim="endTime" type="date" size="mini" placeholder="到"
                        class="orderInfoTimeSelect" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </li>
      <li>
        <el-button class="searchButton" type="primary" size="mini" @click.prevent.stop="search">搜索</el-button>
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe style="width: 100%;overflow: auto;" :height="height"
              class="orderInfo-table" @sort-change="sort">
      <el-table-column property="order_id" fixed label="订单号"></el-table-column>
      <el-table-column property="auction_no" label="商品期数"></el-table-column>
      <el-table-column property="product_name" label="商品名称" min-width="140"></el-table-column>
     <!-- <el-table-column property="classify_1" label="商品分类1"></el-table-column>
      <el-table-column property="classify_2" label="商品分类2" min-width="100"></el-table-column>
      <el-table-column property="classify_3" label="商品分类3"></el-table-column>-->
      <el-table-column property="order_amount" sortable="custom" label="订单成交金额(元)" min-width="140"></el-table-column>
      <el-table-column property="total_bid_count" sortable="custom" label="订单出价总次数" min-width="130"></el-table-column>
      <el-table-column property="person_count" sortable="custom" label="订单出价总人数" min-width="130"></el-table-column>
      <el-table-column property="avg_bid_count" sortable="custom" label="总人均出价次数" min-width="130"></el-table-column>
      <el-table-column property="final_price" sortable="custom" label="订单成交真实金额(元)" min-width="170"></el-table-column>
      <el-table-column property="valid_bid_count" sortable="custom" label="订单出价真实次数"  min-width="150"></el-table-column>
      <el-table-column property="valid_person_count" sortable="custom" label="订单出价真实人数" min-width="150"></el-table-column>
      <el-table-column property="avg_valid_bid_count" sortable="custom" label="真实人均出价次数" min-width="150"></el-table-column>
      <el-table-column property="user_type" label="是否特权用户订单" min-width="130"></el-table-column>
      <el-table-column property="order_status" label="支付状态" min-width="120"></el-table-column>
      <el-table-column property="order_type" label="订单类型"></el-table-column>
      <el-table-column property="win_user_id" label="用户id"></el-table-column>
      <el-table-column property="win_user_desc" label="用户名" min-width="120"></el-table-column>
      <el-table-column property="varchar1" label="是否晒单"></el-table-column>
      <el-table-column property="order_create_time" label="订单时间" sortable="custom"  min-width="140"></el-table-column>
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
    getOrderInfo,
    getOrderInfoCount
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
        varchar1: '',
        user_type: '',
        order_status: '',
        channel_trader_name: '',
        startTime: '',
        endTime: '',
        options1: [{
          value: '',
          label: '不限'
          }, {
          value: '1',
          label: '是'
          }, {
          value: '2',
          label: '否'
          }],
        options2: [{
          value: '',
          label: '不限'
        }, {
          value: '0',
          label: '正在拍'
        }, {
          value: '1',
          label: '待支付尾款'
        }, {
          value: '2',
          label: '已支付尾款'
        }, {
          value: '3',
          label: '已流拍(内部拍回)'
        }, {
          value: '4',
          label: '待配货'
        }, {
          value: '5',
          label: '已发货'
        }, {
          value: '6',
          label: '确认收货'
        }, {
          value: '7',
          label: '已完成'
        }, {
          value: '8',
          label: '已关闭'
        }],
        options3: [{
          value: '',
          label: '不限'
        }, {
          value: '2',
          label: '是'
        }, {
          value: '1',
          label: '否'
        }],
        options4: [{
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
        return 'api/orderInfo/excel?varchar1="' + [this.varchar1, 'SELECT'] + '"&user_type="' + [this.user_type, 'SELECT'] + '"' + '"&order_status="' + [this.order_status, 'SELECT'] + '"' + '"&channel_trader_name="' + [this.channel_trader_name, 'SELECT'] + '"' + '"&startTime="' + [this.startTime, 'DATE', 'M'] + '"&endTime="' + [this.endTime, 'DATE', 'M'] + '"'
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
        return getOrderInfo({
          limit: this.limit,
          offset: this.offset,
          varchar1: [this.varchar1, 'SELECT'],
          user_type: [this.user_type, 'SELECT'],
          order_status: [this.order_status, 'SELECT'],
          channel_trader_name: [this.channel_trader_name, 'SELECT'],
          startTime: [this.startTime, 'DATE', 'M'],
          endTime: [this.endTime, 'DATE', 'M'],
          order: this.order
        })
      },
      getCount() {
        return getOrderInfoCount({
          varchar1: [this.varchar1, 'SELECT'],
          user_type: [this.user_type, 'SELECT'],
          order_status: [this.order_status, 'SELECT'],
          channel_trader_name: [this.channel_trader_name, 'SELECT'],
          startTime: [this.startTime, 'DATE', 'M'],
          endTime: [this.endTime, 'DATE', 'M']
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
  .orderInfo
    height: 100%
    .date-filter
      li
        .managerText
          width: 160px
        .orderInfoSelect
          width: 160px
        .orderInfoTimeSelect
          width: 160px

</style>

