<template>
  <div>
    <v-container fluid>
      <v-layout column fill-height>
        <v-layout row align-center justify-center>
          <v-flex xs5>
            <div class="font-weight-medium total teal--text">{{income-spent | currency }}</div>
            <v-layout class="summary" row justify-space-around>
              <v-flex xs3 text-xs-center>
                <p class="font-weight-light">Spent</p>
                <p class="font-weight-regular red--text">{{spent | currency }}</p>
              </v-flex>

              <v-flex xs3 text-xs-center>
                <p class="font-weight-light">Income</p>
                <p class="font-weight-regular green--text">{{income | currency }}</p>
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
                        <h3 class="headline mb-0">Categories</h3>
                      </v-flex>
                      <v-flex xs1>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn flat icon @click="openDialog" v-on="on">
                              <v-icon>fas fa-plus</v-icon>
                            </v-btn>
                          </template>
                          <span>Add Category</span>
                        </v-tooltip>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-layout column>
                    <v-list subheader>
                      <v-list-tile v-for="(category, index) in categories" :key="index" avatar>
                        <v-list-tile-avatar>
                          <v-icon class="grey lighten-1 white--text">fa {{ category.icon }}</v-icon>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                          <v-list-tile-title v-html="category.name"></v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn icon @click="viewCategory(category.id)">
                            <v-icon>fas fa-chevron-right</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                        <v-list-tile-action>
                          <v-menu bottom left>
                            <template v-slot:activator="{ on }">
                              <v-btn icon v-on="on">
                                <v-icon>more_vert</v-icon>
                              </v-btn>
                            </template>

                            <v-list>
                              <v-list-tile @click="confirmEdit(category)">
                                <v-list-tile-title>Edit</v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile @click="confirmDelete(category)">
                                <v-list-tile-title>Delete</v-list-tile-title>
                              </v-list-tile>
                            </v-list>
                          </v-menu>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </v-layout>
                </v-card-title>
              </v-card>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-container>

    <v-layout row justify-center>
      <!-- create dialog -->
      <v-dialog
        v-model="dialog"
        persistent
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar color="teal" dark>
            <v-toolbar-title>New Category</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click="closeDialog">Close</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-layout row justify-center>
            <v-flex xs5>
              <v-list subheader v-if="settingsCategories.length">
                <v-subheader>Pre-defined categories</v-subheader>
                <v-list-tile v-for="(category, index) in settingsCategories.filter( el => {
                    for (let i =0; i < categories.length; i++){
                        if(el.name === categories[i].name )
                        return false;
                    }
                    return true;
                  })" :key="index" avatar>
                  <v-list-tile-avatar>
                    <v-icon class="grey lighten-1 white--text">fa {{ category.icon }}</v-icon>
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title v-html="category.name"></v-list-tile-title>
                  </v-list-tile-content>

                  <v-list-tile-action>
                    <v-btn @click="addCategory( category.icon, category.name)" icon ripple>
                      <v-icon color="grey lighten-1">fas fa-plus</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
              <v-divider></v-divider>

              <v-subheader>Custom category</v-subheader>
              <v-form ref="ctegoryAddForm" v-model="valid">
                <v-container fluid>
                  <v-layout>
                    <v-flex xs4>
                      <v-select
                        :prepend-icon="icon"
                        menu-props="auto"
                        hide-details
                        :items="icons"
                        label="Icon"
                        single-line
                        v-model="icon"
                      ></v-select>
                    </v-flex>
                    <v-flex xs4>
                      <v-text-field
                        label="Category Name"
                        :rules="categoryRules"
                        v-model="category"
                        required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs4 text-xs-right>
                      <v-btn @click="createCategory" :disabled="!valid" class="mr-0" icon ripple>
                        <v-icon color="grey lighten-1">fas fa-plus</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-form>
            </v-flex>
          </v-layout>
        </v-card>
      </v-dialog>

      <!-- delete dialog -->
      <v-dialog v-if="categoryToDelete" persistent v-model="deleteDialog" max-width="290">
        <v-card>
          <v-card-title class="headline">Delete Confirmation</v-card-title>

          <v-card-text>Are you sure, you want to delete Category {{categoryToDelete.name}} !</v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" flat="flat" @click="deleteDialog = false">Cancle</v-btn>

            <v-btn color="red darken-1" flat="flat" @click="deleteCategory">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- edit dialog -->

      <v-dialog v-if="categoryToEdit" v-model="editDialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Edit Cateogry {{categoryToEdit.name}}</span>
          </v-card-title>
          <v-form v-model="editValid">
            <v-card-text>
              <v-container fluid>
                <v-layout justify-space-between>
                  <v-flex xs5>
                    <v-select
                      :prepend-icon="categoryToEdit.icon"
                      menu-props="auto"
                      hide-details
                      :items="icons"
                      label="Icon"
                      single-line
                      v-model="categoryToEdit.icon"
                    ></v-select>
                  </v-flex>
                  <v-flex xs5>
                    <v-text-field
                      label="Category Name"
                      :rules="categoryRules"
                      v-model="categoryToEdit.name"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="editDialog = false">Close</v-btn>
              <v-btn :disabled="!editValid" color="blue darken-1" flat @click="editCategory">Save</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>

      <!-- mesages -->
      <v-snackbar v-model="snackbarSuccess" multi-line color="success" :timeout="5000">
        <div v-for="(sc, index) in success" :key="index">{{sc}}</div>
        <v-btn dark flat @click="closeSnakBar">Close</v-btn>
      </v-snackbar>

      <v-snackbar v-model="snackbarError" multi-line color="error" :timeout="5000">
        <div v-for="(er, index) in errors" :key="index">{{er}}</div>
        <v-btn dark flat @click="closeSnakBar">Close</v-btn>
      </v-snackbar>
    </v-layout>
  </div>
