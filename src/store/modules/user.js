import axios from 'axios'

const user = {
  state: {
    name: '',
    sex: '',
    department: '',
    roles: '',
    table: '',
    table1: '',
    table2: '',
    table3: '',
    phone: '',
    permission: '',
    productName: []
  },
  mutations: {
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_DEPARTMENT: (state, department) => {
      state.department = department
    },
    SET_SEX: (state, sex) => {
      state.sex = sex
    },
    SET_TABLE: (state, table) => {
      state.table = table
    },
    SET_TABLE_ZWW: (state, table) => {
      state.table1 = table
    },
    SET_TABLE_SDK: (state, table) => {
      state.table2 = table
    },
    SET_TABLE_FQ: (state, table) => {
      state.table3 = table
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    CLEAR_TABLE: (state) => {
      state.table = ''
    },
    SET_PERMISSION: (state, permission) => {
      state.permission = permission
    },
    SET_PRODUCT_NAME: (state, productName) => {
      if (productName) {
        state.productName = productName.split('|')
      }
    },
    DELETE_TABLE: (state) => {
      state.table = ''
      state.table1 = ''
      state.table2 = ''
      state.table3 = ''
    }
  },
  actions: {
    setRoles: ({commit}, roles) => {
      commit('SET_ROLES', roles)
    },
    setInfo: ({commit}, info) => {
      commit('SET_NAME', info.user_name)
      commit('SET_DEPARTMENT', info.department)
      commit('SET_SEX', info.user_sex)
      commit('SET_PHONE', info.user_mobile)
    },
    clearTable: ({commit}) => {
      commit('CLEAR_TABLE')
    },
    // 获取用户信息
    getInfo ({commit, state}, phoneNumber) {
      return axios.post('api/getLoginInfo', {
        phoneNumber: phoneNumber
      }).then(response => {
        const data = response.data[0]
        commit('SET_PRODUCT_NAME', data.product_names)
        commit('SET_NAME', data.user_name)
        commit('SET_DEPARTMENT', data.department) 
        commit('SET_SEX', data.user_sex)
        commit('SET_TABLE', data.available_table)
        commit('SET_TABLE_ZWW', data.available_table_zww)
        commit('SET_TABLE_SDK', data.available_table_sdk)
        commit('SET_TABLE_FQ', data.available_table_fq)
        commit('SET_PHONE', data.user_mobile)
        commit('SET_PERMISSION', data.user_permission)
    }).catch(error => {
        console.log(error)
      })
    },
    getInfoEmail ({commit, state}, email) {
      return axios.post('api/getInfoEmail', {
        email: email
      }).then(response => {
        const data = response.data[0]
        commit('SET_PRODUCT_NAME', data.product_names)
        commit('SET_NAME', data.user_name)
        commit('SET_DEPARTMENT', data.department)
        commit('SET_SEX', data.user_sex)
        commit('SET_TABLE', data.available_table)
        commit('SET_TABLE_ZWW', data.available_table_zww)
        commit('SET_TABLE_SDK', data.available_table_sdk)
        commit('SET_TABLE_FQ', data.available_table_fq)
        commit('SET_PHONE', data.user_mobile)
        commit('SET_PERMISSION', data.user_permission)
      }).catch(error => {
        console.log(error)
      })
    },
    deleteTable: ({commit}) => {
      commit('DELETE_TABLE')
    }
  }
}

export default user
