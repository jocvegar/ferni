import { auth } from "~/plugins/firebase.js";
import { onAuthStateChanged } from "firebase/auth";

export default (context) => {
  const { store } = context;

  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        store.dispatch("setUser", user);
      } else {
        store.dispatch("setUser", null);
      }
      resolve();
    });
    // auth.onAuthStateChanged((user) => {
    //   store.dispatch("setUser", user);
    //   resolve();
    // });
  });
};
