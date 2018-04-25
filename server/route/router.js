let express = require('express')
let redis = require('redis')
let db = require('../config/db')
let jwt = require('jwt-simple')

//登录验证
let login = require('../controller/login/login')
//拉取信息
let getLoginInfo = require('../controller/getLoginInfo/getLoginInfo')
//首页
let main = require('../controller/main/main')
//修改密码
let passwordModify = require('../controller/passwordModify/passwordModify')
//用户信息管理
let userList = require('../controller/userInformationManagement/userList/userList')
let userAddressBook = require('../controller/userInformationManagement/userAddressBook/userAddressBook')
let bankcardsList = require('../controller/userInformationManagement/bankcardsList/bankcardsList')
let userNameAuthenticationList = require('../controller/userInformationManagement/userNameAuthenticationList/userNameAuthenticationList')
let userAuthenticationList = require('../controller/userInformationManagement/userAuthenticationList/userAuthenticationList')
let discountCoupon = require('../controller/userInformationManagement/discountCoupon/discountCoupon')
let newUserTagList = require('../controller/userInformationManagement/newUserTagList/newUserTagList')
let oldUserTagList = require('../controller/userInformationManagement/oldUserTagList/oldUserTagList')
//RMAB
let loanThroughRate = require('../controller/RMAB/market/loanThroughRate/loanThroughRate')
let loanThroughRateAll = require('../controller/RMAB/market/loanThroughRate/loanThroughRateAll')
let loanOverdueRecallRate = require('../controller/RMAB/collection/loanOverdueRecallRate/loanOverdueRecallRate')
let userBasePortrait = require('../controller/RMAB/userPortrait/userBasePortrait/userBasePortrait')
let operationUserPortrait = require('../controller/RMAB/userPortrait/operationUserPortrait/operationUserPortrait')
let invitationEvent = require('../controller/RMAB/operate/invitationEvent/invitationEvent')
let riskControlFactorAnalysis = require('../controller/RMAB/riskManagement/riskControlFactorAnalysis/riskControlFactorAnalysis')
//图表
let daylyPassRateTrends = require('../controller/charts/tab1/passRateTrends')
let daylyPassRateTrends1 = require('../controller/charts/tab2/passRateTrends')
let daylyPassRateTrends2 = require('../controller/charts/tab3/passRateTrends')
//企鹅抓娃娃
let dataOverview = require('../controller/toyGrab/market/dataOverview/dataOverview')
let dataOverviewAll = require('../controller/toyGrab/market/dataOverview/dataOverviewAll')
let promotionChannelStatisticsQE = require('../controller/toyGrab/market/promotionChannelStatisticsQE/promotionChannelStatisticsQE')
let promotionOPPOStatisticsQE = require('../controller/toyGrab/market/promotionOPPOStatisticsQE/promotionOPPOStatisticsQE')
let userRechargeTimeAnalysisQE = require('../controller/toyGrab/market/userRechargeTimeAnalysisQE/userRechargeTimeAnalysisQE')
let torechargePVUV = require('../controller/toyGrab/buriaPointAnalysis/torechargePVUV/torechargePVUV')
let roomPVUV = require('../controller/toyGrab/buriaPointAnalysis/roomPVUV/roomPVUV')
let arbitraryGatePVUV = require('../controller/toyGrab/buriaPointAnalysis/arbitraryGatePVUV/arbitraryGatePVUV')
let bannerPVUV = require('../controller/toyGrab/buriaPointAnalysis/bannerPVUV/bannerPVUV')
let exchangePVUV = require('../controller/toyGrab/buriaPointAnalysis/exchangePVUV/exchangePVUV')
let level1Room = require('../controller/toyGrab/buriaPointAnalysis/level1Room/level1Room')
let rechargeActivities = require('../controller/toyGrab/buriaPointAnalysis/rechargeActivities/rechargeActivities')
let operatingWindow = require('../controller/toyGrab/buriaPointAnalysis/operatingWindow/operatingWindow')
let treasureBox = require('../controller/toyGrab/buriaPointAnalysis/treasureBox/treasureBox')
let userRechargeIntervalAnalysisQE = require('../controller/toyGrab/market/userRechargeIntervalAnalysisQE/userRechargeIntervalAnalysisQE')
let userRechargeIntervalAnalysisWeeklyQE = require('../controller/toyGrab/market/userRechargeIntervalAnalysisWeeklyQE/userRechargeIntervalAnalysisWeeklyQE')
let reconciliationAnalysisQE = require('../controller/toyGrab/financialStatistics/reconciliationAnalysisQE/reconciliationAnalysisQE')
let incomeStatementQE = require('../controller/toyGrab/financialStatistics/incomeStatementQE/incomeStatementQE')
let penguinSummaryQE = require('../controller/toyGrab/financialStatistics/penguinSummaryQE/penguinSummaryQE')
let inventoryManagementQE = require('../controller/toyGrab/financialStatistics/inventoryManagementQE/inventoryManagementQE')
//竞拍
let newChannelView = require('../controller/auction/market/newChannelView/newChannelView')
let promotionEffectStatistics = require('../controller/auction/market/promotionEffectStatistics/promotionEffectStatistics')
let dailyPromotionEffectStatistics = require('../controller/auction/market/dailyPromotionEffectStatistics/dailyPromotionEffectStatistics')
let promotionChannelStatisticsWeekly = require('../controller/auction/market/promotionChannelStatisticsWeekly/promotionChannelStatisticsWeekly')
let channelDODData = require('../controller/auction/market/channelDODData/channelDODData')
let channelWOWData = require('../controller/auction/market/channelWOWData/channelWOWData')
let channelMOMData = require('../controller/auction/market/channelMOMData/channelMOMData')
let channelQOQData = require('../controller/auction/market/channelQOQData/channelQOQData')
let channelYOYData = require('../controller/auction/market/channelYOYData/channelYOYData')
let marketView = require('../controller/auction/market/marketView/marketView')
let channelUserActivity = require('../controller/auction/market/channelUserActivity/channelUserActivity')
let orderInfo = require('../controller/auction/operate/orderInfo/orderInfo')
let userInfo = require('../controller/auction/operate/userInfo/userInfo')
let pagePVUV = require('../controller/auction/operate/pagePVUV/pagePVUV')
let auctionRecord = require('../controller/auction/operate/auctionRecord/auctionRecord')
let integralRecord = require('../controller/auction/operate/integralRecord/integralRecord')
let rechargeRecord = require('../controller/auction/operate/rechargeRecord/rechargeRecord')
let trafficStatistics = require('../controller/auction/operate/trafficStatistics/trafficStatistics')
let elementPVUV = require('../controller/auction/operate/elementPVUV/elementPVUV')
let userBrowsingBehavior = require('../controller/auction/operate/userBrowsingBehavior/userBrowsingBehavior')
let deleteRobotInfo = require('../controller/auction/lab/deleteRobotInfo/deleteRobotInfo')
let operateView = require('../controller/auction/operate/operateView/operateView')
let operatingSituation = require('../controller/auction/operate/operatingSituation/operatingSituation')