</template>


<script>
import { mapGetters } from "vuex";
import axios from "axios";
import { baseUrl } from "../api";
import _ from "lodash";
export default {
  name: "CategoriesList",
  components: {},
  data: () => ({
    dialog: false,
    settingsCategories: {},
    icons: [],
    icon: "fa-coins",
    snackbarSuccess: false,
    snackbarError: false,
    category: "",
    valid: false,
    deleteDialog: false,
    editDialog: false,
    categoryToEdit: null,
    editValid: false,
    categoryToDelete: null,
    categoryRules: [
      v => !!v || "Category name is required",
      v => v.length <= 191 || "Category name must be more than 191 characters"
    ]
  }),
  computed: {
    ...mapGetters("category", {
      categories: "getCategories",
      errors: "getErrors",
      success: "getSuccess",
      income: "getIncome",
      spent: "getSpent"
    })
  },
  watch: {
    success(newVal) {
      if (_.isEmpty(newVal)) {
        this.snackbarSuccess = false;
      } else {
        this.$store.dispatch("category/getCategories");
        this.snackbarSuccess = true;
      }
    },
    errors(newVal) {
      if (_.isEmpty(newVal)) {
        this.snackbarError = false;
      } else {
        this.snackbarError = true;
      }
    }
  },
  mounted() {
    const settings = JSON.parse(localStorage.getItem("settings"));
    if (settings !== null) {
      this.settingsCategories = JSON.parse(settings.categories);
      this.icons = JSON.parse(settings.icons);
    } else {
      axios
        .get(baseUrl + "settings")
        .then(response => {
          localStorage.setItem(
            "settings",
            JSON.stringify(response.data.settings)
          );
          this.settingsCategories = JSON.parse(
            response.data.settings.categories
          );
          this.icons = JSON.parse(response.data.settings.icons);
        })
        .catch(() => {});
    }

    this.$store.dispatch("category/emptyMessages");
    this.$store.dispatch("category/getCategories");
    this.$store.dispatch("category/getSummary");
  },
  methods: {
    createCategory() {
      this.addCategory(this.icon, this.category);
      this.icon = "fa-coins";
      this.category = "";
      this.$refs.ctegoryAddForm.resetValidation();
    },
    addCategory(icon, name) {
      this.$store.dispatch("category/createCategory", {
        icon,
        name
      });
    },
    openDialog() {
      this.$store.dispatch("category/emptyMessages");
      this.dialog = true;
    },

    closeDialog() {
      
      this.$store.dispatch("category/emptyMessages");
      this.dialog = false;
    },
    viewCategory(id) {
      this.$router.push("/overview/" + id);
    },
    deleteCategory() {
      this.$store.dispatch("category/deleteCategory", {
        id: this.categoryToDelete.id
      });
      this.deleteDialog = false;
    },
    confirmDelete(category) {
      this.categoryToDelete = { ...category };
      this.deleteDialog = true;
    },
    editCategory() {
      this.editDialog = false;
      this.$store.dispatch("category/editCategory", this.categoryToEdit);
    },
    confirmEdit(category) {
      this.editDialog = true;
      this.categoryToEdit = { ...category };
    },
    closeSnakBar() {
      this.$store.dispatch("category/emptyMessages");
    }
  }
};
</script>
<style>
.content {
  margin-top: 80px;
}
.total {
  font-size: 5rem;
  text-align: center;
}
.summary p {
  font-size: 1.5rem;
  margin-bottom: 5px;
}
</style>

