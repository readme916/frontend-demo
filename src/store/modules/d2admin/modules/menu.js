// 设置文件
import setting from '@/setting.js'
import util from '@/libs/util'

export default {
  namespaced: true,
  state: {
    // 顶栏菜单
    header: [],
    // 侧栏菜单
    aside: [],

    origin: [],
    // 侧边栏收缩
    asideCollapse: setting.menu.asideCollapse
  },


  actions: {


    load({
      state,
      dispatch
    }) {
      return new Promise(async resolve => {
        // 持久化
        state.origin = await dispatch('d2admin/db/get', {
          dbName: 'sys',
          path: 'menu.origin',
          defaultValue: {},
          user: true
        }, {
          root: true
        })
        state.header = util.menuConverter(state.origin, false)
        // end
        resolve()
      })
    },
    save({
      state,
      dispatch
    }, origin) {


      state.origin = origin
      state.header = util.menuConverter(origin, false)

      return new Promise(async resolve => {
        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'menu.origin',
          value: origin,
          user: true
        }, {
          root: true
        })
        // end
        resolve()
      })
    },


    /**
     * 设置侧边栏展开或者收缩
     * @param {Object} state vuex state
     * @param {Boolean} collapse is collapse
     */
    asideCollapseSet({
      state,
      dispatch
    }, collapse) {
      return new Promise(async resolve => {
        // store 赋值
        state.asideCollapse = collapse
        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'menu.asideCollapse',
          value: state.asideCollapse,
          user: true
        }, {
          root: true
        })
        // end
        resolve()
      })
    },
    /**
     * 切换侧边栏展开和收缩
     * @param {Object} state vuex state
     */
    asideCollapseToggle({
      state,
      dispatch
    }) {
      return new Promise(async resolve => {
        // store 赋值
        state.asideCollapse = !state.asideCollapse
        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'menu.asideCollapse',
          value: state.asideCollapse,
          user: true
        }, {
          root: true
        })
        // end
        resolve()
      })
    },
    /**
     * 从持久化数据读取侧边栏展开或者收缩
     * @param {Object} state vuex state
     */
    asideCollapseLoad({
      state,
      dispatch
    }) {
      return new Promise(async resolve => {
        // store 赋值
        state.asideCollapse = await dispatch('d2admin/db/get', {
          dbName: 'sys',
          path: 'menu.asideCollapse',
          defaultValue: setting.menu.asideCollapse,
          user: true
        }, {
          root: true
        })
        // end
        resolve()
      })
    }
  },
  mutations: {
    /**
     * @description 设置侧边栏菜单
     * @param {Object} state vuex state
     * 
     */
    asideByRouter(state, to, from) {
      if (to.params.application != undefined) {

        var parent = state.origin.find(
          e => e.url == "/" + to.params.application + "/"
        );
        if (parent && parent.children) {
          state.aside = util.menuConverter(parent.children, true)
        }
      }
    },

    asideByHeaderClick(state, index) {

      var parent = state.origin.find(e => e.url == index)
      if (parent.children) {
        state.aside = util.menuConverter(parent.children, true)
      }
    }
  }
}