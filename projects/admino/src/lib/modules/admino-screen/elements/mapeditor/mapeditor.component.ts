import { cloneDeep, isEqual } from 'lodash';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { AdminoScreenElement } from '../admino-screen-element';
import { ScreenElementChange } from '../../admino-screen.interfaces';
declare var maptalks: any;
declare var THREE: any;
interface LayerData {
  id: string; layer: any; objectDatas: ObjectData[];
}

interface ObjectData {
  id: string; object?: any; currentConfig: any;
  listenerFunction?: any;
}


@Component({
  selector: 'admino-mapeditor',
  templateUrl: './mapeditor.component.html',
  styleUrls: ['./mapeditor.component.scss']
})
export class MapeditorComponent extends AdminoScreenElement implements OnInit {
  @ViewChild('mapRef', { static: true, read: ElementRef }) mapRef: ElementRef;
  map;
  layerDatas: LayerData[] = [];

  editedGeometry = null;
  drawTool;
  isDrawing = false;
  forcedDrawEnd = false;

  @HostListener('document:dblclick') dblClick() {

  }



  onChange(changes: { [id: string]: ScreenElementChange; }) {
    console.log('CHANGE', changes);
    // console.log(changes)
    if (changes.pitch) {
      this.map.setPitch(changes.pitch.new);
    }
    if (changes.bearing) {
      this.map.setBearing(changes.bearing.new);
    }
    if (changes.zoom) {
      this.map.setZoom(changes.zoom.new);
    }
    if (changes.center) {
      this.map.setCenter(changes.center.new);
    }
    // this.threeLayer.renderScene();
    if (changes.layers) {
      // console.log(deepCompare(changes.layers.old, changes.layers.new, null, true))
      this.redrawLayers();

    }


    if (changes._startEdit) {
      const split = changes._startEdit.new.split('.');
      const layerId = split[0];
      const objId = split[1];
      const foundLayer = this.layerDatas.find((layerData) => {
        return layerData.id === layerId;
      });

      if (foundLayer) {
        const foundObj = foundLayer.objectDatas.find((objData) => {
          return objData.id === objId;
        })
        if (foundObj) {
          if (this.editedGeometry) {
            this.editedGeometry.endEdit();
          }
          foundObj.object.startEdit();
          this.editedGeometry = foundObj.object;
        }
      }
    }
  }


  ngOnInit() {
    this.createMap();

  }
  ngAfterViewInit() {
    this.redrawLayers();
  }

  redrawLayers() {

    // Delete not existing layers
    for (const layer of this.layerDatas) {
      const existing = this.element.layers.find((layerConfig) => {
        return layer.id === layerConfig.id;
      });
      if (!existing) {
        this.map.removeLayer(layer.layer);
        this.layerDatas.splice(this.layerDatas.indexOf(layer), 1);
      }
    }

    // Create layers
    for (const layerConfig of this.element.layers) {
      const existingLayerData = this.layerDatas.find((layer) => {
        return layer.id === layerConfig.id;
      });
      if (!existingLayerData) {
        this.createLayer(layerConfig).then((layer: any) => {
          const layerData = { id: layerConfig.id, layer, objectDatas: [], };
          this.layerDatas.push(layerData);
          if (layer) {
            this.redrawObjects(layerData, layerConfig);

          }
        });

      } else {

        this.redrawObjects(existingLayerData, layerConfig);
      }
    }

    if (this.drawTool) {
      this.drawTool.addTo(this.map);
    }

  }

