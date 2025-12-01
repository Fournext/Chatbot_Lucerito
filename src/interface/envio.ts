export interface ShippingData {
  direccion1?: string;
  direccion2?: string;
  ciudad?: string;
  region?: string;
  pais?: string;
  codigo_postal?: string;
  nombre_completo?: string;
  telefono?: '591 ' | string;
  comentario?: string;
  guardarDatos?: boolean;
  latitud?: number;
  longitud?: number;
  user_telegram_id?: string;
  orden_id?: number;
}