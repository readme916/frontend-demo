
import dayjs, { Dayjs } from 'dayjs'
import {notReadMessageList} from "@/api/sys.message"
export default {
  namespaced: true,
  state: {
    // 错误日志
    list: []
  },
  getters: {
  
    newMessageLength (state) {
      return state.list.length
    }
  },
  actions: {

    add ({ state }, info ) {
      // store 赋值
      state.list.unshift({
        // 记录类型
        type: info.type, // or error
        // 信息
        title: info.title,
        // 错误对象
        content: info.content,
        // vue 实例
        url: info.url,
        
        // 当前时间
        createdAt: dayjs(info.createdAt).format('YYYY-MM-DD HH:mm:ss')
      })
    },
    load({state}){
      notReadMessageList().then(res=>{
        state.list = res.items.map(item => {
          item.createdAt = dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
          return item
        });
      })
    }
  },
  mutations: {
    /**
     * @description 清空日志
     * @param {Object} state vuex state
     */
    clean (state) {
      // store 赋值
      state.list = []
    }
  }
}
