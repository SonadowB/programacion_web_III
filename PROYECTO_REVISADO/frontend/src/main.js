import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import router from './router'; 
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:3000';

const app = createApp(App);

app.use(router);

app.mount('#app');
