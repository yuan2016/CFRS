<template>
  <div class="dailyPromotionEffect" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">渠道商名称：</span>
        <el-select v-model.trim="channel_name" filterable clearable size="mini" placeholder="不限"
                   class="dailyPromotionEffectSelect">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <span class="managerFront">日期：</span>
        <el-date-picker v-model.trim="startTime" type="date" size="mini" placeholder="从"
                        class="dailyPromotionEffectSelect" value-format="yyyy-MM-dd"></el-date-picker>
        <el-date-picker v-model.trim="endTime" type="date" size="mini" placeholder="到"
                        class="dailyPromotionEffectSelect" value-format="yyyy-MM-dd"></el-date-picker>
      </li>
      <li>
        <el-button type="primary" size="mini" class="searchButton" @click.prevent.stop="search">搜索</el-button>
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe style="width: 100%;overflow: auto;" :height="height" class="dailyPromotionEffect-table" @sort-change="sort">
      <el-table-column property="channel_name" fixed label="渠道名称" min-width="100"></el-table-column>
      <el-table-column property="d_date" sortable="custom" label="日期" min-width="90"></el-table-column>
      <el-table-column property="unit_price" sortable="custom" label="结算单价(元)" min-width="120"></el-table-column>
      <el-table-column property="channel_consumption" sortable="custom" label="渠道消耗(元)" min-width="120"></el-table-column>
      <el-table-column property="pv" label="PV数量" sortable="custom" min-width="100"></el-table-column>
      <el-table-column property="uv" label="UV数量" sortable="custom" min-width="100"></el-table-column>
      <el-table-column property="click_num" sortable="custom" label="点击次数" min-width="100"></el-table-column>
      <el-table-column property="click_people" sortable="custom" label="点击人数" min-width="110"></el-table-column>
      <el-table-column property="register_num" sortable="custom" label="注册数" min-width="110"></el-table-column>
      <el-table-column property="uv_conversion_rate" sortable="custom" label="UV转化率" min-width="110"></el-table-column>       
      <el-table-column property="click_conversion_rate" sortable="custom" label="点击转化率" min-width="110"></el-table-column>
      <el-table-column property="uv_output_value" label="UV产值" sortable="custom" min-width="100"></el-table-column>
      <el-table-column property="register_conversion_rate" sortable="custom" label="注册转化率" min-width="120"></el-table-column>
      <el-table-column property="element4_authentication" sortable="custom" label="全要素认证数" min-width="120"></el-table-column>
      <el-table-column property="credit_suss_num" sortable="custom" label="授信成功人数" min-width="120"></el-table-column>
      <el-table-column property="credit_fail_num" sortable="custom" label="授信失败人数" min-width="120"></el-table-column>
      <el-table-column property="hmd_num" sortable="custom" label="黑名单人数" min-width="120"></el-table-column>
      <el-table-column property="hmd_rate" sortable="custom" label="黑名单率" min-width="120"></el-table-column>
      <el-table-column property="nuser_buy_num" sortable="custom" label="新用户购买商品人数" min-width="160"></el-table-column>
      <el-table-column property="ouser_buy_num" sortable="custom" label="老用户购买商品人数" min-width="160"></el-table-column>
      <el-table-column property="buy_num" sortable="custom" label="购买总人数" min-width="110"></el-table-column>
      <el-table-column property="nuser_buy_rate" sortable="custom" label="新用户购买率" min-width="140"></el-table-column>
      <el-table-column property="ouser_buy_rate" sortable="custom" label="老用户购买率" min-width="130"></el-table-column>
      <el-table-column property="nuser_buyback_num" sortable="custom" label="新用户回购成功人数" min-width="160"></el-table-column>
      <el-table-column property="ouser_buyback_num" sortable="custom" label="老用户回购成功人数" min-width="160"></el-table-column>
      <el-table-column property="nuser_buyback_rate" sortable="custom" label="新用户回购成功率" min-width="160"></el-table-column>
      <el-table-column property="ouser_buyback_rate" sortable="custom" label="老用户回购成功率" min-width="160"></el-table-column>
      <el-table-column property="nuser_buycard_num" sortable="custom" label="新用户购买会员卡数" min-width="160"></el-table-column>
      <el-table-column property="nuser_buyback_apply_num" sortable="custom" label="新用户购买会员申请数" min-width="170"></el-table-column>
      <el-table-column property="ouser_buycard_num" sortable="custom" label="老用户购买会员卡数" min-width="160"></el-table-column>
      <el-table-column property="ouser_buyback_apply_num" sortable="custom" label="老用户购买会员申请数" min-width="170"></el-table-column>
      <el-table-column property="nuser_loan_amount" sortable="custom" label="新用户放款金额(元)" min-width="150"></el-table-column>
      <el-table-column property="ouser_loan_amount" sortable="custom" label="老用户放款金额(元)" min-width="150"></el-table-column>
      <el-table-column property="loan_amount" sortable="custom" label="总放款金额(元)" min-width="130"></el-table-column>
      <el-table-column property="overdue_amount" sortable="custom" label="逾期金额(元)" min-width="120"></el-table-column>
      <el-table-column property="overdue_rate" sortable="custom" label="逾期率" min-width="100"></el-table-column>
      <el-table-column property="recovery_rate" sortable="custom" label="催回率" min-width="100"></el-table-column>
      <el-table-column property="bad_debt_rate" sortable="custom" label="坏账率" min-width="100"></el-table-column>
      <el-table-column property="unit_bad_debts" sortable="custom" label="单位坏账额(元)" min-width="130"></el-table-column>
      <el-table-column property="average_price" sortable="custom" label="件均" min-width="100"></el-table-column>
      <el-table-column property="credit_cost" sortable="custom" label="单位征信成本(元)" min-width="140"></el-table-column>
      <el-table-column property="annual_rate" sortable="custom" label="年化率" min-width="100"></el-table-column>
      <el-table-column property="annual_income" sortable="custom" label="年化收入(元)" min-width="120"></el-table-column>
      <el-table-column property="interest" sortable="custom" label="利息(元)" min-width="100"></el-table-column>
      <el-table-column property="new_customer_cost" sortable="custom" label="新用户单位获客成本(元)" min-width="180"></el-table-column>
      <el-table-column property="new_unit_maori" sortable="custom" label="新用户单位毛利(元)" min-width="150"></el-table-column>
      <el-table-column property="update_time" sortable="custom" label="更新时间" min-width="140"></el-table-column>
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
            <div class="title">补录数据</div>
            <el-form :label-position="labelPosition" label-width="120px" :rules="loginRules" :model="formLabelAlign"
                     class="dailyPromotionEffect-form" ref="ruleForm">
              <el-form-item prop="channel_consumption" size="mini" label="渠道消耗:">
                <el-input v-model.trim="formLabelAlign.channel_consumption" clearable class="dailyPromotionEffect-input"></el-input>
              </el-form-item>
              <el-form-item prop="recovery_rate" size="mini" label="催回率:">
                <el-input v-model.trim="formLabelAlign.recovery_rate" clearable class="dailyPromotionEffect-input"></el-input>
              </el-form-item>
              <el-form-item prop="credit_cost" size="mini" label="单位征信成本:">
                <el-input v-model.trim="formLabelAlign.credit_cost" clearable class="dailyPromotionEffect-input"></el-input>
              </el-form-item>
              <el-form-item class="bottom">
                <el-button class="dailyPromotionEffect-button" @click="resetForm('ruleForm')">重置</el-button>
                <el-button class="dailyPromotionEffect-button" type="primary" @click="saveData('ruleForm')">
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
    getDailyPromotionEffect,
    getDailyPromotionEffectCount,
    getDailyPromotionEffectSelect
  } from '../../../../../common/js/api'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      const validateMoney = (rule, v, callback) => {
        if (!v) {
          callback()
        } else {
          if (!(/^(-?\d+)(\.\d+)?$/).test(v.split(',').join(''))) {
            callback(new Error('请填写正确格式'))
          } else {
            callback()
          }
        }
      } 
      const validatePercentage = (rule, v, callback) => {
        if (!v) {
          callback()
        } else {
          let num = Number.parseInt(v)
          if (num<0 || num>100 || isNaN(num)) {
            callback(new Error('请填写0-100的数字'))
          } else {
            callback()
          }
        }
      }        
      return {
        channel_name: '',
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
        formLabelAlign: {
          xn_ll: '',
          xn_ymt: '',
          pocket_amount: '',
          balance_day: ''
        },
        loginRules: {
          channel_consumption: [
            {required: false, trigger: 'blur', validator: validateMoney}
          ],
          recovery_rate: [
            {required: false, trigger: 'blur', validator: validatePercentage}
          ],
          credit_cost: [
            {required: false, trigger: 'blur', validator: validateMoney}
          ]
        },
        currentRowData: {},
        isShowDetail: false,
        labelPosition: 'right',
        isUpdate: false
      }
    },
    components: {
      banner
    },
    created() {
      this.loading = true
      this.getSelectOptions()
      this.getDataInit()
      this.isShowRefreshAndExcel()
      this.isUseUpdate()
    },
    mounted() {
      this.resizeHeight()
    },
    computed: {
      mosaicLink() {
        return 'api/dailyPromotionEffect/excel?channel_name="' + [this.channel_name, 'SELECT'] + '"&startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"'
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
        return getDailyPromotionEffect({
          channel_name: [this.channel_name, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        })
      },
      getCount() {
        return getDailyPromotionEffectCount({
          channel_name: [this.channel_name, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE']
        })
      },
      getSelectOptions() {
        getDailyPromotionEffectSelect().then((response) => {
          this.options = response.data
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
      },
      isUseUpdate() {
        if (this.permission.indexOf('update') > -1) {
          this.isUpdate = true
        } else {
          this.isUpdate = false
        }
      },     
      //千分位表示为普通数字表示
      changeItem(a) {
        if (!a) {
          return 0
        }
        if (typeof (a) == "string") {
          a = a.replace(/\s/g, "")
          if (a === '' || a === '0'){
            return 0
          } else {
            return parseFloat(a.split(',').join(''))
          }
        } else if (typeof (a) == "number") {
          return a
        }
        return 0
      },
      showData(row) {
        if (this.isUpdate) {
          if (row.d_date) {
            this.currentRowData = row
            this.formLabelAlign = {
              channel_consumption: row.channel_consumption,
              recovery_rate: row.recovery_rate,
              credit_cost: row.credit_cost,
              new_customer_cost: row.new_customer_cost,
              new_unit_maori: row.new_unit_maori,
              bad_debt_rate: row.bad_debt_rate,
              unit_bad_debts: row.unit_bad_debts,
              LL_ZB_D: row.LL_ZB_D,
              YMT_ZB_D: row.YMT_ZB_D,
              LL_XN_D: row.LL_XN_D,
              YMT_XN_D: row.YMT_XN_D,
              TOTAL_AMT_D: row.TOTAL_AMT_D
            }
            this.isShowDetail = !this.isShowDetail
          }
        }
      },
      saveData() {
        let extra = this.formLabelAlign
        let origin = this.currentRowData
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (extra.channel_consumption === '' || extra.channel_consumption === null) {
              extra.channel_consumption = null
            }
            if (extra.recovery_rate === '' || extra.recovery_rate === null) {
              extra.recovery_rate = null
            }
            if (extra.credit_cost === '' || extra.credit_cost === null) {
              extra.credit_cost = null
            }
            // if (extra.LL_XN_T === '' || extra.LL_XN_T === null) {
            //   extra.LL_XN_T = null
            //   extra.LL_XN_D = null
            // }
            // if (extra.YMT_XN_T === '' || extra.YMT_XN_T === null) {
            //   extra.YMT_XN_T = null
            //   extra.YMT_XN_D = null
            // }
            if (extra.channel_consumption && origin.nuser_buyback_num) {
              extra.new_customer_cost = this.changeItem(origin.channel_consumption)/this.changeItem(origin.nuser_buyback_num)
            }
            if (extra.credit_cost && origin.annual_income && origin.new_customer_cost && origin.interest && origin.unit_bad_debts) {
              extra.new_unit_maori = this.changeItem(origin.annual_income) - this.changeItem(origin.new_customer_cost) - this.changeItem(origin.interest) - this.changeItem(extra.credit_cost) - this.changeItem(origin.unit_bad_debts)
            }
            if (origin.bad_debt_rate && extra.recovery_rate && origin.overdue_rate) {
              extra.bad_debt_rate = this.changeItem(origin.YMT_ZB_KX) + this.changeItem(origin.YMT_ZB_XF) - this.changeItem(extra.YMT_ZB_T)
            }
            if (extra.bad_debt_rate && origin.nuser_loan_amount) {
              extra.unit_bad_debts = this.changeItem(origin.LL_LQ_XN) + this.changeItem(origin.LL_XQ_XN) - this.changeItem(extra.LL_XN_T)
            }
            console.log(extra)
            // getThreePartyAccountAnalysisModify({
            //   formData: this.formLabelAlign,
            //   date: origin.D_DATE
            // }).then((response) => {
            //   if (response.data.code === '404') {
            //     this.$router.push('./404')
            //   } else if (response.data.code === '1024') {
            //     this.$message({
            //       message: '修改权限请求超时，请刷新页面重试',
            //       type: 'warning'
            //     })
            //   } else {
            //     if (response.data === 200) {
            //       this.loading = true
            //       this.getDataInit()
            //       this.height = parseInt(getHeight()) + 40
            //       this.isShowDetail = !this.isShowDetail
            //       this.$message({
            //       message: '数据修改成功',
            //       type: 'success'
            //     })
            //     } else {
            //       this.$message({
            //         message: '修改信息失败，请重试',
            //         type: 'warning'
            //       })
            //     }
            //   }
            // })
          }
        })
      },
      closeDetial() {
        this.isShowDetail = !this.isShowDetail
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .dailyPromotionEffect
    height: 100%
    .date-filter
      li
        .managerText
          width: 165px
        .dailyPromotionEffectSelect
          width:140px

    .detail
      position: fixed
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: 1002
      overflow: auto
      background: rgba(0, 0, 0, .5)
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
          padding: 10px 0 0 20px
          width: 380px
          height: 350px
          border-radius: 5px
          text-align: center
          background-color: #fff
          .title
            box-sizing: border-box
            padding-left: 20px
            height: 60px
            line-height: 60px
            width: 100%
            text-align: left
            font-size: 25px
            color: #666
            border-radius: 4px 4px 0 0
          .dailyPromotionEffect-form
            margin: 30px 20px 20px 0
            position: relative
            .dailyPromotionEffect-input
              position: absolute
              left: 0px
              width: 160px
            .bottom
              position: relative
              right:-10px
              bottom:-30px
          .dailyPromotionEffect-button
            width: 100px
      .detail-close
        position: absolute
        top: 50px
        right: 150px
        padding-top: 16px
        width: 32px
        height: 32px
        font-size: 32px
        color: rgba(255, 255, 255, 0.5)          
</style>

