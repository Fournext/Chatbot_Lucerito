import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { FormDatosEnvio } from './form-datos-envio/form-datos-envio';
import { DatosTarjeta } from './datos-tarjeta/datos-tarjeta';
import { Order } from './order/order';
import { Caja } from './caja/caja';

export const routes: Routes = [
	{ path: 'dashboard', component: Dashboard },
	{ path: 'order', component: Order },
	{ path: 'datos-envio', component: FormDatosEnvio },
    { path: 'datos-tarjeta', component: DatosTarjeta },
	{ path: 'caja', component: Caja },
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
