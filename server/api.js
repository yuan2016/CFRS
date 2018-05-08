let path = '/api'

module.exports = {
  /*登陆验证*/
  login: path + '/login',
  loginEmail: path + '/loginEmail',
  updateColors: path + '/updateColors',
  getColors: path + '/getColors',
  getRoles: path + '/getRoles',
  /*获取验证码*/
  getVerificationCode: path + '/getVerificationCode',
  /*获取图形验证码*/
  getPicCode: path + '/getPicCode',
  /*拉取信息*/
  getLoginInfo: path + '/getLoginInfo',
  getInfoEmail: path + '/getInfoEmail',
  modifyInfo: path + '/modifyInfo',
  /*首页*/
  main: path + '/main',
  /*修改密码*/
  passwordConfirm: path + '/passwordConfirm',
  passwordModify: path + '/passwordModify',
  /*用户信息管理*/
  // 用户列表
  userList: path + '/userList',
  userListCount: path + '/userList/count',
  // 用户通讯录
  userAddressBook: path + '/userAddressBook',
  userAddressBookCount: path + '/userAddressBook/count',
  // 银行卡列表
  bankcardsList: path + '/bankcardsList',
  bankcardsListCount: path + '/bankcardsList/count',
  // 用户认证列表
  userAuthenticationList: path + '/userAuthenticationList',
  userAuthenticationListCount: path + '/userAuthenticationList/count',
  // 用户实名认证列表
  userNameAuthenticationList: path + '/userNameAuthenticationList',
  userNameAuthenticationListCount: path + '/userNameAuthenticationList/count',
  // 优惠券信息
  discountCoupon: path + '/discountCoupon',
  discountCouponCount: path + '/discountCoupon/count',
  discountCouponExcel: path + '/discountCoupon/excel',
  // 新用户用户标签列表
  newUserTagList: path + '/newUserTagList',
  newUserTagListCount: path + '/newUserTagList/count',
  newUserTagListExcel: path + '/newUserTagList/excel',
  // 老用户用户标签列表
  oldUserTagList: path + '/oldUserTagList',
  oldUserTagListCount: path + '/oldUserTagList/count',
  oldUserTagListExcel: path + '/oldUserTagList/excel',

  //RMAB
  //借款通过率
  loanThroughRate: path + '/loanThroughRate',
  loanThroughRateAll: path + '/loanThroughRateAll',
  loanThroughRateExcel: path + '/loanThroughRate/excel',
  loanOverdueRecallRate: path + '/loanOverdueRecallRate',
  invitationEvent: path + '/invitationEvent',
  riskControlFactorAnalysis: path + '/riskControlFactorAnalysis',
  //图表
  //tab1
  dailyPassRateTrendsHourly: path + '/dailyPassRateTrends/hourly',
  dailyPassRateTrendsDaily: path + '/dailyPassRateTrends/daily',
  dailyPassRateTrendsWeekly: path + '/dailyPassRateTrends/weekly',
  dailyPassRateTrendsMonthly: path + '/dailyPassRateTrends/monthly',
  dailyPassRateTrendsCompare: path + '/dailyPassRateTrends/compare',
  dailyPassRateTrendsGetRatio: path + '/dailyPassRateTrends/getRatio',
  //tab2
  dailyPassRateAndOverdueTrends: path + '/dailyPassRateAndOverdueTrends/daily',
  weeklyPassRateAndOverdueTrends: path + '/weeklyPassRateAndOverdueTrends/weekly',
  tab2ChannelInfo: path + '/tab2ChannelInfo',
  tab2ChannelInfoCount: path + '/tab2ChannelInfo/count',
  tab2ChannelInfoGetSelectOptions: path + '/tab2ChannelInfo/getSelectOptions',
  //tab3
  rejectedReasons20: path + '/rejectedReasons20',
  tab3GetSelectOptions: path + '/tab3/getSelectOptions',
  tab3GetDailyOptions: path + '/tab3/getDailyOptions',
  dailyRejectedNumTrends: path + '/dailyRejectedNumTrends',
  channelRejectedReason: path + '/channelRejectedReason',
  // 用户基础画像
  userBasePortrait: path + '/userBasePortrait',
  userBasePortraitCount: path + '/userBasePortrait/count',
  //运营用户画像
  operationUserPortrait: path + '/operationUserPortrait',
  operationUserPortraitCount: path + '/operationUserPortrait/count',
  /*企鹅抓娃娃*/
  //市场
  //数据概览
  dataOverviewRoomQE: path + '/dataOverviewRoom',
  dataOverviewRoomQECount: path + '/dataOverviewRoom/count',
  dataOverviewQERefresh: path + '/dataOverview/refresh',
  dataOverviewDayQE: path + '/dataOverviewDay',
  //数据概览All
  dataOverviewAllRoomQE: path + '/dataOverviewAllRoom',
  dataOverviewAllRoomQECount: path + '/dataOverviewAllRoom/count',
  dataOverviewAllQERefresh: path + '/dataOverviewAll/refresh',
  dataOverviewAllDayQE: path + '/dataOverviewAllDay',
  //推广统计（渠道）
  promotionChannelStatisticsQE: path + '/promotionChannelStatisticsQE',
  promotionChannelStatisticsQECount: path + '/promotionChannelStatisticsQE/count',
  promotionChannelStatisticsQERefresh: path + '/promotionChannelStatisticsQE/refresh',
  promotionChannelStatisticsQEGetOptions: path + '/promotionChannelStatisticsQE/getSelectOptions',
  promotionChannelStatisticsQEExcel: path + '/promotionChannelStatisticsQE/excel',
  promotionChannelStatisticsQEExcelSUM: path + '/promotionChannelStatisticsQE/excelSUM',
  promotionChannelStatisticsQEUpdate: path + '/promotionChannelStatisticsQE/update',
  promotionChannelStatisticsQESUM: path + '/promotionChannelStatisticsQE/sum',
  onlineStatisticsHourly: path + '/onlineStatisticsHourly', //在线统计图
  //推广统计（OPPO）
  promotionStatisticsQEClassify: path + '/promotionStatisticsQEClassify',
  promotionStatisticsQEClassifyChanneName: path + '/promotionStatisticsQEClassify/channelName',
  promotionStatisticsQEClassifyCount: path + '/promotionStatisticsQEClassify/count',
  promotionStatisticsQEClassifyRefresh: path + '/promotionStatisticsQEClassify/refresh',
  promotionStatisticsQEClassifyGetOptions: path + '/promotionStatisticsQEClassify/getSelectOptions',
  promotionStatisticsQEClassifyExcel: path + '/promotionStatisticsQEClassify/excel',
  promotionStatisticsQEClassifyExcelSUM: path + '/promotionStatisticsQEClassify/excelSUM',
  promotionStatisticsQEClassifyUpdate: path + '/promotionStatisticsQEClassify/update',
  promotionStatisticsQEClassifySUM: path + '/promotionStatisticsQEClassify/sum',
  //用户充值间隔分析
  userRechargeIntervalAnalysisQE: path + '/userRechargeIntervalAnalysisQE',
  userRechargeIntervalAnalysisQECount: path + '/userRechargeIntervalAnalysisQE/count',
  userRechargeIntervalAnalysisQEExcel: path + '/userRechargeIntervalAnalysisQE/excel',
  //用户充值间隔分析(周)
  userRechargeIntervalAnalysisWeeklyQE: path + '/userRechargeIntervalAnalysisWeeklyQE',
  userRechargeIntervalAnalysisWeeklyQECount: path + '/userRechargeIntervalAnalysisWeeklyQE/count',
  userRechargeIntervalAnalysisWeeklyQEExcel: path + '/userRechargeIntervalAnalysisWeeklyQE/excel',
  //用户充值时段分析
  userRechargeTimeAnalysisQE: path + '/userRechargeTimeAnalysisQE',
  //充值按钮点击量
  torechargePVUV: path + '/torechargePVUV',
  torechargePVUVCount: path + '/torechargePVUV/count',
  torechargePVUVExcel: path + '/torechargePVUV/excel',
  torechargePVUVSUM: path + '/torechargePVUV/sum',
  torechargePVUVExcelSUM: path + '/torechargePVUV/excelSUM',
  //各房间点击量
  roomPVUV: path + '/roomPVUV',
  roomPVUVCount: path + '/roomPVUV/count',
  roomPVUVExcel: path + '/roomPVUV/excel',
  roomPVUVSUM: path + '/roomPVUV/sum',
  roomPVUVExcelSUM: path + '/roomPVUV/excelSUM',
  //任意门点击量
  arbitraryGatePVUV: path + '/arbitraryGatePVUV',
  arbitraryGatePVUVCount: path + '/arbitraryGatePVUV/count',
  arbitraryGatePVUVExcel: path + '/arbitraryGatePVUV/excel',
  arbitraryGatePVUVSUM: path + '/arbitraryGatePVUV/sum',
  arbitraryGatePVUVExcelSUM: path + '/arbitraryGatePVUV/excelSUM',
  //banner点击量
  bannerPVUV: path + '/bannerPVUV',
  bannerPVUVCount: path + '/bannerPVUV/count',
  bannerPVUVExcel: path + '/bannerPVUV/excel',
  bannerPVUVSUM: path + '/bannerPVUV/sum',
  bannerPVUVExcelSUM: path + '/bannerPVUV/excelSUM',
  //兑换点击量
  exchangePVUV: path + '/exchangePVUV',
  exchangePVUVCount: path + '/exchangePVUV/count',
  exchangePVUVExcel: path + '/exchangePVUV/excel',
  exchangePVUVSUM: path + '/exchangePVUV/sum',
  exchangePVUVExcelSUM: path + '/exchangePVUV/excelSUM',
  //一级游戏房
  level1Room: path + '/level1Room',
  level1RoomCount: path + '/level1Room/count',
  level1RoomExcel: path + '/level1Room/excel',
  level1RoomSUM: path + '/level1Room/sum',
  level1RoomExcelSUM: path + '/level1Room/excelSUM',
  //充值活动
  rechargeActivities: path + '/rechargeActivities',
  rechargeActivitiesCount: path + '/rechargeActivities/count',
  rechargeActivitiesExcel: path + '/rechargeActivities/excel',
  //运营弹窗
  operatingWindow: path + '/operatingWindow',
  operatingWindowCount: path + '/operatingWindow/count',
  operatingWindowExcel: path + '/operatingWindow/excel',
  //宝箱
  treasureBox: path + '/treasureBox',
  treasureBoxCount: path + '/treasureBox/count',
  treasureBoxExcel: path + '/treasureBox/excel',
  /*竞拍*/
  //市场refresh
  //渠道信息表
  newChannelView: path + '/newChannelView',
  newChannelViewCount: path + '/newChannelView/count',
  newChannelViewExcel: path + '/newChannelView/excel',
  newChannelViewRefresh: path + '/newChannelView/refresh',
  //渠道推广效果统计
  promotionEffectStatistics: path + '/promotionEffectStatistics',
  promotionEffectStatisticsCount: path + '/promotionEffectStatistics/count',
  promotionEffectStatisticsExcel: path + '/promotionEffectStatistics/excel',
  promotionEffectStatisticsRefresh: path + '/promotionEffectStatistics/refresh',
  promotionEffectStatisticsModify: path + '/promotionEffectStatistics/modify',
  //每日渠道推广效果统计
  dailyPromotionEffectStatistics: path + '/dailyPromotionEffectStatistics',
  dailyPromotionEffectStatisticsCount: path + '/dailyPromotionEffectStatistics/count',
  dailyPromotionEffectStatisticsExcel: path + '/dailyPromotionEffectStatistics/excel',
  dailyPromotionEffectStatisticsRefresh: path + '/dailyPromotionEffectStatistics/refresh',
  //渠道每周统计
  promotionChannelStatisticsWeekly: path + '/promotionChannelStatisticsWeekly',
  promotionChannelStatisticsWeeklyCount: path + '/promotionChannelStatisticsWeekly/count',
  promotionChannelStatisticsWeeklyExcel: path + '/promotionChannelStatisticsWeekly/excel',
  //渠道日环比数据
  channelDODData: path + '/channelDODData',
  channelDODDataCount: path + '/channelDODData/count',
  channelDODDataExcel: path + '/channelDODData/excel',
  //渠道周环比数据
  channelWOWData: path + '/channelWOWData',
  channelWOWDataCount: path + '/channelWOWData/count',
  channelWOWDataExcel: path + '/channelWOWData/excel',
  //渠道月环比数据
  channelMOMData: path + '/channelMOMData',
  channelMOMDataCount: path + '/channelMOMData/count',
  channelMOMDataExcel: path + '/channelMOMData/excel',
  //渠道季环比数据
  channelQOQData: path + '/channelQOQData',
  channelQOQDataCount: path + '/channelQOQData/count',
  channelQOQDataExcel: path + '/channelQOQData/excel',
  //渠道年环比数据
  channelYOYData: path + '/channelYOYData',
  channelYOYDataCount: path + '/channelYOYData/count',
  channelYOYDataExcel: path + '/channelYOYData/excel',
  //渠道用户活跃情况
  channelUserActivity: path + '/channelUserActivity',
  channelUserActivityCount: path + '/channelUserActivity/count',
  channelUserActivityExcel: path + '/channelUserActivity/excel',
  //市场看板
  marketViewUserAreaRatio: path + '/marketView/userAreaRatio',
  marketViewUserAreaRecharge: path + '/marketView/userAreaRecharge',
  marketView: path + '/marketView',
  //运营
  //订单信息表
  orderInfo: path + '/orderInfo',
  orderInfoCount: path + '/orderInfo/count',
  orderInfoExcel: path + '/orderInfo/excel',
  //流量统计表
  userInfo: path + '/userInfo',
  userInfoCount: path + '/userInfo/count',
  userInfoExcel: path + '/userInfo/excel',
  //用户信息表
  pagePVUV: path + '/pagePVUV',
  pagePVUVCount: path + '/pagePVUV/count',
  pagePVUVExcel: path + '/pagePVUV/excel',
  //竞拍记录表
  auctionRecord: path + '/auctionRecord',
  auctionRecordCount: path + '/auctionRecord/count',
  auctionRecordExcel: path + '/auctionRecord/excel',
  //积分记录表
  integralRecord: path + '/integralRecord',
  integralRecordCount: path + '/integralRecord/count',
  integralRecordExcel: path + '/integralRecord/excel',
  //充值记录表
  rechargeRecord: path + '/rechargeRecord',
  rechargeRecordCount: path + '/rechargeRecord/count',
  rechargeRecordExcel: path + '/rechargeRecord/excel',
  //流量路径统计表
  trafficStatistics: path + '/trafficStatistics',
  trafficStatisticsCount: path + '/trafficStatistics/count',
  trafficStatisticsExcel: path + '/trafficStatistics/excel',
  //元素点击表
  elementPVUV: path + '/elementPVUV',
  elementPVUVCount: path + '/elementPVUV/count',
  elementPVUVExcel: path + '/elementPVUV/excel',
  //用户浏览行为表
  userBrowsingBehavior: path + '/userBrowsingBehavior',
  userBrowsingBehaviorCount: path + '/userBrowsingBehavior/count',
  userBrowsingBehaviorExcel: path + '/userBrowsingBehavior/excel',
  //运营看板
  operateViewDailyNewUser: path + '/operateView/dailyNewUser',
  operateViewIncomeDetail: path + '/operateView/incomeDetail',
  operateViewActiveUser: path + '/operateView/activeUser',
  operateViewCoin1CancellationDeposit: path + '/operateView/coin1CancellationDeposit',
  operateView: path + '/operateView',
  //平台概览
  operatingSituationActiveUserTrends: path + '/operatingSituation/activeUserTrends',
  operatingSituationNewRegisteredUser: path + '/operatingSituation/newRegisteredUser',
  operatingSituationRechargeConsumption: path + '/operatingSituation/rechargeConsumption',
  operatingSituation: path + '/operatingSituation',
  operatingSituationConversionFunnel: path + '/operatingSituation/conversionFunnel',
  //竞拍实验室
  //任意门
  allTables: path + '/allTables',
  getOne: path + '/selectOne',
  getOneNum: path + '/selectOneNum',
  /*借款管理*/
  // 借款申请列表
  loanApplicationsList: path + '/loanApplicationsList',
  loanApplicationsListCount: path + '/loanApplicationsList/count',
  // 放款审核列表
  loanAuditList: path + '/loanAuditList',
  loanAuditListCount: path + '/loanAuditList/count',
  // 提额记录表
  raiseQuotaRecord: path + '/raiseQuotaRecord',
  raiseQuotaRecordCount: path + '/raiseQuotaRecord/count',
  //对账功能
  reconciliationFunction: path + '/reconciliationFunction',
  reconciliationFunctionCount: path + '/reconciliationFunction/count',
  //资产信息
  assetInformation: path + '/assetInformation',
  assetInformationCount: path + '/assetInformation/count',

  /*还款管理*/
  //还款列表  待还列表
  waitingForReturnList: path + '/waitingForReturnList',
  waitingForReturnListCount: path + '/waitingForReturnList/count',
  //还款列表  已还列表
  returnedList: path + '/returnedList',
  returnedListCount: path + '/returnedList/count',
  //对账列表  还款对账
  repaymentReconciliation: path + '/repaymentReconciliation',
  repaymentReconciliationCount: path + '/repaymentReconciliation/count',

  //对账列表  续期对账
  renewalReconciliation: path + '/renewalReconciliation',
  renewalReconciliationCount: path + '/renewalReconciliation/count',

  //退款列表  还款详情
  repaymentDetails: path + '/repaymentDetails',
  repaymentDetailsCount: path + '/repaymentDetails/count',

  //退款列表  续期详情
  renewalParticulars: path + '/renewalParticulars',
  renewalParticularsCount: path + '/renewalParticulars/count',

  //退款列表  已退列表
  rebackedList: path + '/rebackedList',
  rebackedListCount: path + '/rebackedList/count',

  //续期管理 续期列表
  renewalsList: path + '/renewalsList',
  renewalsListCount: path + '/renewalsList/count',
  /*数据分析*/
  // 每日还款单位数据
  dailyRepaymentUnitData: path + '/dailyRepaymentUnitData',
  dailyRepaymentUnitDataCount: path + '/dailyRepaymentUnitData/count',
  dailyRepaymentUnitDataRefresh: path + '/dailyRepaymentUnitData/refresh',
  dailyRepaymentUnitDataExcel: path + '/dailyRepaymentUnitData/excel',
  // 每日还款金额数据
  dailyRepaymentAmountData: path + '/dailyRepaymentAmountData',
  dailyRepaymentAmountDataCount: path + '/dailyRepaymentAmountData/count',
  dailyRepaymentAmountDataRefresh: path + '/dailyRepaymentAmountData/refresh',
  dailyRepaymentAmountDataExcel: path + '/dailyRepaymentAmountData/excel',
  // 还款逾期统计
  overdueRepaymentStatistics: path + '/overdueRepaymentStatistics',
  overdueRepaymentStatisticsCount: path + '/overdueRepaymentStatistics/count',
  overdueRepaymentStatisticsRefresh: path + '/overdueRepaymentStatistics/refresh',
  overdueRepaymentStatisticsExcel: path + '/overdueRepaymentStatistics/excel',
  // 21天分期统计
  daysStageStatistics21: path + '/daysStageStatistics21',
  daysStageStatistics21Count: path + '/daysStageStatistics21/count',
  daysStageStatistics21Refresh: path + '/daysStageStatistics21/refresh',
  daysStageStatistics21Excel: path + '/daysStageStatistics21/excel',
  // 90天分期统计
  daysStageStatistics90: path + '/daysStageStatistics90',
  daysStageStatistics90Count: path + '/daysStageStatistics90/count',
  daysStageStatistics90Refresh: path + '/daysStageStatistics90/refresh',
  daysStageStatistics90Excel: path + '/daysStageStatistics90/excel',
  // 21天分期提额统计
  installmentPromotionStatistics21: path + '/installmentPromotionStatistics21',
  installmentPromotionStatistics21Count: path + '/installmentPromotionStatistics21/count',
  installmentPromotionStatistics21Refresh: path + '/installmentPromotionStatistics21/refresh',
  installmentPromotionStatistics21Excel: path + '/installmentPromotionStatistics21/excel',
  // 每日放款数据
  dailyLendingData: path + '/dailyLendingData',
  dailyLendingDataCount: path + '/dailyLendingData/count',
  dailyLendingDataRefresh: path + '/dailyLendingData/refresh',
  dailyLendingDataExcel: path + '/dailyLendingData/excel',
  dailyLendingDataExcel2: path + '/dailyLendingData/excel2',
  // 资金分析
  fundAnalysis: path + '/fundAnalysis',
  fundAnalysisCount: path + '/fundAnalysis/count',
  fundAnalysisRefresh: path + '/fundAnalysis/refresh',
  fundAnalysisExcel: path + '/fundAnalysis/excel',
  // 资金分析(产品)
  fundAnalysisProduct: path + '/fundAnalysisProduct',
  fundAnalysisProductCount: path + '/fundAnalysisProduct/count',
  fundAnalysisProductRefresh: path + '/fundAnalysisProduct/refresh',
  fundAnalysisProductExcel: path + '/fundAnalysisProduct/excel',
  //催收管理
  collectionManagement: path + '/collectionManagement',
  collectionManagementCount: path + '/collectionManagement/count',
  collectionManagementRefresh: path + '/collectionManagement/refresh',
  collectionManagementExcel: path + '/collectionManagement/excel',
  //在催金额
  promptAmount: path + '/promptAmount',
  promptAmountCount: path + '/promptAmount/count',
  promptAmountRefresh: path + '/promptAmount/refresh',
  promptAmountExcel: path + '/promptAmount/excel',
  // 提前还款统计
  prepaymentStatistics: path + '/prepaymentStatistics',
  prepaymentStatisticsCount: path + '/prepaymentStatistics/count',
  prepaymentStatisticsRefresh: path + '/prepaymentStatistics/refresh',
  prepaymentStatisticsExcel: path + '/prepaymentStatistics/excel',
  //自然渠道统计
  naturalChannelStatistics: path + '/naturalChannelStatistics',
  naturalChannelStatisticsCount: path + '/naturalChannelStatistics/count',
  naturalChannelStatisticsExcel: path + '/naturalChannelStatistics/excel',
  // 必过券统计
  couponStatistics: path + '/couponStatistics',
  couponStatisticsCount: path + '/couponStatistics/count',
  couponStatisticsRefresh: path + '/couponStatistics/refresh',
  couponStatisticsExcel: path + '/couponStatistics/excel',
  // 还款抵扣券分析
  repaymentCouponAnalysis: path + '/repaymentCouponAnalysis',
  repaymentCouponAnalysisCount: path + '/repaymentCouponAnalysis/count',
  repaymentCouponAnalysisRefresh: path + '/repaymentCouponAnalysis/refresh',
  repaymentCouponAnalysisExcel: path + '/repaymentCouponAnalysis/excel',
  // 分时段还款率
  hourlyRepaymentRate: path + '/hourlyRepaymentRate',
  hourlyRepaymentRateP: path + '/hourlyRepaymentRateP',
  hourlyRepaymentRateCount: path + '/hourlyRepaymentRate/count',
  hourlyRepaymentRateRefresh: path + '/hourlyRepaymentRate/refresh',
  hourlyRepaymentRateExcel: path + '/hourlyRepaymentRate/excel',
  // 关键数据
  keyData: path + '/keyData',
  keyDataCount: path + '/keyData/count',
  keyDataExcel: path + '/keyData/excel',
  keyDataRefresh: path + '/keyData/refresh',
  //平台数据
  platformData: path + '/platformData',
  platformDataCount: path + '/platformData/count',
  platformDataRefresh: path + '/platformData/refresh',
  platformDataExcel: path + '/platformData/excel',
  /*开心商城*/
  //每日支出数据
  dailyExpenditureData: path + '/dailyExpenditureData',
  dailyExpenditureDataCount: path + '/dailyExpenditureData/count',
  dailyExpenditureDataExcel: path + '/dailyExpenditureData/excel',
  /*现金借呗*/
  // 每日还款数据
  dailyLendingDataXJJB: path + '/dailyLendingDataXJJB',
  dailyLendingDataXJJBCount: path + '/dailyLendingDataXJJB/count',
  dailyLendingDataXJJBRefresh: path + '/dailyLendingDataXJJB/refresh',
  dailyLendingDataXJJBExcel: path + '/dailyLendingDataXJJB/excel',
  // 每日放款数据
  dailyRepaymentUnitDataXJJB: path + '/dailyRepaymentUnitDataXJJB',
  dailyRepaymentUnitDataXJJBCount: path + '/dailyRepaymentUnitDataXJJB/count',
  dailyRepaymentUnitDataXJJBRefresh: path + '/dailyRepaymentUnitDataXJJB/refresh',
  dailyRepaymentUnitDataXJJBExcel: path + '/dailyRepaymentUnitDataXJJB/excel',
  /*财务分析*/
  // 还款明细表
  repaymentMinutia: path + '/repaymentMinutia',
  repaymentMinutiaCount: path + '/repaymentMinutia/count',
  repaymentMinutiaExcel: path + '/repaymentMinutia/excel',
  // 对账分析表
  reconciliationAnalysis: path + '/reconciliationAnalysis',
  reconciliationAnalysisCount: path + '/reconciliationAnalysis/count',
  reconciliationAnalysisExcel: path + '/reconciliationAnalysis/excel',
  reconciliationAnalysisModify: path + '/reconciliationAnalysis/modify',
  // 企鹅对账分析表
  reconciliationAnalysisQE: path + '/reconciliationAnalysisQE',
  reconciliationAnalysisQECount: path + '/reconciliationAnalysisQE/count',
  reconciliationAnalysisQEExcel: path + '/reconciliationAnalysisQE/excel',
  reconciliationAnalysisQEModify: path + '/reconciliationAnalysisQE/modify',
  // 企鹅收入结算表
  incomeStatementQE: path + '/incomeStatementQE',
  incomeStatementQECount: path + '/incomeStatementQE/count',
  incomeStatementQEExcel: path + '/incomeStatementQE/excel',
  // 企鹅汇总明细表
  penguinSummaryQE: path + '/penguinSummaryQE',
  penguinSummaryQECount: path + '/penguinSummaryQE/count',
  penguinSummaryQEExcel: path + '/penguinSummaryQE/excel',
  //还款日报表统计
  reportStatistics: path + '/reportStatistics',
  reportStatisticsCount: path + '/reportStatistics/count',
  reportStatisticsExcel: path + '/reportStatistics/excel',
  //放款日报表统计
  lendingDaily: path + '/lendingDaily',
  lendingDailyCount: path + '/lendingDaily/count',
  lendingDailyExcel: path + '/lendingDaily/excel',
  lendingDailySum: path + '/lendingDaily/sum',
  //企鹅抓娃娃进销存明细表
  inventoryManagementQE: path + '/inventoryManagementQE',
  inventoryManagementQECount: path + '/inventoryManagementQE/count',
  inventoryManagementQERefresh: path + '/inventoryManagementQE/refresh',
  inventoryManagementQEExcel: path + '/inventoryManagementQE/excel',
  /*推广管理*/
  // 推广渠道
  promotionChannel: path + '/promotionChannel',
  promotionChannelCount: path + '/promotionChannel/count',
  promotionChannelExcel: path + '/promotionChannel/excel',
  // 推广员管理
  promoterManagement: path + '/promoterManagement',
  promoterManagementCount: path + '/promoterManagement/count',
  promoterManagementGetOptions: path + '/promoterManagement/getSelectOptions',
  promoterManagementExcel: path + '/promoterManagement/excel',
  // 推广统计(渠道)
  promotionChannelStatistics: path + '/promotionChannelStatistics',
  promotionChannelStatisticsCount: path + '/promotionChannelStatistics/count',
  promotionChannelStatisticsRefresh: path + '/promotionChannelStatistics/refresh',
  promotionChannelStatisticsGetOptions: path + '/promotionChannelStatistics/getSelectOptions',
  promotionChannelStatisticsExcel: path + '/promotionChannelStatistics/excel',
  // 七日推广统计(渠道)
  promotionChannelStatistics7: path + '/promotionChannelStatistics7',
  promotionChannelStatistics7Count: path + '/promotionChannelStatistics7/count',
  promotionChannelStatistics7Refresh: path + '/promotionChannelStatistics7/refresh',
  promotionChannelStatistics7GetOptions: path + '/promotionChannelStatistics7/getSelectOptions',
  promotionChannelStatistics7Excel: path + '/promotionChannelStatistics7/excel',
  // 推广统计(地区)
  promotionRegionStatistics: path + '/promotionRegionStatistics',
  promotionRegionStatisticsCount: path + '/promotionRegionStatistics/count',
  promotionRegionStatisticsRefresh: path + '/promotionRegionStatistics/refresh',
  promotionRegionStatisticsExcel: path + '/promotionRegionStatistics/excel',
  //渠道统计汇总
  channelStatisticsSummary: path + '/channelStatisticsSummary',
  channelStatisticsSummaryCount: path + '/channelStatisticsSummary/count',
  channelStatisticsSummaryGetOptions: path + '/channelStatisticsSummary/getSelectOptions',
  channelStatisticsSummaryExcel: path + '/channelStatisticsSummary/excel',
  //PVUV
  PVUV: path + '/PVUV',
  PVUVCount: path + '/PVUV/count',
  PVUVGetOptions: path + '/PVUV/getSelectOptions',
  PVUVExcel: path + '/PVUV/excel',
  /*绩效考评*/
  //部门绩效考评
  achievements: path + '/achievements',
  achievementsCount: path + '/achievements/count',
  /*权限管理*/
  // 员工信息
  employeeList: path + '/employeeList',
  employeeListCount: path + '/employeeList/count',
  employeeListPrivilegeModify: path + '/employeeList/privilegeModify',
  employeAdd: path + '/employeeList/add',
  employeDelete: path + '/employeeList/delete',
  modifyMultiple: path + '/modifyMultiple',
    /*开心分期*/
    /**黑卡 */
  //每日放款记录
  periodDailyLendingData: path + '/periodDailyLendingData',
  periodDailyLendingDataCount: path + '/periodDailyLendingData/count',
  periodDailyLendingDataRefresh: path + '/periodDailyLendingData/refresh',
  periodDailyLendingDataExcel: path + '/periodDailyLendingData/excel',
  //还款逾期记录
  periodOverdueRepaymentStatistics: path + '/periodOverdueRepaymentStatistics',
  periodOverdueRepaymentStatisticsCount: path + '/periodOverdueRepaymentStatistics/count',
  periodOverdueRepaymentStatisticsRefresh: path + '/periodOverdueRepaymentStatistics/refresh',
  periodOverdueRepaymentStatisticsExcel: path + '/periodOverdueRepaymentStatistics/excel',
  //每日还款金额记录
  periodDailyRepaymentAmountData: path + '/periodDailyRepaymentAmountData',
  periodDailyRepaymentAmountDataCount: path + '/periodDailyRepaymentAmountData/count',
  periodDailyRepaymentAmountDataRefresh: path + '/periodDailyRepaymentAmountData/refresh',
  periodDailyRepaymentAmountDataExcel: path + '/periodDailyRepaymentAmountData/excel',
   //每日还款明细记录
  repaymentDetailData: path + '/repaymentDetailData',
  repaymentDetailDataCount: path + '/repaymentDetailData/count',
  repaymentDetailDataRefresh: path + '/repaymentDetailData/refresh',
  repaymentDetailDataExcel: path + '/repaymentDetailData/excel',
  //在催金额记录
  promptAmountData: path + '/promptAmountData',
  promptAmountDataCount: path + '/promptAmountData/count',
  promptAmountDataRefresh: path + '/promptAmountData/refresh',
  promptAmountDataExcel: path + '/promptAmountData/excel',
  //每日结算报表
  dailySettlementReport: path + '/dailySettlementReport',
  dailySettlementReportCount: path + '/dailySettlementReport/count',
  dailySettlementReportRefresh: path + '/dailySettlementReport/refresh',
  dailySettlementReportExcel: path + '/dailySettlementReport/excel',
  dailySettlementReportSum: path + '/dailySettlementReport/sum',
  //每日债权报表
  dailyClaimsReport: path + '/dailyClaimsReport',
  dailyClaimsReportCount: path + '/dailyClaimsReport/count',
  dailyClaimsReportRefresh: path + '/dailyClaimsReport/refresh',
  dailyClaimsReportExcel: path + '/dailyClaimsReport/excel',
  dailyClaimsReportSum: path + '/dailyClaimsReport/sum',
  //ZCM开心分期还款数据核对
  ZCMRepaymentDataReconciliation: path + '/ZCMRepaymentDataReconciliation',
  ZCMRepaymentDataReconciliationCount: path + '/ZCMRepaymentDataReconciliation/count',
  ZCMRepaymentDataReconciliationRefresh: path + '/ZCMRepaymentDataReconciliation/refresh',
  ZCMRepaymentDataReconciliationExcel: path + '/ZCMRepaymentDataReconciliation/excel',
  //ZB还款数据核对
  ZBrepaymentData: path + '/ZBrepaymentData',
  ZBrepaymentDataCount: path + '/ZBrepaymentData/count',
  ZBrepaymentDataRefresh: path + '/ZBrepaymentData/refresh',
  ZBrepaymentDataExcel: path + '/ZBrepaymentData/excel',
  //每月结算表
  monthlySettlementData: path + '/monthlySettlementData',
  monthlySettlementDataCount: path + '/monthlySettlementData/count',
  monthlySettlementDataRefresh: path + '/monthlySettlementData/refresh',
  monthlySettlementDataExcel: path + '/monthlySettlementData/excel',
  //每月债权报表
  monthlyBondData: path + '/monthlyBondData',
  monthlyBondDataCount: path + '/monthlyBondData/count',
  monthlyBondDataRefresh: path + '/monthlyBondData/refresh',
  monthlyBondDataExcel: path + '/monthlyBondData/excel',
  //支付宝还款对账
  repaymentReconciliationZFB: path + '/repaymentReconciliationZFB',
  repaymentReconciliationZFBCount: path + '/repaymentReconciliationZFB/count',
  repaymentReconciliationZFBRefresh: path + '/repaymentReconciliationZFB/refresh',
  repaymentReconciliationZFBExcel: path + '/repaymentReconciliationZFB/excel',
  //XN还款数据核对
  dataCheckXN: path + '/dataCheckXN',
  dataCheckXNCount: path + '/dataCheckXN/count',
  dataCheckXNRefresh: path + '/dataCheckXN/refresh',
  dataCheckXNExcel: path + '/dataCheckXN/excel',
  //三方对账分析
  threePartyAccountAnalysis: path + '/threePartyAccountAnalysis',
  threePartyAccountAnalysisCount: path + '/threePartyAccountAnalysis/count',
  threePartyAccountAnalysisRefresh: path + '/threePartyAccountAnalysis/refresh',
  threePartyAccountAnalysisExcel: path + '/threePartyAccountAnalysis/excel',
  threePartyAccountAnalysisModify: path + '/threePartyAccountAnalysis/modify',
  /**商城 */
  //收入结算总表
  totalIncome: path + '/totalIncome',
  totalIncomeCount: path + '/totalIncome/count',
  totalIncomeRefresh: path + '/totalIncome/refresh',
  totalIncomeExcel: path + '/totalIncome/excel',
  //收入结算明细表
  detailIncome: path + '/detailIncome',
  detailIncomeCount: path + '/detailIncome/count',
  detailIncomeRefresh: path + '/detailIncome/refresh',
  detailIncomeExcel: path + '/detailIncome/excel',
  //总销售额统计表
  totalSales: path + '/totalSales',
  totalSalesCount: path + '/totalSales/count',
  totalSalesRefresh: path + '/totalSales/refresh',
  totalSalesExcel: path + '/totalSales/excel',
  //商品销售记录
  detailSales: path + '/detailSales',
  detailSalesCount: path + '/detailSales/count',
  detailSalesRefresh: path + '/detailSales/refresh',
  detailSalesExcel: path + '/detailSales/excel',
  //订单详情记录
  detailOrder: path + '/detailOrder',
  detailOrderCount: path + '/detailOrder/count',
  detailOrderRefresh: path + '/detailOrder/refresh',
  detailOrderExcel: path + '/detailOrder/excel',
  //每日零钱资金分析表
  dailyPocketMoneyAnalysis: path + '/dailyPocketMoneyAnalysis',
  dailyPocketMoneyAnalysisCount: path + '/dailyPocketMoneyAnalysis/count',
  dailyPocketMoneyAnalysisRefresh: path + '/dailyPocketMoneyAnalysis/refresh',
  dailyPocketMoneyAnalysisExcel: path + '/dailyPocketMoneyAnalysis/excel',
  //每日大礼包收入报表
  dailyPackageIncomeStatement: path + '/dailyPackageIncomeStatement',
  dailyPackageIncomeStatementCount: path + '/dailyPackageIncomeStatement/count',
  dailyPackageIncomeStatementRefresh: path + '/dailyPackageIncomeStatement/refresh',
  dailyPackageIncomeStatementExcel: path + '/dailyPackageIncomeStatement/excel',
  //每日商城订单报表
  dailyMallOrderReport: path + '/dailyMallOrderReport',
  dailyMallOrderReportCount: path + '/dailyMallOrderReport/count',
  dailyMallOrderReportRefresh: path + '/dailyMallOrderReport/refresh',
  dailyMallOrderReportExcel: path + '/dailyMallOrderReport/excel',
  //零钱充值对账分析
  rechargeOfChangeReport: path + '/rechargeOfChangeReport',
  rechargeOfChangeReportCount: path + '/rechargeOfChangeReport/count',
  rechargeOfChangeReportRefresh: path + '/rechargeOfChangeReport/refresh',
  rechargeOfChangeReportExcel: path + '/rechargeOfChangeReport/excel',
  rechargeOfChangeReportModify: path + '/rechargeOfChangeReport/modify',
  //商城月报表
  mallMonthlyReport: path + '/mallMonthlyReport',
  mallMonthlyReportCount: path + '/mallMonthlyReport/count',
  mallMonthlyReportRefresh: path + '/mallMonthlyReport/refresh',
  mallMonthlyReportExcel: path + '/mallMonthlyReport/excel',
  //零钱资金账户明细表
  changeFundAccountStatement: path + '/changeFundAccountStatement',
  changeFundAccountStatementCount: path + '/changeFundAccountStatement/count',
  changeFundAccountStatementRefresh: path + '/changeFundAccountStatement/refresh',
  changeFundAccountStatementExcel: path + '/changeFundAccountStatement/excel',
  /***市场***/
  //渠道统计表
  channelStatistics: path + '/channelStatistics',
  channelStatisticsCount: path + '/channelStatistics/count',
  channelStatisticsRefresh: path + '/channelStatistics/refresh',
  channelStatisticsExcel: path + '/channelStatistics/excel',
  channelStatisticsGetOptions: path + '/channelStatistics/getSelectOptions',
  //渠道统计汇总表
  channelSummaryStatistics: path + '/channelSummaryStatistics',
  channelSummaryStatisticsCount: path + '/channelSummaryStatistics/count',
  channelSummaryStatisticsRefresh: path + '/channelSummaryStatistics/refresh',
  channelSummaryStatisticsExcel: path + '/channelSummaryStatistics/excel',
  //渠道推广信息表
  channelPromotionInformation: path + '/channelPromotionInformation',
  channelPromotionInformationCount: path + '/channelPromotionInformation/count',
  channelPromotionInformationExcel: path + '/channelPromotionInformation/excel',
  //推广员信息表
  promotionInformation: path + '/promotionInformation',
  promotionInformationCount: path + '/promotionInformation/count',
  promotionInformationExcel: path + '/promotionInformation/excel',
  //注册量统计表
  registrationStatisticsReport: path + '/registrationStatisticsReport',
  registrationStatisticsReportCount: path + '/registrationStatisticsReport/count',
  registrationStatisticsReportExcel: path + '/registrationStatisticsReport/excel',
  //推广统计-地区
  promotionStatisticsArea: path + '/promotionStatisticsArea',
  promotionStatisticsAreaCount: path + '/promotionStatisticsArea/count',
  promotionStatisticsAreaExcel: path + '/promotionStatisticsArea/excel',
  // 推广统计-渠道
  promotionStatisticalChannel: path + '/promotionStatisticalChannel',
  promotionStatisticalChannelCount: path + '/promotionStatisticalChannel/count',
  promotionStatisticalChannelRefresh: path + '/promotionStatisticalChannel/refresh',
  promotionStatisticalChannelGetOptions: path + '/promotionStatisticalChannel/getSelectOptions',
  promotionStatisticalChannelExcel: path + '/promotionStatisticalChannel/excel'
}
