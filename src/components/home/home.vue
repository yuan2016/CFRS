<template>
  <div class="appWrapper" :class="{hideSidebar:isOpen}">
    <div class="sidebarWrapper">
      <el-menu class="sidebarContainer" unique-opened style="min-height: 100%;" theme="dark" router>
        <el-menu-item class="homePage" index="main"><i class="elextra-icon-home"></i>首页
          <i class="toggle" :class="isToggle" @click.prevent.stop="toggleBar"></i>
        </el-menu-item>
        <el-submenu index="1">
          <template slot="title"><i class="elextra-icon-analysis"></i>RMAB</template>
          <el-submenu index="1-1">
            <template slot="title"><i class="elextra-icon-item"></i>市场</template>
            <el-menu-item index="loanThroughRate"><i class="el-icon-star-on"></i>新用户借款通过率</el-menu-item>
          </el-submenu>
          <el-submenu index="1-2">
            <template slot="title"><i class="elextra-icon-item"></i>运营</template>
            <el-menu-item index="invitationEvent"><i class="el-icon-star-on"></i>邀请活动</el-menu-item>
          </el-submenu>
          <el-submenu index="1-3">
            <template slot="title"><i class="elextra-icon-item"></i>风控</template>
          </el-submenu>
          <el-submenu index="1-4">
            <template slot="title"><i class="elextra-icon-item"></i>催收</template>
            <el-menu-item index="loanOverdueRecallRate"><i class="el-icon-star-on"></i>借款逾期催回率</el-menu-item>
          </el-submenu>
          <el-submenu index="1-5">
            <template slot="title"><i class="elextra-icon-item"></i>用户画像</template>
            <el-menu-item index="userBasePortrait"><i class="el-icon-star-on"></i>基础用户画像</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"><i class="elextra-icon-user"></i>用户信息管理</template>
          <el-menu-item index="userList"><i class="el-icon-star-on"></i>用户列表</el-menu-item>
          <el-menu-item index="userAddressBook"><i class="el-icon-star-on"></i>用户通讯录</el-menu-item>
          <el-menu-item index="bankCardsList"><i class="el-icon-star-on"></i>银行卡列表</el-menu-item>
          <el-menu-item index="userNameAuthenticationList"><i class="el-icon-star-on"></i>用户实名认证列表</el-menu-item>
          <el-menu-item index="userAuthenticationList"><i class="el-icon-star-on"></i>用户认证列表</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title"><i class="elextra-icon-loan"></i>借款管理</template>
          <el-menu-item index="loanApplicationsList"><i class="el-icon-star-on"></i>借款申请列表</el-menu-item>
          <el-menu-item index="loanAuditList"><i class="el-icon-star-on"></i>放款审核列表</el-menu-item>
          <el-menu-item index="raiseQuotaRecord"><i class="el-icon-star-on"></i>提额记录表</el-menu-item>
          <el-menu-item index="reconciliationFunction"><i class="el-icon-star-on"></i>对账功能</el-menu-item>
          <el-menu-item index="assetInformation"><i class="el-icon-star-on"></i>资产信息-招财猫</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title"><i class="elextra-icon-repay"></i>还款管理</template>
          <el-submenu index="4-1">
            <template slot="title"><i class="elextra-icon-item"></i>还款列表</template>
            <el-menu-item index="waitingForReturnList"><i class="el-icon-star-on"></i>待还列表</el-menu-item>
            <el-menu-item index="returnedList"><i class="el-icon-star-on"></i>已还列表</el-menu-item>
          </el-submenu>
          <el-submenu index="4-2">
            <template slot="title"><i class="elextra-icon-item"></i>对账列表</template>
            <el-menu-item index="repaymentReconciliation"><i class="el-icon-star-on"></i>还款对账</el-menu-item>
            <el-menu-item index="renewalReconciliation"><i class="el-icon-star-on"></i>续期对账</el-menu-item>
          </el-submenu>
          <el-submenu index="4-3">
            <template slot="title"><i class="elextra-icon-item"></i>退款列表</template>
            <el-menu-item index="repaymentDetails"><i class="el-icon-star-on"></i>还款详情</el-menu-item>
            <el-menu-item index="renewalParticulars"><i class="el-icon-star-on"></i>续期详情</el-menu-item>
            <el-menu-item index="rebackedList"><i class="el-icon-star-on"></i>已退列表</el-menu-item>
          </el-submenu>
          <el-submenu index="4-4">
            <template slot="title"><i class="elextra-icon-item"></i>续期管理</template>
            <el-menu-item index="renewalsList"><i class="el-icon-star-on"></i>续期列表</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title"><i class="elextra-icon-data"></i>数据分析</template>
          <el-submenu index="5-1">
            <template slot="title"><i class="elextra-icon-item"></i>财务数据</template>
            <el-menu-item index="dailyLendingData"><i class="el-icon-star-on"></i>每日放款数据</el-menu-item>
            <el-menu-item index="dailyRepaymentUnitData"><i class="el-icon-star-on"></i>每日还款单位数据</el-menu-item>
            <el-menu-item index="daysStageStatistics"><i class="el-icon-star-on"></i>21天分期统计</el-menu-item>
            <el-menu-item index="installmentPromotionStatistics"><i class="el-icon-star-on"></i>21天分期提额统计</el-menu-item>
            <el-menu-item index="daysStageStatistics90"><i class="el-icon-star-on"></i>90天分期统计</el-menu-item>
            <el-menu-item index="dailyRepaymentAmountData"><i class="el-icon-star-on"></i>每日还款金额数据</el-menu-item>
            <el-menu-item index="overdueRepaymentStatistics"><i class="el-icon-star-on"></i>还款逾期统计</el-menu-item>
            <el-menu-item index="fundAnalysis"><i class="el-icon-star-on"></i>资金分析</el-menu-item>
            <el-menu-item index="fundAnalysisProduct"><i class="el-icon-star-on"></i>资金分析(分产品)</el-menu-item>
            <el-menu-item index="collectionManagement"><i class="el-icon-star-on"></i>催收管理</el-menu-item>
            <el-menu-item index="promptAmount"><i class="el-icon-star-on"></i>在催金额</el-menu-item>
          </el-submenu>
          <el-submenu index="5-2">
            <template slot="title"><i class="elextra-icon-item"></i>数据报表</template>
            <el-menu-item index="platformData"><i class="el-icon-star-on"></i>平台数据</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="6">
          <template slot="title"><i class="elextra-icon-finance"></i>财务分析</template>
          <el-menu-item index="repaymentMinutia"><i class="el-icon-star-on"></i>还款明细表</el-menu-item>
          <el-menu-item index="reconciliationAnalysis"><i class="el-icon-star-on"></i>对账分析表</el-menu-item>
          <el-menu-item index="reportStatistics"><i class="el-icon-star-on"></i>还款日报表</el-menu-item>
        </el-submenu>
        <el-submenu index="7">
          <template slot="title"><i class="elextra-icon-promotion"></i>推广管理</template>
          <el-menu-item index="promotionChannel"><i class="el-icon-star-on"></i>推广渠道</el-menu-item>
          <el-menu-item index="promoterManagement"><i class="el-icon-star-on"></i>推广员管理</el-menu-item>
          <el-menu-item index="promotionChannelStatistics"><i class="el-icon-star-on"></i>推广统计(渠道)</el-menu-item>
          <el-menu-item index="promotionRegionStatistics"><i class="el-icon-star-on"></i>推广统计(地区)</el-menu-item>
          <el-menu-item index="channelStatisticsSummary"><i class="el-icon-star-on"></i>渠道统计汇总</el-menu-item>
          <el-menu-item index="registrationStatisticsReport"><i class="el-icon-star-on"></i>注册量统计报表</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="mainContainer">
      <router-view></router-view>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import ElSubmenu from '../../../node_modules/element-ui/packages/menu/src/submenu'

  export default {
    data () {
      return {
        isOpen: false
      }
    },
    components: {ElSubmenu},
    methods: {
      toggleBar () {
        this.isOpen = !this.isOpen
      }
    },
    computed: {
      isToggle: function () {
        if (this.isOpen) {
          return 'elextra-icon-right'
        } else {
          return 'elextra-icon-left'
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .appWrapper
    position: relative
    height: 100%
    width: 100%
    &.hideSidebar
      .sidebarWrapper
        transform: translate(-200px, 0)
        .sidebarContainer
          transform: translate(190px, 0)
        &:hover
          transform: translate(0, 0)
          .sidebarContainer
            transform: translate(0, 0)
      .mainContainer
        margin-left: 30px
    .sidebarWrapper
      width: 230px
      position: fixed
      top: 0
      bottom: 0
      left: 0
      z-index: 1001
      overflow: hidden
      transition: all .28s ease-out
      .sidebarContainer
        position: absolute
        top: 0
        bottom: 0
        left: 0
        right: -10px
        overflow-y: scroll
        transition: all .28s ease-out
        .homePage
          position: relative
          .toggle
            position: absolute
            top: 5px
            right: -10px
            padding: 15px 15px 15px 30px
            font-size: 20px
    .mainContainer
      min-height: 100%
      margin-left: 230px
      transition: all .28s ease-out

  .el-table .cell, .el-table th > div
    padding-left: 0
    padding-right: 0
    text-align: center
    font-size: 12px

  .el-table th > .cell
    text-align: center
    font-weight: bold

  .elextra-icon-repay
    font-size: 18px
    margin-right: 7px
    position: relative
    top: 2px
    right: 2px

  .elextra-icon-promotion
    font-size: 20px;
    margin-right: 4px
    position: relative
    top: 4px
    right: 3px

  .elextra-icon-analysis
    position: relative
    top: 2px
    right: 1px
    font-size: 16px
    margin-right: 8px

  .elextra-icon-finance
    position: relative
    top: 2px
    right: 3px
    font-size: 19px
    margin-right: 5px
</style>
