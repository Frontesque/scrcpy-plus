export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: {
        settings: "Settings",
        language: "Language",
        dnc_updates: "Don't check for updates",
        rscrcpy_config: "Remember SCRCPY config",
        devices: "Devices",
        no_device: "No device selected",
        connect_wirelessly: "Connect Wirelessly",
        model: "Model",
        android_version: "Android Version",
        build_number: "Build Number",
        security_patch: "Security Patch",
        start: "Start SCRCPY",
        update_available: "Update Available",
        new_version: "A new version of SCRCPY+ is ready to be downloaded",
        download: "Download",
      },
      it: {
        settings: 'Impostazioni',
        language: "Lingua",
        dnc_updates: "Non controllare gli aggiornamenti",
        rscrcpy_config: "Ricorda la configurazione SCRCPY",
        devices: "Telefoni",
        no_device: "Dispositivo non selezionato",
        connect_wirelessly: "Connessione Wi-Fi",
        model: "Modella",
        android_version: "Versione Android",
        build_number: "Numero Di Costruzione",
        security_patch: "Patch Di Sicurezza",
        start: "Inizio SCRCPY",
        update_available: "Aggiornamento Disponibile",
        new_version: "Una nuova versione di SCRCPY+ è pronta per essere scaricata",
        download: "Installare"
      }
    }
}))