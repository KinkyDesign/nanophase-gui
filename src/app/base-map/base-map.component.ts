// import { environment } from environment
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment.prod';
import { OidcSecurityService } from 'angular-auth-oidc-client';
declare var require: any;
var MapboxDraw = require('@mapbox/mapbox-gl-draw');
var turf = require('@turf/turf');

@Component({
  selector: 'app-base-map',
  templateUrl: './base-map.component.html',
  styleUrls: ['./base-map.component.css']
})
export class BaseMapComponent implements OnInit {

  map:mapboxgl.Map;

  isEnabled:boolean = false;

  bounds = new mapboxgl.LngLatBounds(
    new mapboxgl.LngLat(-1.390769, 51.291669),// Notio-Dutika coordinates
    new mapboxgl.LngLat(0.734746, 51.806683)  // Borio-Anatolika coordinates
  );
  
   draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            polygon: true,
            trash: true,
            point:true,
        }
    });

    constructor(private _oidcService:OidcSecurityService){

    }

    ngOnInit() {
      (mapboxgl as any).accessToken = environment.mapboxKey;
      this.map = new mapboxgl.Map({
      container: 'map-mapbox', 
      style: 'mapbox://styles/mapbox/streets-v11',
      // center: [-0.7008827,51.5626992],
      maxBounds : this.bounds,  //Restrict map panning to an area 
      interactive: true      //Display a non-interactive map
      });

      this._oidcService.isAuthenticated$.subscribe(
        (isAuthorized: boolean) => {
          console.log(isAuthorized)
          if(isAuthorized === true && this.isEnabled === false){
            this.map.addControl(this.draw,'top-right');
            this.map.addControl(new mapboxgl.NavigationControl());
            this.createAndUpdatePolugon();
            this.isEnabled = true
          }else if(isAuthorized === false && typeof this.map != 'undefined'){
            this.isEnabled = false
            // this.map.removeControl(this.draw)
            // this.map.removeControl(new mapboxgl.NavigationControl());
          }
        });
      
    }   

  createAndUpdatePolugon() {
     var data,polyCoord; 
     
      this.map.on('draw.create',()=>{
        data = this.draw.getAll();
        console.log(data)
        polyCoord = turf.coordAll(data);

        if (data.features.length > 0) {
             //draw_point 
            if(this.draw.getMode()=='draw_point'){ 
              console.log('Points Created! With coordinates:');
              for (var i = 1; i <= polyCoord.length; i++) {
              console.log(polyCoord[i-1]);
              }
            }
          else { //draw_polygon
            console.log('Polygon Created! With coordinates:');
            for (var i = 0; i < polyCoord.length-1; i++) {
            console.log(polyCoord[i]);
            }
          }
        }
      })
      this.map.on('draw.delete',()=>{
        console.log('Deleted!');
      })
      this.map.on('draw.update',()=>{
        data = this.draw.getAll();
        polyCoord = turf.coordAll(data);
        if (data.features.length > 0) {
          console.log(' Updated! With coordinates:');
          for (var i = 0; i < polyCoord.length-1; i++) {
            console.log(polyCoord[i]);
          }
        }
      })
  }

}