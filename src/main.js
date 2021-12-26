import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VeeValidatePlugin from './includes/validation';
import { authStateChangeHandle } from './includes/firebase';
import './assets/tailwind.css';
import './assets/main.css';

let app = null;
authStateChangeHandle(() => {
  if (!app) {
    app = createApp(App);
    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin);
    app.mount('#app');
  }
});
