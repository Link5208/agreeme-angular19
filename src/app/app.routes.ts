import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AddContractComponent } from './components/contract/add-contract/add-contract.component';
import { EditContractComponent } from './components/contract/edit-contract/edit-contract.component';
import { ContractViewComponent } from './components/contract/contract-view/contract-view.component';
import { LoginComponent } from './components/auth/login/login.component';
import { authGuard } from './config/guard/auth.guard';
import { RegisterComponent } from './components/auth/register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'contract',
        loadComponent: () =>
          import('./components/contract/contract.component').then(
            (m) => m.ContractComponent
          ),
      },
      {
        path: 'contract/add',
        component: AddContractComponent,
      },
      {
        path: 'contract/edit/:id',
        component: EditContractComponent,
        data: {
          reuseComponent: false,
          loadChildren: () =>
            import(
              './components/contract/edit-contract/edit-contract.component'
            ).then((m) => m.EditContractComponent),
        },
      },
      {
        path: 'contract/view/:id',
        component: ContractViewComponent,
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: 'contract',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
