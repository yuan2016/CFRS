<template>
  <div class="deleteRobotInfo" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">表名：</span>
        <el-select v-model.trim="tableName" filterable clearable size="mini" placeholder="不限"
                   class="deleteRobotInfoSelect" @change="selectTable">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border fit stripe style="width: 100%;overflow: auto;"
              :height="height"
              class="deleteRobotInfo-table">  
      <tr v-for="item in items" :key="item">
        <el-table-column :property="item" :label="item" :min-width="getWidth(item)"></el-table-column>
      </tr>
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
    getOne,
    getOneNum,
    getAllTables
  } from '../../../../../common/js/api'
  // import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        items: [],
        tableName: '',
        fundData: [],
        options: [],
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
      // this.loading = true
      // this.getDataInit()
      // this.isShowRefreshAndExcel()
      this.getTables()
    },
    mounted() {
      this.resizeHeight()
    },
    // computed: {
    //   mosaicLink() {
    //     return 'api/channelDODData/excel?startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"&channel_name="' + [this.channel_name, 'INPUT'] + '"'
    //   }
    //   // ...mapGetters([
    //   //   'permission'
    //   // ])
    // },
    methods: {
      //计算宽度
      getWidth(item) {
        return item.length * 6 + 40
      },
      //选择表然后搜索
      selectTable(a) {
        if (a) {
          this.getDataInit()
        } else {
          this.fundData = []
          this.items = []
        }
      },
      //获取所有表
      getTables() {
        getAllTables().then((res) => {
          this.options = res.data
        })
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
              this.items = Object.keys(perms.data[0])
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
        return getOne({
          limit: this.limit,
          offset: this.offset,
          tableName: this.tableName
        })
      },
      getCount() {
        return getOneNum({
          tableName: this.tableName
        })
      },
      // search() {
      //   this.loading = true
      //   this.getDataInit()
      // },
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
      }
      // sort(info) {
      //   if (info.order === 'ascending') {
      //     this.order = ' order by ' + info.prop + ' asc'
      //   } else if (info.order === 'descending') {
      //     this.order = ' order by ' + info.prop + ' desc'
      //   } else {
      //     this.order = ''
      //   }
      //   this.search(this.order)
      // },
      // isShowRefreshAndExcel() {
      //   if (this.permission.indexOf('refreshed') > -1) {
      //     this.isRefreshData = 'refreshed'
      //   } else {
      //     this.isRefreshData = false
      //   }
      //   if (this.permission.indexOf('excel') > -1) {
      //     this.isShowExcel = 'excel'
      //   } else {
      //     this.isShowExcel = false
      //   }
      // }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .deleteRobotInfo
    height: 100%
    .date-filter
      li
        .managerText
          width: 165px
        .deleteRobotInfoSelect
          width: 320px

</style>

