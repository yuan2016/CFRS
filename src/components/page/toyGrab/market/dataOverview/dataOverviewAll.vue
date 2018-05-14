<template>
  <div class="dateOverview" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <ul class="date-filter">
      <li>
        <el-select v-model="value" size="mini" placeholder="汇总" @change="changeValue" class="dateOverviewSelect">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <el-button class="refreshButton" v-if='isRefreshData' type="primary" size="mini" :loading="buttonLoading"
                   @click.prevent.stop="refreshData">一键刷新
        </el-button>
      </li>
    </ul>
    <el-card class="box-card">
      <div class="cards">
        <div v-for="(item,key) in dayData" :key="key" class="card">
          <a class="card_title"> {{key}}:</a><span class="card_number"> {{(item)}}</span>
        </div>
      </div>
      <div class="goTop"><i class="elextra-icon-down"></i></div>
    </el-card>

    <el-table stripe :data="fundData" highlight-current-row border
              :height="height" style="width:100%;overflow: auto" @sort-change="sort" class="dateOverview-table">
      <el-table-column property="room_name" label="房间名称" min-width="120"></el-table-column>
      <el-table-column property="once_price" sortable="custom" label="单次游戏金额(游戏币)"  min-width="180"></el-table-column>
      <el-table-column property="games_num" sortable="custom" label="游戏总次数" min-width="120"></el-table-column>
      <el-table-column property="success_num" sortable="custom" label="成功抓取次数" min-width="120"></el-table-column>
      <el-table-column property="fact_income"  sortable="custom" label="游戏币实际收入(游戏币)" min-width="180"></el-table-column>
      <el-table-column property="the_income" sortable="custom" label="游戏币理论收入(游戏币)" width="180"></el-table-column>
      <el-table-column property="diff_income" sortable="custom" label="收入差(游戏币)" min-width="130"></el-table-column>
      <el-table-column property="appeal_num" sortable="custom" label="房间申诉次数" min-width="120"></el-table-column>
      <el-table-column property="modified_time" sortable="custom" label="修改时间" min-width="140"></el-table-column>
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
  import banner from '../../../../common/banner/banner.vue'
  import {getNowFormatDate, formatDate} from '../../../../../common/js/utils'
  import {getDataOverviewAllRoom, getDataOverviewAllRoomCount, getDataOverviewAllDay, getDataOverviewAllRefresh} from '../../../../../common/js/api'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        d_date: '' || this.getToday(),
        fundData: [],
        currentRow: null,
        offset: 0,
        limit: 20,
        count: 0,
        currentPage: 1,
        startTime: '',
        endTime: '',
        isShowPage: false,
        pageContent: 'sizes',
        loading: false,
        options: [{
          value: '0',
          label: '日'
        }, {
          value: '1',
          label: '汇总'
        }],
        height: 500,
        order: '',
        dayData: '',
        gotop: false,
        isRefreshData: false,
        value: '1',
        buttonLoading: false
      }
    },
    components: {
      banner
    },
    computed: {
      ...mapGetters([
        'permission'
      ])
    },
    created() {
      this.loading = true
      this.getDataInit()
    },
    mounted() {
      this.resizeHeight()
      this.isShowRefreshAndExcel()
    },
    updated() {
      this.setTitle()
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
        this.axios.all([this.getCount(), this.getRoomData(), this.getDayData()])
          .then(this.axios.spread((acct, perms, days) => {
            if (perms.data.code === '404' || acct.data.code === '404' || days.data.code === '404') {
              this.$router.push('./404')
            } else if (perms.data.code === '1024' || acct.data.code === '1024' || days.data.code === '404') {
              this.fundData = []
              this.loading = false
              this.$message({
                message: '请求超时，请增加搜索条件以便搜索',
                type: 'warning'
              })
            } else {
              this.dayData = days.data[0]
              if (days.data.length === 0) {
                document.getElementsByClassName('box-card')[0].style.display = 'none'
              } else {
                document.getElementsByClassName('box-card')[0].style.display = 'block'
              }
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
      getRoomData() {
        return getDataOverviewAllRoom({
          limit: this.limit,
          offset: this.offset,
          d_date: [this.d_date, 'DATE', 'E'],
          order: this.order
        })
      },
      getDayData() {
        let newDate = this.d_date
        if (!this.d_date) {
          newDate = formatDate(new Date(), 'yyyy-MM-dd')
        }
        return getDataOverviewAllDay({
          limit: this.limit,
          offset: this.offset,
          d_date: [newDate, 'DATE', 'E'],
          order: this.order
        })
      },
      getCount() {
        return getDataOverviewAllRoomCount({
          d_date: [this.d_date, 'DATE', 'E']
        })
      },
      search() {
        this.loading = true
        this.getDataInit()
      },
      refreshData() {
        this.buttonLoading = true
        getDataOverviewAllRefresh().then((response) => {
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
        let $gotop = document.getElementsByClassName('goTop')[0]
        let $cards = document.getElementsByClassName('cards')[0]
        let $elCards = document.getElementsByClassName('box-card')[0]
        $gotop.onclick = function (e) {
          if (this.gotop) {
            $elCards.style.height = ''
            $cards.style.visibility = ''
            $gotop.style.transform = 'rotate(0deg)'
          } else {
            $elCards.style.height = '20px'
            $cards.style.visibility = 'hidden'
            $gotop.style.transform = 'rotate(180deg)'
          }
          this.gotop = !this.gotop
        }
      },
      setHeight() {
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
        this.height = docH - filterH - bannerH - pageH - 105 - 112
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
      setTitle () {
        let $cards = document.getElementsByClassName('cards')[0].getElementsByClassName('card')
        let leng = $cards.length
        if (leng > 0) {
          $cards[leng - 1].title = '新用户充值转化率：当天注册且充值人数/当天注册用户数'
          $cards[leng - 2].title = '充值转化率：充值人数/登陆用户数'
        }
      },
      getToday () {
        let seperator = '-'
        let day = new Date()
        day.setTime(day.getTime())
        let month = day.getMonth() + 1
        let strDate = day.getDate()
        if (month >= 1 && month <= 9) {
          month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = '0' + strDate
        }
        return day.getFullYear() + seperator + month + seperator + strDate
      },
      changeValue () {
        if (this.value === '0') {
          this.$router.push('dataOverview')
        } else if (this.value === '1') {
          this.$router.push('dataOverviewAll')
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .dateOverview
    height: 100%
    .date-filter
      li
        .d_date
          width: 150px
        .dateOverviewSelect
          width: 80px
    .box-card
      position: relative
      margin-bottom: 10px
      height: 110px
      border-radius: 10px
      transition: all .5s ease
      z-index:97
      .cards
        display: flex
        flex-wrap: wrap
        height: 80px
        transition: all .5s ease
        .card
          height: 14px
          line-height: 14px
          min-width: 160px
          font-size: 12px
          .card_title
            display: inline-block
            min-width: 80px
            margin-right: 5px
            color: #333
            text-align:left
            &:hover
              cursor: pointer
          .card_number
            display: inline-block
            /*min-width: 120px*/
            color: #ff4949
        .wid100
          width: 100%
        .info
          width: 100%
          border-top: 1px solid #ccc
          padding-top: 3px
          p
            height: 16px
            line-height: 16px
            font-size: 12px
            color: #999
      .goTop
        position: absolute
        right: 50%
        bottom: 0
        width: 20px
        height: 20px
        transition: all .5s ease
        .elextra-icon-down
          font-size: 20px
          color: #333
          &:hover
            color: #20a0ff
</style>
