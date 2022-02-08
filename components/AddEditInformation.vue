<template>
  <v-card elevation="0">
    <v-card-title>
      <span class="headline mb-4">
        {{ type == "new" ? "Nueva" : "Editar" }} Información Clínica
      </span>
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
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Información clinica"
              v-model.trim="informacion.informacion_clinica"
              outlined
              class="py-0"
            ></v-text-field>
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
              >
                Guardar
              </v-btn>
              <v-btn
                v-else
                @click="update()"
                class="mt-4"
                color="primary"
                block
              >
                Actualizar
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
import { db } from "~/plugins/firebase.js";
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
      informacion: {
        informacion_clinica: "",
      },
    };
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    parentId: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
      required: false,
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
      try {
        await addDoc(
          collection(db, "pacientes", this.parentId, "informacion_clinica"),
          {
            userId: this.parentId,
            informacion_clinica: this.informacion.informacion_clinica,
            fecha: serverTimestamp(),
          }
        ).then(() => {
          this.$emit("success", "Creado");
        });
      } catch {
        this.$store.commit(
          "SET_SNACKBAR",
          "Ocurrió un error inesperado, inténtelo nuevamente."
        );
        console.log("error", err);
      }
    },
    async update() {
      const informacionRed = doc(
        db,
        "pacientes",
        this.parentId,
        "informacion_clinica",
        this.informacion.id
      );

      await updateDoc(informacionRed, {
        informacion_clinica: this.informacion.informacion_clinica,
      }).then(() => {
        this.$emit("success", "Actualizado");
        this.$emit("refresh");
      });
    },
  },
};
</script>