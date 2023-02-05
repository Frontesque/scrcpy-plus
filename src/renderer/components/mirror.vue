<template>
    <div>
  
      <section style="margin-top: 0;" v-if="running">
        <h2>Mirror Engine</h2>
        <center>Mirror is currently running</center>
      </section>
  
      <section style="margin-top: 0;" v-if="!running">
        <h2>Mirror Engine</h2>
  
  
        <v-card-actions style="margin-top: 1em;">
          <v-spacer />
          <v-btn @click="startMirror()" rounded class="primaryButton" :disabled="loading" :loading="loading">Start Mirror</v-btn>
        </v-card-actions>
      </section>
  
    </div>
  </template>
  
  <script>
  export default {
    
    methods: {
  
      async startMirror() {
          this.loading = true;

          this.$mirror.start({}, status => {
            console.log("Ran")
          });

          this.loading = false;
      }
  
    },
    
    data() {
      return {
        loading: false,
        running: false,
      }
    },
  }
  </script>
  