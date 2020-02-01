import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
// import * as maptalks from 'maptalks';
import * as maptalks from 'maptalks';
// import * as mt from 'maptalks.three';
import * as THREE from 'THREE';
import { ThreeLayer } from 'maptalks.three';
// "typescript": "~3.4.3"


// declare var THREE: any;
@Component({
  selector: 'admino-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent extends AdminoScreenElement implements OnInit {
  @ViewChild('mapRef', { static: true, read: ElementRef }) mapRef: ElementRef;
  map;
  ngOnInit() {
    // var threeLayer = new maptalks.ThreeLayer('t');
    // console.log(threeLayer)
    // const light = new THREE.DirectionalLight(0xffffff);
    // console.log(light)
    // this.map1();
    this.map2();

    const threeLayer = new ThreeLayer('t');
    // console.log(mt)
    // threeLayer.prepareToDraw = (gl, scene, camera) => {
    //   var light = new THREE.DirectionalLight(0xffffff);
    //   light.position.set(0, -10, -10).normalize();
    //   scene.add(light);
    //   // var me = this;
    //   // countries.features.forEach(function (g) {
    //   //   var num = g.properties.population;
    //   //   var color = getColor(num);

    //   //   var m = new THREE.MeshPhongMaterial({ color: color, opacity: 0.7 });

    //   //   var mesh = me.toExtrudeMesh(maptalks.GeoJSON.toGeometry(g), num / 4E2, m);
    //   //   if (Array.isArray(mesh)) {
    //   //     scene.add.apply(scene, mesh);
    //   //   } else {
    //   //     scene.add(mesh);
    //   //   }
    //   // });
    // };

    // this.map.addLayer(threeLayer);

  }

  map2() {
    const posX = 0;
    const posY = 0;
    const imgW = 1;
    const imgH = 1;
    var imageLayer = new maptalks.ImageLayer('images',
      [
        {
          url: './assets/map2.png',
          extent: [posX, posY, 1, 1],
          opacity: 1
        },
      ]);
    this.map = new maptalks.Map(this.mapRef.nativeElement, {
      center: [0.5, 0.5],
      zoom: 11,
      fog: false,
      pitch: 45,
      dragPitch: true,
      bearing: -40,
      //allow map to drag rotating, true by default
      dragRotate: true,
      //enable map to drag pitching and rotating at the same time, false by default
      dragRotatePitch: true,
      zoomControl: true, // add zoom control
      scaleControl: true, // add scale control
      // overviewControl: true, // add overview control
      baseLayer: imageLayer,
    });

  }




  map1() {
    const posX = 0;
    const posY = 0;
    const imgW = 1;
    const imgH = 1;
    var imageLayer = new maptalks.ImageLayer('images',
      [
        {
          url: './assets/map2.png',
          extent: [posX, posY, 1, 1],
          opacity: 1
        },
      ]);
    this.map = new maptalks.Map(this.mapRef.nativeElement, {
      center: [0.5, 0.5],
      zoom: 11,
      fog: false,
      pitch: 45,
      dragPitch: true,
      bearing: -40,
      //allow map to drag rotating, true by default
      dragRotate: true,
      //enable map to drag pitching and rotating at the same time, false by default
      dragRotatePitch: true,
      zoomControl: true, // add zoom control
      scaleControl: true, // add scale control
      // overviewControl: true, // add overview control
      baseLayer: imageLayer,
    });
    this.map.setMaxExtent([0, 0, 1, 1]);


    const rectangles = [];
    const numX = 15;
    const numY = 15;
    for (let x = 0; x < numX; x++) {
      for (let y = 0; y < numX; y++) {
        const x0 = x * (1 / numX);
        const y0 = y * (1 / numY);
        const x1 = x0 + 1 / numX;
        const y1 = y0 + 1 / numY;
        const capacityFull = Math.random();
        const altitude = capacityFull * 10000;
        const col = this.directive.ts.psbc(capacityFull, this.directive.ts.primaryColor, this.directive.ts.warnColor)
        var rectangle = new maptalks.Polygon([
          [
            [x0, y0],
            [x1, y0],
            [x1, y1],
            [x0, y1],
            [x0, y0],
          ]
        ], {
          symbol: {
            lineColor: col,
            lineWidth: 2,
            polygonFill: col,
            polygonOpacity: 0.6
          },
          properties: {
            altitude: altitude
          }
        });

        const lines = [];

        const front = this.createLine([[x0, y0], [x1, y0]], altitude, col);
        const left = this.createLine([[x1, y0], [x1, y1]], altitude, col);
        const right = this.createLine([[x1, y1], [x0, y1]], altitude, col);
        const back = this.createLine([[x0, y1], [x0, y0]], altitude, col);


        if (Math.random() > 0.7) {
          lines.push(front);
          lines.push(left);
          lines.push(right);
          lines.push(back);
          rectangles.push(rectangle);
          new maptalks.VectorLayer('vector2' + Math.random(), lines, {
            enableAltitude: true, drawAltitude: {
              polygonFill: col,
              polygonOpacity: 0.6,
              lineColor: col,
              lineWidth: 2,
            }
          }).addTo(this.map);
        }


      }


    }





    var layer = new maptalks.VectorLayer('vector', {
      enableAltitude: true
    })
      .addGeometry(rectangles)
      .addTo(this.map);

    // var shadowSymbol = {
    //   lineColor: '#bbb',
    //   lineDasharray: [10, 5, 5],
    //   lineWidth: 2,
    //   polygonFill: '#bbb',
    //   polygonOpacity: 0.4
    // };
    // var shadows = [];
    // layer.forEach(function (geo) {
    //   shadows.push(geo.copy().setSymbol(shadowSymbol));
    // });
    // new maptalks.VectorLayer('shadows', shadows).addTo(this.map).bringToBack();



    var line = new maptalks.LineString([
      [0, 1],
      [1, 1],
      // [-0.101049, 1]
    ], {
      symbol: {
        'lineColor': '#1bbc9b',
        'lineWidth': 3,

      },
      properties: {
        'altitude': [10000, 10000]
      }
    });

    // same line without alitutde
    // var line0 = new maptalks.LineString([
    //   [-0.131049, 1.498568],
    //   [-0.107049, 1.498568]
    // ], {
    //   symbol: {
    //     'lineColor': '#000',
    //     'lineDasharray': [10, 5, 5],
    //     'lineWidth': 3
    //   }
    // });

    // new maptalks.VectorLayer('vector2', [line], {
    //   enableAltitude: true, drawAltitude: {
    //     polygonFill: '#1bbc9b',
    //     polygonOpacity: 0.3,
    //     lineWidth: 0
    //   }
    // }).addTo(this.map);

  }
  createLine(points, altitude, color) {
    return new maptalks.LineString(points, {
      symbol: {
        lineColor: color,
        lineWidth: 3,
        polygonFill: color,

      },
      properties: {
        altitude: [altitude, altitude]
      }
    });
  }

  // map1() {
  //   var map = new maptalks.Map(this.mapRef.nativeElement, {
  //     center: [19.698999, 46.9173647],
  //     zoom: 20,
  //     pitch: 45,
  //     dragPitch: true,
  //     bearing: -40,
  //     //allow map to drag rotating, true by default
  //     dragRotate: true,
  //     //enable map to drag pitching and rotating at the same time, false by default
  //     dragRotatePitch: true,
  //     zoomControl: true, // add zoom control
  //     scaleControl: true, // add scale control
  //     // overviewControl: true, // add overview control
  //     baseLayer: new maptalks.TileLayer('base', {
  //       'urlTemplate': 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  //       'subdomains': ['a', 'b', 'c', 'd'],

  //     })
  //   });




  //   const posX = 19.698999 - 0.0009000;
  //   const posY = 46.9173647 - 0.0003600;
  //   const imgW = 0.00200;
  //   const imgH = 0.00140;
  //   var imageLayer = new maptalks.ImageLayer('images',
  //     [
  //       {
  //         url: './assets/map.png',
  //         extent: [posX, posY, posX + imgW, posY + imgH],
  //         opacity: 1
  //       },
  //     ]);

  //   map.addLayer(imageLayer);

  //   var center = map.getCenter();

  //   var rectangle = new maptalks.Rectangle([posX, posY], 30, 30, {
  //     symbol: {
  //       lineColor: '#34495e',
  //       lineWidth: 2,
  //       polygonFill: '#34495e',
  //       polygonOpacity: 0.4
  //     },
  //     properties: {
  //       altitude: 30
  //     }
  //   });
  //   var layer = new maptalks.VectorLayer('vector', { enableAltitude: true })
  //     .addGeometry([rectangle])
  //     .addTo(map);

  //   var shadowSymbol = {
  //     lineColor: '#bbb',
  //     lineDasharray: [10, 5, 5],
  //     lineWidth: 2,
  //     polygonFill: '#bbb',
  //     polygonOpacity: 0.4
  //   };
  //   var shadows = [];
  //   layer.forEach(function (geo) {
  //     shadows.push(geo.copy().setSymbol(shadowSymbol));
  //   });
  //   new maptalks.VectorLayer('shadows', shadows).addTo(map).bringToBack();




  //   map.on('click', function (param) {
  //     console.log(param.coordinate)
  //     // var infoDom = document.getElementById('info');
  //     // infoDom.innerHTML = '<div>' + new Date().toLocaleTimeString() +
  //     //   ': click map on ' + param.coordinate.toFixed(5).toArray().join() + '</div>' +
  //     //   infoDom.innerHTML;
  //   });
  // }
}
