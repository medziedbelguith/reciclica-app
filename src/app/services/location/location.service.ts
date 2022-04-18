import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
declare var google;

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }
  geocode(position:{latitude:number,longitude:number}):Observable<any>
  {
    return new Observable<any>(observer=>{

     const geocoder=new google.maps.Geocoder();
     const latLng=new google.maps.LatLng(position.latitude,position.longitude);
     geocoder.geocode({latLng},(results,status)=>{
        if(status==google.maps.GeocoderStatus.Ok)
        {
          observer.next(results[0])
        }
        else{
          observer.error(status);
        }
        
        console.log(results,status);
     })
     
    })
  }
}
