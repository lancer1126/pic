<template>
  <div>

  </div>
</template>

<script>
import { Tag } from 'vant'
import { mapState } from 'vuex'
export default {
  components: {
    [Tag.name]: Tag
  },
  data() {
    return {}
  },
  props: {
    artwork: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      required: false,
      default: 'cover'
    },
    column: {
      type: Number,
      required: false,
      default: 2
    }
  },
  computed: {
    ...mapState({

    })
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
