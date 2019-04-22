<template>
  <v-container fluid>
    <v-layout column fill-height>
      <v-layout row align-center justify-center>
        <v-flex xs6 v-if="errors.length">
          <v-alert :value="true" color="error" icon="warning" outline>
            <div v-for="(er, index) in errors" :key="index">{{er}}</div>
          </v-alert>
        </v-flex>
      </v-layout>

      <v-flex xs12>
        <v-layout align-center justify-center row fill-height>
          <v-card>
            <v-card-title primary-title>
              <v-flex xs12>
                <h3 class="headline mb-0">Create new Account</h3>
              </v-flex>

              <v-layout column>
                <v-form v-model="valid">
                  <v-flex xs12>
                    <v-text-field v-model="name" :rules="nameRules" label="Name" required></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field v-model="email" :rules="emailRules" label="Email" required></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      v-model="password"
                      :rules="passwordRules"
                      label="Passsword"
                      type="password"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      v-model="cPassword"
                      :rules="cPasswordRules"
                      label="Confirm Passsword"
                      type="password"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                     <router-link to="/login">Already have an account?</router-link>
                  </v-flex>
                  <v-flex xs12>
                    <v-btn
                      @click="register"
                      class="ml-0 mb-0"
                      color="info"
                      :disabled="!valid"
                    >Register</v-btn>
                  </v-flex>
                </v-form>
              </v-layout>
            </v-card-title>
          </v-card>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Register",
  data: () => ({
    valid: false,
    name: "",
    nameRules: [
      v => !!v || "Name is required",
      v => v.length <= 191 || "Name must be more than 191 characters"
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
    ...mapGetters("user", { errors: "getErrors" }),

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
    register() {
      this.$store.dispatch("user/register", {
        email: this.email.trim(),
        password: this.password.trim(),
        password_confirmation: this.cPassword.trim(),
        name: this.name.trim()
      });
    }
  },
  mounted(){
      this.$store.dispatch("user/emptyMessages");
  }
};
</script>
<style scoped>
.v-card {
  width: 300px;
}
</style>
