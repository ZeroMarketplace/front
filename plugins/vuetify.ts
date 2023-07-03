import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin(nuxtApp => {

    const vuetify = createVuetify({
        ssr: true,
        rtl: true,
        components,
        directives,
        themes: {
            myCustomTheme: {
                dark: false,
                colors: {
                    background: '#FFFFFF',
                    surface: '#FFFFFF',
                    primary: '#6200EE',
                    'primary-darken-1': '#3700B3',
                    secondary: '#d4deec',
                    'secondary-darken-1': '#5094b4',
                    error: '#B00020',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FB8C00',
                },
            },
        },
    })

    nuxtApp.vueApp.use(vuetify)
})