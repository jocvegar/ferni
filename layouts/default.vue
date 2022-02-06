<template>
  <v-app dark>
    <v-navigation-drawer
      v-if="this.$vuetify.breakpoint.mdAndUp"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer v-else v-model="leftDrawer" temporary fixed>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
        v-if="this.$vuetify.breakpoint.mdAndUp"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="leftDrawer = !leftDrawer" v-else>
        <v-icon>mdi-{{ `chevron-${leftDrawer ? "right" : "left"}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" @click="handleLogoClick()" />
      <v-spacer />
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <v-snackbar
          top
          :timeout="3000"
          v-model="snackbar"
          rounded="pill"
          color="blue"
        >
          <span class="text-center"> {{ snackbarText }}</span>
          <template v-slot:action="{ attrs }">
            <v-btn icon v-bind="attrs" @click="closeSnackBar()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" right temporary fixed>
      <v-list>
        <v-list-item v-if="isAuthenticated">
          <v-list-item-action>
            <v-icon light>mdi-account-cancel</v-icon>
          </v-list-item-action>
          <v-list-item-title @click.stop="signOut()">
            Log out
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-else>
          <v-list-item-action>
            <v-icon light>mdi-login</v-icon>
          </v-list-item-action>
          <v-list-item-title @click.stop="signIn()"> Log in </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer absolute app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "DefaultLayout",
  data() {
    return {
      clipped: false,
      items: [
        {
          icon: "mdi-account-check",
          title: "Pacientes",
          to: "/",
        },
        {
          icon: "mdi-prescription",
          title: "Diagnósticos",
          to: "/diagnosticos",
        },
      ],
      miniVariant: true,
      rightDrawer: false,
      leftDrawer: false,
      title: "Dr. Alvarenga",
    };
  },
  methods: {
    handleLogoClick() {
      if (this.$route.path !== "/") {
        this.$router.push("/");
      } else {
        window.scroll({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    },
    signOut() {
      this.$store.dispatch("signOut").catch((err) => {
        alert(err.message);
      });
      this.$router.push("/login");
    },
    signIn() {
      this.$router.push("/login");
    },
    closeSnackBar() {
      this.$store.commit("CLOSE_SNACKBAR");
    },
  },
  computed: {
    ...mapState(["snackbarText", "snackbar"]),
    ...mapGetters(["isAuthenticated"]),
  },
};
</script>
