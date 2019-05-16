// This is the main.js file. Import global CSS and scripts here.
import '~/assets/style/index.scss'

// Import default layout so we don't need to import it to every page
import DefaultLayout from '~/layouts/Default.vue'

import Vuex from 'vuex'

import { Button, Select, Slider, Switch, Progress, Steps, Step } from "element-ui";

const langs = {
  "fr": {
    slug: "fr",
    name: "Français",
  },
  "en": {
    slug: "en",
    name: "English",
  },
};

// The Client API can be used here. Learn more: gridsome.org/docs/client-api
export default function (Vue, { router, head, isClient, appOptions }) {
  Vue.use(Vuex);

  Vue.component(Steps.name, Steps);
  Vue.component(Step.name, Step);
  Vue.component(Progress.name, Progress);
  Vue.component(Switch.name, Switch);
  Vue.component(Button.name, Button);
  Vue.component(Select.name, Select);
  Vue.component(Slider.name, Slider);
  
  appOptions.store = new Vuex.Store({
    state: {
      lang: typeof navigator == "undefined" ? langs["fr"] : 
        ((navigator.language == "fr-FR" || navigator.userLanguage == "fr-FR") ? 
          langs["fr"] : langs["en"]),
    },
    mutations: {
      toggleLang(state) {
        state.lang = state.lang.slug == "fr" ? langs["en"] : langs["fr"];
      }
    }
  });

  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)
}
