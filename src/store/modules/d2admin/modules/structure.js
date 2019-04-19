
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
        // 持久化
        state.structure = await dispatch('d2admin/db/get', {
          dbName: 'sys',
          path: 'structure',
          defaultValue: {},
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    save ({ state, dispatch },structure) {
      return new Promise(async resolve => {
        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'structure',
          value: structure,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },

  }

}

