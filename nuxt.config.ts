// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-ignore

export default defineNuxtConfig({
    title: 'Zero',

    app: {
        pageTransition: {name: 'page', mode: 'out-in'}
    },

    css: [
        'vuetify/lib/styles/main.sass',
        '@mdi/font/css/materialdesignicons.min.css',
        'assets/css/style.scss'
    ],

    build: {
        transpile: ['vuetify'],
    },

    modules: ["nuxt-security"],

    buildModules: [],

    devtools: {enabled: true},

    runtimeConfig: {
        // The private keys which are only available within server-side

        // Keys within public, will be also exposed to the client-side
        public: {
            apiUrl: 'http://localhost:5000/api/',
            staticsUrl: 'http://localhost:5000/'
        }
    }

})
