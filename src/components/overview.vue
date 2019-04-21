<template>
  <div>
    <v-header/>
    <div class="content">overview</div>
  </div>
</template>

<script>
import vHeader from "./header.vue";
export default {
  name: "OverView",
  components: {
    vHeader
  }
};
</script>
<style>
.content{
    margin-top:80px
}
</style>

