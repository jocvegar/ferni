<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Hoy
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>

          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            elevation="2"
            class="mr-2"
            @click="openAddEditAppointmentModal((edit = false))"
          >
            Agregar
          </v-btn>

          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right> mdi-menu-down </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Día</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Semana</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Mes</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="getEventColor(selectedEvent)" dark>
              <v-toolbar-title>
                <NuxtLink
                  :to="`/paciente/${selectedEvent.patientId}`"
                  class="font-weight-medium text-decoration-none white--text"
                >
                  {{ selectedEvent.name }}
                </NuxtLink>
              </v-toolbar-title>
              <v-spacer></v-spacer>

              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item
                    @click="openAddEditAppointmentModal((edit = true))"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Editar cita</v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="confirmDelete()">
                    <v-list-item-icon>
                      <v-icon color="error">mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Borrar cita</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
            <v-card-subtitle>
              <span class="text--lighten-2">
                {{ new Date(selectedEvent.start).toLocaleTimeString() }}
              </span>
            </v-card-subtitle>
            <v-card-text>
              <span v-html="selectedEvent.clinic"></span>
            </v-card-text>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text color="secondary" @click="selectedOpen = false">
                Cerrar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>

    <v-dialog v-model="addEditAppointmentModal">
      <add-edit-appointment
        @cancel="addEditAppointmentModal = false"
        @success="handleAppointmentSuccess"
        :key="randomKey"
        :selectedAppointment="selectedEvent"
      ></add-edit-appointment>
    </v-dialog>
  </v-row>
</template>

<script>
import auth from "@/mixins/authMixin";
import { db } from "~/plugins/firebase.js";
import { getDocs, collectionGroup, deleteDoc, doc } from "firebase/firestore";
export default {
  name: "Citas",
  mixins: [auth],
  data: () => ({
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Mes",
      week: "Semana",
      day: "Día",
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    addEditAppointmentModal: false,
    randomKey: 0,
    colorMapping: {
      Traumacentro: "blue",
      "Las Minitas": "green",
    },
  }),
  mounted() {
    this.$refs.calendar.checkChange();
    this.getAllAppointments();
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return this.colorMapping[event.clinic] || "grey";
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        this.selectedEvent = {};
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    openAddEditAppointmentModal(edit = false) {
      this.addEditAppointmentModal = true;
      this.randomKey = Math.random();
      if (edit === false) this.selectedEvent = {};
      if (edit === true) this.selectedOpen = false;
    },
    handleAppointmentSuccess(data) {
      this.addEditAppointmentModal = false;
      this.getAllAppointments();
      this.$store.commit("SET_SNACKBAR", data);
    },
    async getAllAppointments() {
      const querySnapshot = await getDocs(collectionGroup(db, "appointments"));

      this.events = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          patientId: doc.ref.parent.parent.id,
        };
      });
    },
    confirmDelete() {
      if (confirm("¿Estás seguro de que quieres borrar esta cita?")) {
        this.deleteAppointment(this.selectedEvent);
      }
    },
    async deleteAppointment(appointment) {
      const appointmentRef = doc(
        db,
        "pacientes",
        appointment.patientId,
        "appointments",
        appointment.id
      );
      await deleteDoc(appointmentRef);
      this.selectedEvent = {};
      this.selectedOpen = false;
      this.getAllAppointments();
      this.$store.commit("SET_SNACKBAR", "Cita eliminada");
    },
  },
};
</script>
