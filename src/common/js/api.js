import fetch from './fetch'

//首页
export function getMain () {
  return fetch({
    url: '/api/main',
    method: 'post'
  })
}
//更新颜色
export function updateColors (data) {
  return fetch({
    url: '/api/updateColors',
    method: 'post',
    data: data
  })
}
//更新颜色
export function getColors (data) {
  return fetch({
    url: '/api/getColors',
    method: 'post',
    data: data
  })
}

//RMAB
//新用户借款通过率
//topN
export function getLoanThroughRate () {
  return fetch({
    url: '/api/loanThroughRate',
    method: 'post'
  })
}

//全部
export function getLoanThroughRateAll () {
  return fetch({
    url: '/api/loanThroughRateAll',
    method: 'post'
  })
}

//通过率
//通过率概览
export function getRatio () {
  return fetch({
    url: '/api/dailyPassRateTrends/getRatio',
    method: 'post'
  })
}

//通过率日趋势
export function getDailyPassRateTrends () {
  return fetch({
    url: '/api/dailyPassRateTrends/daily',
    method: 'post'
  })
}

//通过率周趋势
export function getWeeklyPassRateTrends () {
  return fetch({
    url: '/api/dailyPassRateTrends/weekly',
    method: 'post'
  })
}

//通过率月趋势
export function getMonthlyPassRateTrends () {
  return fetch({
    url: '/api/dailyPassRateTrends/monthly',
    method: 'post'
  })
}

//通过率趋势比较
export function getPassRateCompare (data) {
  return fetch({
    url: '/api/dailyPassRateTrends/compare',
    method: 'post',
    data: data
  })
}

//通过率24小时变化趋势
export function getHoursPassRateTrends () {
  return fetch({
    url: '/api/dailyPassRateTrends/hourly',
    method: 'post'
  })
}

//渠道分析
//通过率/逾期率日趋势
export function getDailyPassRateAndOverdueTrends (data) {
  return fetch({
    url: '/api/dailyPassRateAndOverdueTrends/daily',
    method: 'post',
    data: data
  })
}

//通过率/逾期率月趋势
export function getWeeklyPassRateAndOverdueTrends (data) {
  return fetch({
    url: '/api/weeklyPassRateAndOverdueTrends/weekly',
    method: 'post',
    data: data
  })
}

//select框
export function getTab2SelectOptions () {
  return fetch({
    url: '/api/tab2ChannelInfo/getSelectOptions',
    method: 'post'
  })
}

//渠道基本信息
//内容
export function getTab2TableInfo (data) {
  return fetch({
    url: '/api/tab2ChannelInfo',
    method: 'post',
    data: data
  })
}

//长度
export function getTab2TableCount (data) {
  return fetch({
    url: '/api/tab2ChannelInfo/count',
    method: 'post',
    data: data
  })
}

//被拒原因
//被拒原因TOP20
export function getRejectedReasons20 (data) {
  return fetch({
    url: '/api/rejectedReasons20',
    method: 'post',
    data: data
  })
}

//被拒单数日趋势
export function getDailyRejectedNumTrends (data) {
  return fetch({
    url: '/api/dailyRejectedNumTrends',
    method: 'post',
    data: data
  })
}

//各渠道最主要被拒原因
export function getChannelRejectedReason (data) {
  return fetch({
    url: '/api/channelRejectedReason',
    method: 'post',
    data: data
  })
}

//select框
export function getTab3SelectOptions () {
  return fetch({
    url: '/api/tab3/getSelectOptions',
    method: 'post'
  })
}

export function getTab3DailyOptions () {
  return fetch({
    url: '/api/tab3/getDailyOptions',
    method: 'post'
  })
}

//运营
//邀请活动
export function getInvitationEvent () {
  return fetch({
    url: '/api/invitationEvent',
    method: 'post'
  })
}

//风控
//风控因素分析
export function getRiskControlFactorAnalysis (data) {
  return fetch({
    url: '/api/riskControlFactorAnalysis',
    method: 'post',
    data: data
  })
}

/*//周
export function getRiskControlFactorAnalysisWeekly (data) {
  return fetch({
    url: '/api/riskControlFactorAnalysis',
    method: 'post',
    data: data
  })
}

//月
export function getRiskControlFactorAnalysisMonthly (data) {
  return fetch({
    url: '/api/riskControlFactorAnalysis',
    method: 'post',
    data: data
  })
}*/

//催收
//借款逾期催回率
export function getLoanOverdueRecallRate (data) {
  return fetch({
    url: '/api/loanOverdueRecallRate',
    method: 'post',
    data: data
  })
}

//用户画像
//基础用户画像
export function getUserBasePortrait (data) {
  return fetch({
    url: '/api/userBasePortrait',
    method: 'post',
    data: data
  })
}

//数量
export function getUserBasePortraitCount () {
  return fetch({
    url: '/api/userBasePortrait/count',
    method: 'post'
  })
}

//运营用户画像
export function getOperationUserPortrait (data) {
  return fetch({
    url: '/api/operationUserPortrait',
    method: 'post',
    data: data
  })
}

//数量
export function getOperationUserPortraitCount () {
  return fetch({
    url: '/api/operationUserPortrait/count',
    method: 'post'
  })
}

//企鹅抓娃娃
//数据概述
export function getDataOverviewRoom (data) {
  return fetch({
    url: '/api/dataOverviewRoom',
    method: 'post',
    data: data
  })
}
//数据概述数量
export function getDataOverviewRoomCount (data) {
  return fetch({
    url: '/api/dataOverviewRoom/count',
    method: 'post',
    data: data
  })
}
//数据概述
export function getDataOverviewDay (data) {
  return fetch({
    url: '/api/dataOverviewDay',
    method: 'post',
    data: data
  })
}
//数据概述一键刷新
export function getDataOverviewRefresh (data) {
  return fetch({
    url: '/api/dataOverview/refresh',
    method: 'post',
    data: data
  })
}
//数据概述
export function getDataOverviewAllRoom (data) {
  return fetch({
    url: '/api/dataOverviewAllRoom',
    method: 'post',
    data: data
  })
}
//数据概述数量
export function getDataOverviewAllRoomCount (data) {
  return fetch({
    url: '/api/dataOverviewAllRoom/count',
    method: 'post',
    data: data
  })
}
//数据概述
export function getDataOverviewAllDay (data) {
  return fetch({
    url: '/api/dataOverviewAllDay',
    method: 'post',
    data: data
  })
}
//数据概述一键刷新
export function getDataOverviewAllRefresh (data) {
  return fetch({
    url: '/api/dataOverviewAll/refresh',
    method: 'post',
    data: data
  })
}
//企鹅推广统计（渠道）
export function getPromotionChannelStatisticsQE (data) {
  return fetch({
    url: '/api/promotionChannelStatisticsQE',
    method: 'post',
    data: data
  })
}

//企鹅推广统计（渠道）数量
export function getPromotionChannelStatisticsQECount (data) {
  return fetch({
    url: '/api/promotionChannelStatisticsQE/count',
    method: 'post',
    data: data
  })
}
//企鹅推广统计（渠道）一键刷新
export function getPromotionChannelStatisticsQERefresh (data) {
  return fetch({
    url: '/api/promotionChannelStatisticsQE/refresh',
    method: 'post',
    data: data
  })
}
//企鹅推广统计（渠道）和
export function getPromotionChannelStatisticsQESUM (data) {
  return fetch({
    url: '/api/promotionChannelStatisticsQE/sum',
    method: 'post',
    data: data
  })
}
//企鹅推广统计（渠道）更新数据
export function updataQEData (data) {
  return fetch({
    url: '/api/promotionChannelStatisticsQE/update',
    method: 'post',
    data: data
  })
}
//企鹅推广统计（渠道）渠道名称
export function getPromotionChannelStatisticsQESelect (data) {
  return fetch({
    url: '/api/promotionChannelStatisticsQE/getSelectOptions',
    method: 'post',
    data: data
  })
}
//企鹅推广统计（OPPO）
export function getPromotionOPPOStatisticsQE (data) {
  return fetch({
    url: '/api/promotionOPPOStatisticsQE',
    method: 'post',
    data: data
  })
}

