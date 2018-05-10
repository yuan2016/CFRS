import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: true
    },
    theme: 'default',
    livenewsChannels: Cookies.get('livenewsChannels') || '[]',
    visitedViews: [],
    bodyWidth: ''
  },
  mutations: {
    TOGGLE_SIDEBAR: (state, mark) => {
      if (mark) {
        state.sidebar.opened = true
      } else {
        state.sidebar.opened = false
      }
    },
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.includes(view)) return
      state.visitedViews.push(view)
    },
    DEL_VISITED_VIEWS: (state, view) => {
      const index = state.visitedViews.indexOf(view)
      state.visitedViews.splice(index, 1)
    },
    SET_BODYWIDTH: (state, width) => {
      state.bodyWidth = width
    }
  },
  actions: {
    ToggleSideBar: ({commit}, mark) => {
      commit('TOGGLE_SIDEBAR', mark)
    },
    addVisitedViews: ({commit}, view) => {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews: ({commit}, view) => {
      commit('DEL_VISITED_VIEWS', view)
    },
    setBodyWidth: ({commit}, width) => {
      commit('SET_BODYWIDTH', width)
    }
  }
}

export default app
