<template>
  <div class="p-4">
    <Card class="max-w-3xl mx-auto">
      <CardContent class="p-6">
        <h2 class="text-2xl font-bold mb-4">Gestión de Géneros</h2>

        <form @submit.prevent="guardarGenero" class="mb-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="nombre">Nombre del género</Label>
              <Input id="nombre" v-model="nombre" required />
            </div>
          </div>
          <Button type="submit" class="mt-4">{{ editando ? 'Actualizar' : 'Agregar' }}</Button>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="genero in generos" :key="genero.id">
              <TableCell>{{ genero.id }}</TableCell>
              <TableCell>{{ genero.nombre }}</TableCell>
              <TableCell class="space-x-2">
                <Button variant="secondary" @click="editarGenero(genero)">Editar</Button>
                <Button variant="destructive" @click="eliminarGenero(genero.id)">Eliminar</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import {
  Card, CardContent,
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
  Button, Input, Label
} from '@/components/ui'

const generos = ref([])
const nombre = ref('')
const idGenero = ref(null)
const editando = ref(false)

const obtenerGeneros = async () => {
  const res = await axios.get('http://localhost:3000/generos')
  generos.value = res.data
}

const guardarGenero = async () => {
  if (editando.value) {
    await axios.put(`http://localhost:3000/generos/${idGenero.value}`, { nombre: nombre.value })
  } else {
    await axios.post('http://localhost:3000/generos', { nombre: nombre.value })
  }
  nombre.value = ''
  idGenero.value = null
  editando.value = false
  obtenerGeneros()
}

const editarGenero = (genero) => {
  nombre.value = genero.nombre
  idGenero.value = genero.id
  editando.value = true
}

const eliminarGenero = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/generos/${id}`)
    obtenerGeneros()
  } catch (err) {
    alert('No se puede eliminar el género. Elimine primero las canciones asociadas.')
  }
}

onMounted(obtenerGeneros)
</script>