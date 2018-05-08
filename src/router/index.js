import Vue from "vue";
import Router from "vue-router";

const Layout = r =>
  require.ensure(
    [],
    () => r(require("../components/page/layout/layout")),
    "layout"
  );
const login = r =>
  require.ensure(
    [],
    () => r(require("../components/page/login/login")),
    "login"
  );
const home = r =>
  require.ensure([], () => r(require("../components/home/home")), "home");
const main = r =>
  require.ensure([], () => r(require("../components/page/main/main")), "main");
const passwordModify = r =>
  require.ensure(
    [],
    () => r(require("../components/others/passwordModify/passwordModify")),
    "passwordModify"
  );
const error = r =>
  require.ensure([], () => r(require("../components/page/404/404")), "404");
//用户信息管理
const userList = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/userInformationManagement/userList/userList")
      ),
    "userList"
  );
const userAddressBook = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/userInformationManagement/userAddressBook/userAddressBook")
      ),
    "userAddressBook"
  );
const bankCardsList = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/userInformationManagement/bankCardsList/bankCardsList")
      ),
    "bankCardsList"
  );
const userNameAuthenticationList = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/userInformationManagement/userNameAuthenticationList/userNameAuthenticationList")
      ),
    "userNameAuthenticationList"
  );
const userAuthenticationList = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/userInformationManagement/userAuthenticationList/userAuthenticationList")
      ),
    "userAuthenticationList"
  );
const discountCoupon = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/userInformationManagement/discountCoupon/discountCoupon")
      ),
    "discountCoupon"
  );
const newUserTagList = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/userInformationManagement/newUserTagList/newUserTagList")
      ),
    "newUserTagList"
  );
const oldUserTagList = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/userInformationManagement/oldUserTagList/oldUserTagList")
      ),
    "oldUserTagList"
  );
//RMAB
const rmabLayout = r =>
  require.ensure([], () => r(require("../components/page/RMAB")), "rmabLayout");
const newPassRateLayout = r =>
  require.ensure(
    [],
    () => r(require("../components/page/RMAB/market/newUserPassRate")),
    "newPassRateLayout"
  );
const loanThroughRate = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/RMAB/market/loanThroughRate/loanThroughRate")
      ),
    "loanThroughRate"
  );
const loanThroughRateAll = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/RMAB/market/loanThroughRate/loanThroughRateAll")
      ),
    "loanThroughRateAll"
  );
const loanOverdueRecallRate = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/RMAB/collection/loanOverdueRecallRate/loanOverdueRecallRate")
      ),
    "loanOverdueRecallRate"
  );
const userBasePortrait = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/RMAB/userPortrait/userBasePortrait/userBasePortrait")
      ),
    "userBasePortrait"
  );
const operationUserPortrait = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/RMAB/userPortrait/operationUserPortrait/operationUserPortrait")
      ),
    "operationUserPortrait"
  );
const invitationEvent = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/RMAB/operate/invitationEvent/invitationEvent")
      ),
    "invitationEvent"
  );
const riskControlFactorAnalysis = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/RMAB/riskManagement/riskControlFactorAnalysis/riskControlFactorAnalysis")
      ),
    "riskControlFactorAnalysis"
  );
const riskControlFactorAnalysisWeek = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/RMAB/riskManagement/riskControlFactorAnalysis/riskControlFactorAnalysisWeek")
      ),
    "riskControlFactorAnalysisWeek"
  );
const riskControlFactorAnalysisMonth = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/RMAB/riskManagement/riskControlFactorAnalysis/riskControlFactorAnalysisMonth")
      ),
    "riskControlFactorAnalysisMonth"
  );
//新用户通过率
const tab1 = r =>
  require.ensure(
    [],
    () => r(require("../components/page/RMAB/market/newUserPassRate/tab1.vue")),
    "tab1"
  );
const tab2 = r =>
  require.ensure(
    [],
    () => r(require("../components/page/RMAB/market/newUserPassRate/tab2.vue")),
    "tab2"
  );
const tab3 = r =>
  require.ensure(
    [],
    () => r(require("../components/page/RMAB/market/newUserPassRate/tab3.vue")),
    "tab3"
  );
//企鹅抓娃娃
const dataOverview = r =>
  require.ensure(
    [],
    () =>
      r(require("../components/page/toyGrab/market/dataOverview/dataOverview")),
    "dataOverview"
  );
const dataOverviewAll = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/toyGrab/market/dataOverview/dataOverviewAll")
      ),
    "dataOverviewAll"
  );
const promotionChannelStatisticsQE = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/toyGrab/market/promotionChannelStatisticsQE/promotionChannelStatisticsQE")
      ),
    "promotionChannelStatisticsQE"
  );
const promotionOPPOStatisticsQE = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/toyGrab/market/promotionOPPOStatisticsQE/promotionOPPOStatisticsQE")
      ),
    "promotionOPPOStatisticsQE"
  );
const onlineStatisticsHourlyQE = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/toyGrab/market/onlineStatisticsHourlyQE/onlineStatisticsHourlyQE")
      ),
    "onlineStatisticsHourlyQE"
  );
const userRechargeIntervalAnalysisQE = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/toyGrab/market/userRechargeIntervalAnalysisQE/userRechargeIntervalAnalysisQE")
      ),
    "userRechargeIntervalAnalysis"
  );
const userRechargeIntervalAnalysisWeeklyQE = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/toyGrab/market/userRechargeIntervalAnalysisWeeklyQE/userRechargeIntervalAnalysisWeeklyQE")
      ),
    "userRechargeIntervalAnalysis"
  );
const userRechargeTimeAnalysisQE = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/toyGrab/market/userRechargeTimeAnalysisQE/userRechargeTimeAnalysisQE")
      ),
    "userRechargeTimeAnalysisQE"
  );
const torechargePVUV = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/toyGrab/buriaPointAnalysis/torechargePVUV/torechargePVUV")
      ),
    "torechargePVUV"
  );
const roomPVUV = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/toyGrab/buriaPointAnalysis/roomPVUV/roomPVUV")
      ),
    "roomPVUV"
  );
const arbitraryGatePVUV = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/toyGrab/buriaPointAnalysis/arbitraryGatePVUV/arbitraryGatePVUV")
      ),
    "arbitraryGatePVUV"
  );
const bannerPVUV = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/toyGrab/buriaPointAnalysis/bannerPVUV/bannerPVUV")
      ),
    "bannerPVUV"
  );
const exchangePVUV = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/toyGrab/buriaPointAnalysis/exchangePVUV/exchangePVUV")
      ),
    "exchangePVUV"
  );
const level1Room = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/toyGrab/buriaPointAnalysis/level1Room/level1Room")
      ),
    "level1Room"
  );
const rechargeActivities = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/toyGrab/buriaPointAnalysis/rechargeActivities/rechargeActivities")
      ),
    "rechargeActivities"
  );
const operatingWindow = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/toyGrab/buriaPointAnalysis/operatingWindow/operatingWindow")
      ),
    "operatingWindow"
  );
const treasureBox = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/toyGrab/buriaPointAnalysis/treasureBox/treasureBox")
      ),
    "treasureBox"
  );
const reconciliationAnalysisQE = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/toyGrab/financialStatistics/reconciliationAnalysisQE/reconciliationAnalysisQE")
      ),
    "reconciliationAnalysisQE"
  );
const incomeStatementQE = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/toyGrab/financialStatistics/incomeStatementQE/incomeStatementQE")
      ),
    "incomeStatementQE"
  );
const penguinSummaryQE = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/toyGrab/financialStatistics/penguinSummaryQE/penguinSummaryQE")
      ),
    "penguinSummaryQE"
  );
const inventoryManagementQE = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/toyGrab/financialStatistics/inventoryManagementQE/inventoryManagementQE")
      ),
    "inventoryManagementQE"
  );
//开心竞拍
const marketView = r =>
  require.ensure(
    [],
    () => r(require("../components/page/auction/market/marketView/marketView")),
    "marketView"
  );
const newChannelView = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/auction/market/newChannelView/newChannelView")
      ),
    "newChannelView"
  );
const promotionEffectStatistics = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/auction/market/promotionEffectStatistics/promotionEffectStatistics")
      ),
    "promotionEffectStatistics"
  );
const dailyPromotionEffectStatistics = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/auction/market/dailyPromotionEffectStatistics/dailyPromotionEffectStatistics")
      ),
    "dailyPromotionEffectStatistics"
  );