//企鹅推广统计（OPPO）数量
export function getPromotionOPPOStatisticsQECount (data) {
  return fetch({
    url: '/api/promotionOPPOStatisticsQE/count',
    method: 'post',
    data: data
  })
}
//企鹅推广统计（OPPO）一键刷新
export function getPromotionOPPOStatisticsQERefresh (data) {
  return fetch({
    url: '/api/promotionOPPOStatisticsQE/refresh',
    method: 'post',
    data: data
  })
}
//企鹅推广统计（OPPO）和
export function getPromotionOPPOStatisticsQESUM (data) {
  return fetch({
    url: '/api/promotionOPPOStatisticsQE/sum',
    method: 'post',
    data: data
  })
}
//企鹅推广统计（OPPO）更新数据
export function updataOPPOQEData (data) {
  return fetch({
    url: '/api/promotionOPPOStatisticsQE/update',
    method: 'post',
    data: data
  })
}
//企鹅推广统计（OPPO）渠道名称
export function getPromotionOPPOStatisticsQESelect (data) {
  return fetch({
    url: '/api/promotionOPPOStatisticsQE/getSelectOptions',
    method: 'post',
    data: data
  })
}
//企鹅在线人数统计 图
export function getOnlineStatisticsHourly (data) {
  return fetch({
    url: '/api/onlineStatisticsHourly',
    method: 'post',
    data: data
  })
}
//用户充值间隔分析'数据
export function getUserRechargeIntervalAnalysisQE (data) {
  return fetch({
    url: '/api/userRechargeIntervalAnalysisQE',
    method: 'post',
    data: data
  })
}
//用户充值间隔分析'数量
export function getUserRechargeIntervalAnalysisQECount (data) {
  return fetch({
    url: '/api/userRechargeIntervalAnalysisQE/count',
    method: 'post',
    data: data
  })
}
//用户充值间隔分析周'数据
export function getUserRechargeIntervalAnalysisWeeklyQE (data) {
  return fetch({
    url: '/api/userRechargeIntervalAnalysisWeeklyQE',
    method: 'post',
    data: data
  })
}
//用户充值间隔分析周'数量
export function getUserRechargeIntervalAnalysisWeeklyQECount (data) {
  return fetch({
    url: '/api/userRechargeIntervalAnalysisWeeklyQE/count',
    method: 'post',
    data: data
  })
}
//用户充值时段分析'数量
export function getUserRechargeTimeAnalysisHourly (data) {
  return fetch({
    url: '/api/userRechargeTimeAnalysisQE',
    method: 'post',
    data: data
  })
}
//充值按钮点击量'数据
export function getTorechargePVUV (data) {
  return fetch({
    url: '/api/torechargePVUV',
    method: 'post',
    data: data
  })
}
//充值按钮点击量'数量
export function getTorechargePVUVCount (data) {
  return fetch({
    url: '/api/torechargePVUV/count',
    method: 'post',
    data: data
  })
}
//充值按钮点击量'求和
export function getTorechargePVUVSUM (data) {
  return fetch({
    url: '/api/torechargePVUV/sum',
    method: 'post',
    data: data
  })
}
//各房间点击量'数据
export function getRoomPVUV (data) {
  return fetch({
    url: '/api/roomPVUV',
    method: 'post',
    data: data
  })
}
//各房间点击量'数量
export function getRoomPVUVCount (data) {
  return fetch({
    url: '/api/roomPVUV/count',
    method: 'post',
    data: data
  })
}
//各房间点击量'数据
export function getRoomPVUVSUM (data) {
  return fetch({
    url: '/api/roomPVUV/sum',
    method: 'post',
    data: data
  })
}
//任意门点击量'数据
export function getArbitraryGatePVUV (data) {
  return fetch({
    url: '/api/arbitraryGatePVUV',
    method: 'post',
    data: data
  })
}
//任意门点击量'数量
export function getArbitraryGatePVUVCount (data) {
  return fetch({
    url: '/api/arbitraryGatePVUV/count',
    method: 'post',
    data: data
  })
}
//各房间点击量'数据
export function getArbitraryGatePVUVSUM (data) {
  return fetch({
    url: '/api/arbitraryGatePVUV/sum',
    method: 'post',
    data: data
  })
}
//banner点击量'数据
export function getBannerPVUV (data) {
  return fetch({
    url: '/api/bannerPVUV',
    method: 'post',
    data: data
  })
}
//banner点击量'数量
export function getBannerPVUVCount (data) {
  return fetch({
    url: '/api/bannerPVUV/count',
    method: 'post',
    data: data
  })
}
//banner点击量'求和
export function getBannerPVUVSUM (data) {
  return fetch({
    url: '/api/bannerPVUV/sum',
    method: 'post',
    data: data
  })
}
//兑换点击量'数据
export function getExchangePVUV (data) {
  return fetch({
    url: '/api/exchangePVUV',
    method: 'post',
    data: data
  })
}
//兑换点击量'数量
export function getExchangePVUVCount (data) {
  return fetch({
    url: '/api/exchangePVUV/count',
    method: 'post',
    data: data
  })
}
//兑换点击量'求和
export function getExchangePVUVSUM (data) {
  return fetch({
    url: '/api/exchangePVUV/sum',
    method: 'post',
    data: data
  })
}
//一级游戏房'数据
export function getLevel1Room (data) {
  return fetch({
    url: '/api/level1Room',
    method: 'post',
    data: data
  })
}
//一级游戏房'数量
export function getLevel1RoomCount (data) {
  return fetch({
    url: '/api/level1Room/count',
    method: 'post',
    data: data
  })
}
//一级游戏房'求和
export function getLevel1RoomSUM (data) {
  return fetch({
    url: '/api/level1Room/sum',
    method: 'post',
    data: data
  })
}
//充值活动'数据
export function getRechargeActivities (data) {
  return fetch({
    url: '/api/rechargeActivities',
    method: 'post',
    data: data
  })
}
//充值活动'数量
export function getRechargeActivitiesCount (data) {
  return fetch({
    url: '/api/rechargeActivities/count',
    method: 'post',
    data: data
  })
}
//运营弹窗'数据
export function getOperatingWindow (data) {
  return fetch({
    url: '/api/operatingWindow',
    method: 'post',
    data: data
  })
}
//运营弹窗'数量
export function getOperatingWindowCount (data) {
  return fetch({
    url: '/api/operatingWindow/count',
    method: 'post',
    data: data
  })
}
//宝箱'数据
export function getTreasureBox (data) {
  return fetch({
    url: '/api/treasureBox',
    method: 'post',
    data: data
  })
}
//宝箱'数量
export function getTreasureBoxCount (data) {
  return fetch({
    url: '/api/treasureBox/count',
    method: 'post',
    data: data
  })
}

//竞拍
//市场-看板1
export function getUserAreaRatio (data) {
  return fetch({
    url: '/api/marketView/userAreaRatio',
    method: 'post',
    data: data
  })
}
//市场-看板1
export function getUserAreaRecharge (data) {
  return fetch({
    url: '/api/marketView/userAreaRecharge',
    method: 'post',
    data: data
  })
}
//市场-看板1
export function getMarketView (data) {
  return fetch({
    url: '/api/marketView',
    method: 'post',
    data: data
  })
}
//渠道信息表'数据
export function getNewChannelView (data) {
  return fetch({
    url: '/api/newChannelView',
    method: 'post',
    data: data
  })
}
//渠道信息表'数量
export function getNewChannelViewCount (data) {
  return fetch({
    url: '/api/newChannelView/count',
    method: 'post',
    data: data
  })
}
//渠道信息表一键刷新
export function getNewChannelViewRefresh (data) {
  return fetch({
    url: '/api/newChannelView/refresh',
    method: 'post',
    data: data
  })
}

//渠道推广效果统计'数据
export function getPromotionEffectStatistics (data) {
  return fetch({
    url: '/api/promotionEffectStatistics',
    method: 'post',
    data: data
  })
}
//渠道推广效果统计'数量
export function getPromotionEffectStatisticsCount (data) {
  return fetch({
    url: '/api/promotionEffectStatistics/count',
    method: 'post',
    data: data
  })
}
//渠道推广效果统计一键刷新
export function getPromotionEffectStatisticsRefresh (data) {
  return fetch({
    url: '/api/promotionEffectStatistics/refresh',
    method: 'post',
    data: data
  })
}
//渠道推广效果统计一键刷新
export function getPromotionEffectStatisticsModify (data) {
  return fetch({
    url: '/api/promotionEffectStatistics/modify',
    method: 'post',
    data: data
  })
}

