import { cloneDeep, isEqual } from "lodash";
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { AdminoScreenElement } from "../admino-screen-element";
import { ScreenElementChange } from "../../admino-screen.interfaces";
import { deepCompare } from "admino/src/lib/utils/deepcompare";
declare var maptalks: any;
declare var THREE: any;

interface LayerData {
  id: string;
  layer: any;
  objectDatas: ObjectData[];
}

interface ObjectData {
  id: string;
  object?: any;
  currentConfig: any;
}

@Component({
  selector: "admino-newmap",
  templateUrl: "./newmap.component.html",
  styleUrls: ["./newmap.component.scss"],
})
export class NewmapComponent extends AdminoScreenElement
  implements OnInit, AfterViewInit {
  @ViewChild("mapRef", { static: true, read: ElementRef }) mapRef: ElementRef;
  map;
  layerDatas: LayerData[] = [];

  onChange(changes: { [id: string]: ScreenElementChange }) {
    console.log("CHANGE", changes);
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
      // console.log(changes.layers);
      // console.log(deepCompare(changes.layers.old, changes.layers.new, null, true))

      this.redrawLayers();
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
          const layerData = { id: layerConfig.id, layer, objectDatas: [] };
          this.layerDatas.push(layerData);
          if (layer) {
            this.redrawObjects(layerData, layerConfig);
          }
        });
      } else {
        this.redrawObjects(existingLayerData, layerConfig);
      }
    }
  }

  createLayer(layerConfig) {
    return new Promise((resolve) => {
      let layer = null;
      if (layerConfig.type === "ImageLayer") {
        layer = new maptalks.ImageLayer(layerConfig.id, []);
        layer.addTo(this.map);

        resolve(layer);
      } else if (layerConfig.type === "ThreeLayer") {
        layer = new maptalks.ThreeLayer(layerConfig.id, {
          forceRenderOnMoving: true,
          forceRenderOnRotating: true,
          // animation: true
        });
        layer.prepareToDraw = (gl, scene, camera) => {
          const light = new THREE.DirectionalLight(0xffffff);
          light.position.set(0, -50, 10).normalize();
          scene.add(light);
          const light2 = new THREE.AmbientLight(0xffffff);
          scene.add(light2);
          // addBars(scene);
          layer.config("animation", true);
          resolve(layer);
        };
        layer.addTo(this.map);
      } else if (layerConfig.type === "VectorLayer") {
        layer = new maptalks.VectorLayer(layerConfig.id);
        layer.addTo(this.map);
        resolve(layer);
      }
    });
  }
  redrawObjects(layerData: LayerData, layerConfig) {
    const layer = layerData.layer;
    const objectDatas = layerData.objectDatas;

    if (layerConfig.type === "ImageLayer") {
      layerData.objectDatas = layerConfig.objects;
      layer.setImages(layerData.objectDatas);
      return;
    }

    for (const objData of objectDatas) {
      const existing = layerConfig.objects.find((objConfig) => {
        return objData.id === objConfig.id;
      });
      if (!existing) {
        // CLEAN UP

        // this.layer.removeLayer(layer.layer);
        if (layerConfig.type === "ThreeLayer") {
          layer.removeMesh(objData.object);
        }
        objectDatas.splice(objectDatas.indexOf(objData), 1);
      }
    }

    for (const objConfig of layerConfig.objects) {
      const existing = objectDatas.find((obj) => {
        return objConfig.id === obj.id;
      });
      if (!existing) {
        let objectData: ObjectData = {
          id: objConfig.id,
          currentConfig: cloneDeep(objConfig),
        };
        // CREATE
        if (layerConfig.type === "ThreeLayer") {
          // objConfig.color = this.directive.ts.getColor(objConfig.color);
          const mesh = this.draw3dObject(objConfig, layer);
          layer.addMesh(mesh);
          objectData.object = mesh;
        }

        layerData.objectDatas.push(objectData);
      } else {
        // MODIFY
        if (!isEqual(objConfig, existing.currentConfig)) {
          if (layerConfig.type === "ThreeLayer") {
            layer.removeMesh(existing.object);
            const mesh = this.draw3dObject(objConfig, layer);
            layer.addMesh(mesh);
            existing.object = mesh;
          }
        } else {
        }
      }
    }
  }

  draw3dObject(objConfig, threeLayer) {
    let mesh;
    const material = new THREE.MeshPhongMaterial({
      color: objConfig.color === "undefined" ? "#ff0000" : objConfig.color,
      transparent: true,
      //  blending: THREE.AdditiveBlending,
      opacity: objConfig.opacity === "undefined" ? 1 : objConfig.opacity,
      // wireframe: true
    });

    if (objConfig.type === "polygon") {
      const rectangle = new maptalks.Polygon([objConfig.points], {
        symbol: {
          lineColor: objConfig.color,
          lineWidth: 2,
          polygonFill: objConfig.color,
          polygonOpacity: objConfig.opacity,
        },
        properties: {
          altitude: objConfig.height,
        },
      });
      mesh = threeLayer.toExtrudePolygon(
        rectangle,
        {
          height: objConfig.height,
          topColor: "#ff",
          altitude: objConfig.altitude,
        },
        material
      );
      // tooltip test
    } else if (objConfig.type === "geometry") {
      // const geometry = new THREE.SphereGeometry(5, 32, 32);
      const geometry = new THREE[objConfig.class](...objConfig.config);
      const sphere = new THREE.Mesh(geometry, material);

      mesh = threeLayer.toModel(sphere, {
        coordinate: objConfig.coordinate,
        altitude: objConfig.altitude,
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
        cssName: "maptalks-tooltip",
      });
    }

    return mesh;
  }

  createMap() {
    this.map = new maptalks.Map(this.mapRef.nativeElement, {
      center:
        this.element.center !== undefined ? this.element.center : [0.5, 0.5],
      zoom: this.element.zoom !== undefined ? this.element.zoom : 10,
      pitch: this.element.pitch !== undefined ? this.element.pitch : 60,
      bearing: this.element.bearing !== undefined ? this.element.bearing : -40,

      fog: false,

      dragPitch: true,
      //allow map to drag rotating, true by default
      dragRotate: true,
      //enable map to drag pitching and rotating at the same time, false by default
      dragRotatePitch: true,
      zoomControl: true, // add zoom control
      scaleControl: true, // add scale control
      // overviewControl: true, // add overview control
      // baseLayer: imageLayer,
    });

    //   const layer = new maptalks.VectorLayer('vector').addTo(this.map);

    //   var drawTool = new maptalks.DrawTool({
    //     mode: 'Polygon'
    //   }).addTo(this.map);

    //   drawTool.on('drawend', function (param) {
    //     console.log(param.geometry);
    //     param.geometry.on('click mouseover', ((e) => {
    //       console.log(e)
    //       e.target.updateSymbol({
    //         'markerFill': '#f00'
    //       });
    //       e.domEvent.preventDefault();
    //       e.domEvent.stopPropagation();
    //       e.domEvent.stopImmediatePropagation();
    //     }));

    //     layer.addGeometry(param.geometry);
    //   });
  }
}
