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
              <!-- date filter -->
              <template>
                <v-card class="mt-3 mx-auto" max-width="400">
                  <v-sheet
                    class="v-sheet--offset mx-auto"
                    color="cyan"
                    elevation="12"
                    max-width="calc(100% - 32px)"
                  >
                    <v-sparkline :value="line" color="white" line-width="2" padding="16"></v-sparkline>
                  </v-sheet>

                  <v-card-text class="pt-0">
                    <div class="title font-weight-light mb-2">Expences Report</div>
                    <v-divider class="my-2"></v-divider>

                    <span
                      class="caption grey--text font-weight-light"
                    >Duration {{new Date(date).toLocaleString('en', { month: 'long' }) }}, {{ new Date(date).getFullYear() }}</span>
                  </v-card-text>
                </v-card>
              </template>

              <v-layout justify-left row>
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" flat class="date-pick ma-0">
                      <small class="year">{{ new Date(date).getFullYear() }}</small>
                      <span
                        class="month"
                      >{{new Date(date).toLocaleString('en', { month: 'long' }) }}</span>
                    </v-btn>
                  </template>
                  <v-date-picker
                    v-model="date"
                    @input="dateChange"
                    type="month"
                    min="2017-06"
                    :max="currentMonth"
                  ></v-date-picker>
                </v-menu>
              </v-layout>
              <!-- category header -->
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
                              <v-btn flat icon v-on="on">
                                <v-icon>fas fa-plus</v-icon>
                              </v-btn>
                            </template>
                            <span>Add Envelop</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <v-layout column>
                      <v-list subheader>
                        <v-list-tile
                          v-for="(envelop, index) in category.envelops"
                          :key="index"
                          avatar
                        >
                          <v-list-tile-avatar>
                            <v-icon class="grey lighten-1 white--text">fa {{ envelop.icon }}</v-icon>
                          </v-list-tile-avatar>

                          <v-list-tile-content>
                            <v-list-tile-title v-html="envelop.name"></v-list-tile-title>
                          </v-list-tile-content>
                          <v-list-tile-action>
                            <v-list-tile-action-text
                              :class="{'red--text': envelop.type === 'spent', 'green--text': envelop.type === 'income'}"
                            >{{ envelop.amount | currency }}</v-list-tile-action-text>
                          </v-list-tile-action>
                          <v-list-tile-action>
                            <v-menu bottom left>
                              <template v-slot:activator="{ on }">
                                <v-btn icon v-on="on">
                                  <v-icon>more_vert</v-icon>
                                </v-btn>
                              </template>
                              <v-list>
                                <v-list-tile @click="confirmDelete(envelop)">
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

              <!-- transactions -->
              <v-layout align-center justify-center row>
                <v-expansion-panel>
                  <v-expansion-panel-content>
                    <template v-slot:header>
                      <div>Spend Distribution</div>
                    </template>
                    <v-card>
                      <v-card-text>
                        <v-list two-line>
                          <template
                            v-for="(envelop, index) in category.envelops.filter(el => el.type=='spent')"
                          >
                            <v-list-tile :key="envelop.id">
                              <v-list-tile-content>
                                <v-list-tile-title>{{ envelop.name }}</v-list-tile-title>
                                <v-list-tile-sub-title>
                                  <v-progress-linear
                                    color="info"
                                    height="4"
                                    :value="spentPercent(envelop.amount)"
                                  ></v-progress-linear>
                                </v-list-tile-sub-title>
                              </v-list-tile-content>

                              <v-list-tile-action>
                                <v-list-tile-action-text>{{ spentPercent(envelop.amount) }}%</v-list-tile-action-text>
                                <v-icon color="grey lighten-1">{{envelop.icon}}</v-icon>
                              </v-list-tile-action>
                            </v-list-tile>
                            <v-divider
                              v-if="index + 1 < category.envelops.filter(el => el.type=='spent').length "
                              :key="index"
                            ></v-divider>
                          </template>
                        </v-list>
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-layout>
            </v-flex>
          </v-layout>
          <!-- delete dialog -->
          <v-dialog v-if="envelopToDelete" persistent v-model="deleteDialog" max-width="290">
            <v-card>
              <v-card-title class="headline">Delete Confirmation</v-card-title>

              <v-card-text>Are you sure, you want to delete Envelop {{envelopToDelete.name}} !</v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="green darken-1" flat="flat" @click="deleteDialog = false">Cancle</v-btn>

                <v-btn color="red darken-1" flat="flat" @click="deleteEnvelop">Confirm</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-layout>
      </v-container>
    </div>

    <!-- mesages -->
    <v-snackbar v-model="snackbarSuccess" multi-line color="success" :timeout="5000">
      <div v-for="(sc, index) in success" :key="index">{{sc}}</div>
      <v-btn dark flat @click="closeSnakBar">Close</v-btn>
    </v-snackbar>

    <v-snackbar v-model="snackbarError" multi-line color="error" :timeout="5000">
      <div v-for="(er, index) in errors" :key="index">{{er}}</div>
      <v-btn dark flat @click="closeSnakBar">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import _ from "lodash";

