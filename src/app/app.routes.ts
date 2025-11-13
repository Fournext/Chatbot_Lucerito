import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Order } from './order/order';

export const routes: Routes = [
	{ path: 'dashboard', component: Dashboard },
	{ path: 'order', component: Order },
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
