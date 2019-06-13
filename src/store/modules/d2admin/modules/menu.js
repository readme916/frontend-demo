// 设置文件
import setting from '@/setting.js'
import util from '@/libs/util'
import getMenu from '@/api/sys.menu'
import { stat } from 'fs';
export default {
  namespaced: true,
  state: {
    // 顶栏菜单
    header: [],
    // 侧栏菜单
    aside: [],

    tree: [],
    // 侧边栏收缩
    asideCollapse: setting.menu.asideCollapse,

    openeds:[]
  },


  actions: {
    load({
      state,
      dispatch
    }) {
      return new Promise(async resolve => {
        await getMenu().then(async res => {
          state.tree =  util.menuConverter(res.items,true)
        })

        state.header = state.tree.map(e => {
          return {uuid: e.uuid,
          title: e.title,
          icon: e.icon,
          path: e.path}
        })
        resolve()
      })
    },
    clear({
      state,
      dispatch
    }) {
      return new Promise(async resolve => {
       state.header=[]
       state.aside=[]
       state.tree=[]
       state.openeds = []
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
   
    asideByHeaderClick(state, index) {
      var parent = state.tree.find(e => e.path == index)
      if (parent && parent.children) {
        state.aside = parent.children
        state.openeds = [index]
      }
    }
  }
}