const promotionChannelStatisticsWeekly = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/auction/market/promotionChannelStatisticsWeekly/promotionChannelStatisticsWeekly")
      ),
    "promotionChannelStatisticsWeekly"
  );
const channelDODData = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/auction/market/channelDODData/channelDODData")
      ),
    "channelDODData"
  );
const channelWOWData = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/auction/market/channelWOWData/channelWOWData")
      ),
    "channelWOWData"
  );
const channelMOMData = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/auction/market/channelMOMData/channelMOMData")
      ),
    "channelMOMData"
  );
const channelQOQData = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/auction/market/channelQOQData/channelQOQData")
      ),
    "channelQOQData"
  );
const channelYOYData = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/auction/market/channelYOYData/channelYOYData")
      ),
    "channelYOYData"
  );
const channelUserActivity = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/auction/market/channelUserActivity/channelUserActivity")
      ),
    "channelUserActivity"
  );
const orderInfo = r =>
  require.ensure(
    [],
    () => r(require("../components/page/auction/operate/orderInfo/orderInfo")),
    "orderInfo"
  );
const userInfo = r =>
  require.ensure(
    [],
    () => r(require("../components/page/auction/operate/userInfo/userInfo")),
    "userInfo"
  );
const pagePVUV = r =>
  require.ensure(
    [],
    () => r(require("../components/page/auction/operate/pagePVUV/pagePVUV")),
    "pagePVUV"
  );
const auctionRecord = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/auction/operate/auctionRecord/auctionRecord")
      ),
    "auctionRecord"
  );
const integralRecord = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/auction/operate/integralRecord/integralRecord")
      ),
    "integralRecord"
  );
const rechargeRecord = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/auction/operate/rechargeRecord/rechargeRecord")
      ),
    "rechargeRecord"
  );
const trafficStatistics = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/auction/operate/trafficStatistics/trafficStatistics")
      ),
    "trafficStatistics"
  );
const elementPVUV = r =>
  require.ensure(
    [],
    () =>
      r(require("../components/page/auction/operate/elementPVUV/elementPVUV")),
    "elementPVUV"
  );
const userBrowsingBehavior = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/auction/operate/userBrowsingBehavior/userBrowsingBehavior")
      ),
    "elementPVUV"
  );
const operateView = r =>
  require.ensure(
    [],
    () =>
      r(require("../components/page/auction/operate/operateView/operateView")),
    "operateView"
  );
const operatingSituation = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/auction/operatingSituation/operatingSituation")
      ),
    "operatingSituation"
  );
const deleteRobotInfo = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/auction/lab/deleteRobotInfo/deleteRobotInfo")
      ),
    "deleteRobotInfo"
  );
//借款管理
const assetInformation = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/loanManagement/assetInformation/assetInformation")
      ),
    "assetInformation"
  );
const loanApplicationsList = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/loanManagement/loanApplicationsList/loanApplicationsList")
      ),
    "loanApplicationsList"
  );
const loanAuditList = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/loanManagement/loanAuditList/loanAuditList")
      ),
    "loanAuditList"
  );
const raiseQuotaRecord = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/loanManagement/raiseQuotaRecord/raiseQuotaRecord")
      ),
    "raiseQuotaRecord"
  );
const reconciliationFunction = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/loanManagement/reconciliationFunction/reconciliationFunction")
      ),
    "reconciliationFunction"
  );
//还款管理
//还款列表
const waitingForReturnList = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/repaymentManagement/repaymentList/waitingForReturnList/waitingForReturnList")
      ),
    "waitingForReturnList"
  );
const returnedList = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/repaymentManagement/repaymentList/returnedList/returnedList")
      ),
    "returnedList"
  );
//对账列表
const repaymentReconciliation = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/repaymentManagement/reconciliationList/repaymentReconciliation/repaymentReconciliation")
      ),
    "repaymentReconciliation"
  );
const renewalReconciliation = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/repaymentManagement/reconciliationList/renewalReconciliation/renewalReconciliation")
      ),
    "renewalReconciliation"
  );
//退款列表
const repaymentDetails = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/repaymentManagement/refundList/repaymentDetails/repaymentDetails")
      ),
    "repaymentDetails"
  );
const renewalParticulars = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/repaymentManagement/refundList/renewalParticulars/renewalParticulars")
      ),
    "renewalParticulars"
  );
const rebackedList = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/repaymentManagement/refundList/rebackedList/rebackedList")
      ),
    "rebackedList"
  );
//续期管理
const renewalsList = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/repaymentManagement/renewalManagement/renewalsList/renewalsList")
      ),
    "renewalsList"
  );

//数据分析
const daysStageStatistics = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/financialData/21daysStageStatistics/21daysStageStatistics")
      ),
    "21daysStageStatistics"
  );
const daysStageStatistics90 = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/financialData/90daysStageStatistics/90daysStageStatistics")
      ),
    "90daysStageStatistics"
  );
const installmentPromotionStatistics = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/financialData/21installmentPromotionStatistics/21installmentPromotionStatistics")
      ),
    "21installmentPromotionStatistics"
  );
const collectionManagement = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/financialData/collectionManagement/collectionManagement")
      ),
    "collectionManagement"
  );
const dailyLendingData = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/financialData/dailyLendingData/dailyLendingData")
      ),
    "dailyLendingData"
  );
const dailyRepaymentAmountData = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/financialData/dailyRepaymentAmountData/dailyRepaymentAmountData")
      ),
    "dailyRepaymentAmountData"
  );
const dailyRepaymentUnitData = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/financialData/dailyRepaymentUnitData/dailyRepaymentUnitData")
      ),
    "dailyRepaymentUnitData"
  );
const fundAnalysis = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/financialData/fundAnalysis/fundAnalysis")
      ),
    "fundAnalysis"
  );
const fundAnalysisProduct = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/financialData/fundAnalysisProduct/fundAnalysisProduct")
      ),
    "fundAnalysisProduct"
  );
const overdueRepaymentStatistics = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/financialData/overdueRepaymentStatistics/overdueRepaymentStatistics")
      ),
    "overdueRepaymentStatistics"
  );
const platformData = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/dataReport/platformData/platformData.vue")
      ),
    "platformData"
  );
const promptAmount = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/financialData/promptAmount/promptAmount")
      ),
    "promptAmount"
  );
const prepaymentStatistics = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/financialData/prepaymentStatistics/prepaymentStatistics")
      ),
    "prepaymentStatistics"
  );
const naturalChannelStatistics = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/financialData/naturalChannelStatistics/naturalChannelStatistics")
      ),
    "naturalChannelStatistics"
  );
const couponStatistics = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/financialData/couponStatistics/couponStatistics")
      ),
    "couponStatistics"
  );
const repaymentCouponAnalysis = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/financialData/repaymentCouponAnalysis/repaymentCouponAnalysis")
      ),
    "repaymentCouponAnalysis"
  );
const hourlyRepaymentRateT = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/financialData/hourlyRepaymentRate/hourlyRepaymentRateT/hourlyRepaymentRateT")
      ),
    "hourlyRepaymentRateT"
  );
const hourlyRepaymentRate = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/financialData/hourlyRepaymentRate/hourlyRepaymentRate")
      ),
    "hourlyRepaymentRate"
  );
const keyData = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/financialData/keyData/keyData")
      ),
    "keyData"
  );
//开心商城
const dailyExpenditureData = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/happyMall/dailyExpenditureData/dailyExpenditureData")
      ),
    "dailyExpenditureData"
  );
//现金借呗
const dailyLendingDataXJJB = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/cashBorrowed/dailyLendingData/dailyLendingData")
      ),
    "dailyLendingData"
  );
const dailyRepaymentUnitDataXJJB = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/dataAnalysis/cashBorrowed/dailyRepaymentUnitData/dailyRepaymentUnitData")
      ),
    "dailyRepaymentUnitData"
  );
//财务分析
const repaymentMinutia = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/financeAnalysis/repaymentMinutia/repaymentMinutia")
      ),
    "repaymentMinutia"
  );
const reconciliationAnalysis = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/financeAnalysis/reconciliationAnalysis/reconciliationAnalysis")
      ),
    "reconciliationAnalysis"
  );
const reportStatistics = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/financeAnalysis/reportStatistics/reportStatistics")
      ),
    "reportStatistics"
  );
const lendingDaily = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/financeAnalysis/lendingDaily/lendingDaily")
      ),
    "lendingDaily"
  );
//推广管理
const promotionChannel = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/promotionManagement/promotionChannel/promotionChannel")
      ),
    "promotionChannel"
  );
