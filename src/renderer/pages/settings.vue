<template>
    <div>

        <section>
            <v-card-title>
                <back />
                Settings
            </v-card-title>
        </section>

        <section>
            <div v-for="item, i in settings" :key="i" style="display: flex;">
                <v-switch inset :label="item.description" style="margin: 0;" />
                
                <v-tooltip top v-if="item.tooltip" style="padding: 0;">
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" color="#999" small style="margin-left: 0.25em; height: 2em;">mdi-help-circle-outline</v-icon>
                    </template>
                    <span>{{ item.tooltip }}</span>
                </v-tooltip>

            </div>
        </section>

    </div>
</template>

<script>
export default {
    data() {
        return {
            settings: [
                { key: "mirror", description: "Use 'Mirror' engine", tooltip: "Replace SCRCPY with a custom renderer known as Mirror Engine" },
                { key: "rememberSettings", description: "Remember SCRCPY settings" },
            ]
        }
    }
}
</script>