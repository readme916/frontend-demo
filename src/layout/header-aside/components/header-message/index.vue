<template>
  <div>
    <el-tooltip effect="dark" :content="tooltipContent" placement="bottom">
      <el-button class="d2-ml-0 d2-mr btn-text can-hover" type="text" @click="handleClick">
        <el-badge v-if="newMessageLength > 0" :max="99" :value="newMessageLength">
          <d2-icon name="dot-circle-o" style="font-size: 20px" />
        </el-badge>
        <d2-icon v-else name="dot-circle-o" style="font-size: 20px" />
      </el-button>
    </el-tooltip>
    <el-dialog :title="tooltipContent"  :visible.sync="dialogVisible">

      <el-tabs v-model="active" type="border" @tab-click="readClick">
        <el-tab-pane label="未读消息" name="notRead">
          <div class="d2-mb-10">
            <!-- <el-button type="danger" size="mini" @click="handleMessageAllRead">
              <d2-icon name="trash-o" />
              全部已读
            </el-button> -->
          </div>

          <notReadList />

        </el-tab-pane>
        <el-tab-pane label="已读消息" name="hasRead">

          <hasReadList ref="hasReadMessageList"/>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import notReadList from './components/notReadList'
import hasReadList from './components/hasReadList'
export default {
  components: {
    notReadList,
    hasReadList
  },
  data() {
    return {
      dialogVisible: false,
      active: "notRead"
    }
  },

  computed: {
    ...mapGetters('d2admin', {
      newMessageLength: 'message/newMessageLength'
    }),
    tooltipContent() {
      return this.newMessageLength === 0
        ? '没有新消息'
        : `${this.newMessageLength} 条新消息未读`
    }
  },
  methods: {
    ...mapMutations('d2admin/message', [
      'clean'
    ]),
    handleClick() {
      this.dialogVisible = true
    },
    readClick(tab, event) {
     this.active = tab.name
     if(tab.name == "hasRead"){
       this.$refs.hasReadMessageList.refresh()
     }
    },
    handleMessageAllRead() {
      this.dialogVisible = false
      this.clean()
    }
  }
}
</script>
