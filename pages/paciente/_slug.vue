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
      <template v-slot:[`item.pictures`]="{ item }">
        <v-btn
          small
          class="white--text"
          color="blue-grey darken-1"
          elevation="2"
          outlined
          rounded
          v-if="item.images && item.images.length > 0"
          @click="showImages(item)"
        >
          Ver Imágenes
        </v-btn>
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
        :key="randomKey"
        :paciente="paciente"
        :item="item"
        :type="type"
        :parentId="paciente.id"
        :parentName="paciente.nombre"
      ></add-edit-information>
    </v-dialog>

    <v-dialog persistent v-model="imagesModal">
      <images-modal
        @cancel="imagesModal = false"
        @edit="editImages"
        :key="randomKey"
        :images="images"
      ></images-modal>
    </v-dialog>

    <v-dialog persistent v-model="editImagesModal">
      <edit-images-modal
        @cancel="editImagesModal = false"
        :key="randomKey"
        :images="images"
        :item="activeItem"
      ></edit-images-modal>
    </v-dialog>
  </v-card>
</template>

<script>
import { db, storage } from "~/plugins/firebase.js";
import {
  doc,
  getDoc,
  collection,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
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
      activeItem: null,
      type: "",
      addEditModal: false,
      informaciones: [],
      images: [],
      imagesModal: false,
      editImagesModal: false,
      headers: [
        { text: "Fecha", value: "fecha" },
        { text: "Información", value: "informacion_clinica" },
        { text: "Diagnóstico", value: "diagnostico" },
        { text: "Imágenes", value: "pictures" },
        { value: "options", sortable: false, width: "300" },
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
    showImages(item) {
      this.images = item.images;
      this.activeItem = item;
      this.randomKey = Math.random();
      this.imagesModal = true;
    },
    editImages() {
      this.editImagesModal = true;
      this.imagesModal = false;
      this.randomKey = Math.random();
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
        try {
          if (item.images && item.images.length > 0) {
            await this.deleteImages(item.images);
          }

          await deleteDoc(
            doc(
              db,
              "pacientes",
              `${this.paciente.id}/informacion_clinica`,
              item.id
            )
          ).then(async () => {
            this.$store.commit("SET_SNACKBAR", "Información eliminada");

            this.informaciones = this.informaciones.filter(function (el) {
              return el.id != item.id;
            });
          });
        } catch (err) {
          this.$store.commit(
            "SET_SNACKBAR",
            "Ocurrió un error inesperado, inténtelo nuevamente."
          );
          console.log("error", err);
        }
      }
    },
    async deleteImages(images) {
      for (const image of images) {
        const imageRef = ref(storage, image.filename);
        try {
          await deleteObject(imageRef);
        } catch (e) {
          console.error(e);
        }
      }
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
