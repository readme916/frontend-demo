<template>
  <d2-container>
    <d2-quill
      style="min-height: 200px; margin-bottom: 20px;"
      v-model="value"
      @text-change="textChangeHandler"
      @selection-change="selectionChangeHandler"
      @editor-change="editorChangeHandler"/>
  </d2-container>
</template>

<script>
export default {
  data () {
    return {
      value:""
    }
  },
  methods: {
    textChangeHandler (delta, oldDelta, source) {
      // console.group('QuillEditor textChangeHandler')
      // console.log(delta, oldDelta, source)
      // console.groupEnd()
    },
    selectionChangeHandler (range, oldRange, source) {
      // console.group('QuillEditor selectionChangeHandler')
      // console.log(range, oldRange, source)
      // console.groupEnd()
    },
    editorChangeHandler (eventName, ...args) {
      // console.group('QuillEditor editorChangeHandler')
      // console.log(eventName, args)
      // console.groupEnd()
    }
  }
}
</script>