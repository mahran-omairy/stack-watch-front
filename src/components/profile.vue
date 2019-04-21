<template>
  <div>
    <v-header/>

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
            <v-flex xs5 v-if="errors.length">
              <v-alert :value="true" color="error" icon="warning" outline>
                <div v-for="(er, index) in errors" :key="index">{{er}}</div>
              </v-alert>
            </v-flex>

            <v-flex xs5 v-if="success.length">
              <v-alert :value="true" color="success" icon="check_circle" outline>
                <div v-for="(sc, index) in success" :key="index">{{sc}}</div>
              </v-alert>
            </v-flex>
          </v-layout>
          <v-layout row align-center justify-center>
            <v-flex xs5>
              <v-layout align-center justify-center row fill-height>
                <v-card>
                  <v-card-title primary-title>
                    <v-flex xs12>
                      <h3 class="headline mb-0">Profile</h3>
                    </v-flex>
                    <v-layout column>
                      <v-form>
                        <v-flex xs12>
                          <v-text-field v-model="email" :rules="emailRules" label="Email" required></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field v-model="name" :rules="nameRules" label="Name" required></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-btn @click="updateUser" class="ml-0 mb-0" color="info">update</v-btn>
                        </v-flex>
                      </v-form>
                      <v-divider class="mt-4"></v-divider>
                      <h3 class="headline mb-0 mt-2">Change Passowrd</h3>
                      <v-form v-model="valid">
                        <v-flex xs12>
                          <v-text-field
                            v-model="password"
                            type="password"
                            :rules="passwordRules"
                            label="New Password"
                            required
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field
                            v-model="cPassword"
                            type="password"
                            :rules="cPasswordRules"
                            label="Confirm Password"
                            required
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-btn
                            @click="updateUserPassword"
                            :disabled="!valid"
                            class="ml-0 mb-0"
                            color="info"
                          >Change password</v-btn>
                        </v-flex>
                      </v-form>
                      <v-divider class="mt-4 mb-4"></v-divider>

                      <v-flex xs12>
                        <span
                          class="font-weight-thin"
                        >By deleteing your account, you will loose all stored data!</span>
                      </v-flex>
                      <v-flex xs12>
                        <v-btn
                          @click.stop="dialog = true"
                          class="ml-0 mb-0"
                          color="error"
                        >Delete Account</v-btn>
                      </v-flex>
                    </v-layout>
                  </v-card-title>
                </v-card>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-dialog v-model="dialog" max-width="290">
            <v-card>
              <v-card-title class="headline">Delete Confirmation</v-card-title>

              <v-card-text>Are you sure, you want to delete account!</v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="green darken-1" flat="flat" @click="dialog = false">Cancle</v-btn>

                <v-btn color="red darken-1" flat="flat" @click="deleteAccount">Confirm</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
import vHeader from "./header.vue";
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  components: {
    vHeader
  },
  data: () => ({
    breadcrumbs: [
      {
        text: "Overview",
        disabled: false,
        href: "#/overview"
      },
      {
        text: "Profile",
        disabled: true,
        href: "/profile"
      }
    ],
    dialog: false,
    valid: false,
    name: "",
    nameRules: [
      v => !!v || "E-mail is required",
      v => v.length <= 191 || "Password must be more than 191 characters"
    ],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+/.test(v) || "E-mail must be valid"
    ],
    password: "",
    passwordRules: [
      v => !!v || "Password is required",
      v => v.length >= 5 || "Password must be more than 5 characters",
      v => v.length <= 20 || "Password must be more than 20 characters"
    ],
    cPassword: ""
  }),
  computed: {
    ...mapGetters("user", {
      errors: "getErrors",
      success: "getSuccess",
      user: "getUser"
    }),

    cPasswordRules() {
      const rules = [];
      const rule1 = v => !!v || "Confirm your password";
      rules.push(rule1);
      const rule2 = v =>
        (!!v && v) === this.password || "Password and confirmation don't match";
      rules.push(rule2);
      return rules;
    }
  },
  methods: {
    updateUser() {
      this.$store.dispatch("user/updateUserData", {
        email: this.email.trim(),
        name: this.name.trim()
      });
    },
    updateUserPassword() {
      this.$store.dispatch("user/updateUserPassword", {
        password: this.password.trim(),
        password_confirmation: this.cPassword.trim()
      });
    },
    deleteAccount() {
      this.$store.dispatch("user/deleteAccount");
      this.dialog = false
    }
  },
  mounted() {
    this.email = this.user.email;
    this.name = this.user.name;

    this.$store.dispatch("user/emptyMessages");
  }
};
</script>
<style >
.v-card {
  width: 100%;
}
</style>

