<template>
  <div class="login" v-if="showPC">
    <div class="main">
      <div class="header">
        <div class="header_logo">
        </div>
      </div>
      <div class="content">
        <div class="login_info">
          <transition name="form-fade" mode="in-out">
            <section class="form_contianer" v-if="showLoginPhone">
              <div class="form_title">
                <p>账号登录</p>
              </div>
              <el-form ref="loginForm" class="loginForm" :rules="loginRules" :model="loginForm">
                <el-form-item prop="phoneNumber" class="loginPhoneNumber">
                  <el-input type="text" placeholder="请输入手机号" v-model="loginForm.phoneNumber">
                  </el-input>
                     <!-- <span class="message" @click="changeModel">使用邮箱登录</span> -->
                </el-form-item>
                <el-form-item prop="picCode" class="picCode">
                  <el-input type="picCode" placeholder="请输入右侧验证码" v-model="loginForm.picCode">
                  </el-input>
                  <div class="code-refresh" @click="refreshCode" title="点击刷新"></div>
                </el-form-item>
                <el-form-item prop="messageCode" class="messageCode">
                  <el-input type="messageCode" placeholder="请输入短信验证码" v-model="loginForm.messageCode"
                            @keyup.enter.native="jumpTo({path:'/main'})">
                  </el-input>
                  <span class="message message-code" @click="getCode" v-if="isCode">获取短信验证码</span>
                  <span class="message" v-else>重新发送({{restTime}}s)</span>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" class="submit_btn" @click.stop.prevent="jumpTo({path:'/main'})">登录
                  </el-button>
                </el-form-item>
              </el-form>
            </section>
            <section class="form_contianer_email" v-else>
              <div class="form_title">
                <p>账号登录</p>
              </div>
              <el-form ref="loginForm2" class="loginForm" :rules="loginRules2" :model="loginForm2">
                <el-form-item prop="email" class="loginEmail">
                  <el-input type="text" placeholder="邮箱" v-model="loginForm2.email">
                  </el-input>
                  <span class="suffix">@xianjinkd.com</span>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input type="password" placeholder="密码" v-model="loginForm2.password"
                            @keyup.enter.native="jumpTo2({path:'/main'})"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" class="submit_btn" @click.stop.prevent="jumpTo2({path:'/main'})">登录
                  </el-button>
                </el-form-item>
              </el-form>
            </section>
          </transition>
        </div>
      </div>
      <div class="footer">
        <p>©2017 上海灿福信息科技发展集团有限公司</p>
      </div>
    </div>
  </div>
  <div class="loginApp" v-else>
    <div class="main">
      <div class="header">
        <div class="logo">
          <i class="elextra-icon-table"></i>
        </div>
        <div class="title">
          <p>灿福报表平台</p>
        </div>
      </div>
      <div class="content">
        <transition name="form-fade" mode="in-out">
          <section class="form_contianer" v-if="showLoginPhone">
            <el-form ref="loginForm" class="loginForm" :rules="loginRules" :model="loginForm">
              <el-form-item prop="phoneNumber" class="loginPhoneNumber">
                <el-input type="text" placeholder="请输入手机号" v-model="loginForm.phoneNumber">
                </el-input>
              </el-form-item>
              <el-form-item prop="picCode" class="picCode">
                <el-input type="picCode" placeholder="请输入右侧验证码" v-model="loginForm.picCode">
                </el-input>
                <div class="code-refresh" @click="refreshCode" title="点击刷新"></div>
              </el-form-item>
              <el-form-item prop="messageCode" class="messageCode">
                <el-input type="messageCode" placeholder="请输入短信验证码" v-model="loginForm.messageCode"
                          @keyup.enter.native="jumpTo({path:'/main'})">
                </el-input>
                <span class="message message-code" @click="getCode" v-if="isCode">获取短信验证码</span>
                <span class="message" v-else>重新发送({{restTime}}s)</span>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="submit_btn" @click.stop.prevent="jumpTo({path:'/main'})">登录
                </el-button>
              </el-form-item>
            </el-form>
          </section>
        </transition>
      </div>
      <div class="footer">
        <p>©2017 上海灿福信息科技发展集团有限公司</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {saveToken, saveEmail, savePhone, getEmail} from '../../../common/js/storage'
  import md5 from 'js-md5'
  import {isCfEmail} from '../../../common/js/validate'

  export default {
    data() {
      const validatePhoneNumber = (rule, value, callback) => {
        let reg = /^[1][3,4,5,7,8][0-9]{9}$/
        if (!value) {
          callback(new Error('手机号不能为空'))
        } else if (!reg.test(value.trim())) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
      const validatePicCode = (rule, value, callback) => {
        if (value.length !== 4) {
          callback(new Error('图形验证码为4位'))
        } else {
          callback()
        }
      }
      const validateMessageCode = (rule, value, callback) => {
        if (value.length !== 6) {
          callback(new Error('短信验证码为6位'))
        } else {
          callback()
        }
      }
      const validateEmail = (rule, value, callback) => {
        if (!isCfEmail(value + '@xianjinkd.com')) {
          callback(new Error('请输入正确的合法邮箱'))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能小于6位'))
        } else {
          this.isValidatedPassword = true
          callback()
        }
      }
      return {
        loginForm: {
          phoneNumber: '',
          picCode: '',
          messageCode: ''
        },
        restTime: 60,
        codeId: '',
        isCode: true,
        showLoginPhone: true,
        loading: false,
        svg: '',
        isValidatedPassword: false,
        loginRules: {
          phoneNumber: [
            {required: true, trigger: 'blur', validator: validatePhoneNumber}
          ],
          picCode: [
            {required: true, trigger: 'blur', validator: validatePicCode}
          ],
          messageCode: [
            {required: true, trigger: 'blur', validator: validateMessageCode}
          ]
        },
        loginForm2: {
          email: getEmail() || '',
          password: ''
        },
        loginRules2: {
          email: [
            {required: true, trigger: 'blur', validator: validateEmail}
          ],
          password: [
            {required: true, trigger: 'change', validator: validatePass}
          ]
        },
        showPC: true
      }
    },
    created() {
      if (this.showLoginPhone) {
        this.getPicCode()
      }
    },
    mounted () {
      this.showOne()
      window.onresize = this.showOne
    },
    methods: {
      judgeTime() {
        let d = new Date()
        let h = d.getHours()
        if (h > 0 && h <= 5) {
          return '凌晨好'
        } else if (h > 5 && h <= 12) {
          return '上午好'
        } else if (h > 12 && h <= 19) {
          return '下午好'
        } else if (h > 19 && h <= 24) {
          return '晚上好'
        } else {
          return '你好'
        }
      },
      changeModel() {
        this.showLoginPhone = false
        document.getElementsByClassName('picCode')[0].removeChild(document.getElementsByTagName('svg')[0])
      },
      genNonDuplicateID() {
        this.codeId = Date.now().toString() + Math.random().toString(36).substr(3)
      },
      refreshCode() {
        document.getElementsByClassName('picCode')[0].removeChild(document.getElementsByTagName('svg')[0])
        this.getPicCode()
      },
      getPicCode() {
        this.genNonDuplicateID()
        this.axios.get('/api/getPicCode?codeId=' + this.codeId).then((res) => {
          this.svg = res.data
          let $pic = document.getElementsByClassName('picCode ')[0]
          if (document.getElementsByClassName('picCode').length === 1) {
            $pic.insertAdjacentHTML('beforeEnd', this.svg)
          }
        })
      },
      getCode() {
        if (!this.loginForm.phoneNumber || !(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.loginForm.phoneNumber.trim()))) {
          this.$message({
            message: '请输入正确的手机号',
            type: 'warning'
          })
        } else if (this.loginForm.picCode.length !== 4) {
          this.$message({
            message: '请输入正确的验证码',
            type: 'warning'
          })
        } else {
          this.axios.post('/api/getVerificationCode', {phoneNumber: this.loginForm.phoneNumber}).then((res) => {
            if (res.data.code === 1020 || res.data.code === 2000) {
              this.$message({
                message: '请求异常，请刷新重试',
                type: 'warning'
              })
            } else if (res.data.code === 4002) {
              this.$message({
                message: '一分钟内不能多次登录',
                type: 'warning'
              })
            } else if (res.data.code === 4000) {
              this.$message({
                message: '短信验证码发送错误，请刷新后重试',
                type: 'warning'
              })
            } else if (res.data.code === 100008 || res.data.code === 200008) {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            } else {
              this.isCode = true
              this.$message({
                message: '验证码发送成功',
                type: 'success'
              })
              this.waitCode()
            }
          })
        }
      },
      waitCode() {
        this.isCode = false
        if (this.restTime === 0) {
          this.isCode = true
          this.restTime = 60
          return false
        } else {
          this.restTime--
        }
        setTimeout(this.waitCode, 1000)
      },
      jumpTo(path) {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.axios.post('/api/login', {
              phoneNumber: this.loginForm.phoneNumber,
              codeId: this.codeId,
              picCode: this.loginForm.picCode,
              messageCode: this.loginForm.messageCode
            }).then((response) => {
              if (response.data.code === 1020 || response.data.code === 2000) {
                this.$message({
                  message: '请求异常，请刷新重试',
                  type: 'warning'
                })
              } else if (response.data.code === 1021) {
                this.$message.error('不存在此用户')
              } else if (response.data.code === 1022) {
                this.$message.error('有多个用户公用此号码，请联系管理员')
              } else if (response.data.code === 3000) {
                this.$message.error('图形验证码错误')
              } else if (response.data.code === 3001) {
                this.$message.error('图形验证码过期')
              } else if (response.data.code === 4000) {
                this.$message.error('短信验证码错误')
              } else if (response.data.code === 4001) {
                this.$message.error('短信验证码过期')
              } else {
                let resData = response.data
                saveToken(resData.token)
                savePhone(this.loginForm.phoneNumber)
                this.$router.push(path)
                this.$message({
                  message: resData.name + this.judgeTime() + ',欢迎进入报表系统',
                  type: 'success'
                })
                setTimeout(() => {
                  this.$notify({
                  title: '提示',
                  message: '请在右上角下拉菜单中选择相应产品',
                  duration: 3500,
                  type: 'success',
                  offset: 50
                  })
                }, 1000)
              }
            })
          } else {
            this.$message({
              message: '请检查输入是否符合规则',
              type: 'warning'
            })
          }
        })
      },
      jumpTo2(path) {
        this.$refs['loginForm2'].validate((valid) => {
          if (valid) {
            this.axios.post('/api/loginEmail', {
              email: this.loginForm2.email + '@xianjinkd.com',
              password: md5(this.loginForm2.password)
            }).then((response) => {
              if (response.data === 400) {
                this.$message({
                  message: '用户不存在',
                  type: 'warning'
                })
              } else if (response.data === 300) {
                this.$message.error('密码错误')
              } else {
                let resData = response.data
                saveToken(resData.token)
                saveEmail(this.loginForm2.email)
                this.$router.push(path)
                this.$message({
                  message: resData.name + this.judgeTime() + ',欢迎进入报表系统',
                  type: 'success'
                })
                setTimeout(() => {
                  this.$notify({
                  title: '提示',
                  message: '请在右上角下拉菜单中选择相应产品',
                  type: 'success',
                  duration: 3500,
                  offset: 50
                  })
                }, 1000)
              }
            })
          } else {
            this.$message({
              message: '请检查输入是否符合规则',
              type: 'warning'
            })
          }
        })
      },
      showOne () {
        let wid = document.body.clientWidth
        if (wid < 800) {
          this.showPC = false
        } else {
          this.showPC = true
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .login
    position: relative
    width: 100%
    height: 100%
    overflow: auto
    .main
      width: 100%
      height: 100%
      .header
        width: 100%
        height: 90px
        line-height: 90px
        margin: 0 auto
        .header_logo
          display: inline-block
          margin-left: 50px
          margin-top: 20px
          width: 136px
          height: 51px
          background-image url(../../../../resource/image/logo.png)
          background-size: cover
          background-repeat: no-repeat
          background-position: center center
      .content
        width: 100%
        min-width: 800px
        height: 600px
        background-image url(../../../../resource/image/banner.png)
        background-size: cover
        background-repeat: no-repeat
        background-position: center center
        .login_info
          position: absolute
          top: 200px
          right: 100px
          width: 320px
          padding: 20px
          .form_contianer
            width: 100%
            height: 360px
            border-radius: 5px
            text-align: center
            background-color: rgba(255, 255, 255, 1)
            border-bottom: 1px solid #a0b1c4
            .form_title
              height: 50px
              line-height: 50px
              border-bottom: 1px solid #ccc
              color: #333
              p
                color: #606266
                font-size: 16px
                font-weight: bold
            .loginForm
              .el-form-item
                width: 282px
                margin: 29px auto
              .loginPhoneNumber
                position: relative
                .message
                  position: absolute
                  top: 0
                  right: 10px
                  cursor: pointer
                  color: #03a9f4
                  font-size: 12px
                  &:hover
                    color: #038fcd
              .picCode
                position: relative
                .code-refresh
                  position: absolute
                  top: 0
                  right: 0
                  width: 130px
                  height: 35px
                  cursor: pointer
                  z-index: 100
                svg
                  position: absolute
                  top: 0
                  right: 0
              .messageCode
                position: relative
                .message
                  position: absolute
                  top: 0
                  right: 10px
                  font-size: 12px
                  color: #999
                  cursor: pointer
                  &.message-code
                    color: #03a9f4
                    &:hover
                      color: #038fcd
              .submit_btn
                width: 100%
                color: #fff
          .form_contianer_email
            width: 320px
            height: 360px
            border-radius: 5px
            text-align: center
            background-color: rgba(255, 255, 255, 1)
            .form_title
              height: 50px
              line-height: 50px
              border-bottom: 1px solid #ccc
              color: #333
              p
                color: #606266
                font-size: 16px
                font-weight: bold
            .loginForm
              .el-form-item
                width: 282px
                margin: 29px auto
                .suffix
                  position: absolute
                  top: 0
                  right: 20px
                  color: #999
              .loginPhoneNumber
                position: relative
                .message
                  position: absolute
                  top: 0
                  right: 10px
                  cursor: pointer
                  color: #03a9f4
                  font-size: 12px
                  &:hover
                    color: #038fcd
              .picCode
                position: relative
                .code-refresh
                  position: absolute
                  top: 0
                  right: 0
                  width: 130px
                  height: 35px
                  cursor: pointer
                  z-index: 100
                svg
                  position: absolute
                  top: 0
                  right: 0
              .messageCode
                position: relative
                .message
                  position: absolute
                  top: 0
                  right: 10px
                  font-size: 12px
                  color: #999
                  cursor: pointer
                  &.message-code
                    color: #03a9f4
                    &:hover
                      color: #038fcd
              .submit_btn
                width: 100%
                color: #fff
      .footer
        position: absolute
        bottom: 0
        width: 100%
        height: 40px
        line-height: 40px
        p
          color: #868686
          font-size: 12px
          text-align: center

  @media (min-width: 1401px)
    .login
      .main
        .content
          .login_info
            right: 200px

  @media (max-width: 1400px)
    .login
      .main
        .content
          .login_info
            right: 50px

  @media (max-width: 800px)
    .loginApp
      width: 100%
      min-width: 320px
      height: 100%
      background-color: #eee
      .main
        width: 80%
        height: 100%
        margin: 0 auto
        background-color: #eee
        .header
          width: 100%
          height: 22%
          padding-top: 28%
          .logo
            display: -webkit-box
            margin-bottom: 26px
            .elextra-icon-table
              display: -webkit-box
              margin: 0 auto
              font-size: 50px
              color: #409eff
          .title
            display: -webkit-box
            p
              margin: 0 auto
              font-size: 20px
              font-weight: bold
              color: #409eff
        .content
          .form_contianer
            .loginForm
              max-width: 350px
              margin: 0 auto
              .el-form-item
                width: 100%
              .loginPhoneNumber
                .message
                  position: absolute
                  top: 0
                  right: 10px
                  cursor: pointer
                  color: #03a9f4
                  font-size: 12px
                  &:hover
                    color: #038fcd
              .picCode
                position: relative
                .code-refresh
                  position: absolute
                  top: 0
                  right: 0
                  width: 130px
                  height: 35px
                  cursor: pointer
                  z-index: 100
                svg
                  position: absolute
                  top: 0
                  right: 0
              .messageCode
                position: relative
                .message
                  position: absolute
                  top: 0
                  right: 10px
                  font-size: 12px
                  color: #999
                  cursor: pointer
                  &.message-code
                    color: #03a9f4
                    &:hover
                      color: #038fcd
              .submit_btn
                width: 100%
                color: #fff
        .footer
          width: 100%
          p
            line-height: 90px
            color: #868686
            font-size: 14px
            text-align: center



  @media (max-height: 731px)
    .login
      .main
        .content
          height: 500px
          .login_info
            top: 140px

  @media (max-height: 631px)
    .login
      .main
        .footer
          position: relative
          bottom: none

</style>
