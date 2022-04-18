import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginPage } from './login.page';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Store, StoreModule } from "@ngrx/store";
import { loadingReducer } from 'src/store/loading/loading.reducers';
import { loginReducer } from "src/store/login/login.reducers";
import { AppState } from 'src/store/AppState';
import { recoverPassword, recoverPasswordSuccess,recoverPasswordFail, login, loginFail, loginSuccess } from 'src/store/login/login.actions';

import { User } from 'src/app/components/model/user/User';
import { Observable, of, throwError } from 'rxjs';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let router: Router;
  let page;
  let store:Store<AppState>;
  let toastController: ToastController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPage ],
      imports: [IonicModule.forRoot(),
        AppRoutingModule,
      ReactiveFormsModule,
      StoreModule.forRoot([]),
      StoreModule.forFeature("loading",loadingReducer),
      StoreModule.forFeature("login",loginReducer),
      AngularFireModule.initializeApp(environment.firebaseConfig)
    ],
      
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    router= TestBed.get(Router);
    store=TestBed.get(Store);
    toastController=TestBed.get(ToastController);

    component = fixture.componentInstance;
    page=fixture.debugElement.nativeElement;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  })
  it('should create form on unit', () => {
    component.ngOnInit();
    expect(component.form).not.toBeUndefined();
  })
   it('it should go to register page on register', () => {
    spyOn(router,'navigate');
    component.register();
    //tick(1500);
    expect(router.navigate).toHaveBeenCalledWith(['register']);
   })
   it('should recover email/password on forgot email/password',()=>{

    fixture.detectChanges();
    component.form.get('email').setValue("valid@email.com");
    page.querySelector("#recoverPasswordButton").click();
    store.select('login').subscribe(loginState=>{
      expect(loginState.isRecoveringPassword).toBeTruthy();
    })
    store.select('loading').subscribe(loadingState=>{
      expect(loadingState.show).toBeTruthy();
    })
    })
    it('should show loading when recovering password',()=>{
      fixture.detectChanges();
      store.dispatch(recoverPassword({email:"any@email.com"}));
  
    })
    it('given user is recovering password,when success,then hide loading and show success message',()=>{
      spyOn(toastController,'create');
      fixture.detectChanges();
      store.dispatch(recoverPassword({email:"any@email.com"}));
      store.dispatch(recoverPasswordSuccess());
      store.select('loading').subscribe(loadingState=>{
        expect(loadingState.show).toBeFalsy();
      })
      expect(toastController.create).toHaveBeenCalledTimes(1);
    })
    it('given user is recovering password,when fail,then hide loading and show error message',()=>{
      spyOn(toastController,'create').and.returnValue(<any>Promise.resolve({present:()=>{}}));

      fixture.detectChanges();
      store.dispatch(recoverPassword({email:"any@email.com"}));
      store.dispatch(recoverPasswordFail({error:"message"}));
      store.select('loading').subscribe(loadingState=>{
        expect(loadingState.show).toBeFalsy();
      })
      expect(toastController.create).toHaveBeenCalledTimes(1);
    })
    it('should show loading and start login when logging in',()=>{
      fixture.detectChanges();
      component.form.get('email').setValue("valid@email.com");
      component.form.get('password').setValue("anyPassword");
      page.querySelector('#loginButton').click();
      store.select('loading').subscribe(loadingState=>{
        expect(loadingState.show).toBeTruthy();
      })
      store.select('login').subscribe(loginState=>{
        expect(loginState.isLoggingIn).toBeTruthy();
      })
    }) 
    it('given user is logging in,when success,then hide loading and send user to home page',()=>{
      spyOn(router,'navigate');
      fixture.detectChanges();
      store.dispatch(login({email:"valid@email.com",password:"anyPassword"}));
      store.dispatch(loginSuccess({user:new User()}));
      store.select('loading').subscribe(loadingState=>{
        expect(loadingState.show).toBeFalsy();
      })
      store.select('login').subscribe(loginState=>{
        expect(loginState.isLoggedIn).toBeTruthy();
      })
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    })
    it('given user is logging in,when fail,then hide loading and show error message',()=>{
      spyOn(toastController,'create').and.returnValue(<any>Promise.resolve({present:()=>{}}));
      fixture.detectChanges();
      store.dispatch(login({email:"valid@email.com",password:"anyPassword"}));
      store.dispatch(loginFail({error:{message:'error message'}}));
      store.select('loading').subscribe(loadingState=>{
        expect(loadingState.show).toBeFalsy();
      })
      expect(toastController.create).toHaveBeenCalledTimes(1);
    })
});
