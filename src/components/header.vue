<template>
     <div> <v-toolbar
      absolute
      color="teal lighten-3"
      dark
    >
     
      <v-toolbar-title>Stack Watch</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu bottom left>
            <template v-slot:activator="{ on }">
              <v-btn
                dark
                icon
                v-on="on"
              >
                <v-icon>more_vert</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-tile @click="profile">
                <v-list-tile-title>Profile</v-list-tile-title>
              </v-list-tile>
               <v-list-tile  @click="logout">
                <v-list-tile-title>Logout</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
    </v-toolbar>

    </div>
</template>

<script>
export default {
  name: "vHeader",
  methods:{
      logout(){
          this.$store.dispatch("user/logout")
      },
       profile(){
          this.$router.push("/profile")
      }
  }
};
</script>
<style scoped>
</style>

