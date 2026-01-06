<template>
  <div class="patient-detail-container">
    <v-card elevation="0" rounded class="patient-header-card mb-6">
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-lighten-1"
          variant="outlined"
          to="/"
          nuxt
          rounded
          class="mr-2"
        >
          <v-icon>mdi-chevron-left</v-icon>
          Atras
        </v-btn>
        <v-btn
          v-if="paciente"
          color="primary"
          variant="flat"
          rounded
          class="px-2"
          @click="edit()"
        >
          <v-icon left>mdi-pencil-outline</v-icon>
          Editar
        </v-btn>
      </v-card-actions>

      <v-card-title class="px-6 pb-2">
        <div class="d-flex align-center">
          <v-avatar color="primary" size="48" class="mr-4">
            <span class="text-h6 white--text">
              {{ getInitials(paciente.nombre) }}
            </span>
          </v-avatar>
          <span class="patient-name">{{ paciente.nombre }}</span>
        </div>
      </v-card-title>

      <v-divider class="mx-6 my-4"></v-divider>

      <v-row class="px-6 pb-6">
        <v-col cols="12" md="6">
          <v-list-item-title class="mb-3 info-item">
            <v-icon size="18" class="mr-2">mdi-cake-variant</v-icon>
            <span class="info-label">Edad:</span>
            <span class="info-value">{{
              getAge(paciente.fecha_de_nacimiento)
            }}</span>
          </v-list-item-title>
        </v-col>
        <v-col cols="12" md="6">
          <v-list-item-title class="mb-3 info-item">
            <v-icon size="18" class="mr-2">mdi-phone</v-icon>
            <span class="info-label">Teléfono:</span>
            <template v-if="paciente.telefono">
              <a :href="`tel:${paciente.telefono}`" class="info-link">
                {{ paciente.telefono | formatPhone }}
              </a>
            </template>
            <template v-else>
              <span class="info-value">{{
                paciente.telefono | formatPhone
              }}</span>
            </template>
          </v-list-item-title>
        </v-col>
        <v-col v-if="paciente.telefono" cols="12" md="6">
          <v-list-item-title class="mb-3 info-item">
            <v-icon size="18" class="mr-2" color="#25d366">mdi-whatsapp</v-icon>
            <span class="info-label">WhatsApp:</span>
            <a
              :href="`https://wa.me/504${paciente.telefono}`"
              target="_blank"
              rel="noopener"
              class="whatsapp-link"
            >
              Enviar mensaje
            </a>
          </v-list-item-title>
        </v-col>
        <v-col cols="12" md="6">
          <v-list-item-title class="mb-3 info-item">
            <v-icon size="18" class="mr-2">mdi-briefcase</v-icon>
            <span class="info-label">A que se dedica:</span>
            <span class="info-value">{{ paciente.a_que_se_dedica }}</span>
          </v-list-item-title>
        </v-col>
        <v-col cols="12" md="6">
          <v-list-item-title class="mb-3 info-item">
            <v-icon size="18" class="mr-2">mdi-gamepad-variant</v-icon>
            <span class="info-label">Pasatiempos:</span>
            <span class="info-value">{{ paciente.pasatiempos }}</span>
          </v-list-item-title>
        </v-col>
        <v-col cols="12" md="6">
          <v-list-item-title class="mb-3 info-item">
            <v-icon size="18" class="mr-2">mdi-alert-circle</v-icon>
            <span class="info-label">Antecedentes:</span>
            <span class="info-value">{{ paciente.antecedentes }}</span>
          </v-list-item-title>
        </v-col>
        <v-col cols="12" md="6">
          <v-list-item-title class="mb-3 info-item">
            <v-icon size="18" class="mr-2">mdi-map-marker</v-icon>
            <span class="info-label">Procedencia:</span>
            <span class="info-value">{{ paciente.procedencia }}</span>
          </v-list-item-title>
        </v-col>
      </v-row>
    </v-card>

    <!-- Consultas -->
    <v-card elevation="0" rounded class="section-card mb-6">
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="flat"
          rounded
          @click="addEditInfo('new', null)"
        >
          <v-icon left>mdi-plus</v-icon>
          Agregar Consulta
        </v-btn>
      </v-card-actions>
      <v-card-title class="px-6">
        <v-icon color="primary" class="mr-2">mdi-clipboard-text</v-icon>
        <span class="section-title">Consultas</span>
      </v-card-title>
      <v-divider class="mx-6 my-2"></v-divider>
      <v-data-table
        :headers="headers"
        :items="cleanInformaciones"
        :loading="!infoLoaded"
        item-key="id"
        :sort-by="['formatDate']"
        :sort-asc="true"
        hover
      >
        <template v-slot:[`item.fecha`]="{ item }">
          {{ item.fecha | formatDate }}
        </template>
        <template v-slot:[`item.pictures`]="{ item }">
          <v-btn
            small
            color="blue-grey darken-1"
            variant="outlined"
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
            class="mx-2 white--text"
            color="red darken-4"
            variant="outlined"
            @click="deleteInfo(item)"
          >
            Eliminar
          </v-btn>
          <v-btn
            small
            class="mx-2 white--text"
            color="blue darken-4"
            variant="outlined"
            @click="addEditInfo('edit', item)"
          >
            Editar
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Citas -->
    <v-card elevation="0" rounded class="section-card">
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="flat"
          rounded
          @click="openAddEditAppointmentModal(false, {})"
        >
          <v-icon left>mdi-plus</v-icon>
          Agregar Cita
        </v-btn>
      </v-card-actions>
      <v-card-title class="px-6">
        <v-icon color="primary" class="mr-2">mdi-calendar-clock</v-icon>
        <span class="section-title">Citas</span>
      </v-card-title>
      <v-divider class="mx-6 my-2"></v-divider>
      <v-data-table
        :headers="appointmentHeaders"
        :items="cleanAppointments"
        :loading="!appointmentsLoaded"
        item-key="id"
        :sort-by="['formatDateTime']"
        :sort-asc="true"
        hover
      >
        <template v-slot:[`item.start`]="{ item }">
          {{ item.start | formatDateTime }}
        </template>

        <template v-slot:[`item.options`]="{ item }">
          <v-btn
            small
            class="mx-2 white--text"
            color="red darken-4"
            variant="outlined"
            @click="deleteAppointment(item)"
          >
            Eliminar
          </v-btn>
          <v-btn
            small
            class="mx-2 white--text"
            color="blue darken-4"
            variant="outlined"
            @click="openAddEditAppointmentModal(true, item)"
          >
            Editar
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

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
        :patientId="paciente.id"
        :patientName="paciente.nombre"
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

    <v-dialog v-model="addEditAppointmentModal">
      <add-edit-appointment
        @cancel="addEditAppointmentModal = false"
        @success="handleAppointmentSuccess"
        :key="randomKey"
        :selectedAppointment="selectedEvent"
        :appointmentPatientId="appointmentPatientId"
      ></add-edit-appointment>
    </v-dialog>
  </div>