//借款管理
let loanApplicationsList = require('../controller/loanManagement/loanApplicationsList/loanApplicationsList')
let loanAuditList = require('../controller/loanManagement/loanAuditList/loanAuditList')
let raiseQuotaRecord = require('../controller/loanManagement/raiseQuotaRecord/raiseQuotaRecord')
let reconciliationFunction = require('../controller/loanManagement/reconciliationFunction/reconciliationFunction')
let assetInformation = require('../controller/loanManagement/assetInformation/assetInformation')
//还款管理
let waitingForReturnList = require('../controller/repaymentManagement/repaymentList/waitingForReturnList/waitingForReturnList')
let returnedList = require('../controller/repaymentManagement/repaymentList/returnedList/returnedList')
let repaymentReconciliation = require('../controller/repaymentManagement/reconciliationList/repaymentReconciliation/repaymentReconciliation')
let renewalReconciliation = require('../controller/repaymentManagement/reconciliationList/renewalReconciliation/renewalReconciliation')
let repaymentDetails = require('../controller/repaymentManagement/refundList/repaymentDetails/repaymentDetails')
let renewalParticulars = require('../controller/repaymentManagement/refundList/renewalParticulars/renewalParticulars')
let rebackedList = require('../controller/repaymentManagement/refundList/rebackedList/rebackedList')
//续期管理
let renewalsList = require('../controller/repaymentManagement/renewalManagement/renewalsList/renewalsList')
//数据分析
let dailyRepaymentAmountData = require('../controller/dataAnalysis/financialData/dailyRepaymentAmountData/dailyRepaymentAmountData')
let dailyRepaymentUnitData = require('../controller/dataAnalysis/financialData/dailyRepaymentUnitData/dailyRepaymentUnitData')
let daysStageStatistics21 = require('../controller/dataAnalysis/financialData/21daysStageStatistics/21daysStageStatistics')
let daysStageStatistics90 = require('../controller/dataAnalysis/financialData/90daysStageStatistics/90daysStageStatistics')
let installmentPromotionStatistics21 = require('../controller/dataAnalysis/financialData/21installmentPromotionStatistics/21installmentPromotionStatistics')
let dailyLendingData = require('../controller/dataAnalysis/financialData/dailyLendingData/dailyLendingData')
let overdueRepaymentStatistics = require('../controller/dataAnalysis/financialData/overdueRepaymentStatistics/overdueRepaymentStatistics')
let fundAnalysis = require('../controller/dataAnalysis/financialData/fundAnalysis/fundAnalysis')
let fundAnalysisProduct = require('../controller/dataAnalysis/financialData/fundAnalysisProduct/fundAnalysisProduct')
let collectionManagement = require('../controller/dataAnalysis/financialData/collectionManagement/collectionManagement')
let promptAmount = require('../controller/dataAnalysis/financialData/promptAmount/promptAmount')
let platformData = require('../controller/dataAnalysis/dataReport/platformData/platformData')
let prepaymentStatistics = require('../controller/dataAnalysis/financialData/prepaymentStatistics/prepaymentStatistics')
let naturalChannelStatistics = require('../controller/dataAnalysis/financialData/naturalChannelStatistics/naturalChannelStatistics')
let couponStatistics = require('../controller/dataAnalysis/financialData/couponStatistics/couponStatistics')
let repaymentCouponAnalysis = require('../controller/dataAnalysis/financialData/repaymentCouponAnalysis/repaymentCouponAnalysis')
let hourlyRepaymentRate = require('../controller/dataAnalysis/financialData/hourlyRepaymentRate/hourlyRepaymentRate')
let keyData = require('../controller/dataAnalysis/financialData/keyData/keyData')
//开心商城
let dailyExpenditureData = require('../controller/dataAnalysis/happyMall/dailyExpenditureData/dailyExpenditureData')
//现金借呗
let dailyLendingDataXJJB = require('../controller/dataAnalysis/cashBorrowed/dailyLendingData/dailyLendingData')
let dailyRepaymentUnitDataXJJB = require('../controller/dataAnalysis/cashBorrowed/dailyRepaymentUnitData/dailyRepaymentUnitData')
//财务分析
let repaymentMinutia = require('../controller/financeAnalysis/repaymentMinutia/repaymentMinutia')
let reconciliationAnalysis = require('../controller/financeAnalysis/reconciliationAnalysis/reconciliationAnalysis')
let reportStatistics = require('../controller/financeAnalysis/reportStatistics/reportStatistics')
let lendingDaily = require('../controller/financeAnalysis/lendingDaily/lendingDaily')
// 推广管理
let promotionChannel = require('../controller/promotionManagement/promotionChannel/promotionChannel')
let promoterManagement = require('../controller/promotionManagement/promoterManagement/promoterManagement')
let promotionChannelStatistics = require('../controller/promotionManagement/promotionChannelStatistics/promotionChannelStatistics')
let promotionChannelStatistics7 = require('../controller/promotionManagement/promotionChannelStatistics7Days/promotionChannelStatistics7Days')
let promotionRegionStatistics = require('../controller/promotionManagement/promotionRegionStatistics/promotionRegionStatistics')
let channelStatisticsSummary = require('../controller/promotionManagement/channelStatisticsSummary/channelStatisticsSummary')
let PVUV = require('../controller/promotionManagement/PVUV/PVUV')
//绩效考评
let achievements = require('../controller/evaluation/achievements/achievements')
//权限管理
//员工信息
let employeeList = require('../controller/privilegeManage/employeeList/employeeList')
//开心分期
/**黑卡 */
let periodDailyLendingData = require('../controller/period/loan/periodDailyLendingData/periodDailyLendingData')
let periodOverdueRepaymentStatistics = require('../controller/period/loan/periodOverdueRepaymentStatistics/periodOverdueRepaymentStatistics')
let periodDailyRepaymentAmountData = require('../controller/period/loan/periodDailyRepaymentAmountData/periodDailyRepaymentAmountData')
let promptAmountData = require('../controller/period/loan/promptAmountData/promptAmountData')
let repaymentDetailData = require('../controller/period/loan/repaymentDetailData/repaymentDetailData')
let dailySettlementReport = require('../controller/period/loan/dailySettlementReport/dailySettlementReport')
let dailyClaimsReport = require('../controller/period/loan/dailyClaimsReport/dailyClaimsReport')
let ZCMRepaymentDataReconciliation = require('../controller/period/loan/ZCMRepaymentDataReconciliation/ZCMRepaymentDataReconciliation')
let ZBrepaymentData = require('../controller/period/loan/ZBrepaymentData/ZBrepaymentData')
let monthlySettlementData = require('../controller/period/loan/monthlySettlementData/monthlySettlementData')
let monthlyBondData = require('../controller/period/loan/monthlyBondData/monthlyBondData')
let repaymentReconciliationZFB = require('../controller/period/loan/repaymentReconciliationZFB/repaymentReconciliationZFB')
let dataCheckXN = require('../controller/period/loan/dataCheckXN/dataCheckXN')
let threePartyAccountAnalysis = require('../controller/period/loan/threePartyAccountAnalysis/threePartyAccountAnalysis')
/**商城 */
let totalIncome = require('../controller/period/mall/totalIncome/totalIncome')
let detailIncome = require('../controller/period/mall/detailIncome/detailIncome')
let totalSales = require('../controller/period/mall/totalSales/totalSales')
let detailSales = require('../controller/period/mall/detailSales/detailSales')
let detailOrder = require('../controller/period/mall/detailOrder/detailOrder')
let dailyPocketMoneyAnalysis = require('../controller/period/mall/dailyPocketMoneyAnalysis/dailyPocketMoneyAnalysis')
let dailyPackageIncomeStatement = require('../controller/period/mall/dailyPackageIncomeStatement/dailyPackageIncomeStatement')
let dailyMallOrderReport = require('../controller/period/mall/dailyMallOrderReport/dailyMallOrderReport')
let rechargeOfChangeReport = require('../controller/period/mall/rechargeOfChangeReport/rechargeOfChangeReport')
let mallMonthlyReport = require('../controller/period/mall/mallMonthlyReport/mallMonthlyReport')
let changeFundAccountStatement = require('../controller/period/mall/changeFundAccountStatement/changeFundAccountStatement')
let channelStatistics = require('../controller/period/market/channelStatistics/channelStatistics')
let channelSummaryStatistics = require('../controller/period/market/channelSummaryStatistics/channelSummaryStatistics')
let api = require('../api')

