import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { BsDropdownModule,PaginationModule,ModalModule,BsDatepickerModule,CollapseModule,CarouselModule } from 'ngx-bootstrap';
import { NgxSelectModule } from 'ngx-select-ex';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AppComponent } from './app.component';
import { routing }        from './app.routing';
import { BusService } from './_service/bus.service';
import { DialogComponent } from './_helper/dialog.component';
import { ImageComponent } from './_helper/image.component';
import { PhotoComponent } from './_helper/photo.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_helper/auth.guard';
import { JwtInterceptor } from './_helper/jwt.interceptor';
import { ErrorInterceptor } from './_helper/error.interceptor';
import { TagInputModule } from 'ngx-chips';
import { ColorPickerModule } from 'ngx-color-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { ProfileComponent } from './my/profile.component';
// import { OrderComponent } from './my/order.component';
// import { ShareComponent } from './my/share.component';
// import { GridComponent } from './_helper/grid.component';
// import { GridActionComponent } from './_helper/grid.action.component';
// import { GridColumnVisiable } from './_helper/grid.column.visiable';
// import { GridColumnDetail } from './_helper/grid.column.detail';
import { ConfigService } from './app.config';
import { HttpRequest } from './_helper/http.request';
import { RegisterComponent } from './my/register.component';
import { NavbarComponent } from './_helper/navbar.component';
import { DclWrapper } from './_helper/dcl.wrapper';
import { PhoneComponent } from './_helper/phone.component';
import { WelcomeComponent } from './home/welcome.component';
/* import { PosterComponent } from './h.poster/poster.component';
import { EditorComponent } from './h.poster/editor.component'; */
import { ProductComponent } from './h.poster/product.component';



@NgModule({
  declarations: [
    AppComponent,
    ImageComponent,
    PhotoComponent,
    DialogComponent,
    // GridComponent,
    // GridActionComponent,
    // GridColumnVisiable,
    // GridColumnDetail,
    DclWrapper,
    HomeComponent,
    WelcomeComponent,
    ProfileComponent,
    LoginComponent,
   /*  PosterComponent, */
   /*  EditorComponent, */
    //OrderComponent,
    ProductComponent,
    RegisterComponent,
    NavbarComponent,
    PhoneComponent 
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    /* PaginationModule.forRoot(), */
    routing,
    HttpClientModule,
    /* BsDropdownModule.forRoot(), */
    ModalModule.forRoot(),
    // BsDatepickerModule.forRoot(),
    // CollapseModule.forRoot(),
    // CarouselModule.forRoot(),
    /* TabsModule.forRoot(), */
    /* NgxSelectModule, */
    /* TagInputModule, */
   /*  ColorPickerModule, */
    BrowserAnimationsModule
  ],
  entryComponents: [ 
    DclWrapper,
    NavbarComponent,
    WelcomeComponent,
    ProfileComponent,
/*     PosterComponent,
    EditorComponent, */
    LoginComponent,
    //OrderComponent,
    ProductComponent,
    RegisterComponent
  ],
  providers: [BusService,ConfigService,HttpRequest,AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