const promoterManagement = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/promotionManagement/promoterManagement/promoterManagement")
      ),
    "promoterManagement"
  );
const promotionChannelStatistics = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/promotionManagement/promotionChannelStatistics/promotionChannelStatistics")
      ),
    "promotionChannelStatistics"
  );
const promotionChannelStatistics7 = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/promotionManagement/promotionChannelStatistics7Days/promotionChannelStatistics7Days")
      ),
    "promotionChannelStatistics7"
  );
const promotionRegionStatistics = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/promotionManagement/promotionRegionStatistics/promotionRegionStatistics")
      ),
    "promotionRegionStatistics"
  );
const channelStatisticsSummary = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/promotionManagement/channelStatisticsSummary/channelStatisticsSummary")
      ),
    "channelStatisticsSummary"
  );
const registrationStatisticsReport = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/promotionManagement/registrationStatisticsReport/registrationStatisticsReport")
      ),
    "registrationStatisticsReport"
  );
const PVUV = r =>
  require.ensure(
    [],
    () => r(require("../components/page/promotionManagement/PVUV/PVUV")),
    "PVUV"
  );
//绩效考评
const achievements = r =>
  require.ensure(
    [],
    () => r(require("../components/page/evaluation/achievements/achievements")),
    "achievements"
  );
//权限管理
const employeeList = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/privilegeManage/employeeList/employeeList")
      ),
    "employeeList"
  );
//开心分期
/*黑卡*/
const periodDailyLendingData = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/loan/periodDailyLendingData/periodDailyLendingData")
      ),
    "periodDailyLendingData"
  );
const periodOverdueRepaymentStatistics = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/loan/periodOverdueRepaymentStatistics/periodOverdueRepaymentStatistics")
      ),
    "periodOverdueRepaymentStatistics"
  );
const periodDailyRepaymentAmountData = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/loan/periodDailyRepaymentAmountData/periodDailyRepaymentAmountData")
      ),
    "periodDailyRepaymentAmountData"
  );
  const promptAmountData = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/loan/promptAmountData/promptAmountData")
      ),
    "promptAmountData"
  );
  const repaymentDetailData = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/loan/repaymentDetailData/repaymentDetailData")
      ),
    "repaymentDetailData"
  );
  const dailySettlementReport = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/loan/dailySettlementReport/dailySettlementReport")
      ),
    "dailySettlementReport"
  );
const dailyClaimsReport = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/loan/dailyClaimsReport/dailyClaimsReport")
      ),
    "dailyClaimsReport"
  );
const ZCMRepaymentDataReconciliation = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/loan/ZCMRepaymentDataReconciliation/ZCMRepaymentDataReconciliation")
      ),
    "ZCMRepaymentDataReconciliation"
  );
const ZBrepaymentData = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/loan/ZBrepaymentData/ZBrepaymentData")
      ),
    "ZBrepaymentData"
  );
const monthlySettlementData = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/loan/monthlySettlementData/monthlySettlementData")
      ),
    "monthlySettlementData"
  );
const monthlyBondData = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/loan/monthlyBondData/monthlyBondData")
      ),
    "monthlyBondData"
  );
  const repaymentReconciliationZFB = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/loan/repaymentReconciliationZFB/repaymentReconciliationZFB")
      ),
    "repaymentReconciliationZFB"
  );
  const dataCheckXN = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/loan/dataCheckXN/dataCheckXN")
      ),
    "dataCheckXN"
  );
  const threePartyAccountAnalysis = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/loan/threePartyAccountAnalysis/threePartyAccountAnalysis")
      ),
    "threePartyAccountAnalysis"
  );
/*商城*/
const totalIncome = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/mall/finance/totalIncome/totalIncome")
      ),
    "totalIncome"
  );
const detailIncome = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/mall/finance/detailIncome/detailIncome")
      ),
    "detailIncome"
  );
const totalSales = r =>
  require.ensure(
    [],
    () =>
      r(require("../components/page/periodization/mall/finance/totalSales/totalSales")),
    "totalSales"
  );
const detailSales = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/mall/finance/detailSales/detailSales")
      ),
    "detailSales"
  );
const detailOrder = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/mall/finance/detailOrder/detailOrder")
      ),
    "detailOrder"
  );
const dailyPocketMoneyAnalysis = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/mall/finance/dailyPocketMoneyAnalysis/dailyPocketMoneyAnalysis")
      ),
    "dailyPocketMoneyAnalysis"
  );
const dailyPackageIncomeStatement = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/mall/finance/dailyPackageIncomeStatement/dailyPackageIncomeStatement")
      ),
    "dailyPackageIncomeStatement"
  );
  const dailyMallOrderReport = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/mall/finance/dailyMallOrderReport/dailyMallOrderReport")
      ),
    "dailyMallOrderReport"
  );
  const rechargeOfChangeReport = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/mall/finance/rechargeOfChangeReport/rechargeOfChangeReport")
      ),
    "rechargeOfChangeReport"
  );
const mallMonthlyReport = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/mall/finance/mallMonthlyReport/mallMonthlyReport")
      ),
    "mallMonthlyReport"
  );
const changeFundAccountStatement = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/mall/finance/changeFundAccountStatement/changeFundAccountStatement")
      ),
    "changeFundAccountStatement"
  );
const channelStatistics = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/market/channelStatistics/channelStatistics")
      ),
    "channelStatistics"
  );
const channelSummaryStatistics = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/market/channelSummaryStatistics/channelSummaryStatistics")
      ),
    "channelSummaryStatistics"
  );
const channelPromotionInformation = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/market/channelPromotionInformation/channelPromotionInformation")
      ),
    "channelPromotionInformation"
  );
const promotionInformation = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/market/promotionInformation/promotionInformation")
      ),
    "promotionInformation"
  );
const registrationStatisticsReportFQ = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/market/registrationStatisticsReport/registrationStatisticsReport")
      ),
    "registrationStatisticsReport"
  );
const promotionStatisticsArea = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/market/promotionStatisticsArea/promotionStatisticsArea")
      ),
    "promotionStatisticsArea"
  );
const promotionStatisticalChannel = r =>
  require.ensure(
    [],
    () =>
      r(
        require("../components/page/periodization/market/promotionStatisticalChannel/promotionStatisticalChannel")
      ),
    "promotionStatisticalChannel"
  );
/**
 * icon : the icon show in the sidebar
 * hidden : if hidden:true will not show in the sidebar
 * redirect : if redirect:noredirect will not redirct in the levelbar
 * noDropdown : if noDropdown:true will not has submenu
 * attr : { role: ['admin'] }  will control the page role
 **/

