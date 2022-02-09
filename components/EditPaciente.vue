<template>
  <v-card elevation="0">
    <v-card-title>
      <span class="headline mb-4"> Editar Paciente </span>
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
        <v-row align="end">
          <v-col cols="12" md="6">
            <v-text-field
              label="Nombre"
              v-model.trim="paciente.nombre"
              outlined
              class="py-0"
              :error-messages="nombreErrors"
              @input="$v.paciente.nombre.$touch()"
              @blur="$v.paciente.nombre.$touch()"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-menu
              v-model="dateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
              @blur="dateMenu = true"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  label="Fecha de Nacimiento"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :value="computedDateFormatted"
                  outlined
                  class="py-0"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="paciente.fecha_de_nacimiento"
                @input="dateMenu = false"
                locale="es-us"
                no-title
                scrollable
                :max="new Date().toISOString().slice(0, 10)"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Antecedentes"
              v-model.trim="paciente.antecedentes"
              outlined
              class="py-0"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="¿A qué se dedica?"
              v-model.trim="paciente.a_que_se_dedica"
              outlined
              class="py-0"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Pasatiempos"
              v-model.trim="paciente.pasatiempos"
              outlined
              class="py-0"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Procedencia"
              v-model.trim="paciente.procedencia"
              outlined
              class="py-0"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0 mt-2" justify="center">
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
          <v-col cols="6" class="px-6">
            <v-row justify="center">
              <v-btn
                @click="$emit('cancel')"
                class="mt-4"
                color="primary"
                block
                outlined
              >
                Canclar
              </v-btn>
            </v-row>
          </v-col>
          <v-col cols="6" class="px-6">
            <v-row justify="center">
              <v-btn
                @click="update()"
                class="mt-4"
                color="primary"
                block
                :loading="submitting"
              >
                Editar
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import auth from "@/mixins/authMixin";
import { db } from "~/plugins/firebase.js";
import { doc, updateDoc } from "firebase/firestore";

export default {
  mixins: [auth, validationMixin],
  validations: {
    paciente: {
      nombre: { required },
    },
  },
  props: {
    paciente: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      submitting: false,
      dateMenu: false,
    };
  },
  methods: {
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    async update() {
      this.$v.$touch();
      if (this.$v.paciente.$invalid) return;
      this.submitting = true;

      const ref = doc(db, "pacientes", this.paciente.id);

      try {
        await updateDoc(ref, this.paciente).then(() => {
          if (this.$nuxt.isOffline) {
            this.$store.commit(
              "SET_SNACKBAR",
              "Estas sin conexión, los datos aparecerán cuando vuelvas a conectarte"
            );
          }
          this.$emit("success", "Actualizado");
          this.submitting = false;
        });
      } catch (err) {
        this.$store.commit(
          "SET_SNACKBAR",
          "Ocurrió un error inesperado, inténtelo nuevamente."
        );
        console.log("error", err);
        this.submitting = false;
      }
    },
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.paciente.fecha_de_nacimiento);
    },
    nombreErrors() {
      const errors = [];
      if (!this.$v.paciente.nombre.$dirty) return errors;
      !this.$v.paciente.nombre.required && errors.push("Nombre es requerido");
      return errors;
    },
  },
};
</script>
