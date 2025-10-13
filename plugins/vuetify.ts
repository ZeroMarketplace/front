import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin(nuxtApp => {

    const vuetify = createVuetify({
        ssr: true,
        rtl: true,
        components,
        directives,
        theme:{
            defaultTheme:'zeroLight',
            themes: {
                zeroLight: {
                    dark: false,
                    colors: {
                        background: '#FFFFFF',
                        surface: '#FFFFFF',
                        primary: '#f8830b',
                        'primary-darken-1': '#3700B3',
                        secondary: '#F5A44E',
                        'secondary-darken-1': '#5094b4',
                        error: '#B00020',
                        info: '#2196F3',
                        success: '#4CAF50',
                        warning: '#FB8C00',
                        pink:'#EC407A',
                    },
                    cspNonce: 'dQw4w9WgXcQ'
                },
            }
        },
    })

    nuxtApp.vueApp.use(vuetify)
})