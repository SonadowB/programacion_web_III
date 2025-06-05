<template>
  <div class="container py-5">
    <h2 class="text-center mb-4">Registro</h2>

    <div v-if="mensaje" class="alert alert-success alert-dismissible fade show" role="alert">
      {{ mensaje }}
      <button type="button" class="btn-close" aria-label="Close" @click="mensaje = ''"></button>
    </div>
    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button type="button" class="btn-close" aria-label="Close" @click="error = ''"></button>
    </div>

    <form @submit.prevent="registrar" class="mx-auto" style="max-width: 550px;">

      <div class="mb-3">
        <label for="nombre" class="form-label">Nombre completo</label>
        <input
          id="nombre"
          v-model.trim="nombre"
          type="text"
          class="form-control"
          placeholder="Tu nombre"
          required
        />
      </div>

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
            @input="evaluarFuerza"
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
        <small class="form-text" :class="fuerzaColor">
          {{ fuerzaTexto }}
        </small>
      </div>

      <div class="mb-3 position-relative">
        <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
        <div class="input-group">
          <input
            :type="showConfirm ? 'text' : 'password'"
            id="confirmPassword"
            v-model.trim="confirmPassword"
            class="form-control"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="showConfirm = !showConfirm"
            tabindex="-1"
          >
            <i :class="showConfirm ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>
        <small v-if="passwordsNoCoinciden" class="text-danger">
          Las contraseñas no coinciden.
        </small>
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

      <button class="btn btn-success w-100 mb-2" type="submit" :disabled="cargando">
        <span v-if="cargando" class="spinner-border spinner-border-sm me-2"></span>
        {{ cargando ? 'Registrando...' : 'Crear cuenta' }}
      </button>

      <button
        type="button"
        class="btn btn-outline-secondary w-100 mb-3"
        @click="$emit('cancelar')"
      >
        Cancelar
      </button>

      <p class="mt-3 text-center">
        ¿Ya tienes cuenta?
        <a href="#" @click.prevent="$emit('irALogin')">Inicia sesión</a>
      </p>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'RegisterForm',
  emits: ['registro-exitoso', 'irALogin', 'cancelar'],
  data() {
    return {
      nombre: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirm: false,
      fuerzaTexto: '',
      fuerzaColor: 'text-muted',
      passwordsNoCoinciden: false,
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
    evaluarFuerza() {
      const pass = this.password
      let score = 0
      if (pass.length >= 8) score++
      if (/[A-Z]/.test(pass)) score++
      if (/[0-9]/.test(pass)) score++
      if (/\W/.test(pass)) score++

      if (score <= 1) {
        this.fuerzaTexto = 'Débil'
        this.fuerzaColor = 'text-danger'
      } else if (score === 2 || score === 3) {
        this.fuerzaTexto = 'Intermedia'
        this.fuerzaColor = 'text-warning'
      } else {
        this.fuerzaTexto = 'Fuerte'
        this.fuerzaColor = 'text-success'
      }
    },
    async registrar() {
      this.error = ''
      this.mensaje = ''
      this.passwordsNoCoinciden = false

      if (this.password !== this.confirmPassword) {
        this.passwordsNoCoinciden = true
        return
      }

      this.cargando = true
      try {
        const res = await axios.post(
          '/api/auth/register',
          {
            nombre: this.nombre,
            email: this.email,
            password: this.password,
            captchaRespuesta: this.captchaRespuesta,
          },
          { withCredentials: true }
        )

        this.mensaje = '¡Registro exitoso! Ahora puedes iniciar sesión.'
        setTimeout(() => {
          this.$emit('registro-exitoso')
        }, 2000) // 2 segundos de retraso
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          this.error = err.response.data.error
        } else {
          this.error = 'Error al registrar. Intenta de nuevo.'
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
  max-width: 550px;
}
</style>
