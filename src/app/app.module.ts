import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
    //{ provide: HTTP_INTERCEPTORS, useClass: FunctionKeyInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
