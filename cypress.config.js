import { defineConfig } from "cypress";
// const {defineConfig} = import('cypress')

export default defineConfig({
    chromeWebSecurity: false,
    viewportWidth: 1650,
    viewportHeight: 960,
    e2e: {
        baseUrl: 'http://localhost:3000',

    }
})

// export default defineConfig({
//   e2e: {
//     baseUrl: 'http://localhost:3000',
//     setupNodeEvents(on, config) {
//       // implement node event listeners here

//     },
//   },
// });
