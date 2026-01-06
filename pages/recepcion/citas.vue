<template>
  <div class="calendar-container">
    <v-card elevation="0" rounded="lg" class="calendar-header mb-4">
      <v-card-text class="pa-4">
        <v-row align="center">
          <v-col cols="12" md="auto">
            <div class="d-flex align-center">
              <v-icon color="primary" size="32" class="mr-3"
                >mdi-calendar-month</v-icon
              >
              <div>
                <div class="calendar-title">Calendario de Citas</div>
                <div class="calendar-subtitle">Dr. Ortopeda</div>
              </div>
            </div>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" md="auto">
            <div class="d-flex align-center justify-end calendar-controls">
              <v-btn color="primary" rounded class="mr-3" @click="setToday">
                <v-icon left small>mdi-calendar-today</v-icon>
                Hoy
              </v-btn>
              <v-btn icon color="grey darken-1" @click="prev" class="mr-2">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn icon color="grey darken-1" @click="next" class="mr-3">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
              <v-menu bottom right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    outlined
                    color="grey darken-2"
                    rounded
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon left small>mdi-view-dashboard</v-icon>
                    {{ typeToLabel[type] }}
                    <v-icon right small>mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="type = 'month'">
                    <v-list-item-icon>
                      <v-icon>mdi-calendar</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Mes</v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="type = 'week'">
                    <v-list-item-icon>
                      <v-icon>mdi-view-week</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Semana</v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="type = 'day'">
                    <v-list-item-icon>
                      <v-icon>mdi-view-day</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Día</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-col>
        </v-row>

        <v-row class="mt-3">
          <v-col>
            <div class="current-date" v-if="$refs.calendar">
              {{ currentDateTitle }}
            </div>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col>
            <div class="legend">
              <div class="legend-item">
                <div
                  class="legend-color"
                  style="background-color: #2196f3"
                ></div>
                <span>Traumacentro</span>
              </div>
              <div class="legend-item">
                <div
                  class="legend-color"
                  style="background-color: #4caf50"
                ></div>
                <span>Las Minitas</span>
              </div>
              <div class="legend-item">
                <div
                  class="legend-color"
                  style="background-color: #9e9e9e"
                ></div>
                <span>Otra clínica</span>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card elevation="0" rounded="lg" class="calendar-card">
      <v-sheet height="700" class="calendar-sheet">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          locale="es"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="onCalendarChange"
        ></v-calendar>
      </v-sheet>
    </v-card>

    <v-menu
      v-model="selectedOpen"
      :close-on-content-click="false"
      :activator="selectedElement"
      offset-x
    >
      <v-card min-width="380px" rounded="lg" elevation="8">
        <v-card-title
          class="event-header"
          :style="`background-color: ${getEventColor(selectedEvent)}`"
        >
          <div class="white--text">
            <div class="event-patient-name">
              <v-icon color="white" class="mr-2">mdi-account</v-icon>
              {{ selectedEvent.name }}
            </div>
            <div class="event-time mt-2">
              <v-icon color="white" small class="mr-1"
                >mdi-clock-outline</v-icon
              >
              {{ formatEventTime(selectedEvent.start) }}
            </div>
          </div>
        </v-card-title>

        <v-card-text class="pa-4">
          <div class="event-detail-item" v-if="selectedEvent.clinic">
            <div class="detail-label">
              <v-icon small class="mr-2">mdi-hospital-building</v-icon>
              Clínica
            </div>
            <div class="detail-value">{{ selectedEvent.clinic }}</div>
          </div>

          <v-divider
            class="my-3"
            v-if="selectedEvent.clinic && selectedEvent.details"
          ></v-divider>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="primary" rounded @click="selectedOpen = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { db } from "~/plugins/firebase.js";
import { getDocs, collectionGroup } from "firebase/firestore";

export default {
  layout: "clean",
  name: "Citas",
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
    colorMapping: {
      Traumacentro: "#2196F3",
      "Las Minitas": "#4CAF50",
    },
    currentDateTitle: "",
    monthNames: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    dayNames: [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ],
  }),
  mounted() {
    this.$refs.calendar.checkChange();
    this.getAllAppointments();
    this.$nextTick(() => {
      this.updateTitle();
    });
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return this.colorMapping[event.clinic] || "#9E9E9E";
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
    onCalendarChange({ start, end }) {
      this.updateTitle();
    },
    updateTitle() {
      if (!this.$refs.calendar) return;

      const calendar = this.$refs.calendar;

      if (this.type === "month") {
        // Get the current month/year from focus or today
        const dateStr = this.focus || new Date().toISOString().substr(0, 10);
        const date = new Date(dateStr + "T00:00:00");
        this.currentDateTitle = `${
          this.monthNames[date.getMonth()]
        } ${date.getFullYear()}`;
      } else if (this.type === "week") {
        const dateStr = this.focus || new Date().toISOString().substr(0, 10);
        const date = new Date(dateStr + "T00:00:00");
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        this.currentDateTitle = `${startOfWeek.getDate()} ${
          this.monthNames[startOfWeek.getMonth()]
        } - ${endOfWeek.getDate()} ${
          this.monthNames[endOfWeek.getMonth()]
        } ${endOfWeek.getFullYear()}`;
      } else if (this.type === "day") {
        const dateStr = this.focus || new Date().toISOString().substr(0, 10);
        const date = new Date(dateStr + "T00:00:00");
        this.currentDateTitle = `${
          this.dayNames[date.getDay()]
        }, ${date.getDate()} de ${
          this.monthNames[date.getMonth()]
        } ${date.getFullYear()}`;
      }
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
    formatEventTime(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const day = date.getDate();
      const month = this.monthNames[date.getMonth()];
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;

      return `${
        this.dayNames[date.getDay()]
      }, ${day} de ${month} ${year} - ${displayHours}:${minutes} ${ampm}`;
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
  },
  watch: {
    type() {
      this.$nextTick(() => {
        this.updateTitle();
      });
    },
    focus() {
      this.$nextTick(() => {
        this.updateTitle();
      });
    },
  },
};
</script>

<style scoped lang="scss">
.calendar-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px;
}

.calendar-header {
  border: 1px solid #e0e0e0;
}

.calendar-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.calendar-subtitle {
  font-size: 14px;
  color: #666;
  margin-top: 2px;
}

.calendar-controls {
  flex-wrap: wrap;
  gap: 8px;
}

.current-date {
  font-size: 20px;
  font-weight: 600;
  color: #1976d2;
}

.legend {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 8px;
}

.calendar-card {
  border: 1px solid #e0e0e0;
}

.calendar-sheet {
  border-radius: 8px;
  overflow: hidden;
}

.event-header {
  padding: 20px 24px !important;
}

.event-patient-name {
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.event-time {
  font-size: 14px;
  opacity: 0.95;
  display: flex;
  align-items: center;
}

:deep(.v-calendar) {
  border: none;
}

:deep(.v-calendar .v-event) {
  border-radius: 4px;
  font-weight: 500;
}

@media (max-width: 960px) {
  .calendar-controls {
    justify-content: flex-start !important;
    width: 100%;
    margin-top: 16px;
  }
}
</style>
