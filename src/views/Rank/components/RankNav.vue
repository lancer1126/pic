<template>
  <div class="nav">
    <router-link
      :to="{name: 'Rank', params:{type: route}}"
      :key="route"
      v-for="(item, route) in menu"
      tag="a"
      class="normal"
      :class="{cur: $route.params.type === route}"
      v-show="!item.x || isShowR18"
    >{{ item.name }}</router-link>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(['SETTING']),
    isShowR18 () {
      return this.SETTING.r18
    }
  },
  methods: {
    init () {
      let cur = document.querySelector('.cur')
      cur && cur.scrollIntoView()
    }
  },
  mounted() {
    this.init()
  },
  updated() {
    this.init()
  }
}
</script>

<style lang="stylus" scoped>
.nav {
  width: 90%;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;

  a {
    display: inline-block;
    font-size: 28px;
    padding: 12px 20px;
    margin: 12px 6px;
    border-radius: 24px;
    color: #333;
    background: #eee;
    box-sizing: border-box;
    scroll-margin: 120px;

    &.cur {
      background: #f2c358;
    }
  }
}</style>