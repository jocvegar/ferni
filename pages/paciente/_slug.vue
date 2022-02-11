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
      <span class="title mb-4">
        {{ paciente.nombre }}
      </span>
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
          @click="addEditInfo('new', null)"
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

    <v-data-table
      :headers="headers"
      :items="cleanInformaciones"
      :loading="$fetchState.pending"
      item-key="id"
      :sort-by="['formatDate']"
      :sort-desc="true"
    >
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
          @click="deleteInfo(item.id)"
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
          @click="addEditInfo('edit', item)"
        >
          Editar
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog persistent v-model="editModal">
      <edit-paciente
        @cancel="editModal = false"
        @success="handleSuccess"
        :key="randomKey"
        :paciente="paciente"
      ></edit-paciente>
    </v-dialog>

    <v-dialog persistent v-model="addEditModal">
      <add-edit-information
        @cancel="addEditModal = false"
        @success="handleSuccess"
        @refresh="refresh()"
        :key="randomKey"
        :paciente="paciente"
        :item="item"
        :type="type"
        :parentId="paciente.id"
      ></add-edit-information>
    </v-dialog>
  </v-card>
</template>

<script>
import { db } from "~/plugins/firebase.js";
import {
  doc,
  getDoc,
  collection,
  deleteDoc,
  onSnapshot,
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
      item: null,
      type: "",
      addEditModal: false,
      informaciones: [],
      headers: [
        { text: "Fecha", value: "fecha" },
        { text: "Información", value: "informacion_clinica" },
        { text: "Diagnóstico", value: "diagnostico" },

        { value: "options", sortable: false },
      ],
    };
  },
  async asyncData({ params }) {
    const docRef = doc(db, "pacientes", params.slug);
    const docSnap = await getDoc(docRef);
    let paciente = null;
    if (docSnap.exists()) {
      paciente = Object.assign({ id: docSnap.id }, docSnap.data());
    } else {
      console.log("No such document!");
    }
    return { paciente };
  },
  async fetch() {
    const informationDocRef = collection(
      db,
      "pacientes",
      this.paciente.id,
      "informacion_clinica"
    );

    return new Promise((resolve, reject) => {
      onSnapshot(
        informationDocRef,
        { includeMetadataChanges: true },
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            this.informaciones.push({
              id: change.doc.id,
              ...change.doc.data(),
            });
          });
          resolve({ informaciones: this.informaciones });
        }
      );
    });
  },
  fetchOnServer: false,
  methods: {
    edit() {
      this.randomKey = Math.random();
      this.editModal = true;
    },
    addEditInfo(type, item) {
      this.type = type;
      this.item = item;
      this.randomKey = Math.random();
      this.addEditModal = true;
    },
    handleSuccess(data) {
      this.editModal = false;
      this.addEditModal = false;
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
    async deleteInfo(itemId) {
      if (confirm(`¿Estás seguro de eliminar?`)) {
        try {
          await deleteDoc(
            doc(
              db,
              "pacientes",
              `${this.paciente.id}/informacion_clinica`,
              itemId
            )
          ).then(async () => {
            this.$store.commit("SET_SNACKBAR", "Información eliminada");

            this.informaciones = this.informaciones.filter(function (el) {
              return el.id != itemId;
            });
          });
        } catch {
          this.$store.commit(
            "SET_SNACKBAR",
            "Ocurrió un error inesperado, inténtelo nuevamente."
          );
          console.log("error", err);
        }
      }
    },
    refresh() {
      // this.$fetch();
    },
  },
  filters: {
    formatDate(date) {
      if (date?.length === 0) return "Sin información";
      return new Date(date?.seconds * 1000).toLocaleDateString("en-GB");
    },
  },
  computed: {
    cleanInformaciones: function () {
      return [
        ...new Map(this.informaciones.map((item) => [item.id, item])).values(),
      ];
    },
  },
};
</script>
