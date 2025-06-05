<template>
  <div class="container py-4">
    <h2 class="mb-4">Gestión de Canciones</h2>

    <div class="row">
      <!-- 1) Formulario (izquierda) -->
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            {{ editando ? 'Editar Canción' : 'Agregar Canción' }}
          </div>
          <div class="card-body">
            <form
              @submit.prevent="validarYEnviar"
              novalidate
              :class="{ 'was-validated': validado }"
            >
              <!-- Título -->
              <div class="mb-3">
                <label for="titulo" class="form-label">Título</label>
                <input
                  id="titulo"
                  v-model.trim="nuevaCancion.titulo"
                  type="text"
                  class="form-control"
                  placeholder="Título"
                  required
                />
                <div class="invalid-feedback">Debes ingresar el título.</div>
              </div>

              <!-- Género -->
              <div class="mb-3">
                <label for="genero" class="form-label">Género</label>
                <select
                  id="genero"
                  v-model="nuevaCancion.genero"
                  class="form-select"
                  required
                >
                  <option disabled value="">
                    {{ generos.length === 0 ? 'Sin géneros aún' : 'Selecciona un género' }}
                  </option>
                  <option v-for="g in generos" :key="g.id" :value="g.nombre">
                    {{ g.nombre }}
                  </option>
                </select>
                <div class="invalid-feedback">Debes seleccionar un género.</div>
              </div>

              <!-- Artista -->
              <div class="mb-3">
                <label for="artista" class="form-label">Artista</label>
                <input
                  id="artista"
                  v-model.trim="nuevaCancion.artista"
                  type="text"
                  class="form-control"
                  placeholder="Artista"
                  required
                />
                <div class="invalid-feedback">Debes ingresar el artista.</div>
              </div>

              <!-- Álbum (URL) -->
              <div class="mb-3">
                <label for="album" class="form-label">Álbum (URL)</label>
                <input
                  id="album"
                  v-model.trim="nuevaCancion.album"
                  type="url"
                  class="form-control"
                  placeholder="https://..."
                  required
                />
                <div class="invalid-feedback">Debes ingresar una URL válida.</div>
              </div>

              <button class="btn btn-success w-100" type="submit">
                {{ editando ? 'Actualizar' : 'Agregar' }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- 2) Tabla de canciones (derecha) -->
      <div class="col-md-8">
        <table class="table table-bordered">
          <thead class="table-light">
            <tr>
              <th>Título</th>
              <th>Género</th>
              <th>Artista</th>
              <th>Álbum</th>
              <th>Favorito</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cancion in canciones" :key="cancion.id">
              <td>{{ cancion.titulo }}</td>
              <td>{{ cancion.genero }}</td>
              <td>{{ cancion.artista }}</td>
              <td>
                <a
                  :href="cancion.album"
                  target="_blank"
                  class="btn btn-outline-primary btn-sm"
                >
                  Ver
                </a>
              </td>
              <!-- Columna Favorito -->
              <td class="text-center">
                <button
                  class="btn btn-link p-0"
                  @click="toggleFavorito(cancion)"
                  :title="esFavorita(cancion.id)
                    ? 'Quitar de favoritos'
                    : 'Agregar a favoritos'"
                >
                  <i
                    v-if="esFavorita(cancion.id)"
                    class="bi bi-heart-fill text-danger fs-5"
                  ></i>
                  <i
                    v-else
                    class="bi bi-heart fs-5 text-muted"
                  ></i>
                </button>
              </td>
              <td>
                <button
                  class="btn btn-warning btn-sm me-1"
                  @click="editarCancion(cancion)"
                >
                  Editar
                </button>
                <button
                  class="btn btn-danger btn-sm"
                  @click="eliminarCancion(cancion.id)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
            <tr v-if="canciones.length === 0">
              <td colspan="6" class="text-center">No hay canciones registradas.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 3) PDF en iframe -->
    <div class="mt-4">
      <iframe
        src="http://localhost:3000/api/pdf/canciones"
        width="100%"
        height="600px"
        title="Listado de Canciones"
      ></iframe>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'VistaMusicas',

  props: {
    // Recibimos desde App.vue si el usuario está logueado
    isLoggedIn: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      generos: [],
      canciones: [],
      nuevaCancion: {
        id: null,
        titulo: '',
        genero: '',
        artista: '',
        album: '',
      },
      editando: false,
      validado: false,
      alerta: '',
      favoritosMap: {},
    };
  },

  async mounted() {
    axios.defaults.baseURL = 'http://localhost:3000';

    // 1) Verificamos en consola si isLoggedIn llega verdaderamente:
    //console.log('VistaMusicas mounted → isLoggedIn:', this.isLoggedIn);

    // 2) Cargamos géneros y canciones
    await this.getGeneros();
    await this.getCanciones();

    // 3) Si ya está logueado, cargamos favoritos
    if (this.isLoggedIn) {
      await this.cargarFavoritos();
    }
  },

  watch: {
    // Si isLoggedIn cambia, recargamos o limpiamos favoritos:
    isLoggedIn(nuevo) {
      console.log('prop isLoggedIn cambió a:', nuevo);
      if (nuevo) {
        this.cargarFavoritos();
      } else {
        this.favoritosMap = {};
      }
    }
  },

  methods: {
    // ——— Obtener Géneros ———
    async getGeneros() {
      try {
        const resp = await axios.get('/api/genero');
        this.generos = Array.isArray(resp.data)
          ? resp.data.filter(g => g.estado === 1)
          : [];
      } catch (err) {
        console.error('Error al cargar géneros:', err);
      }
    },

    // ——— Obtener Canciones ———
    async getCanciones() {
      try {
        const resp = await axios.get('/api/canciones');
        this.canciones = Array.isArray(resp.data)
          ? resp.data
          : [];
      } catch (err) {
        console.error('Error al cargar canciones:', err);
      }
    },

    // ——— Cargar Favoritos ———
    async cargarFavoritos() {
      try {
        const resp = await axios.get('/api/favoritos', { withCredentials: true });
       
        this.favoritosMap = {};
        resp.data.forEach(item => {
          this.favoritosMap[item.cancion_id] = item.favorito_id;
        });
  
      } catch (err) {
        console.error('Error al cargar favoritos:', err);
      }
    },

   
    esFavorita(cancionId) {
      return !!this.favoritosMap[cancionId];
    },

   
    async toggleFavorito(cancion) {
      console.log('toggleFavorito disparado. isLoggedIn:', this.isLoggedIn, 'cancion.id=', cancion.id);

      // 1) Si NO está logueado:
      if (!this.isLoggedIn) {
        alert('Debes iniciar sesión primero para gestionar favoritos.');
        return;
      }

      // 2) Si está logueado, procedemos con la API
      const cId = cancion.id;
      const favId = this.favoritosMap[cId];

      if (favId) {
        console.log('-> Ya era favorita, se eliminará favorita_id=', favId);
        try {
          await axios.delete(`/api/favoritos/${favId}`, { withCredentials: true });
          this.$delete(this.favoritosMap, cId);
          console.log('  > Eliminado de favoritos, ahora favoritosMap=', this.favoritosMap);
        } catch (err) {
          console.error('Error al quitar de favoritos:', err);
        }
      } else {
        console.log('-> No era favorita, se agregará cancion_id=', cId);
        try {
          const resp = await axios.post(
            '/api/favoritos',
            { cancion_id: cId },
            { withCredentials: true }
          );
          if (resp.data.favorito_id) {
            this.$set(this.favoritosMap, cId, resp.data.favorito_id);
            console.log('  > Agregado a favoritos. favoritosMap=', this.favoritosMap);
          } else {
            // Si no devolvió favorito_id, recargamos la lista
            await this.cargarFavoritos();
          }
        } catch (err) {
          console.error('Error al agregar a favoritos:', err);
        }
      }
    },

    // ——— Validación y creación/edición ———
    validarYEnviar() {
      this.validado = true;
      const form = this.$el.querySelector('form');
      if (form.checkValidity()) {
        this.editando ? this.actualizarCancion() : this.agregarCancion();
        this.validado = false;
      }
    },

    async agregarCancion() {
      try {
        const payload = {
          titulo: this.nuevaCancion.titulo,
          artista: this.nuevaCancion.artista,
          album: this.nuevaCancion.album,
          genero: this.nuevaCancion.genero,
        };
        const resp = await axios.post('/api/canciones', payload);
        this.canciones.push({ ...resp.data });
        this.resetFormulario();
      } catch (err) {
        console.error('Error al crear canción:', err);
      }
    },

    editarCancion(cancion) {
      this.nuevaCancion = { ...cancion };
      this.editando = true;
      this.validado = false;
    },

    async actualizarCancion() {
      try {
        const id = this.nuevaCancion.id;
        const payload = {
          titulo: this.nuevaCancion.titulo,
          artista: this.nuevaCancion.artista,
          album: this.nuevaCancion.album,
          genero: this.nuevaCancion.genero,
        };
        await axios.put(`/api/canciones/${id}`, payload);
        const idx = this.canciones.findIndex(c => c.id === id);
        if (idx !== -1) {
          this.canciones.splice(idx, 1, { id, ...payload });
        }
        this.resetFormulario();
      } catch (err) {
        console.error('Error al actualizar canción:', err);
      }
    },

    async eliminarCancion(id) {
      if (!confirm('¿Seguro que deseas eliminar esta canción?')) return;
      try {
        await axios.delete(`/api/canciones/${id}`);
        this.canciones = this.canciones.filter(c => c.id !== id);
        this.resetFormulario();
      } catch (err) {
        console.error('Error al eliminar canción:', err);
      }
    },

    resetFormulario() {
      this.nuevaCancion = {
        id: null,
        titulo: '',
        genero: '',
        artista: '',
        album: '',
      };
      this.editando = false;
      this.validado = false;
      this.alerta = '';
    },
  },
};
</script>

<style scoped>
.table td,
.table th {
  vertical-align: middle;
}
</style>