let router = express.Router()

//总是被调用
router.use(function (req, resp, next) {
  if (req.method === 'POST') {
    if (req.url === '/api/login' || req.url === '/api/getLoginInfo' || req.url === '/api/getVerificationCode' || req.url === '/api/getPicCode' || req.url === '/api/loginEmail' || req.url === '/api/getInfoEmail' || req.url === '/api/modifyInfo') {
      next()
    } else {
      let token = req.get('X-Token')
      let secret = 'CFRSTokenRule'
      let prarm = ''
      if (jwt.decode(token, secret).phoneNumber) {
        prarm = jwt.decode(token, secret).phoneNumber + 'token'
      }
      if (jwt.decode(token, secret).email) {
        prarm = jwt.decode(token, secret).email
      }
      let client = redis.createClient(db.redisProp.port, db.redisProp.host)
      client.get(prarm, function (error, res) {
        if (error) {
          //这里要做处理
          console.log(error)
        } else {
          if (token === res) {
            next()
          } else {
            resp.json({
              code: '110'
            })
          }
        }
        client.quit()
      })
    }
  } else {
    next()
  }
})

/*登录验证*/
router.post(api.login, login.login)
router.post(api.getVerificationCode, login.getVerificationCode)
router.get(api.getPicCode, login.getPicCode)
router.post(api.login, login.getRoles)
router.post(api.loginEmail, login.loginEmail)
//更新颜色
router.post(api.updateColors, login.updateColors)
router.post(api.getColors, login.getColors)
/*拉取信息*/
router.post(api.getLoginInfo, getLoginInfo.getInfo)
router.post(api.getInfoEmail, getLoginInfo.getInfoEmail)
router.post(api.modifyInfo, getLoginInfo.modifyInfo)
/*首页*/
router.post(api.main, main.fetchAll)
/*修改密码*/
router.post(api.passwordConfirm, passwordModify.confirm)
router.post(api.passwordModify, passwordModify.modify)
/*用户信息管理*/
// 用户列表
router.post(api.userListCount, userList.getCount)
router.post(api.userList, userList.fetchAll)
// 用户通讯录
router.post(api.userAddressBookCount, userAddressBook.getCount)
router.post(api.userAddressBook, userAddressBook.fetchAll)
// 银行卡列表
router.post(api.bankcardsListCount, bankcardsList.getCount)
router.post(api.bankcardsList, bankcardsList.fetchAll)
// 用户认证列表
router.post(api.userAuthenticationListCount, userAuthenticationList.getCount)
router.post(api.userAuthenticationList, userAuthenticationList.fetchAll)
// 用户实名认证列表
router.post(api.userNameAuthenticationListCount, userNameAuthenticationList.getCount)
router.post(api.userNameAuthenticationList, userNameAuthenticationList.fetchAll)
// 优惠券信息
router.post(api.discountCouponCount, discountCoupon.getCount)
router.post(api.discountCoupon, discountCoupon.fetchAll)
router.get(api.discountCouponExcel, discountCoupon.getExcelData)
// 新用户用户标签列表
router.post(api.newUserTagListCount, newUserTagList.getCount)
router.post(api.newUserTagList, newUserTagList.fetchAll)
router.get(api.newUserTagListExcel, newUserTagList.getExcelData)
// 老用户用户标签列表
router.post(api.oldUserTagListCount, oldUserTagList.getCount)
router.post(api.oldUserTagList, oldUserTagList.fetchAll)
router.get(api.oldUserTagListExcel, oldUserTagList.getExcelData)

/*RMAB*/
// 借款通过率
router.post(api.loanThroughRate, loanThroughRate.fetchAll)
router.post(api.loanThroughRateAll, loanThroughRateAll.fetchAll)
router.get(api.loanThroughRateExcel, loanThroughRate.getExcelData)
router.post(api.loanOverdueRecallRate, loanOverdueRecallRate.fetchAll)
router.post(api.invitationEvent, invitationEvent.fetchAll)
router.post(api.riskControlFactorAnalysis, riskControlFactorAnalysis.fetchAll)
//图表
//tab1
router.post(api.dailyPassRateTrendsHourly, daylyPassRateTrends.getHoursly)
router.post(api.dailyPassRateTrendsDaily, daylyPassRateTrends.getDaily)
router.post(api.dailyPassRateTrendsWeekly, daylyPassRateTrends.getWeekly)
router.post(api.dailyPassRateTrendsMonthly, daylyPassRateTrends.getMonthly)
router.post(api.dailyPassRateTrendsCompare, daylyPassRateTrends.compare)
router.post(api.dailyPassRateTrendsGetRatio, daylyPassRateTrends.getRatio)
//tab2
router.post(api.dailyPassRateAndOverdueTrends, daylyPassRateTrends1.getDaily)
router.post(api.weeklyPassRateAndOverdueTrends, daylyPassRateTrends1.getWeekly)
router.post(api.tab2ChannelInfo, daylyPassRateTrends1.getChannelInfo)
router.post(api.tab2ChannelInfoCount, daylyPassRateTrends1.getChannelInfoCount)
router.post(api.tab2ChannelInfoGetSelectOptions, daylyPassRateTrends1.getSelectOptions)
//tab3
router.post(api.rejectedReasons20, daylyPassRateTrends2.getRejectedResons)
router.post(api.tab3GetSelectOptions, daylyPassRateTrends2.getSelectOptions)
router.post(api.tab3GetDailyOptions, daylyPassRateTrends2.getDailyOptions)
router.post(api.dailyRejectedNumTrends, daylyPassRateTrends2.getDailyRejectedNumTrends)
router.post(api.channelRejectedReason, daylyPassRateTrends2.getChannelRejectedReason)
//用户基础画像
router.post(api.userBasePortraitCount, userBasePortrait.getCount)
router.post(api.userBasePortrait, userBasePortrait.fetchAll)
//运营用户画像
router.post(api.operationUserPortraitCount, operationUserPortrait.getCount)
router.post(api.operationUserPortrait, operationUserPortrait.fetchAll)

