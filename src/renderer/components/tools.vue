<template>
    <section>
        <h2>Tools <v-chip color="primary" style="margin-left: 0.5em; height: 2em;">Beta</v-chip></h2>
        <div class="accent--text">All tools are written by me for SCRCPY+. All bug reports should go through the GitHub!</div>

        <v-list-item v-for="(item, i) in cmds" :key="i" style="padding: 0;">
            <v-btn rounded :to="item.to" :disabled="item.disabled">
                <v-icon v-text="item.icon"/>
                {{ item.title }}
            </v-btn>
        </v-list-item>
        
    </section>
</template>

<script>
export default {
    data() {
        return {
            cmds: [
                {
                    title: "Package Manager",
                    icon: "mdi-package-variant",
                    to: "/tools/apps",
                    beta: true
                },
                {
                    title: "File Manager",
                    icon: "mdi-folder-open",
                    to: "/tools/files"
                }
            ],

        }
    },

    methods: {
        run(cmd) {
            this.$execute(cmd)
                .catch((err) => {
                    console.log(err);
                })
        }
    }

}
</script>