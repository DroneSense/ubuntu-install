import { IDrawTool } from '../IDrawTool';

import { Camera, GeoPoint, FlightPlan } from '@dronesense/model';
import { Conversions } from '@dronesense/model/lib/common/Utility';

export class SensorCaptureTool implements IDrawTool {

    IconPath: string = './app/components/tools/sensorCaptureTool/images/sensorCapture.svg';
    ToolTip: string = 'Add Sensor Capture Location';
    Selected: boolean;

    // Editing handler reference
    _mouseHandler: Cesium.ScreenSpaceEventHandler;

    constructor(public map: Cesium.Viewer, public callback: Function, public flightPlan: FlightPlan) {

    }

    sensor: Cesium.RectangularSensor;

    UpdateSensor(lng: number, lat: number, alt: number): void {

        if (!this.flightPlan.Camera) {
            return;
        }

        // check to see if exists on map
        if (this.map.scene.primitives.contains(this.sensor)) {
            this.map.scene.primitives.remove(this.sensor);
        }

        this.sensor = new Cesium.RectangularSensor();

        this.sensor.modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(Cesium.Cartesian3.fromDegrees(lng, lat, alt), 0, -3.14159, 0);

        // Figure out this calculation
        this.sensor.radius = 10000;
        this.sensor.xHalfAngle = this.flightPlan.Camera.getHalfAngleX();
        this.sensor.yHalfAngle = this.flightPlan.Camera.getHalfAngleY();
        this.sensor.showIntersection = true;


        // var material = new Cesium.GridMaterialProperty({
        //     color : Cesium.Color.WHITE,
        //     cellAlpha : 0.1,
        //     lineCount : new Cesium.Cartesian2(8, 8),
        //     lineThickness: new Cesium.Cartesian2(1.0, 1.0),
        //     lineOffset: new Cesium.Cartesian2(0.0, 0.0)
        // });

        //var material: Cesium.GridMaterialProperty = new Cesium.GridMaterialProperty();

        //this.sensor.lateralSurfaceMaterial = material;

        this.sensor.lateralSurfaceMaterial = Cesium.Material.fromType('Grid');
        this.sensor.lateralSurfaceMaterial.color = new Cesium.Color(0.0, 1.0, 1.0, 0.7);
        //this.sensor.lateralSurfaceMaterial.uniforms.color = new Cesium.Color(0.0, 1.0, 1.0, 0.5);
        this.map.scene.primitives.add(this.sensor);
    }

    dragging: boolean = false;

    StartEdit(): void {
        if (this.Selected) {
            this.StopEdit();
            return;
        }

        this.Selected = true;

        this.dragging = true;

        // wire up left mouse click event
        this._mouseHandler = new Cesium.ScreenSpaceEventHandler(this.map.canvas, false);

        this._mouseHandler.setInputAction((click: any) => {
                var ray: any = this.map.camera.getPickRay(click.position);
                var position: any = this.map.scene.globe.pick(ray, this.map.scene);
                console.log(position);
                if (Cesium.defined(position)) {
                    // Make the height of the position = 0 so it works with groundPrimitive
                    var positionCartographic: Cesium.Cartographic = this.map.scene.globe.ellipsoid.cartesianToCartographic(position);
                    positionCartographic.height = 0;
                    //position = this.map.scene.globe.ellipsoid.cartographicToCartesian(positionCartographic);

                    //var cartographic: Cesium.Cartographic = Cesium.Cartographic.fromCartesian(position);
                    var longitudeString: number = Conversions.formatCoordinate(Cesium.Math.toDegrees(positionCartographic.longitude), 8);
                    var latitudeString: number = Conversions.formatCoordinate(Cesium.Math.toDegrees(positionCartographic.latitude), 8);

                    var terrainProvider: any = new Cesium.CesiumTerrainProvider({
                        url: 'https://www.cesiumcontent.com/api/terrain/world?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkMTM4ZDE2OS05NWYwLTQ0YmItOWY3YS0yNjEwOGE5Y2Y3NjYiLCJpZCI6NywiaWF0IjoxNDU1MjkyNzg5fQ.NDKlrwQZE_04ntDuL89hvatEmuycQo5llhtz3Mi6Wo0'
                    });
                    var positions: Array<Cesium.Cartographic> = [
                        Cesium.Cartographic.fromDegrees(longitudeString, latitudeString)
                    ];

                    // Get terrain height at click location before adding takeoff point
                    Cesium.sampleTerrain(terrainProvider, 15, positions).then((updatedPositions: any): void => {

                        var surveyCaptureCommand: Object = {
                            Position: new GeoPoint(latitudeString, longitudeString),
                            Altitude: 50,
                            GroundElevationMSL: updatedPositions[0].height,
                            GroundElevationHAE: updatedPositions[0].height,
                            AltitudeMSL: updatedPositions[0].height + 50,
                            AltitudeHAE: updatedPositions[0].height + 50,
                            FlightSpeed: 5,
                            Name: 'Sensor Capture Point',
                            Type: 'sensor',
                            Expanded: true,
                            Heading: 0,
                            Pitch: -180,
                            Roll: 0
                        };

                        this.callback(surveyCaptureCommand);
                    });

                    // check to see if exists on map
                    if (this.map.scene.primitives.contains(this.sensor)) {
                        this.map.scene.primitives.remove(this.sensor);
                    }

                    this.StopEdit();
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK
        );

        // Wire up handler for each mouse move while entity is being dragged
        this._mouseHandler.setInputAction( (movement: any): void => {

            console.log(this.dragging);

            // Return immediately if we are not dragging anything
            if (!this.dragging) {
                return;
            }

            // Use ray pick to get position and convert
            var ray: any = this.map.camera.getPickRay(movement.endPosition);
            var position: any = this.map.scene.globe.pick(ray, this.map.scene);

            // Check to see if the position is defined
            if (!Cesium.defined(position) || !this.dragging) {
                return;
            }

            var positionCartographic: any = this.map.scene.globe.ellipsoid.cartesianToCartographic(position);
            positionCartographic.height = 0;
            //position = this.map.scene.globe.ellipsoid.cartographicToCartesian(positionCartographic);

            //var cartographic: Cesium.Cartographic = Cesium.Cartographic.fromCartesian(position);
            var longitude: number = Conversions.formatCoordinate(Cesium.Math.toDegrees(positionCartographic.longitude), 8);
            var latitude: number = Conversions.formatCoordinate(Cesium.Math.toDegrees(positionCartographic.latitude), 8);

            this.UpdateSensor(longitude, latitude, 200);

        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    StopEdit(): void {
        this._mouseHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this._mouseHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.Selected = false;
    }
}