/*企鹅抓娃娃*/
//市场
//数据概述
router.post(api.dataOverviewRoomQECount, dataOverview.getCountRoom)
router.post(api.dataOverviewRoomQE, dataOverview.fetchAllRoom)
router.post(api.dataOverviewQERefresh, dataOverview.refreshData)
router.post(api.dataOverviewDayQE, dataOverview.fetchAllDay)
//数据概述All
router.post(api.dataOverviewAllRoomQECount, dataOverviewAll.getCountRoom)
router.post(api.dataOverviewAllRoomQE, dataOverviewAll.fetchAllRoom)
router.post(api.dataOverviewAllQERefresh, dataOverviewAll.refreshData)
router.post(api.dataOverviewAllDayQE, dataOverviewAll.fetchAllDay)
//推广统计（渠道）
router.post(api.promotionChannelStatisticsQECount, promotionChannelStatisticsQE.getCount)
router.post(api.promotionChannelStatisticsQE, promotionChannelStatisticsQE.fetchAll)
router.post(api.promotionChannelStatisticsQERefresh, promotionChannelStatisticsQE.refreshData)
router.post(api.promotionChannelStatisticsQEUpdate, promotionChannelStatisticsQE.update)
router.get(api.promotionChannelStatisticsQEExcel, promotionChannelStatisticsQE.getExcelData)
router.get(api.promotionChannelStatisticsQEExcelSUM, promotionChannelStatisticsQE.getExcelSUMData)
router.post(api.onlineStatisticsHourly, promotionChannelStatisticsQE.fetOnlineStatisticsHourly)
router.post(api.promotionChannelStatisticsQESUM, promotionChannelStatisticsQE.fetchAllSUM)
router.post(api.promotionChannelStatisticsQEGetOptions, promotionChannelStatisticsQE.getSelectOptions)
//推广统计（OPPO）
router.post(api.promotionOPPOStatisticsQECount, promotionOPPOStatisticsQE.getCount)
router.post(api.promotionOPPOStatisticsQE, promotionOPPOStatisticsQE.fetchAll)
router.post(api.promotionOPPOStatisticsQEUpdate, promotionOPPOStatisticsQE.update)
router.get(api.promotionOPPOStatisticsQEExcel, promotionOPPOStatisticsQE.getExcelData)
router.get(api.promotionOPPOStatisticsQEExcelSUM, promotionOPPOStatisticsQE.getExcelSUMData)
router.post(api.promotionOPPOStatisticsQESUM, promotionOPPOStatisticsQE.fetchAllSUM)
router.post(api.promotionOPPOStatisticsQEGetOptions, promotionOPPOStatisticsQE.getSelectOptions)
//用户充值间隔分析
router.post(api.userRechargeIntervalAnalysisQECount, userRechargeIntervalAnalysisQE.getCount)
router.post(api.userRechargeIntervalAnalysisQE, userRechargeIntervalAnalysisQE.fetchAll)
router.get(api.userRechargeIntervalAnalysisQEExcel, userRechargeIntervalAnalysisQE.getExcelData)
//用户充值间隔分析(周)
router.post(api.userRechargeIntervalAnalysisWeeklyQECount, userRechargeIntervalAnalysisWeeklyQE.getCount)
router.post(api.userRechargeIntervalAnalysisWeeklyQE, userRechargeIntervalAnalysisWeeklyQE.fetchAll)
router.get(api.userRechargeIntervalAnalysisWeeklyQEExcel, userRechargeIntervalAnalysisWeeklyQE.getExcelData)
//用户充值时段分析
router.post(api.userRechargeTimeAnalysisQE, userRechargeTimeAnalysisQE.fetchAll)
//充值按钮点击量
router.post(api.torechargePVUVCount, torechargePVUV.getCount)
router.post(api.torechargePVUV, torechargePVUV.fetchAll)
router.get(api.torechargePVUVExcel, torechargePVUV.getExcelData)
router.post(api.torechargePVUVSUM, torechargePVUV.fetchAllSUM)
router.get(api.torechargePVUVExcelSUM, torechargePVUV.getExcelDataSUM)
//各房间点击量
router.post(api.roomPVUVCount, roomPVUV.getCount)
router.post(api.roomPVUV, roomPVUV.fetchAll)
router.get(api.roomPVUVExcel, roomPVUV.getExcelData)
router.post(api.roomPVUVSUM, roomPVUV.fetchAllSUM)
router.get(api.roomPVUVExcelSUM, roomPVUV.getExcelDataSUM)
//任意门点击量
router.post(api.arbitraryGatePVUVCount, arbitraryGatePVUV.getCount)
router.post(api.arbitraryGatePVUV, arbitraryGatePVUV.fetchAll)
router.get(api.arbitraryGatePVUVExcel, arbitraryGatePVUV.getExcelData)
router.post(api.arbitraryGatePVUVSUM, arbitraryGatePVUV.fetchAllSUM)
router.get(api.arbitraryGatePVUVExcelSUM, arbitraryGatePVUV.getExcelDataSUM)
//banner点击量
router.post(api.bannerPVUVCount, bannerPVUV.getCount)
router.post(api.bannerPVUV, bannerPVUV.fetchAll)
router.get(api.bannerPVUVExcel, bannerPVUV.getExcelData)
router.post(api.bannerPVUVSUM, bannerPVUV.fetchAllSUM)
router.get(api.bannerPVUVExcelSUM, bannerPVUV.getExcelDataSUM)
//兑换点击量
router.post(api.exchangePVUVCount, exchangePVUV.getCount)
router.post(api.exchangePVUV, exchangePVUV.fetchAll)
router.get(api.exchangePVUVExcel, exchangePVUV.getExcelData)
router.post(api.exchangePVUVSUM, exchangePVUV.fetchAllSUM)
router.get(api.exchangePVUVExcelSUM, exchangePVUV.getExcelDataSUM)
//一级游戏房
router.post(api.level1RoomCount, level1Room.getCount)
router.post(api.level1Room, level1Room.fetchAll)
router.get(api.level1RoomExcel, level1Room.getExcelData)
router.post(api.level1RoomSUM, level1Room.fetchAllSUM)
router.get(api.level1RoomExcelSUM, level1Room.getExcelDataSUM)
//充值活动
router.post(api.rechargeActivitiesCount, rechargeActivities.getCount)
router.post(api.rechargeActivities, rechargeActivities.fetchAll)
router.get(api.rechargeActivitiesExcel, rechargeActivities.getExcelData)
//运营弹窗
router.post(api.operatingWindowCount, operatingWindow.getCount)
router.post(api.operatingWindow, operatingWindow.fetchAll)
router.get(api.operatingWindowExcel, operatingWindow.getExcelData)
//宝箱
router.post(api.treasureBoxCount, treasureBox.getCount)
router.post(api.treasureBox, treasureBox.fetchAll)
router.get(api.treasureBoxExcel, treasureBox.getExcelData)
/*竞拍*/
//市场
//渠道信息表
router.post(api.newChannelViewCount, newChannelView.getCount)
router.post(api.newChannelView, newChannelView.fetchAll)
router.get(api.newChannelViewExcel, newChannelView.getExcelData)
router.post(api.newChannelViewRefresh, newChannelView.refreshData)
//渠道推广效果统计
router.post(api.promotionEffectStatisticsCount, promotionEffectStatistics.getCount)
router.post(api.promotionEffectStatistics, promotionEffectStatistics.fetchAll)
router.get(api.promotionEffectStatisticsExcel, promotionEffectStatistics.getExcelData)
router.post(api.promotionEffectStatisticsRefresh, promotionEffectStatistics.refreshData)
router.post(api.promotionEffectStatisticsModify, promotionEffectStatistics.modify)
//每日渠道推广效果统计
router.post(api.dailyPromotionEffectStatisticsCount, dailyPromotionEffectStatistics.getCount)
router.post(api.dailyPromotionEffectStatistics, dailyPromotionEffectStatistics.fetchAll)
router.get(api.dailyPromotionEffectStatisticsExcel, dailyPromotionEffectStatistics.getExcelData)
router.post(api.dailyPromotionEffectStatisticsRefresh, dailyPromotionEffectStatistics.refreshData)
//渠道每周统计
router.post(api.promotionChannelStatisticsWeeklyCount, promotionChannelStatisticsWeekly.getCount)
router.post(api.promotionChannelStatisticsWeekly, promotionChannelStatisticsWeekly.fetchAll)
router.get(api.promotionChannelStatisticsWeeklyExcel, promotionChannelStatisticsWeekly.getExcelData)
//渠道日环比数据
router.post(api.channelDODDataCount, channelDODData.getCount)
router.post(api.channelDODData, channelDODData.fetchAll)
router.get(api.channelDODDataExcel, channelDODData.getExcelData)
//渠道周环比数据
router.post(api.channelWOWDataCount, channelWOWData.getCount)
router.post(api.channelWOWData, channelWOWData.fetchAll)
router.get(api.channelWOWDataExcel, channelWOWData.getExcelData)
//渠道月环比数据
router.post(api.channelMOMDataCount, channelMOMData.getCount)
router.post(api.channelMOMData, channelMOMData.fetchAll)
router.get(api.channelMOMDataExcel, channelMOMData.getExcelData)
//渠道季环比数据
router.post(api.channelQOQDataCount, channelQOQData.getCount)
router.post(api.channelQOQData, channelQOQData.fetchAll)
router.get(api.channelQOQDataExcel, channelQOQData.getExcelData)
//渠道年环比数据
router.post(api.channelYOYDataCount, channelYOYData.getCount)
router.post(api.channelYOYData, channelYOYData.fetchAll)
router.get(api.channelYOYDataExcel, channelYOYData.getExcelData)
//渠道用户活跃情况
router.post(api.channelUserActivityCount, channelUserActivity.getCount)
router.post(api.channelUserActivity, channelUserActivity.fetchAll)
router.get(api.channelUserActivityExcel, channelUserActivity.getExcelData)
//市场看板
router.post(api.marketViewUserAreaRatio, marketView.userAreaRatio)
router.post(api.marketViewUserAreaRecharge, marketView.userAreaRecharge)
router.post(api.marketView, marketView.fetchAll)
//运营
//订单信息表
router.post(api.orderInfoCount, orderInfo.getCount)
router.post(api.orderInfo, orderInfo.fetchAll)
router.get(api.orderInfoExcel, orderInfo.getExcelData)
//用户信息表
router.post(api.userInfoCount, userInfo.getCount)
router.post(api.userInfo, userInfo.fetchAll)
router.get(api.userInfoExcel, userInfo.getExcelData)
//流量统计表
router.post(api.pagePVUVCount, pagePVUV.getCount)
router.post(api.pagePVUV, pagePVUV.fetchAll)
router.get(api.pagePVUVExcel, pagePVUV.getExcelData)
//竞拍记录表
router.post(api.auctionRecordCount, auctionRecord.getCount)
router.post(api.auctionRecord, auctionRecord.fetchAll)
router.get(api.auctionRecordExcel, auctionRecord.getExcelData)
//积分记录表
router.post(api.integralRecordCount, integralRecord.getCount)
router.post(api.integralRecord, integralRecord.fetchAll)
router.get(api.integralRecordExcel, integralRecord.getExcelData)
//充值记录表
router.post(api.rechargeRecordCount, rechargeRecord.getCount)
router.post(api.rechargeRecord, rechargeRecord.fetchAll)
router.get(api.rechargeRecordExcel, rechargeRecord.getExcelData)
//流量路径统计表
router.post(api.trafficStatisticsCount, trafficStatistics.getCount)
router.post(api.trafficStatistics, trafficStatistics.fetchAll)
router.get(api.trafficStatisticsExcel, trafficStatistics.getExcelData)
//元素点击表
router.post(api.elementPVUVCount, elementPVUV.getCount)
router.post(api.elementPVUV, elementPVUV.fetchAll)
router.get(api.elementPVUVExcel, elementPVUV.getExcelData)
//用户浏览行为表
router.post(api.userBrowsingBehaviorCount, userBrowsingBehavior.getCount)
router.post(api.userBrowsingBehavior, userBrowsingBehavior.fetchAll)
router.get(api.userBrowsingBehaviorExcel, userBrowsingBehavior.getExcelData)
//运营看板
router.post(api.operateViewDailyNewUser, operateView.dailyNewUser)
router.post(api.operateViewIncomeDetail, operateView.incomeDetail)
router.post(api.operateViewActiveUser, operateView.activeUser)
router.post(api.operateViewCoin1CancellationDeposit, operateView.coin1CancellationDeposit)
router.post(api.operateView, operateView.fetchAll)
//平台概览
router.post(api.operatingSituationActiveUserTrends, operatingSituation.activeUserTrends)
router.post(api.operatingSituationNewRegisteredUser, operatingSituation.newRegisteredUser)
router.post(api.operatingSituationRechargeConsumption, operatingSituation.rechargeConsumption)
router.post(api.operatingSituation, operatingSituation.fetchAll)
router.post(api.operatingSituationConversionFunnel, operatingSituation.conversionFunnel)
//实验室
router.post(api.allTables, deleteRobotInfo.fetchAll)
router.post(api.getOne, deleteRobotInfo.getOne)
router.post(api.getOneNum, deleteRobotInfo.getOneNum)
/*借款管理*/
// 借款申请列表
router.post(api.loanApplicationsListCount, loanApplicationsList.getCount)
router.post(api.loanApplicationsList, loanApplicationsList.fetchAll)

