<template>
  <div class="home">
    <RankCard></RankCard>
  </div>
</template>

<script>
import RankCard from "./components/RankCard";

export default {
  name: "Home",
  components: {
    RankCard
  },
  data() {
    return {
      scrollTop: 0
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      document.querySelector(".app-main").scrollTo(0, vm.scrollTop)
    })
  },
  beforeRouteLeave(to, from, next) {
    this.scrollTop = document.querySelector(".app-main").scrollTop
    next();
  }
}
</script>

<style lang="stylus" scoped>
.home {
  // padding-top: 50px;
}
</style>
