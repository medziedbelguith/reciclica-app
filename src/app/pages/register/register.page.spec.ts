import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RegisterPage } from './register.page';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterPageModule } from './register.module';
import { AppState } from 'src/store/AppState';
import { Store, StoreModule } from '@ngrx/store';
import { loadingReducer } from 'src/store/loading/loading.reducers';
import { registerReducer } from 'src/store/register/register.reducers';
import { UserRegister } from 'src/app/components/model/user/UserRegister';
import { register, registerFail, registerSuccess } from 'src/store/register/register.actions';
import { present } from '@ionic/core/dist/types/utils/overlays';
import { loginReducer } from 'src/store/login/login.reducers';
import { of } from 'rxjs';
import { LocationService } from 'src/app/services/location/location.service';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let router: Router;
  let page;
  let store:Store<AppState>;
  let toastController:ToastController;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterPage ],
      imports: [IonicModule.forRoot(),
        AppRoutingModule,
        ReactiveFormsModule,
        RegisterPageModule,
        StoreModule.forRoot([]),
        StoreModule.forFeature("loading",loadingReducer),
        StoreModule.forFeature("login",loginReducer),
        StoreModule.forFeature("register",registerReducer)
       ]
    })
    .overrideProvider(Geolocation,{useValue:new GeolocationMock()})
    .overrideProvider(LocationService,{useValue:new LocationServiceMock()})
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    router= TestBed.get(Router);
    store=TestBed.get(Store);
    toastController=TestBed.get(ToastController);
    component = fixture.componentInstance;
    page=fixture.debugElement.nativeElement;
  }));

  
  it('should create register form on page unit',()=>{
    fixture.detectChanges();
    expect(component.registerForm).not.toBeUndefined(); 
  })
   it('should not be allowed to register with form invalid',()=>{
    fixture.detectChanges();

    clickRegisterButton();
    store.select("register").subscribe(state=>{
      expect(state.isRegistering).toBeFalsy();
    })
   })
   it('given form is valid, when user clicks on register then register',()=>{
    fixture.detectChanges();
    fillForm();
    clickRegisterButton();
    store.select("register").subscribe(state=>{
      expect(state.isRegistering).toBeTruthy();
    })
   })
   it('given form is valid, when user clicks on register then show loading',()=>{
    fixture.detectChanges();
    fillForm();
    clickRegisterButton();
    store.select("loading").subscribe(state=>{
      expect(state.show).toBeTruthy();
    })
   })
   it('given page unit,when geolocation is enabled,then fill adress details with user location',fakeAsync(()=>{
    fixture.detectChanges();
    tick(10);
    expect(component.registerForm.getForm().value.addres).toEqual({
      street:'geocoded_street',
      number:'geocoded_number',
      neighborhood:'geocoded_neighborhood',
      zipCode:'geocoded_zipCode',
      complement:'',
      state:'geocoded_state',
      city:'geocoded_city',
    })
   }))
   it('should hide loading component when registration successful',()=>{
    fixture.detectChanges();
     store.dispatch(register({userRegister:new UserRegister()}));
     store.dispatch(registerSuccess());
     store.select("loading").subscribe(state=>{
      expect(state.show).toBeFalsy();
    })
   })
   it('should login  when registration successful',()=>{
    fixture.detectChanges();
     store.dispatch(register({userRegister:new UserRegister()}));
     store.dispatch(registerSuccess());
    store.select('login').subscribe(state=>{
      expect(state.isLoggingIn).toBeTruthy();
    })
   })
   it('should hide loading component when registration fails',()=>{
    fixture.detectChanges();
     store.dispatch(register({userRegister:new UserRegister()}));
     store.dispatch(registerFail({error:{message:'any message'}}));
     store.select("loading").subscribe(state=>{
      expect(state.show).toBeFalsy();
    })
  })
  it('should show error  when registration fails',()=>{
    fixture.detectChanges();
    spyOn(toastController,'create').and.returnValue(<any> Promise.resolve({present:()=>{}}));
     store.dispatch(register({userRegister:new UserRegister()}));
     store.dispatch(registerFail({error:{message:'any message'}}));
    expect(toastController.create).toHaveBeenCalled();
   })
   function clickRegisterButton(){
    page.querySelector('ion-button').click();
   }
   function fillForm(){
    component.registerForm.getForm().get('name').setValue("anyName");
    component.registerForm.getForm().get('email').setValue("any@email.com");
    component.registerForm.getForm().get('password').setValue("anyPassword");
    component.registerForm.getForm().get('repeatPassword').setValue("anyPassword");
    component.registerForm.getForm().get('phone').setValue("anyPhone");
    component.registerForm.getForm().get('address').get('street').setValue("any street");
    component.registerForm.getForm().get('address').get('number').setValue("any number");
    component.registerForm.getForm().get('address').get('complement').setValue("any complement");
    component.registerForm.getForm().get('address').get('neighborhood').setValue("any neighborhood");
    component.registerForm.getForm().get('address').get('zipCode').setValue("any zip code");
    component.registerForm.getForm().get('address').get('city').setValue("any city");
    component.registerForm.getForm().get('address').get('state').setValue("any state");

   }
   class GeolocationMock{
     getCurrentPosition(){
       return Promise.resolve({
         coords:{
         latitude:1,
         longitude:2
        }
       })
      }
   }
   class LocationServiceMock
   {
     geocode(location)
     {
     return of({
       adress_components:[
         {long_name:"geocoded_street",types:["routes"]},
         {long_name:"geocoded_number",types:["street_number"]},
         {long_name:"geocoded_neighborhood",types:["sublocality"]},
         {long_name:"geocoded_zipCode",types:["post_code"]},
         {long_name:"geocoded_state",types:["administrative_area_level_1"]},
         {long_name:"geocoded_city",types:["administrative_area_level_2"]}
       ]
     })
    }
   }
});
