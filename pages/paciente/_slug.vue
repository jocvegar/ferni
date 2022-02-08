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
    <v-card-title class="text-h5">
      {{ paciente.nombre }}
    </v-card-title>

    <v-divider class="mb-4"></v-divider>

    <v-row>
      <v-col cols="12" md="6">
        <v-list-item-title class="mb-1 ml-3">
          <span class="font-weight-medium"> Edad:</span>
          {{ getAge(paciente.fecha_de_nacimiento) }}
        </v-list-item-title>
      </v-col>
      <v-col cols="12" md="6">
        <v-list-item-title class="mb-1 ml-3">
          <span class="font-weight-medium"> A que se dedica: </span>
          {{ paciente.a_que_se_dedica }}
        </v-list-item-title>
      </v-col>
      <v-col cols="12" md="6">
        <v-list-item-title class="mb-1 ml-3">
          <span class="font-weight-medium"> Pasatiempos: </span>
          {{ paciente.pasatiempos }}
        </v-list-item-title>
      </v-col>
      <v-col cols="12" md="6">
        <v-list-item-title class="mb-1 ml-3">
          <span class="font-weight-medium"> Antecedentes: </span>
          {{ paciente.antecedentes }}
        </v-list-item-title>
      </v-col>
      <v-col cols="12" md="6">
        <v-list-item-title class="mb-1 ml-3">
          <span class="font-weight-medium"> Procedencia: </span>
          {{ paciente.procedencia }}
        </v-list-item-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn
          color="primary"
          elevation="2"
          rounded
          class="float-right mr-md-6"
        >
          <v-icon>mdi-plus</v-icon>
          Agregar Informacion
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="pa-0 ma-0 mt-2">
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
    </v-row>

    <v-data-table :headers="headers" :items="informacion">
      <template v-slot:[`item.fecha`]="{ item }">
        {{ item.fecha | formatDate }}
      </template>
      <template v-slot:[`item.options`]="{ item }">
        <v-btn
          small
          class="ml-3 white--text"
          color="red darken-4"
          elevation="2"
          outlined
          rounded
          @click="deleteInfo(item)"
        >
          Eliminar
        </v-btn>
        <v-btn
          small
          class="ml-3 white--text"
          color="blue darken-4"
          elevation="2"
          outlined
          rounded
        >
          Editar
        </v-btn>
      </template>
    </v-data-table>

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
import {
  doc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";
import auth from "@/mixins/authMixin";

export default {
  mixins: [auth],
  head: {
    title: this?.paciente?.nombre || "Paciente",
  },
  data() {
    return {
      informacion: [],
      randomKey: 0,
      editModal: false,
      headers: [
        { text: "Fecha", value: "fecha" },
        { text: "Información", value: "informacion_clinica" },
        { value: "options", sortable: false },
      ],
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
        return "sin información";
      }
    },
    async deleteInfo(item) {
      if (confirm(`¿Estás seguro de eliminar?`)) {
        await deleteDoc(
          doc(
            db,
            "pacientes",
            `${this.paciente.id}/informacion_clinica`,
            item.id
          )
        ).then(async () => {
          this.$store.commit("SET_SNACKBAR", "Información eliminada");
          await this.$nuxt.refresh();
        });
      }
    },
  },
  filters: {
    formatDate(date) {
      if (date?.length === 0) return "Sin información";
      return new Date(date?.seconds * 1000).toLocaleDateString("us-SP");
    },
  },
};
</script>
