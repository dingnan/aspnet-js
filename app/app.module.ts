import { BrowserModule }  from '@angular/platform-browser';  
import { NgModule } '@angular/core';
import { MyApp } from './app.component.ts'

@NgModule({
  imports: [BrowserModule],
  declarations: [MyApp],
  bootstrap: [MyApp]
})
export class MyAppModule {
  
}
