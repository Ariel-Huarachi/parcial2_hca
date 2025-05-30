<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import SerieList from '@/components/series/SerieList.vue'
import SerieSave from '@/components/series/SerieSave.vue'
import type { Serie } from '@/models/serie'


const mostrarDialog = ref(false)
const serieListRef = ref<typeof SerieList | null>(null)
const serieEdit = ref<Serie | null>(null)

function handleCreate() {
  serieEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(serie: Serie) {
  serieEdit.value = serie
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  serieListRef.value?.obtenerLista()
  mostrarDialog.value = false
}
</script>

<template>
  <div class="m-8">
    <h1>Series</h1>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    <SerieList ref="serieListRef" @edit="handleEdit" />
    <SerieSave 
      :mostrar="mostrarDialog"
      :serie="serieEdit ?? undefined"
      :modoEdicion="!!serieEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>
