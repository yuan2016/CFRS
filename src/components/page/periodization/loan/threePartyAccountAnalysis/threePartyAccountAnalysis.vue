<template>
  <div class="threePartyAccountAnalysis" v-loading.body="loading" element-loading-text="拼命加载中"
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
              class="threePartyAccountAnalysis-table" @sort-change="sort" @row-dblclick="showData" :cell-style="cellStyle">
      <el-table-column property="D_DATE" fixed sortable="custom" label="日期"  min-width="90"></el-table-column>
      <el-table-column label="技术后台数据">
        <el-table-column property="LL_ZCM_KX" sortable="custom" label="ZCM开心分期连连(元)" min-width="170"></el-table-column>
        <el-table-column property="LL_ZCM_XF" sortable="custom" label="ZCM消费分期连连(元)" min-width="170"></el-table-column>
        <el-table-column property="LL_ZB_KX" sortable="custom" label="ZB开心分期连连(元)" min-width="170"></el-table-column>
        <el-table-column property="LL_ZB_XF" sortable="custom" label="ZB消费分期连连(元)" min-width="170"></el-table-column>
        <el-table-column property="YMT_ZB_KX" sortable="custom" label="ZB开心分期益码通(元)" min-width="170"></el-table-column>
        <el-table-column property="YMT_ZB_XF" sortable="custom" label="ZB消费分期益码通(元)" min-width="170"></el-table-column>
        <el-table-column property="LL_LQ_XN" sortable="custom" label="XN零钱充值连连(元)" min-width="170"></el-table-column>
        <el-table-column property="YMT_LQ_XN" sortable="custom" label="XN零钱充值益码通(元)" min-width="170"></el-table-column>
        <el-table-column property="LL_XQ_XN" sortable="custom" label="XN续期连连(元)" min-width="140"></el-table-column>
        <el-table-column property="YMT_XQ_XN" sortable="custom" label="XN续期益码通(元)" min-width="150"></el-table-column>
        <el-table-column property="TOTAL_AMT" sortable="custom" label="合计(元)" min-width="110"></el-table-column>
      </el-table-column>
      <el-table-column label="第三方账户数据">        
        <el-table-column property="LL_ZCM_T" fixed sortable="custom" label="ZCM连连(元)"  min-width="130"></el-table-column>
        <el-table-column property="LL_ZB_T" sortable="custom" label="ZB连连(元)" min-width="130"></el-table-column>
        <el-table-column property="YMT_ZB_T" sortable="custom" label="ZB益码通(元)" min-width="130"></el-table-column>
        <el-table-column property="LL_XN_T" sortable="custom" label="XN连连(元)" min-width="130"></el-table-column>
        <el-table-column property="YMT_XN_T" sortable="custom" label="XN益码通(元)" min-width="130"></el-table-column>
        <el-table-column property="TOTAL_AMT_T" sortable="custom" label="合计(元)" min-width="110"></el-table-column>
      </el-table-column>
      <el-table-column label="差异(技术后台-第三方账户)">        
        <el-table-column property="LL_ZCM_D" fixed sortable="custom" label="ZCM连连(元)"  min-width="130"></el-table-column>
        <el-table-column property="LL_ZB_D" sortable="custom" label="ZB连连(元)" min-width="130"></el-table-column>
        <el-table-column property="YMT_ZB_D" sortable="custom" label="ZB益码通(元)" min-width="130"></el-table-column>
        <el-table-column property="LL_XN_D" sortable="custom" label="XN连连(元)" min-width="130"></el-table-column>
        <el-table-column property="YMT_XN_D" sortable="custom" label="XN益码通(元)" min-width="130"></el-table-column>
        <el-table-column property="TOTAL_AMT_D" sortable="custom" label="合计(元)" min-width="110"></el-table-column>
      </el-table-column>
      <el-table-column property="CREATE_TIME" sortable="custom" label="创建时间" min-width="140"></el-table-column>
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
                     class="threePartyAccountAnalysis-form" ref="ruleForm">
              <el-form-item prop="LL_ZCM_T" size="mini" label="ZCM连连(元):">
                <el-input v-model.trim="formLabelAlign.LL_ZCM_T" clearable class="threePartyAccountAnalysis-input"></el-input>
              </el-form-item>
              <el-form-item prop="LL_ZB_T" size="mini" label="ZB连连(元):">
                <el-input v-model.trim="formLabelAlign.LL_ZB_T" clearable class="threePartyAccountAnalysis-input"></el-input>
              </el-form-item>
              <el-form-item prop="YMT_ZB_T" size="mini" label="ZB益码通(元):">
                <el-input v-model.trim="formLabelAlign.YMT_ZB_T" clearable class="threePartyAccountAnalysis-input"></el-input>
              </el-form-item>
              <el-form-item prop="LL_XN_T" size="mini" label="XN连连(元):">
                <el-input v-model.trim="formLabelAlign.LL_XN_T" clearable class="threePartyAccountAnalysis-input"></el-input>
              </el-form-item>
              <el-form-item prop="YMT_XN_T" size="mini" label="XN益码通(元):">
                <el-input v-model.trim="formLabelAlign.YMT_XN_T" clearable class="threePartyAccountAnalysis-input"></el-input>
              </el-form-item>
              <el-form-item class="bottom">
                <el-button class="threePartyAccountAnalysis-button" @click="resetForm('ruleForm')">重置</el-button>
                <el-button class="threePartyAccountAnalysis-button" type="primary" @click="saveData('ruleForm')">
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
    getThreePartyAccountAnalysis,
    getThreePartyAccountAnalysisCount,
    getThreePartyAccountAnalysisRefresh,
    getThreePartyAccountAnalysisModify
  } from '../../../../../common/js/api'
  import {mapGetters} from 'vuex'
  import {getHeight} from '../../../../../common/js/storage'

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
          LL_ZCM_T: [
            {required: false, trigger: 'blur', validator: validateMoney}
          ],
          LL_ZB_T: [
            {required: false, trigger: 'blur', validator: validateMoney}
          ],
          YMT_ZB_T: [
            {required: false, trigger: 'blur', validator: validateMoney}
          ],
          LL_XN_T: [
            {required: false, trigger: 'blur', validator: validateMoney}
          ],
          YMT_XN_T: [
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
        return 'api/threePartyAccountAnalysis/excel?startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"'
      },
      ...mapGetters([
        'permission'
      ])
    },
    methods: {
      //第一行显示红色字体
      cellStyle: function (row) {
        if(row.rowIndex === 0){
          return {"color": "red!important","font-weight": "bold!important"}
        }
      },
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
        return getThreePartyAccountAnalysis({
          limit: this.limit,
          offset: this.offset,
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          order: this.order
        })
      },
      getCount() {
        return getThreePartyAccountAnalysisCount({
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
        getThreePartyAccountAnalysisRefresh().then((response) => {
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
          if (row.D_DATE) {
            this.currentRowData = row
            this.formLabelAlign = {
              LL_ZCM_T: row.LL_ZCM_T,
              LL_ZB_T: row.LL_ZB_T,
              YMT_ZB_T: row.YMT_ZB_T,
              LL_XN_T: row.LL_XN_T,
              YMT_XN_T: row.YMT_XN_T,
              TOTAL_AMT_T: row.TOTAL_AMT_T,
              LL_ZCM_D: row.LL_ZCM_D,
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
            if (extra.LL_ZCM_T === '' || extra.LL_ZCM_T === null) {
              extra.LL_ZCM_T = null
              extra.LL_ZCM_D = null
            }
            if (extra.LL_ZB_T === '' || extra.LL_ZB_T === null) {
              extra.LL_ZB_T = null
              extra.LL_ZB_D = null
            }
            if (extra.YMT_ZB_T === '' || extra.YMT_ZB_T === null) {
              extra.YMT_ZB_T = null
              extra.YMT_ZB_D = null
            }
            if (extra.LL_XN_T === '' || extra.LL_XN_T === null) {
              extra.LL_XN_T = null
              extra.LL_XN_D = null
            }
            if (extra.YMT_XN_T === '' || extra.YMT_XN_T === null) {
              extra.YMT_XN_T = null
              extra.YMT_XN_D = null
            }
            if (extra.LL_ZCM_T) {
              extra.LL_ZCM_D = this.changeItem(origin.LL_ZCM_KX) + this.changeItem(origin.LL_ZCM_XF) - this.changeItem(extra.LL_ZCM_T)
            }
            if (extra.LL_ZB_T) {
              extra.LL_ZB_D = this.changeItem(origin.LL_ZB_KX) + this.changeItem(origin.LL_ZB_XF) - this.changeItem(extra.LL_ZB_T)
            }
            if (extra.YMT_ZB_T) {
              extra.YMT_ZB_D = this.changeItem(origin.YMT_ZB_KX) + this.changeItem(origin.YMT_ZB_XF) - this.changeItem(extra.YMT_ZB_T)
            }
            if (extra.LL_XN_T) {
              extra.LL_XN_D = this.changeItem(origin.LL_LQ_XN) + this.changeItem(origin.YMT_LQ_XN) - this.changeItem(extra.LL_XN_T)
            }
            if (extra.YMT_XN_T) {
              extra.YMT_XN_D = this.changeItem(origin.LL_XQ_XN) + this.changeItem(origin.YMT_XQ_XN) - this.changeItem(extra.YMT_XN_T)
            }
            if (extra.LL_ZCM_T || extra.LL_ZB_T || extra.YMT_ZB_T || extra.LL_XN_T || extra.YMT_XN_T) {
              extra.TOTAL_AMT_T = this.changeItem(extra.LL_ZCM_T) + this.changeItem(extra.LL_ZB_T) + this.changeItem(extra.YMT_ZB_T) + this.changeItem(extra.LL_XN_T) + this.changeItem(extra.YMT_XN_T)
            }
            if (extra.LL_ZCM_D || extra.LL_ZB_D || extra.YMT_ZB_D || extra.LL_XN_D || extra.YMT_XN_D) {
              extra.TOTAL_AMT_D = this.changeItem(extra.LL_ZCM_D) + this.changeItem(extra.LL_ZB_D) + this.changeItem(extra.YMT_ZB_D) + this.changeItem(extra.LL_XN_D) + this.changeItem(extra.YMT_XN_D)
            }
            getThreePartyAccountAnalysisModify({
              formData: this.formLabelAlign,
              date: origin.D_DATE
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
                  this.$message({
                  message: '数据修改成功',
                  type: 'success'
                })
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
  .threePartyAccountAnalysis
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
          height: 430px
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
          .threePartyAccountAnalysis-form
            margin: 30px 20px 20px 0
            position: relative
            .threePartyAccountAnalysis-input
              position: absolute
              left: 0px
              width: 160px
            .bottom
              position: relative
              right:-10px
              bottom:-30px    
          .threePartyAccountAnalysis-button
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

