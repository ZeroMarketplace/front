import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    rtl: true,
    components,
    directives,
    defaults: {
      VCard: {
        rounded: "md",
      },
      VTextField: {
        variant: "outlined",
        density: "comfortable",
        color: "primary",
      },
      VTextarea: {
        variant: "outlined",
        density: "comfortable",
        color: "primary",
      },
      VSelect: {
        variant: "outlined",
        density: "comfortable",
        color: "primary",
      },
      VAutocomplete: {
        variant: "outlined",
        density: "comfortable",
        color: "primary",
      },
      VFileInput: {
        variant: "outlined",
      },
      VListItem: {
        minHeight: "45px",
      },
      VTooltip: {
        location: "top",
      },
    },
    theme: {
      defaultTheme: "spikeLight",
      themes: {
        spikeLight: {
          dark: false,
          colors: {
            primary: "#0085db",
            secondary: "#707a82",
            info: "#46caeb",
            success: "#4bd08b",
            warning: "#f8c076",
            error: "#fb977d",
            indigo: "#8763da",
            lightprimary: "#e5f3fb",
            lightinfo: "#e1f5fa",
            lightsecondary: "#e7ecf0",
            lightsuccess: "#dffff3",
            lighterror: "#ffede9",
            lightwarning: "#fff6ea",
            lightindigo: "#f1ebff",
            textPrimary: "#2A3547",
            textSecondary: "#2A3547",
            borderColor: "#e5eaef",
            inputBorder: "#DFE5EF",
            containerBg: "#ffffff",
            background: "#f0f5f9",
            hoverColor: "#f6f9fc",
            surface: "#fff",
            "grey-100": "#707a82",
            "grey-200": "#111c2d",
            darkbg: "#2a3447",
            bglight: "#f5f8fb",
            bgdark: "#111c2d",
          },
          variables: {
            "border-color": "#e5eaef",
            "border-opacity": 1,
          },
        },
        // Keep old theme for compatibility
        zeroLight: {
          dark: false,
          colors: {
            background: "#FFFFFF",
            surface: "#FFFFFF",
            primary: "#f8830b",
            "primary-darken-1": "#3700B3",
            secondary: "#F5A44E",
            "secondary-darken-1": "#5094b4",
            error: "#B00020",
            info: "#2196F3",
            success: "#4CAF50",
            warning: "#FB8C00",
            pink: "#EC407A",
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
