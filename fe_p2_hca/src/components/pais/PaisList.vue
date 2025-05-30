<script setup lang="ts">
import type { Pais } from '@/models/pais'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import { onMounted, ref, computed } from 'vue'

const ENDPOINT = 'paises'
const paises = ref<Pais[]>([])
const busqueda = ref<string>('')

const paisFiltrado = computed(() =>
  paises.value.filter(p =>
    p.descripcion.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

const emit = defineEmits(['edit'])
const paisDelete = ref<Pais | null>(null)
const mostrarConfirmDialog = ref(false)

function emitirEdicion(pais: Pais) {
  emit('edit', pais)
}

function mostrarEliminarConfirm(pais: Pais) {
  paisDelete.value = pais
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${paisDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

async function obtenerLista() {
  paises.value = await http.get(ENDPOINT).then(res => res.data)
}

onMounted(obtenerLista)
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="col-7 pl-0 mt-3">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" placeholder="Buscar por país" />
      </InputGroup>
    </div>

    <table>
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Descripción</th>
          <th>idioma Pricipal</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(pais, index) in paisFiltrado" :key="pais.id">
          <td>{{ index + 1 }}</td>
          <td>{{ pais.descripcion }}</td>
          <td>{{ pais.idiomaPrincipal }}</td>
          <td>
            <Button icon="pi pi-pencil" text @click="emitirEdicion(pais)" />
            <Button icon="pi pi-trash" text @click="mostrarEliminarConfirm(pais)" />
          </td>
        </tr>
        <tr v-if="paisFiltrado.length === 0">
          <td colspan="3">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <Button label="Cancelar" severity="secondary" @click="mostrarConfirmDialog = false" />
        <Button label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>