  createLayer(layerConfig) {
    return new Promise((resolve) => {

      let layer = null;
      if (layerConfig.type === 'ImageLayer') {
        layer = new maptalks.ImageLayer(layerConfig.id,
          []);
        layer.addTo(this.map);

        resolve(layer);
      } else if (layerConfig.type === 'ThreeLayer') {

        layer = new maptalks.ThreeLayer(layerConfig.id, {
          forceRenderOnMoving: true,
          forceRenderOnRotating: true
          // animation: true
        });
        layer.prepareToDraw = (gl, scene, camera) => {

          const light = new THREE.DirectionalLight(0xffffff);
          light.position.set(0, -50, 10).normalize();
          scene.add(light);
          const light2 = new THREE.AmbientLight(0xffffff);
          scene.add(light2);
          // addBars(scene);
          layer.config('animation', true);
          resolve(layer);

        };
        layer.addTo(this.map);

      } else if (layerConfig.type === 'VectorLayer') {
        layer = new maptalks.VectorLayer(layerConfig.id, { enableAltitude: layerConfig.enableAltitude });
        layer.addTo(this.map);
        resolve(layer);

      }
    });
  }
  redrawObjects(layerData: LayerData, layerConfig) {

    const layer = layerData.layer;
    const objectDatas = layerData.objectDatas;

    if (layerConfig.type === 'ImageLayer') {
      layerData.objectDatas = layerConfig.objects;
      layer.setImages(layerData.objectDatas);
      return;
    }

    for (const objData of objectDatas) {
      const existingConfig = layerConfig.objects.find((objConfig) => {
        return objData.id === objConfig.id;
      });
      if (!existingConfig) {
        // CLEAN UP

        // this.layer.removeLayer(layer.layer);
        if (layerConfig.type === 'ThreeLayer') {
          layer.removeMesh(objData.object);
        }
        if (layerConfig.type === 'VectorLayer') {
          this.removeVectorObject(objData)
        }
        objectDatas.splice(objectDatas.indexOf(objData), 1);
      }
    }

    for (const objConfig of layerConfig.objects) {
      const existing = objectDatas.find((obj) => {
        return objConfig.id === obj.id;
      });
      if (!existing) {
        const objectData: ObjectData = { id: objConfig.id, currentConfig: cloneDeep(objConfig) };
        // CREATE
        if (layerConfig.type === 'ThreeLayer') {

          // objConfig.color = this.directive.ts.getColor(objConfig.color);
          const mesh = this.draw3dObject(objConfig, layer);
          layer.addMesh(mesh);
          objectData.object = mesh;
        } else if (layerConfig.type === 'VectorLayer') {
          const vector = this.drawVectorObject(objConfig, objectData);
          vector.addTo(layer);
          objectData.object = vector;
          // objectData.object.startEdit();
        }

        layerData.objectDatas.push(objectData);

      } else {
        // MODIFY
        if (!isEqual(objConfig, existing.currentConfig)) {
          if (layerConfig.type === 'ThreeLayer') {
            layer.removeMesh(existing.object);
            const mesh = this.draw3dObject(objConfig, layer);
            layer.addMesh(mesh);
            existing.object = mesh;
          }

          if (layerConfig.type === 'VectorLayer') {
            this.removeVectorObject(existing);
            const vector = this.drawVectorObject(objConfig, existing);
            vector.addTo(layer);
            existing.object = vector;
          }
        } else {
        }
      }
    }
  }

  removeVectorObject(objConfig) {
    if (objConfig.listenerFunction) {
      objConfig.object.off('click dblclick shapechange editstart editend', objConfig.listenerFunction);
    }
    objConfig.object.remove();
    if (this.editedGeometry && objConfig.id === this.editedGeometry.getId()) {
      this.editedGeometry = null;
    }

  }


  drawVectorObject(objConfig, objectData) {
    const obj = new maptalks.Polygon(objConfig.coordinates, {
      properties: {
        altitude: objConfig.altitude,
      },
      id: objConfig.id,
      draggable: false,
      editable: true,
      dragShadow: false,
      symbol: [
        {
          polygonFill: objConfig.fillColor,
          polygonOpacity: objConfig.opacity,
          lineColor: objConfig.lineColor,
          lineWidth: objConfig.lineWidth
        },
        {
          textName: '{count}',
          textSize: 40,
          textFill: '#fff'
        }
      ]
    });
    if (objConfig.tooltip) {
      const tooltip = new maptalks.ui.ToolTip(objConfig.tooltip, {
        showTimeout: 0,
        eventsPropagation: true,
        dx: 10,
        cssName: 'maptalks-tooltip'
      });
      tooltip.addTo(obj);
    }
    objectData.listenerFunction = (param) => {
      if (param.type === 'dblclick') {
        if (this.editedGeometry === param.target) {
          param.target.endEdit();
        }
        //  else {
        //   param.target.startEdit();
        //   this.editedGeometry = param.target;
        // }
      }

      if (param.type === 'editend') {
        this.control.setValue({ id: param.target.getId(), coordinates: param.target.getCoordinates() });
        this.handleAction(this.getAction('objectUpdate'));
        this.drawTool.enable();
        // console.log("EDIT END")
      }
      if (param.type === 'editstart') {
        this.drawTool.disable();
        this.handleAction(this.getAction('objectSelect'));

      }
      // param.target.undoEdit();

      if (param.type === 'click') {

        if (!this.isDrawing) {
          this.drawTool.disable();
          if (this.editedGeometry !== param.target) {
            if (this.editedGeometry) {
              this.editedGeometry.endEdit();
            }
            param.target.startEdit();
            this.editedGeometry = param.target;
          }
        }

      }

      if (param.domEvent && !this.isDrawing) {
        param.domEvent.preventDefault();
        param.domEvent.stopPropagation();
      }
    };
    obj.on('click dblclick shapechange editstart editend', objectData.listenerFunction);

    return obj;
  }


