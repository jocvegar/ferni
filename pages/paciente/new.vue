<template>
  <div>
    <v-row class="my-2">
      <v-col cols="12" align="right">
        <v-btn color="primary" elevation="2" raised to="/" nuxt>
          <v-icon>mdi-chevron-left</v-icon>
          Atras
        </v-btn>
      </v-col>
    </v-row>

    <v-card elevation="2">
      <v-card-title>
        <span class="title"> Paciente Nuevo </span>
      </v-card-title>
      <v-card-text>
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
                  prepend-inner-icon="mdi-calendar"
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
              label="Teléfono"
              :value="computedPhoneFormatted"
              outlined
              class="py-0"
              type="tel"
              prepend-inner-icon="mdi-phone"
              @input="onPhoneInput"
            ></v-text-field>
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
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Procedencia"
              v-model.trim="paciente.procedencia"
              outlined
              class="py-0"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Información clinica"
              v-model.trim="informacion_clinica"
              outlined
              class="py-0"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Diagnóstico"
              v-model.trim="diagnostico"
              outlined
              class="py-0"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0 mt-2">
          <v-col cols="6" offset="3">
            <v-row align="center" justify="end">
              <v-btn
                @click="submit()"
                class="mt-4"
                color="primary"
                block
                :loading="submitting"
              >
                Guardar
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { db } from "~/plugins/firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import auth from "@/mixins/authMixin";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  name: "NuevoPaciente",
  mixins: [auth, validationMixin],
  head: { title: "Nuevo Paciente" },
  validations: {
    paciente: {
      nombre: { required },
    },
  },
  data() {
    return {
      dateMenu: false,
      submitting: false,
      paciente: {
        nombre: "",
        fecha_de_nacimiento: "",
        antecedentes: "",
        a_que_se_dedica: "",
        pasatiempos: "",
        procedencia: "",
        telefono: "",
      },
      informacion_clinica: "",
      diagnostico: "",
    };
  },
  methods: {
    async submit() {
      this.$v.$touch();
      if (this.$v.paciente.$invalid) return;
      try {
        this.submitting = true;
        await addDoc(collection(db, "pacientes"), this.paciente).then((doc) => {
          if (this.informacion_clinica.length > 0) {
            addDoc(collection(db, `pacientes/${doc.id}/informacion_clinica`), {
              userId: doc.id,
              informacion_clinica: this.informacion_clinica,
              diagnostico: this.diagnostico,
              fecha: serverTimestamp(),
            });
          }
          if (this.$nuxt.isOffline) {
            this.submitting = false;
            this.$router.push("/");
            this.$store.commit(
              "SET_SNACKBAR",
              "Estas sin conexión, los datos y el diagnóstico se aparecerán cuando vuelvas a conectarte"
            );
          } else {
            this.submitting = false;
            this.$router.push(`/paciente/${doc.id}`);
          }
        });
      } catch (err) {
        this.$store.commit(
          "SET_SNACKBAR",
          "Ocurrió un error inesperado, inténtelo nuevamente."
        );
        console.log("error", err);
      }
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    onPhoneInput(value) {
      const raw = value.replace(/\D/g, "").slice(0, 8);
      this.paciente.telefono = raw;
    },
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.paciente.fecha_de_nacimiento);
    },
    computedPhoneFormatted() {
      const raw = this.paciente.telefono;

      if (!raw) return "";
      if (raw.length <= 4) return raw;
      return `${raw.slice(0, 4)}-${raw.slice(4)}`;
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
