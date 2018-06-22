<template>
  <div class="invitationEvent" v-loading.body="loading" element-loading-text="拼命加载中"
       >
    <banner></banner>
    <el-table :data="fundData" highlight-current-row border
              style="width: 100%;overflow: auto;" :height="height" class="invitationEvent-table">
      <el-table-column property="AA" :label="labels[0]" width="180"></el-table-column>
      <el-table-column property="D1" :label="labels[1]" width="110"></el-table-column>
      <el-table-column property="D2" :label="labels[2]" width="110"></el-table-column>
      <el-table-column property="D3" :label="labels[3]" width="110"></el-table-column>
      <el-table-column property="D4" :label="labels[4]" width="110"></el-table-column>
      <el-table-column property="D5" :label="labels[5]" width="110"></el-table-column>
      <el-table-column property="D6" :label="labels[6]" width="110"></el-table-column>
      <el-table-column property="D7" :label="labels[7]" width="110"></el-table-column>
      <el-table-column property="DOD" :label="labels[8]" width="110"></el-table-column>
      <el-table-column property="W1" :label="labels[9]" width="110"></el-table-column>
      <el-table-column property="W2" :label="labels[10]" width="110"></el-table-column>
      <el-table-column property="W3" :label="labels[11]" width="110"></el-table-column>
      <el-table-column property="W4" :label="labels[12]" width="110"></el-table-column>
      <el-table-column property="WOW" :label="labels[13]" width="110"></el-table-column>
      <el-table-column property="M1" :label="labels[14]" width="110"></el-table-column>
      <el-table-column property="M2" :label="labels[15]" width="110"></el-table-column>
      <el-table-column property="M3" :label="labels[16]" width="110"></el-table-column>
      <el-table-column property="MOM" :label="labels[17]" width="110"></el-table-column>
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
  import { getInvitationEvent } from '../../../../../common/js/api'

  const defaultBlank = ['指标名称', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'DOD', 'W1', 'W2', 'W3', 'W4', 'WOW', 'M1', 'M2', 'M3', 'MOM']

  export default {
    data () {
      return {
        labels: [],
        fundData: [],
        loading: false,
        height: 500,
        backcolor1: []
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
      getData () {
        getInvitationEvent().then((res) => {
          if (res.data) {
            this.fundData = res.data.slice(2)
            this.backcolor1 = res.data[0].D1.split(',')
            if (this.fundData.length === 0) {
              this.labels = defaultBlank
              this.loading = false
            } else {
              this.labels = getProperty(res.data[1])
              this.loading = false
            }
          } else {
            this.fundData = []
            this.labels = defaultBlank
            this.loading = false
            this.$message({
              message: '数据正在更新，请稍候',
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
        // this.loading = true
        // this.getData()
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
        this.height = docH - filterH - bannerH - pageH - 97
      }
    },
    updated () {
      if (document.getElementsByClassName('el-table__row').length > 0) {
        let header = document.getElementsByClassName('el-table__header')[0]
        let backcolor1 = this.backcolor1
        let pops = [8, 13, 17]
        for (let i = 0; i < pops.length; i++) {
          let j = pops[i]
          header.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[j].style.position = 'relative'
          header.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[j].insertAdjacentHTML('beforeEnd', '<i class="elextra-icon-info"></i>')
        }
        let popName = [document.getElementsByClassName('pop1')[0], document.getElementsByClassName('pop2')[0],
          document.getElementsByClassName('pop3')[0]]
        let clientWidth = document.documentElement.clientWidth
        for (let i = 0; i < pops.length; i++) {
          let j = pops[i]
          header.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[j].getElementsByTagName('i')[0].addEventListener('mouseover', function (event) {
            let x = clientWidth - event.clientX + 20
            let y = event.clientY - 30
            popName[i].style.display = 'block'
            popName[i].style.top = y + 'px'
            popName[i].style.right = x + 'px'
          })
          header.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[j].getElementsByTagName('i')[0].addEventListener('mouseout', function () {
            popName[i].style.display = 'none'
          })
        }
        for (let i of backcolor1) {
          document.getElementsByClassName('el-table__row')[i].getElementsByTagName('td')[0].style.backgroundColor = '#93c2d2'
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .invitationEvent
    .invitationEvent-table
      margin-top: 20px
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
      position: absolute
      top: 15px
      right: 7px
      font-size: 16px
      color: rgb(102, 102, 102)
      font-weight: 400 !important

</style>
