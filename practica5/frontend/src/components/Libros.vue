<template>
  <div>
    <h1>Gestión de Libros</h1>

    <form @submit.prevent="guardarLibro">
      <input v-model="titulo" placeholder="Título" required />
      <input v-model="autor" placeholder="Autor" required />
      <button type="submit">{{ libroIdEditar ? 'Actualizar' : 'Guardar' }}</button>
    </form>

    <h2>Lista de libros</h2>
    <ul>
      <li v-for="libro in libros" :key="libro.id">
        {{ libro.titulo }} - {{ libro.autor }}
        <button @click="editarLibro(libro)">Editar</button>
        <button @click="eliminarLibro(libro.id)">Eliminar</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LibrosComponent',
  data() {
    return {
      titulo: '',
      autor: '',
      libros: [],
      libroIdEditar: null,
    };
  },
  methods: {
    async cargarLibros() {
      try {
        const res = await axios.get('http://localhost:3000/api/libros');
        this.libros = res.data;
      } catch (err) {
        console.error('Error al cargar libros:', err);
      }
    },
    async guardarLibro() {
  try {
    const datosLibro = {
      titulo: this.titulo,
      autor: this.autor
    };

    if (this.libroIdEditar) {
      // Editando: hacer PUT con el id
      await axios.put(`http://localhost:3000/api/libros/${this.libroIdEditar}`, datosLibro);
      this.libroIdEditar = null;  // Resetear modo edición
    } else {
      // Nuevo libro: hacer POST
      await axios.post('http://localhost:3000/api/libros', datosLibro);
    }

    this.titulo = '';
    this.autor = '';
    this.cargarLibros();
  } catch (error) {
    console.error('Error al guardar libro:', error);
  }
}
,
    editarLibro(libro) {
      // Aquí puedes poner la lógica para editar, por ejemplo:
      this.titulo = libro.titulo;
      this.autor = libro.autor;
       this.libroIdEditar = libro.id;
      // Podrías agregar también un estado para saber que estás editando,
      // y cambiar el comportamiento del formulario para hacer update en lugar de insert.
      console.log('Editar libro:', libro);
    },
    async eliminarLibro(id) {
      try {
        await axios.delete(`http://localhost:3000/api/libros/${id}`);
        this.cargarLibros();
      } catch (error) {
        console.error('Error al eliminar libro:', error);
      }
    }
  },
  mounted() {
    this.cargarLibros();
  }
};
</script>
