<template>
  <div>

    <section>
      <h1>SCRCPY+ ({{ version }})</h1>
      <h4>SCRCPY ({{ scrcpyVersion }})</h4>
      <h4>ADB ({{ adbVersion }})</h4>
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