//渠道每日推广效果统计'数据
export function getDailyPromotionEffectStatistics (data) {
  return fetch({
    url: '/api/dailyPromotionEffectStatistics',
    method: 'post',
    data: data
  })
}
//渠道每日推广效果统计'数量
export function getDailyPromotionEffectStatisticsCount (data) {
  return fetch({
    url: '/api/dailyPromotionEffectStatistics/count',
    method: 'post',
    data: data
  })
}
//渠道每日推广效果统计一键刷新
export function getDailyPromotionEffectStatisticsRefresh (data) {
  return fetch({
    url: '/api/dailyPromotionEffectStatistics/refresh',
    method: 'post',
    data: data
  })
}

//渠道每周统计 '数据
export function getPromotionChannelStatisticsWeekly (data) {
  return fetch({
    url: '/api/promotionChannelStatisticsWeekly',
    method: 'post',
    data: data
  })
}
//渠道每周统计 '数量
export function getPromotionChannelStatisticsWeeklyCount (data) {
  return fetch({
    url: '/api/promotionChannelStatisticsWeekly/count',
    method: 'post',
    data: data
  })
}
//渠道每周统计 '刷新
export function getPromotionChannelStatisticsWeeklyRefresh (data) {
  return fetch({
    url: '/api/promotionChannelStatisticsWeekly/refresh',
    method: 'post',
    data: data
  })
}
//渠道日环比数据  '数据
export function getChannelDODData (data) {
  return fetch({
    url: '/api/channelDODData',
    method: 'post',
    data: data
  })
}
//渠道日环比数据  '数量
export function getChannelDODDataCount (data) {
  return fetch({
    url: '/api/channelDODData/count',
    method: 'post',
    data: data
  })
}
//渠道周环比数据  '数据
export function getChannelWOWData (data) {
  return fetch({
    url: '/api/channelWOWData',
    method: 'post',
    data: data
  })
}
//渠道周环比数据  '数量
export function getChannelWOWDataCount (data) {
  return fetch({
    url: '/api/channelWOWData/count',
    method: 'post',
    data: data
  })
}
//渠道月环比数据  '数据
export function getChannelMOMData (data) {
  return fetch({
    url: '/api/channelMOMData',
    method: 'post',
    data: data
  })
}
//渠道月环比数据  '数量
export function getChannelMOMDataCount (data) {
  return fetch({
    url: '/api/channelMOMData/count',
    method: 'post',
    data: data
  })
}
//渠道季环比数据  '数据
export function getChannelQOQData (data) {
  return fetch({
    url: '/api/channelQOQData',
    method: 'post',
    data: data
  })
}
//渠道季环比数据  '数量
export function getChannelQOQDataCount (data) {
  return fetch({
    url: '/api/channelQOQData/count',
    method: 'post',
    data: data
  })
}
//渠道年环比数据  '数据
export function getChannelYOYData (data) {
  return fetch({
    url: '/api/channelYOYData',
    method: 'post',
    data: data
  })
}
//渠道年环比数据  '数量
export function getChannelYOYDataCount (data) {
  return fetch({
    url: '/api/channelYOYData/count',
    method: 'post',
    data: data
  })
}
//渠道用户活跃情况  '数据
export function getChannelUserActivity (data) {
  return fetch({
    url: '/api/channelUserActivity',
    method: 'post',
    data: data
  })
}
//渠道用户活跃情况  '数量
export function getChannelUserActivityCount (data) {
  return fetch({
    url: '/api/channelUserActivity/count',
    method: 'post',
    data: data
  })
}

//运营-订单表'数据
export function getOrderInfo (data) {
  return fetch({
    url: '/api/orderInfo',
    method: 'post',
    data: data
  })
}
//运营-订单表'数量
export function getOrderInfoCount (data) {
  return fetch({
    url: '/api/orderInfo/count',
    method: 'post',
    data: data
  })
}
//运营-用户表'数据
export function getUserInfo (data) {
  return fetch({
    url: '/api/userInfo',
    method: 'post',
    data: data
  })
}
//运营-用户表'数量
export function getUserInfoCount (data) {
  return fetch({
    url: '/api/userInfo/count',
    method: 'post',
    data: data
  })
}
//运营-流量统计表'数据
export function getPagePVUV (data) {
  return fetch({
    url: '/api/pagePVUV',
    method: 'post',
    data: data
  })
}
//运营-流量统计表'数量
export function getPagePVUVCount (data) {
  return fetch({
    url: '/api/pagePVUV/count',
    method: 'post',
    data: data
  })
}
//运营-竞拍记录表'数据
export function getAuctionRecord (data) {
  return fetch({
    url: '/api/auctionRecord',
    method: 'post',
    data: data
  })
}
//运营-竞拍记录表'数量
export function getAuctionRecordCount (data) {
  return fetch({
    url: '/api/auctionRecord/count',
    method: 'post',
    data: data
  })
}
//运营-积分记录表'数据
export function getIntegralRecord (data) {
  return fetch({
    url: '/api/integralRecord',
    method: 'post',
    data: data
  })
}
//运营-积分记录表'数量
export function getIntegralRecordCount (data) {
  return fetch({
    url: '/api/integralRecord/count',
    method: 'post',
    data: data
  })
}
//运营-充值记录表'数据
export function getRechargeRecord (data) {
  return fetch({
    url: '/api/rechargeRecord',
    method: 'post',
    data: data
  })
}
//运营-充值记录表'数量
export function getRechargeRecordCount (data) {
  return fetch({
    url: '/api/rechargeRecord/count',
    method: 'post',
    data: data
  })
}
//运营-流量路径统计表'数据
export function getTrafficStatistics (data) {
  return fetch({
    url: '/api/trafficStatistics',
    method: 'post',
    data: data
  })
}
//运营-流量路径统计表'数量
export function getTrafficStatisticsCount (data) {
  return fetch({
    url: '/api/trafficStatistics/count',
    method: 'post',
    data: data
  })
}
//运营-元素点击表'数据
export function getElementPVUV (data) {
  return fetch({
    url: '/api/elementPVUV',
    method: 'post',
    data: data
  })
}
//运营-元素点击表'数量
export function getElementPVUVCount (data) {
  return fetch({
    url: '/api/elementPVUV/count',
    method: 'post',
    data: data
  })
}
//运营-用户浏览行为表'数据
export function getUserBrowsingBehavior (data) {
  return fetch({
    url: '/api/userBrowsingBehavior',
    method: 'post',
    data: data
  })
}
//运营-用户浏览行为表'数量
export function getUserBrowsingBehaviorCount (data) {
  return fetch({
    url: '/api/userBrowsingBehavior/count',
    method: 'post',
    data: data
  })
}
//运营-看板'日新增用户趋势
export function getDailyNewUser (data) {
  return fetch({
    url: '/api/operateView/dailyNewUser',
    method: 'post',
    data: data
  })
}
//运营-看板'收入明细
export function getIncomeDetail (data) {
  return fetch({
    url: '/api/operateView/incomeDetail',
    method: 'post',
    data: data
  })
}
//运营-看板'活跃用户走势
export function getActiveUser (data) {
  return fetch({
    url: '/api/operateView/activeUser',
    method: 'post',
    data: data
  })
}
//运营-看板'拍币充值/消耗时段变化情况
export function getCoin1CancellationDeposit (data) {
  return fetch({
    url: '/api/operateView/coin1CancellationDeposit',
    method: 'post',
    data: data
  })
}
//运营-看板'上方值
export function getOperateView (data) {
  return fetch({
    url: '/api/operateView',
    method: 'post',
    data: data
  })
}
//运营-概览'活跃用户趋势
export function getActiveUserTrends (data) {
  return fetch({
    url: '/api/operatingSituation/activeUserTrends',
    method: 'post',
    data: data
  })
}
//平台概览-概览'上方
export function getOperatingSituation (data) {
  return fetch({
    url: '/api/operatingSituation',
    method: 'post',
    data: data
  })
}
//平台概览-概览'新注册用户趋势
export function getNewRegisteredUser (data) {
  return fetch({
    url: '/api/operatingSituation/newRegisteredUser',
    method: 'post',
    data: data
  })
}
//平台概览-概览'新注册用户趋势
export function getRechargeConsumption (data) {
  return fetch({
    url: '/api/operatingSituation/rechargeConsumption',
    method: 'post',
    data: data
  })
}
//平台概览-概览'新注册用户趋势
export function getConversionFunnel (data) {
  return fetch({
    url: '/api/operatingSituation/conversionFunnel',
    method: 'post',
    data: data
  })
}
//实验室
//任意门
export function getAllTables () {
  return fetch({
    url: '/api/allTables',
    method: 'post'
  })
}
//选择表然后搜索内容
export function getOne (data) {
  return fetch({
    url: '/api/selectOne',
    method: 'post',
    data: data
  })
}
//选择表然后搜索数量
export function getOneNum (data) {
  return fetch({
    url: '/api/selectOneNum',
    method: 'post',
    data: data
  })
}
//用户信息管理
//用户列表
export function getUserList (data) {
  return fetch({
    url: '/api/userList',
    method: 'post',
    data: data
  })
}

