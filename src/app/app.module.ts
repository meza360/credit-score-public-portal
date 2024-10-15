import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_BASE_HREF, CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ScoreReportComponent } from './pages/score-report/score-report.component';
import { MaterialModule } from './material.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoadingDialogComponent } from './components/loading-dialog/loading-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ScoreReportComponent,
    NotFoundComponent,
    LoadingDialogComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    MaterialModule,
    AppRoutingModule
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: APP_BASE_HREF, useValue: '/' },
    //{ provide: HTTP_INTERCEPTORS, useClass: FunctionKeyInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
