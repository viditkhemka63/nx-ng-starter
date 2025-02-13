import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppClientStoreModule } from '@app/client-store';
import { IWebClientAppEnvironment } from '@app/client-util';

import { appClientCoreModuleProvidersFactory } from './providers/client-core-module.providers';

/**
 * Client core module.
 */
@NgModule({
  imports: [FlexLayoutModule, FormsModule, ReactiveFormsModule, HttpClientModule, AppClientStoreModule],
  exports: [FlexLayoutModule, FormsModule, ReactiveFormsModule, HttpClientModule, AppClientStoreModule],
})
export class AppClientCoreModule {
  /**
   * Provides services.
   * @param environment the client application environment
   */
  public static forRoot(environment: IWebClientAppEnvironment): ModuleWithProviders<AppClientCoreModule> {
    return {
      ngModule: AppClientCoreModule,
      providers: [appClientCoreModuleProvidersFactory(environment)],
    };
  }
}