//用户列表数量
export function getUserListCount (data) {
  return fetch({
    url: '/api/userList/count',
    method: 'post',
    data: data
  })
}

//用户通讯录
export function getUserAddressBook (data) {
  return fetch({
    url: '/api/userAddressBook',
    method: 'post',
    data: data
  })
}

//用户通讯录数量
export function getUserAddressBookCount (data) {
  return fetch({
    url: '/api/userAddressBook/count',
    method: 'post',
    data: data
  })
}

//银行卡列表
export function getBankCardsList (data) {
  return fetch({
    url: '/api/bankCardsList',
    method: 'post',
    data: data
  })
}

//银行卡列表数量
export function getBankCardsListCount (data) {
  return fetch({
    url: '/api/bankCardsList/count',
    method: 'post',
    data: data
  })
}

//用户认证列表
export function getUserAuthenticationList (data) {
  return fetch({
    url: '/api/userAuthenticationList',
    method: 'post',
    data: data
  })
}

//用户认证列表数量
export function getUserAuthenticationListCount (data) {
  return fetch({
    url: '/api/userAuthenticationList/count',
    method: 'post',
    data: data
  })
}

//用户实名认证列表
export function getUserNameAuthenticationList (data) {
  return fetch({
    url: '/api/userNameAuthenticationList',
    method: 'post',
    data: data
  })
}

//用户实名认证列表数量
export function getUserNameAuthenticationListCount (data) {
  return fetch({
    url: '/api/userNameAuthenticationList/count',
    method: 'post',
    data: data
  })
}
//优惠券信息
export function getDiscountCoupon (data) {
  return fetch({
    url: '/api/discountCoupon',
    method: 'post',
    data: data
  })
}

//优惠券信息列表数量
export function getDiscountCoupontCount (data) {
  return fetch({
    url: '/api/discountCoupon/count',
    method: 'post',
    data: data
  })
}

//新用户标签列表
export function getNewUserTagList (data) {
  return fetch({
    url: '/api/newUserTagList',
    method: 'post',
    data: data
  })
}

//新用户标签列表数量
export function getNewUserTagListCount (data) {
  return fetch({
    url: '/api/newUserTagList/count',
    method: 'post',
    data: data
  })
}

//老用户标签列表
export function getOldUserTagList (data) {
  return fetch({
    url: '/api/oldUserTagList',
    method: 'post',
    data: data
  })
}

//老用户标签列表数量
export function getOldUserTagListCount (data) {
  return fetch({
    url: '/api/oldUserTagList/count',
    method: 'post',
    data: data
  })
}

//借款管理
//借款申请列表
export function getLoanApplicationsList (data) {
  return fetch({
    url: '/api/loanApplicationsList',
    method: 'post',
    data: data
  })
}

//借款申请列表数量
export function getLoanApplicationsListCount (data) {
  return fetch({
    url: '/api/loanApplicationsList/count',
    method: 'post',
    data: data
  })
}

//放款审核列表
export function getLoanAuditList (data) {
  return fetch({
    url: '/api/loanAuditList',
    method: 'post',
    data: data
  })
}

//放款审核列表数量
export function getLoanAuditListCount (data) {
  return fetch({
    url: '/api/loanAuditList/count',
    method: 'post',
    data: data
  })
}

//提额记录表
export function getRaiseQuotaRecord (data) {
  return fetch({
    url: '/api/raiseQuotaRecord',
    method: 'post',
    data: data
  })
}

//提额记录表数量
export function getRaiseQuotaRecordCount (data) {
  return fetch({
    url: '/api/raiseQuotaRecord/count',
    method: 'post',
    data: data
  })
}

//对账功能
export function getReconciliationFunction (data) {
  return fetch({
    url: '/api/reconciliationFunction',
    method: 'post',
    data: data
  })
}

//对账功能数量
export function getReconciliationFunctionCount (data) {
  return fetch({
    url: '/api/reconciliationFunction/count',
    method: 'post',
    data: data
  })
}

//资产信息-招财猫
export function getAssetInformation (data) {
  return fetch({
    url: '/api/assetInformation',
    method: 'post',
    data: data
  })
}

//资产信息-招财猫数量
export function getAssetInformationCount (data) {
  return fetch({
    url: '/api/assetInformation/count',
    method: 'post',
    data: data
  })
}

//还款管理
//还款列表
//待还列表
export function getWaitingForReturnList (data) {
  return fetch({
    url: '/api/waitingForReturnList',
    method: 'post',
    data: data
  })
}

//待还列表数量
export function getWaitingForReturnListCount (data) {
  return fetch({
    url: '/api/waitingForReturnList/count',
    method: 'post',
    data: data
  })
}

//已还列表
export function getReturnedList (data) {
  return fetch({
    url: '/api/returnedList',
    method: 'post',
    data: data
  })
}

//已还列表数量
export function getReturnedListCount (data) {
  return fetch({
    url: '/api/returnedList/count',
    method: 'post',
    data: data
  })
}

//对账列表
//还款对账
export function getRepaymentReconciliation (data) {
  return fetch({
    url: '/api/repaymentReconciliation',
    method: 'post',
    data: data
  })
}

//还款对账数量
export function getRepaymentReconciliationCount (data) {
  return fetch({
    url: '/api/repaymentReconciliation/count',
    method: 'post',
    data: data
  })
}

//续期对账
export function getRenewalReconciliation (data) {
  return fetch({
    url: '/api/renewalReconciliation',
    method: 'post',
    data: data
  })
}

//续期对账数量
export function getRenewalReconciliationCount (data) {
  return fetch({
    url: '/api/renewalReconciliation/count',
    method: 'post',
    data: data
  })
}

