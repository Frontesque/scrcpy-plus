<template>
    <div>

        <section>
            <v-card-title>
                <back />
                Resource Monitor
            </v-card-title>
        </section>


    <center>
            <section>
                <v-card-title class="justify-center">Total CPU</v-card-title>
                <v-card-text>{{ parseInt(userUsage) + parseInt(systemUsage) }}%</v-card-text>
            </section>

        <table style="width: 100%;">
            <tr>
                <th>
                    <section>
                        <v-card-title class="justify-center">User CPU</v-card-title>
                        <v-card-text>{{ userUsage }}%</v-card-text>
                    </section>
                </th>
                <th>
                    <section>
                        <v-card-title class="justify-center">System CPU</v-card-title>
                        <v-card-text>{{ systemUsage }}%</v-card-text>
                    </section>
                </th>
            </tr>
            <tr>
                <th>
                    <section>
                        <v-card-title class="justify-center">User Threads</v-card-title>
                        <v-card-text v-text="userThreads" />
                    </section>
                </th>
                <th>
                    <section>
                        <v-card-title class="justify-center">System Threads</v-card-title>
                        <v-card-text v-text="systemThreads" />
                    </section>
                </th>
            </tr>
        </table>

        <section>
            <v-card-title class="justify-center">Idle Threads</v-card-title>
            <v-card-text v-text="idleThreads" />
        </section>

        </center>
    </div>
</template>

<script>
export default {
    data() {
        return {
            userUsage: 0,
            userThreads: 0,

            systemUsage: 0,
            systemThreads: 0,

            idleThreads: 0,
            raw: null
        }
    },

    methods: {
        async getProcesses() {
            const data = await this.$execute("adb shell top -n 1 -m 1");

            this.userUsage = data.split("User ")[1].split("%")[0];

            this.systemUsage = data.split("System ")[1].split("%")[0];
            this.systemThreads = data.split("Sys ")[1].split(" ")[0];

            this.idleThreads = data.split("Idle ")[1].split(" ")[0];


            this.raw = data;
        }
    },

    mounted() {
      this.interval = setInterval(this.getProcesses, process.env.devicePollRate);
      this.getProcesses();
    },

    beforeDestroy() {
      clearInterval(this.interval); // Prevent Memory Leak
    }

}
</script>