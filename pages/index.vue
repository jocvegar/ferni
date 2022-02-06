<template>
  <v-card elevation="0">
    <v-card-actions class="float-right">
      <v-btn color="primary" elevation="2" raised to="/paciente/new" nuxt>
        <v-icon>mdi-plus</v-icon>
        Paciente Nuevo
      </v-btn>
    </v-card-actions>
    <v-card-title><h2>Pacientes</h2></v-card-title>
    <br />
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="pacientes" :search="search">
      <template v-slot:[`item.fecha_de_nacimiento`]="{ item }">
        {{ getAge(item.fecha_de_nacimiento) }}
      </template></v-data-table
    >
  </v-card>
</template>

<script>
import auth from "@/mixins/authMixin";
import { db } from "~/plugins/firebase.js";
import { collection, onSnapshot } from "firebase/firestore";

export default {
  name: "Index",
  mixins: [auth],
  head: {
    title: "Pacientes",
  },
  async asyncData() {
    const pacientesDocRef = collection(db, "pacientes");
    let pacientes = [];
    return new Promise((resolve, reject) => {
      onSnapshot(
        pacientesDocRef,
        { includeMetadataChanges: true },
        (snapshot) => {
          snapshot.forEach((doc) => {
            pacientes.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          resolve({ pacientes });
        }
      );
    });
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Nombre",
          align: "start",
          value: "nombre",
        },
        { text: "Edad", value: "fecha_de_nacimiento" },
        { text: "Antecedentes", value: "antecedentes" },
        { text: "Dedicación", value: "a_que_se_dedica" },
        { text: "Pasatiempos", value: "pasatiempos" },
        { text: "Procedencia", value: "procedencia" },
      ],
    };
  },
  methods: {
    getAge(dob) {
      if (dob) {
        const today = new Date();
        const birthDate = new Date(dob?.seconds * 1000);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      } else {
        return "sin información";
      }
    },
  },
};
</script>
