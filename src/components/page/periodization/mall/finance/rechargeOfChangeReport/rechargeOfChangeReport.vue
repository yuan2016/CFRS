<template>
  <div class="rechargeOfChangeReport" v-loading.body="loading" element-loading-text="拼命加载中"
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
        <!-- <el-button class="refreshButton" v-if='isRefreshData' type="primary" size="mini" :loading="buttonLoading"
                   @click.prevent.stop="refreshData">一键刷新
        </el-button> -->
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe style="width: 100%;overflow: auto;" :height="height"
              class="rechargeOfChangeReport-table" @sort-change="sort" @row-dblclick="showData">
      <el-table-column property="d_date" fixed sortable="custom" label="日期"  min-width="90"></el-table-column>
      <el-table-column property="m_month" sortable="custom" label="月份" min-width="80"></el-table-column>
      <el-table-column property="xn_ll" sortable="custom" label="XN连连(元)" min-width="130"></el-table-column>
      <el-table-column property="xn_ymt" sortable="custom" label="XN益码通(元)" min-width="130"></el-table-column>
      <el-table-column property="pocket_amount" sortable="custom" label="零钱合计(元)" min-width="130"></el-table-column>
      <el-table-column property="dlb_income" sortable="custom" label="礼包购买(元)" min-width="140"></el-table-column>
      <el-table-column property="pocket_buy" sortable="custom" label="商品零钱购买(元)" min-width="140"></el-table-column>
      <el-table-column property="withdraw" sortable="custom" label="提现(元)" min-width="140"></el-table-column>
      <el-table-column property="withdraw_fee" sortable="custom" label="提现手续费(元)" min-width="130"></el-table-column>
      <el-table-column property="dlb_refund" sortable="custom" label="退款(元)" min-width="140"></el-table-column>
      <el-table-column property="pocket_recharge_tatol" sortable="custom" label="合计(元)" min-width="130"></el-table-column>
      <el-table-column property="balance_day" sortable="custom" label="当日余额(元)" min-width="140"></el-table-column>
      <el-table-column property="balance" sortable="custom" label="后台当日余额(元)" min-width="140"></el-table-column>
      <el-table-column property="diff" sortable="custom" label="验证差异(元)" min-width="140"></el-table-column>
      <el-table-column property="alipay_recharge_fee" sortable="custom" label="支付宝充值手续费收入(元)" min-width="190"></el-table-column>
      <el-table-column property="remarks" label="备注" min-width="140"></el-table-column>
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
                     class="rechargeOfChangeReport-form" ref="ruleForm">
              <el-form-item prop="xn_ll" size="mini" label="XN连连(元):" class="rechargeOfChangeReport-input">
                <el-input v-model.trim="formLabelAlign.xn_ll"></el-input>
              </el-form-item>
              <el-form-item prop="xn_ymt" size="mini" label="XN益码通(元):" class="rechargeOfChangeReport-input">
                <el-input v-model.trim="formLabelAlign.xn_ymt"></el-input>
              </el-form-item>
              <el-form-item class="bottom">
                <el-button class="rechargeOfChangeReport-button" @click="resetForm('ruleForm')">重置</el-button>
                <el-button type="primary" class="rechargeOfChangeReport-button" @click="saveData('ruleForm')">
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
  import banner from '../../../../../common/banner/banner'
  import {getNowFormatDate, formatDate} from '../../../../../../common/js/utils'
  import {
    getRechargeOfChangeReport,
    getRechargeOfChangeReportCount,
    getRechargeOfChangeReportRefresh,
    getRechargeOfChangeReportModify
  } from '../../../../../../common/js/api'
  import {mapGetters} from 'vuex'
  import {getHeight} from '../../../../../../common/js/storage'

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
        formLabelAlign: {
          xn_ll: '',
          xn_ymt: '',
          pocket_amount: '',
          balance_day: ''
        },
        loginRules: {
          xn_ll: [
            {required: false, trigger: 'blur', validator: validateMoney}
          ],
          xn_ymt: [
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
      this.getDataInit()
      this.isShowRefreshAndExcel()
      this.isUseUpdate()
    },
    mounted() {
      this.resizeHeight()
    },
    computed: {
      mosaicLink() {
        return 'api/rechargeOfChangeReport/excel?startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"'
      },
      ...mapGetters([
        'permission'
      ])
    },
    methods: {
      //重置form表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
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
        return getRechargeOfChangeReport({
          limit: this.limit,
          offset: this.offset,
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          order: this.order
        })
      },
      getCount() {
        return getRechargeOfChangeReportCount({
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
        getRechargeOfChangeReportRefresh().then((response) => {
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
        if (a === 0 || a === '0') {
          return a
        }
        return parseFloat(a.split(',').join(''))
      },
      showData(row) {
        if (this.isUpdate){
          this.currentRowData = row
          this.formLabelAlign = {
            xn_ll: row.xn_ll,
            xn_ymt: row.xn_ymt
          }
          this.isShowDetail = !this.isShowDetail
        }
      },
      saveData() {
        let extra = this.formLabelAlign
        let origin = this.currentRowData
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (extra.xn_ll === '') {
              extra.xn_ll = null
            }
            if (extra.xn_ymt === '') {
              extra.xn_ymt = null
            }
            if (extra.xn_ll !== null && extra.xn_ymt !== null) {
              extra.pocket_amount = this.changeItem(extra.xn_ll) + this.changeItem(extra.xn_ymt)
            } else if (extra.xn_ll === null && extra.xn_ymt !== null) {
              extra.pocket_amount = this.changeItem(extra.xn_ymt)
            } else if (extra.xn_ll !== null && extra.xn_ymt === null) {
              extra.pocket_amount = this.changeItem(extra.xn_ll)
            }
            if ((extra.pocket_amount !== '' && extra.pocket_amount !== null) && (origin.pocket_recharge_tatol !== '' && origin.pocket_recharge_tatol !== null)) {
              extra.balance_day = extra.pocket_amount - this.changeItem(origin.pocket_recharge_tatol)
            }
            getRechargeOfChangeReportModify({
              formData: extra,
              date: origin.d_date
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
                  this.height = parseInt(getHeight()) + 40
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
      closeDetial() {
        this.isShowDetail = !this.isShowDetail
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .rechargeOfChangeReport
    height: 100%
    .date-filter
      li
        .dateSelect
          width: 165px

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
          padding-top:10px
          width: 350px
          height: 260px
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
          .rechargeOfChangeReport-form
            margin: 30px 20px 20px 0
            .rechargeOfChangeReport-input
              position:relative
              .el-input
                position: absolute
                left:0
                width:160px
            .bottom
            .el-form-item__content
              width: 220px
            .rechargeOfChangeReport-button
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

