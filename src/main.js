// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import './common/stylus/include.styl'
import 'element-ui/lib/theme-chalk/index.css'
import Axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import {getToken, getPhone, getEmail} from './common/js/storage'
import './config/height'
import store from './store/'
import {parentTable, address} from '../src/common/js/config'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueAxios, Axios)
Vue.use(VueRouter)

// permissiom judge
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin权限 直接通过
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

let temp

function selectBaseTable(arrays) {
  let tables = arrays.split('|')
  temp = tables.filter(filterBaseTableleft)
  return tables.filter(filterBaseTableRight)
}

function filterBaseTableleft(str) {
  return parentTable.indexOf(str) !== -1
}

function filterBaseTableRight(str) {
  return temp.indexOf(str) === -1
}
//判断展示哪个产品
function selectRoles (productName, to) {
  let key
  let value
  let roles = {}
  if (productName === '开心钱包') {
    // roles = store.getters.table.split('|')
    let arrPath = to.path.split('/')
    let pathOne = arrPath[1]
    if (pathOne === 'toyGrab') {
      value = store.getters.table1.split('|')
      key = 1
    } else if (pathOne === 'flashCard') {
      value = store.getters.table2.split('|')
      key = 2
    } else if (pathOne === 'period') {
      value = store.getters.table3.split('|')
      key = 3
    } else {
      value = store.getters.table.split('|')
      key = 0
    }
  } else if (productName === '企鹅抓娃娃') {
    let arrPath = to.path.split('/')
    let pathOne = arrPath[1]
    if (pathOne === 'toyGrab' || pathOne === 'main') {
      value = store.getters.table1.split('|')
      key = 1
    } else if (pathOne === 'flashCard') {
      value = store.getters.table2.split('|')
      key = 2
    } else if (pathOne === 'period') {
      value = store.getters.table3.split('|')
      key = 3
    }
  } else if (productName === '闪电卡') {
    let arrPath = to.path.split('/')
    let pathOne = arrPath[1]
    if (pathOne === 'toyGrab' || pathOne === 'main' || pathOne === 'flashCard') {
      value = store.getters.table2.split('|')
      key = 2
    } else {
      value = store.getters.table3.split('|')
      key = 3
    }
  } else {
    value = store.getters.table3.split('|')
    key = 3
  }
  roles.key = key
  roles.value = value
  return roles
}

const whiteList = ['/login']// 不重定向白名单
router.beforeEach((to, from, next) => {
  if (getToken()) { // 判断是否有token
    if (to.path === '/login') {
      next({path: '/main'})
    } else {
      if (store.getters.table.length === 0 && store.getters.table1.length === 0 && store.getters.table2.length === 0 && store.getters.table3.length === 0) {
        if (getPhone()) {
          store.dispatch('getInfo', getPhone()).then(res => {
            const productName = store.getters.productNames[0]
            let roles = selectRoles(productName, to)
            store.dispatch('GenerateRoutes', {roles}).then(() => { // 生成可访问的路由表
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              next(to.path) // hack方法 确保addRoutes已完成
            })
          }).catch(err => {
            console.log(err)
          })
        } else if (getEmail()) {
          store.dispatch('getInfoEmail', getEmail() + '@xianjinkd.com').then(res => {
            const productName = store.getters.productNames[0]
            let roles = selectRoles(productName, to)
            store.dispatch('GenerateRoutes', {roles}).then(() => { // 生成可访问的路由表
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              next(to.path) // hack方法 确保addRoutes已完成
            })
          }).catch(err => {
            console.log(err)
          })
        }
      } else {
          if (to.path === '/main' || to.path === '/main/index') {
            const productName = store.getters.productNames[0]
            if (productName === '开心钱包') {
              next({path: address[selectBaseTable(store.getters.table)[0]]})
            } else if (productName === '企鹅抓娃娃') {
              next({path: address[selectBaseTable(store.getters.table1)[0]]})
            } else if (productName === '闪电卡') {
              next({path: address[selectBaseTable(store.getters.table2)[0]]})
            } else {
              next({path: address[selectBaseTable(store.getters.table3)[0]]})
            }
          }
          next()
        }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  store: store,
  components: {App}
})