//退款列表
//还款详情
export function getRepaymentDetails (data) {
  return fetch({
    url: '/api/repaymentDetails',
    method: 'post',
    data: data
  })
}
//还款详情数量
export function getRepaymentDetailsCount (data) {
  return fetch({
    url: '/api/repaymentDetails/count',
    method: 'post',
    data: data
  })
}
//续期详情
export function getRenewalParticulars (data) {
  return fetch({
    url: '/api/renewalParticulars',
    method: 'post',
    data: data
  })
}
//续期详情数量
export function getRenewalParticularsCount (data) {
  return fetch({
    url: '/api/renewalParticulars/count',
    method: 'post',
    data: data
  })
}
//已退列表
export function getRebackedList (data) {
  return fetch({
    url: '/api/rebackedList',
    method: 'post',
    data: data
  })
}
//已退列表数量
export function getRebackedListCount (data) {
  return fetch({
    url: '/api/rebackedList/count',
    method: 'post',
    data: data
  })
}
//续期管理
//续期列表
export function getRenewalsList (data) {
  return fetch({
    url: '/api/renewalsList',
    method: 'post',
    data: data
  })
}
//续期列表数量
export function getRenewalsListCount (data) {
  return fetch({
    url: '/api/renewalsList/count',
    method: 'post',
    data: data
  })
}
//数据分析
//财务数据
//每日放款数据
export function getDailyLendingData (data) {
  return fetch({
    url: '/api/dailyLendingData',
    method: 'post',
    data: data
  })
}
//每日放款数据数量
export function getDailyLendingDataCount (data) {
  return fetch({
    url: '/api/dailyLendingData/count',
    method: 'post',
    data: data
  })
}
//每日放款数据一键刷新
export function getDailyLendingDataRefresh (data) {
  return fetch({
    url: '/api/dailyLendingData/refresh',
    method: 'post',
    data: data
  })
}
//每日放款数据导出excel
// export function getDailyLendingDataExcel (data) {
//   return fetch({
//     url: 'api/dailyLendingData/excel',
//     params: data
//   })
// }
//每日还款单位数据
export function getDailyRepaymentUnitData (data) {
  return fetch({
    url: '/api/dailyRepaymentUnitData',
    method: 'post',
    data: data
  })
}
//每日还款单位数据数量
export function getDailyRepaymentUnitDataCount (data) {
  return fetch({
    url: '/api/dailyRepaymentUnitData/count',
    method: 'post',
    data: data
  })
}
//每日还款单位数据一键刷新
export function getDailyRepaymentUnitDataRefresh (data) {
  return fetch({
    url: '/api/dailyRepaymentUnitData/refresh',
    method: 'post',
    data: data
  })
}
//21天分期统计数据
export function getDaysStageStatistics (data) {
  return fetch({
    url: '/api/daysStageStatistics21',
    method: 'post',
    data: data
  })
}
//21天分期统计数量
export function getDaysStageStatisticsCount (data) {
  return fetch({
    url: '/api/daysStageStatistics21/count',
    method: 'post',
    data: data
  })
}
//21天分期统计一键刷新
export function getDaysStageStatisticsRefresh (data) {
  return fetch({
    url: '/api/daysStageStatistics21/refresh',
    method: 'post',
    data: data
  })
}
//21天分期提额统计数据
export function getInstallmentPromotionStatistics (data) {
  return fetch({
    url: '/api/installmentPromotionStatistics21',
    method: 'post',
    data: data
  })
}
//21天分期提额统计数据数量
export function getInstallmentPromotionStatisticsCount (data) {
  return fetch({
    url: '/api/installmentPromotionStatistics21/count',
    method: 'post',
    data: data
  })
}
//21天分期提额统计数据一键刷新
export function getInstallmentPromotionStatisticsRefresh (data) {
  return fetch({
    url: '/api/installmentPromotionStatistics21/refresh',
    method: 'post',
    data: data
  })
}
//90天分期统计
export function getDaysStageStatistics90 (data) {
  return fetch({
    url: '/api/daysStageStatistics90',
    method: 'post',
    data: data
  })
}
//90天分期统计数量
export function getDaysStageStatistics90Count (data) {
  return fetch({
    url: '/api/daysStageStatistics90/count',
    method: 'post',
    data: data
  })
}
//90天分期统计一键刷新
export function getDaysStageStatistics90Refresh (data) {
  return fetch({
    url: '/api/daysStageStatistics90/refresh',
    method: 'post',
    data: data
  })
}
//每日还款金额数据
export function getDailyRepaymentAmountData (data) {
  return fetch({
    url: '/api/dailyRepaymentAmountData',
    method: 'post',
    data: data
  })
}
//每日还款金额数据数量
export function getDailyRepaymentAmountDataCount (data) {
  return fetch({
    url: '/api/dailyRepaymentAmountData/count',
    method: 'post',
    data: data
  })
}
//每日还款金额数据一键刷新
export function getDailyRepaymentAmountDataRefresh (data) {
  return fetch({
    url: '/api/dailyRepaymentAmountData/refresh',
    method: 'post',
    data: data
  })
}
//还款逾期统计
export function getOverdueRepaymentStatistics (data) {
  return fetch({
    url: '/api/overdueRepaymentStatistics',
    method: 'post',
    data: data
  })
}
//还款逾期统计数量
export function getOverdueRepaymentStatisticsCount (data) {
  return fetch({
    url: '/api/overdueRepaymentStatistics/count',
    method: 'post',
    data: data
  })
}
//还款逾期统计一键刷新
export function getOverdueRepaymentStatisticsRefresh (data) {
  return fetch({
    url: '/api/overdueRepaymentStatistics/refresh',
    method: 'post',
    data: data
  })
}
//资金分析
export function getFundAnalysis (data) {
  return fetch({
    url: '/api/fundAnalysis',
    method: 'post',
    data: data
  })
}
//资金分析数量
export function getFundAnalysisCount (data) {
  return fetch({
    url: '/api/fundAnalysis/count',
    method: 'post',
    data: data
  })
}
//资金分析一键刷新
export function getFundAnalysisRefresh (data) {
  return fetch({
    url: '/api/fundAnalysis/refresh',
    method: 'post',
    data: data
  })
}
//资金分析(分产品)
export function getFundAnalysisProduct (data) {
  return fetch({
    url: '/api/fundAnalysisProduct',
    method: 'post',
    data: data
  })
}
//资金分析(分产品)数量
export function getFundAnalysisProductCount (data) {
  return fetch({
    url: '/api/fundAnalysisProduct/count',
    method: 'post',
    data: data
  })
}
//资金分析(分产品)一键刷新
export function getFundAnalysisProductRefresh (data) {
  return fetch({
    url: '/api/fundAnalysisProduct/refresh',
    method: 'post',
    data: data
  })
}
//催收管理
export function getCollectionManagement (data) {
  return fetch({
    url: '/api/collectionManagement',
    method: 'post',
    data: data
  })
}
//催收管理数量
export function getCollectionManagementCount (data) {
  return fetch({
    url: '/api/collectionManagement/count',
    method: 'post',
    data: data
  })
}
//催收管理一键刷新
export function getCollectionManagementRefresh (data) {
  return fetch({
    url: '/api/collectionManagement/refresh',
    method: 'post',
    data: data
  })
}
//在催金额
export function getPromptAmount (data) {
  return fetch({
    url: '/api/promptAmount',
    method: 'post',
    data: data
  })
}
//在催金额数量
export function getPromptAmountCount (data) {
  return fetch({
    url: '/api/promptAmount/count',
    method: 'post',
    data: data
  })
}
//在催金额一键刷新
export function getPromptAmountRefresh (data) {
  return fetch({
    url: '/api/promptAmount/refresh',
    method: 'post',
    data: data
  })
}
//提前还款统计
export function getPrepaymentStatistics (data) {
  return fetch({
    url: '/api/prepaymentStatistics',
    method: 'post',
    data: data
  })
}
//在催金额数量
export function getPrepaymentStatisticsCount (data) {
  return fetch({
    url: '/api/prepaymentStatistics/count',
    method: 'post',
    data: data
  })
}
//在催金额一键刷新
export function getPrepaymentStatisticsRefresh (data) {
  return fetch({
    url: '/api/prepaymentStatistics/refresh',
    method: 'post',
    data: data
  })
}
//必过券统计
export function getCouponStatistics (data) {
  return fetch({
    url: '/api/couponStatistics',
    method: 'post',
    data: data
  })
}
//必过券统计数量
export function getCouponStatisticsCount (data) {
  return fetch({
    url: '/api/couponStatistics/count',
    method: 'post',
    data: data
  })
}
//必过券统计一键刷新
export function getCouponStatisticsRefresh (data) {
  return fetch({
    url: '/api/couponStatistics/refresh',
    method: 'post',
    data: data
  })
}
//还款抵扣券分析
export function getRepaymentCouponAnalysis (data) {
  return fetch({
    url: '/api/repaymentCouponAnalysis',
    method: 'post',
    data: data
  })
}
//还款抵扣券分析 数量
export function getRepaymentCouponAnalysisCount (data) {
  return fetch({
    url: '/api/repaymentCouponAnalysis/count',
    method: 'post',
    data: data
  })
}
//还款抵扣券分析 一键刷新
export function getRepaymentCouponAnalysisRefresh (data) {
  return fetch({
    url: '/api/repaymentCouponAnalysis/refresh',
    method: 'post',
    data: data
  })
}
//分时段还款率
export function getHourlyRepaymentRate (data) {
  return fetch({
    url: '/api/hourlyRepaymentRate',
    method: 'post',
    data: data
  })
}
//分时段还款率  图
export function getHourlyRepaymentRatePic (data) {
  return fetch({
    url: '/api/hourlyRepaymentRateP',
    method: 'post',
    data: data
  })
}
//分时段还款率 数量
export function getHourlyRepaymentRateCount (data) {
  return fetch({
    url: '/api/hourlyRepaymentRate/count',
    method: 'post',
    data: data
  })
}
//分时段还款率 一键刷新
export function getHourlyRepaymentRateRefresh (data) {
  return fetch({
    url: '/api/hourlyRepaymentRate/refresh',
    method: 'post',
    data: data
  })
}
//关键数据
export function getKeyData (data) {
  return fetch({
    url: '/api/keyData',
    method: 'post',
    data: data
  })
}
//关键数据数量
export function getKeyDataCount (data) {
  return fetch({
    url: '/api/keyData/count',
    method: 'post',
    data: data
  })
}
//关键数据 一键刷新
export function getKeyDataRefresh (data) {
  return fetch({
    url: '/api/keyData/refresh',
    method: 'post',
    data: data
  })
}
//平台数据
export function getPlatformData (data) {
  return fetch({
    url: '/api/platformData',
    method: 'post',
    data: data
  })
}
//平台数据数量
export function getPlatformDataCount (data) {
  return fetch({
    url: '/api/platformData/count',
    method: 'post',
    data: data
  })
}
//平台数据一键刷新
export function getPlatformDataRefresh (data) {
  return fetch({
    url: '/api/platformData/refresh',
    method: 'post',
    data: data
  })
}
//自然渠道统计
export function getNaturalChannelStatistics (data) {
  return fetch({
    url: '/api/naturalChannelStatistics',
    method: 'post',
    data: data
  })
}
//自然渠道统计数量
export function getNaturalChannelStatisticsCount (data) {
  return fetch({
    url: '/api/naturalChannelStatistics/count',
    method: 'post',
    data: data
  })
}
/*开心商城*/
//每日支出数据
export function getDailyExpenditureData (data) {
  return fetch({
    url: '/api/dailyExpenditureData',
    method: 'post',
    data: data
  })
}
//每日支出数据
export function getDailyExpenditureDataCount (data) {
  return fetch({
    url: '/api/dailyExpenditureData/count',
    method: 'post',
    data: data
  })
}
/*现金借呗*/
//每日放款数据
export function getDailyLendingDataXJJB (data) {
  return fetch({
    url: '/api/dailyLendingDataXJJB',
    method: 'post',
    data: data
  })
}
//每日放款数据统计
export function getDailyLendingDataXJJBCount (data) {
  return fetch({
    url: '/api/dailyLendingDataXJJB/count',
    method: 'post',
    data: data
  })
}
//每日放款数据一键刷新
export function getDailyLendingDataXJJBRefresh (data) {
  return fetch({
    url: '/api/dailyLendingDataXJJB/refresh',
    method: 'post',
    data: data
  })
}
//每日还款数据
export function getDailyRepaymentUnitDataXJJB (data) {
  return fetch({
    url: '/api/dailyRepaymentUnitDataXJJB',
    method: 'post',
    data: data
  })
}
//每日还款数据统计
export function getDailyRepaymentUnitDataXJJBCount (data) {
  return fetch({
    url: '/api/dailyRepaymentUnitDataXJJB/count',
    method: 'post',
    data: data
  })
}
//每日还款数据一键刷新
export function getDailyRepaymentUnitDataXJJBRefresh (data) {
  return fetch({
    url: '/api/dailyRepaymentUnitDataXJJB/refresh',
    method: 'post',
    data: data
  })
}
//财务分析
//还款明细
export function getRepaymentMinutia (data) {
  return fetch({
    url: '/api/repaymentMinutia',
    method: 'post',
    data: data
  })
}
//还款明细数量
export function getRepaymentMinutiaCount (data) {
  return fetch({
    url: '/api/repaymentMinutia/count',
    method: 'post',
    data: data
  })
}
//对账分析
export function getReconciliationAnalysis (data) {
  return fetch({
    url: '/api/reconciliationAnalysis',
    method: 'post',
    data: data
  })
}
//对账分析数量
export function getReconciliationAnalysisCount (data) {
  return fetch({
    url: '/api/reconciliationAnalysis/count',
    method: 'post',
    data: data
  })
}
//对账分析修改
export function getReconciliationAnalysisModify (data) {
  return fetch({
    url: '/api/reconciliationAnalysis/modify',
    method: 'post',
    data: data
  })
}
//对账分析QE
export function getReconciliationAnalysisQE (data) {
  return fetch({
    url: '/api/reconciliationAnalysisQE',
    method: 'post',
    data: data
  })
}
//对账分析数量QE
export function getReconciliationAnalysisQECount (data) {
  return fetch({
    url: '/api/reconciliationAnalysisQE/count',
    method: 'post',
    data: data
  })
}
//对账分析修改QE
export function getReconciliationAnalysisQEModify (data) {
  return fetch({
    url: '/api/reconciliationAnalysisQE/modify',
    method: 'post',
    data: data
  })
}
//企鹅收入结算表
export function getIncomeStatementQE (data) {
  return fetch({
    url: '/api/incomeStatementQE',
    method: 'post',
    data: data
  })
}
//企鹅收入结算表数量
export function getIncomeStatementQECount (data) {
  return fetch({
    url: '/api/incomeStatementQE/count',
    method: 'post',
    data: data
  })
}
//企鹅汇总明细表
export function getPenguinSummaryQE (data) {
  return fetch({
    url: '/api/penguinSummaryQE',
    method: 'post',
    data: data
  })
}
//企鹅汇总明细表数量
export function getPenguinSummaryQECount (data) {
  return fetch({
    url: '/api/penguinSummaryQE/count',
    method: 'post',
    data: data
  })
}
//企鹅抓娃娃进销存明细表
export function getInventoryManagementQE (data) {
  return fetch({
    url: '/api/inventoryManagementQE',
    method: 'post',
    data: data
  })
}
//企鹅抓娃娃进销存明细表数量 数量
export function getInventoryManagementQECount (data) {
  return fetch({
    url: '/api/inventoryManagementQE/count',
    method: 'post',
    data: data
  })
}
//企鹅抓娃娃进销存明细表数量 刷新
export function getInventoryManagementQERefresh (data) {
  return fetch({
    url: '/api/inventoryManagementQE/refresh',
    method: 'post',
    data: data
  })
}

