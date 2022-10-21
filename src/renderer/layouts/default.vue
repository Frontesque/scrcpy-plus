<template>
  <div>
    <p class="titleBar"><img src="~/assets/icon.png" style="height: 17px; transform: translatey(2px)" /> SCRCPY+</p>
    <v-app dark>
      <nuxt />
    </v-app>
  </div>
</template>

<style>
/* :root { color-scheme: dark; } */ /* Basic Dark Theme */
body::-webkit-scrollbar {
  width: 0.25em;
}
body::-webkit-scrollbar-thumb {
  background-color: #8867c0;
  border-radius: 1em;
  -webkit-app-region: drag;
}
.titleBar {
  -webkit-app-region: drag;
  color: white;
  width: 100%;
  padding: 0.5em;
  font-family: Arial, Helvetica, sans-serif;
  background: #1C1B1F;
  position: sticky;
  top: 0;
  z-index: 1000;
  text-overflow: clip;
  user-select: none;
}


p {
  word-break: break-word;
}

html, body, .v-application, .v-application--wrap {
  background: #1C1B1F !important;
}

section {
  border: 2px solid #38373A;
  border-radius: 1em;
  margin: 2em;
  padding: 1em;
}

.highlight {
  background: #999;
  border-radius: 3px;
}

.v-icon {
  margin-right: 0.5em;
}

.v-btn {
  box-shadow: none !important;
  background: none !important;
  border: 2px solid rgba(255,255,255,0.1);
}
.primaryButton {
  border: 2px solid #8867c0;
}
</style>