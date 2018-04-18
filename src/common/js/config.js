let parentTable = ['RMAB', '市场', '运营', '催收', '用户画像', '用户信息管理', '借款管理', '还款管理', '还款列表', '对账列表', '退款列表', '续期管理', '数据分析', '财务数据', '数据报表', '财务分析', '推广管理', '绩效考评', '权限管理', '现金借呗', '实验室', '企鹅抓娃娃', '市场分析', '埋点分析', '开心拍卖', '市场详情', '运营分析', '开心分期', '黑卡', '商城', '财务对账']
let address = {
  '新用户借款通过率': '/RMAB/market/newUserPassRate/tab1',
  '邀请活动': '/RMAB/operate/invitationEvent',
  '风控因素分析': '/RMAB/riskManagement/riskControlFactorAnalysis',
  '借款逾期催回率': '/RMAB/collection/loanOverdueRecallRate',
  '基础用户画像': '/RMAB/userPortrait/userBasePortrait',
  '运营用户画像': '/RMAB/userPortrait/operationUserPortrait',
  '数据概览': '/toyGrab/market/dataOverview',
  '企鹅推广统计(渠道)': '/toyGrab/market/promotionChannelStatisticsQE',
  '企鹅推广统计(OPPO)': '/toyGrab/market/promotionOPPOStatisticsQE',
  '企鹅在线人数统计': '/toyGrab/market/onlineStatisticsHourlyQE',
  '留存用户': '/toyGrab/userBehaviorAnalysis/retainedUser',
  '使用时长': '/toyGrab/userBehaviorAnalysis/hoursUsed',
  '用户充值间隔分析': '/toyGrab/market/userRechargeIntervalAnalysisQE/userRechargeIntervalAnalysisQE',
  '用户充值间隔分析(周)': '/toyGrab/market/userRechargeIntervalAnalysisWeeklyQE/userRechargeIntervalAnalysisWeeklyQE',
  '用户充值时段分析': '/toyGrab/market/userRechargeTimeAnalysisQE/userRechargeTimeAnalysisQE',
  '充值按钮点击量': '/toyGrab/buriaPointAnalysis/torechargePVUV',
  '各房间点击量': '/toyGrab/buriaPointAnalysis/roomPVUV',
  '任意门点击量': '/toyGrab/buriaPointAnalysis/arbitraryGatePVUV',
  'banner点击量': '/toyGrab/buriaPointAnalysis/bannerPVUV',
  '兑换点击量': '/toyGrab/buriaPointAnalysis/exchangePVUV',
  '一级游戏房': '/toyGrab/buriaPointAnalysis/level1Room',
  '充值活动': '/toyGrab/buriaPointAnalysis/rechargeActivities',
  '运营弹窗': '/toyGrab/buriaPointAnalysis/operatingWindow',
  '宝箱': '/toyGrab/buriaPointAnalysis/treasureBox',
  '企鹅对账明细': '/toyGrab/financialStatistics/reconciliationAnalysisQE',
  '企鹅收入结算表': '/toyGrab/financialStatistics/incomeStatementQE',
  '企鹅汇总明细表': '/toyGrab/financialStatistics/penguinSummaryQE',
  '企鹅进销存明细表': '/toyGrab/financialStatistics/inventoryManagementQE',
  '渠道信息表': '/auction/market/newChannelView',
  '渠道推广效果统计': '/auction/market/promotionEffectStatistics',
  '渠道每日统计': '/auction/market/dailyPromotionEffectStatistics',
  '渠道每周统计': '/auction/market/promotionChannelStatisticsWeekly',
  '渠道日环比数据': '/auction/market/channelDODData',
  '渠道周环比数据': '/auction/market/channelWOWData',
  '渠道月环比数据': '/auction/market/channelMOMData',
  '渠道季环比数据': '/auction/market/channelQOQData',
  '渠道年环比数据': '/auction/market/channelYOYData',
  '渠道用户活跃情况': '/auction/market/channelUserActivity',
  '市场看板': '/auction/market/marketView',
  '订单信息表': '/auction/operate/orderInfo',
  '用户信息表': '/auction/operate/userInfo',
  '流量统计表': '/auction/operate/pagePVUV',
  '竞拍记录表': '/auction/operate/auctionRecord',
  '积分记录表': '/auction/operate/integralRecord',
  '充值记录表': '/auction/operate/rechargeRecord',
  '流量路径统计表': '/auction/operate/trafficStatistics',
  '元素点击表': '/auction/operate/elementPVUV',
  '用户浏览行为表': '/auction/operate/userBrowsingBehavior',
  '运营看板': '/auction/operate/operateView',
  '拍卖首页': '/auction/operatingSituation',
  '用户列表': '/user/userList',
  '用户通讯录': '/user/userAddressBook',
  '银行卡列表': '/user/bankCardsList',
  '用户实名认证列表': '/user/userNameAuthenticationList',
  '用户认证列表': '/user/userAuthenticationList',
  '优惠券信息列表': '/user/discountCoupon',
  '新用户用户标签列表': '/user/newUserTagList',
  '老用户用户标签列表': '/user/oldUserTagList',
  '借款申请列表': '/loanManagement/loanApplicationsList',
  '放款审核列表': '/loanManagement/loanAuditList',
  '提额记录表': '/loanManagement/raiseQuotaRecord',
  '对账功能': '/loanManagement/reconciliationFunction',
  '资产信息-招财猫': '/loanManagement/assetInformation',
  '待还列表': '/repaymentManagement/repaymentList/waitingForReturnList',
  '已还列表': '/repaymentManagement/repaymentList/returnedList',
  '还款对账': '/repaymentManagement/reconciliationList/repaymentReconciliation',
  '续期对账': '/repaymentManagement/reconciliationList/renewalReconciliation',
  '还款详情': '/repaymentManagement/refundList/repaymentDetails',
  '续期详情': '/repaymentManagement/refundList/renewalParticulars',
  '已退列表': '/repaymentManagement/refundList/rebackedList',
  '续期管理': '/repaymentManagement/renewalManagement/repaymentDetails',
  '每日放款数据': '/dataAnalysis/financialData/dailyLendingData',
  '每日还款单位数据': '/dataAnalysis/financialData/dailyRepaymentUnitData',
  '21天分期统计': '/dataAnalysis/financialData/daysStageStatistics',
  '21天分期提额统计': '/dataAnalysis/financialData/installmentPromotionStatistics',
  '90天分期统计': '/dataAnalysis/financialData/daysStageStatistics90',
  '每日还款金额(非分期)': '/dataAnalysis/financialData/dailyRepaymentAmountData',
  '还款逾期统计': '/dataAnalysis/financialData/overdueRepaymentStatistics',
  '资金分析': '/dataAnalysis/financialData/fundAnalysis',
  '资金分析(分产品)': '/dataAnalysis/financialData/fundAnalysisProduct',
  '催收管理': '/dataAnalysis/financialData/collectionManagement',
  '在催金额': '/dataAnalysis/financialData/promptAmount',
  '提前还款统计': '/dataAnalysis/financialData/prepaymentStatistics',
  '自然渠道统计': '/dataAnalysis/financialData/naturalChannelStatistics',
  '必过券统计': '/dataAnalysis/financialData/couponStatistics',
  '还款抵扣券分析': '/dataAnalysis/financialData/repaymentCouponAnalysis',
  '分时段还款率': '/dataAnalysis/financialData/timeIntervalRepaymentRate',
  '关键数据': '/dataAnalysis/financialData/keyData',
  '平台数据': '/dataAnalysis/dataReport/platformData',
  '每日支出数据': '/dataAnalysis/happyMall/dailyExpenditureData',
  '每日还款数据-借呗': '/dataAnalysis/cashBorrowed/dailyRepaymentUnitData',
  '每日放款数据-借呗': '/dataAnalysis/cashBorrowed/dailyLendingData',
  '还款明细': '/financeAnalysis/repaymentMinutia',
  '对账分析': '/financeAnalysis/reconciliationAnalysis',
  '还款日报': '/financeAnalysis/reportStatistics',
  '放款日报': '/financeAnalysis/lendingDaily',
  '推广渠道': '/promotionManagement/promotionChannel',
  '推广员管理': '/promotionManagement/promoterManagement',
  '推广统计(渠道)': '/promotionManagement/promotionChannelStatistics',
  '七日推广统计(渠道)': '/promotionManagement/promotionChannelStatistics7',
  '推广统计(地区)': '/promotionManagement/promotionRegionStatistics',
  '渠道统计汇总': '/promotionManagement/channelStatisticsSummary',
  '注册量统计报表': '/promotionManagement/registrationStatisticsReport',
  '贷款超市-PVUV': '/promotionManagement/PVUV',
  '部门绩效考评': '/evaluation/achievements',
  '员工信息': '/privilegeManage/employeeList',
  '任意门': '/lab/deleteRobotInfo',
  '每日放款记录': '/period/loan/periodDailyLendingData',
  '还款逾期记录': '/period/loan/periodOverdueRepaymentStatistics',
  '每日还款金额记录': '/period/loan/periodDailyRepaymentAmountData',
  '每日还款明细记录': '/period/loan/repaymentDetailData',
  '在催金额记录': '/period/loan/promptAmountData',
  '每日结算报表': '/period/mall/finance/dailySettlementReport',
  '每日债权报表': '/period/mall/finance/dailyClaimsReport',
  'ZCM还款数据核对': '/period/mall/finance/ZCMRepaymentDataReconciliation',
  'ZB还款数据核对': '/period/loan/ZBrepaymentData',
  '每月结算表': '/period/loan/monthlySettlementData',
  '每月债权报表': '/period/mall/finance/monthlyBondData',
  '支付宝还款对账': '/period/loan/repaymentReconciliationZFB',
  'XN还款数据核对': '/period/loan/dataCheckXN',
  '三方对账分析': '/period/loan/threePartyAccountAnalysis',
  '收入结算总表': '/period/mall/finance/totalIncome',
  '收入结算明细表': '/period/mall/finance/detailIncome',
  '总销售额统计表': '/period/mall/finance/totalSales',
  '商品销售记录': '/period/mall/finance/detailSales',
  '订单详情记录': '/period/mall/finance/detailOrder',
  '每日零钱资金分析表': '/period/mall/finance/dailyPocketMoneyAnalysis',
  '每日大礼包收入报表': '/period/mall/finance/dailyPackageIncomeStatement',
  '每日商城订单报表': '/period/mall/finance/dailyMallOrderReport',
  '零钱充值对账分析': '/period/mall/finance/rechargeOfChangeReport'
}

export { parentTable, address }
