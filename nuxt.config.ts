// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    title: 'Zero',

    devServer: {
        host: '0.0.0.0',
        port: 3000
    },

    app: {
        head: {
            link: [
                {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
            ],
            title: 'فروشگاه زیرو'
        },
        meta: [
            {
                "name": "viewport",
                "content": "width=device-width, initial-scale=1"
            },
            {
                "charset": "utf-8"
            },
        ],
        pageTransition: false,
        layoutTransition: {
            name: 'fade',
            mode: 'out-in' // default
        }
    },

    css: [
        'vuetify/lib/styles/main.sass',
        '@mdi/font/css/materialdesignicons.min.css',
        'assets/css/style.scss'
    ],

    build: {
        transpile: ['vuetify'],
    },

    modules: ['nuxt-security'],

    buildModules: [],

    devtools: {enabled: true},

    security: {
        headers: {
            crossOriginResourcePolicy: 'unsafe-none', // load resources
            // crossOriginResourcePolicy: 'cross-origin', // load resources
            crossOriginOpenerPolicy: 'same-origin', // open page or popup
            crossOriginEmbedderPolicy: 'none', // load from other urls
            // crossOriginEmbedderPolicy: 'require-corp', // load from other urls
            contentSecurityPolicy: {
                'base-uri': ["'self'"],
                'font-src': ["'self'", 'https:', 'data:'],
                'form-action': ["'self'"],
                'frame-ancestors': ["'self'"],
                'img-src': ["'self'", 'data:', 'blob:', 'https:', 'http://localhost:5000/'],
                'object-src': ["'none'"],
                'script-src-attr': ["'none'"],
                'style-src': ["'self'", 'https:', "'unsafe-inline'"],
                'upgrade-insecure-requests': true
            }
        },
        xssValidator: {
            stripIgnoreTag: true
        },
        enabled: true
    },

    runtimeConfig: {

        TOKEN_SECRET: process.env.TOKEN_SECRET,

        // Keys within public, will be also exposed to the client-side
        public: {
            API_BASE_URL: process.env.API_BASE_URL,
            STATICS_URL: process.env.STATICS_URL
        }
    }

})
