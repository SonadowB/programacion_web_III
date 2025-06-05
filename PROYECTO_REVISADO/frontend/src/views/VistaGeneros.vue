<template>
  <div class="container py-4">
    <h2 class="mb-4">Gestión de Géneros Musicales</h2>

    <div class="row">
      <div class="col-md-8">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="g in generos" :key="g.id">
              <td>{{ g.id }}</td>
              <td>{{ g.nombre }}</td>
              <td>{{ g.descripcion }}</td>
              <td>
                <button class="btn btn-warning btn-sm me-1" @click="cargarParaEditar(g)">
                  Editar
                </button>
                <button class="btn btn-danger btn-sm" @click="eliminarGenero(g)">
                  Eliminar
                </button>
              </td>
            </tr>
            <tr v-if="generos.length === 0">
              <td colspan="4" class="text-center">No hay géneros registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            {{ editando ? 'Editar Género' : 'Agregar Género' }}
          </div>
          <div class="card-body">
            <form @submit.prevent="validarYEnviar" novalidate :class="{ 'was-validated': validado }">
         
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input
                  id="nombre"
                  v-model.trim="nuevoGenero.nombre"
                  type="text"
                  class="form-control"
                  placeholder="Nombre del género"
                  required
                />
                <div class="invalid-feedback">Debes ingresar el nombre.</div>
              </div>

              <div class="mb-3">
                <label for="descripcion" class="form-label">Descripción</label>
                <textarea
                  id="descripcion"
                  v-model.trim="nuevoGenero.descripcion"
                  class="form-control"
                  rows="2"
                  placeholder="Descripción"
                  required
                ></textarea>
                <div class="invalid-feedback">Debes ingresar la descripción.</div>
              </div>

              <button class="btn btn-primary w-100" type="submit">
                {{ editando ? 'Actualizar' : 'Agregar' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div v-if="alerta" class="alert alert-danger mt-3">{{ alerta }}</div>

    <hr class="my-4" />
    <h4 class="mb-3">Gráfico de Canciones por Género</h4>
    <GraficoCanciones :datos="graficoDatos" />
  </div>
</template>

<script>
import axios from 'axios'
import GraficoCanciones from '../components/GraficoCanciones.vue'

export default {
  name: 'VistaGeneros',
  components: {
    GraficoCanciones,
  },
  data() {
    return {
      generos: [],      
      canciones: [],    
      graficoDatos: [], 

      nuevoGenero: {
        id: null,
        nombre: '',
        descripcion: '',
      },

      editando: false,
      validado: false,
      alerta: '',
    }
  },
  async mounted() {
    axios.defaults.baseURL = 'http://localhost:3000'

    await this.cargarGeneros()

    await this.cargarCanciones()

    this.generarGraficoDatos()
  },
  methods: {
    async cargarGeneros() {
      try {
        const resp = await axios.get('/api/genero')
        this.generos = Array.isArray(resp.data)
          ? resp.data.filter((g) => g.estado === 1)
          : []
      } catch (err) {
        console.error('Error al cargar géneros:', err)
        this.alerta = 'Error al cargar la lista de géneros.'
      }
    },

    async crearGenero() {
      try {
        const payload = {
          nombre: this.nuevoGenero.nombre,
          descripcion: this.nuevoGenero.descripcion,
        }
        const resp = await axios.post('/api/genero', payload)
        this.generos.push({
          id: resp.data.id,
          nombre: resp.data.nombre,
          descripcion: resp.data.descripcion,
          estado: 1,
        })

        await this.cargarCanciones()
        this.generarGraficoDatos()
        this.resetFormulario()
      } catch (err) {
        console.error('Error al crear género:', err)
        this.alerta = 'Error al crear el género.'
      }
    },

    cargarParaEditar(g) {
      this.nuevoGenero = {
        id: g.id,
        nombre: g.nombre,
        descripcion: g.descripcion,
      }
      this.editando = true
      this.validado = false
      this.alerta = ''
    },

    async actualizarGenero() {
      try {
        const id = this.nuevoGenero.id
        const payload = {
          nombre: this.nuevoGenero.nombre,
          descripcion: this.nuevoGenero.descripcion,
        }
        await axios.put(`/api/genero/${id}`, payload)
        await this.cargarGeneros()
        await this.cargarCanciones()
        this.generarGraficoDatos()
        this.resetFormulario()
      } catch (err) {
        console.error('Error al actualizar género:', err)
        this.alerta = 'Error al actualizar el género.'
      }
    },

    async eliminarGenero(g) {
      try {
        const asociadas = this.canciones.filter((c) => c.genero === g.nombre)
        if (asociadas.length > 0) {
          alert(`No puedes eliminar "${g.nombre}" porque tiene canciones asociadas.`)
          return
        }
        if (!confirm(`¿Eliminar género "${g.nombre}"?`)) return

        await axios.delete(`/api/genero/${g.id}`)
        this.generos = this.generos.filter((x) => x.id !== g.id)
        await this.cargarCanciones()
        this.generarGraficoDatos()
        this.resetFormulario()
      } catch (err) {
        console.error('Error al eliminar género:', err)
        this.alerta = 'Error al eliminar el género.'
      }
    },

    async cargarCanciones() {
      try {
        const resp = await axios.get('/api/canciones')
        this.canciones = Array.isArray(resp.data)
          ? resp.data.filter((c) => c.estado === 1)
          : []
      } catch (err) {
        console.error('Error al cargar canciones:', err)
        this.alerta = 'Error al cargar la lista de canciones.'
      }
    },

    generarGraficoDatos() {
      this.graficoDatos = this.generos.map((gen) => {
        const cantidad = this.canciones.filter((c) => c.genero === gen.nombre).length
        return { genero: gen.nombre, cantidad }
      })
    },

    validarYEnviar() {
      this.validado = true
      const form = this.$el.querySelector('form')
      if (!form.checkValidity()) return

      if (this.editando) {
        this.actualizarGenero()
      } else {
        this.crearGenero()
      }
      this.validado = false
    },
    resetFormulario() {
      this.nuevoGenero = { id: null, nombre: '', descripcion: '' }
      this.editando = false
      this.validado = false
      this.alerta = ''
    },
  },
}
</script>

<style scoped>
.table td,
.table th {
  vertical-align: middle;
}
</style>
