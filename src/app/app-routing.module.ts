import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoggedInComponent } from './logged-in/logged-in.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: 'logged-in', component: LoggedInComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', component: LoginComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
