<template>
  <v-card class="pa-8 ma-8 my-12">
    <form>
      <v-text-field v-model.trim="email" label="E-mail" required></v-text-field>
      <v-text-field
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        v-model.trim="password"
        label="Pasword"
        required
        :type="showPassword ? 'text' : 'password'"
        @click:append="showPassword = !showPassword"
      >
      </v-text-field>
      <v-btn class="mr-4" @click="userSignIn"> submit </v-btn>
    </form>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
    };
  },
  created() {
    if (this.$store.state.user) this.$router.push("/");
  },
  methods: {
    userSignIn() {
      this.$store
        .dispatch("signInWithEmail", {
          email: this.email,
          password: this.password,
        })
        .then(() => {
          this.$router.push("/");
          this.email = "";
          this.password = "";
        })
        .catch((err) => {
          console(err.message);
        });
    },
  },
};
</script>
