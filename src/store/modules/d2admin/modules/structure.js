import getStructure from '@/api/sys.structure'
export default {
  namespaced: true,
  state: {
    structure:{},
  },

  getters: {
    resourceStructure :(state) => (application,resource)=> {
      return state.structure[application][resource];
    }
  },
  actions: {
    load ({ state, dispatch }) {
      return new Promise(async resolve => {
        await getStructure().then(async res => {
         state.structure = res
        })
        // end
        resolve()
      })
    },
    clear({
      state,
      dispatch
    }) {
      return new Promise(async resolve => {
       state.structure={}
        resolve()
      })
    },
  }

}

