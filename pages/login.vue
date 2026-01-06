<template>
  <v-card class="pa-8 ma-8 my-12">
    <v-card-title><span class="title mb-4">Ingresar</span></v-card-title>
    <form>
      <div class="text-subtitle-1 mb-1">E-mail</div>
      <v-text-field
        v-model.trim="email"
        placeholder="example@mail.com"
        variant="outlined"
      ></v-text-field>

      <div class="text-subtitle-1 mb-1">Password</div>
      <v-text-field
        v-model.trim="password"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showPassword = !showPassword"
        variant="outlined"
      ></v-text-field>

      <v-btn class="mt-4" block @click="userSignIn">Submit</v-btn>
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
          console.log(err.message);
        });
    },
  },
};
</script>