// 放款审核列表
router.post(api.loanAuditListCount, loanAuditList.getCount)
router.post(api.loanAuditList, loanAuditList.fetchAll)

// 提额记录表
router.post(api.raiseQuotaRecordCount, raiseQuotaRecord.getCount)
router.post(api.raiseQuotaRecord, raiseQuotaRecord.fetchAll)
// 对账功能
router.post(api.reconciliationFunctionCount, reconciliationFunction.getCount)
router.post(api.reconciliationFunction, reconciliationFunction.fetchAll)

// 资产管理
router.post(api.assetInformationCount, assetInformation.getCount)
router.post(api.assetInformation, assetInformation.fetchAll)

/*还款管理*/
//还款列表  待还列表
router.post(api.waitingForReturnListCount, waitingForReturnList.getCount)
router.post(api.waitingForReturnList, waitingForReturnList.fetchAll)

//还款列表  已还列表
router.post(api.returnedListCount, returnedList.getCount)
router.post(api.returnedList, returnedList.fetchAll)

//对账列表  还款对账
router.post(api.repaymentReconciliationCount, repaymentReconciliation.getCount)
router.post(api.repaymentReconciliation, repaymentReconciliation.fetchAll)

//对账列表  续期对账
router.post(api.renewalReconciliationCount, renewalReconciliation.getCount)
router.post(api.renewalReconciliation, renewalReconciliation.fetchAll)

//退款列表  还款详情
router.post(api.repaymentDetailsCount, repaymentDetails.getCount)
router.post(api.repaymentDetails, repaymentDetails.fetchAll)

//退款列表  续期详情
router.post(api.renewalParticularsCount, renewalParticulars.getCount)
router.post(api.renewalParticulars, renewalParticulars.fetchAll)

//退款列表  已退列表
router.post(api.rebackedListCount, rebackedList.getCount)
router.post(api.rebackedList, rebackedList.fetchAll)

//续期管理  续期列表
router.post(api.renewalsListCount, renewalsList.getCount)
router.post(api.renewalsList, renewalsList.fetchAll)

