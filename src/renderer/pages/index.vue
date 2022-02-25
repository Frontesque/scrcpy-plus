<template>
  <div>

    <section>
      <h1>SCRCPY+ ({{ version }})</h1>
      <h4>SCRCPY ({{ scrcpyVersion }})</h4>
      <h4>ADB ({{ adbVersion }})</h4>
      <v-btn style="margin-top: 1em;" class="rounded-xl" color="primary" to="/changelog">SCRCPY+ Changelog</v-btn>
    </section>

    <!--   Import Modules   -->
    <device />
    <adb />
    <scrcpy />
    <!--   End Import Modules   -->

  </div>
</template>

<script>
const env = process.env;

export default {
  data() {
    return {
      version: env.version,
      scrcpyVersion: env.scrcpyVersion,
      scrcpyPath: env.scrcpyPath,
      adbVersion: env.adbVersion,
    }
  }
}
</script>
