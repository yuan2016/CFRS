import { asyncRouterMap, constantRouterMap } from '../../router/index'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission (roles, route) {
  if (route.name) {
    return roles.some(role => route.name.trim() === role.trim())
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter (asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    currentProduct: ''
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_CURRENT_PRODUCT: (state, num) => {
      if (num === 0) {
        state.currentProduct = '开心钱包'
      } else if (num === 1) {
        state.currentProduct = '企鹅抓娃娃'
      } else if (num === 2) {
        state.currentProduct = '闪电卡'
      } else {
        state.currentProduct = '开心分期'
      }
    },
    CLEAR_INIT_TABLE: (state) => {
      state.routers = constantRouterMap
      state.routers = []
    }
  },
  actions: {
    GenerateRoutes ({commit}, data) {
      return new Promise(resolve => {
        let roles = data.roles.value
        let num = data.roles.key
        let accessedRouters
        if (roles.indexOf('admin') >= 0) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        commit('SET_ROUTERS', accessedRouters)
        commit('SET_CURRENT_PRODUCT', num)
        resolve()
      })
    },
    clearInitTable: ({commit}) => {
      commit('CLEAR_INIT_TABLE')
    }
  }
}

export default permission