/*数据分析*/
// 每日还款金额数据
router.post(api.dailyRepaymentAmountDataCount, dailyRepaymentAmountData.getCount)
router.post(api.dailyRepaymentAmountData, dailyRepaymentAmountData.fetchAll)
router.post(api.dailyRepaymentAmountDataRefresh, dailyRepaymentAmountData.refreshData)
router.get(api.dailyRepaymentAmountDataExcel, dailyRepaymentAmountData.getExcelData)
// 每日还款单位数据
router.post(api.dailyRepaymentUnitDataCount, dailyRepaymentUnitData.getCount)
router.post(api.dailyRepaymentUnitData, dailyRepaymentUnitData.fetchAll)
router.post(api.dailyRepaymentUnitDataRefresh, dailyRepaymentUnitData.refreshData)
router.get(api.dailyRepaymentUnitDataExcel, dailyRepaymentUnitData.getExcelData)
// 21天分期统计
router.post(api.daysStageStatistics21Count, daysStageStatistics21.getCount)
router.post(api.daysStageStatistics21, daysStageStatistics21.fetchAll)
router.post(api.daysStageStatistics21Refresh, daysStageStatistics21.refreshData)
router.get(api.daysStageStatistics21Excel, daysStageStatistics21.getExcelData)
// 90天分期统计
router.post(api.daysStageStatistics90Count, daysStageStatistics90.getCount)
router.post(api.daysStageStatistics90, daysStageStatistics90.fetchAll)
router.post(api.daysStageStatistics90Refresh, daysStageStatistics90.refreshData)
router.get(api.daysStageStatistics90Excel, daysStageStatistics90.getExcelData)
// 21天分期提额统计
router.post(api.installmentPromotionStatistics21Count, installmentPromotionStatistics21.getCount)
router.post(api.installmentPromotionStatistics21, installmentPromotionStatistics21.fetchAll)
router.post(api.installmentPromotionStatistics21Refresh, installmentPromotionStatistics21.refreshData)
router.get(api.installmentPromotionStatistics21Excel, installmentPromotionStatistics21.getExcelData)
// 还款逾期统计
router.post(api.overdueRepaymentStatisticsCount, overdueRepaymentStatistics.getCount)
router.post(api.overdueRepaymentStatistics, overdueRepaymentStatistics.fetchAll)
router.post(api.overdueRepaymentStatisticsRefresh, overdueRepaymentStatistics.refreshData)
router.get(api.overdueRepaymentStatisticsExcel, overdueRepaymentStatistics.getExcelData)
// 每日放款数据
router.post(api.dailyLendingDataCount, dailyLendingData.getCount)
router.post(api.dailyLendingData, dailyLendingData.fetchAll)
router.post(api.dailyLendingDataRefresh, dailyLendingData.refreshData)
router.get(api.dailyLendingDataExcel, dailyLendingData.getExcelData)
router.get(api.dailyLendingDataExcel2, dailyLendingData.getExcelDataRSP)
// 资金分析
router.post(api.fundAnalysisCount, fundAnalysis.getCount)
router.post(api.fundAnalysis, fundAnalysis.fetchAll)
router.post(api.fundAnalysisRefresh, fundAnalysis.refreshData)
router.get(api.fundAnalysisExcel, fundAnalysis.getExcelData)
// 资金分析（产品）
router.post(api.fundAnalysisProductCount, fundAnalysisProduct.getCount)
router.post(api.fundAnalysisProduct, fundAnalysisProduct.fetchAll)
router.post(api.fundAnalysisProductRefresh, fundAnalysisProduct.refreshData)
router.get(api.fundAnalysisProductExcel, fundAnalysisProduct.getExcelData)
// 催收管理
router.post(api.collectionManagementCount, collectionManagement.getCount)
router.post(api.collectionManagement, collectionManagement.fetchAll)
router.post(api.collectionManagementRefresh, collectionManagement.refreshData)
router.get(api.collectionManagementExcel, collectionManagement.getExcelData)
// 在催金额
router.post(api.promptAmountCount, promptAmount.getCount)
router.post(api.promptAmount, promptAmount.fetchAll)
router.post(api.promptAmountRefresh, promptAmount.refreshData)
router.get(api.promptAmountExcel, promptAmount.getExcelData)
// 提前还款统计
router.post(api.prepaymentStatisticsCount, prepaymentStatistics.getCount)
router.post(api.prepaymentStatistics, prepaymentStatistics.fetchAll)
router.post(api.prepaymentStatisticsRefresh, prepaymentStatistics.refreshData)
router.get(api.prepaymentStatisticsExcel, prepaymentStatistics.getExcelData)
// 自然渠道统计
router.post(api.naturalChannelStatisticsCount, naturalChannelStatistics.getCount)
router.post(api.naturalChannelStatistics, naturalChannelStatistics.fetchAll)
router.get(api.naturalChannelStatisticsExcel, naturalChannelStatistics.getExcelData)
// 必过券统计
router.post(api.couponStatisticsCount, couponStatistics.getCount)
router.post(api.couponStatistics, couponStatistics.fetchAll)
router.post(api.couponStatisticsRefresh, couponStatistics.refreshData)
router.get(api.couponStatisticsExcel, couponStatistics.getExcelData)
// 还款抵扣券分析
router.post(api.repaymentCouponAnalysisCount, repaymentCouponAnalysis.getCount)
router.post(api.repaymentCouponAnalysis, repaymentCouponAnalysis.fetchAll)
router.post(api.repaymentCouponAnalysisRefresh, repaymentCouponAnalysis.refreshData)
router.get(api.repaymentCouponAnalysisExcel, repaymentCouponAnalysis.getExcelData)
// 分时段还款率
router.post(api.hourlyRepaymentRateCount, hourlyRepaymentRate.getCount)
router.post(api.hourlyRepaymentRate, hourlyRepaymentRate.fetchAll)
router.post(api.hourlyRepaymentRateP, hourlyRepaymentRate.fetchAllP)
router.post(api.hourlyRepaymentRateRefresh, hourlyRepaymentRate.refreshData)
router.get(api.hourlyRepaymentRateExcel, hourlyRepaymentRate.getExcelData)
// 关键数据
router.post(api.keyDataCount, keyData.getCount)
router.post(api.keyData, keyData.fetchAll)
router.get(api.keyDataExcel, keyData.getExcelData)
router.post(api.keyDataRefresh, keyData.refreshData)
// 平台管理
router.post(api.platformDataCount, platformData.getCount)
router.post(api.platformData, platformData.fetchAll)
router.post(api.platformDataRefresh, platformData.refreshData)
router.get(api.platformDataExcel, platformData.getExcelData)
// 每日支出数据-开心商城
router.post(api.dailyExpenditureDataCount, dailyExpenditureData.getCount)
router.post(api.dailyExpenditureData, dailyExpenditureData.fetchAll)
router.get(api.dailyExpenditureDataExcel, dailyExpenditureData.getExcelData)
// 每日放款数据-现金借呗
router.post(api.dailyLendingDataXJJBCount, dailyLendingDataXJJB.getCount)
router.post(api.dailyLendingDataXJJB, dailyLendingDataXJJB.fetchAll)
router.post(api.dailyLendingDataXJJBRefresh, dailyLendingDataXJJB.refreshData)
router.get(api.dailyLendingDataXJJBExcel, dailyLendingDataXJJB.getExcelData)
// 每日还款数据-现金借呗
router.post(api.dailyRepaymentUnitDataXJJBCount, dailyRepaymentUnitDataXJJB.getCount)
router.post(api.dailyRepaymentUnitDataXJJB, dailyRepaymentUnitDataXJJB.fetchAll)
router.post(api.dailyRepaymentUnitDataXJJBRefresh, dailyRepaymentUnitDataXJJB.refreshData)
router.get(api.dailyRepaymentUnitDataXJJBExcel, dailyRepaymentUnitDataXJJB.getExcelData)
/*财务分析*/
//还款明细表
router.post(api.repaymentMinutiaCount, repaymentMinutia.getCount)
router.post(api.repaymentMinutia, repaymentMinutia.fetchAll)
router.get(api.repaymentMinutiaExcel, repaymentMinutia.getExcelData)
//对账分析表
router.post(api.reconciliationAnalysisCount, reconciliationAnalysis.getCount)
router.post(api.reconciliationAnalysis, reconciliationAnalysis.fetchAll)
router.get(api.reconciliationAnalysisExcel, reconciliationAnalysis.getExcelData)
router.post(api.reconciliationAnalysisModify, reconciliationAnalysis.modify)
//企鹅对账分析表
router.post(api.reconciliationAnalysisQECount, reconciliationAnalysisQE.getCount)
router.post(api.reconciliationAnalysisQE, reconciliationAnalysisQE.fetchAll)
router.get(api.reconciliationAnalysisQEExcel, reconciliationAnalysisQE.getExcelData)
router.post(api.reconciliationAnalysisQEModify, reconciliationAnalysisQE.modify)
//企鹅收入结算表
router.post(api.incomeStatementQECount, incomeStatementQE.getCount)
router.post(api.incomeStatementQE, incomeStatementQE.fetchAll)
router.get(api.incomeStatementQEExcel, incomeStatementQE.getExcelData)
//企鹅汇总明细表
router.post(api.penguinSummaryQECount, penguinSummaryQE.getCount)
router.post(api.penguinSummaryQE, penguinSummaryQE.fetchAll)
router.get(api.penguinSummaryQEExcel, penguinSummaryQE.getExcelData)
//还款日报表统计
router.post(api.reportStatisticsCount, reportStatistics.getCount)
router.post(api.reportStatistics, reportStatistics.fetchAll)
router.get(api.reportStatisticsExcel, reportStatistics.getExcelData)
//放款日报表统计
router.post(api.lendingDailyCount, lendingDaily.getCount)
router.post(api.lendingDaily, lendingDaily.fetchAll)
router.get(api.lendingDailyExcel, lendingDaily.getExcelData)
router.post(api.lendingDailySum, lendingDaily.fetchSum)
//企鹅抓娃娃进销存明细表
router.post(api.inventoryManagementQECount, inventoryManagementQE.getCount)
router.post(api.inventoryManagementQE, inventoryManagementQE.fetchAll)
router.get(api.inventoryManagementQEExcel, inventoryManagementQE.getExcelData)
router.post(api.inventoryManagementQERefresh, inventoryManagementQE.refreshData)

