<script setup lang="ts">
import type { Serie } from '../../models/serie'
import http from '../../plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { ref, onMounted, defineEmits, defineExpose } from 'vue'

const ENDPOINT = 'series'
const series = ref<Serie[]>([])

const emit = defineEmits(['edit'])
const serieDelete = ref<Serie | null>(null)
const mostrarConfirmDialog = ref(false)

async function obtenerLista() {
  try {
    const response = await http.get(ENDPOINT)
    series.value = response.data
  } catch (e) {
    console.error('Error loading series', e)
  }
}

function emitirEdicion(serie: Serie) {
  emit('edit', serie)
}

function mostrarEliminarConfirm(serie: Serie) {
  serieDelete.value = serie
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  if (!serieDelete.value) return
  try {
    await http.delete(`${ENDPOINT}/${serieDelete.value.id}`)
    await obtenerLista()
  } catch (e) {
    console.error('Error deleting serie', e)
  }
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})

defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Título</th>
          <th>Sinopsis</th>
          <th>Director</th>
          <th>Temporadas</th>
          <th>Fecha de Estreno</th>
          <th>Idioma Principal</th>
          <th>País</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(serie, index) in series" :key="serie.id">
          <td>{{ index + 1 }}</td>
          <td>{{ serie.titulo }}</td>
          <td>{{ serie.sinopsis }}</td>
          <td>{{ serie.director }}</td>
          <td>{{ serie.temporadas }}</td>
          <td>{{ new Date(serie.fechaEstreno).toLocaleDateString() }}</td>
          <td>{{ serie.pais.idiomaPrincipal}}</td>
          <td>{{ serie.pais.descripcion }}</td>
          <td>
            <Button icon="pi pi-pencil" text @click="emitirEdicion(serie)" />
            <Button icon="pi pi-trash" text @click="mostrarEliminarConfirm(serie)" />
          </td>
        </tr>
      </tbody>
    </table>

    <Dialog v-model:visible="mostrarConfirmDialog" header="Confirmar Eliminación" :style="{ width: '25rem' }">
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <Button label="Cancelar" severity="secondary" @click="mostrarConfirmDialog = false" />
        <Button label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
