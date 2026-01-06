<template>
  <v-app dark>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <Nuxt v-if="mounted" />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" right temporary fixed>
      <v-list>
        <v-list-item>
          <v-list-item-action>
            <v-icon light>mdi-login</v-icon>
          </v-list-item-action>
          <v-list-item-title @click.stop="signIn()"> Log in </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer absolute app>
      <v-row justify="center" no-gutters>
        <v-col class="text-center mt-0" cols="12">
          El Dr. Ortopeda es un movimiento
          <span>&copy; {{ new Date().getFullYear() }}</span>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "clean",
  data() {
    return {
      clipped: false,
      rightDrawer: false,
      title: "Dr. Ortopeda",
      mounted: false,
    };
  },
  mounted() {
    this.mounted = true;
  },
  methods: {
    signIn() {
      this.$router.push("/login");
    },
  },
};
</script>
