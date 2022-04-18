import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from 'src/app/app-routing.module';

import { HomePage } from './home.page';
import { Router } from '@angular/router';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let router: Router;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      imports: [IonicModule.forRoot(),
        AppRoutingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    router= TestBed.get(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('it should go to pickupcalls on see all', () => {
    spyOn(router,'navigate');
    component.goToPickupCalls();
    //tick(1500);
    expect(router.navigate).toHaveBeenCalledWith(['pickup-calls']);
   })
   it('it should go to new picku on create pickupcall', () => {
    spyOn(router,'navigate');
    component.newPickupCall();
    //tick(1500);
    expect(router.navigate).toHaveBeenCalledWith(['pickup-call']);
   })
});
