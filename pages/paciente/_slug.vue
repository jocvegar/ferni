<template>
  <v-card elevation="0">
    <v-card-actions class="float-right">
      <v-btn color="primary" elevation="2" raised to="/" nuxt outlined>
        <v-icon>mdi-chevron-left</v-icon>
        Atras
      </v-btn>
    </v-card-actions>
    <v-card-title>
      <h2>{{ paciente.nombre }}</h2>
    </v-card-title>
    <v-card-text> informacion: {{ informacion }} </v-card-text>
  </v-card>
</template>

<script>
import { db } from "~/plugins/firebase.js";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";

export default {
  async asyncData({ params }) {
    const docRef = doc(db, "pacientes", params.slug);
    const docSnap = await getDoc(docRef);
    let paciente = null;
    let informacion = [];
    if (docSnap.exists()) {
      paciente = Object.assign({ id: docSnap.id }, docSnap.data());
      const querySnapshot = await getDocs(
        collection(db, "pacientes", params.slug, "informacion_clinica")
      );
      querySnapshot.forEach((doc) => {
        informacion.push(Object.assign({ id: doc.id }, doc.data()));
      });
    } else {
      console.log("No such document!");
    }
    return { paciente, informacion };
  },
};
</script>
