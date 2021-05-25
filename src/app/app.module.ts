import { SHELL_CONFIG } from '@app/config/shell.config';
import { LoggerBusFactory, TemporaryLoggerBus } from '@shared/services/logger/logger-bus.service';
import { ShellServiceFactory, TemporaryShellService } from '@shared/services/shell/shell.service';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Provider } from '@angular/core';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { EmptyComponent } from './pages/empty/empty.component';

// Providers array
const providers = [
  {
    provide: TemporaryShellService,
    useValue: ShellServiceFactory.getInstance(SHELL_CONFIG)
  },
  {
    provide: TemporaryLoggerBus,
    useValue: LoggerBusFactory.getInstance()
  }
] as Provider[];

@NgModule({
   declarations: [
      AppComponent,
      SidebarComponent,
      NavbarComponent,
      EmptyComponent
   ],
   imports: [
      BrowserModule,
      RouterModule.forRoot([
         { path: '', pathMatch: 'full', redirectTo: 'home'},
         { path: '**', component: EmptyComponent }
      ], { useHash: true })
   ],
   schemas: [
      CUSTOM_ELEMENTS_SCHEMA
   ],
   providers,
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
