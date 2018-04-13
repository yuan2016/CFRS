<template>
  <div class="raiseQuotaRecord" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">用户ID：</span>
        <el-input type="text" size="mini" placeholder="请输入内容" class="managerText" v-model.trim="user_id"></el-input>
      </li>
      <li>
        <span class="managerFront">姓名：</span>
        <el-input type="text" size="mini" placeholder="请输入内容" class="managerText" v-model.trim="realname"></el-input>
      </li>
      <li>
        <span class="managerFront">手机号：</span>
        <el-input type="text" size="mini" placeholder="请输入内容" class="managerText" v-model.trim="user_phone"></el-input>
        <el-button type="primary" size="mini" class="searchButton" @click.prevent.stop="search">搜索</el-button>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe
              style="width: 100%;overflow: auto;" :height="height" class="raiseQuotaRecord-table" @sort-change="sort">
      <el-table-column property="user_id" fixed label="用户ID" width="70"></el-table-column>
      <el-table-column property="realname" label="姓名" width="70"></el-table-column>
      <el-table-column property="user_phone" label="手机号" width="100"></el-table-column>
      <el-table-column property="new_amount_max" label="提额后总额度(元)" width="130"></el-table-column>
      <el-table-column property="add_amount" label="本次提升额度(元)" width="120"></el-table-column>
      <el-table-column property="repayment_succ_count" label="成功还款次数" width="100"></el-table-column>
      <el-table-column property="repayment_norm_count" label="正常还款次数" width="100"></el-table-column>
      <el-table-column property="repayment_succ_amount" label="成功还款金额(元)" width="120"></el-table-column>
      <el-table-column property="repayment_norm_amount" label="正常还款金额(元)" width="120"></el-table-column>
      <el-table-column property="last_apply_at" sortable="custom" label="上次提额时间" width="140"></el-table-column>
      <el-table-column property="create_at" sortable="custom" label="创建时间" width="140"></el-table-column>
      <el-table-column property="updated_at" sortable="custom" label="更新时间" width="140"></el-table-column>
      <el-table-column property="status" label="状态"></el-table-column>
      <el-table-column property="audit_user" label="操作人"></el-table-column>
      <el-table-column property="remark" label="备注" width="230px"></el-table-column>
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
  import {getRaiseQuotaRecord, getRaiseQuotaRecordCount} from '../../../../common/js/api'

  export default {
    data() {
      return {
        user_id: '',
        realname: '',
        user_phone: '',
        fundData: [],
        loading: false,
        isShowPage: false,
        pageContent: 'sizes',
        currentRow: null,
        offset: 0,
        limit: 20,
        count: 0,
        currentPage: 1,
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
        getRaiseQuotaRecord({
          user_id: [this.user_id, 'INPUT'],
          realname: [this.realname, 'INPUT'],
          user_phone: [this.user_phone, 'INPUT'],
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
        return getRaiseQuotaRecord({
          user_id: [this.user_id, 'INPUT'],
          realname: [this.realname, 'INPUT'],
          user_phone: [this.user_phone, 'INPUT'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        })
      },
      getCount() {
        return getRaiseQuotaRecordCount({
          user_id: [this.user_id, 'INPUT'],
          realname: [this.realname, 'INPUT'],
          user_phone: [this.user_phone, 'INPUT']
        })
      },
      search() {
        this.loading = true
        this.pageContent = ''
        if (this.user_id === '' && this.realname === '' && this.user_phone === '') {
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
  .raiseQuotaRecord
    height: 100%
    .date-filter
      li
        .managerText
          width: 165px

  @media (max-width: 645px)
    .raiseQuotaRecord
      .date-filter
        li
          .managerFront
            width: 60PX

</style>