</template>

<script>
import { db, storage } from "~/plugins/firebase.js";
import {
  doc,
  getDoc,
  collection,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import auth from "@/mixins/authMixin";

export default {
  mixins: [auth],
  head: { title: this?.paciente?.nombre || "Paciente" },
  data() {
    return {
      infoLoaded: false,
      appointmentsLoaded: false,
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
        { text: "Imágenes", value: "pictures", sortable: false },
        { text: "Acciones", value: "options", sortable: false, width: "300" },
      ],
      appointments: [],
      appointmentHeaders: [
        { text: "Fecha", value: "start" },
        { text: "Clínica", value: "clinic" },
        { text: "Detalles", value: "details" },
        { text: "Acciones", value: "options", sortable: false, width: "300" },
      ],
      addEditAppointmentModal: false,
      selectedEvent: {},
      appointmentPatientId: null,
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
    const _this = this;
    const informationDocRef = collection(
      db,
      "pacientes",
      this.paciente.id,
      "informacion_clinica"
    );

    const appointmentDocRef = collection(
      db,
      "pacientes",
      this.paciente.id,
      "appointments"
    );

    return new Promise((resolve) => {
      onSnapshot(
        query(informationDocRef, orderBy("fecha", "desc")),
        { includeMetadataChanges: true },
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            this.informaciones.push({
              id: change.doc.id,
              ...change.doc.data(),
            });
          });
          this.infoLoaded = true;
          maybeResolve();
        }
      );

      onSnapshot(
        query(appointmentDocRef, orderBy("start", "desc")),
        { includeMetadataChanges: true },
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            this.appointments.push({
              id: change.doc.id,
              ...change.doc.data(),
            });
          });
          this.appointmentsLoaded = true;
          maybeResolve();
        }
      );

      function maybeResolve() {
        if (_this.infoLoaded && _this.appointmentsLoaded) {
          resolve({
            informaciones: _this.informaciones,
            appointments: _this.appointments,
          });
        }
      }
    });
  },
  fetchOnServer: false,
  methods: {
    getInitials(name) {
      if (!name) return "?";
      const parts = name.split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    },
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
    async deleteAppointment(item) {
      if (confirm(`¿Estás seguro de eliminar cita?`)) {
        try {
          await deleteDoc(
            doc(db, "pacientes", `${item.patientId}/appointments`, item.id)
          ).then(async () => {
            this.$store.commit("SET_SNACKBAR", "Cita eliminada");
            this.appointments = this.appointments.filter(function (el) {
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
    handleAppointmentSuccess(data) {
      this.addEditAppointmentModal = false;
      this.$store.commit("SET_SNACKBAR", data);
    },
    openAddEditAppointmentModal(edit, item) {
      this.addEditAppointmentModal = true;
      this.randomKey = Math.random();
      if (edit === false) {
        this.appointmentPatientId = this?.paciente?.id;
      } else {
        this.selectedEvent = item;
        this.appointmentPatientId = null;
      }
    },
  },
  filters: {
    formatDate(date) {
      if (date?.length === 0) return "Sin información";

      return new Date(date?.seconds * 1000).toLocaleDateString("en-GB");
    },
    formatDateTime(date) {
      if (!date) return "Sin información";

      const d = new Date(date);
      const hours = d.getHours();

      return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${
        hours % 12 || 12
      }:${d.getMinutes().toString().padStart(2, "0")} ${
        hours < 12 ? "AM" : "PM"
      }`;
    },
    formatPhone(value) {
      if (!value) return "-";

      return `${value?.slice(0, 4)}-${value?.slice(4)}`;
    },
  },
  computed: {
    cleanInformaciones: function () {
      return [
        ...new Map(this.informaciones.map((item) => [item.id, item])).values(),
      ];
    },
    cleanAppointments: function () {
      return [
        ...new Map(this.appointments.map((item) => [item.id, item])).values(),
      ];
    },
  },
};
</script>

<style scoped lang="scss">
.patient-detail-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.patient-header-card,
.section-card {
  border: 1px solid #e0e0e0;
}

.patient-name {
  font-size: 26px;
  font-weight: 600;
  color: #1a1a1a;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;

  .info-label {
    font-weight: 500;
    color: #666;
  }

  .info-value {
    color: #1a1a1a;
  }
}

.info-link {
  color: #1976d2;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.whatsapp-link {
  color: #25d366;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

:deep(.v-data-table) {
  .v-data-table__tr:hover {
    background-color: #f5f5f5 !important;
  }
}
</style>
