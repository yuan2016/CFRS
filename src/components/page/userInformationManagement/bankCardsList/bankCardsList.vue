<template>
  <div class="bankCardsList" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <ul class="date-filter">
      <li>
        <span class="managerFront">借款人ID：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="user_id"></el-input>
      </li>
      <li>
        <span class="managerFront newmf">持卡人姓名：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="open_name"></el-input>
      </li>
      <li>
        <span class="managerFront phoneMF">手机号：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="phone"></el-input>
      </li>
      <li>
        <span class="managerFront newmf">银行卡号：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="card_no"></el-input>
      </li>
      <li>
        <span class="managerFront addt">添加时间：</span>
        <el-date-picker v-model.trim="startTime" type="date" size="mini" placeholder="从"
                        class="userListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
        <el-date-picker v-model.trim="endTime" type="date" size="mini" placeholder="到"
                        class="userListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
      </li>
      <li>
        <span class="managerFront sta">状态：</span>
        <el-select v-model.trim="status" size="mini" placeholder="不限" class="userListSelect">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" class="searchButton" @click.prevent.stop="search">搜索</el-button>
      </li>
    </ul>
    <el-table :data="fundData" highlight-current-row border stripe :height="height" style="width: 100%;overflow: auto"
              class="bankCardsList-table" @sort-change="sort">
      <el-table-column property="id" fixed label="ID" width="80"></el-table-column>
      <el-table-column property="user_id" label="借款人ID" width="80"></el-table-column>
      <el-table-column property="open_name" label="持卡人姓名" min-width="90"></el-table-column>
      <el-table-column property="phone" label="手机号" min-width="100"></el-table-column>
      <el-table-column property="bank_name" label="银行名称" min-width="100"></el-table-column>
      <el-table-column property="card_no" label="银行卡号" width="150"></el-table-column>
      <el-table-column property="main_card" label="是否主卡" width="80"></el-table-column>
      <el-table-column property="type" label="卡片类型"></el-table-column>
      <el-table-column property="card_status" label="状态"></el-table-column>
      <el-table-column property="create_time" sortable="custom" label="添加时间" width="140"></el-table-column>
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
  import {getBankCardsList, getBankCardsListCount} from '../../../../common/js/api'

  export default {
    data() {
      return {
        user_id: '',
        open_name: '',
        phone: '',
        card_no: '',
        status: '',
        startTime: '',
        endTime: '',
        isShowPage: false,
        pageContent: 'sizes',
        loading: false,
        fundData: [],
        currentRow: null,
        offset: 0,
        limit: 20,
        count: 0,
        currentPage: 1,
        options: [{
          value: '',
          label: '不限'
        }, {
          value: '1',
          label: '生效'
        }, {
          value: '0',
          label: '无效'
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
        return getBankCardsList({
          user_id: [this.user_id, 'INPUT'],
          open_name: [this.open_name, 'INPUT'],
          phone: [this.phone, 'INPUT'],
          card_no: [this.card_no, 'INPUT'],
          status: [this.status, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        })
      },
      getCount() {
        return getBankCardsListCount({
          user_id: [this.user_id, 'INPUT'],
          open_name: [this.open_name, 'INPUT'],
          phone: [this.phone, 'INPUT'],
          card_no: [this.card_no, 'INPUT'],
          status: [this.status, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE', 'M'],
          limit: this.limit,
          offset: this.offset
        })
      },
      search() {
        this.loading = true
        this.pageContent = ''
        if (this.user_id === '' && this.open_name === '' && this.phone === '' && this.card_no === '' && this.status === '' && this.startTime === '' && this.endTime === '') {
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
  .bankCardsList
    height: 100%
    .date-filter
      li
        .managerText
          width: 165px
        .userListTimeSelect
          width: 165px
        .userListSelect
          width: 80px

  @media (min-width: 912px) and (max-width: 1144px)
    .bankCardsList
      .date-filter
        li
          .addt
            width: 72px

  @media (max-width:911px )
    .bankCardsList
      .date-filter
        li
          .managerFront
            width: 60px
          .newmf
            width: 72px
          .sta
            width: 36px

  @media (max-width:816px )
    .bankCardsList
      .date-filter
        li
          .sta
            width: 60px

  @media (min-width: 912px) and (max-width: 1051px)
    .bankCardsList
      .date-filter
        li
          .sta
            width: 60px

  @media (max-width:700px )
    .bankCardsList
      .date-filter
        li
          .managerFront
            width: 72px

</style>
