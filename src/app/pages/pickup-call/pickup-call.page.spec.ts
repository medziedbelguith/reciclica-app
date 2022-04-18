import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PickupCallPage } from './pickup-call.page';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { Router } from '@angular/router';

describe('PickupCallPage', () => {
  let component: PickupCallPage;
  let fixture: ComponentFixture<PickupCallPage>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PickupCallPage ],
      imports: [IonicModule.forRoot(),
        AppRoutingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PickupCallPage);
    router= TestBed.get(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('it should go to home page on create pickupcall', () => {
    spyOn(router,'navigate');
    component.newPickupCall();
    //tick(1500);
    expect(router.navigate).toHaveBeenCalledWith(['home']);
   })
});
