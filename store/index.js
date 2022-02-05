import { auth } from "~/plugins/firebase.js";
import { signOut, signInWithEmailAndPassword } from "firebase/auth";

// state
export const state = () => ({
  user: null,
});

export const getters = {
  user(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return !!state.user;
  },
};

// actions
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

// mutations
export const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
};

export const strict = false;
