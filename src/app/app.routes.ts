import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { FormDatosEnvio } from './form-datos-envio/form-datos-envio';
import { DatosTarjeta } from './datos-tarjeta/datos-tarjeta';

export const routes: Routes = [
	{ path: 'dashboard', component: Dashboard },
	{ path: 'datos-envio', component: FormDatosEnvio },
	{ path: 'datos-tarjeta', component: DatosTarjeta },
	//{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
