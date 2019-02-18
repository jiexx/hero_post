import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_helper/auth.guard';
import { RegisterComponent } from './my/register.component';
import { PosterComponent } from './h.poster/poster.component';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent },
    // otherwise redirect to home
    { path: 'poster', component: PosterComponent },
    { path: '', redirectTo: 'home',pathMatch: 'full' }
];

export const routing = RouterModule.forRoot(appRoutes);