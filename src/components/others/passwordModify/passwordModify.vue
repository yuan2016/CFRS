<template>
  <div class="passwordModify">
    <banner></banner>
    <div class="pwdContent">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
        <el-form-item label="原密码:" prop="oldPass">
          <el-input v-model="ruleForm.oldPass" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="新密码:" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item class="rowFour">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import banner from '../../common/banner/banner'
  import { getEmail, clearToken } from '../../../common/js/storage'
  import md5 from 'js-md5'
  import {
    getPasswordConfirm,
    getPasswordModify
  } from '../../../common/js/api'

  export default {
    components: {
      banner
    },
    data () {
      let checkoldPass = (rule, value, callback) => {
        if (!(value.trim())) {
          this.oldPassChecked = false
          return callback(new Error('不能为空'))
        } else {
          getPasswordConfirm({
            email: getEmail() + '@xianjinkd.com',
            password: md5(this.ruleForm.oldPass)
          }).then((response) => {
            if (response.data.code === '404') {
              this.$router.push('./404')
            } else if (response.data.code === '1024') {
              this.$message({
                message: '验证密码请求超时，请刷新页面重试',
                type: 'warning'
              })
            } else {
              if (response.data !== 200) {
                this.oldPassChecked = false
                return callback(new Error('密码错误'))
              } else {
                this.oldPassChecked = true
                callback()
              }
            }
          })
        }
      }
      let validatePass = (rule, value, callback) => {
        if (!(/^((?=.*[0-9].*)(?=.*[A-Za-z].*)(?![0-9a-zA-Z]+$))\S{6,}$/).test(value)) {
          this.passChecked = false
          callback(new Error('密码至少6位,应由字母(区分大小写),数字,符号(不包括空格)组成'))
        } else {
          this.passChecked = true
          callback()
        }
      }
      let validatePass2 = (rule, value, callback) => {
        if (!(/^((?=.*[0-9].*)(?=.*[A-Za-z].*)(?![0-9a-zA-Z]+$))\S{6,}$/).test(value)) {
          this.checkPassChecked = false
          callback(new Error('密码至少6位,应由字母(区分大小写),数字,符号(不包括空格)组成'))
        } else if (value !== this.ruleForm.pass) {
          this.checkPassChecked = false
          callback(new Error('两次输入密码不一致!'))
        } else {
          this.checkPassChecked = true
          callback()
        }
      }
      return {
        oldPassChecked: false,
        passChecked: false,
        checkPassChecked: false,
        ruleForm: {
          pass: '',
          checkPass: '',
          oldPass: ''
        },
        rules: {
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'}
          ],
          oldPass: [
            {validator: checkoldPass, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submitForm (rf) {
        if (this.oldPassChecked && this.passChecked && this.checkPassChecked) {
          getPasswordModify({
            email: getEmail() + '@xianjinkd.com',
            password: md5(this.ruleForm.checkPass)
          }).then((response) => {
            if (response.data.code === '404') {
              this.$router.push('./404')
            } else if (response.data.code === '1024') {
              this.$message({
                message: '修改密码请求超时，请刷新页面重试',
                type: 'warning'
              })
            } else {
              if (response.data === 200) {
                this.$message({
                  message: '修改密码成功,请重新登录',
                  type: 'success'
                })
                clearToken()
                this.$router.push('/login')
              } else {
                this.$message({
                  message: '修改密码失败，请重试',
                  type: 'warning'
                })
              }
            }
          })
        } else {
          this.$message({
            message: '请检查密码是否有误，密码应由字母（区分大小写）、数字、符号(不包括空格)组成',
            type: 'warning'
          })
        }
      },
      resetForm (rf) {
        this.$refs[rf].resetFields()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .pwdContent
    position: absolute
    padding: 30px
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    box-sizing: content-box
    width: 450px
    height: 300px
    color: #999
    .rowFour
      margin-left: 100px
</style>
