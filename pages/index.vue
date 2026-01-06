<template>
  <div class="patients-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">Pacientes</h1>
        <p class="page-subtitle">
          {{ pacientes.length }} pacientes registrados
        </p>
      </div>
      <v-btn
        color="primary"
        size="large"
        elevation="0"
        rounded
        to="/paciente/new"
        nuxt
        class="px-6"
      >
        <v-icon left>mdi-plus</v-icon>
        Nuevo Paciente
      </v-btn>
    </div>

    <v-card elevation="0" class="search-card mb-4" rounded>
      <v-card-text>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar por nombre, teléfono, procedencia..."
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          rounded
        ></v-text-field>
      </v-card-text>
    </v-card>

    <v-card elevation="0" rounded class="patients-card">
      <v-data-table
        :headers="headers"
        :items="pacientes"
        :search="search"
        :sort-by="['nombre']"
        :footer-props="{
          itemsPerPageOptions: [10, 50, 100],
        }"
        class="patients-table"
        hover
      >
        <template v-slot:[`item.nombre`]="{ item }">
          <div class="patient-cell">
            <v-avatar color="primary" size="36" class="mr-3">
              <span class="white--text text-body-2">
                {{ getInitials(item.nombre) }}
              </span>
            </v-avatar>
            <NuxtLink :to="`/paciente/${item.id}`" class="patient-name">
              {{ item.nombre }}
            </NuxtLink>
          </div>
        </template>

        <template v-slot:[`item.fecha_de_nacimiento`]="{ item }">
          <span class="age-text"
            >{{ getAge(item.fecha_de_nacimiento) }} años</span
          >
        </template>

        <template v-slot:[`item.telefono`]="{ item }">
          <div class="phone-cell">
            <v-icon size="16" class="mr-1">mdi-phone</v-icon>
            {{ item.telefono || "N/A" }}
          </div>
        </template>

        <template v-slot:[`item.a_que_se_dedica`]="{ item }">
          <span class="text-body-2">{{ item.a_que_se_dedica || "N/A" }}</span>
        </template>

        <template v-slot:[`item.pasatiempos`]="{ item }">
          <span class="text-body-2">{{ item.pasatiempos || "N/A" }}</span>
        </template>

        <template v-slot:[`item.procedencia`]="{ item }">
          <div class="location-cell">
            <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
            {{ item.procedencia || "N/A" }}
          </div>
        </template>

        <template v-slot:[`item.show`]="{ item }">
          <NuxtLink :to="`/paciente/${item.id}`" class="text-decoration-none">
            <v-btn color="primary" variant="flat" size="small" rounded>
              Ver perfil
              <v-icon right size="16">mdi-arrow-right</v-icon>
            </v-btn>
          </NuxtLink>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import auth from "@/mixins/authMixin";
import { db } from "~/plugins/firebase.js";
import { collection, onSnapshot } from "firebase/firestore";

export default {
  name: "Index",
  mixins: [auth],
  head: {
    title: "Pacientes",
  },
  async asyncData() {
    const pacientesDocRef = collection(db, "pacientes");
    let pacientes = [];
    return new Promise((resolve, reject) => {
      onSnapshot(
        pacientesDocRef,
        { includeMetadataChanges: true },
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            pacientes.push({
              id: change.doc.id,
              ...change.doc.data(),
            });
          });
          resolve({ pacientes });
        }
      );
    });
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Nombre",
          align: "start",
          value: "nombre",
        },
        { text: "Edad", value: "fecha_de_nacimiento" },
        { text: "Teléfono", value: "telefono" },
        { text: "Antecedentes", value: "antecedentes" },
        { text: "Dedicación", value: "a_que_se_dedica" },
        { text: "Pasatiempos", value: "pasatiempos" },
        { text: "Procedencia", value: "procedencia" },
        {
          text: "Ir a paciente",
          value: "show",
          sortable: false,
        },
      ],
    };
  },
  methods: {
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
        return "N/A";
      }
    },
    getInitials(name) {
      if (!name) return "?";
      const parts = name.split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    },
  },
};
</script>

<style scoped lang="scss">
.patients-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.page-subtitle {
  color: #666;
  margin: 4px 0 0 0;
  font-size: 14px;
}

.search-card {
  border: 1px solid #e0e0e0;
}

.patients-card {
  border: 1px solid #e0e0e0;
  overflow: hidden;
}

.patient-cell {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.patient-name {
  font-weight: 600;
  color: #1976d2;
  text-decoration: none;
  font-size: 15px;

  &:hover {
    text-decoration: underline;
  }
}

.age-text {
  font-weight: 500;
  color: #424242;
}

.phone-cell,
.location-cell {
  display: flex;
  align-items: center;
  color: #616161;
  font-size: 14px;
}

:deep(.v-data-table) {
  .v-data-table__tr:hover {
    background-color: #f5f5f5 !important;
  }
}
</style>
