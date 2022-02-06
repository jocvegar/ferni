import { auth } from "~/plugins/firebase.js";
import { signOut, signInWithEmailAndPassword } from "firebase/auth";

export const state = () => ({
  user: null,
  snackbarText: "",
  snackbar: false,
});

export const getters = {
  user(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return !!state.user;
  },
};

export const actions = {
  setUser({ commit }, payload) {
    commit("SET_USER", payload);
  },
  signInWithEmail({ commit }, { email, password }) {
    return signInWithEmailAndPassword(auth, email, password);
  },
  signOut() {
    return signOut(auth);
  },
};

export const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_SNACKBAR(state, payload) {
    state.snackbar = true;
    state.snackbarText = payload;
  },
  CLOSE_SNACKBAR(state) {
    state.snackbar = false;
  },
};

export const strict = false;
