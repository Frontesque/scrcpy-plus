<template>
    <div class="mt-7 mb-3" style="height: 300px; width: 300px; margin: 0 auto;" v-html="qrSVG" />
</template>

<script>
import { renderSVG } from 'uqr'
export default {
    props: {
        qrText: {
            type: String,
        }
    },
    data() {
        return {
            qrSVG: renderSVG(this.qrText)
        }
    }
}
</script>