export const constantRouterMap = [
  { path: "/", redirect: "/main", hidden: true },
  { path: "/login", component: login, hidden: true },
  {
    path: "/passwordModify",
    component: passwordModify,
    hidden: true,
    meta: ["修改密码"]
  },
  { path: "/404", component: error, hidden: true }
];

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  {
    path: "/main",
    component: Layout,
    noDropdown: true,
    redirect: "/main/index",
    name: "首页",
    meta: ["RMAB", "借款通过率", "通过率"],
    icon: "elextra-icon-home",
    children: [{ path: "index", component: main, name: "首页" }]
  },
  {
    path: "/RMAB",
    component: Layout,
    redirect: "/RMAB/market",
    name: "RMAB",
    icon: "elextra-icon-analysis",
    children: [
      {
        path: "/RMAB/market",
        icon: "elextra-icon-item",
        component: rmabLayout,
        redirect: "/RMAB/market/newUserPassRate",
        name: "市场",
        children: [
          {
            path: "/RMAB/market/newUserPassRate",
            icon: "el-icon-star-on",
            component: newPassRateLayout,
            redirect: "/RMAB/market/newUserPassRate/tab1",
            name: "新用户借款通过率",
            noDropdown: true,
            haveTab: true,
            meta: ["RMAB", "新用户借款通过率"],
            attr: { role: ["admin", "boss"] },
            children: [
              {
                path: "tab1",
                component: tab1,
                hidden: true,
                name: "新用户借款通过率",
                meta: ["RMAB", "新用户借款通过率", "通过率"],
                attr: { role: ["admin", "boss"] }
              },
              {
                path: "tab2",
                component: tab2,
                hidden: true,
                name: "新用户借款通过率",
                meta: ["RMAB", "新用户借款通过率", "渠道分析"],
                attr: { role: ["admin", "boss"] }
              },
              {
                path: "tab3",
                component: tab3,
                hidden: true,
                name: "新用户借款通过率",
                meta: ["RMAB", "新用户借款通过率", "被拒原因"],
                attr: { role: ["admin", "boss"] }
              }
            ]
          },
          {
            path: "/RMAB/market/newUserPassRate/loanThroughRate",
            icon: "el-icon-star-on",
            component: loanThroughRate,
            hidden: true,
            name: "新用户借款通过率",
            meta: ["RMAB", "新用户借款通过率"],
            attr: { role: ["admin"] }
          },
          {
            path: "/RMAB/market/newUserPassRate/loanThroughRateAll",
            icon: "el-icon-star-on",
            component: loanThroughRateAll,
            hidden: true,
            name: "新用户借款通过率",
            meta: ["RMAB", "新用户借款通过率"],
            attr: { role: ["admin", "boss"] }
          }
        ]
      },
      {
        path: "/RMAB/operate",
        redirect: "/RMAB/operate/invitationEvent",
        icon: "elextra-icon-item",
        component: rmabLayout,
        name: "运营",
        children: [
          {
            path: "/RMAB/operate/invitationEvent",
            icon: "el-icon-star-on",
            component: invitationEvent,
            name: "邀请活动",
            meta: ["RMAB", "邀请活动"],
            attr: { role: ["admin", "boss"] }
          }
        ]
      },
      {
        path: "/RMAB/riskManagement",
        redirect: "/RMAB/riskManagement/riskControlFactorAnalysis",
        icon: "elextra-icon-item",
        component: rmabLayout,
        name: "风控",
        children: [
          {
            path: "/RMAB/riskManagement/riskControlFactorAnalysis",
            icon: "el-icon-star-on",
            component: riskControlFactorAnalysis,
            name: "风控因素分析",
            meta: ["RMAB", "风控因素分析"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/RMAB/riskManagement/riskControlFactorAnalysisWeek",
            icon: "el-icon-star-on",
            hidden: true,
            component: riskControlFactorAnalysisWeek,
            name: "风控因素分析",
            meta: ["RMAB", "风控因素分析"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/RMAB/riskManagement/riskControlFactorAnalysisMonth",
            icon: "el-icon-star-on",
            hidden: true,
            component: riskControlFactorAnalysisMonth,
            name: "风控因素分析",
            meta: ["RMAB", "风控因素分析"],
            attr: { role: ["admin", "boss"] }
          }
        ]
      },
      {
        path: "/RMAB/collection",
        redirect: "/RMAB/collection/loanOverdueRecallRate",
        icon: "elextra-icon-item",
        component: rmabLayout,
        name: "催收",
        children: [
          {
            path: "/RMAB/collection/loanOverdueRecallRate",
            icon: "el-icon-star-on",
            component: loanOverdueRecallRate,
            name: "借款逾期催回率",
            meta: ["RMAB", "借款逾期催回率"],
            attr: { role: ["admin", "boss"] }
          }
        ]
      },
      {
        path: "/RMAB/userPortrait",
        redirect: "/RMAB/userPortrait/userBasePortrait",
        icon: "elextra-icon-item",
        component: rmabLayout,
        name: "用户画像",
        children: [
          {
            path: "/RMAB/userPortrait/userBasePortrait",
            icon: "el-icon-star-on",
            component: userBasePortrait,
            name: "基础用户画像",
            meta: ["RMAB", "基础用户画像"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/RMAB/userPortrait/operationUserPortrait",
            icon: "el-icon-star-on",
            component: operationUserPortrait,
            name: "运营用户画像",
            meta: ["RMAB", "运营用户画像"],
            attr: { role: ["admin", "boss"] }
          }
        ]
      }
    ]
  },
  {
    path: "/toyGrab/market",
    icon: "elextra-icon-market",
    component: Layout,
    redirect: "/toyGrab/market/dataOverview",
    name: "市场分析",
    children: [
      {
        path: "/toyGrab/market/dataOverview",
        icon: "el-icon-star-on",
        component: dataOverview,
        name: "数据概览",
        meta: ["市场分析", "数据概览"]
      },
      {
        path: "/toyGrab/market/dataOverviewAll",
        icon: "el-icon-star-on",
        hidden: true,
        component: dataOverviewAll,
        name: "数据概览",
        meta: ["市场分析", "数据概览"]
      },
      {
        path: "/toyGrab/market/promotionChannelStatisticsQE",
        icon: "el-icon-star-on",
        component: promotionChannelStatisticsQE,
        name: "企鹅推广统计(渠道)",
        meta: ["市场分析", "企鹅推广统计(渠道)"]
      },
      {
        path: "/toyGrab/market/promotionOPPOStatisticsQE",
        icon: "el-icon-star-on",
        component: promotionOPPOStatisticsQE,
        name: "企鹅推广统计(厂商)",
        meta: ["市场分析", "企鹅推广统计(厂商)"]
      },
      {
        path: "/toyGrab/market/onlineStatisticsHourlyQE",
        icon: "el-icon-star-on",
        component: onlineStatisticsHourlyQE,
        name: "企鹅在线人数统计",
        meta: ["市场分析", "企鹅在线人数统计"]
      },
      {
        path: "/toyGrab/market/userRechargeIntervalAnalysisQE",
        icon: "el-icon-star-on",
        component: userRechargeIntervalAnalysisQE,
        name: "用户充值间隔分析",
        meta: ["市场分析", "用户充值间隔分析"]
      },
      {
        path: "/toyGrab/market/userRechargeIntervalAnalysisWeeklyQE",
        icon: "el-icon-star-on",
        component: userRechargeIntervalAnalysisWeeklyQE,
        name: "用户充值间隔分析(周)",
        meta: ["市场分析", "用户充值间隔分析(周)"]
      },
      {
        path: "/toyGrab/market/userRechargeTimeAnalysisQE",
        icon: "el-icon-star-on",
        component: userRechargeTimeAnalysisQE,
        name: "用户充值时段分析",
        meta: ["市场分析", "用户充值时段分析"]
      }
    ]
  },
  {
    path: "/toyGrab/buriaPointAnalysis/torechargePVUV",
    icon: "elextra-icon-point",
    component: Layout,
    redirect: "/toyGrab/buriaPointAnalysis/torechargePVUV",
    name: "埋点分析",
    children: [
      {
        path: "/toyGrab/buriaPointAnalysis/torechargePVUV",
        icon: "el-icon-star-on",
        component: torechargePVUV,
        name: "充值按钮点击量",
        meta: ["埋点分析", "充值按钮点击量"]
      },
      {
        path: "/toyGrab/buriaPointAnalysis/roomPVUV",
        icon: "el-icon-star-on",
        component: roomPVUV,
        name: "各房间点击量",
        meta: ["埋点分析", "各房间点击量 "]
      },
      {
        path: "/toyGrab/buriaPointAnalysis/arbitraryGatePVUV",
        icon: "el-icon-star-on",
        component: arbitraryGatePVUV,
        name: "任意门点击量",
        meta: ["埋点分析", "任意门点击量 "]
      },
      {
        path: "/toyGrab/buriaPointAnalysis/bannerPVUV",
        icon: "el-icon-star-on",
        component: bannerPVUV,
        name: "banner点击量",
        meta: ["埋点分析", "banner点击量 "]
      },
      {
        path: "/toyGrab/buriaPointAnalysis/exchangePVUV",
        icon: "el-icon-star-on",
        component: exchangePVUV,
        name: "兑换点击量",
        meta: ["埋点分析", "兑换点击量 "]
      },
      {
        path: "/toyGrab/buriaPointAnalysis/level1Room",
        icon: "el-icon-star-on",
        component: level1Room,
        name: "一级游戏房",
        meta: ["埋点分析", "一级游戏房 "]
      },
      {
        path: "/toyGrab/buriaPointAnalysis/rechargeActivities",
        icon: "el-icon-star-on",
        component: rechargeActivities,
        name: "充值活动",
        meta: ["埋点分析", "充值活动 "]
      },
      {
        path: "/toyGrab/buriaPointAnalysis/operatingWindow",
        icon: "el-icon-star-on",
        component: operatingWindow,
        name: "运营弹窗",
        meta: ["埋点分析", "运营弹窗 "]
      },
      {
        path: "/toyGrab/buriaPointAnalysis/treasureBox",
        icon: "el-icon-star-on",
        component: treasureBox,
        name: "宝箱",
        meta: ["埋点分析", "宝箱 "]
      }
    ]
  },
  {
    path: "/toyGrab/financialStatistics/reconciliationAnalysisQE",
    icon: "elextra-icon-finance",
    component: Layout,
    redirect: "/toyGrab/financialStatistics/reconciliationAnalysisQE",
    name: "财务统计",
    children: [
      {
        path: "/toyGrab/financialStatistics/reconciliationAnalysisQE",
        component: reconciliationAnalysisQE,
        icon: "el-icon-star-on",
        name: "企鹅对账明细",
        meta: ["财务统计", "企鹅对账明细"],
        attr: { role: ["boss"] }
      },
      {
        path: "/toyGrab/financialStatistics/incomeStatementQE",
        component: incomeStatementQE,
        icon: "el-icon-star-on",
        name: "企鹅收入结算表",
        meta: ["财务统计", "企鹅收入结算表"],
        attr: { role: ["boss"] }
      },
      {
        path: "/toyGrab/financialStatistics/penguinSummaryQE",
        component: penguinSummaryQE,
        icon: "el-icon-star-on",
        name: "企鹅汇总明细表",
        meta: ["财务统计", "企鹅汇总明细表"],
        attr: { role: ["boss"] }
      },
      {
        path: "/toyGrab/financialStatistics/inventoryManagementQE",
        component: inventoryManagementQE,
        icon: "el-icon-star-on",
        name: "企鹅进销存明细表",
        meta: ["财务统计", "企鹅进销存明细表"],
        attr: { role: ["boss"] }
      }
    ]
  },
  /*{
    path: "/auction",
    icon: "elextra-icon-market",
    component: Layout,
    redirect: "/auction/operatingSituation",
    noDropdown: true,
    name: "拍卖首页",
    children: [
      {
        path: "/auction/operatingSituation",
        component: operatingSituation,
        name: "拍卖首页"
      }
    ]
  },
  {
    path: "/auction/market",
    icon: "elextra-icon-market2",
    component: Layout,
    redirect: "/auction/market/newChannelView",
    name: "市场详情",
    children: [
      {
        path: "/auction/market/marketView",
        icon: "el-icon-star-on",
        component: marketView,
        name: "市场看板",
        meta: ["市场详情", "市场看板"]
      },
      {
        path: "/auction/market/newChannelView",
        icon: "el-icon-star-on",
        component: newChannelView,
        name: "渠道信息表",
        meta: ["市场详情", "渠道信息表"]
      },
      {
        path: "/auction/market/promotionEffectStatistics",
        icon: "el-icon-star-on",
        component: promotionEffectStatistics,
        name: "渠道推广效果统计",
        meta: ["市场详情", "渠道推广效果统计"]
      },
      {
        path: "/auction/market/dailyPromotionEffectStatistics",
        icon: "el-icon-star-on",
        component: dailyPromotionEffectStatistics,
        name: "渠道每日统计",
        meta: ["市场详情", "渠道每日统计"]
      },
      {
        path: "/auction/market/promotionChannelStatisticsWeekly",
        icon: "el-icon-star-on",
        component: promotionChannelStatisticsWeekly,
        name: "渠道每周统计",
        meta: ["市场详情", "渠道每日统计"]
      },
      {
        path: "/auction/market/channelDODData",
        icon: "el-icon-star-on",
        component: channelDODData,
        name: "渠道日环比数据",
        meta: ["市场详情", "渠道日环比数据"]
      },
      {
        path: "/auction/market/channelWOWData",
        icon: "el-icon-star-on",
        component: channelWOWData,
        name: "渠道周环比数据",
        meta: ["市场详情", "渠道周环比数据"]
      },
      {
        path: "/auction/market/channelMOMData",
        icon: "el-icon-star-on",
        component: channelMOMData,
        name: "渠道月环比数据",
        meta: ["市场详情", "渠道月环比数据"]
      },
      {
        path: "/auction/market/channelQOQData",
        icon: "el-icon-star-on",
        component: channelQOQData,
        name: "渠道季环比数据",
        meta: ["市场详情", "渠道季环比数据"]
      },
      {
        path: "/auction/market/channelYOYData",
        icon: "el-icon-star-on",
        component: channelYOYData,
        name: "渠道年环比数据",
        meta: ["市场详情", "渠道年环比数据"]
      },
      {
        path: "/auction/market/channelUserActivity",
        icon: "el-icon-star-on",
        component: channelUserActivity,
        name: "渠道用户活跃情况",
        meta: ["市场详情", "渠道用户活跃情况"]
      }
    ]
  },
  {
    path: "/auction/operate",
    icon: "elextra-icon-operate",
    component: Layout,
    redirect: "/auction/operate/orderInfo",
    name: "运营分析",
    children: [
      {
        path: "/auction/operate/operateView",
        icon: "el-icon-star-on",
        component: operateView,
        name: "运营看板",
        meta: ["运营分析", "运营看板"]
      },
      {
        path: "/auction/operate/orderInfo",
        icon: "el-icon-star-on",
        component: orderInfo,
        name: "订单信息表",
        meta: ["运营分析", "订单信息表"]
      },
      {
        path: "/auction/operate/userInfo",
        icon: "el-icon-star-on",
        component: userInfo,
        name: "用户信息表",
        meta: ["运营分析", "用户信息表"]
      },
      {
        path: "/auction/operate/pagePVUV",
        icon: "el-icon-star-on",
        component: pagePVUV,
        name: "流量统计表",
        meta: ["运营分析", "流量统计表"]
      },
      {
        path: "/auction/operate/auctionRecord",
        icon: "el-icon-star-on",
        component: auctionRecord,
        name: "竞拍记录表",
        meta: ["运营分析", "竞拍记录表"]
      },
      {
        path: "/auction/operate/integralRecord",
        icon: "el-icon-star-on",
        component: integralRecord,
        name: "积分记录表",
        meta: ["运营分析", "积分记录表"]
      },
      {
        path: "/auction/operate/rechargeRecord",
        icon: "el-icon-star-on",
        component: rechargeRecord,
        name: "充值记录表",
        meta: ["运营分析", "充值记录表"]
      },
      {
        path: "/auction/operate/trafficStatistics",
        icon: "el-icon-star-on",
        component: trafficStatistics,
        name: "流量路径统计表",
        meta: ["运营分析", "流量路径统计表"]
      },
      {
        path: "/auction/operate/elementPVUV",
        icon: "el-icon-star-on",
        component: elementPVUV,
        name: "元素点击表",
        meta: ["运营分析", "元素点击表"]
      },
      {
        path: "/auction/operate/userBrowsingBehavior",
        icon: "el-icon-star-on",
        component: userBrowsingBehavior,
        name: "用户浏览行为表",
        meta: ["运营分析", "用户浏览行为表"]
      }
    ]
  },*/
  {
    path: "/user",
    component: Layout,
    redirect: "/user/userList",
    name: "用户信息管理",
    icon: "elextra-icon-user",
    children: [
      {
        path: "/user/userList",
        component: userList,
        icon: "el-icon-star-on",
        name: "用户列表",
        meta: ["用户信息管理", "用户列表"],
        attr: { role: ["boss"] }
      },
      {
        path: "/user/userAddressBook",
        component: userAddressBook,
        icon: "el-icon-star-on",
        name: "用户通讯录",
        meta: ["用户信息管理", "用户通讯录"],
        attr: { role: ["boss"] }
      },
      {
        path: "/user/bankCardsList",
        component: bankCardsList,
        name: "银行卡列表",
        icon: "el-icon-star-on",
        meta: ["用户信息管理", "银行卡列表"],
        attr: { role: ["finance", "boss"] }
      },
      {
        path: "/user/userNameAuthenticationList",
        component: userNameAuthenticationList,
        icon: "el-icon-star-on",
        name: "用户实名认证列表",
        meta: ["用户信息管理", "用户实名认证列表"],
        attr: { role: ["boss"] }
      },
      {
        path: "/user/userAuthenticationList",
        component: userAuthenticationList,
        icon: "el-icon-star-on",
        name: "用户认证列表",
        meta: ["用户信息管理", "用户认证列表"],
        attr: { role: ["boss"] }
      },
      {
        path: "/user/discountCoupon",
        component: discountCoupon,
        icon: "el-icon-star-on",
        name: "优惠券信息列表",
        meta: ["用户信息管理", "优惠券信息列表"],
        attr: { role: ["boss"] }
      },
      {
        path: "/user/newUserTagList",
        component: newUserTagList,
        icon: "el-icon-star-on",
        name: "新用户用户标签列表",
        meta: ["用户信息管理", "新用户用户标签列表"],
        attr: { role: ["boss"] }
      },
      {
        path: "/user/oldUserTagList",
        component: oldUserTagList,
        icon: "el-icon-star-on",
        name: "老用户用户标签列表",
        meta: ["用户信息管理", "老用户用户标签列表"],
        attr: { role: ["boss"] }
      }
    ]
  },
  {
    path: "/loanManagement",
    component: Layout,
    redirect: "/loanManagement/loanApplicationsList",
    name: "借款管理",
    icon: "elextra-icon-loan",
    children: [
      {
        path: "/loanManagement/loanApplicationsList",
        component: loanApplicationsList,
        icon: "el-icon-star-on",
        name: "借款申请列表",
        meta: ["借款管理", "借款申请列表"],
        attr: { role: ["boss"] }
      },
      {
        path: "/loanManagement/loanAuditList",
        component: loanAuditList,
        icon: "el-icon-star-on",
        name: "放款审核列表",
        meta: ["借款管理", "放款审核列表"],
        attr: { role: ["boss"] }
      },
      {
        path: "/loanManagement/raiseQuotaRecord",
        component: raiseQuotaRecord,
        name: "提额记录表",
        icon: "el-icon-star-on",
        meta: ["借款管理", "提额记录表"],
        attr: { role: ["finance", "boss"] }
      },
      {
        path: "/loanManagement/reconciliationFunction",
        component: reconciliationFunction,
        icon: "el-icon-star-on",
        name: "对账功能",
        meta: ["借款管理", "对账功能"],
        attr: { role: ["boss"] }
      },
      {
        path: "/loanManagement/assetInformation",
        component: assetInformation,
        icon: "el-icon-star-on",
        name: "资产信息-招财猫",
        meta: ["借款管理", "资产信息-招财猫"],
        attr: { role: ["boss"] }
      }
    ]
  },
  {
    path: "/repaymentManagement",
    component: Layout,
    redirect: "/repaymentManagement/repaymentList",
    name: "还款管理",
    icon: "elextra-icon-repay",
    children: [
      {
        path: "/repaymentManagement/repaymentList",
        redirect: "/repaymentManagement/repaymentList/waitingForReturnList",
        icon: "elextra-icon-item",
        component: rmabLayout,
        name: "还款列表",
        children: [
          {
            path: "/repaymentManagement/repaymentList/waitingForReturnList",
            icon: "el-icon-star-on",
            component: waitingForReturnList,
            name: "待还列表",
            meta: ["还款管理", "还款列表", "待还列表"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/repaymentManagement/repaymentList/returnedList",
            icon: "el-icon-star-on",
            component: returnedList,
            name: "已还列表",
            meta: ["还款管理", "还款列表", "已还列表"],
            attr: { role: ["admin", "boss"] }
          }
        ]
      },
      {
        path: "/repaymentManagement/reconciliationList",
        redirect:
          "/repaymentManagement/reconciliationList/repaymentReconciliation",
        icon: "elextra-icon-item",
        component: rmabLayout,
        name: "对账列表",
        children: [
          {
            path:
              "/repaymentManagement/reconciliationList/repaymentReconciliation",
            icon: "el-icon-star-on",
            component: repaymentReconciliation,
            name: "还款对账",
            meta: ["还款管理", "对账列表", "还款对账"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path:
              "/repaymentManagement/reconciliationList/renewalReconciliation",
            icon: "el-icon-star-on",
            component: renewalReconciliation,
            name: "续期对账",
            meta: ["还款管理", "对账列表", "续期对账"],
            attr: { role: ["admin", "boss"] }
          }
        ]
      },
      {
        path: "/repaymentManagement/refundList",
        redirect: "/repaymentManagement/refundList/repaymentDetails",
        icon: "elextra-icon-item",
        component: rmabLayout,
        name: "退款列表",
        children: [
          {
            path: "/repaymentManagement/refundList/repaymentDetails",
            icon: "el-icon-star-on",
            component: repaymentDetails,
            name: "还款详情",
            meta: ["还款管理", "退款列表", "还款详情"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/repaymentManagement/refundList/renewalParticulars",
            icon: "el-icon-star-on",
            component: renewalParticulars,
            name: "续期详情",
            meta: ["还款管理", "退款列表", "续期详情"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/repaymentManagement/refundList/rebackedList",
            icon: "el-icon-star-on",
            component: rebackedList,
            name: "已退列表",
            meta: ["还款管理", "退款列表", "已退列表"],
            attr: { role: ["admin", "boss"] }
          }
        ]
      },
      {
        path: "/repaymentManagement/renewalManagement",
        redirect: "/repaymentManagement/renewalManagement/repaymentDetails",
        icon: "elextra-icon-item",
        component: rmabLayout,
        name: "续期管理",
        children: [
          {
            path: "/repaymentManagement/renewalManagement/renewalsList",
            icon: "el-icon-star-on",
            component: renewalsList,
            name: "续期列表",
            meta: ["还款管理", "续期管理", "续期列表"],
            attr: { role: ["admin", "boss"] }
          }
        ]
      }
    ]
  },
  {
    path: "/dataAnalysis",
    component: Layout,
    redirect: "/dataAnalysis/financialData",
    name: "数据分析",
    icon: "elextra-icon-data",
    children: [
      {
        path: "/dataAnalysis/financialData",
        redirect: "/dataAnalysis/financialData/dailyLendingData",
        icon: "elextra-icon-item",
        component: rmabLayout,
        name: "财务数据",
        children: [
          {
            path: "/dataAnalysis/financialData/dailyLendingData",
            icon: "el-icon-star-on",
            component: dailyLendingData,
            name: "每日放款数据",
            meta: ["数据分析", "每日放款数据"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/dataAnalysis/financialData/dailyRepaymentUnitData",
            icon: "el-icon-star-on",
            component: dailyRepaymentUnitData,
            name: "每日还款单位数据",
            meta: ["数据分析", "财务数据", "每日还款单位数据"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/dataAnalysis/financialData/daysStageStatistics",
            icon: "el-icon-star-on",
            component: daysStageStatistics,
            name: "21天分期统计",
            meta: ["数据分析", "财务数据", "21天分期统计"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/dataAnalysis/financialData/installmentPromotionStatistics",
            icon: "el-icon-star-on",
            component: installmentPromotionStatistics,
            name: "21天分期提额统计",
            meta: ["数据分析", "财务数据", "21天分期提额统计"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/dataAnalysis/financialData/daysStageStatistics90",
            icon: "el-icon-star-on",
            component: daysStageStatistics90,
            name: "90天分期统计",
            meta: ["数据分析", "财务数据", "90天分期统计"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/dataAnalysis/financialData/dailyRepaymentAmountData",
            icon: "el-icon-star-on",
            component: dailyRepaymentAmountData,
            name: "每日还款金额(非分期)",
            meta: ["数据分析", "财务数据", "每日还款金额(非分期)"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/dataAnalysis/financialData/overdueRepaymentStatistics",
            icon: "el-icon-star-on",
            component: overdueRepaymentStatistics,
            name: "还款逾期统计",
            meta: ["数据分析", "财务数据", "还款逾期统计"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/dataAnalysis/financialData/fundAnalysis",
            icon: "el-icon-star-on",
            component: fundAnalysis,
            name: "资金分析",
            meta: ["数据分析", "财务数据", "资金分析"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/dataAnalysis/financialData/fundAnalysisProduct",
            icon: "el-icon-star-on",
            component: fundAnalysisProduct,
            name: "资金分析(分产品)",
            meta: ["数据分析", "财务数据", "资金分析(分产品)"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/dataAnalysis/financialData/collectionManagement",
            icon: "el-icon-star-on",
            component: collectionManagement,
            name: "催收管理",
            meta: ["数据分析", "财务数据", "催收管理"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/dataAnalysis/financialData/promptAmount",
            icon: "el-icon-star-on",
            component: promptAmount,
            name: "在催金额",
            meta: ["数据分析", "财务数据", "在催金额"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/dataAnalysis/financialData/prepaymentStatistics",
            icon: "el-icon-star-on",
            component: prepaymentStatistics,
            name: "提前还款统计",
            meta: ["数据分析", "财务数据", "提前还款统计"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/dataAnalysis/financialData/naturalChannelStatistics",
            icon: "el-icon-star-on",
            component: naturalChannelStatistics,
            name: "自然渠道统计",
            meta: ["数据分析", "财务数据", "自然渠道统计"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/dataAnalysis/financialData/couponStatistics",
            icon: "el-icon-star-on",
            component: couponStatistics,
            name: "必过券统计",
            meta: ["数据分析", "财务数据", "必过券统计"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/dataAnalysis/financialData/repaymentCouponAnalysis",
            icon: "el-icon-star-on",
            component: repaymentCouponAnalysis,
            name: "还款抵扣券分析",
            meta: ["数据分析", "财务数据", "还款抵扣券分析"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/dataAnalysis/financialData/hourlyRepaymentRateT",
            icon: "el-icon-star-on",
            component: hourlyRepaymentRateT,
            name: "分时段还款率",
            meta: ["数据分析", "财务数据", "分时段还款率"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/dataAnalysis/financialData/hourlyRepaymentRate",
            icon: "el-icon-star-on",
            hidden: true,
            component: hourlyRepaymentRate,
            name: "分时段还款率",
            meta: ["数据分析", "财务数据", "分时段还款率"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/dataAnalysis/financialData/keyData",
            icon: "el-icon-star-on",
            component: keyData,
            name: "关键数据",
            meta: ["数据分析", "财务数据", "关键数据"],
            attr: { role: ["admin", "boss"] }
          }
        ]
      },
      {
        path: "/dataReport/platformData",
        redirect: "/dataAnalysis/dataReport/platformData",
        icon: "elextra-icon-item",
        component: rmabLayout,
        name: "数据报表",
        children: [
          {
            path: "/dataAnalysis/dataReport/platformData",
            icon: "el-icon-star-on",
            component: platformData,
            name: "平台数据",
            meta: ["数据分析", "数据报表", "平台数据"],
            attr: { role: ["admin", "boss"] }
          }
        ]
      },
      {
        path: "/dataAnalysis/happyMall",
        redirect: "/dataAnalysis/happyMall/dailyExpenditureData",
        icon: "elextra-icon-item",
        component: rmabLayout,
        name: "开心商城",
        children: [
          {
            path: "/dataAnalysis/happyMall/dailyExpenditureData",
            icon: "el-icon-star-on",
            component: dailyExpenditureData,
            name: "每日支出数据",
            meta: ["数据分析", "开心商城", "每日支出数据"],
            attr: { role: ["admin", "boss"] }
          }
        ]
      },
      {
        path: "/dataAnalysis/cashBorrowed",
        redirect: "/dataAnalysis/cashBorrowed/dailyLendingData",
        icon: "elextra-icon-item",
        component: rmabLayout,
        name: "现金借呗",
        children: [
          {
            path: "/dataAnalysis/cashBorrowed/dailyLendingData",
            icon: "el-icon-star-on",
            component: dailyLendingDataXJJB,
            name: "每日放款数据-借呗",
            meta: ["数据分析", "现金借呗", "每日放款数据-借呗"],
            attr: { role: ["admin", "boss"] }
          },
          {
            path: "/dataAnalysis/cashBorrowed/dailyRepaymentUnitData",
            icon: "el-icon-star-on",
            component: dailyRepaymentUnitDataXJJB,
            name: "每日还款数据-借呗",
            meta: ["数据分析", "现金借呗", "每日还款数据-借呗"],
            attr: { role: ["admin", "boss"] }
          }
        ]
      }
    ]
  },
  {
    path: "/financeAnalysis",
    component: Layout,
    redirect: "/financeAnalysis/repaymentMinutia",
    name: "财务分析",
    icon: "elextra-icon-finance",
    children: [
      {
        path: "/financeAnalysis/repaymentMinutia",
        component: repaymentMinutia,
        icon: "el-icon-star-on",
        name: "还款明细",
        meta: ["财务分析", "还款明细"],
        attr: { role: ["boss"] }
      },
      {
        path: "/financeAnalysis/reconciliationAnalysis",
        component: reconciliationAnalysis,
        icon: "el-icon-star-on",
        name: "对账分析",
        meta: ["财务分析", "对账分析"],
        attr: { role: ["boss"] }
      },
      {
        path: "/financeAnalysis/reportStatistics",
        component: reportStatistics,
        name: "还款日报",
        icon: "el-icon-star-on",
        attr: { role: ["finance", "boss"] },
        meta: ["财务分析", "还款日报"]
      },
      {
        path: "/financeAnalysis/lendingDaily",
        component: lendingDaily,
        name: "放款日报",
        icon: "el-icon-star-on",
        attr: { role: ["finance", "boss"] },
        meta: ["财务分析", "放款日报"]
      }
    ]
  },
  {
    path: "/promotionManagement",
    component: Layout,
    redirect: "/promotionManagement/promotionChannel",
    name: "推广管理",
    icon: "elextra-icon-promotion",
    attr: { role: ["admin", "boss"] },
    children: [
      {
        path: "/promotionManagement/promotionChannel",
        component: promotionChannel,
        icon: "el-icon-star-on",
        name: "推广渠道",
        attr: { role: ["boss"] },
        meta: ["推广管理", "推广渠道"]
      },
      {
        path: "/promotionManagement/promoterManagement",
        component: promoterManagement,
        icon: "el-icon-star-on",
        name: "推广员管理",
        attr: { role: ["boss"] },
        meta: ["推广管理", "推广员管理"]
      },
      {
        path: "/promotionManagement/promotionChannelStatistics",
        component: promotionChannelStatistics,
        name: "推广统计(渠道)",
        icon: "el-icon-star-on",
        attr: { role: ["finance", "boss"] },
        meta: ["推广管理", "推广统计(渠道)"]
      },
      {
        path: "/promotionManagement/promotionChannelStatistics7",
        component: promotionChannelStatistics7,
        name: "七日推广统计(渠道)",
        icon: "el-icon-star-on",
        attr: { role: ["finance", "boss"] },
        meta: ["推广管理", "七日推广统计(渠道)"]
      },
      {
        path: "/promotionManagement/promotionRegionStatistics",
        component: promotionRegionStatistics,
        icon: "el-icon-star-on",
        name: "推广统计(地区)",
        attr: { role: ["boss"] },
        meta: ["推广管理", "推广统计(地区)"]
      },
      {
        path: "/promotionManagement/channelStatisticsSummary",
        component: channelStatisticsSummary,
        name: "渠道统计汇总",
        icon: "el-icon-star-on",
        attr: { role: ["finance", "boss"] },
        meta: ["推广管理", "渠道统计汇总"]
      },
      {
        path: "/promotionManagement/registrationStatisticsReport",
        component: registrationStatisticsReport,
        name: "注册量统计报表",
        icon: "el-icon-star-on",
        attr: { role: ["finance", "boss"] },
        meta: ["推广管理", "注册量统计报表"]
      },
      {
        path: "/promotionManagement/PVUV",
        icon: "el-icon-star-on",
        component: PVUV,
        name: "贷款超市-PVUV",
        meta: ["推广管理", "贷款超市-PVUV"],
        attr: { role: ["admin"] }
      }
    ]
  },
  {
    path: "/evaluation",
    component: Layout,
    redirect: "/evaluation/achievements",
    name: "绩效考评",
    icon: "elextra-icon-kpi",
    children: [
      {
        path: "/evaluation/achievements",
        component: achievements,
        icon: "el-icon-star-on",
        name: "部门绩效考评",
        meta: ["绩效考评", "部门绩效考评"],
        attr: { role: ["boss"] }
      }
    ]
  },
  {
    path: "/privilegeManage",
    component: Layout,
    redirect: "/privilegeManage/employeeList",
    name: "权限管理",
    icon: "elextra-icon-privilage",
    children: [
      {
        path: "/privilegeManage/employeeList",
        component: employeeList,
        icon: "el-icon-star-on",
        name: "员工信息",
        meta: ["权限管理", "员工信息"],
        attr: { role: ["boss"] }
      }
    ]
  },
  {
    path: "/lab",
    component: Layout,
    redirect: "/lab/deleteRobotInfo",
    name: "实验室",
    icon: "elextra-icon-bulb1",
    children: [
      {
        path: "/lab/deleteRobotInfo",
        icon: "el-icon-star-on",
        component: deleteRobotInfo,
        name: "任意门",
        meta: ["实验室", "任意门"]
      }
    ]
  },
  {
    path: "/period/loan",
    redirect: "/period/loan/periodDailyLendingData",
    icon: "elextra-icon-myLoan",
    component: Layout,
    name: "黑卡",
    children: [
      {
        path: "/period/loan/periodDailyLendingData",
        icon: "el-icon-star-on",
        component: periodDailyLendingData,
        name: "每日放款记录",
        meta: ["开心分期", "黑卡", "每日放款记录"]
      },
      {
        path: "/period/loan/periodDailyRepaymentAmountData",
        icon: "el-icon-star-on",
        component: periodDailyRepaymentAmountData,
        name: "每日还款金额记录",
        meta: ["开心分期", "黑卡", "每日还款金额记录"]
      },
      {
        path: "/period/loan/repaymentDetailData",
        icon: "el-icon-star-on",
        component: repaymentDetailData,
        name: "每日还款明细记录",
        meta: ["开心分期", "黑卡", "每日还款明细记录"]
      },
      {
        path: "/period/mall/finance/dailySettlementReport",
        icon: "el-icon-star-on",
        component: dailySettlementReport,
        name: "每日结算报表",
        meta: ["开心分期", "黑卡", "每日结算报表"]
      },
      {
        path: "/period/mall/finance/dailyClaimsReport",
        icon: "el-icon-star-on",
        component: dailyClaimsReport,
        name: "每日债权报表",
        meta: ["开心分期", "黑卡", "每日债权报表"]
      },
      {
        path: "/period/loan/periodOverdueRepaymentStatistics",
        icon: "el-icon-star-on",
        component: periodOverdueRepaymentStatistics,
        name: "还款逾期记录",
        meta: ["开心分期", "黑卡", "还款逾期记录"]
      },
      {
        path: "/period/loan/promptAmountData",
        icon: "el-icon-star-on",
        component: promptAmountData,
        name: "在催金额记录",
        meta: ["开心分期", "黑卡", "在催金额记录"]
      },
      {
        path: "/period/loan/monthlySettlementData",
        icon: "el-icon-star-on",
        component: monthlySettlementData,
        name: "每月结算表",
        meta: ["开心分期", "黑卡", "每月结算表"]
      },
      {
        path: "/period/loan/monthlyBondData",
        icon: "el-icon-star-on",
        component: monthlyBondData,
        name: "每月债权报表",
        meta: ["开心分期", "黑卡", "每月债权报表"]
      },
      {
        path: "/period/mall/finance/ZCMRepaymentDataReconciliation",
        icon: "el-icon-star-on",
        component: ZCMRepaymentDataReconciliation,
        name: "ZCM还款数据核对",
        meta: ["开心分期", "黑卡", "ZCM还款数据核对"]
      },
      {
        path: "/period/loan/ZBrepaymentData",
        icon: "el-icon-star-on",
        component: ZBrepaymentData,
        name: "ZB还款数据核对",
        meta: ["开心分期", "黑卡", "ZB还款数据核对"]
      },
      {
        path: "/period/loan/dataCheckXN",
        icon: "el-icon-star-on",
        component: dataCheckXN,
        name: "XN还款数据核对",
        meta: ["开心分期", "黑卡", "XN还款数据核对"]
      },
      {
        path: "/period/loan/repaymentReconciliationZFB",
        icon: "el-icon-star-on",
        component: repaymentReconciliationZFB,
        name: "支付宝还款对账",
        meta: ["开心分期", "黑卡", "支付宝还款对账"]
      },
      {
        path: "/period/loan/threePartyAccountAnalysis",
        icon: "el-icon-star-on",
        component: threePartyAccountAnalysis,
        name: "三方对账分析",
        meta: ["开心分期", "黑卡", "三方对账分析"]
      }
    ]
  },
  {
    path: "/period/mall",
    redirect: "/period/mall/finance/totalIncome",
    icon: "elextra-icon-mall",
    component: Layout,
    name: "商城",
    children: [
      {
        path: "/period/mall/finance/finance",
        redirect: "/period/mall/finance/totalIncome",
        icon: "elextra-icon-item",
        component: rmabLayout,
        name: "财务对账",
        children: [
          {
            path: "/period/mall/finance/totalIncome",
            icon: "el-icon-star-on",
            component: totalIncome,
            name: "收入结算总表",
            meta: ["开心分期", "商城", "财务对账", "收入结算总表"]
          },
          {
            path: "/period/mall/finance/detailIncome",
            icon: "el-icon-star-on",
            component: detailIncome,
            name: "收入结算明细表",
            meta: ["开心分期", "商城", "财务对账", "收入结算明细表"]
          },
          {
            path: "/period/mall/finance/rechargeOfChangeReport",
            icon: "el-icon-star-on",
            component: rechargeOfChangeReport,
            name: "零钱充值对账分析",
            meta: ["开心分期", "商城", "财务对账", "零钱充值对账分析"]
          },
          {
            path: "/period/mall/finance/totalSales",
            icon: "el-icon-star-on",
            component: totalSales,
            name: "总销售额统计表",
            meta: ["开心分期", "商城", "财务对账", "总销售额统计表"]
          },
          {
            path: "/period/mall/finance/detailSales",
            icon: "el-icon-star-on",
            component: detailSales,
            name: "商品销售记录",
            meta: ["开心分期", "商城", "财务对账", "商品销售记录"]
          },
          {
            path: "/period/mall/finance/detailOrder",
            icon: "el-icon-star-on",
            component: detailOrder,
            name: "订单详情记录",
            meta: ["开心分期", "商城", "财务对账", "订单详情记录"]
          },
          {
            path: "/period/mall/finance/dailyPocketMoneyAnalysis",
            icon: "el-icon-star-on",
            component: dailyPocketMoneyAnalysis,
            name: "每日零钱资金分析表",
            meta: ["开心分期", "商城", "财务对账", "每日零钱资金分析表"]
          },
          {
            path: "/period/mall/finance/dailyPackageIncomeStatement",
            icon: "el-icon-star-on",
            component: dailyPackageIncomeStatement,
            name: "每日大礼包收入报表",
            meta: ["开心分期", "商城", "财务对账", "每日大礼包收入报表"]
          },
          {
            path: "/period/mall/finance/dailyMallOrderReport",
            icon: "el-icon-star-on",
            component: dailyMallOrderReport,
            name: "每日商城订单报表",
            meta: ["开心分期", "商城", "财务对账", "每日商城订单报表"]
          },
          {
            path: "/period/mall/finance/mallMonthlyReport",
            icon: "el-icon-star-on",
            component: mallMonthlyReport,
            name: "商城月报表",
            meta: ["开心分期", "商城", "财务对账", "商城月报表"]
          },
          {
            path: "/period/mall/finance/changeFundAccountStatement",
            icon: "el-icon-star-on",
            component: changeFundAccountStatement,
            name: "零钱资金账户明细表",
            meta: ["开心分期", "商城", "财务对账", "零钱资金账户明细表"]
          }
        ]
      }
    ]
  },
  {
    path: "/period/market",
    redirect: "/period/market/totalIncome",
    icon: "elextra-icon-market2",
    component: Layout,
    name: "市场统计",
    children: [
      {
        path: "/period/market/channelStatistics",
        icon: "el-icon-star-on",
        component: channelStatistics,
        name: "渠道统计表",
        meta: ["开心分期", "市场统计", "渠道统计表"]
      },
      {
        path: "/period/market/channelSummaryStatistics",
        icon: "el-icon-star-on",
        component: channelSummaryStatistics,
        name: "渠道统计汇总表",
        meta: ["开心分期", "市场统计", "渠道统计汇总表"]
      },
      {
        path: "/period/market/channelPromotionInformation",
        icon: "el-icon-star-on",
        component: channelPromotionInformation,
        name: "渠道推广信息表",
        meta: ["开心分期", "市场统计", "渠道推广信息表"]
      },
      {
        path: "/period/market/promotionInformation",
        icon: "el-icon-star-on",
        component: promotionInformation,
        name: "推广员信息表",
        meta: ["开心分期", "市场统计", "推广员信息表"]
      },
      {
        path: "/period/market/registrationStatisticsReportFQ",
        icon: "el-icon-star-on",
        component: registrationStatisticsReportFQ,
        name: "注册量统计表",
        meta: ["开心分期", "市场统计", "注册量统计表"]
      },
      {
        path: "/period/market/promotionStatisticsArea",
        icon: "el-icon-star-on",
        component: promotionStatisticsArea,
        name: "推广统计-地区",
        meta: ["开心分期", "市场统计", "推广统计-地区"]
      },
      {
        path: "/period/market/promotionStatisticalChannel",
        icon: "el-icon-star-on",
        component: promotionStatisticalChannel,
        name: "推广统计-渠道",
        meta: ["开心分期", "市场统计", "推广统计-渠道"]
      }
    ]
  },
  { path: "*", component: error, hidden: true }
];
