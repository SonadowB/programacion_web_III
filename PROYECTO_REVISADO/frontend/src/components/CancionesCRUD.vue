<template>
  <div>
    <form @submit.prevent="guardarCancion" class="row g-3 mb-4">
      <div class="col-md-6">
        <input v-model="form.titulo" class="form-control" placeholder="Título de la canción" required />
      </div>
      <div class="col-md-6">
        <input v-model="form.artista" class="form-control" placeholder="Artista" required />
      </div>
      <div class="col-md-6">
        <input v-model="form.album" class="form-control" placeholder="Álbum" />
      </div>
      <div class="col-md-6">
        <input v-model="form.genero" class="form-control" placeholder="Género" />
      </div>
      <div class="col-12">
        <button class="btn btn-success w-100">
          {{ form.id ? 'Actualizar' : 'Agregar' }}
        </button>
      </div>
    </form>

    <table class="table table-striped table-bordered">
      <thead class="table-dark">
        <tr>
          <th>Título</th>
          <th>Artista</th>
          <th>Álbum</th>
          <th>Género</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cancion in canciones" :key="cancion.id">
          <td>{{ cancion.titulo }}</td>
          <td>{{ cancion.artista }}</td>
          <td>{{ cancion.album }}</td>
          <td>{{ cancion.genero }}</td>
          <td class="text-center">
            <button class="btn btn-sm btn-primary me-2" @click="editar(cancion)">Editar</button>
            <button class="btn btn-sm btn-danger" @click="eliminar(cancion.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const canciones = ref([]);
const form = ref({ titulo: '', artista: '', album: '', genero: '', id: null });

const cargarCanciones = async () => {
  const res = await axios.get('http://localhost:3000/api/canciones');
  canciones.value = res.data;
};

const guardarCancion = async () => {
  if (form.value.id) {
    await axios.put(`http://localhost:3000/api/canciones/${form.value.id}`, form.value);
  } else {
    await axios.post('http://localhost:3000/api/canciones', form.value);
  }
  form.value = { titulo: '', artista: '', album: '', genero: '', id: null };
  cargarCanciones();
};

const editar = (c) => {
  form.value = { ...c };
};

const eliminar = async (id) => {
  if (confirm('¿Estás seguro de eliminar esta canción?')) {
    await axios.delete(`http://localhost:3000/api/canciones/${id}`);
    cargarCanciones();
  }
};

onMounted(() => cargarCanciones());
</script>
