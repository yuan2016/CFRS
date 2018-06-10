<template>
  <div class="phantoscope" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">渠道名称：</span>
        <el-select v-model.trim="channel_name" size="mini" placeholder="不限" class="phantoscopeSelect">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <span class="managerFront">日期：</span>
        <el-date-picker v-model.trim="startTime" type="date" size="mini" placeholder="从"
                        class="userListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
        <el-date-picker v-model.trim="endTime" type="date" size="mini" placeholder="到"
                        class="userListTimeSelect" value-format="yyyy-MM-dd"></el-date-picker>
      </li>
      <li>
        <el-button type="primary" size="mini" class="searchButton" @click.prevent.stop="search">搜索</el-button>
        <!--<el-button type="primary" size="mini" v-if='isRefreshData' :loading="buttonLoading"-->
        <!--@click.prevent.stop="refreshData" class="refreshButton">一键刷新-->
        <!--</el-button>-->
        <a :href="mosaicLink" v-if='isShowExcel' class="excelButton">导出excel</a>
        <el-button type="primary" size="mini" class="searchButton" @click.prevent.stop="showData">编辑</el-button>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe style="width: 100%;overflow: auto" :height="height"
              class="promotionChannelStatistics-table" @sort-change="sort" @row-dblclick="showData">
      <el-table-column property="d_date" fixed sortable="custom" label="日期" min-width="160"></el-table-column>
      <el-table-column property="channel_name" label="渠道名称"></el-table-column>
      <el-table-column property="day_consumption" sortable="custom" label="当日消耗(元)" min-width="120"></el-table-column>
      <el-table-column property="login_num" sortable="custom" label="登录人数" min-width="110"></el-table-column>
      <el-table-column property="register_num" sortable="custom" label="注册数" min-width="100"></el-table-column>
      <el-table-column property="user_device_num" sortable="custom" label="注册设备数"  min-width="120"></el-table-column>
      <el-table-column property="recharge_user_num" sortable="custom" label="每日充值用户人数" min-width="150"></el-table-column>
      <el-table-column property="recharge_drnum" sortable="custom" label="注册新用户当日充值人数" min-width="180"></el-table-column>
      <el-table-column property="recharge_user_rate" sortable="custom" label="充值用户转化率" min-width="130"></el-table-column>
      <el-table-column property="new_recharge_rate" sortable="custom" label="新用户当日充值率" min-width="150"></el-table-column>
      <el-table-column property="recharge_money" sortable="custom" label="充值总金额(元)" min-width="130"></el-table-column>
      <el-table-column property="avg_recharge_money" sortable="custom" label="平均用户充值金额(元)" min-width="170"></el-table-column>
      <el-table-column property="recharge_dramt" sortable="custom" label="注册新用户当日充值金额(元)" min-width="200"></el-table-column>
      <el-table-column property="register_recharge_rate" sortable="custom" label="当日注册用户充值金额占比" min-width="190"></el-table-column>
      <el-table-column property="payuser_cost" sortable="custom" label="付费用户成本(元)" min-width="140"></el-table-column>
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
    <transition name="fade">
      <div class="detail" v-show="isShowDetail">
        <div class="detail-wrapper">
          <div class="detial-main">
            <el-form :label-position="labelPosition" label-width="120px" :rules="loginRules" :model="formLabelAlign"
                     class="phantoscope-form" ref="ruleForm">
              <div class="select-tag">
                <el-tag :key="tag" v-for="(tag, index) in itemsValues" closable :disable-transitions="false" @close="handleClose(tag, index)" color="#20a0ff">
                  {{tag}}
                </el-tag>
                <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
                  @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>  
              </div>       
              <el-table :data="fundDatas" highlight-current-row border fit stripe style="width: 100%;overflow: auto;"
              :height="120"
              class="deleteRobotInfo-table">  
                <tr v-for="(val, key) in itemsValues" :key="key">
                  <el-table-column :property="itemsIndexs[key]" :label="itemsIndexs[key]" :min-width="getWidth(val)"></el-table-column>
                </tr>
              </el-table>
              <div class="math clearfix">
                <template v-for="(item,index) in itemsValues">
                  <div :key="index+item" class="math-item">
                    <el-input :key="item" clearable size="small" class="math-input" :placeholder=item></el-input>
                  </div>
                </template>
                <el-button type="primary" size="mini" class="phantoscope-button" @click="saveData()">
                  立即修改
                </el-button>
              </div>
            </el-form>
          </div>
        </div>
        <div class="detail-close">
          <i class="el-icon-close" @click.stop.prevent="closeDetial"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import banner from '../../../../common/banner/banner'
  import {getNowFormatDate, formatDate} from '../../../../../common/js/utils'
  import {
    getPromotionChannelStatisticsQE,
    getPromotionChannelStatisticsQECount,
    getPromotionChannelStatisticsQERefresh,
    getPromotionChannelStatisticsQESUM,
    updataQEData,
    modifyParams,
    getPromotionChannelStatisticsQESelect
  } from '../../../../../common/js/api'
  import {mapState, mapGetters} from 'vuex'

  export default {
    data() {
      const validateMoney = (rule, v, callback) => {
        if (!v) {
          callback()
        } else {
          if ((v + '').indexOf(',') === -1) {
            if (!(/^(-?\d+)(\.\d+)?$/).test(v)) {
              callback(new Error('请填写正确格式'))
            } else {
              callback()
            }
          } else {
            if (!(/^(-?\d+)(\.\d+)?$/).test((v + '').split(',').join(''))) {
              callback(new Error('请填写正确格式'))
            } else {
              callback()
            }
          }
        }
      }
      return {
        dynamicTags: ['标签一', '标签二', '标签三'],
        inputVisible: false,
        inputValue: '',
        items: {
          'A': '日期',
          'B': '渠道名称',
          'C': '当日消耗',
          'D': '登录人数',
          'E': '注册数',
          'F': '注册设备数',
          'G': '每日充值用户人数',
          'H': '注册新用户当日充值人数',
          'I': '充值用户转化率',
          'J': '新用户当日充值率',
          'K': '充值总金额',
          'L': '平均用户充值金额'
        },
        itemsIndexs: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
        itemsValues: ['日期', '渠道名称', '当日消耗', '登录人数', '注册数', '注册设备数', '每日充值用户人数', '注册新用户当日充值人数', '充值用户转化率', '新用户当日充值率', '充值总金额', '平均用户充值金额'],
        fundData: [],
        fundDatas: [],
        loading: false,
        options: [],
        pageContent: 'sizes',
        currentRow: null,
        offset: 0,
        limit: 20,
        count: 0,
        currentPage: 1,
        startTime: '',
        endTime: '',
        height: 500,
        buttonLoading: false,
        order: '',
        isRefreshData: false,
        isShowExcel: false,
        isShowDetail: false,
        labelPosition: 'right',
        peopleNum: 0,
        rowDate: '',
        loginRules: {
          day_consumption: [
            {required: false, trigger: 'blur', validator: validateMoney}
          ],
          payuser_cost: [
            {required: false, trigger: 'change', validator: validateMoney}
          ]
        },
        formLabelAlign: {
          day_consumption: '',
          payuser_cost: ''
        },
        channel_name: ''
      }
    },
    components: {
      banner
    },
    created() {
      this.loading = true
      this.getDataInit()
      this.getSelectOptions()
      this.isShowRefreshAndExcel()
      this.fundDatas.push(this.items)
    },
    mounted() {
      this.resizeHeight()
    },
    computed: {
       mosaicLink() {
         if (this.startTime === this.endTime || this.startTime === formatDate(new Date(), 'yyyy-MM-dd') || (!this.startTime && !this.endTime)) {
           return 'api/phantoscope/excel?startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"&channel_name="' + [this.channel_name, 'SELECT'] + '"'
         } else {
           return 'api/phantoscope/excelSUM?startTime="' + [this.startTime, 'DATE'] + '"&endTime="' + [this.endTime, 'DATE'] + '"&channel_name="' + [this.channel_name, 'SELECT'] + '"'
         }
       },
      ...mapGetters([
        'permission'
      ]),
      ...mapState({
        name: state => state.user.name
      })
    },
    methods: {
      handleClose(tag, index) {
        this.itemsValues.splice(index, 1)
        this.itemsIndexs.splice(index, 1)
        //  let length = this.itemsIndexs.length
        //  for (let i = 0; i < length; i++){
        //    if (i >= index) {
        //      let value = String.fromCharCode(this.itemsIndexs[i].charCodeAt(0) - 1)
        //      this.$set(this.itemsIndexs, this.itemsIndexs[i], value)
        //    }
        //  }
        Object.defineProperty(this.items, tag, {enumerable: false})
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          let length = this.itemsIndexs.length
          let key = String.fromCharCode(65 + length)
          this.itemsIndexs.push(key)
          this.itemsValues.push(inputValue)
          this.items[key] = inputValue
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      //计算宽度
      getWidth(item) {
        return item.length * 12 + 40
      },
      calcultate(a) {
        if (this.peopleNum) {
          if (a.indexOf(',') !== -1) {
            a = a.split(',').join('')
          }
          this.formLabelAlign.payuser_cost = (a / this.peopleNum).toFixed(2)
        } else {
          this.$message({
            message: '程序出现错误，请刷新重试',
            type: 'warning'
          })
        }
      },
      closeDetial() {
        this.isShowDetail = !this.isShowDetail
      },
      showData(row) {
        this.isShowDetail = !this.isShowDetail
        this.peopleNum = row.recharge_user_num
        this.rowDate = row.d_date
        this.formLabelAlign.day_consumption = ''
        this.formLabelAlign.payuser_cost = ''
      },
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
      getDataSearch() {
        this.axios.all([this.getCount(), this.getDataSUM()])
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
        return getPromotionChannelStatisticsQE({
          channel_name: [this.channel_name, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE'],
          limit: this.limit,
          offset: this.offset,
          order: this.order
        })
      },
      getDataSUM() {
        return getPromotionChannelStatisticsQESUM({
          channel_name: [this.channel_name, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE']
        })
      },
      getCount() {
        return getPromotionChannelStatisticsQECount({
          channel_name: [this.channel_name, 'SELECT'],
          startTime: [this.startTime, 'DATE'],
          endTime: [this.endTime, 'DATE']
        })
      },
      search() {
        this.loading = true
        if (this.startTime === this.endTime || this.startTime === formatDate(new Date(), 'yyyy-MM-dd') || (!this.startTime && !this.endTime)) {
          /*if (!this.startTime && !this.endTime) {
            this.startTime = formatDate(new Date(), 'yyyy-MM-dd')
          }*/
          this.getDataInit()
        } else {
          this.getDataSearch()
        }
      },
      // refreshData() {
      //   this.buttonLoading = true
      //   getPromotionChannelStatisticsRefresh().then((response) => {
      //     if (response.data.code === '200') {
      //       this.getDataInit()
      //       this.buttonLoading = false
      //       this.$message({
      //         message: '推广统计(渠道)刷新完毕，请查看',
      //         type: 'success'
      //       })
      //     } else if (response.data.code === '400') {
      //       this.buttonLoading = false
      //       this.$message({
      //         message: '已经有用户在尝试刷新，请稍后刷新页面即可',
      //         type: 'warning'
      //       })
      //     } else {
      //       setTimeout(() => {
      //         this.buttonLoading = false
      //         this.$message.error('推广统计(渠道)一键刷新出现错误，请检查网络或联系管理员')
      //       }, 1000)
      //     }
      //   }).catch(() => {
      //     this.buttonLoading = false
      //     this.$message.error('推广统计(渠道)一键刷新出现错误，请检查网络或联系管理员')
      //   })
      // },
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
      },
      saveData() {
        let inputDoms = document.querySelectorAll('.math-input input')
        let inputs = []
        for (let i of inputDoms) {
          inputs.push(i.value)
        }
        modifyParams({
          inputs,
          itemsIndexs: this.itemsIndexs,
          itemsValues: this.itemsValues
        }).then((response) => {
          this.options = response.data
        })
      },
      getSelectOptions() {
        getPromotionChannelStatisticsQESelect().then((response) => {
          this.options = response.data
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .phantoscope
    height: 100%
    .date-filter
      li
        .managerText
          width: 160px
        .promotionChannelSelect, .userListTimeSelect, .phantoscopeSelect
          width: 160px
    .detail
      position: fixed
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: 1002
      overflow: auto
      background: rgba(0, 0, 0, 0.5)
      backdrop-filter: blur(10px)
      &.fade-enter-active
        transition: all .1s linear
      &.fade-leave-active
        opacity: 0
        transition: all .1s linear
      &.fade-enter
        opacity: 0
      &.fade-leave
        opacity: 1
      .detail-wrapper
        min-height: 100%
        width: 100%
        color: rgb(255, 255, 255)
        .detial-main
          position: absolute
          top: 50%
          left: 50%
          padding: 10px 10px 0 30px
          transform: translate(-50%, -50%)
          width: 700px
          height: 420px
          border-radius: 5px
          text-align: center
          background-color: #fff
          overflow-y :scroll
          .phantoscope-form
            margin: 20px 20px 20px 0
          .phantoscope-button
            width: 200px
          .select-tag
            margin-bottom: 20px
            border:1px solid #ccc
            border-radius:5px
            height: 200px
            text-align: left   
            .el-tag
              margin:2px 0 2px 5px
              color:#fff
          .math
            margin-top:20px
            position:relative
            padding-bottom:40px
            .math-item
              display:inline-block
              margin: 0 40px 10px 0
              width:180px 
              float:left
          .clearfix:after  
            display: block 
            content:'' 
            clear: both
            height:0     
          .phantoscope-button
            display:inline-block 
            position:absolute
            width:180px
            bottom:0
            right:50px   
      .detail-close
        position: absolute
        top: 50px
        right: 150px
        padding-top: 16px
        width: 32px
        height: 32px
        font-size: 32px
        color: rgba(255, 255, 255, 0.5)

    /*.el-table
      tbody
        tr:first-of-type
          td
            .cell
              color: #ff4949*/

  @media (max-width: 847px)
    .promotionChannelStatistics
      .date-filter
        li
          .managerFront
            width: 72px

</style>
