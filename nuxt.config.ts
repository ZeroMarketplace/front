// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-ignore

export default defineNuxtConfig({
    title: 'Test',

    app: {
        pageTransition: {name: 'page', mode: 'out-in'}
    },

    css: [
        'vuetify/lib/styles/main.sass',
        '@mdi/font/css/materialdesignicons.min.css',
        'assets/css/style.scss'
    ],

    vuetify: {
        rtl: true
    },

    build: {
        transpile: ['vuetify'],
    },

    buildModules: [],

    devtools: {enabled: true},
})
