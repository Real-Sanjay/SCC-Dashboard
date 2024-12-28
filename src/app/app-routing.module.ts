import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

const routes: Routes = [
  {path: '', component:HeaderComponent}, 
  {path: 'dashboard', component:DashboardComponent},  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
