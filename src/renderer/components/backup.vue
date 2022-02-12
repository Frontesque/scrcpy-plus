<template>
    <section>
        <h2>Device Backup</h2>

        <v-btn @click="runBackup()">Test Console</v-btn>
        
    </section>
</template>

<script>
const electron = require('electron');
const child_process = require('child_process');
const dialog = electron.dialog;

export default {
  methods: {
    runBackup() {
      this.$scrcpy.execute("echo test", (data) => {
        console.log(data)
      })
    }
  }
}
</script>
