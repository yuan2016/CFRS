<template>
  <div class="banner">
    <el-breadcrumb separator="/" class="banner_content">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in $route.meta" :key="item">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="tag">
      <el-tag
        v-for="tag in tagOne"
        :key="tag.name"
        :closable="true"
        :type="tag.type"
        :close-transition="false"
        @close="handleClose(tag)">
        <a :title="tag.name" :href="tag.href" @click="addRouter(href1)" >{{tag.name}}</a>
      </el-tag>
      <div class="tagContent">
        <el-tag
          v-for="tag in tags"
          :key="tag.name"
          :closable="true"
          :type="tag.type"
          :close-transition="false"
          @close="handleClose(tag)">
          <a :title="tag.name" :href="tag.href" @click="addRouter" >{{tag.name}}</a>
        </el-tag>
      </div>
    </div>
    <!--<el-dropdown split-button type="primary">-->
    <!--更多-->
    <!--<el-dropdown-menu slot="dropdown">-->
    <!--<el-dropdown-item @click.native="jumpTopwd({path:'/passwordModify'})">修改密码</el-dropdown-item>-->
    <!--<el-dropdown-item @click.native="jumpToLogin({path:'/login'})">注销</el-dropdown-item>-->
    <!--</el-dropdown-menu>-->
    <!--</el-dropdown>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import { clearToken } from '../../../common/js/storage'
  export default {
    data() {
      return {
        tags: [],
        types: [],
        colors: [],
        histories: [],
        width: 0,
        isShow: false,
        screenWidth: document.body.clientWidth,
        tagOne: ''
      }
    },
    created() {
      this.setTags()
    },
    updated () {
      this.setWidth()
    },
    mounted() {
      this.setWidth()
//      window.onresize = this.setWidth()
    },
    methods: {
      jumpToLogin(path) {
        clearToken()
        this.$router.push(path)
      },
      jumpTopwd(path) {
        this.$router.push(path)
      },
      handleClose(tag) {
        let index = this.tags.indexOf(tag)
        if (index === 0) {
          if (document.getElementsByClassName('icon-show')[0]) {
            document.getElementsByClassName('icon-show')[0].style.display = 'none'
            document.getElementsByClassName('tagContent')[0].removeChild(document.getElementsByClassName('icon-show')[0])
          }
          if (document.getElementsByClassName('el-tag').length > 1) {
            document.getElementsByClassName('el-tag')[1].insertAdjacentHTML('afterEnd', '<i class="icon-show elextra-icon-up" style="transform:rotate(180deg)"></i>')
          }
        }
        this.tags.splice(index, 1)
        let j
        for (let i in this.histories) {
          if (this.histories[i].name === tag.name) {
            j = i || ''
            break
          }
        }
        this.histories.splice(j, 1)
        this.colors.splice(j, 1)
        window.sessionStorage.setItem('histories', JSON.stringify(this.histories))
        window.sessionStorage.setItem('colors', JSON.stringify(this.colors))
      },
      setTags() {
        let whiteArr = ['首页', '404', '修改密码', '']
        let router = {name: this.$route.name, path: this.$route.path}
        let historyArr = []
        let colorArr = []
        let colorMap = new Map()
        let itrArr = []
        let r, q
        //从sessionStorage中获取 初始化 colorArr，historyArr
        if (window.sessionStorage.getItem('colors')) {
          colorArr = JSON.parse(window.sessionStorage.getItem('colors'))
        }
        historyArr = JSON.parse(window.sessionStorage.getItem('histories')) || []
        for (let j in colorArr) {
          colorMap.set(colorArr[j].name, colorArr[j].type)
        }
        //获取不和上一个重复的随机数
        for (let n of colorMap.values()) {
          itrArr.push(n)
        }
        q = itrArr.reverse().slice(0, 1)
        if (q[0] === 0) {
          r = 1
        } else {
          r = 0
        }
        //排除 空值、已存在的、白名单
        if (router.name && !colorMap.has(router.name) && whiteArr.indexOf(router.name) === -1) {
          if (historyArr.length === 5) {
            colorMap.delete(historyArr[0].name)
            colorArr.shift()
            historyArr.shift()
          }
          historyArr.push(router)
          colorArr.push({name: router.name, type: r})
          colorMap.set(router.name, r)
        }
        for (let i in historyArr) {
          let tagArr = {
            name: historyArr[i].name,
            href: '/#' + historyArr[i].path,
            type: String(colorMap.get(historyArr[i].name))
          }
          if (i === 0) {
            this.tagOne.push(tagArr)
          } else {
            this.tags.push(tagArr)
          }
        }
        //存储到 data中供删除方法使用，存储到sessionStorage
        this.colors = colorArr
        this.histories = historyArr
        window.sessionStorage.setItem('colors', JSON.stringify(colorArr))
        window.sessionStorage.setItem('histories', JSON.stringify(historyArr))
      },
      setWidth() {
        if (document.getElementsByClassName('banner_content')[0]) {
          this.width = document.getElementsByClassName('banner')[0].clientWidth - document.getElementsByClassName('banner_content')[0].clientWidth - 36
        }
        let wid = 17
        let tags = document.getElementsByClassName('el-tag')
        let len = tags.length
        for (let i = 0; i < len; i++) {
          wid = wid + tags[i].clientWidth + 4
        }
        if (this.width < wid) {
          if (!document.getElementsByClassName('tagWid')[0]) {
            document.getElementsByClassName('tag')[0].classList.add('tagWid')
          }
          let iconShow = document.getElementsByClassName('icon-show')
          if (iconShow.length === 0) {
            document.getElementsByClassName('el-tag')[0].insertAdjacentHTML('afterEnd', '<i class="icon-show elextra-icon-up"></i>')
          } else {
            iconShow[0].style.display = 'inline-block'
            this.unbind(document.getElementsByClassName('icon-show'), 'click', this.clickShow)
          }
          this.clickShow()
        } else {
          let tag = document.getElementsByClassName('tag')[0]
          if (tag && tag.classList.contains('tagWid')) {
            tag.classList.remove('tagWid')
          }
          let iconShow = document.getElementsByClassName('icon-show')[0]
          if (document.getElementsByClassName('tagContent')[0]) {
            if (iconShow) {
              iconShow.style.display = 'none'
              document.getElementsByClassName('tagContent')[0].removeChild(iconShow)
            }
            document.getElementsByClassName('tagContent')[0].style = ''
          }
        }
      },
      clickShow () {
        document.getElementsByClassName('tagContent')[0].onclick = function (e) {
          e = e || window.event
          let target = e.target || e.srcElement
          if (target.className.indexOf('icon-show') > -1) {
            let tagContent = document.getElementsByClassName('tagContent')[0]
            if (this.isShow) {
              tagContent.style.height = '40px'
              tagContent.style.paddingLeft = '0'
              let ai = setTimeout(function () {
                tagContent.style.background = 'none'
                tagContent.style.boxShadow = 'none'
              }, 500)
              document.getElementsByClassName('icon-show')[0].style.transform = 'rotate(0deg)'
              this.isShow = false
            } else {
              tagContent.style.paddingLeft = '10px'
              tagContent.style.background = 'rgba(255, 255, 255, 1)'
              tagContent.style.boxShadow = '2px 2px 6px #888888'
              tagContent.style.height = document.getElementsByClassName('el-tag').length * 40 + 'px'
              document.getElementsByClassName('icon-show')[0].style.transform = 'rotate(180deg)'
              this.isShow = true
            }
          }
        }
      },
      unbind (target, type, func) {
        if (target.removeEventListener) {
          target.removeEventListener(type, func, false)
        } else if (target.detachEvent) {
          target.detachEvent('on' + type, func)
        } else {
          target['on' + type] = null
        }
      },
      addRouter (href1) {
        let path = href1.path[0].href
        let start = path.indexOf('#')
        path = path.substring(start + 2)
        let toPath = path.split('/')
        let toOne = toPath[0]
        let key
        let value
        let roles = {}
        if (toOne === 'toyGrab') {
          value = this.$store.getters.table1.split('|')
          key = 1
        } else if (toOne === 'auction') {
          value = this.$store.getters.table2.split('|')
          key = 2
        } else if (toOne === 'period') {
          value = this.$store.getters.table3.split('|')
          key = 3
        } else {
          value = this.$store.getters.table.split('|')
          key = 0
        }
        roles.key = key
        roles.value = value
        this.$store.dispatch('GenerateRoutes', {roles}).then(() => { // 生成可访问的路由表
          this.$router.addRoutes(this.$store.getters.addRouters) // 动态添加可访问路由表
          // this.$router.next(this.$router.to.path) // hack方法 确保addRoutes已完成
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .banner
    display: block
    width: 100%
    height: 40px
    line-height: 40px
    box-sizing: border-box
    background-color: #EFF2F7
    padding-left: 20px
    border-radius: 10px
    z-index:9999
    .el-button
      margin-right: 20px
    .el-breadcrumb
      display: inline-block
      float: left
      max-width:100%
      line-height: 40px
      height: 40px
    .tag
      float: left
      margin-left: 12px
      padding-left: 5px
      height: 40px
      .el-icon-caret
        display: none
      .el-tag
        margin-right: 4px
        margin-bottom: 1px
        a
          color: #fff
      .el-tag--0
        background-color: #20a0ff
      .el-tag--1
        background-color: #ff4949
    .tagWid
      width: 185px
      .tagContent
        position: relative
        padding-right: 10px
        z-index: 97
        width: 100%
        height: 40px
        overflow: hidden
        background: #eff2f7
        border-radius: 5px
        transition: all .1s ease
        .el-tag
          min-width: 89px
        .icon-show
          position: relative
          top: 4px
          display: inline-block
          font-size: large
          color: #666
          &:hover
            color: #ff4949

  /*.el-tag--2
    background-color: #c186c5
  .el-tag--3
    background-color: #e6a82d
  .el-tag--4
    background-color: #ff6431
  .el-tag--5
    background-color: #36c4de
  .el-tag--6
    background-color: #58D2E8
  .el-tag--7
    background-color: #99CC33
  .el-tag--8
    background-color: #388cd4
  .el-tag--9
    background-color: #ffc24a
  .el-tag--10
    background-color: #ababff*/

</style>
