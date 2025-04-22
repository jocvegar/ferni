<template>
  <v-card elevation="0">
    <v-card-title>
      <span class="title mb-4">
        {{ isEditing ? "Editar" : "Agendar" }} Cita
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
      <v-form>
        <v-row class="pa-0 ma-0 mt-2" justify="center">
          <v-row>
            <v-col cols="12" md="6">
              <v-autocomplete
                chips
                clearable
                deletable-chips
                :items="patientList"
                v-model="appointment.patientId"
                outlined
                dense
                :error-messages="patientIdErrors"
                @input="$v.appointment.patientId.$touch()"
                @blur="$v.appointment.patientId.$touch()"
                :readonly="isEditing"
                :disabled="isEditing"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                label="Clínica"
                v-model="appointment.clinic"
                :items="clinics"
                dense
                outlined
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Fecha y Hora"
                v-model="appointment.start"
                type="datetime-local"
                outlined
                dense
                :error-messages="startErrors"
                @input="$v.appointment.start.$touch()"
                @blur="$v.appointment.start.$touch()"
              ></v-text-field>
            </v-col>
            <v-col v-if="isEditing" cols="12" md="6">
              <v-text-field
                label="Fecha y Hora"
                v-model="appointment.end"
                type="datetime-local"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Detalles"
                v-model="appointment.details"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>

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
                Cancelar
              </v-btn>
            </v-row>
          </v-col>
          <v-col cols="6" class="px-6">
            <v-row justify="center">
              <v-btn
                @click="submit()"
                class="mt-4"
                color="primary"
                block
                :loading="submitting"
              >
                Salvar
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import auth from "@/mixins/authMixin";
import { db } from "~/plugins/firebase.js";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export default {
  mixins: [auth, validationMixin],
  data() {
    return {
      submitting: false,
      patientList: [],
      clinics: ["Traumacentro", "Las Minitas"],
      isEditing: false,
      appointment: {
        patientId: "",
        start: this.formatForDatetimeLocal(new Date()),
        details: "",
        clinic: "Traumacentro",
        end: "",
      },
    };
  },
  props: {
    selectedAppointment: {
      type: Object,
      default: null,
    },
    appointmentPatientId: {
      type: String,
      default: null,
    },
  },
  mounted() {
    this.getPatientList();

    if (Object.keys(this.selectedAppointment).length !== 0) {
      this.isEditing = true;
      this.appointment = { ...this.selectedAppointment };
    } else if (this.appointmentPatientId) {
      this.appointment.patientId = this.appointmentPatientId;
    }
  },
  validations: {
    appointment: {
      patientId: { required },
      start: { required },
    },
  },
  methods: {
    formatForDatetimeLocal(date) {
      const pad = (n) => String(n).padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    },
    async getPatientList() {
      const pacientesQuery = query(
        collection(db, "pacientes"),
        orderBy("nombre")
      );
      const pacientesSnapshot = await getDocs(pacientesQuery);
      this.patientList = pacientesSnapshot.docs.map((doc) => ({
        value: doc.id,
        text: doc.data().nombre,
      }));
    },
    submit() {
      this.submitting = true;
      this.$v.$touch();

      if (this.$v.appointment.$invalid) {
        this.submitting = false;
        return;
      }

      this.isEditing ? this.updateAppointment() : this.createAppointment();
    },
    async createAppointment() {
      try {
        await addDoc(
          collection(
            db,
            "pacientes",
            this.appointment.patientId,
            "appointments"
          ),
          {
            ...this.appointment,
            name: this.patientList.find(
              (p) => p.value === this.appointment.patientId
            ).text,
            createdAt: serverTimestamp(),
            end: (() => {
              const start = new Date(this.appointment.start);
              start.setMinutes(start.getMinutes() + 30);
              const pad = (n) => n.toString().padStart(2, "0");
              return `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(
                start.getDate()
              )}T${pad(start.getHours())}:${pad(start.getMinutes())}`;
            })(),
          }
        ).then(() => {
          this.$emit("success", "Cita guardada");
        });
      } catch (error) {
        console.error("Error saving appointment:", error);
      } finally {
        this.submitting = false;
      }
    },
    async updateAppointment() {
      try {
        const appointmentRef = collection(
          db,
          "pacientes",
          this.appointment.patientId,
          "appointments"
        );

        await updateDoc(doc(appointmentRef, this.selectedAppointment.id), {
          ...this.appointment,
          updatedAt: serverTimestamp(),
        });

        this.$emit("success", "Cita actualizada");
      } catch (error) {
        console.error("Error updating appointment:", error);
      } finally {
        this.submitting = false;
      }
    },
  },
  computed: {
    patientIdErrors() {
      const errors = [];
      if (!this.$v.appointment.patientId.$dirty) return errors;

      !this.$v.appointment.patientId.required &&
        errors.push("Paciente es requerido");
      return errors;
    },
    startErrors() {
      const errors = [];
      if (!this.$v.appointment.start.$dirty) return errors;

      !this.$v.appointment.start.required &&
        errors.push("Fecha y hora son requeridos");
      return errors;
    },
  },
};
</script>
