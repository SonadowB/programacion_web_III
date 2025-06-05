
<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card bg-dark bg-opacity-75 border-0">
        <div class="card-body text-white">

          <ul class="nav nav-tabs mb-3" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                :class="{ active: modo === 'login' }"
                @click="cambiarModo('login')"
                type="button"
                role="tab"
              >
                Iniciar Sesión
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                :class="{ active: modo === 'register' }"
                @click="cambiarModo('register')"
                type="button"
                role="tab"
              >
                Registrarse
              </button>
            </li>
          </ul>

          <div v-if="modo === 'login'">
            <form @submit.prevent="submitLogin">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  v-model="loginForm.email"
                  type="email"
                  class="form-control"
                  placeholder="tucorreo@ejemplo.com"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Contraseña</label>
                <div class="input-group">
                  <input
                    :type="mostrarPass ? 'text' : 'password'"
                    v-model="loginForm.password"
                    class="form-control"
                    placeholder="*******"
                    required
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="mostrarPass = !mostrarPass"
                  >
                    <i :class="mostrarPass ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Captcha: {{ captchaPregunta }}</label>
                <input
                  v-model="loginForm.captchaRespuesta"
                  type="number"
                  class="form-control"
                  placeholder="Ingresa la respuesta"
                  required
                />
              </div>
              <button class="btn btn-success w-100" type="submit">
                Iniciar Sesión
              </button>
            </form>
            <div v-if="errorLogin" class="alert alert-danger mt-3">
              {{ errorLogin }}
            </div>
          </div>

          <div v-else>
            <form @submit.prevent="submitRegister">
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input
                  v-model="registerForm.nombre"
                  type="text"
                  class="form-control"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  v-model="registerForm.email"
                  type="email"
                  class="form-control"
                  placeholder="tucorreo@ejemplo.com"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Contraseña</label>
                <div class="input-group">
                  <input
                    :type="mostrarPass ? 'text' : 'password'"
                    v-model="registerForm.password"
                    class="form-control"
                    placeholder="*******"
                    @input="evaluarPassword"
                    required
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="mostrarPass = !mostrarPass"
                  >
                    <i :class="mostrarPass ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <small class="text-muted">Fuerza: {{ fuerza }}</small>
              </div>

              <div class="mb-3">
                <label class="form-label">Captcha: {{ captchaPregunta }}</label>
                <input
                  v-model="registerForm.captchaRespuesta"
                  type="number"
                  class="form-control"
                  placeholder="Ingresa la respuesta"
                  required
                />
              </div>
              <button class="btn btn-warning w-100" type="submit">
                Registrarse
              </button>
            </form>
            <div v-if="errorRegister" class="alert alert-danger mt-3">
              {{ errorRegister }}
            </div>
            <div v-if="successRegister" class="alert alert-success mt-3">
              {{ successRegister }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const modo = ref('login');
const mostrarPass = ref(false);

const captchaPregunta = ref('');

const loginForm = ref({
  email: '',
  password: '',
  captchaRespuesta: ''
});
const registerForm = ref({
  nombre: '',
  email: '',
  password: '',
  captchaRespuesta: ''
});

const errorLogin = ref('');
const errorRegister = ref('');
const successRegister = ref('');

const fuerza = ref('Débil');

onMounted(() => {
  cargarCaptcha();
});

async function cargarCaptcha() {
  try {
    const res = await axios.get('http://localhost:3000/api/auth/captcha', {
      withCredentials: true
    });
    captchaPregunta.value = res.data.pregunta;
  } catch (e) {
    console.error('Error al cargar CAPTCHA:', e);
    captchaPregunta.value = 'Error al cargar CAPTCHA';
  }
}

function cambiarModo(nuevoModo) {
  modo.value = nuevoModo;
  mostrarPass.value = false;
  errorLogin.value = '';
  errorRegister.value = '';
  successRegister.value = '';

  loginForm.value = { email: '', password: '', captchaRespuesta: '' };
  registerForm.value = { nombre: '', email: '', password: '', captchaRespuesta: '' };
  fuerza.value = 'Débil';

  cargarCaptcha();
}

function evaluarPassword() {
  const p = registerForm.value.password;
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[\W_]/.test(p)) score++;
  fuerza.value = ['Débil', 'Intermedia', 'Fuerte'][Math.min(score - 1, 2)] || 'Débil';
}

async function submitLogin() {
  errorLogin.value = '';
  try {
    await axios.post(
      'http://localhost:3000/api/auth/login',
      {
        email: loginForm.value.email,
        password: loginForm.value.password,
        captchaRespuesta: loginForm.value.captchaRespuesta
      },
      { withCredentials: true }
    );

    await cargarCaptcha();
    emit('login-exitoso');
  } catch (e) {
    errorLogin.value = e.response?.data?.error || 'Error al iniciar sesión.';
    await cargarCaptcha();
  }
}

async function submitRegister() {
  errorRegister.value = '';
  successRegister.value = '';
  try {
    const res = await axios.post(
      'http://localhost:3000/api/auth/register',
      {
        nombre: registerForm.value.nombre,
        email: registerForm.value.email,
        password: registerForm.value.password,
        captchaRespuesta: registerForm.value.captchaRespuesta
      },
      { withCredentials: true }
    );
    successRegister.value = res.data.mensaje; // “Cuenta creada con éxito...”
    await cargarCaptcha();
  } catch (e) {
    errorRegister.value = e.response?.data?.error || 'Error al registrarse.';
    await cargarCaptcha();
  }
}
</script>

<style scoped>
html,
body,
#app {
  height: 100%;
  margin: 0;
}
.card {
  background-color: rgba(0, 0, 0, 0.75) !important;
}
</style>
