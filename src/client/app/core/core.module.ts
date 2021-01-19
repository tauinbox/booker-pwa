import { environment } from '../../environments/environment';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    NavbarComponent,
    PageNotFoundComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})
  ],
  exports: [
    HttpClientModule,
    PageNotFoundComponent,
    NavbarComponent,
    HomeComponent
  ]
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }

}
