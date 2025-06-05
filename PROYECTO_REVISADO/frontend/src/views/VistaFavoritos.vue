<template>
  <div class="container py-4">
    <h2>Mis Favoritos</h2>
    <div v-if="favoritas.length === 0" class="alert alert-info mt-4">
      No tienes canciones favoritas.
    </div>
    <div v-else class="row mt-4">
      <div
        class="col-md-4 mb-3"
        v-for="fav in favoritas"
        :key="fav.favorito_id"
      >
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ fav.titulo }}</h5>
            <p class="card-text">
              <strong>Artista:</strong> {{ fav.artista }}<br />
              <strong>Género:</strong> {{ fav.genero }}
            </p>
            <a :href="fav.album" target="_blank" class="btn btn-primary btn-sm mb-2">
              Ver Álbum
            </a>
            <button
              class="btn btn-danger btn-sm d-block w-100"
              @click="quitarFavorito(fav.favorito_id, fav.cancion_id)"
            >
              <i class="bi bi-heartbreak-fill"></i> Quitar de Favoritos
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'VistaFavoritos',
  data() {
    return {
      favoritas: [], 
    };
  },
  async mounted() {
    axios.defaults.baseURL = 'http://localhost:3000';
    await this.cargarFavoritos();
  },
  methods: {
    async cargarFavoritos() {
      try {
        const resp = await axios.get('/api/favoritos');
        this.favoritas = Array.isArray(resp.data) ? resp.data : [];
      } catch (err) {
        console.error('Error al cargar favoritos:', err);
      }
    },
    async quitarFavorito(favoritoId, cancionId) {
      try {
        await axios.delete(`/api/favoritos/${favoritoId}`);
        this.favoritas = this.favoritas.filter(f => f.favorito_id !== favoritoId);
      } catch (err) {
        console.error('Error al quitar favorito:', err);
      }
    },
  },
};
</script>

<style scoped>
.card h-5 {
  min-height: 2rem;
}
</style>
