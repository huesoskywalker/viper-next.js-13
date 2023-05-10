import { defineConfig } from "cypress"
export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:3000",
        chromeWebSecurity: false,
        viewportWidth: 1024,
        viewportHeight: 660,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        env: {
            snapshotOnly: true,
            hideCredentials: true,
        },
    },
})
