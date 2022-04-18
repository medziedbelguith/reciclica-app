import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickupCallCardComponent } from './pickup-call-card.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports:[
      PickupCallCardComponent
  ],
  declarations: [
    PickupCallCardComponent]
})
export class PickupCallCardModule {}
