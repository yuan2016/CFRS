<template>
  <div class="discountCoupon" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <ul class="date-filter">
      <li>
        <span class="managerFront tmf">手机号：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="user_phone"
                  @keyup.enter.native="search"></el-input>
      </li>
      <li>
        <span class="managerFront">优惠券title：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="title"
                  @keyup.enter.native="search"></el-input>
      </li>
      <li>
        <span class="managerFront mf2">优惠券有效期范围：</span>
        <el-date-picker v-model.trim="begin_date" type="date" size="mini" placeholder="从"
                        class="discountCouponTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
        <el-date-picker v-model.trim="end_date" type="date" size="mini" placeholder="到"
                        class="discountCouponTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
      </li>
      <li>
        <span class="managerFront tmf">批次号：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="batch_num"
                  @keyup.enter.native="search"></el-input>
      </li>
      <li>
        <span class="managerFront">优惠券ID：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="coupon_id"
                  @keyup.enter.native="search"></el-input>
      </li>
      <li>
        <span class="managerFront mf2">优惠券实际使用时间：</span>
        <el-date-picker v-model.trim="startTime" type="date" size="mini" placeholder="从"
                        class="discountCouponTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
        <el-date-picker v-model.trim="endTime" type="date" size="mini" placeholder="到"
                        class="discountCouponTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
      </li>


      <li>
        <span class="managerFront mf1">优惠券使用状态：</span>
        <el-select v-model.trim="status" size="mini" placeholder="不限" class="discountCouponSelect">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <span class="managerFront mf3">使用优惠券后是否成功借款：</span>
        <el-select v-model.trim="borrow_suss" size="mini" placeholder="不限" class="discountCouponTimeSelect">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <el-button type="primary" size="mini" class="searchButton" @click.prevent.stop="search">搜索</el-button>
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
      </li>
    </ul>
    <el-table stripe :data="fundData" highlight-current-row border
              :height="height" style="width:100%;overflow: auto" @sort-change="sort" class="discountCoupon-table">
      <el-table-column property="coupon_id" fixed label="优惠券ID"></el-table-column>
      <el-table-column property="batch_num" label="批次号" width="140"></el-table-column>
      <el-table-column property="user_name" label="用户名"></el-table-column>
      <el-table-column property="user_phone" label="手机号" width="110"></el-table-column>
      <el-table-column property="title" label="优惠券title" width="120"></el-table-column>
      <el-table-column property="use_condition" label="使用条件" width="150"></el-table-column>
      <el-table-column property="discount" label="优惠券面额/折扣" width="110"></el-table-column>
      <el-table-column property="status" label="优惠券使用状态" width="110"></el-table-column>
      <el-table-column property="borrow_money" label="使用优惠券申请借款金额" width="160"></el-table-column>
      <el-table-column property="borrow_suss" label="是否成功借款" width="110"></el-table-column>
      <el-table-column property="use_time" sortable="custom" label="优惠券使用时间" width="140"></el-table-column>
      <el-table-column property="add_time" sortable="custom" label="优惠券获取时间" width="140"></el-table-column>
      <el-table-column property="validity_time" label="优惠券有效期" width="170"></el-table-column>
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
  import {getDiscountCoupon, getDiscountCoupontCount} from '../../../../common/js/api'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        coupon_id: '',
        batch_num: '',
        user_name: '',
        user_phone: '',
        title: '',
        use_condition: '',
        discount: '',
        status: '',
        borrow_money: '',
        borrow_suss: '',
        use_time: '',
        add_time: '',
        validity_time: '',
        fundData: [],
        currentRow: null,
        offset: 0,
        limit: 20,
        count: 0,
        currentPage: 1,
        begin_date: '',
        end_date: '',
        startTime: '',
        endTime: '',
        isShowPage: false,
        pageContent: 'sizes',
        loading: false,
        options1: [{
          value: '',
          label: '不限'
        }, {
          value: '1',
          label: '未使用'
        }, {
          value: '2',
          label: '已使用'
        }, {
          value: '3',
          label: '已过期'
        }],
        options2: [{
          value: '',
          label: '不限'
        }, {
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }],
        height: 500,
        order: '',
        isRefreshData: false,
        isShowExcel: false
      }
    },
    components: {
      banner
    },
    computed: {
      mosaicLink() {
        return 'api/discountCoupon/excel?title="' + [this.title, 'INPUT'] + '"&coupon_id="' + [this.coupon_id, 'INPUT', 'E'] + '"&status="' + [this.status, 'SELECT'] + '"&user_phone="' + [this.user_phone, 'INPUT'] + '"&borrow_suss="' + [this.borrow_suss, 'SELECT'] + '"&batch_num="' + [this.batch_num, 'INPUT'] + '"&begin_date="' + [this.begin_date, 'DATE', 'S1'] + '"&end_date="' + [this.end_date, 'DATE', 'S2'] + '"&startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE', 'M'] + '"'
      },
      ...mapGetters([
        'permission'
      ])
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
        this.getData().then((res) => {
          if (res.data) {
            this.fundData = res.data
            this.loading = false
          } else if (res.data.code === '404') {
            this.$router.push('./404')
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
        return getDiscountCoupon({
          title: [this.title, 'INPUT'],
          coupon_id: [this.coupon_id, 'INPUT', 'E'],
          status: [this.status, 'SELECT'],
          user_phone: [this.user_phone, 'INPUT'],
          borrow_suss: [this.borrow_suss, 'SELECT'],
          begin_date: [this.begin_date, 'DATE', 'S1'],
          end_date: [this.end_date, 'DATE', 'S2'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M'],
          batch_num: [this.batch_num, 'INPUT'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        })
      },
      getCount() {
        return getDiscountCoupontCount({
          title: [this.title, 'INPUT'],
          coupon_id: [this.coupon_id, 'INPUT', 'E'],
          status: [this.status, 'SELECT'],
          user_phone: [this.user_phone, 'INPUT'],
          borrow_suss: [this.borrow_suss, 'SELECT'],
          begin_date: [this.begin_date, 'DATE', 'S1'],
          end_date: [this.end_date, 'DATE', 'S2'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M'],
          batch_num: [this.batch_num, 'INPUT']
        })
      },
      search() {
        this.loading = true
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
      sort(info) {
        if (info.order === 'ascending') {
          this.order = ' order by ' + info.prop + ' asc'
        } else if (info.order === 'descending') {
          this.order = ' order by ' + info.prop + ' desc'
        } else {
          this.order = ''
        }
        this.search()
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
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .discountCoupon
    height: 100%
    .date-filter
      li
        .managerText
          width: 155px
        .discountCouponSelect
          width: 120px
        .discountCouponTimeSelect
          width: 155px
        .discountCouponTimeSelect2
          width: 90px

  @media (min-width: 1095px)
    .discountCoupon
      .date-filter
        width: 885px

</style>
