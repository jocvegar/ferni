import { mapGetters } from "vuex";

export default {
  mounted() {
    if (!this.isAuthenticated) {
      this.$router.push("/login");
    }
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },
};
