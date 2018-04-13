<template>
  <div class="riskControlFactorAnalysis" v-loading.body="loading" element-loading-text="拼命加载中" >
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">借款类型：</span>
        <el-select v-model.trim="loan_term" size="mini" placeholder="不限" class="riskSelect" @change="search">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <span class="managerFront mf_small">日期：</span>
        <el-select v-model.trim="rq_zbmc" size="mini" placeholder="日（十天+同比）" class="riskSelect" @change="changeValue">
          <el-option
            v-for="item in options3"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <span class="managerFront">用户类型：</span>
        <el-select v-model.trim="customer_type" size="mini" placeholder="新用户" class="riskSelect" @change="search">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <span class="managerFront mf_small">指标：</span>
        <el-select v-model.trim="syyq_zb" size="mini" placeholder="五天内逾期率" class="riskSelect" @change="search">
          <el-option
            v-for="item in options4"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
    </div>
    <el-table :data="fundData" border highlight-current-row
              style="width: 100%;overflow: auto;" :height="height" class="riskControlFactorAnalysis-table">
      <el-table-column property="AA"  :label="labels[0]"  rowspan="2">
        <el-table-column property="AA" width="120px"></el-table-column>
        <el-table-column property="BB" ></el-table-column>
      </el-table-column>
      <el-table-column property="D1" :label="labels[2]">
        <el-table-column property="d11" :label="Pdata[2]"></el-table-column>
        <el-table-column property="d12" :label="Pdata[3]"></el-table-column>
        <el-table-column property="d13" :label="Pdata[4]"></el-table-column>
        <el-table-column property="d14" :label="Pdata[5]"></el-table-column>
      </el-table-column>
      <el-table-column property="D2" :label="labels[6]">
        <el-table-column property="d21" :label="Pdata[6]"></el-table-column>
        <el-table-column property="d22" :label="Pdata[7]"></el-table-column>
        <el-table-column property="d23" :label="Pdata[8]"></el-table-column>
        <el-table-column property="d24" :label="Pdata[9]"></el-table-column>
      </el-table-column>
      <el-table-column property="D3" :label="labels[10]">
        <el-table-column property="d31" :label="Pdata[10]"></el-table-column>
        <el-table-column property="d32" :label="Pdata[11]"></el-table-column>
        <el-table-column property="d33" :label="Pdata[12]"></el-table-column>
        <el-table-column property="d34" :label="Pdata[13]"></el-table-column>
      </el-table-column>
      <el-table-column property="D4" :label="labels[14]">
        <el-table-column property="d41" :label="Pdata[14]"></el-table-column>
        <el-table-column property="d42" :label="Pdata[15]"></el-table-column>
        <el-table-column property="d43" :label="Pdata[16]"></el-table-column>
        <el-table-column property="d44" :label="Pdata[17]"></el-table-column>
      </el-table-column>
      <el-table-column property="D5" :label="labels[18]">
        <el-table-column property="d51" :label="Pdata[18]"></el-table-column>
        <el-table-column property="d52" :label="Pdata[19]"></el-table-column>
        <el-table-column property="d53" :label="Pdata[20]"></el-table-column>
        <el-table-column property="d54" :label="Pdata[21]"></el-table-column>
      </el-table-column>
      <el-table-column property="D6" :label="labels[22]">
        <el-table-column property="d61" :label="Pdata[22]"></el-table-column>
        <el-table-column property="d62" :label="Pdata[23]"></el-table-column>
        <el-table-column property="d63" :label="Pdata[24]"></el-table-column>
        <el-table-column property="d64" :label="Pdata[25]"></el-table-column>
      </el-table-column>
      <el-table-column property="D7" :label="labels[26]">
        <el-table-column property="d71" :label="Pdata[26]"></el-table-column>
        <el-table-column property="d72" :label="Pdata[27]"></el-table-column>
        <el-table-column property="d73" :label="Pdata[28]"></el-table-column>
        <el-table-column property="d74" :label="Pdata[29]"></el-table-column>
      </el-table-column>
      <el-table-column property="D8" :label="labels[30]">
        <el-table-column property="d81" :label="Pdata[26]"></el-table-column>
        <el-table-column property="d82" :label="Pdata[27]"></el-table-column>
        <el-table-column property="d83" :label="Pdata[28]"></el-table-column>
        <el-table-column property="d84" :label="Pdata[29]"></el-table-column>
      </el-table-column>
      <el-table-column property="D9" :label="labels[34]">
        <el-table-column property="d91" :label="Pdata[26]"></el-table-column>
        <el-table-column property="d92" :label="Pdata[27]"></el-table-column>
        <el-table-column property="d93" :label="Pdata[28]"></el-table-column>
        <el-table-column property="d94" :label="Pdata[29]"></el-table-column>
      </el-table-column>
      <el-table-column property="D10" :label="labels[38]">
        <el-table-column property="d101" :label="Pdata[26]"></el-table-column>
        <el-table-column property="d102" :label="Pdata[27]"></el-table-column>
        <el-table-column property="d103" :label="Pdata[28]"></el-table-column>
        <el-table-column property="d104" :label="Pdata[29]"></el-table-column>
      </el-table-column>
      <el-table-column property="DOD" :label="labels[42]">
        <el-table-column property="dod1" :label="Pdata[30]"></el-table-column>
        <el-table-column property="dod2" :label="Pdata[31]"></el-table-column>
        <el-table-column property="dod3" :label="Pdata[32]"></el-table-column>
        <el-table-column property="dod4" :label="Pdata[33]"></el-table-column>
      </el-table-column>
    </el-table>
    <div class="pop1">
      <p class="popTop">(本期数据-对照数据)/对照数据</p>
      <p>本期百分比-对照百分比</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import banner from '../../../../common/banner/banner'
  import { getProperty } from '../../../../../common/js/utils'
  import { getRiskControlFactorAnalysis } from '../../../../../common/js/api'

  const defaultBlank = ['指标名称', '指标名称', 'D1', 'D1', 'D1', 'D1', 'D2', 'D2', 'D2', 'D2', 'D3', 'D3', 'D3', 'D3', 'D4', 'D4', 'D4', 'D4', 'D5', 'D5', 'D5', 'D5', 'D6', 'D6', 'D6', 'D6', 'D7', 'D7', 'D7', 'D7', 'D8', 'D8', 'D8', 'D8', 'D9', 'D9', 'D9', 'D9', 'D10', 'D10', 'D10', 'D10', 'DOD', 'DOD', 'DOD', 'DOD', '申请人数', '通过率', '逾期率', '剩余逾期率']

  export default {
    data () {
      return {
        labels: [],
        fundData: [],
        Pdata: [],
        loading: false,
        height: 500,
        loan_term: 'all',
        customer_type: '0',
        rq_zbmc: '日',
        syyq_zb: '5',
        options1: [{
          value: 'all',
          label: '不限'
        }, {
          value: '14',
          label: '14天单期'
        }, {
          value: 'F21',
          label: '21天分期'
        }, {
          value: 'F21-1',
          label: '21天分期F1'
        }, {
          value: 'F21-2',
          label: '21天分期F2'
        }, {
          value: 'F21-3',
          label: '21天分期F3'
        }, {
          value: 'F90',
          label: '90天分期'
        }, {
          value: 'F90-1',
          label: '90天分期F1'
        }, {
          value: 'F90-2',
          label: '90天分期F2'
        }, {
          value: 'F90-3',
          label: '90天分期F3'
        }, {
          value: 'F90-4',
          label: '90天分期F4'
        }, {
          value: 'F90-5',
          label: '90天分期F5'
        }, {
          value: 'F90-6',
          label: '90天分期F6'
        }],
        options2: [{
          value: '0',
          label: '新用户'
        }, {
          value: '1',
          label: '老用户'
        }],
        options3: [{
          value: '日',
          label: '日（十天+同比）'
        }, {
          value: '周',
          label: '周（五周+环比）'
        }, {
          value: '月',
          label: '月（五月+环比）'
        }],
        options4: [{
          value: '5',
          label: '五天剩余逾期率'
        }, {
          value: '10',
          label: '十天剩余逾期率'
        }],
        isJump: false
      }
    },
    components: {
      banner
    },
    created () {
      this.loading = true
      this.fetchData()
      this.getData()
    },
    mounted () {
      this.resizeHeight()
    },
    updated () {
     if (!this.isJump) {
       this.mergeCell()
       this.showPop()
     }
    },
    methods: {
      getData () {
        getRiskControlFactorAnalysis({
            loan_term: [this.loan_term, 'SELECT'],
            customer_type: [this.customer_type, 'SELECT'],
            rq_zbmc: [this.rq_zbmc, 'SELECT'],
            syyq_zb: [this.syyq_zb, 'SELECT']}).then((res) => {
          if (res.data) {
            if (res.data.code === '404') {
              this.$router.push('./404')
            } else if (res.data.code === '1024') {
              this.fundData = []
              this.loading = false
              this.$message({
                message: '请求超时，请重试',
                type: 'warning'
              })
            } else {
              this.fundData = res.data.slice(2)
              if (this.fundData.length === 0) {
                this.labels = defaultBlank
                this.loading = false
                this.$message({
                  message: '数据正在更新，请稍候',
                  type: 'warning'
                })
              } else {
                this.labels = getProperty(res.data[0])
                this.Pdata = getProperty(res.data[1])
                this.loading = false
              }
            }
          } else {
            this.fundData = res.data
            this.loading = false
            this.$message({
              message: '请求超时，请重试',
              type: 'warning'
            })
          }
        }).catch(() => {
          this.fundData = []
          this.labels = defaultBlank
          this.loading = false
          this.$message({
            message: '数据正在更新，请稍候',
            type: 'warning'
          })
        })
      },
      search () {
        this.loading = true
        this.getData()
      },
      resizeHeight () {
        this.setHeight()
        window.onresize = this.setHeight
      },
      setHeight () {
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
        this.height = docH - filterH - bannerH - pageH - 77
      },
      mergeCell () {
        let thead = document.getElementsByTagName('thead')[0]
        if (thead) {
          thead.getElementsByTagName('th')[0].rowSpan = '2'
          thead.getElementsByTagName('tr')[1].getElementsByTagName('th')[0].style.display = 'none'
          thead.getElementsByTagName('tr')[1].getElementsByTagName('th')[1].style.display = 'none'
        }
        let list = this.fundData
        let s
        let count = 1
        let len = list.length - 1
        if (len > 0) {
          for (s in list) {
            let $tr = document.getElementsByTagName('tbody')[0].getElementsByTagName('tr')
            if (s > 0 && s < len) {
              if (list[s].AA === list[s - 1].AA) {
                if ($tr[s]) {
                  $tr[s].getElementsByTagName('td')[0].style.display = 'none'
                }
                count++
              } else if (list[s].AA !== list[s - 1].AA) {
                $tr[s].getElementsByTagName('td')[0].style.display = ''
                $tr[s - count].getElementsByTagName('td')[0].rowSpan = count
                 count = 1
              }
            } else if (s - len === 0) {
              if (list[s].AA === list[s - 1].AA) {
                $tr[s].getElementsByTagName('td')[0].style.display = 'none'
                $tr[s - count].getElementsByTagName('td')[0].rowSpan = count + 1
              } else {
                $tr[s - count].getElementsByTagName('td')[0].rowSpan = count
              }
            }
          }
        }
      },
      changeValue () {
        let value = this.rq_zbmc
        this.isJump = true
        if (value === '日') {
          this.$router.push('')
        } else if (value === '周') {
          this.$router.push({path: 'riskControlFactorAnalysisWeek', query: {loan_term: this.loan_term, customer_type: this.customer_type, syyq_zb: this.syyq_zb}})
        } else if (value === '月') {
          this.$router.push({path: 'riskControlFactorAnalysisMonth', query: {loan_term: this.loan_term, customer_type: this.customer_type, syyq_zb: this.syyq_zb}})
        }
      },
      showPop () {
        if (document.getElementsByClassName('el-table__row').length > 0) {
          let header = document.getElementsByClassName('el-table__header')[0]
          let pop = 11
          if (document.getElementsByClassName('elextra-icon-info').length === 0) {
            header.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[pop].insertAdjacentHTML('beforeEnd', '<i class="elextra-icon-info"></i>')
          }
          let popName = document.getElementsByClassName('pop1')[0]
          let clientWidth = document.documentElement.clientWidth
          header.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[pop].getElementsByTagName('i')[0].addEventListener('mouseover', function (event) {
            let x = clientWidth - event.clientX + 20
            let y = event.clientY - 50
            popName.style.display = 'block'
            popName.style.top = y + 'px'
            popName.style.right = x + 'px'
          })
          header.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[pop].getElementsByTagName('i')[0].addEventListener('mouseout', function () {
            popName.style.display = 'none'
          })
          document.getElementsByClassName('el-table__row')[pop].getElementsByTagName('td')[0].style.backgroundColor = '#93c2d2'
        }
      },
      fetchData () {
        this.loan_term = this.$route.query.loan_term || this.loan_term
        this.customer_type = this.$route.query.customer_type || this.customer_type
        this.syyq_zb = this.$route.query.syyq_zb || this.syyq_zb
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" >
  .riskControlFactorAnalysis
    .date-filter
      padding: 15px 0 15px 1px
      box-sizing border-box
      li
        display: inline-block
        margin-bottom: 5px
        .managerFront
          display: inline-block
          padding-left: 5px
          font-size: 14px
          color: #666
        .riskSelect
          width: 160px
    .pop1
      display: none
      position: absolute
      padding: 5px
      border: 1px solid #cccccc
      border-radius: 5px
      font-size: 12px
      background-color: #fff
      box-shadow: 5px 5px 5px #999
    .pop2
      display: none
      position: absolute
      padding: 5px
      border: 1px solid #cccccc
      border-radius: 5px
      font-size: 12px
      background-color: #fff
      box-shadow: 5px 5px 5px #999
    .pop3
      display: none
      position: absolute
      padding: 5px
      border: 1px solid #cccccc
      border-radius: 5px
      font-size: 12px
      background-color: #fff
      box-shadow: 5px 5px 5px #999

    .popTop
      padding-bottom: 5px

    .elextra-icon-info
      position: relative
      top: 2px
      right: 140px
      font-size: 16px
      color: rgb(102, 102, 102)

    .el-table
      thead
        tr
          th
            position:static

  @media (min-width: 710px) and (max-width: 1166px)
    .riskControlFactorAnalysis
      .date-filter
        width: 460px
        li
          .mf_small
            width: 44px

  @media (max-width: 709px)
    .riskControlFactorAnalysis
      .date-filter
        li
          display: block
          .managerFront
            width: 70px

</style>
