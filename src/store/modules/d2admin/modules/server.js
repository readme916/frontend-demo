
import {getServer} from '@/api/sys.server'
export default {
  namespaced: true,
  state: {
    servers:[],
  },

  
  actions: {
    load ({ state, dispatch }) {
      return new Promise(async resolve => {
        await getServer().then(async res => {
         state.servers = res
        })
        // end
        resolve()
      })
    },

  }

}

