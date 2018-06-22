<template>
  <div class="loanThroughRateAll" v-loading="loading" element-loading-text="拼命加载中" >
    <banner></banner>
    <div class="date-filter">
      <el-select v-model.trim="model" size="mini" placeholder="请选择" class="loanThroughRateAllSelect" @change="goTo">
        <el-option
          v-for="item in options1"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <span class="managerFront">状态：</span>
      <el-select v-model="value" size="mini" placeholder="全部" @change="changeValue" class="loanThroughRateAllSelect">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe
              style="width: 100%;overflow: auto;" :height="height" class="loanThroughRateAll-table">
      <el-table-column property="AA" :label="labels[0]" width="160px"></el-table-column>
      <el-table-column property="D1" :label="labels[1]"></el-table-column>
      <el-table-column property="D2" :label="labels[2]"></el-table-column>
      <el-table-column property="D3" :label="labels[3]"></el-table-column>
      <el-table-column property="D4" :label="labels[4]"></el-table-column>
      <el-table-column property="D5" :label="labels[5]"></el-table-column>
      <el-table-column property="D6" :label="labels[6]"></el-table-column>
      <el-table-column property="D7" :label="labels[7]"></el-table-column>
      <el-table-column property="DOD" :label="labels[8]"></el-table-column>
      <el-table-column property="W1" :label="labels[9]"></el-table-column>
      <el-table-column property="W2" :label="labels[10]"></el-table-column>
      <el-table-column property="W3" :label="labels[11]"></el-table-column>
      <el-table-column property="W4" :label="labels[12]"></el-table-column>
      <el-table-column property="WOW" :label="labels[13]"></el-table-column>
      <el-table-column property="M1" :label="labels[14]"></el-table-column>
      <el-table-column property="M2" :label="labels[15]"></el-table-column>
      <el-table-column property="M3" :label="labels[16]"></el-table-column>
      <el-table-column property="MOM" :label="labels[17]"></el-table-column>
    </el-table>
    <div class="pop1">
      <p class="popTop">(本期数据-对照数据)/对照数据</p>
      <p>本期百分比-对照百分比</p>
    </div>
    <div class="pop2">
      <p class="popTop">(本期数据-对照数据)/对照数据</p>
      <p>本期百分比-对照百分比</p>
    </div>
    <div class="pop3">
      <p class="popTop">(本期数据-对照数据)/对照数据</p>
      <p>本期百分比-对照百分比</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import banner from '../../../../common/banner/banner'
  import { getProperty } from '../../../../../common/js/utils'
  import { getHeight } from '../../../../../common/js/storage'
  import { getLoanThroughRateAll } from '../../../../../common/js/api'

  export default {
    data () {
      return {
        labels: [],
        radio: '1',
        fundData: [],
        loading: false,
        height: 500,
        value: '',
        model: './loanThroughRate',
        options: [{
          value: '0',
          label: 'TopN'
        }, {
          value: '1',
          label: '全部'
        }],
        options1: [{
          label: '图',
          value: './tab1'
        }, {
          label: '表',
          value: './loanThroughRate'
        }],
        iconIndex: [],
        backcolor1: [],
        backcolor2: [],
        diff: [],
        dHeight: 500
      }
    },
    components: {
      banner
    },
    created () {
      // this.loading = true
      // this.getData()
    },
    mounted () {
     this.resizeHeight()
    },
    methods: {
      goTo () {
        this.$router.push({path: '/RMAB/market/newUserPassRate'})
      },
      changeValue () {
        if (this.value === '0') {
          this.$router.push('loanThroughRate')
        } else if (this.value === '1') {
          this.$router.push('loanThroughRateAll')
        }
      },
      getData () {
        getLoanThroughRateAll().then((res) => {
          if (res.data) {
            this.iconIndex = res.data[0].D3.split(',')
            this.backcolor1 = res.data[0].D1.split(',')
            this.backcolor2 = res.data[0].D2.split(',')
            this.diff = res.data[0].D4.split(',')
            this.fundData = res.data.slice(2)
            this.labels = getProperty(res.data[1])
            this.loading = false
          } else {
            this.fundData = []
            this.labels = ['指标名称', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'DOD', 'W1', 'W2', 'W3', 'W4', 'WOW', 'M1', 'M2', 'M3', 'MOM']
            this.loading = false
            this.$message({
              message: '数据正在更新，请稍候',
              type: 'warning'
            })
          }
        }).catch(() => {
          this.fundData = []
          this.labels = ['指标名称', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'DOD', 'W1', 'W2', 'W3', 'W4', 'WOW', 'M1', 'M2', 'M3', 'MOM']
          this.loading = false
          this.$message({
            message: '数据正在更新，请稍候',
            type: 'warning'
          })
        })
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
        this.dHeight = docH - 90
      }
    },
    updated () {
      if (document.getElementsByClassName('el-table__row').length > 0) {
        let header = document.getElementsByClassName('el-table__header')[0]
        let clientWidth = document.documentElement.clientWidth
        let pops = [8, 13, 17]
        for (let i = 0; i < pops.length; i++) {
          header.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[pops[i]].style.position = 'relative'
          header.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[pops[i]].insertAdjacentHTML('beforeEnd', '<i class="elextra-icon-info"></i>')
        }
        let popName = [document.getElementsByClassName('pop1')[0], document.getElementsByClassName('pop2')[0],
          document.getElementsByClassName('pop3')[0]]
        for (let i = 0; i < pops.length; i++) {
          let j = pops[i]
          header.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[j].getElementsByTagName('i')[0].addEventListener('mouseover', function (event) {
            let x = clientWidth - event.clientX + 20
            let y = event.clientY - 50
            popName[i].style.display = 'block'
            popName[i].style.top = y + 'px'
            popName[i].style.right = x + 'px'
          })
          header.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[j].getElementsByTagName('i')[0].addEventListener('mouseout', function () {
            popName[i].style.display = 'none'
          })
        }
        let iconIndex = this.iconIndex
        let backcolor1 = this.backcolor1
        let backcolor2 = this.backcolor2
        let diff = this.diff
        let tableRows = document.getElementsByClassName('el-table__row')

        for (let i = 0; i < iconIndex.length; i++) {
          let ind = iconIndex[i]
          tableRows[ind].getElementsByTagName('td')[0].getElementsByTagName('div')[0].insertAdjacentHTML('beforeEnd', '<i class="el-submenu__icon-arrow el-icon-arrow-down"></i>')
        }
        for (let i of backcolor1) {
          tableRows[i].getElementsByTagName('td')[0].style.backgroundColor = '#93c2d2'
        }
        for (let i of backcolor2) {
          tableRows[i].getElementsByTagName('td')[0].style.backgroundColor = '#d0ecf5'
        }
        for (let i = 0; i < iconIndex.length; i++) {
          let index = Number(iconIndex[i])
          let diffI = Number(diff[i]) + index
          let icons = document.getElementsByClassName('el-submenu__icon-arrow')
          let length = document.getElementsByClassName('el-table__row').length
          for (let j = 0; j < length; j++) {
            if (j > index && j <= diffI) {
              tableRows[j].style.display = 'none'
            }
          }
          tableRows[index].onclick = function () {
            if (!tableRows[index].classList.contains('isOpen')) {
              for (let n = 0; n < length; n++) {
                if (n > index && n <= diffI) {
                  tableRows[n].style.display = 'table-row'
                }
              }
              tableRows[index].classList.add('isOpen')
              icons[i].classList.remove('el-icon-arrow-down')
              icons[i].classList.add('el-icon-arrow-up')
            } else {
              tableRows[index].classList.remove('isOpen')
              for (let m = 0; m < length; m++) {
                if (m > index && m <= diffI) {
                  tableRows[m].style.display = 'none'
                }
              }
              icons[i].classList.remove('el-icon-arrow-up')
              icons[i].classList.add('el-icon-arrow-down')
            }
          }
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .loanThroughRateAll
    .date-filter
      padding: 15px 0 15px 1px
      box-sizing border-box
      height 60px
      .managerFront
        padding-left: 5px
        font-size: 14px
        color: #666
      .loanThroughRateAllSelect
        width: 100px
    .bar
      position: fixed
      top: 130px
      right: -30px
      box-sizing: border-box
      padding-right: 10px
      width: 60px
      height: 30px
      line-height: 30px
      background-color: #13CE66
      border-radius: 50px 0 0 50px
      font-size: 16px
      color: #666
      font-family: 'STLiti'
      text-align: right
      z-index: 100
      transition: all ease .2s
      &:hover
        right: 0
        background-color :#20a0ff
        color: #ffffff
        transform :scale(1.1)
      .el-icon-arrow-left
        margin-right: 5px
        color: #ffffff
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
    .el-table
      tbody
        tr
          td
            position: static
            .cell
              position: relative

    .popTop
      padding-bottom: 5px

    .elextra-icon-info
      position: absolute
      top: 18px
      right: -7px
      font-size: 16px
      color: rgb(102, 102, 102)
      font-weight: 400 !important

</style>
