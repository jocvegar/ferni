<template>
  <v-card elevation="0">
    <v-card-actions class="float-right">
      <v-btn color="primary" elevation="2" raised to="/" nuxt outlined>
        <v-icon>mdi-chevron-left</v-icon>
        Atras
      </v-btn>
      <v-btn
        color="primary"
        elevation="2"
        raised
        @click="edit()"
        v-if="paciente"
      >
        <v-icon>mdi-pencil-outline </v-icon>
        Editar
      </v-btn>
    </v-card-actions>
    <br />
    <br />
    <br />
    <v-card-title>
      <h2>{{ paciente.nombre }}</h2>
    </v-card-title>
    <v-card-text> informacion: {{ informacion }} </v-card-text>
    <v-dialog persistent v-model="editModal" max-width="90vw">
      <edit-paciente
        @cancel="editModal = false"
        @success="handleSuccess"
        :key="randomKey"
        :paciente="paciente"
      ></edit-paciente>
    </v-dialog>
  </v-card>
</template>

<script>
import { db } from "~/plugins/firebase.js";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import auth from "@/mixins/authMixin";

export default {
  mixins: [auth],
  head: {
    title: this?.paciente?.nombre || "Paciente",
  },
  data() {
    return {
      randomKey: 0,
      editModal: false,
    };
  },
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
  methods: {
    edit() {
      this.randomKey = Math.random();
      this.editModal = true;
    },
    handleSuccess(data) {
      this.editModal = false;
      this.$store.commit("SET_SNACKBAR", data);
    },
  },
};
</script>
