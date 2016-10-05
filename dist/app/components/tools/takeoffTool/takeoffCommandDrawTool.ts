import { IDrawTool } from '../IDrawTool';
import { Conversions } from '@dronesense/model/lib/common/Utility';
import { GeoPoint } from '@dronesense/model'

export class TakeoffCommandDrawTool implements IDrawTool {

    map: Cesium.Viewer;
    _mouseHandler: Cesium.ScreenSpaceEventHandler;

    IconPath: string = './app/components/tools/takeoffTool/images/takeoff.svg';
    ToolTip: string = 'Add Takeoff';
    Selected: boolean;

    constructor(viwer: Cesium.Viewer, public callback: Function) {
        this.map = viwer;
    }

    StartEdit(): void {

        // Check if tool is already turned on if so turn off
        if (this.Selected) {
            this.StopEdit();
            return;
        }

        this.Selected = true;

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

                        //this._viewer.entities.add({
                        //    name: 'Takeoff',
                        //    //polyline: {
                        //    //    positions: Cesium.Cartesian3.fromDegreesArrayHeights(
                        //    //        [longitudeString, latitudeString, updatedPositions[0].height,
                        //    //            longitudeString, latitudeString, updatedPositions[0].height + 100]),
                        //    //    width: 10,
                        //    //    material: new Cesium.PolylineGlowMaterialProperty({
                        //    //        glowPower: 0.1,
                        //    //        color: Cesium.Color.fromBytes(242, 101, 34, 255)
                        //    //    })
                        //    //},
                        //    position: Cesium.Cartesian3.fromDegrees(longitudeString, latitudeString, updatedPositions[0].height),
                        //    point: {
                        //        pixelSize: 10,
                        //        color: Cesium.Color.YELLOW
                        //    }
                        //});

                        //console.log(updatedPositions);
                        //console.log(positions[0]);
                        //this.create3DModel('/components/cesiumMap/models/freedom.glb', longitudeString, latitudeString, updatedPositions[0].height);

                        var takeoffCommand: Object = {
                            Position: new GeoPoint(latitudeString, longitudeString),
                            Altitude: 50,
                            GroundElevationMSL: updatedPositions[0].height,
                            GroundElevationHAE: updatedPositions[0].height,
                            AltitudeMSL: updatedPositions[0].height + 50,
                            AltitudeHAE: updatedPositions[0].height + 50,
                            ClimbSpeed: 5,
                            FlightSpeed: 5,
                            Name: 'Takeoff',
                            Type: 'Takeoff',
                            Expanded: true
                        };

                        this.callback(takeoffCommand);
                    });

                    this.StopEdit();
                }
            },
            Cesium.ScreenSpaceEventType.LEFT_CLICK
        );
    }

    StopEdit(): void {
        this._mouseHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.Selected = false;
    }
}
