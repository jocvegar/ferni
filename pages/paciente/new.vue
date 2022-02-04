<template>
  <v-card elevation="0">
    <v-card-actions class="float-right">
      <v-btn color="primary" elevation="2" raised to="/" nuxt outlined>
        <v-icon>mdi-chevron-left</v-icon>
        Atras
      </v-btn>
    </v-card-actions>
    <v-card-title><h2>Nuevo Paciente</h2></v-card-title>
  </v-card>
</template>
<script>
export default {
  name: "PacienteNew",
};
</script>
