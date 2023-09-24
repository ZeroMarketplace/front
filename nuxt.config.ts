// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    title: 'Zero',

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

    security: {
        headers: {
            crossOriginResourcePolicy: 'same-origin',
            crossOriginOpenerPolicy: 'same-origin',
            crossOriginEmbedderPolicy: 'require-corp',
            contentSecurityPolicy: {
                'base-uri': ["'self'"],
                'font-src': ["'self'", 'https:', 'data:'],
                'form-action': ["'self'"],
                'frame-ancestors': ["'self'"],
                'img-src': ["'self'", 'data:', 'https:'],
                'object-src': ["'none'"],
                'script-src-attr': ["'none'"],
                'style-src': ["'self'", 'https:', "'unsafe-inline'"],
                'upgrade-insecure-requests': true
            },
            originAgentCluster: '?1',
            referrerPolicy: 'no-referrer',
            strictTransportSecurity: {
                maxAge: 15552000,
                includeSubdomains: true
            },
            xContentTypeOptions: 'nosniff',
            xDNSPrefetchControl: 'off',
            xDownloadOptions: 'noopen',
            xFrameOptions: 'SAMEORIGIN',
            xPermittedCrossDomainPolicies: 'none',
            xXSSProtection:  '0',
            permissionsPolicy: {
                'camera': ['()'],
                'display-capture': ['()'],
                'fullscreen': ['()'],
                'geolocation': ['()'],
                'microphone': ['()'],
            }
        },
        requestSizeLimiter: {
            maxRequestSizeInBytes: 2000000,
            maxUploadFileRequestInBytes: 8000000,
        },
        rateLimiter: {
            // Twitter search rate limiting
            tokensPerInterval: 150,
            interval: "hour",
            fireImmediately: true,
        },
        xssValidator: {
            stripIgnoreTag: true
        },
        corsHandler: {
            origin: '*',
            methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
            preflight: {
                statusCode: 204
            }
        },
        allowedMethodsRestricter: '*',
        hidePoweredBy: true,
        basicAuth: false,
        enabled: true,
        csrf: false,
    },

    runtimeConfig: {
        // The private keys which are only available within server-side

        // Keys within public, will be also exposed to the client-side
        public: {
            apiUrl: 'http://localhost:5000/api/',
            staticsUrl: 'http://localhost:5000/'
        }
    }

})
