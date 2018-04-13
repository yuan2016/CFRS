<template>
  <div class="userList" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <ul class="date-filter">
      <li>
        <span class="managerFront">证件号码：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="id_number"
                  @keyup.enter.native="search"></el-input>
      </li>
      <li>
        <span class="managerFront">用户ID：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="id"
                  @keyup.enter.native="search"></el-input>
      </li>
      <li>
        <span class="managerFront">姓名：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="realname"
                  @keyup.enter.native="search"></el-input>
      </li>
      <li>
        <span class="managerFront isBlackList">是否黑名单：</span>
        <el-select v-model.trim="status" size="mini" placeholder="不限" class="userListSelect"
                   @keyup.enter.native="search">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <span class="managerFront">联系方式：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="user_phone"
                  @keyup.enter.native="search"></el-input>
      </li>
      <li class="timeHorizon">
        <span class="managerFront">创建时间：</span>
        <el-date-picker v-model.trim="startTime" type="date" size="mini" placeholder="从"
                        class="userListTimeSelect" value-format="yyyy-MM-dd" @keyup.enter.native="search"></el-date-picker>
        <el-date-picker v-model.trim="endTime" type="date" size="mini" placeholder="到"
                        class="userListTimeSelect" value-format="yyyy-MM-dd" @keyup.enter.native="search"></el-date-picker>
      </li>

      <li>
        <el-button type="primary" size="mini" class="searchButton" @click.prevent.stop="search">搜索</el-button>
      </li>
    </ul>
    <el-table stripe :data="fundData" highlight-current-row border
              :height="height" style="width:100%;overflow: auto" @sort-change="sort" class="userList-table">
      <el-table-column property="id" label="用户ID"></el-table-column>
      <el-table-column property="realname" label="姓名"></el-table-column>
      <el-table-column property="company_name" label="公司名称"></el-table-column>
      <el-table-column property="user_phone" label="联系方式" min-width="100"></el-table-column>
      <el-table-column property="id_number" label="证件号码" min-width="150"></el-table-column>
      <el-table-column property="birthday" sortable="custom" label="生日" min-width="100"></el-table-column>
      <el-table-column property="user_sex" label="性别" width="100"></el-table-column>
      <el-table-column property="status" label="是否黑名单" min-width="100"></el-table-column>
      <el-table-column property="create_time" sortable="custom" label="创建时间" min-width="140"></el-table-column>
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
  import {getUserList, getUserListCount} from '../../../../common/js/api'

  export default {
    data() {
      return {
        id: '',
        realname: '',
        id_number: '',
        user_phone: '',
        status: '',
        fundData: [],
        currentRow: null,
        offset: 0,
        limit: 20,
        count: 0,
        currentPage: 1,
        startTime: '',
        endTime: '',
        isShowPage: false,
        pageContent: 'sizes',
        loading: false,
        options: [{
          value: '',
          label: '不限'
        }, {
          value: '2',
          label: '是'
        }, {
          value: '1',
          label: '否'
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
        getUserList({
          id: [this.id, 'INPUT'],
          realname: [this.realname, 'INPUT'],
          id_number: [this.id_number, 'INPUT'],
          user_phone: [this.user_phone, 'INPUT'],
          status: [this.status, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        }).then((res) => {
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
        return getUserList({
          id: [this.id, 'INPUT'],
          realname: [this.realname, 'INPUT'],
          id_number: [this.id_number, 'INPUT'],
          user_phone: [this.user_phone, 'INPUT'],
          status: [this.status, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        })
      },
      getCount() {
        return getUserListCount({
          id: [this.id, 'INPUT'],
          realname: [this.realname, 'INPUT'],
          id_number: [this.id_number, 'INPUT'],
          user_phone: [this.user_phone, 'INPUT'],
          status: [this.status, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M']
        })
      },
      search() {
        this.loading = true
        this.pageContent = ''
        if (this.id === '' && this.realname === '' && this.id_number === '' && this.user_phone === '' && this.status === '' && this.startTime === '' && this.endTime === '') {
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
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .userList
    height: 100%
    .date-filter
      li
        .managerText
          width: 155px
        .userListTimeSelect
          width: 155px
        .userListSelect
          width: 80px
        &.timeHorizon
          white-space: normal

  @media (max-width: 851px)
    .userList
      .date-filter
        li
          display: block
          .managerFront
            width: 72px

</style>
