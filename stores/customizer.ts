import { defineStore } from 'pinia';

interface StateType {
  Sidebar_drawer: boolean;
  Customizer_drawer: boolean;
  mini_sidebar: boolean;
  setHorizontalLayout: boolean;
  actTheme: string;
  inputBg: boolean;
  boxed: boolean;
  setBorderCard: boolean;
  setRTLLayout: boolean
}

export const useCustomizerStore = defineStore('customizer', {
  state: (): StateType => ({
    Sidebar_drawer: true,
    Customizer_drawer: false,
    mini_sidebar: false,
    setHorizontalLayout: false,
    actTheme: 'LightTheme',
    inputBg: false,
    boxed: true,
    setBorderCard: false,
    setRTLLayout: true
  }),
  getters: {},
  actions: {
    SET_SIDEBAR_DRAWER() {
      this.Sidebar_drawer = !this.Sidebar_drawer;
    },
    SET_MINI_SIDEBAR(payload: boolean) {
      this.mini_sidebar = payload;
    },
    SET_CUSTOMIZER_DRAWER(payload: boolean) {
      this.Customizer_drawer = payload;
    },
    SET_LAYOUT(payload: boolean) {
      this.setHorizontalLayout = payload;
    },
    SET_THEME(payload: string) {
      this.actTheme = payload;
    },
    SET_CARD_BORDER(payload: boolean) {
      this.setBorderCard = payload;
    },
  },
  persist: true,
});
