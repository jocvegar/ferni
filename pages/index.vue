<template>
  <v-card elevation="0">
    <v-card-actions class="float-right">
      <v-btn color="primary" elevation="2" raised to="/paciente/new" nuxt>
        <v-icon>mdi-plus</v-icon>
        Paciente Nuevo
      </v-btn>
    </v-card-actions>
    <v-card-title><h2>Pacientes</h2></v-card-title>
    <br />
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="users"
      :search="search"
    ></v-data-table>
  </v-card>
</template>

<script>
import auth from "@/mixins/authMixin";

export default {
  name: "Index",
  mixins: [auth],
  async asyncData({ $axios }) {
    const users = await $axios.$get(
      "https://jsonplaceholder.typicode.com/users"
    );

    // const desserts = [
    //   {
    //     name: "Frozen Yogurt",
    //     calories: 159,
    //     fat: 6.0,
    //     carbs: 24,
    //     protein: 4.0,
    //     iron: "1%",
    //   },
    //   {
    //     name: "Ice cream sandwich",
    //     calories: 237,
    //     fat: 9.0,
    //     carbs: 37,
    //     protein: 4.3,
    //     iron: "1%",
    //   },
    //   {
    //     name: "Eclair",
    //     calories: 262,
    //     fat: 16.0,
    //     carbs: 23,
    //     protein: 6.0,
    //     iron: "7%",
    //   },
    //   {
    //     name: "Cupcake",
    //     calories: 305,
    //     fat: 3.7,
    //     carbs: 67,
    //     protein: 4.3,
    //     iron: "8%",
    //   },
    //   {
    //     name: "Gingerbread",
    //     calories: 356,
    //     fat: 16.0,
    //     carbs: 49,
    //     protein: 3.9,
    //     iron: "16%",
    //   },
    //   {
    //     name: "Jelly bean",
    //     calories: 375,
    //     fat: 0.0,
    //     carbs: 94,
    //     protein: 0.0,
    //     iron: "0%",
    //   },
    //   {
    //     name: "Lollipop",
    //     calories: 392,
    //     fat: 0.2,
    //     carbs: 98,
    //     protein: 0,
    //     iron: "2%",
    //   },
    //   {
    //     name: "Honeycomb",
    //     calories: 408,
    //     fat: 3.2,
    //     carbs: 87,
    //     protein: 6.5,
    //     iron: "45%",
    //   },
    //   {
    //     name: "Donut",
    //     calories: 452,
    //     fat: 25.0,
    //     carbs: 51,
    //     protein: 4.9,
    //     iron: "22%",
    //   },
    //   {
    //     name: "KitKat",
    //     calories: 518,
    //     fat: 26.0,
    //     carbs: 65,
    //     protein: 7,
    //     iron: "6%",
    //   },
    // ];
    return { users };
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "User Id",
          align: "start",
          value: "id",
        },
        { text: "Name", value: "name" },
        { text: "Email", value: "email" },
        { text: "Phone", value: "phone" },
        { text: "Website", value: "website" },
      ],
    };
  },
};
</script>
