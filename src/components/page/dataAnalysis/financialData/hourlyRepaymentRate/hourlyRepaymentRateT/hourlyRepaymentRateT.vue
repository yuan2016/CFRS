<template>
  <div class="hourlyRepaymentRate" v-loading.body="loading" element-loading-text="拼命加载中"
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
        <el-button class="refreshButton" v-if='isRefreshData' type="primary" size="mini" :loading="buttonLoading"
                   @click.prevent.stop="refreshData">一键刷新
        </el-button>
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
      <el-select v-model.trim="model" size="mini" placeholder="请选择" class="table-to-pic" @change="goto">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe style="width: 100%;overflow: auto;" :height="height"
              class="hourlyRepaymentRate-table" @sort-change="sort">
      <el-table-column property="D_DATE" fixed sortable="custom" label="日期" width="100"></el-table-column>
      <el-table-column label="21天分期还款率">
        <el-table-column property="F21_RATE_REPAYMENTED_00" label="0时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_01" label="1时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_02" label="2时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_03" label="3时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_04" label="4时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_05" label="5时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_06" label="6时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_07" label="7时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_08" label="8时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_09" label="9时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_10" label="10时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_11" label="11时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_12" label="12时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_13" label="13时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_14" label="14时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_15" label="15时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_16" label="16时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_17" label="17时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_18" label="18时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_19" label="19时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_20" label="20时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_21" label="21时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_22" label="22时"></el-table-column>
        <el-table-column property="F21_RATE_REPAYMENTED_23" label="23时"></el-table-column>
      </el-table-column>
      <el-table-column label="21天分期提额还款率">
        <el-table-column property="FV21_RATE_REPAYMENTED_00" label="0时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_01" label="1时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_02" label="2时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_03" label="3时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_04" label="4时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_05" label="5时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_06" label="6时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_07" label="7时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_08" label="8时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_09" label="9时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_10" label="10时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_11" label="11时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_12" label="12时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_13" label="13时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_14" label="14时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_15" label="15时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_16" label="16时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_17" label="17时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_18" label="18时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_19" label="19时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_20" label="20时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_21" label="21时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_22" label="22时"></el-table-column>
        <el-table-column property="FV21_RATE_REPAYMENTED_23" label="23时"></el-table-column>
      </el-table-column>
      <el-table-column label="21天分期还款金额(元)">
        <el-table-column property="F21_REPAYMENTED_AMOUNT_00" label="0时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_01" label="1时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_02" label="2时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_03" label="3时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_04" label="4时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_05" label="5时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_06" label="6时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_07" label="7时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_08" label="8时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_09" label="9时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_10" label="10时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_11" label="11时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_12" label="12时" width="100"></el-table-column> width=100
        <el-table-column property="F21_REPAYMENTED_AMOUNT_13" label="13时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_14" label="14时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_15" label="15时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_16" label="16时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_17" label="17时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_18" label="18时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_19" label="19时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_20" label="20时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_21" label="21时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_22" label="22时" width="100"></el-table-column>
        <el-table-column property="F21_REPAYMENTED_AMOUNT_23" label="23时" width="100"></el-table-column>
      </el-table-column>
      <el-table-column label="21天分期提额还款金额(元)">
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_00" label="0时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_01" label="1时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_02" label="2时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_03" label="3时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_04" label="4时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_05" label="5时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_06" label="6时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_07" label="7时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_08" label="8时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_09" label="9时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_10" label="10时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_11" label="11时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_12" label="12时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_13" label="13时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_14" label="14时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_15" label="15时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_16" label="16时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_17" label="17时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_18" label="18时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_19" label="19时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_20" label="20时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_21" label="21时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_22" label="22时" width="100"></el-table-column>
        <el-table-column property="FV21_REPAYMENTED_AMOUNT_23" label="23时" width="100"></el-table-column>
      </el-table-column>
      <el-table-column property="UPDATE_TIME" label="更新时间" width="140"></el-table-column>
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
  import banner from '../../../../../common/banner/banner'
  import {getNowFormatDate, formatDate} from '../../../../../../common/js/utils'
  import {
    getHourlyRepaymentRate,
    getHourlyRepaymentRateCount,
    getHourlyRepaymentRateRefresh
  } from '../../../../../../common/js/api'
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
        model: './hourlyRepaymentRateT',
        options: [{
          label: '图',
          value: './hourlyRepaymentRate'
        }, {
          label: '表',
          value: './hourlyRepaymentRateT'
        }]
      }
    },
    components: {
      banner
    },
    created() {
      // this.loading = true
      // this.getDataInit()
      // this.isShowRefreshAndExcel()
    },
    mounted() {
      this.resizeHeight()
    },
    computed: {
      mosaicLink() {
        return 'api/hourlyRepaymentRate/excel?startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"'
      },
      ...mapGetters([
        'permission'
      ])
    },
    methods: {
      goto() {
        this.$router.push(this.model)
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
        return getHourlyRepaymentRate({
          limit: this.limit,
          offset: this.offset,
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          order: this.order
        })
      },
      getCount() {
        return getHourlyRepaymentRateCount({
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE']
        })
      },
      search() {
        // this.loading = true
        // this.getDataInit()
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
      refreshData() {
        this.buttonLoading = true
        getHourlyRepaymentRateRefresh().then((response) => {
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
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .hourlyRepaymentRate
    height: 100%
    .date-filter
      li
        .dateSelect
          width: 165px
      .table-to-pic
        position: absolute
        right: 20px
        width: 60px


</style>

