<template>
  <div class="new-patient-container">
    <v-row class="mb-4">
      <v-col cols="12" align="right">
        <v-btn color="grey lighten-1" outlined to="/" nuxt rounded>
          <v-icon left>mdi-chevron-left</v-icon>
          Atras
        </v-btn>
      </v-col>
    </v-row>

    <v-card elevation="0" rounded="lg" class="form-card">
      <v-card-title class="card-header">
        <v-icon color="primary" class="mr-3">mdi-account-plus</v-icon>
        <span class="form-title">Paciente Nuevo</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-6">
        <div class="section-label mb-4">
          <v-icon small class="mr-2">mdi-account</v-icon>
          Información Personal
        </div>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              label="Nombre"
              v-model.trim="paciente.nombre"
              outlined
              dense
              :error-messages="nombreErrors"
              @input="$v.paciente.nombre.$touch()"
              @blur="$v.paciente.nombre.$touch()"
              prepend-inner-icon="mdi-account"
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
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  label="Fecha de Nacimiento"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :value="computedDateFormatted"
                  outlined
                  dense
                  prepend-inner-icon="mdi-cake-variant"
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
              dense
              type="tel"
              prepend-inner-icon="mdi-phone"
              @input="onPhoneInput"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Procedencia"
              v-model.trim="paciente.procedencia"
              outlined
              dense
              prepend-inner-icon="mdi-map-marker"
            ></v-text-field>
          </v-col>
        </v-row>

        <div class="section-label mb-4 mt-6">
          <v-icon small class="mr-2">mdi-information</v-icon>
          Información Adicional
        </div>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              label="¿A qué se dedica?"
              v-model.trim="paciente.a_que_se_dedica"
              outlined
              dense
              prepend-inner-icon="mdi-briefcase"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Pasatiempos"
              v-model.trim="paciente.pasatiempos"
              outlined
              dense
              prepend-inner-icon="mdi-gamepad-variant"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Antecedentes"
              v-model.trim="paciente.antecedentes"
              outlined
              dense
              prepend-inner-icon="mdi-alert-circle"
            ></v-text-field>
          </v-col>
        </v-row>

        <div class="section-label mb-4 mt-6">
          <v-icon small class="mr-2">mdi-clipboard-text</v-icon>
          Primera Consulta (Opcional)
        </div>
        <v-row>
          <v-col cols="12">
            <v-textarea
              label="Información clínica"
              v-model.trim="informacion_clinica"
              outlined
              rows="3"
              prepend-inner-icon="mdi-file-document"
            ></v-textarea>
          </v-col>
          <v-col cols="12">
            <v-textarea
              label="Diagnóstico"
              v-model.trim="diagnostico"
              outlined
              rows="2"
              prepend-inner-icon="mdi-stethoscope"
            ></v-textarea>
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col cols="12" sm="6" offset-sm="3">
            <v-btn
              @click="submit()"
              color="primary"
              block
              large
              rounded
              :loading="submitting"
              elevation="0"
            >
              <v-icon left>mdi-content-save</v-icon>
              Guardar Paciente
            </v-btn>
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

<style scoped lang="scss">
.new-patient-container {
  margin: 0 auto;
  padding: 12px;
}

.form-card {
  border: 1px solid #e0e0e0;
}

.card-header {
  padding: 20px 24px;
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
}
</style>
