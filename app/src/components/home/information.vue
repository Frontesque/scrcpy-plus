<template>
<div class="card section bg-base-300 shadow-xl">
  <div class="card-body">

    <div class="flex">
        <img alt="Vue logo" src="@/assets/logo.png" class="mr-8" style="width: 5em;">
        <div>
            <h2 class="card-title">SCRCPY+ <span class="accent-text">{{ scrcpyPlusVersion }}</span></h2>
            <p>SCRCPY <span class="accent-text">{{ scrcpyPlusVersion }}</span></p>
            <p>ADB <span class="accent-text">{{ scrcpyPlusVersion }}</span></p>
        </div>
    </div>

    <div class="card-actions justify-end">
      <button class="btn btn-ghost">Join the Discord</button>
      <router-link to="/settings">
        <button class="btn btn-primary">Settings</button>
      </router-link>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      scrcpyPlusVersion: this.$version
    }
  },
  mounted() {
    this.spb.execute('test');
  }
}
</script>