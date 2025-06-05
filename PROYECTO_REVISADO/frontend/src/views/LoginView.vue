<template>
  <div class="container py-5">
    <h2 class="text-center mb-4">Iniciar Sesión</h2>
    <LoginForm />
    <p class="mt-3 text-center">¿No tienes una cuenta?
      <router-link to="/register">Regístrate</router-link>
    </p>
  </div>
</template>

<script setup>
import LoginForm from '../components/LoginForm.vue'; 
</script>
