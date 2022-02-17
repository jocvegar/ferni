<template>
  <v-card elevation="0">
    <v-card-title>
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
        <v-carousel hide-delimiters>
          <v-carousel-item eager v-for="(item, i) in images" :key="i">
            <v-img
              width="800"
              class="mx-auto my-auto"
              :src="item.imgSrc"
              contain
              :aspect-ratio="16 / 9"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-carousel-item>
        </v-carousel>
        <v-row class="pa-0 ma-0 mt-2" justify="center">
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
          <v-col cols="6" class="px-6">
            <v-row justify="center">
              <v-btn @click="$emit('edit')" class="mt-4" color="primary" block>
                Editar
              </v-btn>
            </v-row>
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
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
};
</script>
