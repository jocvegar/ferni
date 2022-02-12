<template>
  <client-only>
    <div class="hello">
      <h1>{{ msg }}</h1>
      capture: {{ capture }}
      <v-divider></v-divider>
      <v-btn @click="capture = 'camera'" elevation="2" plain rounded>
        camera
      </v-btn>
      <v-btn @click="capture = 'user'" elevation="2" plain rounded> user</v-btn>
      <v-btn @click="capture = 'environment'" elevation="2" plain rounded>
        environment
      </v-btn>
      <v-btn @click="capture = 'false'" elevation="2" plain rounded>
        false
      </v-btn>

      <div class="my-8">
        <image-uploader
          :preview="true"
          :className="['fileinput', { 'fileinput--loaded': hasImage }]"
          :capture="capture"
          :debug="1"
          outputFormat="verbose"
          @input="setImage"
          quality="0.8"
          scaleRatio="0.9"
        >
          <label for="fileInput" slot="upload-label">
            <figure>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
              >
                <path
                  class="path1"
                  d="M9.5 19c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5zM30 8h-7c-0.5-2-1-4-3-4h-8c-2 0-2.5 2-3 4h-7c-1.1 0-2 0.9-2 2v18c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-18c0-1.1-0.9-2-2-2zM16 27.875c-4.902 0-8.875-3.973-8.875-8.875s3.973-8.875 8.875-8.875c4.902 0 8.875 3.973 8.875 8.875s-3.973 8.875-8.875 8.875zM30 14h-4v-2h4v2z"
                ></path>
              </svg>
            </figure>
            <span class="upload-caption">{{
              hasImage ? "Replace" : "Click to upload"
            }}</span>
          </label>
        </image-uploader>
      </div>
    </div>
  </client-only>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Vue Image Upload and Resize Demo",
      hasImage: false,
      image: null,
      capture: "user",
    };
  },
  methods: {
    setImage: function (output) {
      this.hasImage = true;
      this.image = output;
      console.log("Info", output.info);
      console.log("Exif", output.exif);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#fileInput {
  display: none;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.my-8 {
  margin-top: 4rem;
  margin-bottom: 4rem;
}
</style>
