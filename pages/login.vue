<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field label="Email" v-model="email"></v-text-field>
          <v-text-field label="Password" v-model="password"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-btn @click="login()">
            <v-icon left>mdi-account-check</v-icon>
            Login
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "~/plugins/firebase.js";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  mounted() {
    // console.log("auth.currentUser", auth.currentUser);
    // if (auth.currentUser) {
    //   this.$router.push("/");
    // }
  },
  methods: {
    async login() {
      const credentials = await signInWithEmailAndPassword(
        auth,
        this.email,
        this.password
      );
      if (credentials.user) {
        console.log("credentials", credentials);
        this.$store.commit("setUser", credentials.user);
        this.$router.push("/");
      }
    },
  },
};
</script>
