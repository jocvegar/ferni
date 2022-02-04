<template>
  <v-card elevation="0">
    <v-card-actions class="float-right">
      <v-btn color="primary" elevation="2" raised to="/" nuxt outlined>
        <v-icon>mdi-chevron-left</v-icon>
        Atras
      </v-btn>
    </v-card-actions>
    <v-card-title><h2>Nuevo Paciente</h2></v-card-title>

    <button @click="writeToFirestore">
      <span>Write now</span>
    </button>
  </v-card>
</template>
<script>
import { db } from "~/plugins/firebase.js";
import { doc, setDoc } from "firebase/firestore";
export default {
  name: "PacienteNew",
  methods: {
    async writeToFirestore() {
      const ref = doc(db, "testCollection", "testDoc1");
      const document = {
        text: "Firebase 9 rocks1!",
      };
      try {
        await setDoc(ref, document);
        alert("Success!");
      } catch (e) {
        alert("Error!");
        console.error(e);
      }
    },
  },
};
</script>
