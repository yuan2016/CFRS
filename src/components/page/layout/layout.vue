<template>
  <div class="app-wrapper">
    <el-container class="container">
      <el-header class="header">
        <div class="header_logo"></div>
        <el-dropdown class="product" v-if="this.productNames.length>1" @command="handleCommand" trigger="click">
          <span class="el-dropdown-link">{{currentProduct}}<i class="el-icon-arrow-down el-icon--right"></i></span>
          <el-dropdown-menu slot="dropdown" class="chooseProject">
            <el-dropdown-item v-for="p in this.productNames" :key="p" :command="p">{{p}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span class="color-picker">
          <span class="color-picker-container" @click="changeColorShow">
            <i class="el-icon-arrow-down"></i>
          </span>
          <el-form :model="colorsArray" v-if="isColorShow" :label-position="labelPosition" label-width="100px"
                   class="color-picker-form" :rules="colorsRules" ref="colorsForm">
            <el-form-item label="可选方案:" class="color-picker-select">
              <span class="color1" @click="changToColor1"></span>
              <span class="color2" @click="changToColor2"></span>
            </el-form-item>
            <el-form-item label="自定义方案" class="color-picker-title"></el-form-item>
            <el-form-item prop="backgroundColor" label="菜单背景色:">
              <el-color-picker v-model="colorsArray.backgroundColor" size="mini"
                               class="color-picker-item"></el-color-picker>
            </el-form-item>
            <el-form-item prop="textColor" label="文字颜色:">
              <el-color-picker v-model="colorsArray.textColor" size="mini" class="color-picker-item"></el-color-picker>
            </el-form-item>
            <el-form-item prop="activeColor" label="选中颜色:">
              <el-color-picker v-model="colorsArray.activeColor" size="mini"
                               class="color-picker-item"></el-color-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" class="color-save" @click="submitColors">保存</el-button>
                <el-button size="mini" class="color-reset" @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </span>
        <span class="name" v-if="name" @click="handleEdit">{{sliceName(name)}}</span>
        <i class="elextra-icon-leave" @click="isLeave = true"></i>
      </el-header>
      <el-container class="main-container">
        <el-aside width="180px" class="aside" :class="{closeAside:isCollapse}"
                  :style="{ backgroundColor: colorsArray.backgroundColor, color: colorsArray.textColor}">
          <div class="toggle" @click="changeToggle" :class="{closeToggle:isCollapse}"
               :style="{ backgroundColor: colorsArray.backgroundColor}">
            <span class="product-name-show" v-if="!isCollapse">{{currentProduct}}</span>
            <i class="elextra-icon-openBar" v-if="isCollapse"></i>
            <i class="elextra-icon-closeBar" v-else></i>
          </div>
          <el-menu :background-color="colorsArray.backgroundColor" :text-color="colorsArray.textColor"
                   :active-text-color="colorsArray.activeColor"
                   :default-active="handlePath($route.path)" router unique-opened class="menu"
                   :class="{closeMenu:isCollapse}"
                   :collapse="isCollapse">
            <template v-for="item in permission_routers">
              <el-menu-item :index="item.path" v-if="!item.hidden&&item.noDropdown" :key="item.path">
                <i :class="item.icon" :style="{ color: colorsArray.textColor}"></i>
                <span slot="title">{{item.name}}</span>
              </el-menu-item>
              <el-submenu v-else-if="!item.hidden" :index="item.path"  :key="item.path">
                <template slot="title">
                  <i :class="item.icon" :style="{ color: colorsArray.textColor}"></i>
                  <span slot="title">{{item.name}}</span>
                </template>
                <template v-for="it in item.children">
                  <el-menu-item :index="it.path" v-if="!it.hidden&&it.noDropdown" :key="it.path">
                    <i :class="it.icon" :style="{ color: colorsArray.textColor}"></i>
                    <span slot="title">{{it.name}}</span>
                  </el-menu-item>
                  <el-submenu v-else-if="!it.hidden&&it.children" :index="it.path" :key="it.path">
                    <template slot="title">
                      <i :class="it.icon" :style="{ color: colorsArray.textColor}"></i>
                      <span slot="it">{{it.name}}</span>
                    </template>
                    <template v-for="i in it.children">
                      <el-menu-item :index="i.path" v-if="!i.hidden" :key="i.path">
                        <i :class="i.icon" :style="{ color: colorsArray.textColor}"></i>
                        <span slot="title">{{i.name}}</span>
                      </el-menu-item>
                    </template>
                  </el-submenu>
                  <el-menu-item :index="it.path" v-else-if="!it.hidden" :key="it.path">
                    <i :class="it.icon" :style="{ color: colorsArray.textColor}"></i>
                    <span slot="title">{{it.name}}</span>
                  </el-menu-item>
                </template>
              </el-submenu>
            </template>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <transition name="fade">
      <div class="detail" v-show="isShowDetail">
        <div class="detail-wrapper">
          <div class="detial-main">
            <div class="main-header clearfix">
              <span class="avatar">
                <i class="elextra-icon-avatar"></i>
              </span>
              <span class="company-name">上海灿福信息科技发展有限公司</span>
            </div>
            <div class="main-content">
              <el-form :model="ruleForm" :label-position="labelPosition" ref="ruleForm" :rules="loginRules"
                       label-width="50px" class="ruleForm">
                <el-form-item label="姓名:">
                  <el-input size="small" disabled class="form-input" v-model="ruleForm.user_name"></el-input>
                </el-form-item>
                <el-form-item label="性别:">
                  <el-radio-group disabled v-model="ruleForm.user_sex">
                    <el-radio label="男"></el-radio>
                    <el-radio label="女"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="部门:">
                  <el-select class="form-input" disabled v-model="ruleForm.department" placeholder="请选择所属部门">
                    <el-option label="外部" value="外部"></el-option>
                    <el-option label="总经办" value="总经办"></el-option>
                    <el-option label="财务部" value="财务部"></el-option>
                    <el-option label="商务部" value="商务部"></el-option>
                    <el-option label="招财猫" value="招财猫"></el-option>
                    <el-option label="数据中心" value="数据中心"></el-option>
                    <el-option label="技术中心" value="技术中心"></el-option>
                    <el-option label="电催中心" value="电催中心"></el-option>
                    <el-option label="运营中心(运营)" value="运营中心(运营)"></el-option>
                    <el-option label="运营中心(市场)" value="运营中心(市场)"></el-option>
                    <el-option label="产品中心" value="产品中心"></el-option>
                    <el-option label="机构商务部" value="机构商务部"></el-option>
                    <el-option label="人力行政中心" value="人力行政中心"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="邮箱:">
                  <el-input size="small" disabled class="form-input" v-model="ruleForm.user_email"></el-input>
                </el-form-item>
                <el-form-item prop="user_mobile" label="电话:">
                  <el-input size="small" class="form-input" v-model="ruleForm.user_mobile"></el-input>
                </el-form-item>
                <el-form-item class="long-form">
                  <el-button type="primary" size="small" class="layout-button" @click="submitForm('ruleForm')">
                    立即修改
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div class="detail-close">
          <i class="el-icon-close" @click.stop.prevent="closeDetial"></i>
        </div>
      </div>
    </transition>
    <div class="backToTop" @click="goToTop">
      <div class="elextra-icon-rocket"></div>
      <span>返回顶部</span>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="isLeave"
      width="30%"
      center>
      <span>是否要退出？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="isLeave = false">取 消</el-button>
    <el-button type="primary" @click="jumpToLogin">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {clearToken, getEmail} from '../../../common/js/storage'
  import {mapState, mapGetters} from 'vuex'
  import {updateColors, getColors} from '../../../common/js/api'

  const color1 = ['#324157', '#bfcbd9', '#409EFF']
  const color2 = ['#fff', '#878d99', '#409EFF']

  export default {
    data() {
      const validatePhone = (rule, v, callback) => {
        if (!v) {
          callback()
        } else {
          if (!(/^1[34578]\d{9}$/).test(v.split('-').join(''))) {
            callback(new Error('手机格式有误'))
          } else {
            callback()
          }
        }
      }
      return {
        colorsArray: {
          backgroundColor: '',
          textColor: '',
          activeColor: ''
        },
        isColorShow: false,
        isCollapse: false,
        ruleForm: {
          user_name: '',
          user_sex: '',
          department: '',
          user_email: '',
          user_mobile: ''
        },
        isLeave: false,
        labelPosition: 'right',
        isShowDetail: false,
        loginRules: {
          user_mobile: [
            {required: true, trigger: 'change', validator: validatePhone}
          ]
        },
        colorsRules: {
          backgroundColor: [
            {required: true, trigger: 'change'}
          ],
          textColor: [
            {required: true, trigger: 'change'}
          ],
          activeColor: [
            {required: true, trigger: 'change'}
          ]
        },
        productNameShow: '选择产品'
      }
    },
    methods: {
      //选择产品的方法
      handleCommand(command) {
        let key
        let value
        let roles = {}
        if (command === '开心钱包') {
          value = this.$store.getters.table.split('|')
          key = 0
        } else if (command === '企鹅抓娃娃') {
          value = this.$store.getters.table1.split('|')
          key = 1
        } else if (command === '开心拍卖') {
          value = this.$store.getters.table2.split('|')
          key = 2
        } else {
          value = this.$store.getters.table3.split('|')
          key = 3
        }
        roles.key = key
        roles.value = value
        this.productNameShow = command
        this.$store.dispatch('GenerateRoutes', {roles}).then(() => { // 生成可访问的路由表
          this.$router.addRoutes(this.$store.getters.addRouters) // 动态添加可访问路由表
          // this.$router.next(this.$router.to.path) // hack方法 确保addRoutes已完成
        })
      },
      changToColor1() {
        this.backgroundColor = color1[0]
        this.colorsArray.backgroundColor = color1[0]
        this.textColor = color1[1]
        this.colorsArray.textColor = color1[1]
        this.activeColor = color1[2]
        this.colorsArray.activeColor = color1[2]
      },
      changToColor2() {
        this.backgroundColor = color2[0]
        this.colorsArray.backgroundColor = color2[0]
        this.textColor = color2[1]
        this.colorsArray.textColor = color2[1]
        this.activeColor = color2[2]
        this.colorsArray.activeColor = color2[2]
      },
      submitColors() {
        this.$refs['colorsForm'].validate((valid) => {
          if (valid) {
            return updateColors({colors: this.colorsArray, phone: this.phone}).then((res) => {
              if (res.data !== 200) {
                this.isColorShow = false
                this.$message({
                  message: '未修改成功',
                  type: 'warning'
                })
              } else {
                this.isColorShow = false
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              }
            })
          }
        })
      },
      getColors() {
        return getColors({phone: this.phone}).then((res) => {
          if (res.data[0].colors) {
            let colors = res.data[0].colors.split('|||')
            this.colorsArray.backgroundColor = colors[0]
            this.colorsArray.textColor = colors[1]
            this.colorsArray.activeColor = colors[2]
          } else {
            this.colorsArray.backgroundColor = color1[0]
            this.colorsArray.textColor = color1[1]
            this.colorsArray.activeColor = color1[2]
          }
        }).catch(() => {
          this.colorsArray.backgroundColor = color1[0]
          this.colorsArray.textColor = color1[1]
          this.colorsArray.activeColor = color1[2]
        })
      },
      resetForm() {
        this.changToColor1()
      },
      changeColorShow() {
        this.isColorShow = !this.isColorShow
      },
      handlePath(path) {
        switch (path) {
          case '/main/index':
            return '/main'
          case '/RMAB/market/newUserPassRate/tab1':
            return '/RMAB/market/newUserPassRate'
          case '/RMAB/market/newUserPassRate/tab2':
            return '/RMAB/market/newUserPassRate'
          case '/RMAB/market/newUserPassRate/tab3':
            return '/RMAB/market/newUserPassRate'
          case '/RMAB/market/newUserPassRate/loanThroughRate':
            return '/RMAB/market/newUserPassRate'
          case '/RMAB/market/newUserPassRate/loanThroughRateAll':
            return '/RMAB/market/newUserPassRate'
          case '/RMAB/riskManagement/riskControlFactorAnalysis':
            return '/RMAB/riskManagement/riskControlFactorAnalysis'
          case '/RMAB/riskManagement/riskControlFactorAnalysisWeek':
            return '/RMAB/riskManagement/riskControlFactorAnalysis'
          case '/RMAB/riskManagement/riskControlFactorAnalysisMonth':
            return '/RMAB/riskManagement/riskControlFactorAnalysis'
          default:
            return path
        }
      },
      sliceName(name) {
        if (name.length > 2) {
          return name.slice(1)
        } else {
          return name
        }
      },
      changeToggle() {
        this.isCollapse = !this.isCollapse
      },
      handleEdit() {
        this.ruleForm.user_mobile = this.phone
        this.isShowDetail = !this.isShowDetail
      },
      closeDetial() {
        this.isShowDetail = !this.isShowDetail
      },
      goToTop() {
        document.getElementsByClassName('backToTop')[0].style.display = 'block'
//        $('html, body'). ({scrollTop: 0}, 400)
        document.body.style.scrollTop = 0
        document.body.style.transition = 'all 0.4s ease'
      },
      jumpToLogin() {
        clearToken()
        this.clearTable()
        this.clearInitTable()
        this.$router.push({path: '/login'})
        window.sessionStorage.clear()
        this.$store.dispatch('deleteTable')
      },
      clearTable() {
        this.$store.dispatch('clearTable')
      },
      clearInitTable() {
        this.$store.dispatch('clearInitTable')
      },
      showRocket() {
        let scrollT = document.documentElement.scrollTop || document.body.scrollTop
        if (scrollT > 100) {
          document.getElementsByClassName('backToTop')[0].style.display = 'block'
        } else {
          document.getElementsByClassName('backToTop')[0].style.display = 'none'
        }
      },
      submitForm() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.axios.post('/api/modifyInfo', {
              formData: this.ruleForm
            }).then((response) => {
              if (response.data.code === '404') {
                this.$router.push('./404')
              } else if (response.data.code === '1024') {
                this.$message({
                  message: '请求超时，请刷新页面重试',
                  type: 'warning'
                })
              } else {
                if (response.data === 200) {
                  this.setInfo(this.ruleForm)
                  this.$message({
                    message: '修改信息成功',
                    type: 'success'
                  })
                  this.isShowDetail = false
                } else {
                  this.$message({
                    message: '修改信息失败，请重试',
                    type: 'warning'
                  })
                  this.isShowDetail = false
                }
              }
            })
          }
        })
      },
      clickHide() {
        let _this = this
        document.getElementsByClassName('container')[0].onclick = function (e) {
          e = e || window.event
          let target = e.target || e.srcElement
          let colorPicker = document.getElementsByClassName('color-picker')[0]
          let header = document.getElementsByClassName('header')[0]
          let flagA = _this.isColorShow && header.contains(target) && !colorPicker.contains(target)
          let flagB = _this.isColorShow && !header.contains(target) && !target.contains(colorPicker)
          if (flagA || flagB) {
            _this.isColorShow = !_this.isColorShow
          }
        }
      }
    },
    created() {
      this.getColors()
      this.ruleForm.user_name = this.name
      this.ruleForm.user_sex = this.sex
      this.ruleForm.department = this.department
      this.ruleForm.user_email = this.email
      this.ruleForm.user_mobile = this.phone
    },
    mounted() {
      this.showRocket()
      window.onscroll = this.showRocket
      this.clickHide()
    },
    computed: {
      ...mapGetters([
        'permission_routers'
      ]),
      ...mapState({
        name: state => state.user.name,
        sex: state => state.user.sex,
        department: state => state.user.department,
        email: state => getEmail() + '@xianjinkd.com',
        phone: state => state.user.phone,
        productNames: state => state.user.productName,
        currentProduct: state => state.permission.currentProduct
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .app-wrapper
    min-width: 783px
    width: 100%
    height: 100%
    background-color: #e4e4e4
    font-size: 12px
    box-sizing: border-box
    .container
      height: 100%
      .header
        position: relative
        line-height: 60px
        margin-bottom 10px
        background-color: #ffffff
        z-index:98
        .header_logo
          display: inline-block
          margin-left: 20px
          margin-top: 3px
          width: 136px
          height: 51px
          background-image url(../../../../resource/image/logo.png)
          background-size: cover
          background-repeat: no-repeat
          background-position: center center
        .product
          position :absolute
          right:245px
          top:3px
        .elextra-icon-table
          display: inline-block
          font-size: 35px
          line-height: 60px
          color: #409EFF
        .title
          position: relative
          top: -7px
          font-size: 25px
          color: #999
        .color-picker
          position: absolute
          top: 18px
          right: 180px
          width: 26px
          height: 26px
          text-align: center
          cursor: pointer
          border-radius: 4px
          border: 1px double #e6e6e6
          .color-picker-container
            position: absolute
            left: 2px
            top: 2px
            width: 20px
            height: 20px
            border-radius: 4px
            border: 1px double #e6e6e6
            background-color #409EFF
            i
              position absolute
              top: 4px
              left: 3px
              font-size: 14px
              color: #fff
          .color-picker-form
            position: absolute
            /*top: 150%*/
            top: 63px
            left: -80px
            z-index: 100
            padding: 10px 10px 0 10px
            border: 1px solid #cccccc
            border-radius: 4px
            background-color: #fff
            .color-picker-select
              .color1, .color2
                display: inline-block
                width: 15px
                height 15px
                border: 1px solid #666666
                border-radius: 4px
              .color1
                background-color: #324157
              .color2
                background-color: #fff
            .color-picker-title
              position :relative
              left:25px
            .color-save
              position: relative
              top: 20px
              left: -70px
            .color-reset
              position: relative
              left: 0px
              top: -20px
            .el-form-item
              margin-bottom: 10px
        .name
          position: absolute
          top: 10px
          right: 100px
          display: inline-block
          width: 40px
          line-height: 40px
          text-align: center
          font-size 16px
          border-radius: 50%
          background-color: #409EFF
          color: #fff
          cursor: pointer
        .elextra-icon-leave
          display: inline-block
          position: absolute
          right: 40px
          top: 20px
          font-size: 25px
          color: #cccccc
          cursor: pointer
          &:hover
            color: #ff4949
      .main-container
        height: 100%
        width: 100%
        overflow: hidden
        .aside
          z-index: 99
          transition: all .33s ease
          background-color: #333744
          border-radius: 0 10px 0 0
          .toggle
            position: absolute
            top: 70px
            left: 0
            width: 161px
            line-height: 30px
            text-align: center
            transition: all .33s ease
            background-color: #4A5064
            z-index: 99
            border-radius: 0 10px 0 0
            i
              font-size: 14px
              line-height 14px
              padding-left: 14px
            &:hover
              color: #666
          .closeToggle
            background-color: #409EFF
            width: 40px
            i
              padding-left: 5px
          .menu
            position: relative
            top: 30px
            border: none
            transition: all .33s ease
            li
              i
                position: relative
                left: -10px
          .closeMenu
            width: 40px !important
          .el-menu--collapse
            width: 40px
        .closeAside
          width: 40px !important
          overflow: visible
          li
            width: 40px
        .main
          margin-left: 10px
          background-color: #fff
          border-radius: 10px 0 0 0
    .detail
      position: fixed
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: 2001
      overflow: auto
      background: rgba(0, 0, 0, 0.5)
      backdrop-filter: blur(10px)
      &.fade-enter-active
        transition: all .4s linear
      &.fade-leave-active
        opacity: 0
        transition: all .4s linear
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
          transform: translate(-50%, -50%)
          width: 400px
          height: 570px
          border-radius: 5px
          text-align: left
          background-color: #fff
          .main-header
            box-sizing: border-box
            border: 1px solid #277cd4
            border-radius: 4px 4px 0 0
            width: 100%
            height: 100px
            background-color: #277cd4
            padding-top: 20px
            .avatar
              position: relative
              left: -25px
              top: -10px
              display: inline-block
              float: left
              box-sizing: border-box
              width: 150px
              height: 100%
              text-align: center
              .elextra-icon-avatar
                display: inline-block
                width: 70px
                height: 70px
                color: #1f2d3d
                font-size: 50px
                line-height: 70px
                border: 3px solid #bfcbd9
                border-radius: 50%
                background-color: #fff
            .company-name
              display: inline-block
              width: 300px
              height: 100%
              padding-left: 17px
              line-height: 50px
              margin-left: -70px
              font-size: 20px
              color: #ffffff
          .main-content
            padding: 30px 20px 0 40px
            .ruleForm
              display: inline-block
              margin-right: 60px
              width: 160px
              .form-input
                width: 220px
              .long-form
                width: 300px
                .layout-button
                  position: relative
                  width: 103px
                  .elextra-icon-toRight
                    position: absolute
                    right: -6px
                    top: 4px
                    font-size: 17px
                    color: #ffffff
          .elextra-icon-lock
            display: inline-block
            position: absolute
            top: 65px
            right: 15px
            padding: 3px
            font-size: 30px
            .elextra-icon-lock
              display: inline-block
              margin-right: 5px
      .detail-close
        position: absolute
        top: 50px
        right: 150px
        padding-top: 16px
        width: 32px
        height: 32px
        font-size: 32px
        color: rgba(255, 255, 255, 0.5)

    .backToTop
      display: none
      position: fixed
      bottom: 40px
      right: 20px
      color: #5B5B5B
      opacity: .5
      &:hover
        color: #409EFF
      .elextra-icon-rocket
        width: 40px
        height: 40px
        margin: 0 auto
        font-size: 40px
      span
        font-size: 13px

  .el-aside, .el-main
    overflow: auto

  .chooseProject
    z-index:98!important

</style>
