import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScoreReportComponent } from './pages/score-report/score-report.component';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'public/score',
    component: ScoreReportComponent
  },
  {
    path: 'public/score/:id',
    component: ScoreReportComponent
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
