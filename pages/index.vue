<template>
  <div class="mt-2">
    <v-row class="my-2">
      <v-col cols="12" align="right">
        <v-btn color="primary" elevation="2" raised to="/paciente/new" nuxt>
          <v-icon>mdi-plus</v-icon>
          Paciente Nuevo
        </v-btn>
      </v-col>
    </v-row>
    <v-card elevation="2">
      <v-card-title>
        <span class="title"> Pacientes </span>
      </v-card-title>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="pacientes"
        :search="search"
        :sort-by="['nombre']"
        :footer-props="{
          itemsPerPageOptions: [10, 50, 100],
        }"
      >
        <template v-slot:[`item.nombre`]="{ item }">
          <NuxtLink
            :to="`/paciente/${item.id}`"
            class="font-weight-medium text-decoration-none black--text"
          >
            {{ item.nombre }}
          </NuxtLink>
        </template>

        <template v-slot:[`item.fecha_de_nacimiento`]="{ item }">
          {{ getAge(item.fecha_de_nacimiento) }}
        </template>
        <template v-slot:[`item.show`]="{ item }">
          <NuxtLink
            :to="`/paciente/${item.id}`"
            class="text-decoration-none black--text"
          >
            <v-chip color="blue" outlined pill>Ver paciente</v-chip>
          </NuxtLink>
        </template>
      </v-data-table>
    </v-card>
  </div>
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
          snapshot.docChanges().forEach((change) => {
            pacientes.push({
              id: change.doc.id,
              ...change.doc.data(),
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
        { text: "Teléfono", value: "telefono" },
        { text: "Antecedentes", value: "antecedentes" },
        { text: "Dedicación", value: "a_que_se_dedica" },
        { text: "Pasatiempos", value: "pasatiempos" },
        { text: "Procedencia", value: "procedencia" },
        {
          text: "Ir a paciente",
          value: "show",
          sortable: false,
        },
      ],
    };
  },
  methods: {
    getAge(dob) {
      if (dob) {
        let dobFormat = dob?.replace(/-/g, ",");
        const today = new Date();
        const birthDate = new Date(dobFormat);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
      } else {
        return "N/A";
      }
    },
  },
};
</script>
