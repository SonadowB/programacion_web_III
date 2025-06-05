import { createRouter, createWebHistory } from 'vue-router';
import LoginView from './views/LoginView.vue';
import RegisterView from './views/registerview.vue';
import HomeView from './views/home.vue'; 
import VistaFavoritos from './views/VistaFavoritos.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/favoritos', name: 'Favoritos',component: VistaFavoritos, 
}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
