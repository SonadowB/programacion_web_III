<template>
  <div class="container py-5">
    <h2 class="text-center mb-4">Registrarse</h2>
    <RegisterForm />
    <p class="mt-3 text-center">¿Ya tienes una cuenta?
      <router-link to="/login">Inicia sesión</router-link>
    </p>
  </div>
</template>

<script setup>
import RegisterForm from '../components/RegisterForm.vue';
</script>
