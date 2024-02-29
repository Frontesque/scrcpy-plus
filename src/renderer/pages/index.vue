<template>
  <div style="scrollbar-width: thin;">
    <!--   Import Modules   -->
    <updateNotice />
    <scrcpyPlusInfo />
    <device :device.sync="deviceConnected" style="margin-bottom: 0;" />
    
    <tools v-if="deviceConnected" />
    <scrcpy v-if="deviceConnected && !mirrorEngine" />
    <mirror v-if="deviceConnected && mirrorEngine" />
    <!--   End Import Modules   -->
  </div>
</template>

<script>
import scrcpyPlusInfo from '../components/scrcpyPlusInfo.vue'
export default {
  components: { scrcpyPlusInfo },
  data() {
    return {
      deviceConnected: false,
    }
  },
  computed: {
    mirrorEngine: vm => localStorage.getItem("set-mirror") == 'true' ? true : false
  }
}
</script>