//还款日报
export function getReportStatistics (data) {
  return fetch({
    url: '/api/reportStatistics',
    method: 'post',
    data: data
  })
}
//还款日报数量
export function getReportStatisticsCount (data) {
  return fetch({
    url: '/api/reportStatistics/count',
    method: 'post',
    data: data
  })
}
//放款日报
export function getLendingDaily (data) {
  return fetch({
    url: '/api/lendingDaily',
    method: 'post',
    data: data
  })
}
//放款日报数量
export function getLendingDailyCount (data) {
  return fetch({
    url: '/api/lendingDaily/count',
    method: 'post',
    data: data
  })
}
//放款日报合计
export function getLendingDailySum (data) {
  return fetch({
    url: '/api/lendingDaily/sum',
    method: 'post',
    data: data
  })
}
//放款日报2
export function getLendingDailyB (data) {
  return fetch({
    url: '/api/lendingDaily2',
    method: 'post',
    data: data
  })
}
//放款日报2数量
export function getLendingDailyBCount (data) {
  return fetch({
    url: '/api/lendingDaily2/count',
    method: 'post',
    data: data
  })
}
//放款日报2合计
export function getLendingDailyBSum (data) {
  return fetch({
    url: '/api/lendingDaily2/sum',
    method: 'post',
    data: data
  })
}
//推广管理
//推广渠道
export function getPromotionChannel (data) {
  return fetch({
    url: '/api/promotionChannel',
    method: 'post',
    data: data
  })
}
//推广渠道数量
export function getPromotionChannelCount (data) {
  return fetch({
    url: '/api/promotionChannel/count',
    method: 'post',
    data: data
  })
}
//推广员管理
export function getPromoterManagement (data) {
  return fetch({
    url: '/api/promoterManagement',
    method: 'post',
    data: data
  })
}
//推广员管理数量
export function getPromoterManagementCount (data) {
  return fetch({
    url: '/api/promoterManagement/count',
    method: 'post',
    data: data
  })
}
//推广员管理select
export function getPromoterManagementSelect () {
  return fetch({
    url: '/api/promoterManagement/getSelectOptions',
    method: 'post'
  })
}
//推广统计(渠道)
export function getPromotionChannelStatistics (data) {
  return fetch({
    url: '/api/promotionChannelStatistics',
    method: 'post',
    data: data
  })
}
//推广统计(渠道)数量
export function getPromotionChannelStatisticsCount (data) {
  return fetch({
    url: '/api/promotionChannelStatistics/count',
    method: 'post',
    data: data
  })
}
//推广统计(渠道)select
export function getPromotionChannelStatisticsSelect () {
  return fetch({
    url: '/api/promotionChannelStatistics/getSelectOptions',
    method: 'post'
  })
}
//推广统计(渠道)一件刷新
export function getPromotionChannelStatisticsRefresh () {
  return fetch({
    url: '/api/promotionChannelStatistics/refresh',
    method: 'post'
  })
}
//七日推广统计(渠道)
export function getPromotionChannelStatistics7 (data) {
  return fetch({
    url: '/api/promotionChannelStatistics7',
    method: 'post',
    data: data
  })
}
//七日推广统计(渠道)数量
export function getPromotionChannelStatistics7Count (data) {
  return fetch({
    url: '/api/promotionChannelStatistics7/count',
    method: 'post',
    data: data
  })
}
//七日推广统计(渠道)select
export function getPromotionChannelStatistics7Select () {
  return fetch({
    url: '/api/promotionChannelStatistics7/getSelectOptions',
    method: 'post'
  })
}
//七日推广统计(渠道)一件刷新
export function getPromotionChannelStatistics7Refresh () {
  return fetch({
    url: '/api/promotionChannelStatistics7/refresh',
    method: 'post'
  })
}
//推广统计(地区)
export function getPromotionRegionStatistics (data) {
  return fetch({
    url: '/api/promotionRegionStatistics',
    method: 'post',
    data: data
  })
}
//推广统计(地区)数量
export function getPromotionRegionStatisticsCount (data) {
  return fetch({
    url: '/api/promotionRegionStatistics/count',
    method: 'post',
    data: data
  })
}
//渠道统计汇总
export function getChannelStatisticsSummary (data) {
  return fetch({
    url: '/api/channelStatisticsSummary',
    method: 'post',
    data: data
  })
}
//渠道统计汇总数量
export function getChannelStatisticsSummaryCount (data) {
  return fetch({
    url: '/api/channelStatisticsSummary/count',
    method: 'post',
    data: data
  })
}
//渠道统计汇总select
export function getChannelStatisticsSummarySelect () {
  return fetch({
    url: '/api/channelStatisticsSummary/getSelectOptions',
    method: 'post'
  })
}
//注册量统计报表
export function getRegistrationStatisticsReport (data) {
  return fetch({
    url: '/api/dailyLendingData',
    method: 'post',
    data: data
  })
}
//注册量统计报表数量
export function getRegistrationStatisticsReportCount (data) {
  return fetch({
    url: '/api/dailyLendingData/count',
    method: 'post',
    data: data
  })
}
//贷款超市-PVUV
export function getPVUV (data) {
  return fetch({
    url: '/api/PVUV',
    method: 'post',
    data: data
  })
}
//贷款超市-PVUV数量
export function getPVUVCount (data) {
  return fetch({
    url: '/api/PVUV/count',
    method: 'post',
    data: data
  })
}
//贷款超市-PVUVselect
export function getPVUVSelect () {
  return fetch({
    url: '/api/PVUV/getSelectOptions',
    method: 'post'
  })
}
/*绩效考评*/
//部门绩效考评数量
export function getAchievementsCount (data) {
  return fetch({
    url: '/api/achievements/count',
    method: 'post',
    data: data
  })
}
//部门绩效考评
export function getAchievements (data) {
  return fetch({
    url: '/api/achievements',
    method: 'post',
    data: data
  })
}
//员工信息
export function getEmployeeList (data) {
  return fetch({
    url: '/api/employeeList',
    method: 'post',
    data: data
  })
}
//员工信息数量
export function getEmployeeListCount (data) {
  return fetch({
    url: '/api/employeeList/count',
    method: 'post',
    data: data
  })
}
//员工信息修改
export function getEmployeeListModify (data) {
  return fetch({
    url: '/api/employeeList/privilegeModify',
    method: 'post',
    data: data
  })
}
//员工信息添加
export function getEmployeeListAdd (data) {
  return fetch({
    url: '/api/employeeList/add',
    method: 'post',
    data: data
  })
}
//员工信息删除
export function getEmployeeListDelete (data) {
  return fetch({
    url: '/api/employeeList/delete',
    method: 'post',
    data: data
  })
}
//批量修改信息
export function modifyMultiple (data) {
  return fetch({
    url: '/api/modifyMultiple',
    method: 'post',
    data: data
  })
}
//修改密码
//密码确认
export function getPasswordConfirm (data) {
  return fetch({
    url: '/api/passwordConfirm',
    method: 'post',
    data: data
  })
}
//修改
export function getPasswordModify (data) {
  return fetch({
    url: '/api/passwordModify',
    method: 'post',
    data: data
  })
}
/*开心分期*/
/*黑卡*/
//每日放款数据
export function getPeriodDailyLendingData (data) {
  return fetch({
    url: '/api/periodDailyLendingData',
    method: 'post',
    data: data
  })
}
//每日放款数据统计
export function getPeriodDailyLendingDataCount (data) {
  return fetch({
    url: '/api/periodDailyLendingData/count',
    method: 'post',
    data: data
  })
}
//每日放款数据一键刷新
export function getPeriodDailyLendingDataRefresh (data) {
  return fetch({
    url: '/api/periodDailyLendingData/refresh',
    method: 'post',
    data: data
  })
}
//还款逾期记录
export function getPeriodOverdueRepaymentStatistics (data) {
  return fetch({
    url: '/api/periodOverdueRepaymentStatistics',
    method: 'post',
    data: data
  })
}
//还款逾期记录统计
export function getPeriodOverdueRepaymentStatisticsCount (data) {
  return fetch({
    url: '/api/periodOverdueRepaymentStatistics/count',
    method: 'post',
    data: data
  })
}
//还款逾期记录一键刷新
export function getPeriodOverdueRepaymentStatisticsRefresh (data) {
  return fetch({
    url: '/api/periodOverdueRepaymentStatistics/refresh',
    method: 'post',
    data: data
  })
}
//每日还款金额记录
export function getPeriodDailyRepaymentAmountData (data) {
  return fetch({
    url: '/api/periodDailyRepaymentAmountData',
    method: 'post',
    data: data
  })
}
//每日还款金额记录统计
export function getPeriodDailyRepaymentAmountDataCount (data) {
  return fetch({
    url: '/api/periodDailyRepaymentAmountData/count',
    method: 'post',
    data: data
  })
}
//每日还款金额记录一键刷新
export function getPeriodDailyRepaymentAmountDataRefresh (data) {
  return fetch({
    url: '/api/periodDailyRepaymentAmountData/refresh',
    method: 'post',
    data: data
  })
}
//在催金额记录
export function getPromptAmountData (data) {
  return fetch({
    url: '/api/promptAmountData',
    method: 'post',
    data: data
  })
}
//在催金额记录统计
export function getPromptAmountDataCount (data) {
  return fetch({
    url: '/api/promptAmountData/count',
    method: 'post',
    data: data
  })
}
//在催金额记录一键刷新
export function getPromptAmountDataRefresh (data) {
  return fetch({
    url: '/api/promptAmountData/refresh',
    method: 'post',
    data: data
  })
}
//每日还款明细记录
export function getRepaymentDetailData (data) {
  return fetch({
    url: '/api/repaymentDetailData',
    method: 'post',
    data: data
  })
}
//每日还款明细记录统计
export function getRepaymentDetailDataCount (data) {
  return fetch({
    url: '/api/repaymentDetailData/count',
    method: 'post',
    data: data
  })
}
//每日还款明细记录一键刷新
export function getRepaymentDetailDataRefresh (data) {
  return fetch({
    url: '/api/repaymentDetailData/refresh',
    method: 'post',
    data: data
  })
}
//ZB开心分期还款数据核对
export function getZBRepaymentData (data) {
  return fetch({
    url: '/api/ZBrepaymentData',
    method: 'post',
    data: data
  })
}
//每日结算报表
export function getDailySettlementReport (data) {
  return fetch({
    url: '/api/dailySettlementReport',
    method: 'post',
    data: data
  })
}
//每日结算报表
export function getDailySettlementReportCount (data) {
  return fetch({
    url: '/api/dailySettlementReport/count',
    method: 'post',
    data: data
  })
}
//每日结算报表一键刷新
export function getDailySettlementReportRefresh (data) {
  return fetch({
    url: '/api/dailySettlementReport/refresh',
    method: 'post',
    data: data
  })
}
//每日结算报表 求和
export function getDailySettlementReportSum (data) {
  return fetch({
    url: '/api/dailySettlementReport/sum',
    method: 'post',
    data: data
  })
}
//每日债权报表
export function getDailyClaimsReport (data) {
  return fetch({
    url: '/api/dailyClaimsReport',
    method: 'post',
    data: data
  })
}
//每日债权报表
export function getDailyClaimsReportCount (data) {
  return fetch({
    url: '/api/dailyClaimsReport/count',
    method: 'post',
    data: data
  })
}
//每日债权报表一键刷新
export function getDailyClaimsReportRefresh (data) {
  return fetch({
    url: '/api/dailyClaimsReport/refresh',
    method: 'post',
    data: data
  })
}
//每日债权报表 求和
export function getDailyClaimsReportSum (data) {
  return fetch({
    url: '/api/dailyClaimsReport/sum',
    method: 'post',
    data: data
  })
}
//ZCM开心分期还款数据核对
export function getZCMRepaymentDataReconciliation (data) {
  return fetch({
    url: '/api/ZCMRepaymentDataReconciliation',
    method: 'post',
    data: data
  })
}
//ZCM开心分期还款数据核对
export function getZCMRepaymentDataReconciliationCount (data) {
  return fetch({
    url: '/api/ZCMRepaymentDataReconciliation/count',
    method: 'post',
    data: data
  })
}
//ZCM开心分期还款数据核对一键刷新
export function getZCMRepaymentDataReconciliationRefresh (data) {
  return fetch({
    url: '/api/ZCMRepaymentDataReconciliation/refresh',
    method: 'post',
    data: data
  })
}
//ZCM开心分期还款数据核对 求和
export function getZCMRepaymentDataReconciliationSum (data) {
  return fetch({
    url: '/api/ZCMRepaymentDataReconciliation/sum',
    method: 'post',
    data: data
  })
}
//ZB开心分期还款数据核对统计
export function getZBRepaymentDataCount (data) {
  return fetch({
    url: '/api/ZBrepaymentData/count',
    method: 'post',
    data: data
  })
}
//ZB开心分期还款数据核对一键刷新
export function getZBRepaymentDataRefresh (data) {
  return fetch({
    url: '/api/ZBrepaymentData/refresh',
    method: 'post',
    data: data
  })
}
//每月结算表
export function getMonthlySettlementData (data) {
  return fetch({
    url: '/api/monthlySettlementData',
    method: 'post',
    data: data
  })
}
//每月结算表统计
export function getMonthlySettlementDataCount (data) {
  return fetch({
    url: '/api/monthlySettlementData/count',
    method: 'post',
    data: data
  })
}
//每月结算表一键刷新
export function getMonthlySettlementDataRefresh (data) {
  return fetch({
    url: '/api/monthlySettlementData/refresh',
    method: 'post',
    data: data
  })
}
//每月债权报表
export function getMonthlyBondData (data) {
  return fetch({
    url: '/api/monthlyBondData',
    method: 'post',
    data: data
  })
}
//每月债权报表统计
export function getMonthlyBondDataCount (data) {
  return fetch({
    url: '/api/monthlyBondData/count',
    method: 'post',
    data: data
  })
}
//每月债权报表一键刷新
export function getMonthlyBondDataRefresh (data) {
  return fetch({
    url: '/api/monthlyBondData/refresh',
    method: 'post',
    data: data
  })
}
/*商城*/
//收入结算总表
export function getTotalIncome (data) {
  return fetch({
    url: '/api/totalIncome',
    method: 'post',
    data: data
  })
}
//收入结算总表统计
export function getTotalIncomeCount (data) {
  return fetch({
    url: '/api/totalIncome/count',
    method: 'post',
    data: data
  })
}
//收入结算总表一键刷新
export function getTotalIncomeRefresh (data) {
  return fetch({
    url: '/api/totalIncome/refresh',
    method: 'post',
    data: data
  })
}
//收入结算明细表
export function getDetailIncome (data) {
  return fetch({
    url: '/api/detailIncome',
    method: 'post',
    data: data
  })
}
//收入结算明细表统计
export function getDetailIncomeCount (data) {
  return fetch({
    url: '/api/detailIncome/count',
    method: 'post',
    data: data
  })
}
//收入结算明细表一键刷新
export function getDetailIncomeRefresh (data) {
  return fetch({
    url: '/api/detailIncome/refresh',
    method: 'post',
    data: data
  })
}
//总销售额统计表
export function getTotalSales (data) {
  return fetch({
    url: '/api/totalSales',
    method: 'post',
    data: data
  })
}
//总销售额统计表统计
export function getTotalSalesCount (data) {
  return fetch({
    url: '/api/totalSales/count',
    method: 'post',
    data: data
  })
}
//总销售额统计表一键刷新
export function getTotalSalesRefresh (data) {
  return fetch({
    url: '/api/totalSales/refresh',
    method: 'post',
    data: data
  })
}
//订单详情记录
export function getDetailOrder (data) {
  return fetch({
    url: '/api/detailOrder',
    method: 'post',
    data: data
  })
}
//订单详情记录统计
export function getDetailOrderCount (data) {
  return fetch({
    url: '/api/detailOrder/count',
    method: 'post',
    data: data
  })
}
//订单详情记录一键刷新
export function getDetailOrderRefresh (data) {
  return fetch({
    url: '/api/detailOrder/refresh',
    method: 'post',
    data: data
  })
}
//商品销售记录
export function getDetailSales (data) {
  return fetch({
    url: '/api/detailSales',
    method: 'post',
    data: data
  })
}
//商品销售记录统计
export function getDetailSalesCount (data) {
  return fetch({
    url: '/api/detailSales/count',
    method: 'post',
    data: data
  })
}
//商品销售记录一键刷新
export function getDetailSalesRefresh (data) {
  return fetch({
    url: '/api/detailSales/refresh',
    method: 'post',
    data: data
  })
}
//每日零钱资金分析表
export function getDailyPocketMoneyAnalysis (data) {
  return fetch({
    url: '/api/dailyPocketMoneyAnalysis',
    method: 'post',
    data: data
  })
}
//每日零钱资金分析表统计
export function getDailyPocketMoneyAnalysisCount (data) {
  return fetch({
    url: '/api/dailyPocketMoneyAnalysis/count',
    method: 'post',
    data: data
  })
}
//每日零钱资金分析表一键刷新
export function getDailyPocketMoneyAnalysisRefresh (data) {
  return fetch({
    url: '/api/dailyPocketMoneyAnalysis/refresh',
    method: 'post',
    data: data
  })
}
//每日大礼包收入报表
export function getDailyPackageIncomeStatement (data) {
  return fetch({
    url: '/api/dailyPackageIncomeStatement',
    method: 'post',
    data: data
  })
}
//每日大礼包收入报表统计
export function getDailyPackageIncomeStatementCount (data) {
  return fetch({
    url: '/api/dailyPackageIncomeStatement/count',
    method: 'post',
    data: data
  })
}
//每日大礼包收入报表一键刷新
export function getDailyPackageIncomeStatementRefresh (data) {
  return fetch({
    url: '/api/dailyPackageIncomeStatement/refresh',
    method: 'post',
    data: data
  })
}
//每日商城订单报表
export function getDailyMallOrderReport (data) {
  return fetch({
    url: '/api/dailyMallOrderReport',
    method: 'post',
    data: data
  })
}
//每日商城订单报表统计
export function getDailyMallOrderReportCount (data) {
  return fetch({
    url: '/api/dailyMallOrderReport/count',
    method: 'post',
    data: data
  })
}
//每日商城订单报表一键刷新
export function getDailyMallOrderReportRefresh (data) {
  return fetch({
    url: '/api/dailyMallOrderReport/refresh',
    method: 'post',
    data: data
  })
}
//零钱充值对账分析
export function getRechargeOfChangeReport (data) {
  return fetch({
    url: '/api/rechargeOfChangeReport',
    method: 'post',
    data: data
  })
}
//零钱充值对账分析统计
export function getRechargeOfChangeReportCount (data) {
  return fetch({
    url: '/api/rechargeOfChangeReport/count',
    method: 'post',
    data: data
  })
}
//零钱充值对账分析一键刷新
export function getRechargeOfChangeReportRefresh (data) {
  return fetch({
    url: '/api/rechargeOfChangeReport/refresh',
    method: 'post',
    data: data
  })
}
//零钱充值对账分析更新数据
export function getRechargeOfChangeReportModify (data) {
  return fetch({
    url: '/api/rechargeOfChangeReport/modify',
    method: 'post',
    data: data
  })
}
