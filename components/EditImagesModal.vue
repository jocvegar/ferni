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
      <v-row>
        <v-col
          v-for="(image, idx) in localImages"
          :key="idx"
          class="d-flex child-flex"
          cols="6"
          sm="4"
          md="3"
        >
          <v-img
            :src="image.imgSrc"
            aspect-ratio="1"
            class="grey lighten-2"
            contain
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
            <v-row class="fill-height ma-0" align="end" justify="center">
              <v-btn
                color="primary"
                elevation="5"
                class="mb-2"
                @click="deleteImage(image)"
                :loading="processing"
              >
                Borrar
              </v-btn>
            </v-row>
          </v-img>
        </v-col>
      </v-row>
      <v-row class="pa-0 ma-0 mt-2">
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="6" offset="3">
          <v-row align="center" justify="end">
            <v-btn @click="$emit('cancel')" class="mt-4" color="primary" block>
              Cerrar
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { db, storage } from "~/plugins/firebase.js";
import { ref, deleteObject } from "firebase/storage";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";

export default {
  props: {
    images: {
      type: Array,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localImages: [],
      processing: false,
    };
  },
  mounted() {
    this.localImages = this.images;
  },
  methods: {
    async deleteImage(image) {
      this.processing = true;
      const informacionRef = doc(
        db,
        "pacientes",
        this.item.userId,
        "informacion_clinica",
        this.item.id
      );
      await this.removeImage(image);
      await updateDoc(informacionRef, {
        images: arrayRemove(image),
      }).then(() => {
        this.localImages = this.localImages.filter((img) => {
          return image.filename !== img.filename;
        });
        if (this.localImages.length == 0) this.$emit("cancel");
        this.processing = false;
      });
    },
    async removeImage(image) {
      const imageRef = ref(storage, image.filename);
      try {
        await deleteObject(imageRef);
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
