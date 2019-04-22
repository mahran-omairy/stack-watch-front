<template>
  <div>
    <v-header/>

    <div class="content">
        <router-view></router-view>
    </div>
  </div>
</template>


<script>
import vHeader from "./header.vue";
export default {
  name: "OverView",
  components: {
    vHeader
  },
}
</script>
<style>

</style>

