module.exports = {
  /*登录验证*/
  login: 'PR_BS_USER',
  /*首页*/
  main: 'PR_UI_USER_STATISTIC_INFO',
  /*修改密码*/
  passwordModify: 'PR_BS_USER',
  /*用户信息管理*/
  // 用户列表
  userList: 'YH_INFO',
  // 用户通讯录
  userAddressBook: 'yh_txl',
  // 银行卡列表
  bankcardsList: 'YH_CARD',
  // 用户认证列表
  userAuthenticationList: {
    A: 'yh_info',
    B: 'yh_card'
  },
  // 用户实名认证列表
  userNameAuthenticationList: 'yh_info',
  // 优惠券信息列表
  discountCoupon: {
    a: 'coupon_user',
    b: 'bw_order_info'
  },
  // 新用户标签列表
  NewUserTagList: 'pr_market_usertag_new',
  // 老用户标签列表
  OldUserTagList: {
    a: 'pr_market_usertag_old',
    b: 'pr_market_usertag_old_loanmx'
  },
  /*RMAB*/
  // 借款通过率
  loanThroughRate: 'pr_ds_order_analysis_def',
  loanThroughRateAll: 'pr_ds_order_analysis_all',
  loanOverdueRecallRate: 'pr_ds_odu_coll_analysis',
  userBasePortrait: 'up_yh_info_analysis',
  operationUserPortrait: 'up_operate_analysis',
  invitationEvent: 'PR_DS_INVITATION_EVENT_RMAB_EXHIBITION',
  riskControlFactorAnalysis: 'pr_fk_analysis',
  //图表 新用户通过率
  newUserPassRateRatioTab1: 'pr_new_passrate_analysis',
  newUserPassRateRatioTab2: 'pr_new_pass_channel_analysis',
  newUserPassRateRatioTab2Table: 'report_bw_channel_new',
  newUserPassRateRatioTab3: 'pr_canel_refuse_chart_analysis',
  /*企鹅抓娃娃*/
  // 数据概览
  dataOverview: {
    day: 'QE_data_report_day',
    room: 'QE_data_report_room'
  },
  dataOverviewAll: {
    day: 'qe_data_report_his',
    room: 'qe_data_report_room_his'
  },
  //用户充值间隔分析
  userRechargeIntervalAnalysis: 'qe_report_recharge_interval',
  //用户充值间隔分析(周)
  userRechargeIntervalAnalysisWeekly: 'qe_report_recharge_week',
  //用户充值时段分析
  userRechargeTimeAnalysis: 'qe_report_recharge_hour',
  //充值按钮点击量
  torechargePVUV: 'qe_pvuv_torecharge',
  //各房间点击量
  roomPVUV: 'QE_pvuv_room',
  //任意门点击量
  arbitraryGatePVUV: 'QE_pvuv_arbitraryGate',
  //banner点击量
  bannerPVUV: 'qe_pvuv_banner',
  //兑换点击量
  exchangePVUV: 'qe_pvuv_exchange',
  //一级游戏房
  level1Room: 'qe_report_level1_room',
  //充值活动
  rechargeActivities: 'QE_pvuv_rechage_activity',
  //运营弹窗
  operatingWindow: 'QE_pvuv_dialog_activity',
  //宝箱
  treasureBox: 'QE_pvuv_Bbox',
  //渠道信息表
  newChannelView: 'pr_au_channel_info',
  //渠道推广效果统计
  promotionEffectStatistics: 'pr_au_channel_effect_statistic',
  promotionEffectStatisticsAdd: 'pr_au_channel_effect_statistic_add',
  //每日渠道推广效果统计
  dailyPromotionEffectStatistics: 'pr_au_channel_statistic_info',
  //渠道每周统计
  promotionChannelStatisticsWeekly: 'pr_au_channel_effect_statistic_week',
  //渠道日环比数据
  channelDODData: 'pr_au_channel_day_ratio',
  //渠道周环比数据
  channelWOWData: 'pr_au_channel_week_ratio',
  //渠道月环比数据
  channelMOMData: 'pr_au_channel_month_ratio',
  //渠道季环比数据
  channelQOQData: 'pr_au_channel_quarter_ratio',
  //渠道年环比数据
  channelYOYData: 'pr_au_channel_year_ratio',
  //渠道用户活跃情况
  channelUserActivity: 'pr_au_channel_user_activity',
  //订单信息表
  orderInfo: 'cf_report_order_info',
  //用户信息表
  userInfo: 'cf_report_user_info',
  //流量统计表
  pagePVUV: 'cf_report_page_pvuv',
  //竞拍记录表
  auctionRecord: 'cf_report_auction_bid',
  //积分记录表
  integralRecord: 'cf_report_integral_order',
  //充值记录表
  rechargeRecord: 'cf_report_recharge_order',
  //流量路径统计表
  trafficStatistics: 'cf_report_page_pvuv',
  //元素点击表
  elementPVUV: 'cf_report_element_pvuv',
  //用户浏览行为表
  userBrowsingBehavior: 'cf_report_user_browse',
  //市场看板
  marketView: {
    userAreaRatio: 'pr_au_channel_market_panel_city',
    userAreaRecharge: 'pr_au_channel_market_panel_Recharge',
    marketView: 'pr_au_channel_market_panel_hb'
  },
  //运营看板
  operateView: 'cf_report_operate_view',
  coin1CancellationDeposit: 'cf_report_coin_record',
  // 推广统计(渠道)
  QEpromotionChannelStatistics: 'QE_generalize_report_channel',
  // 在线人数时段统计
  QEonlineStatisticsHourly: 'QE_period_report_online',
  //PVUV
  PVUV: 'pr_ds_dkcspvuv_analysis',
  /*借款管理*/
  //借款申请列表
  loanApplicationsList: 'bw_order_info',
  //放款审核列表
  loanAuditList: 'bw_order_info',
  //提额记录表
  raiseQuotaRecord: 'yh_quota',
  //对账功能
  reconciliationFunction: {
    t1: 'bw_assetsorder_info_ext',
    t: 'bw_order_info'
  },
  //资产信息
  assetInformation: {
    t: 'bw_assetsorder_info_ext',
    t1: 'bw_order_info'
  },

  /*还款管理*/
  //还款列表  待还列表
  waitingForReturnList: {
    t: 'hk_info',
    t1: 'yh_info'
  },
  //还款列表  已还列表
  returnedList: {
    t: 'hk_info',
    t1: 'yh_info'
  },
  //对账列表  还款对账
  repaymentReconciliation: {
    t: 'hk_info',
    t1: 'yh_info',
    t2: 'hk_record'
  },
  //对账列表  续期对账
  renewalReconciliation: {
    t: 'hk_continue',
    t1: 'yh_info',
    t2: 'hk_info'
  },
  //退款列表 还款详情
  repaymentDetails: {
    t: 'hk_info',
    t1: 'hk_record',
    t2: 'yh_info'
  },
  //退款列表 续期详情
  renewalParticulars: {
    t: 'hk_continue',
    t1: 'hk_info',
    t2: 'yh_info'
  },
  //退款列表 已退列表
  rebackedList: {
    t: 'hk_record_back',
    t1: 'yh_info'
  },
  //续期管理 续期列表
  renewalsList: {
    t: 'yh_info',
    t1: 'hk_continue'
  },
  /*数据分析*/
  // 每日还款金额数据
  dailyRepaymentAmountData: 'PR_DS_REPAYMENT_MONEY_DAY',
  // 每日还款单位数据
  dailyRepaymentUnitData: 'PR_DS_REPAYMENT_NUM_DAY',
  // 21天分期统计
  daysStageStatistics21: 'PR_DS_PERIOD_STATISTICS_DAY_21',
  // 21天分期提额统计
  installmentPromotionStatistics21: 'pr_ds_period_statistics_day_quota_21',
  // 90天分期提额统计
  daysStageStatistics90: 'pr_ds_period_statistics_day_90',
  // 每日放款数据
  dailyLendingData: 'PR_DS_LOAN_DAY',
  // 还款逾期统计
  overdueRepaymentStatistics: 'PR_DS_OVERDUE_REPAYMENT_STATISTIC',
  //资金分析
  fundAnalysis: 'PR_DS_FUND_ANALYSIS',
  //资金分析（产品）
  fundAnalysisProduct: 'pr_ds_fund_analysis_prd',
  //催收管理
  collectionManagement: 'PR_DS_COLLECTION_MANAGEMENT',
  //提前还款统计
  prepaymentStatistics: 'PR_DS_PREPAYMENT',
  //自然渠道统计
  naturalChannelStatistics: 'PR_DS_ANALYSIS_CHANNEL_NATURAL',
  //必过券统计
  couponStatistics: 'user_coupons_analysis',
  //还款抵扣券分析
  repaymentCouponAnalysis: 'repayment_voucher_statistics',
  //分时段利率
  hourlyRepaymentRate: 'rate_repaymented_hour',
  //关键数据
  keyData: 'pr_ds_crux',
  //平台数据
  platformData: 'PR_DS_PLATFORM_DATA',
  //每日支出数据
  dailyExpenditureData: 'pr_buy_stages_loan_day',
  //每日还款数据
  dailyRepaymentUnitDataXJJB: 'pr_ds_repayment_num_day_xjjb',
  //每日放款数据
  dailyLendingDataXJJB: 'pr_ds_loan_day_xjjb',
  /*财务分析*/
  // 还款明细表
  repaymentMinutia: 'PR_DS_REPAYMENT_DETAIL',
  //对账分析表
  reconciliationAnalysis: {
    t: 'PR_DS_RECONCILIATION_ANALYSIS',
    t1: 'PR_DS_RECONCILIATION_ANALYSIS_CWLR'
  },
  //企鹅对账分析表
  reconciliationAnalysisQE: {
    t: 'pr_fa_penguin_account_details',
    t1: 'pr_fa_penguin_account_details_cwlr'
  },
  //企鹅收入结算表
  incomeStatementQE: 'pr_fa_penguin_income_statement',
  //企鹅汇总明细表
  penguinSummaryQE: 'pr_fa_penguin_detail_list',
  //还款日报表统计
  reportStatistics: 'PR_DS_REPAYMENT_SUM',
  //放款日报表统计
  lendingDaily: 'pr_ds_reconciliation_table',
  lendingDaily2: 'pr_ds_reconciliation_table_b',
  //在催金额
  promptAmount: 'PR_DS_COLLECTION_DOING',
  //企鹅抓娃娃进销存明细表
  inventoryManagementQE: 'pr_fa_penguin_Invoic_info',
  /*推广管理*/
  // 推广渠道
  promotionChannel: {
    t: 'canal_info',
    t1: 'canal_rate'
  },
  // 推广员管理
  promoterManagement: {
    t: 'tg_yh_info',
    t1: 'yh_info',
    t2: 'canal_info'
  },
  // 推广统计(渠道)
  promotionChannelStatistics: 'PR_PM_PROMOTION_STATISTIC_CHANNEL',
  // 七日推广统计(渠道)
  promotionChannelStatistics7: 'PR_PM_PROMOTION_STATISTIC_CHANNEL_SEVEN',
  // 推广统计(地区)
  promotionRegionStatistics: 'PR_PM_PROMOTION_STATISTIC_REGION',
  // 渠道统计汇总
  channelStatisticsSummary: 'pr_pm_channel_statistic_sum',
  /*绩效考评*/
  //部门绩效考评
  evaluation: {
    achievements: 'cf_department_KPI_assess'
  },
  /*权限管理*/
  // 员工信息
  privilegeManage: {
    employeeList: 'PR_BS_USER'
  },
  /*开心分期*/
  period: {
    /**黑卡 */
    //每日放款记录
    periodDailyLendingData: 'PR_DS_LOAN_DAY_KXFQ',
    //还款逾期记录
    periodOverdueRepaymentStatistics: 'PR_DS_OVERDUE_REPAYMENT_STATISTIC_KXFQ',
    //每日还款金额记录
    periodDailyRepaymentAmountData: 'PR_DS_REPAYMENT_MONEY_DAY_KXFQ',
    //每日还款明细记录
    repaymentDetailData: 'PR_DS_REPAYMENT_DETAIL_KXFQ',
    //在催金额记录
    promptAmountData: 'PR_DS_COLLECTION_DOING_KXFQ',
    //每日结算报表
    dailySettlementReport: 'PR_FA_SETTLEMENT_DAY',
    //每日债权报表
    dailyClaimsReport: 'PR_FA_CREDITOR_DAY',
    //ZCM还款数据核对
    ZCMRepaymentDataReconciliation: 'PR_FA_REPAYMENT_DATA_CHECK_ZCM',
    //ZB还款数据核对
    ZBrepaymentData: 'PR_FA_REPAYMENT_DATA_CHECK_ZB',
    //每月结算表
    monthlySettlementData: 'PR_FA_SETTLEMENT_MONTH',
    //每月债权报表
    monthlyBondData: 'PR_FA_CREDITOR_MONTH',
    //支付宝还款对账
    repaymentReconciliationZFB: 'PR_FA_REPAYMENT_DATA_CHECK_ZFB',
    //XN还款数据核对
    dataCheckXN: 'PR_FA_DATA_CHECK_XN',
    //三方对账分析
    threePartyAccountAnalysis: 'PR_FA_THREE_PARTY_ACCOUNT_ANALYSIS',
    /**商城 */
    //收入结算总表
    totalIncome: 'PR_DS_INCOME_KXFQ',
    //收入结算明细表
    detailIncome: 'PR_DS_INCOME_DETAIL_KXFQ',
    //总销售额统计表
    totalSales: 'PR_DS_SALES_AMOUNT_KXFQ',
    //商品销售记录
    detailSales: 'PR_DS_SALES_DETAIL_KXFQ',
    //订单详情记录
    detailOrder: 'PR_DS_ORDER_DETAIL_KXFQ',
    //每日零钱资金分析表
    dailyPocketMoneyAnalysis: 'PR_DS_POCKET_DAY_KXFQ',
    //每日大礼包收入报表
    dailyPackageIncomeStatement: 'PR_DS_DLB_INCOME_DAY_KXFQ',
    //每日商城订单报表
    dailyMallOrderReport: 'PR_CW_MALLORDER_DAY_KXFQ',
    //零钱充值对账分析
    rechargeOfChangeReport: 'pr_cw_pocketcheck_day_kxfq',
    //商城月报表
    mallMonthlyReport: 'pr_cw_mall_month_kxfq',
    //零钱资金账户明细表
    changeFundAccountStatement: 'pr_cw_pocket_mx_kxfq',
    //渠道统计表
    channelStatistics: 'PR_PM_CHANNEL_STATISTIC_KXFQ',
    //渠道统计汇总表
    channelSummaryStatistics: 'PR_PM_CHANNEL_STATISTIC_SUM_KXFQ',
    //渠道推广信息
    channelPromotionInformation: 'PR_FA_CHANNEL_INFO_KXFQ',
    //推广员信息
    promotionInformation: 'PR_FA_PROMOTERS_INFO_KXFQ',
    //注册量统计表
    registrationStatisticsReport: 'PR_DS_LOAN_DAY_KXFQ',
    //推广统计-地区
    promotionStatisticsArea: 'PR_PM_PROMOTION_STATISTIC_REGION_KXFQ',
    //推广统计-渠道
    promotionStatisticalChannel: 'PR_PM_PROMOTION_STATISTIC_CHANNEL_KXFQ'
  },
  /*闪电卡*/
  flashCard: {
    dailyPromotionEffect: 'PR_SDK_CHANNEL_PROMOTION_D',
    weeklyPromotionEffect: 'PR_SDK_CHANNEL_PROMOTION_W',
    monthlyPromotionEffect: 'PR_SDK_CHANNEL_PROMOTION_M',
    dailyPromotionEffectSummary: 'PR_SDK_CHANNEL_PROMOTION_D',
    weeklyPromotionEffectSummary: 'PR_SDK_CHANNEL_PROMOTION_W',
    monthlyPromotionEffectSummary: 'PR_SDK_CHANNEL_PROMOTION_M'
  }
}
