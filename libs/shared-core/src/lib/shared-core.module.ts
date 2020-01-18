import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpProgressModule } from '@nx-ng-starter/shared-core/ui';
import {
  APP_ENV,
  AppEnvironment,
  SharedCoreServicesModule,
  sharedCoreModuleProviders,
} from './data-access';
import {
  AppTranslateModule,
  CustomMaterialModule,
  UserModule,
  appTranslateModuleProviders,
  customMaterialModuleProviders,
  httpProgressModuleProviders,
  userModuleProviders,
} from './ui';

/**
 * Shared core module.
 * Contains shared core modules with providers.
 */
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CustomMaterialModule.forRoot(),
    AppTranslateModule.forRoot(),
    SharedCoreServicesModule.forRoot(),
    HttpProgressModule.forRoot(),
    UserModule.forRoot(),
  ],
  exports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CustomMaterialModule,
    AppTranslateModule,
    SharedCoreServicesModule,
    HttpProgressModule,
    UserModule,
  ],
})
export class SharedCoreModule {
  /**
   * Provides services.
   * @param environment application environment, if omitted default environment will be provided.
   */
  public static forRoot(environment?: AppEnvironment): ModuleWithProviders {
    return {
      ngModule: SharedCoreModule,
      providers: [
        ...customMaterialModuleProviders,
        ...appTranslateModuleProviders,
        ...sharedCoreModuleProviders,
        ...httpProgressModuleProviders,
        ...userModuleProviders,
        {
          provide: APP_ENV,
          useValue: environment,
        },
      ],
    };
  }
}
