import util from '@/libs/util.js'
import { mapState } from 'vuex'
export default {

  computed: {
    ...mapState('d2admin/menu', [
      'origin'
    ])
  },

  methods: {
    handleMenuSelect (index, indexPath) {

      if(index === undefined){
        this.$message.warning('临时菜单')
      } else if (/^\/.+\/$/.test(index)) {
        var parent = this.$store.state.d2admin.menu.origin.find(e => e.url == index)
        if(parent.children){
          this.$store.commit('d2admin/menu/asideSet', util.menuConverter(parent.children,true))
        }
      } else if (/^https:\/\/|http:\/\//.test(index)) {
        util.open(index)
      } else {
        this.$router.push({
          path: index
        })
      }
    }
  }
}
