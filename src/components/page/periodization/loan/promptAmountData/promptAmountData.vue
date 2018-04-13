<template>
  <div class="promptAmountData" v-loading.body="loading" element-loading-text="拼命加载中"
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
    </div>
    <el-table :data="fundData" highlight-current-row border stripe style="width: 100%;overflow: auto;" :height="height"
              class="promptAmountData-table" @sort-change="sort">
      <el-table-column property="D_DATE" fixed sortable="custom" label="日期" min-width="90"></el-table-column>
      <el-table-column label="当日催回率">
        <el-table-column property="OVERDUE_RATE_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="OVERDUE_RATE_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="OVERDUE_RATE" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column label="当日入催本金(元)">
        <el-table-column property="COLLECTION_PRINCIPAL_DAY_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DAY_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DAY" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column label="在催本金(元)">
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_Z" label="招财猫"></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_X" label="新网"></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING" label="合计"></el-table-column>
      </el-table-column>
      <el-table-column label="S1在催本金(元)">
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_S1_Z" label="招财猫"></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_S1_X" label="新网"></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_S1" label="合计"></el-table-column>
      </el-table-column>
      <el-table-column label="S1在催本金比例">
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_RATE_S1_Z" label="招财猫"></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_RATE_S1_X" label="新网"></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_RATE_S1" label="合计"></el-table-column>
      </el-table-column>
      <el-table-column label="S1总和催回率">
        <el-table-column property="COLLECTION_PRINCIPAL_RATE_S1_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_RATE_S1_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_RATE_S1" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column label="S1当期催回率">
        <el-table-column property="CURRENT_COLLECTION_RATE_S1_Z" label="招财猫"></el-table-column>
        <el-table-column property="CURRENT_COLLECTION_RATE_S1_X" label="新网"></el-table-column>
        <el-table-column property="CURRENT_COLLECTION_RATE_S1" label="合计"></el-table-column>
      </el-table-column>
      <el-table-column label="S2在催本金(元)">
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_S2_Z" label="招财猫"></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_S2_X" label="新网"></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_S2" label="合计"></el-table-column>
      </el-table-column>
      <el-table-column label="S2在催本金比例">
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_RATE_S2_Z" label="招财猫"></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_RATE_S2_X" label="新网"></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_RATE_S2" label="合计"></el-table-column>
      </el-table-column>
      <el-table-column label="S2总和催回率">
        <el-table-column property="COLLECTION_PRINCIPAL_RATE_S2_Z" label="招财猫"></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_RATE_S2_X" label="新网"></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_RATE_S2" label="合计"></el-table-column>
      </el-table-column>
      <el-table-column label="S2当期催回率">
        <el-table-column property="CURRENT_COLLECTION_RATE_S2_Z" label="招财猫"></el-table-column>
        <el-table-column property="CURRENT_COLLECTION_RATE_S2_X" label="新网"></el-table-column>
        <el-table-column property="CURRENT_COLLECTION_RATE_S2" label="合计"></el-table-column>
      </el-table-column>
      <el-table-column label="M2在催本金(元)">
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_M2_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_M2_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_M2" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column label="M2在催本金比例">
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_RATE_M2_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_RATE_M2_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_RATE_M2" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column label="S3总和催回率">
        <el-table-column property="COLLECTION_PRINCIPAL_RATE_S3_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_RATE_S3_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_RATE_S3" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column label="S3当期催回率">
        <el-table-column property="CURRENT_COLLECTION_RATE_S3_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="CURRENT_COLLECTION_RATE_S3_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="CURRENT_COLLECTION_RATE_S3" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column label="M3在催本金(元)">
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_M3_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_M3_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_M3" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column label="M3在催本金比例">
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_RATE_M3_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_RATE_M3_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_RATE_M3" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column label="M3总和催回率">
        <el-table-column property="COLLECTION_PRINCIPAL_RATE_M3_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_RATE_M3_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_RATE_M3" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column label="M3当期催回率">
        <el-table-column property="CURRENT_COLLECTION_RATE_M3_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="CURRENT_COLLECTION_RATE_M3_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="CURRENT_COLLECTION_RATE_M3" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column label="M3+在催本金(元)">
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_M3PLUS_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_M3PLUS_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_M3PLUS" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column label="M3+在催本金比例">
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_RATE_M3PLUS_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_RATE_M3PLUS_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_DOING_RATE_M3PLUS" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column label="M3+总和催回率">
        <el-table-column property="COLLECTION_PRINCIPAL_RATE_M3PLUS_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_RATE_M3PLUS_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_PRINCIPAL_RATE_M3PLUS" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column label="M3+当期催回率">
        <el-table-column property="CURRENT_COLLECTION_RATE_M3PLUS_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="CURRENT_COLLECTION_RATE_M3PLUS_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="CURRENT_COLLECTION_RATE_M3PLUS" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column label="在催滞纳金(元)">
        <el-table-column property="COLLECTION_LATE_FEE_DOING_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_LATE_FEE_DOING_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_LATE_FEE_DOING" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column label="S1在催滞纳金(元)">
        <el-table-column property="COLLECTION_LATE_FEE_DOING_S1_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_LATE_FEE_DOING_S1_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_LATE_FEE_DOING_S1" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column label="S2在催滞纳金(元)">
        <el-table-column property="COLLECTION_LATE_FEE_DOING_S2_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_LATE_FEE_DOING_S2_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_LATE_FEE_DOING_S2" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column label="M2在催滞纳金(元)">
        <el-table-column property="COLLECTION_LATE_FEE_DOING_M2_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_LATE_FEE_DOING_M2_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_LATE_FEE_DOING_M2" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column label="M3在催滞纳金(元)">
        <el-table-column property="COLLECTION_LATE_FEE_DOING_M3_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_LATE_FEE_DOING_M3_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_LATE_FEE_DOING_M3" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column label="M3+在催滞纳金(元)">
        <el-table-column property="COLLECTION_LATE_FEE_DOING_M3PLUS_Z" label="招财猫" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_LATE_FEE_DOING_M3PLUS_X" label="新网" min-width=100></el-table-column>
        <el-table-column property="COLLECTION_LATE_FEE_DOING_M3PLUS" label="合计" min-width=100></el-table-column>
      </el-table-column>
      <el-table-column property="UPDATE_TIME" label="更新时间" min-width="140"></el-table-column>
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
    getPromptAmountData,
    getPromptAmountDataCount,
    getPromptAmountDataRefresh
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
        return 'api/promptAmountData/excel?startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"'
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
        return getPromptAmountData({
          limit: this.limit,
          offset: this.offset,
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          order: this.order
        })
      },
      getCount() {
        return getPromptAmountDataCount({
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE']
        })
      },
      search() {
        this.loading = true
        this.getDataInit()
      },
      refreshData() {
        this.buttonLoading = true
        getPromptAmountDataRefresh().then((response) => {
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
  .promptAmountData
    height: 100%
    .date-filter
      li
        .dateSelect
          width: 165px

</style>

