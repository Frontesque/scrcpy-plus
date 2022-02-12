<template>
    <div>

        <section>
            <h1>Changelog</h1>
            <v-btn style="margin-top: 1em;" class="rounded-xl" color="primary" @click="$router.go(-1)">Back</v-btn>
        </section>

        <section>
            <h3>1.0.2</h3>
            <ul>
                <li>Removed unused files</li>
                <li>Moved SCRCPY files to /resources instead of /bin as per a standard Electron application</li>
                <li>Update windows binary information</li>
                <li>Added optional windows installer file</li>
                <li>General software cleanup</li>
            </ul>
        </section>
        
        <section>
            <h3>1.0.1</h3>
            <ul>
                <li>Added changelog</li>
                <li>Added support for more devices in the "Devices" section</li>
                <li>Changed a few backend things</li>
                <li>Generally smoothed out the experience</li>
            </ul>
        </section>

        <section>
            <h3>1.0</h3>
            <ul>
                <li>Made the app :)</li>
            </ul>
        </section>

    </div>
</template>