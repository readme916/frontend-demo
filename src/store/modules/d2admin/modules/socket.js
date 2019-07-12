export default {
  namespaced: true,
  state: {
    socket:null,
  },

  
  actions: {
    add ({ state, dispatch },socket) {
      return new Promise(async resolve => {
         state.socket = socket
        // end
        resolve()
      })
    },
    close({
      state,
      dispatch
    }) {
      return new Promise(async resolve => {
        if(state.socket!=null){
          state.socket.close()
        }
       state.socket = null
        resolve()
      })
    },
  }

}

