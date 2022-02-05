<template>
  <v-row>
    <v-col class="text-center">
      <img src="/v.png" alt="Vuetify.js" class="mb-5" />
      <blockquote class="blockquote">
        &#8220;{{ title }}&#8221;
        <footer>
          <small>
            <em>&mdash;JOC</em>
          </small>
        </footer>
      </blockquote>
    </v-col>
  </v-row>
</template>

<script>
import { db } from "~/plugins/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import auth from "@/mixins/authMixin";

export default {
  name: "DiagnosticosIndex",
  mixins: [auth],
  async asyncData() {
    const docRef = doc(db, "testCollection", "testDoc");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { title: docSnap.data().text };
    } else {
      console.log("No such document!");
      return { title: "No such document!" };
    }
  },
};
</script>
