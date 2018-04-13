<template>
  <div class="userAuthenticationList" v-loading.body="loading" element-loading-text="拼命加载中"
  >
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">用户ID：</span>
        <el-input type="text" size="mini" placeholder="请输入内容" class="managerText" v-model.trim="user_id"></el-input>
      </li>
      <li>
        <span class="managerFront">用户姓名：</span>
        <el-input type="text" size="mini" placeholder="请输入内容" class="managerText" v-model.trim="realname"></el-input>
      </li>
      <li>
        <span class="managerFront">手机号：</span>
        <el-input type="text" size="mini" placeholder="请输入内容" class="managerText" v-model.trim="user_phone"></el-input>
        <el-button type="primary" size="mini" class="searchButton" @click.prevent.stop="search">搜索</el-button>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe
              style="width: 100%;overflow: auto" :height="height" class="userAuthenticationList-table">
      <el-table-column property="user_id" fixed label="用户ID"></el-table-column>
      <el-table-column property="realname" label="用户姓名"></el-table-column>
      <el-table-column property="user_phone" label="手机号" width="120"></el-table-column>
      <el-table-column property="auth_pay_password" label="支付密码"></el-table-column>
      <el-table-column property="auth_id_number" label="身份认证"></el-table-column>
      <el-table-column property="auth_company" label="工作信息"></el-table-column>
      <el-table-column property="auth_contact" label="紧急联系人" width="100"></el-table-column>
      <el-table-column property="auth_card" label="银行卡"></el-table-column>
      <el-table-column property="auth_zm" label="芝麻信用"></el-table-column>
      <el-table-column property="auth_jxl" label="聚信立"></el-table-column>
      <el-table-column property="auth_more" label="认证更多"></el-table-column>
      <el-table-column property="auth_zfb" label="支付宝"></el-table-column>
      <el-table-column property="auth_taobao" label="淘宝"></el-table-column>
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
  import {getHeight} from '../../../../common/js/storage'
  import {getUserAuthenticationList, getUserAuthenticationListCount} from '../../../../common/js/api'

  export default {
    data() {
      return {
        user_id: '',
        realname: '',
        user_phone: '',
        fundData: [],
        loading: false,
        currentRow: null,
        isShowPage: false,
        pageContent: 'sizes',
        offset: 0,
        limit: 20,
        count: 0,
        currentPage: 1,
        height: 500
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
        getUserAuthenticationList({
          id: [this.id, 'INPUT'],
          realname: [this.realname, 'INPUT'],
          user_name: [this.user_name, 'INPUT'],
          limit: this.limit,
          offset: this.offset
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
        /*this.axios.all([this.getCount(), this.getData()])
          .then(this.axios.spread((acct, perms) => {
            console.log(acct)
            console.log(perms)
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
        })*/
      },
      getData() {
        return getUserAuthenticationList({
          id: [this.id, 'INPUT'],
          realname: [this.realname, 'INPUT'],
          user_name: [this.user_name, 'INPUT'],
          limit: this.limit,
          offset: this.offset
        })
      },
      getCount() {
        return getUserAuthenticationListCount({
          id: [this.id, 'INPUT'],
          realname: [this.realname, 'INPUT'],
          user_name: [this.user_name, 'INPUT']
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
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .userAuthenticationList
    height: 100%
    .date-filter
      padding: 15px 0 15px 1px
      box-sizing border-box
      display: flex
      flex-wrap: wrap
      li
        margin-bottom: 5px
        .managerFront
          display: inline-block
          padding-left: 5px
          font-size: 12px
          color: #666
        .managerText
          width: 165px
        .searchButton
          margin-left: 10px

  @media (max-width: 665px)
    .userAuthenticationList
      .date-filter
        li
          .managerFront
            width: 60px

/*  @media (max-width: 725px)
    .userAuthenticationList
      .date-filter
        li
          .managerFront
            display: inline-block
            width: 70px

  @media (max-width: 378px)
    .userAuthenticationList
      .date-filter
        li
          .userButton
            margin-left: 78px
            margin-top: 5px*/
</style>
