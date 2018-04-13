<template>
  <div class="reconciliationAnalysisQE" v-loading.body="loading" element-loading-text="拼命加载中"
  >
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">日期：</span>
        <el-date-picker
          size="mini"
          v-model.trim="startTime"
          type="date"
          class="userDateSelect"
          placeholder="从"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-date-picker
          size="mini"
          v-model.trim="endTime"
          type="date"
          class="userDateSelect"
          placeholder="到"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </li>
      <li>
        <el-button type="primary" size="mini" @click.prevent.stop="search" class="searchButton">搜索</el-button>
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe
              style="width: 100%;overflow: auto" :height="height" @row-dblclick="showData"
              class="reconciliationAnalysisQE-table" @sort-change="sort">
      <el-table-column property="d_date" fixed sortable="custom" label="日期" min-width="90"></el-table-column>
      <el-table-column label="支付宝账户">
        <el-table-column property="Alipay_amt" label="后台数据(元)" min-width="120"></el-table-column>
        <el-table-column property="Alipay_amt_third" label="第三方数据" min-width="120"></el-table-column>
        <el-table-column property="Alipay_amt_diff" label="差异（后台-第三方）" min-width="140"></el-table-column>
      </el-table-column>
      <el-table-column label="微信账户">
        <el-table-column property="WeChat_amt" label="后台数据(元)" min-width="120"></el-table-column>
        <el-table-column property="WeChat_amt_third" label="第三方数据" min-width="120"></el-table-column>
        <el-table-column property="WeChat_amt_diff" label="差异（后台-第三方）" min-width="140"></el-table-column>
      </el-table-column>
      <el-table-column label="邮费支付宝账户">
        <el-table-column property="post_alipay_amt" label="后台数据(元)" min-width="120"></el-table-column>
        <el-table-column property="post_alipay_amt_third" label="第三方数据" min-width="120"></el-table-column>
        <el-table-column property="post_alipay_amt_diff" label="差异（后台-第三方）" min-width="140"></el-table-column>
      </el-table-column>
      <el-table-column label="邮费微信账户">
        <el-table-column property="post_wechat_amt" label="后台数据(元)" min-width="120"></el-table-column>
        <el-table-column property="post_wechat_amt_third" label="第三方数据" min-width="120"></el-table-column>
        <el-table-column property="post_wechat_amt_diff" label="差异（后台-第三方）" min-width="140"></el-table-column>
      </el-table-column>
      <el-table-column label="汇总">
        <el-table-column property="all_amt_diff" label="总差异额" min-width="140"></el-table-column>
        <el-table-column property="remark" label="备注" min-width="120"></el-table-column>
        <el-table-column property="UPDATE_TIME" label="更新时间" min-width="140"></el-table-column>
      </el-table-column>
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
            <div class="title">第三方数据</div>
            <el-form :label-position="labelPosition" label-width="120px" :rules="loginRules" :model="formLabelAlign"
                     class="reconciliationAnalysisQE-form" ref="ruleForm">
              <el-form-item prop="Alipay_amt_third" size="mini" label="支付宝:">
                <el-input v-model.trim="formLabelAlign.Alipay_amt_third"></el-input>
              </el-form-item>
              <el-form-item prop="WeChat_amt_third" size="mini" label="微信:">
                <el-input v-model.trim="formLabelAlign.WeChat_amt_third"></el-input>
              </el-form-item>
              <el-form-item prop="Alipay_amt_third" size="mini" label="邮费-支付宝:">
                <el-input v-model.trim="formLabelAlign.post_alipay_amt_third"></el-input>
              </el-form-item>
              <el-form-item prop="WeChat_amt_third" size="mini" label="邮费-微信:">
                <el-input v-model.trim="formLabelAlign.post_wechat_amt_third"></el-input>
              </el-form-item>
              <el-form-item size="mini" label="备注:">
                <el-input type="textarea" v-model.trim="formLabelAlign.remark"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="reconciliationAnalysisQE-button" @click="saveData('ruleForm')">
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
  import {getHeight} from '../../../../../common/js/storage'
  import {
    getReconciliationAnalysisQE,
    getReconciliationAnalysisQECount,
    getReconciliationAnalysisQEModify
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
      return {
        fundData: [],
        loading: false,
        pageContent: 'sizes',
        currentRow: '',
        offset: 0,
        limit: 20,
        count: 0,
        currentPage: 1,
        startTime: '',
        endTime: '',
        height: 500,
        buttonLoading: false,
        isShowDetail: false,
        labelPosition: 'right',
        formLabelAlign: {
          Alipay_amt_third: '',
          WeChat_amt_third: '',
          post_alipay_amt_third: '',
          post_wechat_amt_third: '',
          remark: ''
        },
        loginRules: {
          Alipay_amt_third: [
            {required: false, trigger: 'blur', validator: validateMoney}
          ],
          WeChat_amt_third: [
            {required: false, trigger: 'blur', validator: validateMoney}
          ],
          post_alipay_amt_third: [
            {required: false, trigger: 'blur', validator: validateMoney}
          ],
          post_wechat_amt_third: [
            {required: false, trigger: 'blur', validator: validateMoney}
          ]
        },
        currentRowData: {},
        order: '',
        isRefreshData: false,
        isShowExcel: false
      }
    },
    computed: {
      mosaicLink() {
        return 'api/reconciliationAnalysisQE/excel?startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"'
      },
      ...mapGetters([
        'permission'
      ])
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
    methods: {
      closeDetial() {
        this.isShowDetail = !this.isShowDetail
      },
      showData(row) {
        this.currentRowData = row
        this.formLabelAlign = {
          Alipay_amt_third: row.Alipay_amt_third,
          Alipay_amt_diff: row.Alipay_amt_diff,
          WeChat_amt_third: row.WeChat_amt_third,
          WeChat_amt_diff: row.WeChat_amt_diff,
          post_alipay_amt_third: row.post_alipay_amt_third,
          post_alipay_amt_diff: row.post_alipay_amt_diff,
          post_wechat_amt_third: row.post_wechat_amt_third,
          post_wechat_amt_diff: row.post_wechat_amt_diff,
          all_amt_diff: row.all_amt_diff,
          remark: row.remark
        }
        this.isShowDetail = !this.isShowDetail
      },
      //千分位表示为普通数字表示
      changeItem(a) {
        if (a === 0 || a === '0') {
          return a
        }
        return parseFloat(a.split(',').join(''))
      },
      saveData() {
        let extra = this.formLabelAlign
        let origin = this.currentRowData
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (extra.Alipay_amt_third === '' || extra.Alipay_amt_third === null) {
              extra.Alipay_amt_third = null
              extra.Alipay_amt_diff = null
            }
            if (extra.WeChat_amt_third === '' || extra.WeChat_amt_third === null) {
              extra.WeChat_amt_third = null
              extra.WeChat_amt_diff = null
            }
            if (extra.post_alipay_amt_third === '' || extra.post_alipay_amt_third === null) {
              extra.post_alipay_amt_third = null
              extra.post_alipay_amt_diff = null
            }
            if (extra.post_wechat_amt_third === '' || extra.post_wechat_amt_third === null) {
              extra.post_wechat_amt_third = null
              extra.post_wechat_amt_diff = null
            }
            if ((origin.Alipay_amt !== '' && origin.Alipay_amt !== null) && extra.Alipay_amt_third) {
              extra.Alipay_amt_diff = this.changeItem(origin.Alipay_amt) - this.changeItem(extra.Alipay_amt_third)
            }
            if ((origin.WeChat_amt !== '' && origin.WeChat_amt !== null) && extra.WeChat_amt_third) {
              extra.WeChat_amt_diff = this.changeItem(origin.WeChat_amt) - this.changeItem(extra.WeChat_amt_third)
            }
            if ((origin.post_alipay_amt !== '' && origin.post_alipay_amt !== null) && extra.post_alipay_amt_third) {
              extra.post_alipay_amt_diff = this.changeItem(origin.post_alipay_amt) - this.changeItem(extra.post_alipay_amt_third)
            }
            if ((origin.post_wechat_amt !== '' && origin.post_wechat_amt !== null) && extra.post_wechat_amt_third) {
              extra.post_wechat_amt_diff = this.changeItem(origin.post_wechat_amt) - this.changeItem(extra.post_wechat_amt_third)
            }
            if ((extra.Alipay_amt_diff !== '' || extra.WeChat_amt_third !== '' || extra.post_alipay_amt_diff !== '' || extra.post_wechat_amt_diff !== '') && (extra.Alipay_amt_diff !== null || extra.WeChat_amt_third !== null || extra.post_alipay_amt_third !== null || extra.WeChat_amt_third !== null)) {
              let af = extra.Alipay_amt_diff
              let wf = extra.WeChat_amt_diff
              let paf = extra.post_alipay_amt_diff
              let pwf = extra.post_wechat_amt_diff
              if (extra.Alipay_amt_diff && typeof extra.Alipay_amt_diff !== 'number') {
                  af = Number(extra.Alipay_amt_diff.replace(',', ''))
                }
                if (extra.WeChat_amt_diff && typeof extra.WeChat_amt_diff !== 'number') {
                  wf = Number(extra.WeChat_amt_diff.replace(',', ''))
                }
               if (extra.post_alipay_amt_diff && typeof extra.post_alipay_amt_diff !== 'number') {
                 paf = Number(extra.post_alipay_amt_diff.replace(',', ''))
               }
               if (extra.post_wechat_amt_diff && typeof extra.post_wechat_amt_diff !== 'number') {
                 pwf = Number(extra.post_wechat_amt_diff.replace(',', ''))
               }
              extra.all_amt_diff = Number(af) + Number(wf) + Number(paf) + Number(pwf)
            }
            if (extra.Alipay_amt_diff === null && extra.WeChat_amt_third === null && extra.post_alipay_amt_diff === null && extra.post_wechat_amt_diff === null) {
              extra.all_amt_diff = null
            }
            getReconciliationAnalysisQEModify({
              formData: this.formLabelAlign,
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
        return getReconciliationAnalysisQE({
          limit: this.limit,
          offset: this.offset,
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          order: this.order
        })
      },
      getCount() {
        return getReconciliationAnalysisQECount({
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
          this.order = ' order by ' + 't.' + info.prop + ' asc'
        } else if (info.order === 'descending') {
          this.order = ' order by ' + 't.' + info.prop + ' desc'
        } else {
          this.order = ''
        }
        this.search(this.order)
      },
      isShowRefreshAndExcel() {
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
  .reconciliationAnalysisQE
    height: 100%
    .reconciliationAnalysisQE-table
      border-radius: 10px
    .date-filter
      li
        .userDateSelect
          width: 160px
    .detail
      position: fixed
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: 1002
      overflow: auto
      background: rgba(7, 17, 27, 0.8)
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
          height: 400px
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
            background-color rgb(50, 140, 195)
          .reconciliationAnalysisQE-form
            margin: 20px 20px 20px 0
          .reconciliationAnalysisQE-button
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

    .el-form-item__content
      width: 200px

    .el-pagination
      overflow: auto

  .el-form-item
    margin-left: -22px

  .reconciliationAnalysisQE-table .el-input {
    display: none
  }

  .reconciliationAnalysisQE-table .current-row .el-input {
    display: block
  }

  .reconciliationAnalysisQE-table .current-row .el-input + span {
    display: none
  }

</style>
