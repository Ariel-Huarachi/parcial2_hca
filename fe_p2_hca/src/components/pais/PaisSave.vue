<script setup lang="ts">
import type { Pais } from '@/models/pais'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'paises'
const props = defineProps({
  mostrar: Boolean,
  pais: {
    type: Object as () => Pais,
    default: () => ({}) as Pais
  },
  modoEdicion: Boolean
})
const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (val) => {
    if (!val) emit('close')
  }
})

const pais = ref<Pais>({ ...props.pais })
watch(() => props.pais, (nuevo) => {
  pais.value = { ...nuevo }
})

async function handleSave() {
  const body = { descripcion: pais.value.descripcion, idiomaPrincipal: pais.value.idiomaPrincipal }
  try {
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${pais.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    pais.value = {} as Pais
    dialogVisible.value = false
  } catch (e: any) {
    alert(e?.response?.data?.message)
  }
}
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    :header="props.modoEdicion ? 'Editar País' : 'Crear País'"
    style="width: 25rem"
  >
    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-24">Descripción</label>
      <InputText v-model="pais.descripcion" class="flex-auto" autofocus />

      </div>
    <div class="flex items-center gap-4 mb-4">
        <label class="font-semibold w-24">Idioma Principal</label>
        <InputText v-model="pais.idiomaPrincipal" class="flex-auto" />
    </div>
    <div class="flex justify-end gap-2">
      <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="dialogVisible = false" />
      <Button label="Guardar" icon="pi pi-save" @click="handleSave" />
    </div>
  </Dialog>
</template>