  draw3dObject(objConfig, threeLayer) {
    let mesh;
    const material = new THREE.MeshPhongMaterial({
      color: objConfig.color === 'undefined' ? '#ff0000' : objConfig.color,
      transparent: true,
      //  blending: THREE.AdditiveBlending,
      opacity: objConfig.opacity === 'undefined' ? 1 : objConfig.opacity,
      // wireframe: true
    });

    if (objConfig.type === 'polygon') {

      const rectangle = new maptalks.Polygon([
        objConfig.coordinates
      ], {
        symbol: {
          lineColor: objConfig.color,
          lineWidth: 2,
          polygonFill: objConfig.color,
          polygonOpacity: objConfig.opacity
        },
        properties: {
          altitude: objConfig.height
        }
      });
      mesh = threeLayer.toExtrudePolygon(rectangle, {
        height: objConfig.height,
        topColor: '#ff',
        altitude: objConfig.altitude,
      }, material);
      // tooltip test

    } else if (objConfig.type === 'geometry') {
      // const geometry = new THREE.SphereGeometry(5, 32, 32);
      const geometry = new THREE[objConfig.class](...objConfig.config);
      const sphere = new THREE.Mesh(geometry, material);

      mesh = threeLayer.toModel(sphere, {
        coordinate: objConfig.coordinate,
        altitude: objConfig.altitude
      });

    }

    if (objConfig.scale) {
      Object.assign(mesh.object3d.scale, objConfig.scale);
    }

    if (objConfig.rotation) {
      Object.assign(mesh.object3d.rotation, objConfig.rotation);
    }

    if (objConfig.tooltip) {
      mesh.setToolTip(objConfig.tooltip, {
        showTimeout: 0,
        eventsPropagation: true,
        dx: 10,
        cssName: 'maptalks-tooltip'
      });
    }

    return mesh;
  }





  createMap() {

    this.map = new maptalks.Map(this.mapRef.nativeElement, {
      center: this.element.center !== undefined ? this.element.center : [0.5, 0.5],
      zoom: this.element.zoom !== undefined ? this.element.zoom : 10,
      pitch: this.element.pitch !== undefined ? this.element.pitch : 0,
      bearing: this.element.bearing !== undefined ? this.element.bearing : 0,

      fog: false,

      dragPitch: true,
      // allow map to drag rotating, true by default
      dragRotate: true,
      // enable map to drag pitching and rotating at the same time, false by default
      dragRotatePitch: false,
      zoomControl: true, // add zoom control
      scaleControl: true, // add scale control
      // overviewControl: true, // add overview control
      // baseLayer: imageLayer,
      doubleClickZoom: false
    });



    // const layer = new maptalks.VectorLayer('drawing').addTo(this.map).bringToBack();

    this.drawTool = new maptalks.DrawTool({
      mode: 'Polygon',
      symbol: {
        polygonFill: '#ff0000',
        lineColor: '#ff0000',
        lineWidth: 2,
        polygonOpacity: 0.3,
        lineDasharray: [2, 2]

      },
    }).addTo(this.map);



    this.map.on('dblclick contextmenu', (params) => {
      if (params.type === 'dblclick') {
        if (this.editedGeometry) {
          this.editedGeometry.endEdit();
          this.editedGeometry = null;

        } else {
          this.drawTool.enable();
        }
      } else if (params.type === 'contextmenu') {
        if (this.drawTool) {
          this.forcedDrawEnd = true;
          this.drawTool.endDraw();
        }
      }


    });

    this.drawTool.on('drawend drawstart', (param) => {

      if (param.type === 'drawend') {

        if (!this.forcedDrawEnd) {

          this.control.setValue({ coordinates: param.geometry.getCoordinates() });
          this.handleAction(this.getAction('objectAdd'));
        }
        this.forcedDrawEnd = false;

        // console.log(param.geometry);
        // param.geometry.on('click mouseover', ((e) => {
        //   console.log(e)
        //   e.target.updateSymbol({
        //     'markerFill': '#f00'
        //   });
        //   e.domEvent.preventDefault();
        //   e.domEvent.stopPropagation();
        //   e.domEvent.stopImmediatePropagation();
        // }));

        // layer.addGeometry(param.geometry);
        // console.log("drawEnd");
        // this.drawTool.disable();
        // setTimeout((params) => {
        this.isDrawing = false;
        // })
      } else {
        this.isDrawing = true;


      }
    });



  }




}
