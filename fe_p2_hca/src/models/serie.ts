import type { Pais } from './pais'

export interface Serie {
  id: number
  titulo: string
  sinopsis: string
  tipoClasificacion: string
  director: string
  temporadas: number
  fechaEstreno: Date
  idPais: number
  pais: Pais
}



