<template>
  <div class="assetInformation" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <ul class="date-filter">
      <li>
        <span class="managerFront mfname">姓名：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="realname"></el-input>
      </li>
      <li>
        <span class="managerFront mfphone">手机号：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="user_phone"></el-input>
      </li>
      <li>
        <span class="managerFront">放款时间：</span>
        <el-date-picker v-model.trim="startTime" type="date" size="mini" placeholder="从"
                        class="assetInformationTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
        <el-date-picker v-model.trim="endTime" type="date" size="mini" placeholder="到"
                        class="assetInformationTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
      </li>
      <li>
        <span class="managerFront">状态：</span>
        <el-select v-model.trim="status" size="mini" placeholder="不限" class="assetInfoSelect">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <span class="managerFront">资产所属：</span>
        <el-select v-model.trim="assets_owned" size="mini" disabled placeholder="招财猫" class="assetInfoSelect">
        </el-select>
      </li>
      <li>
        <span class="managerFront">资产类别：</span>
        <el-select v-model.trim="credit_lv" size="mini" placeholder="不限" class="assetInfoSelectLong">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" class="searchButton" @click.prevent.stop="search">搜索</el-button>
      </li>
    </ul>
    <el-table stripe :data="fundData" highlight-current-row border style="width: 100%;overflow:auto;" :height="height"
              @sort-change="sort">
      <el-table-column property="asset_order_id" label="订单号" min-width="150"
                       class="assetInformation-table"></el-table-column>
      <el-table-column property="realname" label="姓名"></el-table-column>
      <el-table-column property="user_phone" label="手机号" min-width="100"></el-table-column>
      <el-table-column property="customer_type" label="用户类型"></el-table-column>
      <el-table-column property="money_amount" label="借款金额(元)" min-width="100"></el-table-column>
      <el-table-column property="loan_term" label="借款期限" min-width="100"></el-table-column>
      <el-table-column property="apr" label="服务费利率(万分之一)" min-width="150"></el-table-column>
      <el-table-column property="loan_interests" label="服务费(元)"></el-table-column>
      <el-table-column property="order_time" sortable="custom" label="下单时间" min-width="140"></el-table-column>
      <el-table-column property="loan_time" sortable="custom" label="放款时间" min-width="140"></el-table-column>
      <el-table-column property="updated_at" sortable="custom" label="更新时间" min-width="140"></el-table-column>
      <el-table-column property="assets_owned" label="资产所属"></el-table-column>
      <el-table-column property="credit_lv" label="资产类别"></el-table-column>
      <el-table-column property="status" label="状态"></el-table-column>
      <el-table-column property="pay_remark" label="备注" min-width="100"></el-table-column>

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
  import banner from '../../../common/banner/banner'
  import {getNowFormatDate, formatDate} from '../../../../common/js/utils'
  import {getAssetInformation, getAssetInformationCount} from '../../../../common/js/api'

  export default {
    data() {
      return {
        realname: '',
        user_phone: '',
        assets_owned: '招财猫',
        credit_lv: '',
        fundData: [],
        loading: false,
        isShowPage: false,
        pageContent: 'sizes',
        currentRow: null,
        offset: 0,
        limit: 20,
        count: 0,
        currentPage: 1,
        startTime: '',
        endTime: '',
        status: '',
        options1: [{
          value: '',
          label: '不限'
        }, {
          value: '0',
          label: '待推送'
        }, {
          value: '1',
          label: '推送中'
        }, {
          value: '2',
          label: '推送成功'
        }, {
          value: '3',
          label: '推送失败'
        }],
        options2: [{
          value: '',
          label: '不限'
        }, {
          value: '0',
          label: '未知'
        }, {
          value: '1',
          label: 'A类'
        }, {
          value: '2',
          label: 'B类'
        }, {
          value: '3',
          label: 'C类'
        }],
        height: 500,
        order: ''
      }
    },
    components: {
      banner
    },
    created() {
      this.loading = true
      this.getDataInit()
    },
    mounted() {
      this.resizeHeight()
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
        getAssetInformation({
          realname: [this.realname, 'INPUT'],
          user_phone: [this.user_phone, 'INPUT'],
          status: [this.status, 'SELECT'],
          credit_lv: [this.credit_lv, 'INPUT', 'NONE'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        }).then((res) => {
          if (res.data) {
            this.fundData = res.data
            this.loading = false
          } else {
            this.fundData = []
            this.loading = false
            this.$message({
              message: '数据正在更新，请稍候',
              type: 'warning'
            })
          }
        }).catch(() => {
          this.fundData = []
          this.loading = false
          this.$message({
            message: '数据正在更新，请稍候',
            type: 'warning'
          })
        })
      },
      getData() {
        return getAssetInformation({
          realname: [this.realname, 'INPUT'],
          user_phone: [this.user_phone, 'INPUT'],
          status: [this.status, 'SELECT'],
          credit_lv: [this.credit_lv, 'INPUT', 'NONE'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        })
      },
      getCount() {
        return getAssetInformationCount({
          realname: [this.realname, 'INPUT'],
          user_phone: [this.user_phone, 'INPUT'],
          status: [this.status, 'SELECT'],
          credit_lv: [this.credit_lv, 'INPUT', 'NONE'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M']
        })
      },
      search() {
        this.loading = true
        this.pageContent = ''
        if (this.realname === '' && this.credit_lv === '' && this.user_phone === '' && this.status === '' && this.startTime === '' && this.endTime === '') {
          this.isShowPage = false
          this.pageContent = 'sizes'
          this.getDataInit()
        } else {
          this.isShowPage = true
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
        }
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
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .assetInformation
    height: 100%
    .date-filter
      li
        .managerText
          width: 160px
        .assetInfoSelect
          width: 160px
        .assetInfoSelectLong
          width: 160px
        .assetInformationTimeSelect
          width: 160px

  @media (max-width: 1771px)
    .assetInformation
      .date-filter
        li
          .mfname
            width: 60px

  @media (max-width: 1493px)
    .assetInformation
      .date-filter
        li
          .mfphone
            width: 60px

  @media (max-width: 1273px)
    .assetInformation
      .date-filter
        max-width: 833px
        li
          .mfname
            width: 36px

  @media (max-width: 1042px)
    .assetInformation
      .date-filter
        li
          display: block
          .managerFront
            width: 60px

</style>
