<template>
  <div>
    <div class="content">
      <v-container fluid>
        <v-layout column fill-height>
          <v-layout row align-center justify-center>
            <v-flex xs5>
              <v-breadcrumbs :items="breadcrumbs">
                <template v-slot:divider>/</template>
              </v-breadcrumbs>
            </v-flex>
          </v-layout>
        <v-layout row align-center justify-center>
            <v-flex xs5>
              <div class="font-weight-medium total">{{56757 | currency }}</div>
              <v-layout class="summary" row justify-space-around>
                <v-flex xs3 text-xs-center>
                  <p class="font-weight-light">Spent</p>
                  <p class="font-weight-regular">{{6786 | currency }}</p>
                </v-flex>

                <v-flex xs3 text-xs-center>
                  <p class="font-weight-light">Income</p>
                  <p class="font-weight-regular">{{2424 | currency }}</p>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>

          <v-layout row align-center justify-center>
            <v-flex xs5>
              <v-layout align-center justify-center row fill-height>
                <v-card>
                  <v-card-title primary-title>
                     <v-flex xs12>
                      <v-layout align-center justify-space-between row>
                        <v-flex xs11>
                          <h3 class="headline mb-0">{{category.name}}</h3>
                        </v-flex>
                        <v-flex xs1>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn flat icon  v-on="on">
                                <v-icon>fas fa-plus</v-icon>
                              </v-btn>
                            </template>
                            <span>Add Envelop</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                   
                  </v-card-title>
                </v-card>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-dialog  persistent max-width="290">
            <v-card>
              <v-card-title class="headline">Delete Confirmation</v-card-title>

              <v-card-text>Are you sure, you want to delete account!</v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="green darken-1" flat="flat">Cancle</v-btn>

                <v-btn color="red darken-1" flat="flat" >Confirm</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>

import { mapGetters } from "vuex";

export default {
  name: "Category",

computed:{
    ...mapGetters("category",{
        category:"getCategory"
    })
},
watch:{
category(newVal){
    this.breadcrumbs.push({
        text: newVal.name,
        disabled: true,
        href: "/profile"
      })
}
},
  data: () => ({
    breadcrumbs: [
      {
        text: "Overview",
        disabled: false,
        href: "#/overview"
      }
      
    ],
  }),
  mounted(){
      this.$store.dispatch("category/loadCategory", {
          id:this.$route.params.id
      })
     // console.log(this.category)
  }
};
</script>
<style >
.v-card {
  width: 100%;
}
</style>

