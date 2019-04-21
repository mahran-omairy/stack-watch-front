
<template>
  <v-container fluid>
    <v-layout column fill-height>
      <v-flex xs12>
        <v-layout align-center justify-center row fill-height>
            <div class="not-found"><i class="fas fa-heart-broken"></i> <span>404</span></div>     
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "NotFound"
};
</script>
<style scoped>
.not-found{
    font-size: 20rem
}
</style>