export default {
  name: "Category",

  computed: {
    ...mapGetters("category", {
      category: "getCategory"
    }),
    ...mapGetters("envelop", {
      errors: "getErrors",
      success: "getSuccess"
    })
  },
  watch: {
    category(newVal) {
      this.breadcrumbs = [
        {
          text: "Overview",
          disabled: false,
          href: "#/overview"
        }
      ];
      this.breadcrumbs.push({
        text: newVal.name,
        disabled: true,
        href: ""
      });
      let [spent, income] = [0, 0];

      let currentDate = this.date.split("-");

      let line = new Array(
        new Date(currentDate[0], currentDate[1], 0).getDate()
      );
      line.fill(0);

      newVal.envelops
        .filter(el => el.type === "spent")
        .forEach(el => {
          spent += el.amount;
          line[new Date(el.created_at).getDate()] += el.amount;
        });
      newVal.envelops
        .filter(el => el.type === "income")
        .forEach(el => {
          income += el.amount;
        });

      this.spent = spent;
      this.income = income;
      this.line = line;
    },
    success(newVal) {
      if (_.isEmpty(newVal)) {
        this.snackbarSuccess = false;
      } else {
        this.snackbarSuccess = true;
        // load the category data again if the adding or deleteing data was successful
        let currentDate = this.date.split("-");
        this.$store.dispatch("category/loadCategory", {
          id: this.$route.params.id,
          month: currentDate[1],
          year: currentDate[0]
        });
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
  data: () => ({
    breadcrumbs: [
      {
        text: "Overview",
        disabled: false,
        href: "#/overview"
      }
    ],
    income: 0,
    spent: 0,
    menu: false,
    date: new Date().toISOString().substr(0, 7),
    currentMonth: new Date().toISOString().substr(0, 7),
    line: [],
    envelopToDelete: null,
    deleteDialog: false,
    snackbarSuccess: false,
    snackbarError: false
  }),

  methods: {
    spentPercent(spent) {
      return Math.round((spent * 100) / this.spent);
    },
    dateChange() {
      this.menu = false;
      let currentDate = this.date.split("-");
      this.$store.dispatch("category/loadCategory", {
        id: this.$route.params.id,
        month: currentDate[1],
        year: currentDate[0]
      });
    },
    confirmDelete(envelop) {
      this.deleteDialog = true;
      this.envelopToDelete = envelop;
    },
    deleteEnvelop() {
      this.deleteDialog = false;
      this.$store.dispatch("envelop/deleteEnvelop", {
        id: this.envelopToDelete.id
      });

      this.envelopToDelete = null;
    },
    closeSnakBar() {
      this.$store.dispatch("category/emptyMessages");
    }
  },
  mounted() {
    this.$store.dispatch("category/loadCategory", {
      id: this.$route.params.id,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    });
    // console.log(this.category)
  }
};
</script>
<style >
.v-card {
  width: 100%;
}
.date-pick .v-btn__content {
  flex-direction: column;
  text-align: left;
  justify-content: left;
  font-size: 20px;
  align-items: stretch;
}
.date-pick {
  height: auto;
}
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>

