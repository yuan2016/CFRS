// sql语句
let sqlMap = {
  //全局
  global: {
    allTables: "show tables",
    selectOne: "select * from ?? limit ?, ?",
    selectOneNum: "select count(*) as count from ??"
  },
  // 登陆
  login: {
    select: "select user_name from ?? where user_mobile = ?",
    select2:
      "select user_password,user_name,available_table from ?? where user_email = ?",
    updateColor: "update ?? set colors = ? where user_mobile = ?",
    getColors: "select colors from ?? where user_mobile = ?"
  },
  userData: {
    select:
      "select product_names,available_table,available_table_zww,available_table_fq,available_table_sdk,department,role,user_name,user_sex,user_mobile,user_permission from ?? where user_mobile = ?",
    select2:
      "select product_names,available_table,available_table_zww,available_table_fq,available_table_sdk,department,role,user_name,user_sex,user_mobile,user_permission from ?? where user_email = ?",
    update:
      "UPDATE ?? SET user_name = ?,user_sex=?,user_mobile=?,department=? WHERE user_email = ?"
  },
  //修改密码
  passwordModify: {
    getPass: "select user_password from ?? where user_email = ?",
    modifyPass: "UPDATE ?? SET user_password = ? WHERE user_email = ?"
  },
  //首页
  main: {
    selectAll: "select * from ?? order by d_date DESC limit 1"
  },
  //用户信息管理
  userInformationManagement: {
    userList: {
      getCount: "select count(*) as count from ??",
      selectAllFront:
        'select id, realname, company_name, user_phone, id_number, DATE(SUBSTR(ID_NUMBER,7,8)) as birthday, user_sex, CASE WHEN STATUS = 2 THEN "是" WHEN STATUS = 1 then "否" END as status, create_time from ??',
      order: " ORDER BY create_time desc",
      limit: " limit ?,?"
    },
    userAddressBook: {
      getCount: "select count(*) as count from ??",
      selectAllFront:
        "select id, user_id, user_name, contact_name, contact_phone, create_time from ??",
      selectAllBack: " limit ?,?"
    },
    bankcardsList: {
      getCount: "select count(*) as count from ??",
      selectAllFront:
        'select id, user_id, open_name, phone, bank_name, card_no, CASE WHEN MAIN_CARD = 0 THEN "是" ELSE "否" END as main_card, CASE WHEN TYPE = 1 THEN "信用卡" WHEN TYPE = 2 THEN "借记卡" ELSE "对公账号" END as type,CASE WHEN STATUS = 0 THEN "无效" WHEN STATUS = 1 THEN "生效" END as card_status,create_time FROM ??',
      selectAllBack: " limit ?,?"
    },
    userNameAuthenticationList: {
      getCount: "select count(*) as count from ?? where (REALNAME_STATUS=1) ",
      selectAllFront:
        "select id, realname, id_number, create_time, update_time from ?? where (REALNAME_STATUS=1) ",
      selectAllBack: " limit ?,?"
    },
    userAuthenticationList: {
      getCount:
        "select count(*) as count from ?? a left join ?? b on a.id=b.user_id ",
      selectAllFront:
        'select a.id user_id, a.realname, a.user_name user_phone, case when a.pay_password is not null then "是" else "否" end auth_pay_password, case when a.id_number is not null then "是" else "否" end auth_id_number, case when a.company_name is not null and a.company_address is not null then "是" else "否" end auth_company,case when a.first_contact_name is not null and a.first_contact_phone is not null then "是" else "否" end auth_contact, case when b.card_no is not null then "是" else "否" end auth_card , case when a.zm_status=2 then "是" else "否" end auth_zm, case when a.jxl_status=2 then "是" else "否" end auth_jxl, case when a.qq is not null or a.wechat_account is not null or a.email is not null then "是" else "否" end auth_more, case when a.my_hb_time is not null then "是" else "否" end auth_zfb, case when a.taobao_account is not null then "是" else "否" end auth_taobao from ?? a left join ?? b on a.id=b.user_id  ',
      selectAllBack: " limit ?,?"
    },
    discountCoupon: {
      getCount:
        "select count(*) as count from ?? a left join ?? b on a.asset_id=b.id",
      selectAllFront:
        'select a.coupon_id, a.batch_num, a.user_name, a.user_phone, a.title, a.use_condition, a.discount, a.status, a.borrow_money, (case when a.asset_id>0 and b.status in (21,23,30,-11,-20,34) then 1 else 0 end) as borrow_suss, a.use_time, a.add_time, concat(concat(a.begin_date," -- "),a.end_date) as validity_time from ?? a left join ?? b on a.asset_id=b.id',
      limit: " limit ?,?",
      discountCouponExcel:
        'select a.coupon_id as "优惠券ID", a.batch_num as "批次号", a.user_name as "用户名", a.user_phone as "手机号", a.title as "优惠券title", a.use_condition as "使用条件", a.discount as "优惠券面额/折扣", a.status as "优惠券使用状态", a.borrow_money as "使用优惠券申请借款金额", (case when a.asset_id>0 and b.status in (21,23,30,-11,-20,34) then 1 else 0 end) as "是否成功借款", a.use_time as "优惠券使用时间", a.add_time as "优惠券获取时间", concat(concat(a.begin_date," -- "),a.end_date) as "优惠券有效期" from ?? a left join ?? b on a.asset_id=b.id'
    },
    newUserTagList: {
      getCount: "select count(*) as count from ??",
      selectAllFront:
        "select user_phone, registe_at, authentication_at, order_time, second_time, repayment_real_time, money_amount, hmd, status, late_day from ??",
      limit: " limit ?,?",
      newUserTagListExcel:
        'select user_phone as "手机号", registe_at as "注册时间", authentication_at as "认证时间", order_time as "申请首贷时间", second_time as "申请复贷时间", repayment_real_time as "首贷还款时间", money_amount as "首贷借款金额", hmd as "黑名单", status as "还款状态", late_day as "当前逾期天数" from ??'
    },
    oldUserTagList: {
      getCount:
        "select count(*) as count from ?? a join ?? b on a.user_id=b.user_id",
      selectAllFront:
        "select a.user_phone,a.registe_at,a.last_borrow_time,count(b.user_id) as loan_num,a.last_repayment_time,a.money_amount,a.hmd,a.status,a.late_day,a.count_yq from ?? a join ?? b on a.user_id=b.user_id",
      groupBy: " group by a.user_id",
      limit: " limit ?,?",
      oldUserTagListExcel:
        'select a.user_phone as "手机号",a.registe_at as "注册时间",a.last_borrow_time as "最近一次借款时间",count(b.user_id) as "累计借款频次" ,a.last_repayment_time as "最近一次还款时间",a.money_amount as "累计借款金额",a.hmd as "黑名单",a.status as "还款状态",a.late_day as "当前逾期天数",a.count_yq as "累计逾期次数" from ?? a join ?? b on a.user_id=b.user_id'
    }
  },
  //RMAB
  //借款通过率
  RMAB: {
    loanThroughRate: {
      selectAll:
        "select AA,D1,D2,D3,D4,D5,D6,D7,DOD,W1,W2,W3,W4,WOW,M1,M2,M3,MOM from ??"
    },
    loanOverdueRecallRate: {
      selectAll:
        "SELECT AA,D1,D2,D3,D4,D5,D6,D7,D8,D9,D10,DOD,W1,W2,W3,W4,WOW,M1,M2,M3,MOM FROM ?? where loan_term = ?"
    },
    userBasePortrait: {
      selectAll:
        "select user_age,user_sex,addr_birth,addr_now,user_cot,loan_cot_avg,loan_cot_savg,loan_amt_savg,time_avg,tgl_snew,tgl_sold,yql_avg_old,yql_avg_new,hk1_avg_old,hk1_avg_new,xq_avg,loan_day14_acot,loan_stages_acot,loan_stg21_acot,loan_stg90_acot from ?? WHERE loan_cot_savg>0 and user_cot>10",
      order: " order by user_cot desc,loan_cot_avg desc,loan_amt_savg desc",
      limit: " limit ?,?",
      getCount:
        "select count(*) as count from ?? WHERE loan_cot_savg>0 and user_cot>10"
    },
    invitationEvent: {
      selectAll:
        "select AA,D1,D2,D3,D4,D5,D6,D7,DOD,W1,W2,W3,W4,WOW,M1,M2,M3,MOM from pr_ds_invite_event_analysis"
    },
    operationUserPortrait: {
      select:
        'select ifnull(user_age,"--") as age,ifnull(user_sex,"--") as sex,ifnull(addr_birth,"--") as birth,addr_now,zcl,zcl_zb,yxzcl,qysrz,hmd,jjs,loan,new_loan,old_loan,loan_suss,new_loan_suss,old_loan_suss,zdq,new_zdq,old_zdq,dq,new_dq,old_dq,yq,new_yq,old_yq,syyq,new_syyq,old_syyq,loan_day14,loan_stages21 from ??  where zcl>=100 ',
      limit: " limit ?,?",
      order: " order by user_age is not null desc,user_age,zcl desc",
      getCount: "select count(*) as count from ?? where zcl>=100"
    },
    newUserPassRateRatio: {
      tab1: {
        hoursSelect:
          ' SELECT max(CASE WHEN rn = 0 THEN h_sqrs END) AS h1_sqrs,max(CASE WHEN rn = 1 THEN h_sqrs END) AS h2_sqrs,max(CASE WHEN rn = 2 THEN h_sqrs END) AS h3_sqrs,max(CASE WHEN rn = 3 THEN h_sqrs END) AS h4_sqrs,max(CASE WHEN rn = 4 THEN h_sqrs END) AS h5_sqrs, max(CASE WHEN rn = 5 THEN h_sqrs END) AS h6_sqrs,max(CASE WHEN rn = 6 THEN h_sqrs END) AS h7_sqrs,max(CASE WHEN rn = 7 THEN h_sqrs END) AS h8_sqrs,max(CASE WHEN rn = 8 THEN h_sqrs END) AS h9_sqrs, max(CASE WHEN rn = 9 THEN h_sqrs END) AS h10_sqrs,max(CASE WHEN rn = 10 THEN h_sqrs END) AS h11_sqrs,max(CASE WHEN rn = 11 THEN h_sqrs END) AS h12_sqrs,max(CASE WHEN rn = 12 THEN h_sqrs END) AS h13_sqrs, max(CASE WHEN rn = 13 THEN h_sqrs END) AS h14_sqrs,max(CASE WHEN rn = 14 THEN h_sqrs END) AS h15_sqrs,max(CASE WHEN rn = 15 THEN h_sqrs END) AS h16_sqrs,max(CASE WHEN rn = 16 THEN h_sqrs END) AS h17_sqrs,max(CASE WHEN rn = 17 THEN h_sqrs END) AS h18_sqrs, max(CASE WHEN rn = 18 THEN h_sqrs END) AS h19_sqrs,max(CASE WHEN rn = 19 THEN h_sqrs END) AS h20_sqrs,max(CASE WHEN rn = 20 THEN h_sqrs END) AS h21_sqrs,max(CASE WHEN rn = 21 THEN h_sqrs END) AS h22_sqrs,max(CASE WHEN rn = 22 THEN h_sqrs END) AS h23_sqrs, max(CASE WHEN rn = 23 THEN h_sqrs END) AS h24_sqrs FROM(SELECT "排序" AS flag ,@rownum :=@rownum + 1 AS rn,d_hour AS h_sqrs FROM(SELECT @rownum :=- 1) r,(SELECT zbdm AS d_date,0 AS d_hour,h1_sqrs AS h_sqrs FROM pr_new_passrate_analysis WHERE zbmc = "日" AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,1 AS d_hour,h2_sqrs FROM pr_new_passrate_analysis WHERE zbmc = "日" AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,2 AS d_hour,h3_sqrs FROM pr_new_passrate_analysis WHERE zbmc = "日" AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,3 AS d_hour,h4_sqrs FROM pr_new_passrate_analysis WHERE zbmc = "日" AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,4 AS d_hour,h5_sqrs FROM pr_new_passrate_analysis WHERE  zbmc = "日" AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,5 AS d_hour,h6_sqrs FROM pr_new_passrate_analysis WHERE  zbmc = "日" AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,6 AS d_hour,h7_sqrs FROM pr_new_passrate_analysis WHERE  zbmc = "日" AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,7 AS d_hour,h8_sqrs FROM pr_new_passrate_analysis WHERE  zbmc = "日"AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,8 AS d_hour,h9_sqrs FROM pr_new_passrate_analysis WHERE  zbmc = "日"AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,9 AS d_hour,h10_sqrs FROM pr_new_passrate_analysis WHERE zbmc = "日"AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,10 AS d_hour,h11_sqrs FROM pr_new_passrate_analysis WHERE zbmc = "日"AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,11 AS d_hour,h12_sqrs FROM pr_new_passrate_analysis WHERE zbmc = "日"AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,12 AS d_hour,h13_sqrs FROM pr_new_passrate_analysis WHERE zbmc = "日"AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,13 AS d_hour,h14_sqrs FROM pr_new_passrate_analysis WHERE zbmc = "日"AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,14 AS d_hour,h15_sqrs FROM pr_new_passrate_analysis WHERE zbmc = "日"AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,15 AS d_hour,h16_sqrs FROM pr_new_passrate_analysis WHERE zbmc = "日"AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,16 AS d_hour,h17_sqrs FROM pr_new_passrate_analysis WHERE zbmc = "日"AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,17 AS d_hour,h18_sqrs FROM pr_new_passrate_analysis WHERE zbmc = "日"AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,18 AS d_hour,h19_sqrs FROM pr_new_passrate_analysis WHERE zbmc = "日"AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,19 AS d_hour,h20_sqrs FROM pr_new_passrate_analysis WHERE zbmc = "日"AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,20 AS d_hour,h21_sqrs FROM pr_new_passrate_analysis WHERE zbmc = "日"AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,21 AS d_hour,h22_sqrs FROM pr_new_passrate_analysis WHERE zbmc = "日"AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,22 AS d_hour,h23_sqrs FROM pr_new_passrate_analysis WHERE zbmc = "日"AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) UNION ALL SELECT zbdm AS d_date,23 AS d_hour,h24_sqrs FROM pr_new_passrate_analysis WHERE zbmc = "日"AND (zbdm2 >= date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d")) ) t WHERE (t.d_date = date_format(date_add(now(), INTERVAL - 25 HOUR),"%Y-%m-%d") AND t.d_hour >= HOUR (date_add(now(), INTERVAL - 25 HOUR)))OR (t.d_date = date_format(now(), "%Y-%m-%d") AND t.d_hour < HOUR (now())) ORDER BY t.d_date,t.d_hour) t2 GROUP BY flag union all select  max(case when rn=0 then h_sqrs end) as h1_sqrs,max(case when rn=1 then h_sqrs end) as h2_sqrs,max(case when rn=2 then h_sqrs end) as h3_sqrs,max(case when rn=3 then h_sqrs end) as h4_sqrs,max(case when rn=4 then h_sqrs end) as h5_sqrs,max(case when rn=5 then h_sqrs end) as h6_sqrs,max(case when rn=6 then h_sqrs end) as h7_sqrs,max(case when rn=7 then h_sqrs end) as h8_sqrs,max(case when rn=8 then h_sqrs end) as h9_sqrs,max(case when rn=9 then h_sqrs end) as h10_sqrs,max(case when rn=10 then h_sqrs end) as h11_sqrs,max(case when rn=11 then h_sqrs end) as h12_sqrs,max(case when rn=12 then h_sqrs end) as h13_sqrs,max(case when rn=13 then h_sqrs end) as h14_sqrs,max(case when rn=14 then h_sqrs end) as h15_sqrs,max(case when rn=15 then h_sqrs end) as h16_sqrs,max(case when rn=16 then h_sqrs end) as h17_sqrs,max(case when rn=17 then h_sqrs end) as h18_sqrs,max(case when rn=18 then h_sqrs end) as h19_sqrs,max(case when rn=19 then h_sqrs end) as h20_sqrs,max(case when rn=20 then h_sqrs end) as h21_sqrs,max(case when rn=21 then h_sqrs end) as h22_sqrs,max(case when rn=22 then h_sqrs end) as h23_sqrs,max(case when rn=23 then h_sqrs end) as h24_sqrs from (select "排序" as flag ,@rownum:=@rownum+1 AS rn,h_sqrs as h_sqrs from (select @rownum:=-1) r, (select zbdm as d_date ,0 as d_hour,h1_sqrs as h_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,1 as d_hour,h2_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,2 as d_hour,h3_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,3 as d_hour,h4_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,4 as d_hour,h5_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,5 as d_hour,h6_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,6 as d_hour,h7_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d"))union all select zbdm as d_date ,7 as d_hour,h8_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,8 as d_hour,h9_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,9 as d_hour,h10_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,10 as d_hour,h11_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d"))  union all select zbdm as d_date ,11 as d_hour,h12_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,12 as d_hour,h13_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,13 as d_hour,h14_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,14 as d_hour,h15_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,15 as d_hour,h16_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,16 as d_hour,h17_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,17 as d_hour,h18_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,18 as d_hour,h19_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,19 as d_hour,h20_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,20 as d_hour,h21_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,21 as d_hour,h22_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,22 as d_hour,h23_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,23 as d_hour,h24_sqrs from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d"))) t where (t.d_date=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d") and t.d_hour>=hour(date_add(now(), interval -25 hour))) or (t.d_date=date_format(now(),"%Y-%m-%d") and t.d_hour<hour(now())) order by t.d_date ,t.d_hour )t2 group by flag union all select  max(case when rn=0 then htgl end) as h1tgl,max(case when rn=1 then htgl end) as h2tgl,max(case when rn=2 then htgl end) as h3tgl,max(case when rn=3 then htgl end) as h4tgl,max(case when rn=4 then htgl end) as h5tgl,max(case when rn=5 then htgl end) as h6tgl,max(case when rn=6 then htgl end) as h7tgl,max(case when rn=7 then htgl end) as h8tgl,max(case when rn=8 then htgl end) as h9tgl,max(case when rn=9 then htgl end) as h10tgl,max(case when rn=10 then htgl end) as h11tgl,max(case when rn=11 then htgl end) as h12tgl,max(case when rn=12 then htgl end) as h13tgl,max(case when rn=13 then htgl end) as h14tgl,max(case when rn=14 then htgl end) as h15tgl,max(case when rn=15 then htgl end) as h16tgl,max(case when rn=16 then htgl end) as h17tgl,max(case when rn=17 then htgl end) as h18tgl,max(case when rn=18 then htgl end) as h19tgl,max(case when rn=19 then htgl end) as h20tgl,max(case when rn=20 then htgl end) as h21tgl,max(case when rn=21 then htgl end) as h22tgl,max(case when rn=22 then htgl end) as h23tgl,max(case when rn=23 then htgl end) as h24tgl from (select "排序" as flag ,@rownum:=@rownum+1 AS rn,htgl*100 as htgl from (select @rownum:=-1) r, (select zbdm as d_date ,0 as d_hour,h1tgl as htgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,1 as d_hour,h2tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,2 as d_hour,h3tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d"))union all select zbdm as d_date ,3 as d_hour,h4tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,4 as d_hour,h5tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,5 as d_hour,h6tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,6 as d_hour,h7tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d"))union all select zbdm as d_date ,7 as d_hour,h8tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,8 as d_hour,h9tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,9 as d_hour,h10tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,10 as d_hour,h11tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d"))  union all select zbdm as d_date ,11 as d_hour,h12tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,12 as d_hour,h13tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,13 as d_hour,h14tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,14 as d_hour,h15tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,15 as d_hour,h16tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,16 as d_hour,h17tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,17 as d_hour,h18tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,18 as d_hour,h19tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,19 as d_hour,h20tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,20 as d_hour,h21tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,21 as d_hour,h22tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,22 as d_hour,h23tgl from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d")) union all select zbdm as d_date ,23 as d_hour,h24tgl from  ??  where zbmc="日"  and (zbdm2>=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d"))) t where (t.d_date=date_format(date_add(now(), interval -25 hour),"%Y-%m-%d") and t.d_hour>=hour(date_add(now(), interval -25 hour))) or (t.d_date=date_format(now(),"%Y-%m-%d") and t.d_hour<hour(now())) order by t.d_date ,t.d_hour )t2 group by flag ',
        dailySelect:
          'select date_format(zbdm,"%c.%e") as d_date,tgl*100 as r_tgl from ?? where zbmc="日"and zbdm2>=date_add(date_format(now(),"%Y-%m-%d"), interval -29 day)',
        weeklySelect:
          'select concat(concat(date_format(substr(zbdm,1,10),"%c.%e"),"-"),date_format(substr(zbdm,13,10),"%c.%e")) as d_week,tgl*100 as z_tgl from ?? where zbmc="周"and zbdm2>=weekofyear(now())-9 and year(now())=substr(zbdm,1,4)',
        monthlySelect:
          'select zbdm2 as d_month,tgl*100 as y_tgl from ?? where zbmc="月" and year(now())=year(zbdm)',
        getRatio:
          'select (select tgl*100 as dr_tgl from pr_new_passrate_analysis where zbmc="日" and zbdm=date_format(now(),"%Y-%m-%d")) as dr_tgl,(select (select (tgl*100) as zr_tgl from pr_new_passrate_analysis where zbmc="日" and (zbdm=date_add(date_format(now(),"%Y-%m-%d"), interval -1 day))) - (select (tgl*100) as zr_tgl from pr_new_passrate_analysis where zbmc="日" and (zbdm=date_add(date_format(now(),"%Y-%m-%d"), interval -8 day)))) as rtb_tgl,(select (select (tgl*100) as sz_tgl from pr_new_passrate_analysis where zbmc="周" and (zbdm2=weekofyear(now())-1)) - (select (tgl*100) as zr_tgl from pr_new_passrate_analysis where zbmc="周" and (zbdm2=weekofyear(now())-2))) as zhb_tgl,(select (select (tgl*100) as sz_tgl from pr_new_passrate_analysis where zbmc="月" and (zbdm2=month(now())-1)) - (select (tgl*100) as zr_tgl from pr_new_passrate_analysis where zbmc="月" and (zbdm2=month(now())-2))) as yhb_tgl,(select avg(tgl)*100 as day7_avg_tgl from ?? where zbmc="日"and zbdm2>=date_add(date_format(now(),"%Y-%m-%d"), interval -6 day)) as day7_avg_tgl,(select avg(tgl)*100 as day30_avg_tgl from pr_new_passrate_analysis where zbmc="日"and zbdm2>=date_add(date_format(now(),"%Y-%m-%d"), interval -29 day)) as day30_avg_tgl from dual',
        compare:
          'select "当日通过率" as zbmc ,zbdm as d_date,h1tgl*100,h2tgl*100,h3tgl*100,h4tgl*100,h5tgl*100,h6tgl*100,h7tgl*100,h8tgl*100,h9tgl*100,h10tgl*100,h11tgl*100,h12tgl*100,h13tgl*100,h14tgl*100,h15tgl*100,h16tgl*100,h17tgl*100,h18tgl*100,h19tgl*100,h20tgl*100,h21tgl*100,h22tgl*100,h23tgl*100,h24tgl*100 from pr_new_passrate_analysis  where zbmc="日"  and (zbdm2=?) union all select "某日通过率" as zbmc ,zbdm as d_date,h1tgl*100,h2tgl*100,h3tgl*100,h4tgl*100,h5tgl*100,h6tgl*100,h7tgl*100,h8tgl*100,h9tgl*100,h10tgl*100,h11tgl*100,h12tgl*100,h13tgl*100,h14tgl*100,h15tgl*100,h16tgl*100,h17tgl*100,h18tgl*100,h19tgl*100,h20tgl*100,h21tgl*100,h22tgl*100,h23tgl*100,h24tgl*100 from pr_new_passrate_analysis  where zbmc="日" and (zbdm2=?)'
      },
      tab2: {
        dailySelect:
          'select date_format(zbdm,"%c.%e") as zbdm,tgl,sq_yql from ?? where zbmc="日" and qdmc= ? and zbdm>=date_add(date_format(now(),"%Y-%m-%d"), interval -30 day)',
        weeklySelect:
          'select concat(concat(date_format(substr(zbdm,1,10),"%c.%e"),"-"),date_format(substr(zbdm,13,10),"%c.%e")) as d_week,tgl,sq_yql from ?? where zbmc="周" and qdmc= ? and zbdm2>=weekofyear(now())-9 and year(now())=substr(zbdm,1,4)',
        channelInfo: {
          selectAllFront:
            'select d_date,qdmc,sqzrs,ifnull(sqtgrs,0) as sqtgrs,(case when ifnull(sqtgrs, 0) = 0 then 0 else  convert (sqtgrs * 100 / sqzrs,decimal (4, 2))end) as tgl,(case when sqtgrs is null then "--" else sq_fkamt end) as sq_fkamt, (case when sqtgrs is null then "--" else sq_dqamt end) as sq_dqamt,(case when sqtgrs is null then "--" else sq_yqamt end) as sq_yqamt,(case when sqtgrs is null or d_date>=date_add(date(now()),interval -6 day) then "--" when ifnull(sq_yqamt, 0) = 0 then 0 else convert(sq_yqamt*100/sq_dqamt,decimal(4,2))end) as sq_yql from ?? where ',
          order: " order by d_date desc,sq_fkamt desc",
          limit: " limit ?,?",
          getCount: "select count(*) as count from ?? where ",
          getSelectOptions: 'select distinct qdmc from ?? where qdmc<>"汇总"'
        }
      },
      tab3: {
        rejectedResons20: {
          selectAllFront: 'select bjyy,sqbjrs from ?? where bjyy<>"汇总" and',
          selectAllLimit: " order by sqbjrs desc limit 20",
          daily: ' zbdm=date_format(now(),"%Y-%m-%d") ',
          weekly: " zbdm2=weekofyear(now())",
          monthly: " zbdm2=month(now())",
          getSelectOptions: 'select distinct qdmc from ?? where qdmc<>"汇总"'
        },
        dailyRejectedNumTrends: {
          select:
            'select date_format(zbdm,"%c.%e") as zbdm,sqbjrs from ?? where qdmc="汇总" and bjyy=? and zbmc="日" and zbdm>=date_add(date_format(now(),"%Y-%m-%d"), interval -30 day)',
          dailyOptions:
            'SELECT bjyy FROM ?? WHERE qdmc = "汇总" AND zbmc = "日" AND zbdm >= date_add(date_format(now(), "%Y-%m-%d"),INTERVAL - 30 DAY) GROUP BY bjyy'
        },
        channelRejectedReason: {
          selectDaily:
            'select concat(qdmc,"|||",bjyy) as qdmc,sqbjrs from (select qdmc,bjyy as bjyy,sqbjrs as sqbjrs from ?? where qdmc<>"汇总" and zbmc="日" and bjyy<>"汇总" and zbdm=date_format(now(),"%Y-%m-%d") order by sqbjrs desc) t group by t.qdmc order by 2 desc',
          selectWeekly:
            'select concat(qdmc,"|||",bjyy) as qdmc,sqbjrs from (select qdmc,bjyy as bjyy,sqbjrs as sqbjrs from ?? where qdmc<>"汇总" and zbmc="周" and bjyy<>"汇总" and zbdm2=weekofyear(now()) order by sqbjrs desc) t group by t.qdmc order by 2 desc',
          selectMonthly:
            'select concat(qdmc,"|||",bjyy) as qdmc,sqbjrs from (select qdmc,bjyy as bjyy,sqbjrs as sqbjrs from pr_canel_refuse_chart_analysis where qdmc<>"汇总" and zbmc="月" and bjyy<>"汇总" and zbdm2=month(now()) order by sqbjrs desc) t group by t.qdmc order by 2 desc'
        }
      }
    },
    riskControlFactorAnalysis: {
      selectAll:
        'select AA ,(case when BB="99.99" then "100" when BB="9.9" then "10" when BB="9.99" then "(10,∞)" else BB  end) as  BB, d11 , d12, d13, d14, d21, d22, d23, d24, d31, d32, d33, d34, d41, d42, d43, d44, d51, d52, d53, d54, d61, d62, d63, d64, d71, d72, d73 , d74 , d81, d82, d83, d84, d91, d92, d93, d94, d101 , d102, d103, d104, dod1, dod2, dod3, dod4 from ??'
    }
  },
  toyGrab: {
    market: {
      dataOverview: {
        selectAllDay:
          'select user_login_num as "用户登录数", new_user_num  as "新用户数量", new_devicd_num  as "新设备数", visit_num  as "回访人数", total_game  as "总游戏次数", total_consume  as "总消耗游戏币",  recharge_order_num  as "充值订单数", recharge_money  as "充值总金额", recharge_num  as "充值人数", first_recharge  as " 首充人数", more_recharge  as "复充人数",  recharge_rate  as "充值转化率", newu_recharge_rate  as "新用户充值转化率" from ??',
        getCount: "select count(*) as count from ??",
        selectAllRoom:
          "select d_date, room_name, once_price, games_num, success_num, game_factincome, game_theoryincome, income_diff, appeal_num, modified_time from ??",
        limitDay: " limit 1",
        limitRoom: " limit ?,?",
        orderBy: " order by d_date desc"
      },
      dataOverviewAll: {
        selectAllDay:
          'select user_num as "总用户数", new_user_num as "新用户数量", total_game  as "总游戏次数", total_consume  as "总消耗游戏币",  recharge_order_num  as "充值订单数", recharge_money  as "充值总金额", recharge_num  as "充值人数", avg_recharge as "单次平均充值", more_recharge  as "复充人数" from ??',
        getCount: "select count(*) as count from ??",
        selectAllRoom:
          "select d_date, room_name, once_price, games_num, success_num,fact_income, the_income,diff_income, appeal_num, modified_time from ??",
        limitDay: " limit 1",
        limitRoom: " limit ?,?",
        orderBy: " order by d_date desc"
      },
      promotionChannelStatisticsQE: {
        selectAll:
          "select d_date,login_num,channel_name,day_consumption,register_num,user_device_num,recharge_user_num,recharge_user_rate,sum(recharge_drnum)/sum(user_device_num) as new_recharge_rate,recharge_money,avg_recharge_money,register_recharge_rate,payuser_cost,recharge_dramt,recharge_drnum,modified_time from ??",
        order: " order by d_date desc,channel_name",
        selectAllBack: " limit ?,?",
        getCount: "select count(*) as count from ??",
        getCountD: "select count(distinct channel_name) as count from ??",
        update:
          "update ?? set day_consumption=?,payuser_cost=?,modifier=? where d_date=?",
        getOnlineNumber:
          "select time_interval, online_num from ?? where d_date=?",
        selectALLSUM:
          "select ? as d_date,channel_name,null day_consumption,sum(login_num) as login_num,sum(register_num) as register_num,sum(user_device_num) as user_device_num,sum(recharge_user_num) as recharge_user_num,sum(recharge_drnum) as recharge_drnum,sum(recharge_user_num)/sum(login_device_num) as recharge_user_rate,sum(recharge_drnum)/sum(user_device_num) as new_recharge_rate,sum(recharge_user_amt) as recharge_money,sum(recharge_user_amt)/sum(recharge_user_num) as avg_recharge_money,sum(recharge_dramt) as recharge_dramt,sum(recharge_dramt)/sum(recharge_all) as register_recharge_rate,null payuser_cost from ??",
        groupBy: " group by channel_name",
        groupByD: " group by d_date,channel_id,channel_name",
        selectAllExcel:
          'select d_date as "日期",channel_name as "渠道名称",day_consumption as "当日消耗(元)",login_num as "登录人数",register_num as "注册数",user_device_num as "注册设备数",recharge_user_num as "每日充值用户人数",recharge_drnum as "注册新用户当日充值人数",recharge_user_rate as "充值用户转化率",recharge_drnum/user_device_num as "新用户当日充值率", recharge_money as "充值总金额(元)",avg_recharge_money as "平均用户充值金额(元)",recharge_dramt as "注册新用户当日充值金额(元)",register_recharge_rate as "当日注册用户充值金额占比",payuser_cost as "付费用户成本(元)" from ??',
        selectALLSUMExcel:
          'select ? as "日期",channel_name as "渠道名称",null "当日消耗(元)",sum(login_num) as "登录人数",sum(register_num) as "注册数",sum(user_device_num) as "注册设备数",sum(recharge_user_num) as "每日充值用户人数",sum(recharge_drnum) as "注册新用户当日充值人数",sum(recharge_user_num)/sum(register_num) as "充值用户转化率",sum(recharge_drnum)/sum(user_device_num) as "新用户当日充值率",sum(recharge_user_amt) as "充值总金额(元)",sum(recharge_user_amt)/sum(recharge_user_num) as "平均用户充值金额(元)",sum(recharge_dramt) as "注册新用户当日充值金额(元)",sum(recharge_dramt)/sum(recharge_all) as "当日注册用户充值金额占比",null "付费用户成本(元)" from ??',
        getSelectOptions: "select channel_name from ?? group by channel_name"
      },
      promotionStatisticsQEClassify: {
        selectAll:
          'select d_date,login_num,channel_name,day_consumption,register_num,user_device_num,recharge_user_num,recharge_user_rate,sum(recharge_drnum)/sum(user_device_num) as new_recharge_rate,recharge_money,avg_recharge_money,register_recharge_rate,payuser_cost,recharge_dramt,recharge_drnum,modified_time from ?? where ',
        order: " order by d_date desc,channel_name",
        selectChannelName: 'select channel_name from ?? where user_name = ?',
        selectAllBack: " limit ?,?",
        getCount: 'select count(*) as count from ?? where ',
        getCountD:
          'select count(distinct channel_name) as count from ?? where ',
        update:
          "update ?? set day_consumption=?,payuser_cost=?,modifier=? where d_date=?",
        getOnlineNumber:
          "select time_interval, online_num from ?? where d_date=?",
        selectALLSUM:
          'select ? as d_date,channel_name,null day_consumption,sum(login_num) as login_num,sum(register_num) as register_num,sum(user_device_num) as user_device_num,sum(recharge_user_num) as recharge_user_num,sum(recharge_drnum) as recharge_drnum,sum(recharge_user_num)/sum(login_device_num) as recharge_user_rate,sum(recharge_drnum)/sum(user_device_num) as new_recharge_rate,sum(recharge_user_amt) as recharge_money,sum(recharge_user_amt)/sum(recharge_user_num) as avg_recharge_money,sum(recharge_dramt) as recharge_dramt,sum(recharge_dramt)/sum(recharge_all) as register_recharge_rate,null payuser_cost from ?? where ',
        groupBy: " group by channel_name",
        groupByD: " group by d_date,channel_id,channel_name",
        selectAllExcel:
          'select d_date as "日期",channel_name as "渠道名称",day_consumption as "当日消耗(元)",login_num as "登录人数",register_num as "注册数",user_device_num as "注册设备数",recharge_user_num as "每日充值用户人数",recharge_drnum as "注册新用户当日充值人数",recharge_user_rate as "充值用户转化率",recharge_drnum/user_device_num as "新用户当日充值率", recharge_money as "充值总金额(元)",avg_recharge_money as "平均用户充值金额(元)",recharge_dramt as "注册新用户当日充值金额(元)",register_recharge_rate as "当日注册用户充值金额占比",payuser_cost as "付费用户成本(元)" from ?? where ',
        selectALLSUMExcel:
          'select ? as "日期",channel_name as "渠道名称",null "当日消耗(元)",sum(login_num) as "登录人数",sum(register_num) as "注册数",sum(user_device_num) as "注册设备数",sum(recharge_user_num) as "每日充值用户人数",sum(recharge_drnum) as "注册新用户当日充值人数",sum(recharge_user_num)/sum(register_num) as "充值用户转化率",sum(recharge_drnum)/sum(user_device_num) as "新用户当日充值率",sum(recharge_user_amt) as "充值总金额(元)",sum(recharge_user_amt)/sum(recharge_user_num) as "平均用户充值金额(元)",sum(recharge_dramt) as "注册新用户当日充值金额(元)",sum(recharge_dramt)/sum(recharge_all) as "当日注册用户充值金额占比",null "付费用户成本(元)" from ?? where '
      },
      userRechargeIntervalAnalysis: {
        selectAll: "select * from ??",
        order: " order by d_date desc,seq",
        selectAllBack: " limit ?,?",
        getCount: "select count(*) as count from ??",
        selectAllExcel:
          'select d_date as "日期",money_amount as "用户充值金额(元)",first2second_time as "首次到二次充值时间间隔",second2third_time as "二次到三次充值时间间隔",last2_time as "近两次充值间隔",avg_days7_recharge as "7日内平均充值次数",avg_money as "平均充值金额(元)",avg_coin as "平均充值币" from ??'
      },
      userRechargeIntervalAnalysisWeekly: {
        selectAll: "select * from ??",
        order: " order by d_year desc,d_date desc,seq",
        selectAllBack: " limit ?,?",
        getCount: "select count(*) as count from ??",
        selectAllExcel:
          'select d_year as "年份",d_date as "日期",money_amount as "用户充值金额(元)",first2second_time as "首次到二次充值时间间隔",second2third_time as "二次到三次充值时间间隔",last2_time as "近两次充值间隔",recharge as "充值次数",avg_money as "平均充值金额(元)",avg_coin as "平均充值币" from ??'
      },
      userRechargeTimeAnalysis: {
        selectAll: "select * from ??",
        order: " order by d_date desc",
        selectAllBack: " limit ?,?",
        getOnlineNumber: "select d_hour, recharge_num from ?? where d_date=?"
      }
    },
    buriaPointAnalysis: {
      torechargePVUV: {
        selectDayFront:
          "select d_date,channel_name,residencetime,pv,uv,modified_time,clickelement from ??",
        getCount: "select count(*) as count from ??",
        order: " order by d_date desc,clickelement",
        limit: " limit ?,?",
        selectAllExcel:
          'select d_date as "日期",clickelement as "充值操作",pv as "点击量",uv as "用户数", residencetime as "停留时间" from ??',
        selectDayFrontSUM:
          "select ? as d_date,clickelement,sum(pv) as pv,sum(uv) as uv,sum(residencetime) as residencetime,max(modified_time) as modified_time from ?? ",
        selectAllExcelSUM:
          'select ? as 日期,clickelement as "充值操作",sum(pv) as "点击量",sum(uv) as "用户数",sum(residencetime) as "停留时间" from ?? ',
        groupBy: " group by clickelement"
      },
      roomPVUV: {
        selectDayFront:
          "select d_date,room_name,room_pv,avg_room_times,modified_time from ??",
        getCount: "select count(*) as count from ??",
        getCountD: "select count(distinct room_id) as count from ??",
        order: " order by d_date desc,room_id",
        limit: " limit ?,?",
        selectAllExcel:
          'select d_date as "日期", room_name as "各房间名称",room_pv as " 各房间点击数",avg_room_times as "各房间人均停留时间(上机&排队&观看)" from ??',
        selectDayFrontSUM:
          "select ? as d_date,room_name,sum(room_pv) as room_pv,sum(avg_room_times) as avg_room_times,max(modified_time) as modified_time from ?? ",
        selectAllExcelSUM:
          'select ? as "日期",room_name as "各房间名称",sum(room_pv) as " 各房间点击数",sum(avg_room_times) as avg_room_times,max(avg_room_times) as "各房间人均停留时间(上机&排队&观看)" from ?? ',
        groupBy: " group by room_id"
      },
      arbitraryGatePVUV: {
        selectDayFront:
          "select d_date,pv,uv,discount_amount,discount_using,modified_time from ??",
        getCount: "select count(*) as count from ??",
        order: " order by d_date desc",
        limit: " limit ?,?",
        selectAllExcel:
          'select d_date as "日期",pv as "任意门点击量",uv as "任意门用户数", discount_amount as "折扣次数(5折/免费)赠送量", discount_using as "折扣次数(5折/免费)使用量" from ??',
        selectDayFrontSUM:
          "select ? as d_date,name,sum(pv) as pv,sum(uv) as uv,sum(discount_amount) as discount_amount,sum(discount_using) as discount_using,max(modified_time) as modified_time from ??",
        selectAllExcelSUM:
          'select ? as "日期",sum(pv) as "任意门点击量",sum(uv) as "任意门用户数",sum(discount_amount) as "折扣次数(5折/免费)赠送量",sum(discount_using) as "折扣次数(5折/免费)使用量" from ?? '
      },
      bannerPVUV: {
        selectDayFront:
          "select d_date,url,banner_name,pv,uv,banner_times,modified_time from ??",
        getCount: "select count(*) as count from ??",
        getCountD: "select count(distinct banner_name) as count from ??",
        order: " order by d_date desc, banner_name",
        limit: " limit ?,?",
        selectAllExcel:
          'select d_date as "日期", url as "网址", banner_name as "banner图名称",pv as "各个banner图点击量",uv as "各个banner图用户数", banner_times as "各banner详情停留时间" from ??',
        selectDayFrontSUM:
          "select ? as d_date,banner_name,sum(pv) as pv,sum(uv) as uv,sum(banner_times) as banner_times,max(modified_time) as modified_time, max(url) as url from ??",
        selectAllExcelSUM:
          'select ? as "日期",max(url) as "网址", banner_name as "banner图名称",sum(pv) as "各个banner图点击量",sum(uv) as "各个banner图用户数",sum(banner_times) as "各banner详情停留时间" from ??',
        groupBy: "group by banner_name"
      },
      exchangePVUV: {
        selectDayFront:
          "select d_date,product_name,pv,uv,modified_time from ??",
        getCount: "select count(*) as count from ??",
        getCountD: "select count(distinct product_id) as count from ??",
        order: " order by d_date desc,product_id",
        limit: " limit ?,?",
        selectAllExcel:
          'select d_date as "日期", product_name as "各兑换产品名称",pv as "各兑换按钮点击量",uv as "各兑换按钮用户量" from ??',
        selectDayFrontSUM:
          "select ? as d_date,product_name,sum(pv) as pv,sum(uv) as uv,sum(exchange_times) as exchange_times,max(modified_time) as modified_time  from ??",
        selectAllExcelSUM:
          'select ? as "日期",product_name as "各兑换产品名称",sum(pv) as "各兑换按钮点击量",sum(uv) as "各兑换按钮用户量",sum(exchange_times) as 各个兑换详情页停留时间 from ??',
        groupBy: "group by product_id"
      },
      level1Room: {
        selectDayFront:
          "select d_date,new_num,L1_new_num,L1_suss_new_num,L1_suss_recharge_num,L1_suss_recharge_rate from ??",
        getCount: "select count(*) as count from ??",
        order: " order by d_date desc",
        limit: " limit ?,?",
        selectAllExcel:
          'select d_date as "日期", new_num as "新用户数",L1_new_num as "1级房抓取新用户",L1_suss_new_num as "1级房抓中的新用户", L1_suss_recharge_num as "1级房抓中后充值的新用户",L1_suss_recharge_rate as "1级房抓中用户充值转化率" from ??',
        selectDayFrontSUM:
          "select ? as d_date, sum(new_num) as new_num,sum(L1_new_num) as L1_new_num,sum(L1_suss_new_num) as L1_suss_new_num,sum(L1_suss_recharge_num) as L1_suss_recharge_num,sum(L1_suss_recharge_num)/sum(L1_suss_new_num) as L1_suss_recharge_rate from ??",
        selectAllExcelSUM:
          'select ? as "日期", sum(new_num) as "新用户数",sum(L1_new_num) as "1级房抓取新用户",sum(L1_suss_new_num) as "1级房抓中的新用户", sum(L1_suss_recharge_num) as "1级房抓中后充值的新用户",sum(L1_suss_recharge_num)/sum(L1_suss_new_num) as "1级房抓中用户充值转化率" from ??'
      },
      rechargeActivities: {
        selectDayFront: "select d_date,rid,title,pv,uv,modified_time from ??",
        getCount: "select count(*) as count from ??",
        order: " order by d_date desc",
        limit: " limit ?,?",
        selectAllExcel:
          'select d_date as "日期", rid as "充值活动ID",title as "充值活动名称",pv as "点击量", uv as "用户数" from ??'
      },
      operatingWindow: {
        selectDayFront:
          "select d_date,did,title,url,pv,uv,modified_time from ??",
        getCount: "select count(*) as count from ??",
        order: " order by d_date desc",
        limit: " limit ?,?",
        selectAllExcel:
          'select d_date as "日期", did as "运营活动ID",title as "运营弹窗名称",url as "网址",pv as "点击量", uv as "用户数" from ??'
      },
      treasureBox: {
        selectDayFront:
          "select d_date,bid,name,click_element,pv,uv,modified_time from ??",
        getCount: "select count(*) as count from ??",
        order: " order by d_date desc",
        limit: " limit ?,?",
        selectAllExcel:
          'select d_date as "日期", bid as "宝箱ID",name as "宝箱名称",click_element as "点击操作",pv as "点击量", uv as "用户数" from ??'
      }
    }
  },
  auction: {
    market: {
      newChannelView: {
        selectAll: "select * from ??",
        order: " order by create_time desc",
        selectAllBack: " limit ?,?",
        getCount: "select count(*) as count from ??",
        selectAllExcel:
          'select channel_name as "渠道名称",channel_id as "渠道编码",fz_person as "负责人",dj_person as "对接人",contact_info as "联系方式",contact_mailbox as "联系邮箱",Province as "省份",city as "城市",region as "地区",cooperation as "合作方式",cooperation_name as "合作方式描述",settleprice as "结算单价(元)",Extension_link as "推广链接",General_code as "推广二维码",start_time as "开始时间",end_time as "结束时间" from ??'
      },
      promotionEffectStatistics: {
        selectAll:
          "select * from ?? t LEFT JOIN ?? t1 ON t.d_date = t1.d_date and t.channel_name = t1.channel_name",
        order: " order by t.d_date desc",
        selectAllBack: " limit ?,?",
        getCount:
          "select count(*) as count from ?? t LEFT JOIN ?? t1 ON t.d_date = t1.d_date and t.channel_name = t1.channel_name",
        selectAllExcel:
          'select t.d_date as "日期",t.channel_name as "渠道名称",t.Settlement_price as "结算单价(元)",t.channel_consumption as "渠道消耗(元)",t1.Settlement_price_h as "结算单价-补录(元)",t1.channel_consumption_h as "渠道消耗-补录(元)",channel_pv as "PV",channel_uv as "UV",registration_num as "注册数",uv_Conversionrate as "UV转化率",reg_Conversionrate as "注册转化率",nusercharge_num as "新用户充值人数",nusercharge_amt as "新用户充值金额(元)",nusercharge_rate as "新用户充值率",nusercharge_avg as "新用户充值均值(元)",ousercharge_num as "老用户充值人数",ousercharge_amt as "老用户充值金额(元)",ousercharge_avg as "老用户充值均值(元)",bid_cnt as "竞拍出价总次数",bidperson_cnt as "参与竞拍人数",avgbidperson_cnt as "人均竞拍次数",bid_total as "竞拍总出价额(元)",avgbidperson_amt as "竞拍人均出价额(元)",zcoin_amt as "赠币消耗总额(个)",hcoin_amt as "开心币消耗总额(个)",zp_total_cnt as "中拍总次数",zpperson_cnt as "中拍人数",zpbuy_amt as "中拍购买总额(元)",zpbuy_rate as "中拍购买率",zpfail_cnt as "中拍未付失效单数",Invalid_rate as "失效率",dpurchase_cnt as "差价购买数",dpurchase_amt as "差价购买额(元)",dpurchase_rate as "差价购买率",cpurchase_amt as "商品购买总额(元)",nuser_recharge_cost as "新用户充值成本(元)",auser_recharge_cost as "总用户充值成本(元)",Unit_Maori as "单位毛利(元)",total_maori as "总毛利(元)" from ?? t LEFT JOIN ?? t1 ON t.d_date = t1.d_date and t.channel_name = t1.channel_name',
        upadte:
          "update ?? set Settlement_price_h=?, channel_consumption_h=? where d_date=? and channel_name=?"
      },
      dailyPromotionEffectStatistics: {
        selectAll: "select * from ??",
        order: " order by d_date desc",
        selectAllBack: " limit ?,?",
        getCount: "select count(*) as count from ??",
        selectAllExcel:
          'select d_date as "日期",channel_consumption as "渠道消耗(元)",channel_pv as "PV",channel_uv as "UV",registration_num as "注册数",uv_Conversionrate as "UV转化率",reg_Conversionrate as "注册转化率",nusercharge_num as "新用户充值人数",nusercharge_amt as "新用户充值金额(元)",nusercharge_rate as "新用户充值率",nusercharge_avg as "新用户充值均值(元)",ousercharge_num as "老用户充值人数",ousercharge_amt as "老用户充值金额(元)",ousercharge_avg as "老用户充值均值(元)",bid_cnt as "竞拍出价总次数",bidperson_cnt as "参与竞拍人数",avgbidperson_cnt as "人均竞拍次数",bid_total as "竞拍总出价额(元)",avgbidperson_amt as "竞拍人均出价额(元)",zcoin_amt as "赠币消耗总额(个)",hcoin_amt as "开心币消耗总额(个)",zp_total_cnt as "中拍总次数",zpperson_cnt as "中拍人数",zpbuy_amt as "中拍购买总额(元)",zpbuy_rate as "中拍购买率",zpfail_cnt as "中拍未付失效单数",Invalid_rate as "失效率",dpurchase_cnt as "差价购买数",dpurchase_amt as "差价购买额(元)",dpurchase_rate as "差价购买率",cpurchase_amt as "商品购买总额(元)",nuser_recharge_cost as "新用户充值成本(元)",auser_recharge_cost as "总用户充值成本(元)",Unit_Maori as "单位毛利(元)",total_maori as "总毛利(元)" from ??'
      },
      promotionChannelStatisticsWeekly: {
        selectAll: "select * from ??",
        order: " order by d_date desc",
        selectAllBack: " limit ?,?",
        getCount: "select count(*) as count from ??",
        selectAllExcel:
          'select d_date as "日期",channel_name as "渠道名称",channel_consumption as "渠道消耗(元)",channel_pv as "PV",channel_uv as "UV",registration_num as "注册数",uv_Conversionrate as "UV转化率",reg_Conversionrate as "注册转化率",nusercharge_num as "新用户充值人数",nusercharge_amt as "新用户充值金额(元)",nusercharge_rate as "新用户充值率",nusercharge_avg as "新用户充值均值(元)",ousercharge_num as "老用户充值人数",ousercharge_amt as "老用户充值金额(元)",ousercharge_avg as "老用户充值均值(元)",bid_cnt as "竞拍出价总次数",bidperson_cnt as "参与竞拍人数",avgbidperson_cnt as "人均竞拍次数",bid_total as "竞拍总出价额(元)",avgbidperson_amt as "竞拍人均出价额(元)",zcoin_amt as "赠币消耗总额(个)",hcoin_amt as "开心币消耗总额(个)",zp_total_cnt as "中拍总次数",zpperson_cnt as "中拍人数",zpbuy_amt as "中拍购买总额(元)",zpbuy_rate as "中拍购买率",zpfail_cnt as "中拍未付失效单数",Invalid_rate as "失效率",dpurchase_cnt as "差价购买数",dpurchase_amt as "差价购买额(元)",dpurchase_rate as "差价购买率",cpurchase_amt as "商品购买总额(元)",nuser_recharge_cost as "新用户充值成本(元)",auser_recharge_cost as "总用户充值成本(元)",Unit_Maori as "单位毛利(元)",total_maori as "总毛利(元)" from ??'
      },
      channelDODData: {
        selectAll: "select * from ??",
        order: " order by d_date desc",
        selectAllBack: " limit ?,?",
        getCount: "select count(*) as count from ??"
      },
      channelWOWData: {
        selectAll: "select * from ??",
        order: " order by d_date desc",
        selectAllBack: " limit ?,?",
        getCount: "select count(*) as count from ??"
      },
      channelMOMData: {
        selectAll: "select * from ??",
        order: " order by d_date desc",
        selectAllBack: " limit ?,?",
        getCount: "select count(*) as count from ??"
      },
      channelQOQData: {
        selectAll: "select * from ??",
        order: " order by d_date desc",
        selectAllBack: " limit ?,?",
        getCount: "select count(*) as count from ??"
      },
      channelYOYData: {
        selectAll: "select * from ??",
        order: " order by d_date desc",
        selectAllBack: " limit ?,?",
        getCount: "select count(*) as count from ??"
      },
      channelUserActivity: {
        selectAll: "select * from ??",
        order: " order by d_date desc",
        selectAllBack: " limit ?,?",
        getCount: "select count(*) as count from ??",
        selectAllExcel:
          'select d_date as "日期",channel_name as "渠道名称",coupon_num as "优惠券使用数",login_cnt as "登录次数",prelogin_cnt as "人均登录次数",opage_cnt as "打开页面数",preopage_cnt as "打开页面数均值",online_time as "在线时长",preonline_time as "平均在线时长",Acceptinuser_num as "接受邀请用户数",initiatinuser_num as "发起邀请用户数",preinfriend_num as "邀请好友数均值" from ??'
      },
      marketView: {
        userAreaRatio:
          "select city_name,city_ratio from ?? order by city_ratio desc limit 10",
        userAreaRecharge:
          "select city_name,Recharge_amt from ?? order by Recharge_amt desc limit 10",
        selectAll: 'select * from ?? where d_date=date_format(now(),"%Y-%m-%d")'
      }
    },
    operate: {
      orderInfo: {
        selectAll: "select * from ??",
        selectAllBack: " limit ?,?",
        orderBy: " order by order_create_time desc",
        getCount: "select count(*) as count from ??",
        selectAllExcel:
          'select order_id as "订单号",auction_no as "商品期数",product_name as "商品名称",order_amount as "订单成交金额(元)",total_bid_count as "订单出价总次数",person_count as "订单出价总人数",avg_bid_count as "总人均出价次数",final_price as "订单成交真实金额(元)",valid_bid_count as "订单出价真实次数",valid_person_count as "订单出价真实人数",avg_valid_bid_count as "真实人均出价次数",user_type as "是否特权用户订单",order_status as "支付状态",order_type as "订单类型",win_user_id as "用户id",win_user_desc as "用户名",order_create_time as "订单时间",varchar1 as "是否晒单" from ??'
      },
      userInfo: {
        selectAll: "select * from ??",
        selectAllBack: " limit ?,?",
        orderBy: " order by add_time desc",
        getCount: "select count(*) as count from ??",
        selectAllExcel:
          'select user_id as "用户id",real_name as "用户名",province_name as "所在省",city_name as "所在市",add_time as "注册时间",first_recharge_time as "首充时间",recharge_count as "充值次数",first_recharge_money as "首充金额(元)",recharge_money as "充值总额(元)",coin1 as "拍币余额(个)",coin2 as "赠币余额(个)",coin4 as "开心币余额(个)",coin3 as "积分余额(个)",collect_count as "收藏商品数",auction_count as "竞拍次数",bid_count as "出价次数",win_count as "中拍次数",win_money as "拍中应支付金额(元)",win_product_price as "拍中商品价值金额(元)",win_npay_count as "拍中未付单数量",win_npay_money as "拍中未付单金额(元)",last_login_time as "最后登录时间",last_recharge_times as "末次充值间隔(天)" from ??'
      },
      pagePVUV: {
        selectAll: "select * from ??",
        order: " order by d_date desc",
        selectAllBack: " limit ?,?",
        getCount: "select count(*) as count from ??",
        selectAllExcel:
          'select d_date as "日期",url as "页面地址",page_type as "页面归类",uv as "真实页面UV",pv as "真实页面PV",avg_residence_time as "真实用户人均停留时长" from ??'
      },
      auctionRecord: {
        selectAll: "select * from ??",
        selectAllBack: " limit ?,?",
        orderBy: " order by bid_time desc",
        getCount: "select count(*) as count from ??",
        selectAllExcel:
          'select bid_detail_id as "竞拍明细id",product_id as "商品id",product_name as "商品名称",auction_no as "竞拍期号",province_name as "所在省",city_name as "所在市",user_id as "用户id",user_name as "用户名",bid_price as "出价记录",bid_time as "出价时间" from ??'
      },
      integralRecord: {
        selectAll: "select * from ??",
        selectAllBack: " limit ?,?",
        orderBy: " order by happen_time desc",
        getCount: "select count(*) as count from ??",
        selectAllExcel:
          'select account_id as "账户记录id",user_id as "用户id",user_name as "用户名",transaction_type as "交易类型",transaction_tag as "积分行为",transaction_coin as "积分记录",happen_time as "行为时间" from ??'
      },
      rechargeRecord: {
        selectAll: "select * from ??",
        selectAllBack: " limit ?,?",
        orderBy: " order by user_id desc,recharge_status ,recharge_no",
        getCount: "select count(*) as count from ??",
        selectAllExcel:
          'select user_id as "用户id",user_name as "用户名",recharge_no as "充值序号",recharge_money as "充值金额(元)",recharge_coin as "充值拍币数",recharge_time as "充值时间",recharge_status as "充值状态" from ??'
      },
      trafficStatistics: {
        selectAll: "select * from ??",
        selectAllBack: " limit ?,?",
        orderBy: " order by d_date desc",
        getCount: "select count(*) as count from ??",
        selectAllExcel:
          'select d_date as "日期",visited_page as "被访页面",vpage_type as "页面类别",last_page as "来路页面",lpage_type as "来路页面归类",visited_uv as "被访页面UV",visited_pv as "被访页面PV",last_uv as "来路UV",last_pv as "来路PV" from ??'
      },
      elementPVUV: {
        selectAll: "select * from ??",
        selectAllBack: " limit ?,?",
        orderBy: " order by d_date desc",
        getCount: "select count(*) as count from ??",
        selectAllExcel:
          'select d_date as "日期",page_name as "元素所在页面",element as "元素名称",pv as "点击次数",uv as "点击人数" from ??'
      },
      userBrowsingBehavior: {
        selectAll: "select * from ??",
        selectAllBack: " limit ?,?",
        orderBy: " order by open_time desc",
        getCount: "select count(*) as count from ??",
        selectAllExcel:
          'select user_id as "用户id",user_name as "用户名",page_name as "访问页面",page_type as "页面类型",staytimes as "停留时长",open_time as "打开时间" from ??'
      },
      operateView: {
        dailyNewUser:
          'select date_format(d_date,"%m.%d"), dregister_num from ?? where d_date>=?',
        orderBy: " order by d_date asc",
        orderByWeek: " order by d_week asc",
        orderByMonth: " order by d_month asc",
        incomeDetail:
          'select date_format(d_date,"%m.%d"),drecharge_amt,dfrecharge_amt,dcoin1_consumption,dprofit from ?? where d_date>=date_sub(date_format(now(),"%Y-%m-%d"),interval 7 day)',
        incomeDetailByWeek:
          'select concat(concat(date_format(subdate(d_date,if(date_format(d_date,"%w")=0,7,date_format(d_date,"%w"))-1),"%m.%d")," - "),date_format(subdate(d_date,if(date_format(d_date,"%w")=0,7,date_format(d_date,"%w"))-7),"%m.%d")) as d_week,sum(dfrecharge_amt) as dfrecharge_amt,sum(drecharge_amt) as drecharge_amt,sum(dcoin1_consumption) as dcoin1_consumption,sum(dprofit) as dprofit from ?? where d_date>=date_sub(date_format(now(),"%Y-%m-%d"),interval 7 week) group by d_week',
        incomeDetailByMonth:
          'select d_month,sum(dfrecharge_amt) as dfrecharge_amt,sum(drecharge_amt) as drecharge_amt,sum(dcoin1_consumption) as dcoin1_consumption,sum(dprofit) as dprofit from ?? where d_date>=date_sub(date_format(now(),"%Y-%m-%d"),interval 7 month) group by d_month',
        activeUser:
          'select date_format(d_date,"%m.%d"), dregister_num from ?? where d_date>=date_sub(date_format(now(),"%Y-%m-%d"),interval 7 day)',
        activeUserByWeek:
          'select concat(concat(date_format(subdate(d_date,if(date_format(d_date,"%w")=0,7,date_format(d_date,"%w"))-1),"%m.%d")," - "),date_format(subdate(d_date,if(date_format(d_date,"%w")=0,7,date_format(d_date,"%w"))-7),"%m.%d")) as d_week,sum(dregister_num) as dregister_num from ?? where d_date>=date_sub(date_format(now(),"%Y-%m-%d"),interval 7 week) group by d_week',
        activeUserByMonth:
          'select d_month,sum(dregister_num) as dregister_num from ?? where d_date>=date_sub(date_format(now(),"%Y-%m-%d"),interval 7 month) group by d_month',
        coin1CancellationDeposit:
          "select period_time,hrecharge_conis,hcoin_consumption from ?? where d_date=?",
        selectAll:
          'select dregister_num,dactive_num,register_num,drecharge_amt,dfrecharge_amt,dcoin1_consumption,dprofit,dreal_order7_num,dreal_order_num,dreal_order7_amt,dreal_order_amt from ?? where d_date=date_format(now(),"%Y-%m-%d")'
      },
      operatingSituation: {
        activeUserTrends:
          'select date_format(d_date,"%m.%d"), dactive_num from ?? where d_date>=date_sub(date_format(now(),"%Y-%m-%d"),interval 30 day)',
        orderBy: " order by d_date asc",
        newRegisteredUser:
          'select date_format(d_date,"%m.%d"), dregister_num from ?? where d_date>=date_sub(date_format(now(),"%Y-%m-%d"),interval 30 day)',
        rechargeConsumption:
          'select date_format(d_date,"%m.%d"), dfrecharge_amt,darecharge_amt,dcoin1_consumption  from ?? where d_date>=date_sub(date_format(now(),"%Y-%m-%d"),interval 30 day)',
        selectAll:
          'select recharge_amt,coin_consumption,order_amt,register_num,recharge_num,drecharge_num from ?? where d_date=date_format(now(),"%Y-%m-%d")',
        conversionFunnel:
          'select d_date,register_num,recharge_num,real_win_num from ?? where d_date=date_format(now(),"%Y-%m-%d")'
      }
    }
  },
  //借款管理
  loanManagement: {
    loanApplicationsList: {
      getCount:
        "select count(*) as count from ?? where status in (0 ,-3, 1 ,-4, 20 ,-5, 22 ,-10, 21, 23, 30,-11,-20, 34)",
      selectAllFront:
        'select out_trade_no, realname, user_phone, case when customer_type = 0 then "新用户" when customer_type = 1 then "老用户" end as customer_type, money_amount, into_money, loan_term, apr, loan_interests, sjloan_urgent_fee,order_time, verify_loan_time,updated_at, case when status = 0 then "待初审" when status =-3 then "初审驳回" when status = 1 then "初审通过" when status =-4 then "复审驳回" when status = 20 then "复审通过,待放款" when status =-5 then "放款驳回" when status = 22 then "放款中" when status =-10 then "放款失败" when status = 21 then "已放款，还款中" when status = 23 then "部分还款" when status = 30 then "已还款" when status = -11 then "已逾期" when status = -20 then "已坏账" when status = 34 then "逾期已还款" end as status from ?? where status in (0 ,-3, 1 ,-4, 20 ,-5, 22 ,-10, 21, 23, 30,-11,-20, 34)',
      selectAllBack: " limit ?,?"
    },
    loanAuditList: {
      getCount:
        "select count(*) as count from ?? where status in ( 20, -5, 22, -10, 21 )",
      selectAllFront:
        'select id, out_trade_no, yurref, realname, user_phone, case when customer_type = 0 then "新用户" when customer_type = 1 then "老用户" end as customer_type, money_amount, loan_term, apr, loan_interests, into_money, order_time, loan_time, loan_end_time, updated_at, case when status=20 then "复审通过,待放款" when status=-5 then "放款驳回" when status=22 then "放款中" when status=-10 then "放款失败" when status=21 then "已放款，还款中" end as states, pay_remark from ?? where status in ( 20, -5, 22, -10, 21 )',
      selectAllBack: " limit ?,?"
    },
    raiseQuotaRecord: {
      getCount: "select count(*) as count from ??",
      selectAllFront:
        'select user_id, realname, user_phone, new_amount_max/100 as new_amount_max, add_amount/100 as add_amount, repayment_succ_count, repayment_norm_count, IFNULL(repayment_succ_amount/100,0) as repayment_succ_amount, IFNULL(repayment_norm_amount/100,0) as repayment_norm_amount, last_apply_at, create_at, updated_at, case when status=0 then "待审核"when status=1 then "审核通过" else "审核失败" end as status, audit_user, remark from ??',
      selectAllBack: " limit ?,?"
    },
    reconciliationFunction: {
      getCount:
        "select count(*) as count from ?? t1 inner join ?? t on t.id=t1.id",
      selectAllFront:
        'select t.out_trade_no, t.yurref, t.realname, t.user_phone, case when t.customer_type = 1 then "老用户" when t.customer_type = 0 then "新用户" end as customer_type, t.money_amount/100 as money_amount, t.into_money/100 as into_money,   t.loan_term as loan_term, t.loan_interests/100 as loan_interests, t.sjloan_urgent_fee/100 as sjloan_urgent_fee,   t.apr, case when t.is_fenqi = 1 then "否" else "是" end as is_fenqi, t.order_time, t.loan_time, t.pay_remark from ?? t1 inner join ?? t on t.id=t1.id',
      selectAllBack: " limit ?,?"
    },
    assetInformation: {
      getCount:
        "select count(*) as count from ?? t inner join ?? t1 on t.asset_order_id=t1.id",
      selectAllFront:
        'select t.asset_order_id, t.realname, t.user_phone, case when t.customer_type = 1 then "老用户" when t.customer_type = 0 then "新用户" end as customer_type, t.money_amount/100 as money_amount, t.loan_term, t.apr, t.loan_interests/100 as loan_interests, t.order_time, t.loan_time, t.updated_at, case when t1.credit_lv=0 then "未知" when t1.credit_lv=1 then "A" when t1.credit_lv=2 then "B" when t1.credit_lv=3 then "C" else "" end as credit_lv, case when t.status = 0 then "待推送" when t.status = 1 then "推送中" when t.status = 2 then "推送成功" when t.status = 3 then "推送失败" end as status, t1.pay_remark from ?? t inner join ?? t1 on t.asset_order_id=t1.id',
      selectAllBack: " limit ?,?"
    }
  },
  /*还款管理*/
  //还款列表  待还列表
  repaymentManagement: {
    waitingForReturnList: {
      getCount:
        "select count(*) as count from ?? t inner join ?? t1 on t.user_id=t1.id where t.status in (21,23,-11,-20)",
      selectAllFront:
        'select t1.realname, t1.user_phone, case when t1.customer_type =0 then "新用户" else "老用户" end as customer_type, t.repayment_principal/100 as repayment_principal, t.repayment_interest/100 as repayment_interest, t.repayment_amount/100 as repayment_amount, t.repaymented_amount/100 as repaymented_amount, t.credit_repayment_time, t.repayment_time, t.late_day, case when t.status=21 then "已放款/待还款" when t.status=23 then "部分还款" when t.status=-11 then "已逾期" when t.status=-20 then "已坏账" end as status, case when t.is_fenqi = 2 then "是" else "否" end as is_fenqi from ?? t inner join ?? t1 on t.user_id=t1.id where t.status in (21,23,-11,-20)',
      selectAllBack: " limit ?,?"
    },
    //还款列表  已还列表
    returnedList: {
      getCount:
        "select count(*) as count from ?? t inner join ?? t1 on t.user_id=t1.id where (t.status in (30,34))",
      selectAllFront:
        'select t.id, t1.realname, t1.user_phone, case when t1.customer_type = 0 then "新用户" when t1.customer_type = 1 then "老用户" end as customer_type, t.repayment_principal/100 as repayment_principal, t.repayment_principal/100 as repayment_principal, t.repayment_interest/100 as repayment_interest, t.repayment_amount/100 as repayment_amount, t.repaymented_amount/100 as repaymented_amount, t.credit_repayment_time, t.repayment_real_time, t.repayment_time, case when t.status=30 then "正常已还款" else "逾期已还款" end as status, case when t.is_fenqi=2 then "是" else "否" end as is_fenqi from ?? t inner join ?? t1 on t.user_id=t1.id where (t.status in (30,34))',
      selectAllBack: " limit ?,?"
    },
    //对账列表  还款对账
    repaymentReconciliation: {
      getCount:
        "select count(*) as count from ?? t inner join ?? t1 on t.user_id=t1.id inner join ?? t2 on t.user_id =t2.user_id where (t.status in (30,34,21,23,-11,-20))",
      selectAllFront:
        'select t.user_id, t2.order_id, t.id, t1.realname, t1.user_phone, t.money_amount/100 as money_amount,   t.repayment_principal/100 as repayment_principal, t.repayment_amount/100 as repayment_amount, t.repaymented_amount/100 as repaymented_amount, t2.true_repayment_money/100 as true_repayment_money, ifnull(t2.return_money/100,0) as return_money, case when t2.repayment_type=1 then "支付宝" when t2.repayment_type=2 then "富友" when t2.repayment_type=3 then "连连" when t2.repayment_type=4 then "连连代扣服务费" when t2.repayment_type=5 then "对公银行卡转账" when t2.repayment_type=6 then "减免" when t2.repayment_type=7 then "线下还款" when t2.repayment_type=8 then "益码通支付宝" when t2.repayment_type=9 then "借款优惠服务费" end as repayment_type, case when t.status=30 then "已还款" when t.status=21 then "已放款，还款中" when t.status=23 then "部分还款" when t.status=-11 then "已逾期" when t.status=-20 then "已坏账" when t.status=34 then "逾期已还款" end as conditions, case when t2.status=0 then "等待"when t2.status=1 then "失败" when t2.status=2 then "成功" end as status, t.repayment_time from ?? t inner join ?? t1 on t.user_id=t1.id inner join ?? t2 on t.user_id =t2.user_id where (t.status in (30,34,21,23,-11,-20))',
      selectAllBack: " limit ?,?"
    },
    //对账列表  续期对账
    renewalReconciliation: {
      getCount:
        "select count(*) as count from ?? t inner join ?? t1 on t.user_id=t1.id inner join ?? t2 on t.asset_repayment_id=t2.id where t.status=1 and t.ts_status in (0,1)",
      selectAllFront:
        'select t.user_id, t1.realname, t1.user_phone, t.asset_repayment_id, t.order_id, t2.repayment_amount/100 as repayment_amount, t2.repaymented_amount/100 as repaymented_amount, t2.repayment_interest/100 as repayment_interest,   t.renewal_day, (t.loan_urgent_fee+t.plan_late_fee+t.loan_accrual+t.repayment_interest+t.renewal_fee)/100 as reback_count,   t.return_money/100 as return_money, t.old_repayment_time, t.repayment_time, case when t.renewal_type =1 then "富友" when t.renewal_type =2 then "支付宝" when t.renewal_type =3 then "连连" when t.renewal_type =4 then "益码通支付宝" end as renewal_type, t.order_time from ?? t inner join ?? t1 on t.user_id=t1.id inner join ?? t2 on t.asset_repayment_id=t2.id where t.status=1 and t.ts_status in (0,1)',
      selectAllBack: " limit ?,?"
    },
    //退款列表  还款详情
    repaymentDetails: {
      getCount:
        "select count(*) as count from ?? t inner join ?? t1 on t.user_id=t1.user_id inner join ?? t2 on t2.id=t.user_id",
      selectAllFront:
        'select t1.id, t1.order_id, t2.realname, t2.user_phone, case when t2.customer_type=0 then "新用户" else "老用户" end as customer_type, t.repayment_principal/100 as repayment_principal, t.repayment_interest/100 as repayment_interest, t.repayment_amount/100 as repayment_amount, t.repaymented_amount/100 as repaymented_amount, t1.true_repayment_money/100 as true_repayment_money, t.credit_repayment_time, t.repayment_time, case when t1.repayment_type=1 then "支付宝" when t1.repayment_type=2 then "富友" when t1.repayment_type=3 then "连连" when t1.repayment_type=4 then "连连代扣服务费" when t1.repayment_type=5 then "对公银行卡转账" when t1.repayment_type=6 then "减免" when t1.repayment_type=7 then "线下还款" when t1.repayment_type=8 then "益码通支付宝" when t1.repayment_type=9 then "借款优惠服务费" else "" end as repayment_type, t.repayment_real_time, t1.order_time from ?? t inner join ?? t1 on t.user_id=t1.user_id inner join ?? t2 on t2.id=t.user_id where (t1.status =2)',
      selectAllBack: " limit ?,?"
    },
    //退款列表  续期详情
    renewalParticulars: {
      getCount:
        "select count(*) as count from ?? t inner join ?? t1 on t.asset_repayment_id = t1.id inner join ?? t2 on t.user_id=t2.id where (t.status=1)",
      selectAllFront:
        'select t.id, t2.realname, t2.user_phone, case when t2.customer_type = 0 then "新用户" else "老用户" end as customer_type, t1.repayment_principal/100 as repayment_principal, t1.repayment_interest/100 as repayment_interest, t.old_repayment_time, t.repayment_time, t1.renewal_count, t.renewal_day, (t.repayment_interest+t.renewal_fee+t.loan_urgent_fee+t.loan_accrual)/100 as renewal_amount,  case when t.renewal_type=1 then "富友" else "支付宝" end as renewal_type, t.order_time, case when t1.status = 0 then "待初审" when t1.status =-3 then "初审驳回" when t1.status = 1 then "初审通过" when t1.status =-4 then "复审驳回"when t1.status = 20 then "复审通过,待放款" when t1.status =-5 then "放款驳回" when t1.status = 22 then "放款中" when t1.status =-10 then "放款失败" when t1.status = 21 then "已放款，还款中" when t1.status = 23 then "部分还款" when t1.status = 30 then "已还款" when t1.status = -11 then "已逾期" when t1.status = -20 then "已坏账" when t1.status = 34 then "逾期已还款" end as status from ?? t inner join ?? t1 on t.asset_repayment_id = t1.id inner join ?? t2 on t.user_id=t2.id where (t.status=1)',
      selectAllBack: " limit ?,?"
    },
    //退款列表  已退列表
    rebackedList: {
      getCount:
        "select count(*) as count from ?? t inner join ?? t1 on t.user_id = t1.id",
      selectAllFront:
        'select t.id, t.return_order_id, t1.realname, t1.user_phone, t.user_id, case when customer_type = 0 then "新用户" else "老用户" end as customer_type, t.repayment_return_money/100 as repayment_return_money, case when t.return_type = 1 then "支付宝" when t.return_type = 2 then "富友" when t.return_type = 3 then "连连" else "" end as return_type, case when t.return_source = 1 then "还款" when t.return_source = 2 then "续期" end as return_source, t.return_time from ?? t inner join ?? t1 on t.user_id = t1.id',
      selectAllBack: " limit ?,?"
    },
    //续期管理  续期列表
    renewalsList: {
      getCount:
        "select count(*) as count from ?? t1 inner join ?? t on t.id = t1.user_id",
      selectAllFront:
        'select t1.order_id, t.realname, t.user_phone, case when t1.renewal_type =1 then "富友" when t1.renewal_type =2 then "支付宝" when t1.renewal_type =3 then "连连" when t1.renewal_type =4 then "益码通支付宝" end as renewal_type, t1.sum_fee/100 as sum_fee, t1.repayment_interest/100 as repayment_interest, t1.renewal_fee/100 as renewal_fee, t1.renewal_day, case when t1.status=0 then "付款中" when t1.status=1 then "付款成功" when t1.status=2 then "付款失败" else "" end as status, t1.repayment_time from ?? t1 inner join ?? t on t.id = t1.user_id',
      selectAllBack: " limit ?,?"
    }
  },
  //数据分析
  dataAnalysis: {
    selectAll: "select * from ??",
    order: " order by d_date desc",
    selectAllBack: " limit ?,?",
    getCount: "select count(*) as count from ??",
    dailyLendingDataExcel:
      'select d_date as "日期",register_num as "注册人数",loan_num as "借款人数",success_loan_num as "成功借款人数",newuser_loan_rate as "新用户借款占比",olduser_loan_rate as "老用户借款占比",accunewuser_loan_rate as "累计新用户借款占比",accuolduser_loan_rate as "累计老用户借款占比",loan_singular as "放款单数",loan_singular_7day as "7天期限放款单数",loan_singular_14day as "14天期限放款单数",loan_singular_21day as "21天期限放款单数",loan_singular_f_21day as "21天分期放款单数",loan_singular_90day as "90天分期放款单数",loan_singular_t_21day as "21天分期提额放款单数",loans_total as "放款总额(元)",loans_total_7day as "7天期限放款总额(元)",loans_total_14day as "14天期限放款总额(元)",loans_total_21day as "21天期限放款总额(元)",loans_total_f_21day as "21天分期放款总额(元)",loans_total_90day as "90天分期放款金额(元)",loans_total_t_21day as "21天分期提额放款金额(元)",loan_singular_ouser as "老用户放款单数",loans_total_ouser as "老用户放款总额(元)",loan_singular_nuser as "新用户放款单数",loans_total_nuser as "新用户放款总额(元)",CHARGEBACK_FAILRATE as "扣款失败率",FULL_AMOUNT_RATE as "满额率",NUSER_FULL_AMOUNT_RATE as "新用户满额率",OUSER_FULL_AMOUNT_RATE as "老用户满额率" from ??',
    overdueRepaymentStatisticsExcel:
      'select d_date as "日期",loan_amount_total as "当前借款总数量",loan_money_total as "当前借款总额(元)",repayment_amount_total as "已经还款总数量",repayment_money_total as "已经还款总额(元)",quantity_overdue as "逾期中数量",total_overdue as "逾期中总额(元)",OVERDUE_AMT_10_A as "逾期十天及以上总金额(元)",OVERDUE_AMT_10_14 as "逾期十天及以上14天金额(元)",OVERDUE_AMT_10_F21 as "逾期十天及以上21天分期金额(元)",m_overdue_rate_s1 as "S1级逾期率(按金额)",m_overdue_rate_s2 as "S2级逾期率(按金额)",m_overdue_rate_s3 as "S3级逾期率(按金额)",m_overdue_rate_m3 as "M3级逾期率(按金额)",n_overdue_rate_s1 as "S1级逾期率(按单数)",n_overdue_rate_s2 as "S2级逾期率(按单数)",n_overdue_rate_s3 as "S3级逾期率(按单数)",n_overdue_rate_m3 as "M3级逾期率(按单数)" from ??',
    fundAnalysisExcel:
      'select d_date as "日期",total_amount as "当日应还总额(元)",actual_repayment_amount as "实际还款金额(元)",repayment_ratio as "还款比例",renewal_amount as "续期金额(元)",renewal_commission as "续期手续费收入(元)",renewal_ratio as "续期比例",overdue_amount as "逾期金额(元)",overdue_proportion as "逾期比例",overdue_payment_amount as "逾期还款金额(元)",late_fees_income as "滞纳金收入(元)",comp_service_income as "综合服务费收入(元)",service_charge as "实收服务费(元)",equal_amount_income as "同等金额收益(元)",capital_surplus as "当日资金盈余(元)" from ??',
    registrationStatisticsReportExcel:
      'select d_date as "日期",register_num as "注册人数",loans_total as "放款总额(元)",loans_total_ouser as "老用户放款总额(元)",loans_total_nuser as "新用户放款总额(元)" from ??',
    platformDataExcel:
      'select d_date as "日期",register_num as "注册人数",realname_auth_num as "实名认证人数",realname_auth_freq as "实名认证次数",realname_fee as "实名费用(元)",operator_auth_num as "运营商认证数",generate_report_num as "生成报告人数",operator_fee as "运营商费用(元)",card_bound_num as "绑卡人数",Sesame_auth_num as "芝麻认证人数",Sesame_auth_fee as "芝麻认证费用(元)",auth_work_num as "认证工作人数",Alipay_auth_num as "支付宝认证人数",total_apply_loan_num as "借款申请总数",total_audit_num as "通过审核总数",Order_through_rate as "订单通过率",total_payloans_amount as "应放款总额(元)",total_succloan_amount as "放款成功总额(元)",succ_loan_num as "放款成功笔数",outstand_num as "未到账笔数",total_failsingular_num as "打款失败总订单数",total_passuser_num as "通过用户总数",passuser_rate as "用户通过率",counter_fraud_num as "反欺诈人数" from ??',
    dailyRepaymentUnitDataExcel:
      'select d_date as "日期",overdue_num as "逾期单数",overdue_rate as "逾期率",repayment_rate as "还款率",overdue_num_7day as "7天期限逾期单数",overdue_rate_7day as "7天期限逾期率",overdue_num_14day as "14天期限逾期单数",overdue_rate_14day as "14天期限逾期率",overdue_rate_ouser as "老用户逾期率",repayment_rate_ouser as "老用户还款率",overdue_rate_nuser as "新用户逾期率",repayment_rate_nuser as "新用户还款率" from ??',
    daysStageStatistics21Excel:
      'select d_date as "到期日",loan_date_f1 as "F1放款日",due_amount_f1 as "F1到期金额(元)",repayment_amount_f1 as "F1还款金额(元)",repayment_rate_f1 as "F1还款率",overdue_rate_f1 as "F1逾期率",overdue_rate_ouser_f1 as "F1老用户逾期率",overdue_rate_nuser_f1 as "F1新用户逾期率",loan_date_f2 as "F2放款日",due_amount_f2 as "F2到期金额(元)",repayment_amount_f2 as "F2还款金额(元)",repayment_rate_f2 as "F2还款率",overdue_rate_f2 as "F2逾期率",overdue_rate_ouser_f2 as "F2老用户逾期率",overdue_rate_nuser_f2 as "F2新用户逾期率",loan_date_f3 as "F3放款日",due_amount_f3 as "F3到期金额(元)",repayment_amount_f3 as "F3还款金额(元)",repayment_rate_f3 as "F3还款率",overdue_rate_f3 as "F3逾期率",overdue_rate_ouser_f3 as "F3老用户逾期率",overdue_rate_nuser_f3 as "F3新用户逾期率" from ??',
    installmentPromotionStatistics21Excel:
      'select d_date as "到期日",loan_date_f1 as "F1放款日",due_amount_f1 as "F1到期金额(元)",repayment_amount_f1 as "F1还款金额(元)",repayment_rate_f1 as "F1还款率",overdue_rate_f1 as "F1逾期率",overdue_rate_ouser_f1 as "F1老用户逾期率",overdue_rate_nuser_f1 as "F1新用户逾期率",loan_date_f2 as "F2放款日",due_amount_f2 as "F2到期金额(元)",repayment_amount_f2 as "F2还款金额(元)",repayment_rate_f2 as "F2还款率",overdue_rate_f2 as "F2逾期率",overdue_rate_ouser_f2 as "F2老用户逾期率",overdue_rate_nuser_f2 as "F2新用户逾期率",loan_date_f3 as "F3放款日",due_amount_f3 as "F3到期金额(元)",repayment_amount_f3 as "F3还款金额(元)",repayment_rate_f3 as "F3还款率",overdue_rate_f3 as "F3逾期率",overdue_rate_ouser_f3 as "F3老用户逾期率",overdue_rate_nuser_f3 as "F3新用户逾期率" from ??',
    daysStageStatistics90Excel:
      'select d_date as "到期日",loan_date_f1 as "F1放款日",due_amount_f1 as "F1到期金额(元)",repayment_amount_f1 as "F1还款金额(元)",repayment_rate_f1 as "F1还款率",overdue_rate_f1 as "F1逾期率",overdue_rate_ouser_f1 as "F1老用户逾期率",overdue_rate_nuser_f1 as "F1新用户逾期率",loan_date_f2 as "F2放款日",due_amount_f2 as "F2到期金额(元)",repayment_amount_f2 as "F2还款金额(元)",repayment_rate_f2 as "F2还款率",overdue_rate_f2 as "F2逾期率",overdue_rate_ouser_f2 as "F2老用户逾期率",overdue_rate_nuser_f2 as "F2新用户逾期率",loan_date_f3 as "F3放款日",due_amount_f3 as "F3到期金额(元)",repayment_amount_f3 as "F3还款金额(元)",repayment_rate_f3 as "F3还款率",overdue_rate_f3 as "F3逾期率",overdue_rate_ouser_f3 as "F3老用户逾期率",overdue_rate_nuser_f3 as "F3新用户逾期率",loan_date_f4 as "F4放款日",due_amount_f4 as "F4到期金额(元)",repayment_amount_f4 as "F4还款金额(元)",repayment_rate_f4 as "F4还款率",overdue_rate_f4 as "F4逾期率",overdue_rate_ouser_f4 as "F4老用户逾期率",overdue_rate_nuser_f4 as "F4新用户逾期率",loan_date_f5 as "F5放款日",due_amount_f5 as "F5到期金额(元)",repayment_amount_f5 as "F5还款金额(元)",repayment_rate_f5 as "F5还款率",overdue_rate_f5 as "F5逾期率",overdue_rate_ouser_f5 as "F5老用户逾期率",overdue_rate_nuser_f5 as "F5新用户逾期率",loan_date_f6 as "F6放款日",due_amount_f6 as "F6到期金额(元)",repayment_amount_f6 as "F6还款金额(元)",repayment_rate_f6 as "F6还款率",overdue_rate_f6 as "F6逾期率",overdue_rate_ouser_f6 as "F6老用户逾期率",overdue_rate_nuser_f6 as "F6新用户逾期率",TOTAL_LOAN_AMOUNT as "累计借款总额(元)",LOANING_AMOUNT as "未到期未还款总额(元)",REPAYMENTED_AMOUNT as "已还总额(元)" from ??',
    dailyRepaymentAmountDataExcel:
      'select d_date as "日期",mature_money as "到期金额(元)",overdue_money as "逾期金额(元)",overdue_rate as "逾期率",repayment_rate as "还款率",overdue_rate_7day as "7天期限逾期率",overdue_rate_14day as "14天期限逾期率",overdue_rate_21day as "21天期限逾期率",mature_money_ouser as "老用户到期金额(元)",overdue_money_ouser as "老用户逾期金额(元)",overdue_rate_ouser as "老用户逾期率",repayment_rate_ouser as "老用户还款率",mature_money_nuser as "新用户到期金额(元)",overdue_money_nuser as "新用户逾期金额(元)",overdue_rate_nuser as "新用户逾期率",repayment_rate_nuser as "新用户还款率" from ??',
    promptAmountExcel:
      'select D_DATE as "日期",OVERDUE_RATE as "当日催回率",COLLECTION_PRINCIPAL_DAY as "当日入催本金(元)",COLLECTION_PRINCIPAL_DOING as "在催本金(元)",COLLECTION_PRINCIPAL_DOING_S1 as "S1在催本金(元)",COLLECTION_PRINCIPAL_DOING_RATE_S1 as "S1在催本金比例",OVERDUE_RATE_S1_F as "S1总和催回率",OVERDUE_RATE_S1_P as "S1当期催回率",COLLECTION_PRINCIPAL_DOING_S2 as "S2在催本金(元)",COLLECTION_PRINCIPAL_DOING_RATE_S2 as "S2在催本金比例",OVERDUE_RATE_S2_F as "S2总和催回率",OVERDUE_RATE_S2_P as "S2当期催回率",COLLECTION_PRINCIPAL_DOING_M2 as "M2在催本金(元)",COLLECTION_PRINCIPAL_DOING_RATE_M2 as "M2在催本金比例",OVERDUE_RATE_M2_F as "M2总和催回率",OVERDUE_RATE_M2_P as "M2当期催回率",COLLECTION_PRINCIPAL_DOING_M3 as "M3在催本金(元)",COLLECTION_PRINCIPAL_DOING_RATE_M3 as "M3在催本金比例",OVERDUE_RATE_M3_F as "M3总和催回率",OVERDUE_RATE_M3_P as "M3当期催回率", COLLECTION_PRINCIPAL_DOING_M3PLUS as "M3+在催本金(元)", COLLECTION_PRINCIPAL_DOING_RATE_M3PLUS as "M3+在催本金比例",OVERDUE_RATE_M3PLUS_F as "M3+总和催回率",OVERDUE_RATE_M3PLUS_P as "M3+当期催回率",COLLECTION_LATE_FEE_DOING as "在催滞纳金",COLLECTION_LATE_FEE_DOING_S1 as "S1在催滞纳金",COLLECTION_LATE_FEE_DOING_S2 as "S2在催滞纳金",COLLECTION_LATE_FEE_DOING_M2 as "M2在催滞纳金",COLLECTION_LATE_FEE_DOING_M3 as "M3在催滞纳金",COLLECTION_LATE_FEE_DOING_M3PLUS as "M3+在催滞纳金" from ??',
    naturalChannelStatisticsExcel:
      'select D_DATE as "日期",REGISTER_NUM as "注册量",ALL_FACT_AUTH_NUM as "全要素认证人数",BLACKLIST_NUM as "黑名单人数",APPLY_LOAN_NUM as "申请借款人数",NUSER_APPLY_SUCC_NUM as "新用户申请成功人数",OUSER_APPLY_SUCC_NUM as "老用户申请成功人数",NUSER_LOAN_RATIO as "新用户借款率",NUSER_ADOPTION_RATE as "新用户通过率",NUSER_LOAN_AMOUNT as "新用户放款金额",OUSER_ADOPTION_RATE as "老用户通过率",OUSER_LOAN_AMOUNT as "老用户放款金额",RATE_FULL as "满额率",LOANED_AMOUNT_AVG as "平均借款金额",OLD_LOANED_CNT_AVG as "老用户平均借款次数",DUE_AMOUNT as "到期金额",PREPAYMENT_BEFORE_RATE as "提前还款率",OVERDUE_AMOUNT as "逾期金额",OVERDUE_RATE as "逾期率",OVER_DUE_RATE_3 as "3日剩余逾期率",OVER_DUE_RATE_10 as "10日剩余逾期率",OVER_DUE_RATE_90 as "坏账率",COLLECTION_PRINCIPAL_DOING as "在催金额",OVER_DUE_REPAYMENTED_AMOUNT as "逾期回款",LATE_FEE_INCOME as "滞纳金收入",OVERDUE_RATE_NUSER_14 as "新用户14天逾期率",OVERDUE_RATE_OUSER_14 as "老用户14天逾期率",OVERDUE_RATE_NUSER_21 as "新用户21天逾期率",OVERDUE_RATE_OUSER_21 as "老用户21天逾期率",OVER_DUE_RATE_3_NUSER_14 as "新用户14天3天剩余逾期率",OVER_DUE_RATE_3_OUSER_14 as "老用户14天3天剩余逾期率",OVER_DUE_RATE_10_NUSER_14 as "新用户14天10天剩余逾期率",OVER_DUE_RATE_10_OUSER_14 as "老用户14天10天剩余逾期率",OVER_DUE_RATE_3_NUSER_21 as "新用户21天3天剩余逾期率", OVER_DUE_RATE_3_OUSER_21 as "老用户21天3天剩余逾期率",OVER_DUE_RATE_10_NUSER_21 as "新用户21天10天剩余逾期率",OVER_DUE_RATE_10_OUSER_21 as "老用户21天10天剩余逾期率" from ??',
    dailyExpenditureDataExcel:
      'select d_date as "日期",ious_activation_num as "激活白条用户数",all_activation_ed as "总激活白条额度",avg_activation_ed as "平均激活白条额度",buyers_num as "购买人数",d_date as "日期",buy_suss_num as "购买成功人数",new_proportion as "新用户占比",old_proportion as "老用户占比",loan_num as "购买单数",new_loan_num as "新用户购买单数",old_loan_num as "老用户购买单数",stages90_loan_num as "90天分期购买单数",loan_money as "购买总额",new_loan_money as "新用户购买总额",old_loan_money as "老用户购买总额",stages90_loan_money as "90天分期购买总额" from ??',
    couponStatisticsExcel:
      'select d_date as "日期",allmq_amt as "总卖券金额",xzmq_amt as "新增卖券金额",allpf_amt as "总赔付金额",xzpf_amt as "新增赔付金额",allhk_amt as "总累加还款金额",xzhk_amt as "新增还款金额", allkm_cnt as "总可买券用户数", xzkm_cnt as "当日新增可买券用户数", allym_cnt as "总已买券用户数", xzym_cnt as "当日新增已买券用户数", allhk_cnt as "总还款并用券用户数", xzhk_cnt as "当日新增还款并用券用户数", rate_1 as "总已买券人数/总可买券人数", rate_2 as "当日已买券人数/总可买券人数",rate_3 as "总还款用券人数/总已买券人数",rate_4 as "当日还款用券人数/总已买券人数",rate_5 as "总还款用券人数/总可买券人数",rate_6 as "当日还款用券人数/总可买券人数" from ??',
    keyDataExcel:
      'select d_date as "日期",due_amt as "当日到期金额(元)",loan_amt as "截止当前借款金额(元)",erepayment_amt as "截止当前提前还款金额(元)",overdue_amt as "逾期中金额(元)",tenover_amt as "逾期十天及以上金额(元)",d_repayment_amt as "当日正常还款金额(元)",d_erepayment_amt as "当日提前还款金额(元)",d_overrepayment_amt as "当日逾期还款金额(元)",d_repaymentrate as "当日还款率" from ??'
  },
  //财务分析
  financeAnalysis: {
    repaymentMinutia: {
      selectAllFront: "select * from ??",
      selectAllLimit: " limit ?,?",
      orderBy: " order by repayment_real_time desc",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select d_date as "日期", user_id as "用户ID", user_name as "借款人姓名", user_phone as "手机号", order_id as "债权ID", loan_id as "还款ID", loan_money as "借款金额", repayment_amount as "总应还款金额", repaymented_amount as "已还金额", repayment_Service as "服务费", loan_urgent_fee as "加急费", Principal_amount as "本金", loan_accrual as "利息", stages_fee as "分期费", renewal_service_fee as "续期服务费", renewal_fee as "续期手续费", Overdue_fine as "逾期滞纳金", coupon_money as "优惠金额", repayment_real_money as "实还金额", return_money as "退款金额", loan_status as "借款状态", repayment_type as "还款方式", repayment_channel as "还款通道", repayment_detail as "还款详情", repayment_status as "还款状态", credit_repayment_time as "放款时间", repayment_time as "应还款时间", repayment_real_time as "实际还款时间", repayment_term as "还款期限", renewal_term as "续期期限", late_day as "逾期天数", service_rate as "基础服务费率", Urgent_rate as "加急费率", Loan_interest_rate as "借款利率", Installment_rate as "分期费率", Renewal_rate as "续期利率", Overdue_rate as "逾期费率",data_type as "数据类型"  from ??'
    },
    reconciliationAnalysis: {
      selectAllFront:
        "SELECT * FROM ?? t LEFT JOIN ?? t1 ON t.d_date = t1.d_date",
      selectAllBack: " limit ?,?",
      orderBy: " order by t.d_date desc",
      getCount: "select count(*) as count from ??",
      upadte:
        "update ?? set AMT_FY_THIRD=?,AMT_FY_DIFF=?,AMT_LL_THIRD=?,AMT_LL_DIFF=?,AMT_ZFB_THIRD=?,AMT_ZFB_DIFF=?,AMT_YMT_THIRD=?,AMT_YMT_DIFF=?,AMT_LKL_THIRD=?,AMT_LKL_DIFF=?,AMT_HLB_THIRD=?,AMT_HLB_DIFF=?,REMARK=? where d_date=?"
    },
    reconciliationAnalysisQE: {
      selectAllFront:
        "SELECT * FROM ?? t LEFT JOIN ?? t1 ON t.d_date = t1.d_date",
      selectAllBack: " limit ?,?",
      orderBy: " order by t.d_date desc",
      getCount: "select count(*) as count from ??",
      upadte:
        "update ?? set Alipay_amt_third=?,Alipay_amt_diff=?,WeChat_amt_third=?,WeChat_amt_diff=?,post_alipay_amt_third=?,post_alipay_amt_diff=?,post_wechat_amt_third=?,post_wechat_amt_diff=?,all_amt_diff =?,remark=? where d_date=?"
    },
    incomeStatementQE: {
      selectAll: "select * from ??",
      order: " order by d_date desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select d_date as "日期",recharge_amt as "充值金额",recharge_cny as "充值产生币(个)",consume_cny as "游戏消耗币(个)",exchange_cny as "兑换游戏币(个)",login_award as "登录奖励(个)",inviting_friend as "邀请好友(个)",freight_deduction as "运费扣除(个)",day_award as "日榜奖励(个)",week_award as "周卡赠送奖励(个)",month_award as "月卡赠送奖励(个)",coin_return as "申诉成功退币(个)",overplus_cny as "剩余币(个)",capture_dolls as "抓中娃娃(个)" from ??'
    },
    penguinSummaryQE: {
      selectAll: "select * from ??",
      order: " order by d_date desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select d_date as "日期",product_id as "商品id",product_name as "商品名称",games_num as "总抓取次数",nograsp_num as "未抓中次数",grasp_num as "抓中次数",send_num as "发货个数",sign_num as "签收次数",combine_num as "合成次数" from ??'
    },
    //  还款日报表统计
    reportStatistics: {
      selectAllFront: "select * from ??",
      selectAllBack: " limit ?,?",
      orderBy: " order by d_date desc",
      getCount: "select count(*) as count from ??"
    },
    //  放款日报表统计
    lendingDaily: {
      selectAllFront: "select * from ??",
      selectAllBack: " limit ?,?",
      orderBy: " order by d_date desc",
      getCount: "select count(*) as count from ??",
      selectSum:
        "select sum(MONEY_AMOUNT_A) as MONEY_AMOUNT_A,sum(MONEY_AMOUNT_B) as MONEY_AMOUNT_B,sum(MONEY_AMOUNT_C) as MONEY_AMOUNT_C,sum(MONEY_AMOUNT_D) as MONEY_AMOUNT_D,sum(MONEY_AMOUNT_O) as MONEY_AMOUNT_O,sum(INTO_MONEY_A) as INTO_MONEY_A,sum(INTO_MONEY_B) as INTO_MONEY_B,sum(INTO_MONEY_C) as INTO_MONEY_C,sum(INTO_MONEY_D) as INTO_MONEY_D,sum(INTO_MONEY_O) as INTO_MONEY_O,sum(TRADE_CNT_A) as TRADE_CNT_A,sum(TRADE_CNT_B) as TRADE_CNT_B,sum(TRADE_CNT_C) as TRADE_CNT_C,sum(TRADE_CNT_D) as TRADE_CNT_D,sum(TRADE_CNT_O) as TRADE_CNT_O,sum(FEE_A) as FEE_A,sum(FEE_B) as FEE_B,sum(FEE_C) as FEE_C,sum(FEE_D) as FEE_D,sum(FEE_O) as FEE_O,sum(MONEY_AMOUNT_SUM) as MONEY_AMOUNT_SUM,sum(INTO_MONEY_SUM) as INTO_MONEY_SUM,sum(TRADE_CNT_SUM) as TRADE_CNT_SUM,sum(FEE_SUM) as FEE_SUM FROM ??"
    },
    //  放款日报2表统计
    lendingDaily2: {
      selectAllFront: "select * from ??",
      selectAllBack: " limit ?,?",
      orderBy: " order by d_date desc",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select D_DATE as "日期", LOAN_TERM as "分期天数", MONEY_AMOUNT as "放款金额",INTO_MONEY as "实际放款金额", TRADE_CNT as "放款笔数", FEE as "手续费", FEE1 as "代扣费", capital_type as "类型", cname as "公司名称" from ??',
      selectSum:
        "select capital_type,sum(money_amount) as sum1,sum(into_money) as sum2,sum(trade_cnt) as sum3 ,sum(fee) as sum4,sum(fee1) as sum5 from ?? ",
      group: " group by d_date,capital_type",
      selectSumB:
        ' select "合计" as capital_type, sum(money_amount) as sum1,sum(into_money) as sum2,sum(trade_cnt) as sum3,sum(fee) as sum4,sum(fee1) as sum5 from ?? ',
      groupB: " group by d_date union all ",
      selectSum2:
        'select capital_type as "类型",sum(money_amount) as "放款金额",sum(into_money) as "实际放款金额",sum(trade_cnt) as "放款笔数" ,sum(fee) as "手续费",sum(fee1) as "代扣费" from ?? ',
      selectSumB2:
        ' select "合计" as "类型", sum(money_amount) as "放款金额",sum(into_money) as "实际放款金额",sum(trade_cnt) as "放款笔数",sum(fee) as "手续费",sum(fee1) as "代扣费" from ?? '
    },
    inventoryManagementQE: {
      selectAll: "select * from ??",
      order: " order by d_date desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select d_date as "日期",product_id as "商品id",product_name as "商品名称",y_unit_price as "昨日单价(元)",y_num as "昨日数量",y_amt as "昨日库存金额(元)",r_num as "入库数量",r_amt as "入库金额(元)",c_unit_price as "出库单价(元)",c_num as "出库数量",c_amt as "出库金额(元)",t_num as "今日库存数量",t_unit_price as "今日库存单价(元)",t_amt as "今日库存金额(元)" from ??'
    }
  },
  //推广管理 推广渠道
  promotionManagement: {
    promotionChannel: {
      getCount:
        'select count(*) as count from ?? t left join ?? t1 on t.rate_id=t1.id where (t.channel_name is not null and t.channel_name !="") and length(t.channel_name)>0',
      selectAllFront:
        'select t.channel_name, t.channel_code, t.operator_name, t.channel_tel, t.channel_province, t.channel_city, t.channel_area, t1.canal_rate_name, t.created_at from ?? t left join ?? t1 on t.rate_id=t1.id where (t.channel_name is not null and t.channel_name !="") and length(t.channel_name)>0',
      selectAllBack: " limit ?,?",
      selectAllExcel:
        'select t.channel_name as "渠道商名称", t.channel_code as "渠道商编码", t.operator_name as "负责人", t.channel_tel as "联系方式",t.channel_province as "省份",t.channel_city as "城市", t.channel_area as "地区",t1.canal_rate_name as "计费方式", t.created_at as "创建时间" from ?? t left join ?? t1 on t.rate_id=t1.id where (t.channel_name is not null and t.channel_name !="") and length(t.channel_name)>0'
    },
    //推广管理 推广员管理
    promoterManagement: {
      getCount:
        'select count(*) as count from ?? t left join ?? t1 on t.user_id = t1.id left join ?? t2 on t.channel_id = t2.id where (t1.realname is not null and t1.realname !="")',
      selectAllFront:
        'select t1.realname, t1.user_phone, t2.channel_name, t2.operator_name, t2.channel_tel, t.created_at, t.rel_path, t.remark from ?? t left join ?? t1 on t.user_id = t1.id left join ?? t2 on t.channel_id = t2.id where (t1.realname is not null and t1.realname !="")',
      selectAllBack: " limit ?,?",
      getSelectOptions: "select channel_name from ?? group by channel_name ",
      selectAllExcel:
        'select t1.realname as "推广员姓名", t1.user_phone as "推广员电话", t2.channel_name as "渠道商名称", t2.operator_name as "负责人",t2.channel_tel as "联系方式",t.created_at as "创建时间", t.rel_path as "推广二维码",t.remark as "推广链接" from ?? t left join ?? t1 on t.user_id = t1.id left join ?? t2 on t.channel_id = t2.id where (t1.realname is not null and t1.realname !="")'
    },
    //推广管理 推广统计（渠道）
    promotionChannelStatistics: {
      selectAllFront:
        'select * from ?? where (channel_trader_name is not null and channel_trader_name !="")',
      selectAllBack: " limit ?,?",
      order: " order by d_date desc,day_consumption desc, register_num desc",
      getCount:
        'select count(*) as count from ?? where (channel_trader_name is not null and channel_trader_name !="")',
      getSelectOptions:
        "select channel_trader_name from ?? group by channel_trader_name",
      selectAllExcel:
        'select d_date as "日期", channel_trader_name as "渠道商名称", settle_method as "结算方式", effe_cust_acqu_cost as "有效获客成本(元)",day_consumption as "当日消耗(元)",register_num as "注册量",all_fact_auth_num as "全要素认证人数",apply_loan_num as "申请借款人数",apply_loan_num_new as "新用户申请借款人数",apply_loan_num_old as "老用户申请借款人数",blacklist_num as "黑名单人数",entries_num as "进件数",nuser_apply_succ_num as "新用户申请成功人数", ouser_apply_succ_num as "老用户申请成功人数", nuser_loan_ratio as "新用户借款率",nuser_adoption_rate as "新用户通过率",nuser_loan_amount as "新用户放款金额(元)",ouser_adoption_rate as "老用户通过率",ouser_loan_amount as "老用户放款金额(元)",DUE_AMOUNT as "到期金额(元)",overdue_num as "逾期人数", OVERDUE_AMOUNT as "逾期金额(元)", BADDEBT_RATE as "坏账率", BADDEBT_amount as "坏账金额(元)", UNITGROSS_PROFIT as "单位毛利润(元)",baddebt_amount_unit as "单位坏账金额(元)" from ?? where (channel_trader_name is not null and channel_trader_name !="")'
    },
    //推广管理 七日推广统计（渠道）
    promotionChannelStatistics7: {
      selectAllFront:
        'select * from ?? where (channel_trader_name is not null and channel_trader_name !="") ',
      order: " order by d_date desc,day_consumption desc, register_num desc",
      limit: " limit ?,?",
      getCount:
        'select count(*) as count from ?? where (channel_trader_name is not null and channel_trader_name !="") ',
      getSelectOptions:
        "select channel_trader_name from ?? group by channel_trader_name",
      selectAllExcel:
        'select d_date as "日期", channel_trader_name as "渠道商名称", effe_cust_acqu_cost as "七日获客成本",day_consumption as "七日消耗",register_num as "七日注册量",all_fact_auth_num as "七日全要素认证人数",apply_loan_num as "七日申请借款人数",blacklist_num as "七日黑名单人数",entries_num as "七日进件数",nuser_apply_succ_num as "七日新用户申请成功人数", ouser_apply_succ_num as "七日老用户申请成功人数", nuser_loan_ratio as "七日新用户借款率",nuser_adoption_rate as "七日新用户通过率",nuser_loan_amount as "七日新用户放款金额",ouser_adoption_rate as "七日老用户通过率",ouser_loan_amount as "七日老用户放款金额",DUE_AMOUNT as "七日到期金额",overdue_num as "七日逾期人数", OVERDUE_AMOUNT as "七日逾期金额", BADDEBT_RATE as "七日坏账率", BADDEBT_amount as "七日坏账金额", baddebt_amount_unit as "单位坏账金额", UNITGROSS_PROFIT as "七日单位毛利润" from ?? where (channel_trader_name is not null and channel_trader_name !="") '
    },
    //推广管理 推广统计（地区）
    promotionRegionStatistics: {
      selectAllFront: "select * from ??",
      selectAllBack: " limit ?,?",
      order: " order by d_date desc",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select d_date as "日期", Province as "省份", city as "城市", register_num as "注册量", realname_auth_num as "实名认证",card_bound_num as "绑卡人数",emergency_contact_num as "紧急联系人",operator_auth_num as "运营商认证", Alipay_auth_num as "支付宝认证人数", Sesame_auth_num as "芝麻认证人数", jobinfo_auth_num as "工作信息", apply_loan_num as "申请借款人数",apply_succ_num as "申请成功人数", Pass_rate as "通过率", loan_amount as "放款金额(元)", blacklist_num as "黑名单人数", overdue_num as "逾期人数" from ?? '
    },
    channelStatisticsSummary: {
      selectAllFront:
        'select * from ?? where (channel_trader is not null and channel_trader !="") ',
      selectAllBack: " limit ?,?",
      getCount:
        'select count(*) as count from ?? where (channel_trader is not null and channel_trader !="") ',
      getSelectOptions: "select channel_trader from ?? group by channel_trader",
      selectAllExcel:
        'select channel_trader as "渠道商", register_num as "注册量", realname_auth_num as "实名认证",card_bound_num as "绑卡人数",emergency_contact_num as "紧急联系人",operator_auth_num as "运营商认证", Alipay_auth_num as "支付宝认证人数", Sesame_auth_num as "芝麻认证人数", jobinfo_auth_num as "工作信息",blacklist_num as "黑名单人数",apply_loan_num as "申请借款人数",apply_succ_num as "申请成功人数", Pass_rate as "通过率", loan_amount as "放款金额(元)", overdue_num as "逾期人数" from ?? where (channel_trader is not null and channel_trader !="") '
    },
    PVUV: {
      selectDayFront: "select d_date,element,element_id,title,pv,uv from ??",
      getCount: "select count(*) as count from ??",
      // selectDayBack: 'd_date=date_sub(curdate(),interval 1 day)',
      order: " order by d_date desc",
      limit: " limit ?,?",
      getSelectOptions: "select title from ?? group by title",
      selectAllExcel:
        'select d_date as "日期", element as "指标元素", element_id as "指标元素id",title as "渠道名称",pv as "用户点击量pv",uv as "线上用户量统计" from ?? where (title is not null and title !="") '
    }
  },
  /*绩效考评*/
  //部门绩效考评
  evaluation: {
    achievements: {
      selectAllFront:
        'select m_month,department,quota,kpi,kpi_result,case when reach = 0 then "未达标" when reach = 1 then "达标" end as reach,creator from ??',
      selectAllLimit: " limit ?, ?",
      getCount: "select count(*) as count from ??"
    }
  },
  /*权限管理*/
  // 员工信息
  privilegeManage: {
    employeeList: {
      selectAllFront: "select * from ??",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      privilegeModify:
        "UPDATE ?? SET available_table = ?, available_table_zww = ?, available_table_fq = ?, product_names = ?, user_name=?,user_sex=?,department=?,user_mobile=?,user_permission = ?,add_ip = ? WHERE user_email = ?",
      add:
        "INSERT INTO ?? (product_names,available_table,available_table_zww,available_table_fq,department,user_password,user_name,user_sex,user_mobile,user_email,user_permission,add_ip) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
      delete: "DELETE FROM ?? WHERE user_email = ?",
      selectByPhone: "select * from ?? where user_mobile=?",
      modifyMultiple:
        "UPDATE ?? set product_names = ?, available_table = ?,available_table_zww = ?,available_table_jp = ?,available_table_fq = ?,add_ip = ? where user_mobile in "
    }
  },
  /*开心分期*/
  period: {
    selectAll: "select * from ??",
    order: " order by d_date desc",
    orderMonth: 'order by D_MONTH desc',
    selectAllBack: " limit ?,?",
    getCount: "select count(*) as count from ??",
    repaymentDetailData: {
      selectAll: "select * from ?? ",
      order: " order by d_date desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select d_date as "日期",user_id as "用户ID",user_name as "用户名",user_phone as "手机号",order_id as "借款ID",loan_id as "还款ID",loan_money as "借款金额",repayment_amount as "总还款金额(元)",repaymented_amount as "已还金额(元)",PACKAGE_MONEY as "礼包购买(元)",Principal_amount as "还款本金(元)",loan_accrual as "还款利息(元)",Overdue_fine as "逾期滞纳金(元)",renewal_fee as "续期手续费(元)",repayment_real_money as "实还金额(元)",return_money as "退款金额(元)",coupon_money as "优惠券金额(元)",Reduction_money as "减免金额(元)",repayment_time as "应还款时间",repayment_real_time as "实际还款时间",repayment_type as "付款方式",repayment_channel as "付款渠道",repayment_source as "付款来源",repayment_detail as "还款详情",repayment_status as "还款状态",Overdue_day as "逾期天数",renewal_day as "续期天数",year_rate as "年利率",Renewal_rate as "续期费率",Overdue_rate as "逾期费率" from ?? '
    },
    dailySettlementReport: {
      selectAll:
        "select D_DATE,ADVANCE_REPAYMENT_AMT,ADVANCE_REPAYMENT_INTEREST,REPAYMENT_AMT,REPAYMENT_INTEREST,OVERDUE_REPAYMENT_AMT,OVERDUE_REPAYMENT_INTEREST,OVERDUE_LATE_FEE,RENEWAL_FEE,YIMATONG_FEE,LQ_RECHARGE,TOTAL_AMT,UPDATE_TIME from ?? ",
      order: " order by D_DATE desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select D_DATE as "日期",ADVANCE_REPAYMENT_AMT as "提前还款本金(元)",ADVANCE_REPAYMENT_INTEREST as "提前还款利息(元)",REPAYMENT_AMT as "正常还款本金(元)",REPAYMENT_INTEREST as "正常还款利息(元)",OVERDUE_REPAYMENT_AMT as "逾期还款本金(元)",OVERDUE_REPAYMENT_INTEREST as "逾期还款利息(元)",OVERDUE_LATE_FEE as "逾期滞纳金(元)",RENEWAL_FEE as "续期费(元)",YIMATONG_FEE as "益码通手续费(元)",LQ_RECHARGE as "零钱充值(元)",TOTAL_AMT as "合计(元)" from ?? ',
      selectSum:
        " select null as D_DATE,sum(ADVANCE_REPAYMENT_AMT) as ADVANCE_REPAYMENT_AMT,sum(ADVANCE_REPAYMENT_INTEREST) as ADVANCE_REPAYMENT_INTEREST,sum(REPAYMENT_AMT) as REPAYMENT_AMT,sum(REPAYMENT_INTEREST) as REPAYMENT_INTEREST,sum(OVERDUE_REPAYMENT_AMT) as OVERDUE_REPAYMENT_AMT,sum(OVERDUE_REPAYMENT_INTEREST) as OVERDUE_REPAYMENT_INTEREST,sum(OVERDUE_LATE_FEE) as OVERDUE_LATE_FEE,sum(RENEWAL_FEE) as RENEWAL_FEE,sum(YIMATONG_FEE) as YIMATONG_FEE,sum(LQ_RECHARGE) as LQ_RECHARGE,sum(TOTAL_AMT) as TOTAL_AMT,UPDATE_TIME from ?? ",
        selectSumExcel:
        'select null as "日期",sum(ADVANCE_REPAYMENT_AMT) as "提前还款本金(元)",sum(ADVANCE_REPAYMENT_INTEREST) as "提前还款利息(元)",sum(REPAYMENT_AMT) as "正常还款本金(元)",sum(REPAYMENT_INTEREST) as "正常还款利息(元)",sum(OVERDUE_REPAYMENT_AMT) as "逾期还款本金(元)",sum(OVERDUE_REPAYMENT_INTEREST) as "逾期还款利息(元)",sum(OVERDUE_LATE_FEE) as "逾期滞纳金(元)",sum(RENEWAL_FEE) as "续期费(元)",sum(YIMATONG_FEE) as "益码通手续费(元)",sum(LQ_RECHARGE) as "零钱充值(元)",sum(TOTAL_AMT) as "合计(元)" from ?? '
    },
    dailyClaimsReport: {
      selectAll:
        "select D_DATE,LOAN_TERM,KXLOAN_AMT_Z,KXLOAN_AMT_X,XFLOAN_AMT_Z,XFLOAN_AMT_X,LOAN_AMT,KX_INTEREST_Z,KX_INTEREST_X,XF_INTEREST_Z,XF_INTEREST_X,INTEREST_AMT,KXLOAN_CNT_Z,KXLOAN_CNT_X,XFLOAN_CNT_Z,XFLOAN_CNT_X,LOAN_CNT,UPDATE_TIME from ?? ",
      order: " order by D_DATE desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectSum:
        " select null as D_DATE,null as LOAN_TERM, sum(KXLOAN_AMT_Z) as KXLOAN_AMT_Z,sum(KXLOAN_AMT_X) as KXLOAN_AMT_X,sum(XFLOAN_AMT_Z) as XFLOAN_AMT_Z,sum(XFLOAN_AMT_X) as XFLOAN_AMT_X,sum(LOAN_AMT) as LOAN_AMT,sum(KX_INTEREST_Z) as KX_INTEREST_Z,sum(KX_INTEREST_X) as KX_INTEREST_X,sum(XF_INTEREST_Z) as XF_INTEREST_Z,sum(XF_INTEREST_X) as XF_INTEREST_X,sum(INTEREST_AMT) as INTEREST_AMT,sum(KXLOAN_CNT_Z) as KXLOAN_CNT_Z,sum(KXLOAN_CNT_X) as KXLOAN_CNT_X,sum(XFLOAN_CNT_Z) as XFLOAN_CNT_Z,sum(XFLOAN_CNT_X) as XFLOAN_CNT_X,sum(LOAN_CNT) as LOAN_CNT,UPDATE_TIME from ?? "
    },
    ZCMRepaymentDataReconciliation: {
      selectAll:
        "select D_DATE,d_month,ADVANCE_REPAYMENT_AMT,ADVANCE_REPAYMENT_INTEREST,REPAYMENT_AMT,REPAYMENT_INTEREST,OVERDUE_REPAYMENT_AMT,OVERDUE_REPAYMENT_INTEREST,OVERDUE_LATE_FEE,RENEWAL_FEE,TOTAL_AMT,ZCM_LL,DIFF_VALUE,UPDATE_TIME from ?? ",
      order: " order by D_DATE desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectSum:
        " select null as D_DATE,null as d_month,sum(ADVANCE_REPAYMENT_AMT) as ADVANCE_REPAYMENT_AMT,sum(ADVANCE_REPAYMENT_INTEREST) as ADVANCE_REPAYMENT_INTEREST,sum(REPAYMENT_AMT) as REPAYMENT_AMT,sum(REPAYMENT_INTEREST) as REPAYMENT_INTEREST,sum(OVERDUE_REPAYMENT_AMT) as OVERDUE_REPAYMENT_AMT,sum(OVERDUE_REPAYMENT_INTEREST) as OVERDUE_REPAYMENT_INTEREST,sum(OVERDUE_LATE_FEE) as OVERDUE_LATE_FEE,sum(RENEWAL_FEE) as RENEWAL_FEE,sum(TOTAL_AMT) as TOTAL_AMT,sum(ZCM_LL) as ZCM_LL,sum(DIFF_VALUE) as DIFF_VALUE, UPDATE_TIME from ?? "
    },
    ZBrepaymentData: {
      selectAll:
        "select D_DATE,d_month,ADVANCE_REPAYMENT_AMT,ADVANCE_REPAYMENT_INTEREST,REPAYMENT_AMT,REPAYMENT_INTEREST,OVERDUE_REPAYMENT_AMT,OVERDUE_REPAYMENT_INTEREST,OVERDUE_LATE_FEE,RENEWAL_FEE,YIMATONG_FEE,TOTAL_AMT,ZB_LL,ZB_YMT,DIFF_VALUE,UPDATE_TIME from ?? ",
      order: " order by D_DATE desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectSum:
        " select null as D_DATE,null as d_month,sum(ADVANCE_REPAYMENT_AMT) as ADVANCE_REPAYMENT_AMT,sum(ADVANCE_REPAYMENT_INTEREST) as ADVANCE_REPAYMENT_INTEREST,sum(REPAYMENT_AMT) as REPAYMENT_AMT,sum(REPAYMENT_INTEREST) as REPAYMENT_INTEREST,sum(OVERDUE_REPAYMENT_AMT) as OVERDUE_REPAYMENT_AMT,sum(OVERDUE_REPAYMENT_INTEREST) as OVERDUE_REPAYMENT_INTEREST,sum(OVERDUE_LATE_FEE) as OVERDUE_LATE_FEE,sum(RENEWAL_FEE) as RENEWAL_FEE,sum(YIMATONG_FEE) as YIMATONG_FEE,sum(TOTAL_AMT) as TOTAL_AMT,sum(ZB_LL) as ZB_LL,sum(ZB_YMT) as ZB_YMT,sum(DIFF_VALUE) as DIFF_VALUE,UPDATE_TIME from ?? "
    },
    monthlySettlementData: {
      selectAll:
        "select D_MONTH,ADVANCE_REPAYMENT_AMT,ADVANCE_REPAYMENT_INTEREST,REPAYMENT_AMT,REPAYMENT_INTEREST,OVERDUE_REPAYMENT_AMT,OVERDUE_REPAYMENT_INTEREST,OVERDUE_LATE_FEE,RENEWAL_FEE,YIMATONG_FEE,LQ_RECHARGE,TOTAL_AMT,CREATE_TIME from ?? ",
        selectSum: 'select null D_MONTH,sum(ADVANCE_REPAYMENT_AMT) ADVANCE_REPAYMENT_AMT,sum(ADVANCE_REPAYMENT_INTEREST) ADVANCE_REPAYMENT_INTEREST,sum(REPAYMENT_AMT) REPAYMENT_AMT,sum(REPAYMENT_INTEREST) REPAYMENT_INTEREST,sum(OVERDUE_REPAYMENT_AMT) OVERDUE_REPAYMENT_AMT,sum(OVERDUE_REPAYMENT_INTEREST) OVERDUE_REPAYMENT_INTEREST,sum(OVERDUE_LATE_FEE) OVERDUE_LATE_FEE,sum(RENEWAL_FEE) RENEWAL_FEE,sum(YIMATONG_FEE) as YIMATONG_FEE,sum(LQ_RECHARGE) LQ_RECHARGE,sum(TOTAL_AMT) TOTAL_AMT,CREATE_TIME from ?? ',
      order: " order by D_MONTH desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectSumExcel: 'select null as "月份",sum(ADVANCE_REPAYMENT_AMT) as "提前还款本金(元)",sum(ADVANCE_REPAYMENT_INTEREST) as "提前还款利息(元)",sum(REPAYMENT_AMT) as "正常还款本金(元)",sum(REPAYMENT_INTEREST) as "正常还款利息(元)",sum(OVERDUE_REPAYMENT_AMT) as "逾期还款本金(元)",sum(OVERDUE_REPAYMENT_INTEREST) as "逾期还款利息(元)",sum(OVERDUE_LATE_FEE) as "逾期滞纳金(元)",sum(RENEWAL_FEE) as "续期费(元)",sum(YIMATONG_FEE) as "益码通手续费(元)",sum(LQ_RECHARGE) as "零钱充值(元)",sum(TOTAL_AMT) as "合计(元)",CREATE_TIME as "创建时间" from ?? ',
      selectAllExcel:
        'select D_MONTH as "月份",ADVANCE_REPAYMENT_AMT as "提前还款本金(元)",ADVANCE_REPAYMENT_INTEREST as "提前还款利息(元)",REPAYMENT_AMT as "正常还款本金(元)",REPAYMENT_INTEREST as "正常还款利息(元)",OVERDUE_REPAYMENT_AMT as "逾期还款本金(元)",OVERDUE_REPAYMENT_INTEREST as "逾期还款利息(元)",OVERDUE_LATE_FEE as "逾期滞纳金(元)",RENEWAL_FEE as "续期费(元)",LQ_RECHARGE as "益码通手续费(元)",LQ_RECHARGE as "零钱充值(元)",TOTAL_AMT as "合计(元)",CREATE_TIME as "创建时间" from ?? '
    },
    repaymentReconciliationZFB: {
      selectAll:
        "select D_DATE,D_MONTH,ADVANCE_REPAYMENT_AMT,ADVANCE_REPAYMENT_INTEREST,REPAYMENT_AMT,REPAYMENT_INTEREST,OVERDUE_REPAYMENT_AMT,OVERDUE_REPAYMENT_INTEREST,OVERDUE_LATE_FEE,RENEWAL_FEE,TOTAL_AMT,ZFB_ZCM,ZFB_XW,EW_AMT,TOTAL_AMT_D,CREATE_TIME from ?? ",
      selectSum: 'select null D_DATE,null D_MONTH,sum(ADVANCE_REPAYMENT_AMT) ADVANCE_REPAYMENT_AMT,sum(ADVANCE_REPAYMENT_INTEREST) ADVANCE_REPAYMENT_INTEREST,sum(REPAYMENT_AMT) REPAYMENT_AMT,sum(REPAYMENT_INTEREST) REPAYMENT_INTEREST,sum(OVERDUE_REPAYMENT_AMT) OVERDUE_REPAYMENT_AMT,sum(OVERDUE_REPAYMENT_INTEREST) OVERDUE_REPAYMENT_INTEREST,sum(OVERDUE_LATE_FEE) OVERDUE_LATE_FEE,sum(RENEWAL_FEE) RENEWAL_FEE,sum(TOTAL_AMT) TOTAL_AMT,sum(ZFB_ZCM) ZFB_ZCM,sum(ZFB_XW) ZFB_XW,sum(EW_AMT) EW_AMT,sum(TOTAL_AMT_D) TOTAL_AMT_D,CREATE_TIME from ??',
      order: " order by d_date desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectSumExcel: 'select null as "日期",null as "月份",sum(ADVANCE_REPAYMENT_AMT)  as "提前还款本金(元)",sum(ADVANCE_REPAYMENT_INTEREST)  as "提前还款利息(元)",sum(REPAYMENT_AMT)  as "正常还款本金(元)",sum(REPAYMENT_INTEREST)  as "正常还款利息(元)",sum(OVERDUE_REPAYMENT_AMT)  as "逾期还款本金(元)",sum(OVERDUE_REPAYMENT_INTEREST)  as "逾期还款利息(元)",sum(OVERDUE_LATE_FEE)  as "逾期滞纳金(元)",sum(RENEWAL_FEE)  as "续期费(元)",sum(TOTAL_AMT)  as "合计(元)",sum(ZFB_ZCM)  as "招财猫支付宝(元)",sum(ZFB_XW)  "新网支付宝(元)",sum(EW_AMT)  as "额外收入(元)",sum(TOTAL_AMT_D)  as "差异值(元)",CREATE_TIME as "创建时间" from ??',
      selectAllExcel:
        'select D_DATE as "日期",D_MONTH as "月份",ADVANCE_REPAYMENT_AMT as "提前还款本金(元)",ADVANCE_REPAYMENT_INTEREST as "提前还款利息(元)",REPAYMENT_AMT as "正常还款本金(元)",REPAYMENT_INTEREST as "正常还款利息(元)",OVERDUE_REPAYMENT_AMT as "逾期还款本金(元)",OVERDUE_REPAYMENT_INTEREST as "逾期还款利息(元)",OVERDUE_LATE_FEE as "逾期滞纳金(元)",RENEWAL_FEE as "续期费(元)",TOTAL_AMT as "合计(元)",ZFB_ZCM as "招财猫支付宝(元)",ZFB_XW as "新网支付宝(元)",EW_AMT as "额外收入(元)",TOTAL_AMT_D as "差异值(元)",CREATE_TIME as "创建时间" from ?? '
    },
    dataCheckXN: {
      selectAll:
        "select D_DATE,D_MONTH,XQ_AMT,XQINT_TQ,XQINT_DQ,XQINT_YQ,LQCZ_AMT,TOTAL_AMT,LL_XN,YMT_XN,TOTAL_AMT_D,CREATE_TIME from ?? ",
      selectSum: 'select null D_DATE,null D_MONTH,sum(XQ_AMT) XQ_AMT,sum(XQINT_TQ) XQINT_TQ,sum(XQINT_DQ) XQINT_DQ,sum(XQINT_YQ) XQINT_YQ,sum(LQCZ_AMT) LQCZ_AMT,sum(TOTAL_AMT) TOTAL_AMT,sum(LL_XN) LL_XN,sum(YMT_XN) YMT_XN,sum(TOTAL_AMT_D) TOTAL_AMT_D,CREATE_TIME from ?? ',
      order: " order by d_date desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectSumExcel: 'select null "日期",null "月份",sum(XQ_AMT) "续期费用(元)",sum(XQINT_TQ) "提前续期利息(元)",sum(XQINT_DQ) "到期续期利息(元)",sum(XQINT_YQ) "逾期续期利息(元)",sum(LQCZ_AMT) "零钱充值(元)",sum(TOTAL_AMT) "合计(元)",sum(LL_XN) "XN连连(元)",sum(YMT_XN) "XN益码通(元)",sum(TOTAL_AMT_D) "差异值(元)",CREATE_TIME "创建时间" from ?? ',
      selectAllExcel:
        'select D_DATE as "日期",D_MONTH as "月份",XQ_AMT as "续期费用(元)",XQINT_TQ as "提前续期利息(元)",XQINT_DQ as "到期续期利息(元)",XQINT_YQ as "逾期续期利息(元)",LQCZ_AMT as "零钱充值(元)",TOTAL_AMT as "合计(元)",LL_XN as "XN连连(元)",YMT_XN as "XN益码通(元)",TOTAL_AMT_D as "差异值(元)",CREATE_TIME as "创建时间" from ?? '
    },
    rechargeOfChangeReport: {
      selectAll:
        "select d_date,m_month,xn_ll,xn_ymt,pocket_amount,dlb_income,pocket_buy,withdraw,withdraw_fee,dlb_refund,pocket_recharge_tatol,balance_day,balance,diff,alipay_recharge_fee,remarks from ?? ",
      order: " order by d_date desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select d_date as "日期",m_month as "月份",xn_ll as "XN连连(元)",xn_ymt as "XN益码通(元)",pocket_amount as "零钱合计(元)",dlb_income as "礼包购买(元)",pocket_buy as "商品零钱购买(元)",withdraw as "提现(元)",withdraw_fee as "提现手续费(元)",dlb_refund as "退款(元)",pocket_recharge_tatol as "合计(元)",balance_day as "当日余额(元)",balance as "后台当日余额(元)",diff as "验证差异(元)",alipay_recharge_fee as "支付宝充值手续费收入(元)",remarks as "备注" from ?? ',
      update:
        "update ?? set xn_ll=?,xn_ymt=?,pocket_amount=?,balance_day=? where d_date=?"
    },
    /**黑卡 */
    totalIncome: {
      selectAll:
        "select d_date,income_source,income_amount,return_amount,coupon_amount,coupon_number,dused_coupon_amount,used_coupon_amount,unuse_unexpired_amount,unuse_unexpired_number,expired_coupon_amount,expired_coupon_number from ?? ",
      order: " order by d_date desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select d_date as "日期",income_source as "收入来源",income_amount as "收入金额(元)",return_amount as "退回金额(元)",coupon_amount as "优惠满减金额(元)",coupon_number as "优惠折扣券数量",dused_coupon_amount as "当日已使用优惠金额(元)",used_coupon_amount as "累计已使用优惠金额(元)",unuse_unexpired_amount as "未使用未到期满减金额(元)",unuse_unexpired_number as "未使用未到期满减折扣券数量",expired_coupon_amount as "累计已失效的优惠券金额(元)",expired_coupon_number as "累计已失效的折扣券数量" from ?? '
    },
    detailIncome: {
      selectAll:
        'select d_date,user_id,order_id,user_phone,CASE WHEN income_source = 2 THEN "分期购商城" WHEN income_source = 1 then "大礼包" END as income_source,pay_amount,borrow_amount,coupon_money,buy_time,begin_time,end_time,is_expire,is_use from ?? ',
      order: " order by d_date desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select d_date as "日期",user_id as "用户ID",order_id as "订单ID",user_phone as "用户手机号码",CASE WHEN income_source = 2 THEN "分期购商城" WHEN income_source = 1 then "大礼包" END as "收入来源",pay_amount as "大礼包购买金额(元)",borrow_amount as "大礼包种类",coupon_money as "优惠券金额(元)",buy_time as "大礼包购买时间",begin_time as "使用开始时间",end_time as "使用截止时间",is_expire as "是否到期",is_use as "是否使用" from ?? '
    },
    totalSales: {
      selectAll:
        "select d_date,order_total,paid_order,order_people,paid_people,order_goods_num,paid_goods_num,order_amount,paid_amount,discount_amount,mcoupon_num,mcoupon_amount,zcoupon_num,zcoupon_amount,money_amount,debt_amount,delivery_order_num,receive_order_num,unit_price from ?? ",
      order: " order by d_date desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select d_date as "日期",order_total as "总订单量",paid_order as "已支付订单量",order_people as "总下订单人数",paid_people as "已支付订单人数",order_goods_num as "订单总商品件数",paid_goods_num as "已支付总商品件数",order_amount as "总订单金额(元)",paid_amount as "已支付订单金额(元)",discount_amount as "总优惠金额(元)",mcoupon_num as "使用满减优惠券数量",mcoupon_amount as "使用满减优惠券金额(元)",zcoupon_num as "使用折扣优惠券数量",zcoupon_amount as "使用折扣优惠券金额(元)",money_amount as "总实收金额(元)",debt_amount as "黑卡支付金额(元)",delivery_order_num as "总发货订单数",receive_order_num as "总收货订单数",  unit_price as "客单价(元)" from ?? '
    },
    detailSales: {
      selectAll:
        "select d_date,product_id,product_name,product_sku,product_price,actual_buy_num,actual_sale_num,actual_sale_amount,delivery_num,receive_num,order_user_num,order_num,order_amount,payment_rate from ?? ",
      order: " order by d_date desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select d_date as "日期",product_id as "商品id",product_name as "商品名称",product_sku as "商品sku",product_price as "商品单价(元)",actual_buy_num as "实际购买人数",actual_sale_num as "实际销售件数",actual_sale_amount as "实际销售金额(元)",delivery_num as "已发货件数",receive_num as "已收货的件数",order_user_num as "下单人数",order_num as "下单件数",order_amount as "下单金额(元)",payment_rate as "商品订单支付率" from ?? '
    },
    detailOrder: {
      selectAll:
        "select order_id,product_id,merchant_id,product_name,product_sku,product_price,product_num,order_amount,debt_money,paid_money,order_status,order_time,paid_time,dispatch_time,delivery_time,receive_time,free_money from ?? ",
      order: " order by paid_time desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select order_id as "交易订单id",product_id as "商品id",merchant_id as "商家id",product_name as "商品名称",product_sku as "商品sku",product_price as "商品金额(元)",product_num as "商品数量",order_amount as "订单总金额(元)",debt_money as "白条支付金额(元)",paid_money as "实付款(元)",order_status as "支付状态",order_time as "下单时间",paid_time as "支付时间",dispatch_time as "派单时间",delivery_time as "发货时间",receive_time as "收货时间",free_money as "优惠金额(元)" from ?? '
    },
    dailyPocketMoneyAnalysis: {
      selectAll:
        "select d_date,recharge_amt,recharge_fee,withdraw_fee,dlb_refund,dlb_pay,pocket_pay,withdraw,balance from ?? ",
      order: " order by d_date desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select d_date as "日期",recharge_amt as "充值金额(元)",recharge_fee as "充值手续费(元)",withdraw_fee as "提现手续费(元)",dlb_refund as "大礼包退款(元)",dlb_pay as "大礼包支付(元)",pocket_pay as "商品零钱支付(元)",withdraw as "提现(元)",balance as "余额(元)" from ?? '
    },
    dailyPackageIncomeStatement: {
      selectAll:
        "select d_date,m_month,dlb_quota,dlb_income,dlb_refund,dlb_income_balance,remarks from ?? ",
      order: " order by d_date desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select d_date as "日期",m_month as "月份",dlb_quota as "大礼包额度(元)",dlb_income as "礼包收入(元)",dlb_refund as "礼包退款(元)",dlb_income_balance as "礼包收入余额(元)",remarks as "备注" from ?? '
    },
    dailyMallOrderReport: {
      selectAll:
        "select d_date,m_month,free_amount,buy_amount,debt_amount,amount,product_amount,diff from ?? ",
      order: " order by d_date desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select d_date as "日期",m_month as "月份",free_amount as "优惠券使用金额(元)",buy_amount as "零钱购买金额(元)",debt_amount as "白条使用金额(元)",amount as "数据合计(元)",product_amount as "商品总额(元)",diff as "差异(元)" from ?? '
    },
    threePartyAccountAnalysis: {
      selectAll:
        "select D_DATE,LL_ZCM_KX,LL_ZCM_XF,LL_ZB_KX,LL_ZB_XF,YMT_ZB_KX,YMT_ZB_XF,LL_LQ_XN,YMT_LQ_XN,LL_XQ_XN,YMT_XQ_XN,TOTAL_AMT,LL_ZCM_T,LL_ZB_T,YMT_ZB_T,LL_XN_T,YMT_XN_T,TOTAL_AMT_T,LL_ZCM_D,LL_ZB_D,YMT_ZB_D,LL_XN_D,YMT_XN_D,TOTAL_AMT_D,UPDATE_TIME from ?? ",
      selectSum: 'select NULL D_DATE,sum(LL_ZCM_KX) LL_ZCM_KX,sum(LL_ZCM_XF) LL_ZCM_XF,sum(LL_ZB_KX) LL_ZB_KX,sum(LL_ZB_XF) LL_ZB_XF,sum(YMT_ZB_KX) YMT_ZB_KX,sum(YMT_ZB_XF) YMT_ZB_XF,sum(LL_LQ_XN) LL_LQ_XN,sum(YMT_LQ_XN) YMT_LQ_XN,sum(LL_XQ_XN) LL_XQ_XN,sum(YMT_XQ_XN) YMT_XQ_XN,sum(TOTAL_AMT) TOTAL_AMT,sum(LL_ZCM_T) LL_ZCM_T,sum(LL_ZB_T) LL_ZB_T,sum(YMT_ZB_T) YMT_ZB_T,sum(LL_XN_T) LL_XN_T,sum(YMT_XN_T) YMT_XN_T,sum(TOTAL_AMT_T) TOTAL_AMT_T,sum(LL_ZCM_D) LL_ZCM_D,sum(LL_ZB_D) LL_ZB_D,sum(YMT_ZB_D) YMT_ZB_D,sum(LL_XN_D) LL_XN_D,sum(YMT_XN_D) YMT_XN_D,sum(TOTAL_AMT_D) TOTAL_AMT_D,UPDATE_TIME from ?? ',
      order: " order by d_date desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ?? ",
      update:
        "update ?? set LL_ZCM_T=?,LL_ZB_T=?,YMT_ZB_T=?,LL_XN_T=?,YMT_XN_T=?,TOTAL_AMT_T=?,LL_ZCM_D=?,LL_ZB_D=?,YMT_ZB_D=?,LL_XN_D=?,YMT_XN_D=?,TOTAL_AMT_D=? where d_date=?"
    },
    mallMonthlyReport: {
      selectAll:
        "select y_year,m_month,pocket_recharge,recharge_fee,withdraw_amount,withdraw_fee,dlb_income,dlb_refund,pocket_pay,summation from ?? ",
      order: " order by y_year,m_month desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel: 'select y_year as "年份",m_month as "月份",pocket_recharge as "零钱充值(元)",recharge_fee as "充值手续费(元)",withdraw_amount as "提现金额(元)",withdraw_fee as "提现手续费(元)",dlb_income as "大礼包收入(元)",dlb_refund as "大礼包退款(元)",pocket_pay as "商品零钱支付(元)" from ?? '
    },
    changeFundAccountStatement: {
      selectAll:
        "select created_time,id,user_id,user_name,user_phone,recharge_amt,recharge_fee,withdraw_fee,dlb_refund,dlb_pay,pocket_pay,withdraw,balance from ?? ",
      order: " order by created_time desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel: 'select created_time as "创建时间",id as "序号",user_id as "用户ID",user_name as "用户名",user_phone as "手机号",recharge_amt as "充值金额(元)",recharge_fee as "充值手续费(元)",withdraw_fee as "提现手续费(元)",dlb_refund as "大礼包退款(元)",dlb_pay as "大礼包支付(元)",pocket_pay as "商品零钱支付(元)",withdraw as "提现(元)",balance as "余额(元)" from ?? '
    },
    channelStatistics: {
      selectAll: "select * from ?? ",
      order: " order by d_date desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select d_date as "日期",channel_name as "渠道",register_num as "注册人数",login_num as "登录人数",realname_auth_num as "实名认证",emergency_contact_num as "紧急联系人",operator_auth_num as "运营商认证",card_bound_num as "绑卡人数",all_auth_num as "全要素认证",jobinfo_auth_num as "工作信息人数",Sesame_auth_num as "芝麻信用",Alipay_auth_num as "支付宝",taobao_auth_num as "淘宝认证",credit_auth_num as "信用卡",gjj_auth_num as "公积金认证",Appl_quota_num as "申请额度人数",blacklist_num as "黑名单人数",succ_quota_num as "成功获取额度",Pass_rate as "通过率(成功激活人数/激活人数)",member_new_num as "购买会员(新用户)",member_old_num as "购买会员(老用户)",loan_new as "借款(新用户)",loan_old as "借款(老用户)",loan_amount_new as "放款金额(新用户)",loan_amount_old as "放款金额(老用户)",Overdue_rate as "逾期率",Overdue_rate_new as "新用户逾期率(金额)",Overdue_rate_old as "老用户逾期率(金额)" from ??',
      getSelectOptions: 'select distinct channel_name from ??'
    },
    channelSummaryStatistics: {
      selectAll: "select * from ?? ",
      order: " order by d_date desc",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select d_date as "日期",register_num as "注册人数",login_num as "登录人数",realname_auth_num as "实名认证",emergency_contact_num as "紧急联系人",operator_auth_num as "运营商认证",card_bound_num as "绑卡人数",all_auth_num as "全要素认证",jobinfo_auth_num as "工作信息人数",Sesame_auth_num as "芝麻信用",Alipay_auth_num as "支付宝",taobao_auth_num as "淘宝认证",credit_auth_num as "信用卡",gjj_auth_num as "公积金认证",Appl_quota_num as "申请额度人数",blacklist_num as "黑名单人数",succ_quota_num as "成功获取额度",Pass_rate as "通过率(成功激活人数/激活人数)",member_new_num as "购买会员(新用户)",member_old_num as "购买会员(老用户)",loan_new as "借款(新用户)",loan_old as "借款(老用户)",loan_amount_new as "放款金额(新用户)",loan_amount_old as "放款金额(老用户)",Overdue_rate as "逾期率",Overdue_rate_new as "新用户逾期率(金额)",Overdue_rate_old as "老用户逾期率(金额)" from ??'
    },
    channelPromotionInformation: {
      selectAll: "select * from ?? ",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select channel_name as "渠道商名称",channel_code as "渠道商编码",operator_name as "负责人",channel_tel as "联系方式",channel_province as "省份",channel_city as "城市",channel_area as "地区",charging_method as "计费方式",CREATE_TIME as "创建时间" from ??'
    },
    promotionInformation: {
      selectAll: "select * from ?? ",
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select realname as "推广员姓名",user_phone as "推广员电话",operator_name as "负责人",channel_tel as "联系方式",CREATE_TIME as "创建时间",rel_path as "推广二维码",remark as "推广链接" from ??'
    },
    registrationStatisticsReport: {
      selectAll: "select * from ?? ",
      orderBy: ' order by d_date desc',
      selectAllBack: " limit ?,?",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select d_date as "日期",register_num as "注册人数",loans_total as "放款总额(元)",loans_total_ouser as "老用户放款总额(元)",loans_total_nuser as "新用户放款总额(元)" from ??'
    },
    promotionStatisticsArea: {
      selectAllFront: "select * from ??",
      selectAllBack: " limit ?,?",
      order: " order by d_date desc",
      getCount: "select count(*) as count from ??",
      selectAllExcel:
        'select d_date as "日期", Province as "省份", city as "城市", register_num as "注册量", realname_auth_num as "实名认证",card_bound_num as "绑卡人数",emergency_contact_num as "紧急联系人",operator_auth_num as "运营商认证", Alipay_auth_num as "支付宝认证人数", Sesame_auth_num as "芝麻认证人数", jobinfo_auth_num as "工作信息", apply_loan_num as "申请借款人数",apply_succ_num as "申请成功人数", Pass_rate as "通过率", loan_amount as "放款金额(元)", blacklist_num as "黑名单人数", overdue_num as "逾期人数" from ?? '
    },
    promotionStatisticalChannel: {
      selectAllFront: 'select * from ??',
      selectAllBack: " limit ?,?",
      order: " order by d_date desc",
      getCount: 'select count(*) as count from ??',
      getSelectOptions: "select channel_trader_name from ?? group by channel_trader_name",
      selectAllExcel:
        'select d_date as "日期", channel_trader_name as "渠道商名称", settle_method as "结算方式", effe_cust_acqu_cost as "有效获客成本(元)",day_consumption as "当日消耗(元)",register_num as "注册量",all_fact_auth_num as "全要素认证人数",apply_loan_num as "申请借款人数",apply_loan_num_new as "新用户申请借款人数",apply_loan_num_old as "老用户申请借款人数",blacklist_num as "黑名单人数",nuser_apply_succ_num as "新用户申请成功人数", ouser_apply_succ_num as "老用户申请成功人数", nuser_loan_ratio as "新用户借款率",nuser_adoption_rate as "新用户通过率",nuser_loan_amount as "新用户放款金额(元)",ouser_adoption_rate as "老用户通过率",ouser_loan_amount as "老用户放款金额(元)",DUE_AMOUNT as "到期金额(元)",overdue_num as "逾期人数", OVERDUE_AMOUNT as "逾期金额(元)", BADDEBT_RATE as "坏账率", BADDEBT_amount as "坏账金额(元)", UNITGROSS_PROFIT as "单位毛利润(元)",baddebt_amount_unit as "单位坏账金额(元)" from ??'
    }
  },
  // 闪电卡
  flashCard: {
    market: {
      dailyPromotionEffect: {
        selectAllFront: 'select channel_name,d_date,unit_price,channel_consumption,pv,uv,click_num,click_people,register_num,uv_conversion_rate,click_conversion_rate,uv_output_value,register_conversion_rate,element4_authentication,credit_suss_num,credit_fail_num,hmd_num,hmd_rate,nuser_buy_num,ouser_buy_num,buy_num,nuser_buy_rate,ouser_buy_rate,nuser_buyback_num,ouser_buyback_num,nuser_buyback_rate,ouser_buyback_rate,nuser_buycard_num,nuser_buyback_apply_num,ouser_buycard_num,ouser_buyback_apply_num,nuser_loan_amount,ouser_loan_amount,loan_amount,overdue_amount,overdue_rate,recovery_rate,bad_debt_rate,unit_bad_debts,average_price,credit_cost,annual_rate,annual_income,interest,new_customer_cost,new_unit_maori,update_time from ?? where channel_code <> "000" ',
        selectAllBack: " limit ?,?",
        getCount: 'select count(*) as count from ?? where channel_code <> "000" ',
        getSelectOptions: 'select channel_name from ?? where channel_code <> "000" group by channel_name',
        order: " order by d_date desc",
        selectAllExcel:
          'select channel_name as "渠道名称",d_date as "日期",unit_price as "结算单价(元)",channel_consumption as "渠道消耗(元)",pv as "PV数量",uv as "UV数量",click_num as "点击次数",click_people as "点击人数",register_num as "注册数",uv_conversion_rate as "UV转化率",click_conversion_rate as "点击转化率",uv_output_value as "UV产值",register_conversion_rate as "注册转化率",element4_authentication as "全要素认证数",credit_suss_num as "授信成功人数",credit_fail_num as "授信失败人数",hmd_num as "黑名单人数",hmd_rate as "黑名单率",nuser_buy_num as "新用户购买商品人数",ouser_buy_num as "老用户购买商品人数",buy_num as "购买总人数",nuser_buy_rate as "新用户购买率",ouser_buy_rate as "老用户购买率",nuser_buyback_num as "新用户回购成功人数",ouser_buyback_num as "老用户回购成功人数",nuser_buyback_rate as "新用户回购成功率",ouser_buyback_rate as "老用户回购成功率",nuser_buycard_num as "新用户购买会员卡数",nuser_buyback_apply_num as "新用户购买会员申请数",ouser_buycard_num as "老用户购买会员卡数",ouser_buyback_apply_num as "老用户购买会员申请数",nuser_loan_amount as "新用户放款金额(元)",ouser_loan_amount as "老用户放款金额(元)",loan_amount as "总放款金额(元)",overdue_amount as "逾期金额(元)",overdue_rate as "逾期率",recovery_rate as "催回率",bad_debt_rate as "坏账率",unit_bad_debts as "单位坏账额",average_price as "件均",credit_cost as "单位征信成本(元)",annual_rate as "年化率",annual_income as "年化收入(元)",interest as "利息(元)",new_customer_cost as "新用户单位获客成本(元)",new_unit_maori as "新用户单位毛利(元)",update_time as "更新时间" from ?? where channel_code <> "000" '
      },
      weeklyPromotionEffect: {
        selectAllFront: 'select channel_name,concat(date_format(d_date1,"%Y%m%d-"),date_format(d_date7,"%Y%m%d")) as w_week,unit_price,channel_consumption,pv,uv,click_num,click_people,register_num,uv_conversion_rate,click_conversion_rate,uv_output_value,register_conversion_rate,element4_authentication,credit_suss_num,credit_fail_num,hmd_num,hmd_rate,nuser_buy_num,ouser_buy_num,buy_num,nuser_buy_rate,ouser_buy_rate,nuser_buyback_num,ouser_buyback_num,nuser_buyback_rate,ouser_buyback_rate,nuser_buycard_num,nuser_buyback_apply_num,ouser_buycard_num,ouser_buyback_apply_num,nuser_loan_amount,ouser_loan_amount,loan_amount,overdue_amount,overdue_rate,recovery_rate,bad_debt_rate,unit_bad_debts,average_price,credit_cost,annual_rate,annual_income,interest,new_customer_cost,new_unit_maori,update_time from ?? where  channel_code <> "000" ',
        selectAllBack: " limit ?,?",
        getCount: 'select count(*) as count from ?? where channel_code <> "000" ',
        getSelectOptions: 'select channel_name from ?? where channel_code <> "000" group by channel_name',
        order: " order by w_week desc",
        selectAllExcel:
          'select channel_name as "渠道名称",concat(date_format(d_date1,"%Y%m%d-"),date_format(d_date7,"%Y%m%d")) as "周期",unit_price as "结算单价(元)",channel_consumption as "渠道消耗(元)",pv as "PV数量",uv as "UV数量",click_num as "点击次数",click_people as "点击人数",register_num as "注册数",uv_conversion_rate as "UV转化率",click_conversion_rate as "点击转化率",uv_output_value as "UV产值",register_conversion_rate as "注册转化率",element4_authentication as "全要素认证数",credit_suss_num as "授信成功人数",credit_fail_num as "授信失败人数",hmd_num as "黑名单人数",hmd_rate as "黑名单率",nuser_buy_num as "新用户购买商品人数",ouser_buy_num as "老用户购买商品人数",buy_num as "购买总人数",nuser_buy_rate as "新用户购买率",ouser_buy_rate as "老用户购买率",nuser_buyback_num as "新用户回购成功人数",ouser_buyback_num as "老用户回购成功人数",nuser_buyback_rate as "新用户回购成功率",ouser_buyback_rate as "老用户回购成功率",nuser_buycard_num as "新用户购买会员卡数",nuser_buyback_apply_num as "新用户购买会员申请数",ouser_buycard_num as "老用户购买会员卡数",ouser_buyback_apply_num as "老用户购买会员申请数",nuser_loan_amount as "新用户放款金额(元)",ouser_loan_amount as "老用户放款金额(元)",loan_amount as "总放款金额(元)",overdue_amount as "逾期金额(元)",overdue_rate as "逾期率",recovery_rate as "催回率",bad_debt_rate as "坏账率",unit_bad_debts as "单位坏账额",average_price as "件均",credit_cost as "单位征信成本(元)",annual_rate as "年化率",annual_income as "年化收入(元)",interest as "利息(元)",new_customer_cost as "新用户单位获客成本(元)",new_unit_maori as "新用户单位毛利(元)",update_time as "更新时间" from ?? where channel_code <> "000" '
      },
      monthlyPromotionEffect: {
        selectAllFront: 'select channel_name,y_year,mm_month,unit_price,channel_consumption,pv,uv,click_num,click_people,register_num,uv_conversion_rate,click_conversion_rate,uv_output_value,register_conversion_rate,element4_authentication,credit_suss_num,credit_fail_num,hmd_num,hmd_rate,nuser_buy_num,ouser_buy_num,buy_num,nuser_buy_rate,ouser_buy_rate,nuser_buyback_num,ouser_buyback_num,nuser_buyback_rate,ouser_buyback_rate,nuser_buycard_num,nuser_buyback_apply_num,ouser_buycard_num,ouser_buyback_apply_num,nuser_loan_amount,ouser_loan_amount,loan_amount,overdue_amount,overdue_rate,recovery_rate,bad_debt_rate,unit_bad_debts,average_price,credit_cost,annual_rate,annual_income,interest,new_customer_cost,new_unit_maori,update_time from ??  where channel_code <> "000" ',
        selectAllBack: " limit ?,?",
        getCount: 'select count(*) as count from ?? where channel_code <> "000" ',
        getSelectOptions: 'select channel_name from ?? where channel_code <> "000" group by channel_name',
        order: " order by mm_month desc",
        selectAllExcel:
          'select channel_name as "渠道名称",y_year as "年份",mm_month as "月份",unit_price as "结算单价(元)",channel_consumption as "渠道消耗(元)",pv as "PV数量",uv as "UV数量",click_num as "点击次数",click_people as "点击人数",register_num as "注册数",uv_conversion_rate as "UV转化率",click_conversion_rate as "点击转化率",uv_output_value as "UV产值",register_conversion_rate as "注册转化率",element4_authentication as "全要素认证数",credit_suss_num as "授信成功人数",credit_fail_num as "授信失败人数",hmd_num as "黑名单人数",hmd_rate as "黑名单率",nuser_buy_num as "新用户购买商品人数",ouser_buy_num as "老用户购买商品人数",buy_num as "购买总人数",nuser_buy_rate as "新用户购买率",ouser_buy_rate as "老用户购买率",nuser_buyback_num as "新用户回购成功人数",ouser_buyback_num as "老用户回购成功人数",nuser_buyback_rate as "新用户回购成功率",ouser_buyback_rate as "老用户回购成功率",nuser_buycard_num as "新用户购买会员卡数",nuser_buyback_apply_num as "新用户购买会员申请数",ouser_buycard_num as "老用户购买会员卡数",ouser_buyback_apply_num as "老用户购买会员申请数",nuser_loan_amount as "新用户放款金额(元)",ouser_loan_amount as "老用户放款金额(元)",loan_amount as "总放款金额(元)",overdue_amount as "逾期金额(元)",overdue_rate as "逾期率",recovery_rate as "催回率",bad_debt_rate as "坏账率",unit_bad_debts as "单位坏账额",average_price as "件均",credit_cost as "单位征信成本(元)",annual_rate as "年化率",annual_income as "年化收入(元)",interest as "利息(元)",new_customer_cost as "新用户单位获客成本(元)",new_unit_maori as "新用户单位毛利(元)",update_time as "更新时间" from ?? where channel_code <> "000" '
      },
      dailyPromotionEffectSummary: {
        selectAllFront: 'select channel_name,d_date,unit_price,channel_consumption,pv,uv,click_num,click_people,register_num,uv_conversion_rate,click_conversion_rate,uv_output_value,register_conversion_rate,element4_authentication,credit_suss_num,credit_fail_num,hmd_num,hmd_rate,nuser_buy_num,ouser_buy_num,buy_num,nuser_buy_rate,ouser_buy_rate,nuser_buyback_num,ouser_buyback_num,nuser_buyback_rate,ouser_buyback_rate,nuser_buycard_num,nuser_buyback_apply_num,ouser_buycard_num,ouser_buyback_apply_num,nuser_loan_amount,ouser_loan_amount,loan_amount,overdue_amount,overdue_rate,recovery_rate,bad_debt_rate,unit_bad_debts,average_price,credit_cost,annual_rate,annual_income,interest,new_customer_cost,new_unit_maori,update_time from ?? where channel_code = "000" ',
        selectAllBack: " limit ?,?",
        getCount: 'select count(*) as count from ?? where channel_code = "000" ',
        getSelectOptions: 'select channel_name from ?? group by channel_name',
        order: " order by d_date desc",
        selectAllExcel:
          'select channel_name as "渠道名称",d_date as "日期",unit_price as "结算单价(元)",channel_consumption as "渠道消耗(元)",pv as "PV数量",uv as "UV数量",click_num as "点击次数",click_people as "点击人数",register_num as "注册数",uv_conversion_rate as "UV转化率",click_conversion_rate as "点击转化率",uv_output_value as "UV产值",register_conversion_rate as "注册转化率",element4_authentication as "全要素认证数",credit_suss_num as "授信成功人数",credit_fail_num as "授信失败人数",hmd_num as "黑名单人数",hmd_rate as "黑名单率",nuser_buy_num as "新用户购买商品人数",ouser_buy_num as "老用户购买商品人数",buy_num as "购买总人数",nuser_buy_rate as "新用户购买率",ouser_buy_rate as "老用户购买率",nuser_buyback_num as "新用户回购成功人数",ouser_buyback_num as "老用户回购成功人数",nuser_buyback_rate as "新用户回购成功率",ouser_buyback_rate as "老用户回购成功率",nuser_buycard_num as "新用户购买会员卡数",nuser_buyback_apply_num as "新用户购买会员申请数",ouser_buycard_num as "老用户购买会员卡数",ouser_buyback_apply_num as "老用户购买会员申请数",nuser_loan_amount as "新用户放款金额(元)",ouser_loan_amount as "老用户放款金额(元)",loan_amount as "总放款金额(元)",overdue_amount as "逾期金额(元)",overdue_rate as "逾期率",recovery_rate as "催回率",bad_debt_rate as "坏账率",unit_bad_debts as "单位坏账额",average_price as "件均",credit_cost as "单位征信成本(元)",annual_rate as "年化率",annual_income as "年化收入(元)",interest as "利息(元)",new_customer_cost as "新用户单位获客成本(元)",new_unit_maori as "新用户单位毛利(元)",update_time as "更新时间" from ?? where channel_code = "000" '
      },
      weeklyPromotionEffectSummary: {
        selectAllFront: 'select channel_name,concat(date_format(d_date1,"%Y%m%d-"),date_format(d_date7,"%Y%m%d")) as w_week,unit_price,channel_consumption,pv,uv,click_num,click_people,register_num,uv_conversion_rate,click_conversion_rate,uv_output_value,register_conversion_rate,element4_authentication,credit_suss_num,credit_fail_num,hmd_num,hmd_rate,nuser_buy_num,ouser_buy_num,buy_num,nuser_buy_rate,ouser_buy_rate,nuser_buyback_num,ouser_buyback_num,nuser_buyback_rate,ouser_buyback_rate,nuser_buycard_num,nuser_buyback_apply_num,ouser_buycard_num,ouser_buyback_apply_num,nuser_loan_amount,ouser_loan_amount,loan_amount,overdue_amount,overdue_rate,recovery_rate,bad_debt_rate,unit_bad_debts,average_price,credit_cost,annual_rate,annual_income,interest,new_customer_cost,new_unit_maori,update_time from ?? where  channel_code = "000" ',
        selectAllBack: " limit ?,?",
        getCount: 'select count(*) as count from ?? where channel_code = "000" ',
        getSelectOptions: 'select channel_name from ?? group by channel_name',
        order: " order by w_week desc",
        selectAllExcel:
          'select channel_name as "渠道名称",concat(date_format(d_date1,"%Y%m%d-"),date_format(d_date7,"%Y%m%d")) as "周期",unit_price as "结算单价(元)",channel_consumption as "渠道消耗(元)",pv as "PV数量",uv as "UV数量",click_num as "点击次数",click_people as "点击人数",register_num as "注册数",uv_conversion_rate as "UV转化率",click_conversion_rate as "点击转化率",uv_output_value as "UV产值",register_conversion_rate as "注册转化率",element4_authentication as "全要素认证数",credit_suss_num as "授信成功人数",credit_fail_num as "授信失败人数",hmd_num as "黑名单人数",hmd_rate as "黑名单率",nuser_buy_num as "新用户购买商品人数",ouser_buy_num as "老用户购买商品人数",buy_num as "购买总人数",nuser_buy_rate as "新用户购买率",ouser_buy_rate as "老用户购买率",nuser_buyback_num as "新用户回购成功人数",ouser_buyback_num as "老用户回购成功人数",nuser_buyback_rate as "新用户回购成功率",ouser_buyback_rate as "老用户回购成功率",nuser_buycard_num as "新用户购买会员卡数",nuser_buyback_apply_num as "新用户购买会员申请数",ouser_buycard_num as "老用户购买会员卡数",ouser_buyback_apply_num as "老用户购买会员申请数",nuser_loan_amount as "新用户放款金额(元)",ouser_loan_amount as "老用户放款金额(元)",loan_amount as "总放款金额(元)",overdue_amount as "逾期金额(元)",overdue_rate as "逾期率",recovery_rate as "催回率",bad_debt_rate as "坏账率",unit_bad_debts as "单位坏账额",average_price as "件均",credit_cost as "单位征信成本(元)",annual_rate as "年化率",annual_income as "年化收入(元)",interest as "利息(元)",new_customer_cost as "新用户单位获客成本(元)",new_unit_maori as "新用户单位毛利(元)",update_time as "更新时间" from ?? where channel_code = "000" '
      },
      monthlyPromotionEffectSummary: {
        selectAllFront: 'select channel_name,y_year,mm_month,unit_price,channel_consumption,pv,uv,click_num,click_people,register_num,uv_conversion_rate,click_conversion_rate,uv_output_value,register_conversion_rate,element4_authentication,credit_suss_num,credit_fail_num,hmd_num,hmd_rate,nuser_buy_num,ouser_buy_num,buy_num,nuser_buy_rate,ouser_buy_rate,nuser_buyback_num,ouser_buyback_num,nuser_buyback_rate,ouser_buyback_rate,nuser_buycard_num,nuser_buyback_apply_num,ouser_buycard_num,ouser_buyback_apply_num,nuser_loan_amount,ouser_loan_amount,loan_amount,overdue_amount,overdue_rate,recovery_rate,bad_debt_rate,unit_bad_debts,average_price,credit_cost,annual_rate,annual_income,interest,new_customer_cost,new_unit_maori,update_time from ?? where channel_code = "000" ',
        selectAllBack: " limit ?,?",
        getCount: 'select count(*) as count from ?? where channel_code = "000" ',
        getSelectOptions: 'select channel_name from ?? group by channel_name',
        order: " order by mm_month desc",
        selectAllExcel:
          'select channel_name as "渠道名称",y_year as "年份",mm_month as "月份",unit_price as "结算单价(元)",channel_consumption as "渠道消耗(元)",pv as "PV数量",uv as "UV数量",click_num as "点击次数",click_people as "点击人数",register_num as "注册数",uv_conversion_rate as "UV转化率",click_conversion_rate as "点击转化率",uv_output_value as "UV产值",register_conversion_rate as "注册转化率",element4_authentication as "全要素认证数",credit_suss_num as "授信成功人数",credit_fail_num as "授信失败人数",hmd_num as "黑名单人数",hmd_rate as "黑名单率",nuser_buy_num as "新用户购买商品人数",ouser_buy_num as "老用户购买商品人数",buy_num as "购买总人数",nuser_buy_rate as "新用户购买率",ouser_buy_rate as "老用户购买率",nuser_buyback_num as "新用户回购成功人数",ouser_buyback_num as "老用户回购成功人数",nuser_buyback_rate as "新用户回购成功率",ouser_buyback_rate as "老用户回购成功率",nuser_buycard_num as "新用户购买会员卡数",nuser_buyback_apply_num as "新用户购买会员申请数",ouser_buycard_num as "老用户购买会员卡数",ouser_buyback_apply_num as "老用户购买会员申请数",nuser_loan_amount as "新用户放款金额(元)",ouser_loan_amount as "老用户放款金额(元)",loan_amount as "总放款金额(元)",overdue_amount as "逾期金额(元)",overdue_rate as "逾期率",recovery_rate as "催回率",bad_debt_rate as "坏账率",unit_bad_debts as "单位坏账额",average_price as "件均",credit_cost as "单位征信成本(元)",annual_rate as "年化率",annual_income as "年化收入(元)",interest as "利息(元)",new_customer_cost as "新用户单位获客成本(元)",new_unit_maori as "新用户单位毛利(元)",update_time as "更新时间" from ?? where channel_code = "000" '
      }
    }
  }
}

module.exports = sqlMap
