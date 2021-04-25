import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpfulLinksComponent } from './helpful-links/helpful-links.component';
import { FAQComponent } from './faq/faq.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent} from './login/login.component';
import { from } from 'rxjs';


const routes: Routes = [
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'home', component: HomeComponent },
  { path: 'helpful', component: HelpfulLinksComponent },
  { path: 'faq',      component: FAQComponent },
  { path: 'login', component: LoginComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
