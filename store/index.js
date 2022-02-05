export const state = () => ({
  user: { name: "Jose" },
});

export const mutations = {
  setUser(state, payload) {
    state.user = payload;
  },
};
