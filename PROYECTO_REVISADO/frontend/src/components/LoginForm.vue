<template>
  <div class="container py-5">
    <h2 class="text-center mb-4">Iniciar Sesión</h2>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="mensaje" class="alert alert-success">{{ mensaje }}</div>

    <form @submit.prevent="login" class="mx-auto" style="max-width: 400px;">

      <div class="mb-3">
        <label for="email" class="form-label">Correo electrónico</label>
        <input
          id="email"
          v-model.trim="email"
          type="email"
          class="form-control"
          placeholder="tú@correo.com"
          required
        />
      </div>

      <div class="mb-3 position-relative">
        <label for="password" class="form-label">Contraseña</label>
        <div class="input-group">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model.trim="password"
            class="form-control"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="showPassword = !showPassword"
            tabindex="-1"
          >
            <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>
      </div>

      <div v-if="captchaPregunta" class="mb-3">
        <label for="captcha" class="form-label">{{ captchaPregunta }}</label>
        <input
          id="captcha"
          v-model.trim="captchaRespuesta"
          type="number"
          class="form-control"
          placeholder="Respuesta"
          required
        />
      </div>

      <button class="btn btn-primary w-100 mb-2" type="submit" :disabled="cargando">
        <span v-if="cargando" class="spinner-border spinner-border-sm me-2"></span>
        {{ cargando ? 'Ingresando...' : 'Iniciar sesión' }}
      </button>

      <button
        type="button"
        class="btn btn-outline-secondary w-100"
        @click="$emit('cancelar')"
      >
        Cancelar
      </button>

      <p class="mt-3 text-center">
        ¿No tienes una cuenta?
        <a href="#" @click.prevent="$emit('irARegistro')">Regístrate aquí</a>
      </p>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginForm',
  emits: ['login-exitoso', 'irARegistro', 'cancelar'],
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      captchaRespuesta: '',
      captchaPregunta: '',
      error: '',
      mensaje: '',
      cargando: false,
    }
  },
  async mounted() {
    try {
      const res = await axios.get('/api/auth/captcha', { withCredentials: true })
      this.captchaPregunta = res.data.pregunta
    } catch (err) {
      console.error('Error al obtener captcha:', err)
    }
  },
  methods: {
    async login() {
      this.error = ''
      this.mensaje = ''
      this.cargando = true

      try {
        const res = await axios.post(
          '/api/auth/login',
          {
            email: this.email,
            password: this.password,
            captchaRespuesta: this.captchaRespuesta,
          },
          { withCredentials: true }
        )

        if (res.data.usuario) {
          this.mensaje = res.data.mensaje
          this.$emit('login-exitoso', res.data.usuario)
        } else {
          this.error = 'Respuesta inesperada del servidor.'
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          this.error = err.response.data.error
        } else {
          this.error = 'Error al conectar con el servidor.'
        }
   
        this.obtenerCaptcha()
      } finally {
        this.cargando = false
      }
    },
    async obtenerCaptcha() {
      try {
        const res = await axios.get('/api/auth/captcha', { withCredentials: true })
        this.captchaPregunta = res.data.pregunta
        this.captchaRespuesta = ''
      } catch (err) {
        console.error('Error al refrescar captcha:', err)
      }
    },
  },
}
</script>

<style scoped>
.container {
  max-width: 500px;
}
</style>
