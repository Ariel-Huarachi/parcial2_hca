<script setup lang="ts">
import type { Serie } from '../../models/serie'
import http from '../../plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import Select from 'primevue/dropdown'
import { ref, computed, watch, onMounted, defineProps, defineEmits } from 'vue'

const ENDPOINT = 'series'
const ENDPOINT_PAISES = 'paises'

const idiomasPrincipales = computed(() => {
  const idiomasUnicos = new Set(paises.value.map(p => p.idiomaPrincipal))
  return Array.from(idiomasUnicos).map(idioma => ({
    id: idioma,
    idioma
  }))
})


const props = defineProps({
  mostrar: Boolean,
  serie: {
    type: Object as () => Serie,
    default: () => ({} as Serie)
  },
  modoEdicion: Boolean
})

const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (val) => { if (!val) emit('close') }
})

const serie = ref<Serie>({ ...props.serie })
const paises = ref<any[]>([])

watch(() => props.serie, (newVal) => {
  serie.value = { ...newVal }
})

async function fetchPaises() {
  try {
    const res = await http.get(ENDPOINT_PAISES)
    paises.value = res.data
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => fetchPaises())

async function handleSave() {
  try {
    const body = {
      titulo: serie.value.titulo,
      sinopsis: serie.value.sinopsis,
      director: serie.value.director,
      temporadas: serie.value.temporadas,
      fechaEstreno: serie.value.fechaEstreno,
      idPais: serie.value.idPais
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${serie.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Error guardando la serie')
  }
}
</script>

<template>
  <Dialog v-model:visible="dialogVisible" :header="props.modoEdicion ? 'Editar Serie' : 'Crear Serie'" style="width: 25rem;">
    <div class="flex flex-column gap-3">
      <label>Título</label>
      <InputText v-model="serie.titulo" autofocus />

      <label>Sinopsis</label>
      <InputText v-model="serie.sinopsis" />

      <label>Director</label>
      <InputText v-model="serie.director" />

      <label>Temporadas</label>
      <InputNumber v-model="serie.temporadas" :min="1" />

      <label>Fecha de Estreno</label>
      <Calendar v-model="serie.fechaEstreno" dateFormat="yy-mm-dd" showIcon />

      <label>Idioma Principal</label>
      <Select v-model="serie.idiomaPrincipal":options="idiomasPrincipales"optionLabel="idioma"optionValue="id"placeholder="Seleccione idioma principal"/>

      <label>País</label>
      <Select v-model="serie.idPais" :options="paises" optionLabel="descripcion" optionValue="id" placeholder="Seleccione país" />
    </div>

    <div class="flex justify-end mt-4 gap-2">
      <Button label="Cancelar" severity="secondary" @click="dialogVisible = false" />
      <Button label="Guardar" icon="pi pi-save" @click="handleSave" />
    </div>
  </Dialog>
</template>

<style scoped></style>