/*推广管理*/
// 推广渠道
router.post(api.promotionChannelCount, promotionChannel.getCount)
router.post(api.promotionChannel, promotionChannel.fetchAll)
router.get(api.promotionChannelExcel, promotionChannel.getExcelData)

// 推广员管理
router.post(api.promoterManagementCount, promoterManagement.getCount)
router.post(api.promoterManagement, promoterManagement.fetchAll)
router.post(api.promoterManagementGetOptions, promoterManagement.getSelectOptions)
router.get(api.promoterManagementExcel, promoterManagement.getExcelData)

//推广统计(渠道)
router.post(api.promotionChannelStatisticsCount, promotionChannelStatistics.getCount)
router.post(api.promotionChannelStatistics, promotionChannelStatistics.fetchAll)
router.post(api.promotionChannelStatisticsRefresh, promotionChannelStatistics.refreshData)
router.post(api.promotionChannelStatisticsGetOptions, promotionChannelStatistics.getSelectOptions)
router.get(api.promotionChannelStatisticsExcel, promotionChannelStatistics.getExcelData)

//七日推广统计(渠道)
router.post(api.promotionChannelStatistics7Count, promotionChannelStatistics7.getCount)
router.post(api.promotionChannelStatistics7, promotionChannelStatistics7.fetchAll)
router.post(api.promotionChannelStatistics7Refresh, promotionChannelStatistics7.refreshData)
router.post(api.promotionChannelStatistics7GetOptions, promotionChannelStatistics7.getSelectOptions)
router.get(api.promotionChannelStatistics7Excel, promotionChannelStatistics7.getExcelData)

