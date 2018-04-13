<template>
  <div class="userAddressBook" v-loading.body="loading" element-loading-text="拼命加载中"
  >
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">用户ID：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="user_id"></el-input>
      </li>
      <li>
        <span class="managerFront">联系人手机：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText"
                  v-model.trim="contact_phone"></el-input>
      </li>
      <li>
        <span class="managerFront">联系人：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText"
                  v-model.trim="contact_name"></el-input>
      </li>
      <li>
        <el-button type="primary" size="mini" class="searchButton" @click.prevent.stop="search">搜索</el-button>
      </li>
    </div>
    <el-table class="userAddressBook-table" :data="fundData" stripe
              highlight-current-row border :height="height" style="width: 100%;overflow: auto" @sort-change="sort">
      <el-table-column property="id" label="ID"></el-table-column>
      <el-table-column property="user_id" label="用户ID"></el-table-column>
      <el-table-column property="user_name" label="用户姓名/手机" min-width="120"></el-table-column>
      <el-table-column property="contact_name" label="联系人"></el-table-column>
      <el-table-column property="contact_phone" label="联系人手机" min-width="100"></el-table-column>
      <el-table-column property="create_time" sortable="custom" label="上传时间" min-width="140"></el-table-column>
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
  import {getUserAddressBook, getUserAddressBookCount} from '../../../../common/js/api'

  export default {
    data() {
      return {
        user_id: '',
        contact_phone: '',
        contact_name: '',
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
        getUserAddressBook({
          user_id: [this.user_id, 'INPUT'],
          contact_phone: [this.contact_phone, 'INPUT'],
          contact_name: [this.contact_name, 'INPUT'],
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
        /*this.axios.all([this.getCount(), this.getData()])
          .then(this.axios.spread((acct, perms) => {
            if (perms.data.code === '404' || acct.data.code === '404') {
              this.$router.push('./404')
            } else if (perms.data.code === '1024' || acct.data.code === '1024') {
              this.fundData = []
              this.loading = false
              this.$message({message: '请求超时，请增加搜索条件以便搜索', type: 'warning'})
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
          }
        )*/
      },
      getData() {
        return getUserAddressBook({
          user_id: [this.user_id, 'INPUT'],
          contact_phone: [this.contact_phone, 'INPUT'],
          contact_name: [this.contact_name, 'INPUT'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        })
      },
      getCount() {
        return getUserAddressBookCount({
          user_id: [this.user_id, 'INPUT'],
          contact_phone: [this.contact_phone, 'INPUT'],
          contact_name: [this.contact_name, 'INPUT'],
          limit: this.limit,
          offset: this.offset
        })
      },
      search() {
        this.loading = true
        this.pageContent = ''
        if (this.user_id === '' && this.contact_phone === '' && this.contact_name === '') {
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
                this.$message({message: '请求超时，请增加搜索条件以便搜索', type: 'warning'})
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
            }
          )
        }
      },
      resizeHeight() {
        this.setHeight()
        window.onresize = this.setHeight
      },
      setHeight() {
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
  .userAddressBook
    height: 100%
    .date-filter
      li
        .managerText
          width: 155px
        .searchButton
          margin-left: 10px

  @media (min-width: 662px) and (max-width: 946px)
    .userAddressBook
      .date-filter
        width: 452px

  @media (max-width: 661px)
    .userAddressBook
      .date-filter
        li
          .managerFront
            width: 72px


</style>
