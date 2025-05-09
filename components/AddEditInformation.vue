<template>
  <v-card elevation="0">
    <v-card-title>
      <v-row>
        <v-col cols="10">
          <span class="title mb-4">
            {{ type == "new" ? "Nueva" : "Editar" }} Información Clínica
          </span>
        </v-col>

        <v-col cols="2">
          <v-btn
            style="right: 15px; top: 10px"
            icon
            color="primary"
            fab
            absolute
            @click="$emit('cancel')"
          >
            <v-icon dark>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            label="Información clinica"
            v-model.trim="informacion.informacion_clinica"
            outlined
            class="py-0"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            label="Diagnóstico"
            v-model.trim="informacion.diagnostico"
            outlined
            class="py-0"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-file-input
            v-model="images"
            accept="image/*"
            label="Imágenes"
            small-chips
            multiple
            @change="setImages"
            :disabled="submitting"
          >
            <template v-slot:append-outer>
              <v-progress-circular
                v-if="submitting"
                color="grey"
                indeterminate
                small
              />
            </template>
          </v-file-input>
        </v-col>
      </v-row>
      <v-row class="pa-0 ma-0 mt-2">
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="6" offset="3">
          <v-row align="center" justify="end">
            <v-btn
              v-if="this.type == 'new'"
              @click="submit()"
              class="mt-4"
              color="primary"
              block
              :loading="submitting"
              :disabled="!informacion.informacion_clinica"
            >
              Guardar
            </v-btn>
            <v-btn
              v-else
              @click="update()"
              class="mt-4"
              color="primary"
              block
              :loading="submitting"
              :disabled="!informacion.informacion_clinica"
            >
              Actualizar
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import { db, storage } from "~/plugins/firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

export default {
  data() {
    return {
      submitting: false,
      informacion: {
        informacion_clinica: "",
        diagnostico: "",
        images: [],
      },
      images: [],
    };
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    patientId: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
      required: false,
    },
    patientName: {
      type: String,
      required: true,
      default: "Sin Nombre",
    },
  },
  mounted() {
    let scrollPosition = document.getElementsByClassName("v-dialog")[0];
    if (scrollPosition) scrollPosition.scrollTop = 0;

    if (this.type == "edit") {
      this.informacion = Object.assign({}, this.item);
    }
  },
  methods: {
    async submit() {
      this.submitting = true;
      await this.uploadFiles(this.images);
      try {
        await addDoc(
          collection(db, "pacientes", this.patientId, "informacion_clinica"),
          {
            userId: this.patientId,
            informacion_clinica: this.informacion.informacion_clinica,
            diagnostico: this.informacion.diagnostico,
            fecha: serverTimestamp(),
            images: this.informacion.images,
          }
        ).then(() => {
          this.$emit("success", "Creado");
          this.submitting = false;
        });
      } catch {
        this.$store.commit(
          "SET_SNACKBAR",
          "Ocurrió un error inesperado, inténtelo nuevamente."
        );
        console.log("error", err);
        this.submitting = false;
      }
    },
    async update() {
      this.submitting = true;
      await this.uploadFiles(this.images);
      const informacionRed = doc(
        db,
        "pacientes",
        this.patientId,
        "informacion_clinica",
        this.informacion.id
      );

      await updateDoc(informacionRed, {
        informacion_clinica: this.informacion.informacion_clinica,
        diagnostico: this.informacion.diagnostico,
        images: this.informacion.images,
      }).then(() => {
        this.$emit("success", "Actualizado");
        this.submitting = false;
      });
    },
    setImages(files) {
      this.images = files;
    },
    async uploadFiles(files) {
      for (const file of files) {
        try {
          if (file && file.name) {
            const filePath = `info-clinica/${this.patientName.replace(
              /\s/g,
              ""
            )}/${Date.now()}-${file.name.replace(/\s/g, "")}`;
            const metadata = { contentType: file.type };
            const storageRef = ref(storage, filePath);
            await uploadBytes(storageRef, file, metadata).then(async () => {
              await getDownloadURL(ref(storage, filePath))
                .then((url) => {
                  if (!this.informacion.images) this.informacion.images = [];
                  this.informacion.images.push({
                    imgSrc: url,
                    filename: filePath,
                  });
                })
                .catch((error) => {
                  console.error("error", error);
                });
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
  },
};
</script>
