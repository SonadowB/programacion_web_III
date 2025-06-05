<template>
  <div class="app-wrapper d-flex flex-column min-vh-100 text-white">
    <header
      class="d-flex justify-content-between align-items-center px-4 py-3"
      style="background-color: rgba(0, 0, 0, 0.8);"
    >
      <div class="d-flex align-items-center">
        <button
          class="btn me-2"
          :class="currentView === 'generos' ? 'btn-warning' : 'btn-outline-warning'"
          @click="irA('generos')"
        >
          <i class="bi bi-tags me-1"></i> Géneros
        </button>
        <button
          class="btn me-2"
          :class="currentView === 'musicas' ? 'btn-primary' : 'btn-outline-primary'"
          @click="irA('musicas')"
        >
          <i class="bi bi-music-note-list me-1"></i> Música
        </button>
        <button
          class="btn"
          :class="currentView === 'favoritos' ? 'btn-info' : 'btn-outline-info'"
          @click="irA('favoritos')"
        >
          <i class="bi bi-heart-fill me-1"></i> Favoritos
        </button>
      </div>

      <div class="d-flex align-items-center">
        <div v-if="!isLoggedIn" class="d-flex">
          <button
            class="btn me-2"
            :class="mostrandoLogin ? 'btn-success' : 'btn-outline-success'"
            @click="irA('login')"
          >
            <i class="bi bi-box-arrow-in-right me-1"></i> Login
          </button>
          <button
            class="btn"
            :class="mostrandoRegister ? 'btn-success' : 'btn-outline-success'"
            @click="irA('register')"
          >
            <i class="bi bi-pencil-square me-1"></i> Registro
          </button>
        </div>

        <div v-else class="dropdown">
          <button
            class="btn btn-outline-light dropdown-toggle"
            type="button"
            id="usuarioDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-person-circle me-1"></i> {{ usuario.nombre }}
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="usuarioDropdown">
            <li>
              <a class="dropdown-item" @click="cerrarSesion">
                Cerrar Sesión
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
    <main class="container-fluid flex-grow-1 py-4 px-3">
      <LoginForm
        v-if="mostrandoLogin"
        @login-exitoso="onLoginExitoso"
        @irARegistro="irA('register')"
        @cancelar="irA('generos')"
      />

      <RegisterForm
        v-else-if="mostrandoRegister"
        @registro-exitoso="onRegistroExitoso"
        @irALogin="irA('login')"
        @cancelar="irA('generos')"
      />

      <component
        v-else
        :is="vistaActual"
        :generos="generos"
        :canciones="canciones"
        :favoritos="favoritos"
        :ultimaCancion="ultimaCancion"
        :usuario="usuario"
        :is-logged-in="isLoggedIn"
        @actualizar-generos="cargarGeneros"
        @actualizar-canciones="cargarCanciones"
        @actualizar-favoritos="cargarFavoritos"
        @actualizar-ultima-cancion="c => (ultimaCancion = c)"
      />
    </main>
    <footer
      class="text-center text-light py-3 mt-auto"
      style="background-color: rgba(0, 0, 0, 0.7);"
    >
      <small>🎧 Proyecto Final — Gestión Musical 2025</small>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'
import VistaGeneros from './views/VistaGeneros.vue'
import VistaMusicas from './views/VistaMusicas.vue'
import VistaFavoritos from './views/VistaFavoritos.vue'

export default {
  name: 'App',
  components: {
    LoginForm,
    RegisterForm,
    VistaGeneros,
    VistaMusicas,
    VistaFavoritos,
  },
  setup() {
    const isLoggedIn = ref(false)
    const usuario = ref(null)
    const currentView = ref('generos')   
    const mostrandoLogin = ref(false)
    const mostrandoRegister = ref(false)

    const generos = ref([])
    const canciones = ref([])
    const favoritos = ref([])
    const ultimaCancion = ref(null)

    const vistaActual = computed(() => {
      switch (currentView.value) {
        case 'generos':
          return VistaGeneros
        case 'musicas':
          return VistaMusicas
        case 'favoritos':
          return VistaFavoritos
      }
    })

    onMounted(async () => {
      axios.defaults.baseURL = 'http://localhost:3000'

      try {
        const res = await axios.get('/api/auth/usuario', { withCredentials: true })
        if (res.data.usuario) {
          isLoggedIn.value = true
          usuario.value = res.data.usuario
        }
      } catch {
        isLoggedIn.value = false
        usuario.value = null
      }

      await cargarGeneros()
      await cargarCanciones()
      if (isLoggedIn.value) {
        await cargarFavoritos()
      }
    })

    function irA(vista) {
      if (vista === 'login') {
        mostrandoLogin.value = true
        mostrandoRegister.value = false
      } else if (vista === 'register') {
        mostrandoRegister.value = true
        mostrandoLogin.value = false
      } else {
        currentView.value = vista
        mostrandoLogin.value = false
        mostrandoRegister.value = false
      }
    }
    async function onLoginExitoso(usuarioData) {
      isLoggedIn.value = true
      usuario.value = usuarioData

      await cargarFavoritos()

      currentView.value = 'generos'
      mostrandoLogin.value = false
    }

    function onRegistroExitoso() {
      mostrandoRegister.value = false
      mostrandoLogin.value = true
    }

    async function cerrarSesion() {
      try {
        await axios.post('/api/auth/logout', {}, { withCredentials: true })
      } catch (err) {
        console.error('Error al cerrar sesión:', err)
      } finally {
        isLoggedIn.value = false
        usuario.value = null
        favoritos.value = []
        currentView.value = 'generos'
      }
    }

    async function cargarGeneros() {
      try {
        const res = await axios.get('/api/genero')
        generos.value = Array.isArray(res.data)
          ? res.data.filter((g) => g.estado === 1)
          : []
      } catch (err) {
        console.error('Error al cargar géneros:', err)
      }
    }

    async function cargarCanciones() {
      try {
        const res = await axios.get('/api/canciones')
        canciones.value = Array.isArray(res.data)
          ? res.data.filter((c) => c.estado === 1)
          : []
      } catch (err) {
        console.error('Error al cargar canciones:', err)
      }
    }

    async function cargarFavoritos() {
      if (!isLoggedIn.value) return
      try {
        const res = await axios.get('/api/favoritos', { withCredentials: true })
        favoritos.value = Array.isArray(res.data) ? res.data : []
      } catch (err) {
        console.error('Error al cargar favoritos:', err)
      }
    }

    return {
      isLoggedIn,
      usuario,
      currentView,
      mostrandoLogin,
      mostrandoRegister,
      generos,
      canciones,
      favoritos,
      ultimaCancion,
      vistaActual,
      irA,
      onLoginExitoso,
      onRegistroExitoso,
      cerrarSesion,
      cargarGeneros,
      cargarCanciones,
      cargarFavoritos,
    }
  },
}
</script>

<style>
body {
  background-image: url("https://img.freepik.com/vector-premium/notas-musicales-abstractas-fondo-ondulado-espacio-copia_1302-57896.jpg");
    background-size: cover;
  background-repeat: no-repeat;
  background-position: top;
}
</style>
