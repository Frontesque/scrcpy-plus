<template>
    <v-btn rounded class="primaryButton backButton" @click="$router.go(-1)">
        <v-icon style="margin-right: 0;">mdi-arrow-left</v-icon>
    </v-btn>
</template>

<style scoped>
.backButton {
    margin: 0 1em 0 0;
    min-width: 0 !important;
    padding: 0 0.5em !important;
}
</style>