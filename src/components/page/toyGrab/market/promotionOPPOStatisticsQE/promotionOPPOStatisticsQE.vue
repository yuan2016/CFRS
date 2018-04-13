<template>
  <div class="promotionOPPOStatisticsQE" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">日期：</span>
        <el-date-picker v-model.trim="startTime" type="date" size="mini" placeholder="从"
                        class="userListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
        <el-date-picker v-model.trim="endTime" type="date" size="mini" placeholder="到"
                        class="userListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
      </li>
      <li>
        <el-button type="primary" size="mini" class="searchButton" @click.prevent.stop="search">搜索</el-button>
        <!--<el-button type="primary" size="mini" v-if='isRefreshData' :loading="buttonLoading"-->
        <!--@click.prevent.stop="refreshData" class="refreshButton">一键刷新-->
        <!--</el-button>-->
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe style="width: 100%;overflow: auto" :height="height"
              class="promotionChannelStatistics-table" @sort-change="sort" @row-dblclick="showData">
      <el-table-column property="d_date" fixed sortable="custom" label="日期" min-width="160"></el-table-column>
      <el-table-column property="channel_name" label="渠道名称"></el-table-column>
      <el-table-column property="day_consumption" sortable="custom" label="当日消耗(元)" min-width="120"></el-table-column>
      <el-table-column property="login_num" sortable="custom" label="登录人数" min-width="110"></el-table-column>
      <el-table-column property="register_num" sortable="custom" label="注册数" min-width="100"></el-table-column>
      <el-table-column property="user_device_num" sortable="custom" label="注册设备数"  min-width="120"></el-table-column>
      <el-table-column property="recharge_user_num" sortable="custom" label="每日充值用户人数" min-width="150"></el-table-column>
      <el-table-column property="recharge_drnum" sortable="custom" label="注册新用户当日充值人数" min-width="180"></el-table-column>
      <el-table-column property="recharge_user_rate" sortable="custom" label="充值用户转化率" min-width="130"></el-table-column>
      <el-table-column property="new_recharge_rate" sortable="custom" label="新用户当日充值率" min-width="150"></el-table-column>
      <el-table-column property="recharge_money" sortable="custom" label="充值总金额(元)" min-width="130"></el-table-column>
      <el-table-column property="avg_recharge_money" sortable="custom" label="平均用户充值金额(元)" min-width="170"></el-table-column>
      <el-table-column property="recharge_dramt" sortable="custom" label="注册新用户当日充值金额(元)" min-width="200"></el-table-column>
      <el-table-column property="register_recharge_rate" sortable="custom" label="当日注册用户充值金额占比" min-width="190"></el-table-column>
      <el-table-column property="payuser_cost" sortable="custom" label="付费用户成本(元)" min-width="140"></el-table-column>
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
    <transition name="fade">
      <div class="detail" v-show="isShowDetail">
        <div class="detail-wrapper">
          <div class="detial-main">
            <div class="title">修改数据</div>
            <span class="formula">公式：付费用户成本=当日消耗/每日充值人数</span>
            <el-form :label-position="labelPosition" label-width="120px" :rules="loginRules" :model="formLabelAlign"
                     class="promotionOPPOStatisticsQE-form" ref="ruleForm">
              <el-form-item prop="day_consumption" size="mini" label="当日消耗:">
                <el-input v-model.trim="formLabelAlign.day_consumption" @change="calcultate"></el-input>
              </el-form-item>
              <el-form-item prop="payuser_cost" size="mini" label="付费用户成本:">
                <el-input v-model.trim="formLabelAlign.payuser_cost" disabled></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="promotionOPPOStatisticsQE-button" @click="saveData('ruleForm')">
                  立即修改
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="detail-close">
          <i class="el-icon-close" @click.stop.prevent="closeDetial"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import banner from '../../../../common/banner/banner'
  import {getNowFormatDate, formatDate} from '../../../../../common/js/utils'
  import {
    getPromotionOPPOStatisticsQE,
    getPromotionOPPOStatisticsQECount,
    getPromotionOPPOStatisticsQERefresh,
    getPromotionOPPOStatisticsQESUM,
    updataOPPOQEData,
    getPromotionOPPOStatisticsQESelect
  } from '../../../../../common/js/api'
  import {mapState, mapGetters} from 'vuex'

  export default {
    data() {
      const validateMoney = (rule, v, callback) => {
        if (!v) {
          callback()
        } else {
          if ((v + '').indexOf(',') === -1) {
            if (!(/^(-?\d+)(\.\d+)?$/).test(v)) {
              callback(new Error('请填写正确格式'))
            } else {
              callback()
            }
          } else {
            if (!(/^(-?\d+)(\.\d+)?$/).test((v + '').split(',').join(''))) {
              callback(new Error('请填写正确格式'))
            } else {
              callback()
            }
          }
        }
      }
      return {
        fundData: [],
        loading: false,
        options: [],
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
        isShowDetail: false,
        labelPosition: 'right',
        peopleNum: 0,
        rowDate: '',
        loginRules: {
          day_consumption: [
            {required: false, trigger: 'blur', validator: validateMoney}
          ],
          payuser_cost: [
            {required: false, trigger: 'change', validator: validateMoney}
          ]
        },
        formLabelAlign: {
          day_consumption: '',
          payuser_cost: ''
        },
        channel_name: ''
      }
    },
    components: {
      banner
    },
    created() {
      this.loading = true
      this.getDataInit()
      this.getSelectOptions()
      this.isShowRefreshAndExcel()
    },
    mounted() {
      this.resizeHeight()
    },
    computed: {
       mosaicLink() {
         if (this.startTime === this.endTime || this.startTime === formatDate(new Date(), 'yyyy-MM-dd') || (!this.startTime && !this.endTime)) {
           return 'api/promotionOPPOStatisticsQE/excel?startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"&channel_name="' + [this.channel_name, 'SELECT'] + '"'
         } else {
           return 'api/promotionOPPOStatisticsQE/excelSUM?startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"&channel_name="' + [this.channel_name, 'SELECT'] + '"'
         }
       },
      ...mapGetters([
        'permission'
      ]),
      ...mapState({
        name: state => state.user.name
      })
    },
    methods: {
      calcultate(a) {
        if (this.peopleNum) {
          if (a.indexOf(',') !== -1) {
            a = a.split(',').join('')
          }
          this.formLabelAlign.payuser_cost = (a / this.peopleNum).toFixed(2)
        } else {
          this.$message({
            message: '程序出现错误，请刷新重试',
            type: 'warning'
          })
        }
      },
      closeDetial() {
        this.isShowDetail = !this.isShowDetail
      },
      showData(row) {
        this.isShowDetail = !this.isShowDetail
        this.peopleNum = row.recharge_user_num
        this.rowDate = row.d_date
        this.formLabelAlign.day_consumption = ''
        this.formLabelAlign.payuser_cost = ''
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
      getDataSearch() {
        this.axios.all([this.getCount(), this.getDataSUM()])
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
        return getPromotionOPPOStatisticsQE({
          channel_name: [this.channel_name, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        })
      },
      getDataSUM() {
        return getPromotionOPPOStatisticsQESUM({
          channel_name: [this.channel_name, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE']
        })
      },
      getCount() {
        return getPromotionOPPOStatisticsQECount({
          channel_name: [this.channel_name, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE']
        })
      },
      search() {
        this.loading = true
        if (this.startTime === this.endTime || this.startTime === formatDate(new Date(), 'yyyy-MM-dd') || (!this.startTime && !this.endTime)) {
          /*if (!this.startTime && !this.endTime) {
            this.startTime = formatDate(new Date(), 'yyyy-MM-dd')
          }*/
          this.getDataInit()
        } else {
          this.getDataSearch()
        }
      },
      resizeHeight() {
        this.setHeight()
        window.onresize = this.setHeight
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
      saveData() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            updataOPPOQEData({
              formData: this.formLabelAlign,
              date: this.rowDate,
              name: this.name
            }).then((response) => {
              if (response.data.code === '404') {
                this.$router.push('./404')
              } else if (response.data.code === '1024') {
                this.$message({
                  message: '修改权限请求超时，请刷新页面重试',
                  type: 'warning'
                })
              } else {
                if (response.data === 200) {
                  this.loading = true
                  this.getDataInit()
                  this.isShowDetail = !this.isShowDetail
                } else {
                  this.$message({
                    message: '修改信息失败，请重试',
                    type: 'warning'
                  })
                }
              }
            })
          }
        })
      },
      getSelectOptions() {
        getPromotionOPPOStatisticsQESelect().then((response) => {
          this.options = response.data
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .promotionOPPOStatisticsQE
    height: 100%
    .date-filter
      li
        .managerText
          width: 160px
        .promotionChannelSelect, .userListTimeSelect, .promotionOPPOStatisticsQESelect
          width: 160px
    .detail
      position: fixed
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: 1002
      overflow: auto
      background: rgba(0, 0, 0, 0.5)
      backdrop-filter: blur(10px)
      &.fade-enter-active
        transition: all .1s linear
      &.fade-leave-active
        opacity: 0
        transition: all .1s linear
      &.fade-enter
        opacity: 0
      &.fade-leave
        opacity: 1
      .detail-wrapper
        min-height: 100%
        width: 100%
        color: rgb(255, 255, 255)
        .detial-main
          position: absolute
          top: 50%
          left: 50%
          transform: translate(-50%, -50%)
          width: 350px
          height: 300px
          border-radius: 5px
          text-align: center
          background-color: rgb(239, 242, 247)
          .title
            box-sizing: border-box
            padding-left: 20px
            height: 60px
            line-height: 60px
            width: 100%
            text-align: left
            font-size: 25px
            color: #fff
            border-radius: 4px 4px 0 0
            background-color rgb(64, 158, 255)
          .formula
            display: inline-block
            margin: 30px 0 10px -50px
            color: #3a8ee6
          .promotionOPPOStatisticsQE-form
            margin: 20px 20px 20px 0
          .promotionOPPOStatisticsQE-button
            width: 200px
      .detail-close
        position: absolute
        top: 50px
        right: 150px
        padding-top: 16px
        width: 32px
        height: 32px
        font-size: 32px
        color: rgba(255, 255, 255, 0.5)

    /*.el-table
      tbody
        tr:first-of-type
          td
            .cell
              color: #ff4949*/

  @media (max-width: 847px)
    .promotionChannelStatistics
      .date-filter
        li
          .managerFront
            width: 72px

</style>