//推广统计(地区)
router.post(api.promotionRegionStatisticsCount, promotionRegionStatistics.getCount)
router.post(api.promotionRegionStatistics, promotionRegionStatistics.fetchAll)
router.post(api.promotionRegionStatisticsRefresh, promotionRegionStatistics.refreshData)
router.get(api.promotionRegionStatisticsExcel, promotionRegionStatistics.getExcelData)
//渠道统计汇总
router.post(api.channelStatisticsSummaryCount, channelStatisticsSummary.getCount)
router.post(api.channelStatisticsSummary, channelStatisticsSummary.fetchAll)
router.post(api.channelStatisticsSummaryGetOptions, channelStatisticsSummary.getSelectOptions)
router.get(api.channelStatisticsSummaryExcel, channelStatisticsSummary.getExcelData)
//PVUV
router.post(api.PVUVCount, PVUV.getCount)
router.post(api.PVUV, PVUV.fetchAll)
router.post(api.PVUVGetOptions, PVUV.getSelectOptions)
router.get(api.PVUVExcel, PVUV.getExcelData)
/*绩效考评*/
//部门绩效考评
router.post(api.achievementsCount, achievements.getCount)
router.post(api.achievements, achievements.fetchAll)
/*权限管理*/
//员工信息
router.post(api.employeeList, employeeList.fetchAll)
router.post(api.employeeListCount, employeeList.getCount)
router.post(api.employeeListPrivilegeModify, employeeList.privilegeModify)
router.post(api.employeAdd, employeeList.add)
router.post(api.employeDelete, employeeList.delete)
router.post(api.modifyMultiple, employeeList.modifyMultiple)
/*开心分期*/
/**黑卡 */
//每日放款记录
router.post(api.periodDailyLendingDataCount, periodDailyLendingData.getCount)
router.post(api.periodDailyLendingData, periodDailyLendingData.fetchAll)
router.post(api.periodDailyLendingDataRefresh, periodDailyLendingData.refreshData)
router.get(api.periodDailyLendingDataExcel, periodDailyLendingData.getExcelData)
//还款逾期记录
router.post(api.periodOverdueRepaymentStatisticsCount, periodOverdueRepaymentStatistics.getCount)
router.post(api.periodOverdueRepaymentStatistics, periodOverdueRepaymentStatistics.fetchAll)
router.post(api.periodOverdueRepaymentStatisticsRefresh, periodOverdueRepaymentStatistics.refreshData)
router.get(api.periodOverdueRepaymentStatisticsExcel, periodOverdueRepaymentStatistics.getExcelData)
//每日还款金额记录
router.post(api.periodDailyRepaymentAmountDataCount, periodDailyRepaymentAmountData.getCount)
router.post(api.periodDailyRepaymentAmountData, periodDailyRepaymentAmountData.fetchAll)
router.post(api.periodDailyRepaymentAmountDataRefresh, periodDailyRepaymentAmountData.refreshData)
router.get(api.periodDailyRepaymentAmountDataExcel, periodDailyRepaymentAmountData.getExcelData)
//每日还款金额记录
router.post(api.promptAmountDataCount, promptAmountData.getCount)
router.post(api.promptAmountData, promptAmountData.fetchAll)
router.post(api.promptAmountDataRefresh, promptAmountData.refreshData)
router.get(api.promptAmountDataExcel, promptAmountData.getExcelData)
//每日还款明细记录
router.post(api.repaymentDetailDataCount, repaymentDetailData.getCount)
router.post(api.repaymentDetailData, repaymentDetailData.fetchAll)
router.post(api.repaymentDetailDataRefresh, repaymentDetailData.refreshData)
router.get(api.repaymentDetailDataExcel, repaymentDetailData.getExcelData)
//每日结算报表
router.post(api.dailySettlementReportCount, dailySettlementReport.getCount)
router.post(api.dailySettlementReport, dailySettlementReport.fetchAll)
router.post(api.dailySettlementReportRefresh, dailySettlementReport.refreshData)
router.get(api.dailySettlementReportExcel, dailySettlementReport.getExcelData)
router.post(api.dailySettlementReportSum, dailySettlementReport.getSum)
//每日债权报表
router.post(api.dailyClaimsReportCount, dailyClaimsReport.getCount)
router.post(api.dailyClaimsReport, dailyClaimsReport.fetchAll)
router.post(api.dailyClaimsReportRefresh, dailyClaimsReport.refreshData)
router.get(api.dailyClaimsReportExcel, dailyClaimsReport.getExcelData)
router.post(api.dailyClaimsReportSum, dailyClaimsReport.getSum)
//ZCM开心分期还款数据核对
router.post(api.ZCMRepaymentDataReconciliationCount, ZCMRepaymentDataReconciliation.getCount)
router.post(api.ZCMRepaymentDataReconciliation, ZCMRepaymentDataReconciliation.fetchAll)
router.post(api.ZCMRepaymentDataReconciliationRefresh, ZCMRepaymentDataReconciliation.refreshData)
router.get(api.ZCMRepaymentDataReconciliationExcel, ZCMRepaymentDataReconciliation.getExcelData)
//ZB还款数据核对
router.post(api.ZBrepaymentDataCount, ZBrepaymentData.getCount)
router.post(api.ZBrepaymentData, ZBrepaymentData.fetchAll)
router.post(api.ZBrepaymentDataRefresh, ZBrepaymentData.refreshData)
router.get(api.ZBrepaymentDataExcel, ZBrepaymentData.getExcelData)
//每月结算表
router.post(api.monthlySettlementDataCount, monthlySettlementData.getCount)
router.post(api.monthlySettlementData, monthlySettlementData.fetchAll)
router.post(api.monthlySettlementDataRefresh, monthlySettlementData.refreshData)
router.get(api.monthlySettlementDataExcel, monthlySettlementData.getExcelData)
//每月债权报表
router.post(api.monthlyBondDataCount, monthlyBondData.getCount)
router.post(api.monthlyBondData, monthlyBondData.fetchAll)
router.post(api.monthlyBondDataRefresh, monthlyBondData.refreshData)
router.get(api.monthlyBondDataExcel, monthlyBondData.getExcelData)
//支付宝还款对账
router.post(api.repaymentReconciliationZFBCount, repaymentReconciliationZFB.getCount)
router.post(api.repaymentReconciliationZFB, repaymentReconciliationZFB.fetchAll)
router.post(api.repaymentReconciliationZFBRefresh, repaymentReconciliationZFB.refreshData)
router.get(api.repaymentReconciliationZFBExcel, repaymentReconciliationZFB.getExcelData)
//XN还款数据核对
router.post(api.dataCheckXNCount, dataCheckXN.getCount)
router.post(api.dataCheckXN, dataCheckXN.fetchAll)
router.post(api.dataCheckXNRefresh, dataCheckXN.refreshData)
router.get(api.dataCheckXNExcel, dataCheckXN.getExcelData)
//三方对账分析
router.post(api.threePartyAccountAnalysisCount, threePartyAccountAnalysis.getCount)
router.post(api.threePartyAccountAnalysis, threePartyAccountAnalysis.fetchAll)
router.post(api.threePartyAccountAnalysisRefresh, threePartyAccountAnalysis.refreshData)
router.post(api.threePartyAccountAnalysisModify, threePartyAccountAnalysis.modify)
router.get(api.threePartyAccountAnalysisExcel, threePartyAccountAnalysis.getExcelData)
/**商城 */
//收入结算总表
router.post(api.totalIncomeCount, totalIncome.getCount)
router.post(api.totalIncome, totalIncome.fetchAll)
router.post(api.totalIncomeRefresh, totalIncome.refreshData)
router.get(api.totalIncomeExcel, totalIncome.getExcelData)
//收入结算明细表
router.post(api.detailIncomeCount, detailIncome.getCount)
router.post(api.detailIncome, detailIncome.fetchAll)
router.post(api.detailIncomeRefresh, detailIncome.refreshData)
router.get(api.detailIncomeExcel, detailIncome.getExcelData)
//总销售额统计表
router.post(api.totalSalesCount, totalSales.getCount)
router.post(api.totalSales, totalSales.fetchAll)
router.post(api.totalSalesRefresh, totalSales.refreshData)
router.get(api.totalSalesExcel, totalSales.getExcelData)
//商品销售记录
router.post(api.detailSalesCount, detailSales.getCount)
router.post(api.detailSales, detailSales.fetchAll)
router.post(api.detailSalesRefresh, detailSales.refreshData)
router.get(api.detailSalesExcel, detailSales.getExcelData)
//订单详情记录
router.post(api.detailOrderCount, detailOrder.getCount)
router.post(api.detailOrder, detailOrder.fetchAll)
router.post(api.detailOrderRefresh, detailOrder.refreshData)
router.get(api.detailOrderExcel, detailOrder.getExcelData)
//每日零钱资金分析表
router.post(api.dailyPocketMoneyAnalysisCount, dailyPocketMoneyAnalysis.getCount)
router.post(api.dailyPocketMoneyAnalysis, dailyPocketMoneyAnalysis.fetchAll)
router.post(api.dailyPocketMoneyAnalysisRefresh, dailyPocketMoneyAnalysis.refreshData)
router.get(api.dailyPocketMoneyAnalysisExcel, dailyPocketMoneyAnalysis.getExcelData)
//每日大礼包收入报表
router.post(api.dailyPackageIncomeStatementCount, dailyPackageIncomeStatement.getCount)
router.post(api.dailyPackageIncomeStatement, dailyPackageIncomeStatement.fetchAll)
router.post(api.dailyPackageIncomeStatementRefresh, dailyPackageIncomeStatement.refreshData)
router.get(api.dailyPackageIncomeStatementExcel, dailyPackageIncomeStatement.getExcelData)
//每日商城订单报表
router.post(api.dailyMallOrderReportCount, dailyMallOrderReport.getCount)
router.post(api.dailyMallOrderReport, dailyMallOrderReport.fetchAll)
router.post(api.dailyMallOrderReportRefresh, dailyMallOrderReport.refreshData)
router.get(api.dailyMallOrderReportExcel, dailyMallOrderReport.getExcelData)
//零钱充值对账分析
router.post(api.rechargeOfChangeReportCount, rechargeOfChangeReport.getCount)
router.post(api.rechargeOfChangeReport, rechargeOfChangeReport.fetchAll)
router.post(api.rechargeOfChangeReportRefresh, rechargeOfChangeReport.refreshData)
router.get(api.rechargeOfChangeReportExcel, rechargeOfChangeReport.getExcelData)
router.post(api.rechargeOfChangeReportModify, rechargeOfChangeReport.modify)
//商城月报表
router.post(api.mallMonthlyReportCount, mallMonthlyReport.getCount)
router.post(api.mallMonthlyReport, mallMonthlyReport.fetchAll)
router.post(api.mallMonthlyReportRefresh, mallMonthlyReport.refreshData)
router.get(api.mallMonthlyReportExcel, mallMonthlyReport.getExcelData)
//零钱资金账户明细表
router.post(api.changeFundAccountStatementCount, changeFundAccountStatement.getCount)
router.post(api.changeFundAccountStatement, changeFundAccountStatement.fetchAll)
router.post(api.changeFundAccountStatementRefresh, changeFundAccountStatement.refreshData)
router.get(api.changeFundAccountStatementExcel, changeFundAccountStatement.getExcelData)
/***市场***/
//渠道统计表
router.post(api.channelStatisticsCount, channelStatistics.getCount)
router.post(api.channelStatistics, channelStatistics.fetchAll)
router.post(api.channelStatisticsRefresh, channelStatistics.refreshData)
router.get(api.channelStatisticsExcel, channelStatistics.getExcelData)
//渠道统计汇总表
router.post(api.channelSummaryStatisticsCount, channelSummaryStatistics.getCount)
router.post(api.channelSummaryStatistics, channelSummaryStatistics.fetchAll)
router.post(api.channelSummaryStatisticsRefresh, channelSummaryStatistics.refreshData)
router.get(api.channelSummaryStatisticsExcel, channelSummaryStatistics.getExcelData)
module.exports = router
