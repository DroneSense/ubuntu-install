import { IDrawTool } from '../IDrawTool';
import { GeoPoint, FlightPlan } from '@dronesense/model';
import { Conversions } from '@dronesense/model/lib/common/Utility';

export class WaypointCommandDrawTool implements IDrawTool {

    _mouseHandler: Cesium.ScreenSpaceEventHandler;

    IconPath: string = './app/components/tools/waypointTool/images/waypoint.svg';
    ToolTip: string = 'Add Waypoint';
    Selected: boolean;

    constructor(public map: Cesium.Viewer, public callback: Function, public flightPlan: FlightPlan) {

    }

    StartEdit(): void {

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
                        //url: 'https://www.cesiumcontent.com/api/terrain/world?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkMTM4ZDE2OS05NWYwLTQ0YmItOWY3YS0yNjEwOGE5Y2Y3NjYiLCJpZCI6NywiaWF0IjoxNDU1MjkyNzg5fQ.NDKlrwQZE_04ntDuL89hvatEmuycQo5llhtz3Mi6Wo0'
                        url: '//assets.agi.com/stk-terrain/world'
                    });
                    var positions: Array<Cesium.Cartographic> = [
                        Cesium.Cartographic.fromDegrees(longitudeString, latitudeString)
                    ];

                    // Get terrain height at click location before adding takeoff point
                    Cesium.sampleTerrain(terrainProvider, 15, positions).then((updatedPositions: any): void => {

                        var waypointCommand: Object;

                        if (this.flightPlan.DefaultAltitudeMSL && (this.flightPlan.DefaultWaypointAltitude - updatedPositions[0].height) > updatedPositions[0].height) {
                            waypointCommand = {
                                Position: new GeoPoint(latitudeString, longitudeString),
                                Altitude: this.flightPlan.DefaultWaypointAltitude - updatedPositions[0].height,
                                GroundElevationMSL: updatedPositions[0].height,
                                GroundElevationHAE: updatedPositions[0].height,
                                AltitudeMSL: this.flightPlan.DefaultWaypointAltitude,
                                AltitudeHAE: this.flightPlan.DefaultWaypointAltitude,
                                FlightSpeed: this.flightPlan.DefaultFlightSpeed,
                                Name: 'Waypoint',
                                Type: 'waypoint',
                                Expanded: true
                        };
                        } else {
                            waypointCommand = {
                                Position: new GeoPoint(latitudeString, longitudeString),
                                Altitude: this.flightPlan.DefaultWaypointAltitude,
                                GroundElevationMSL: updatedPositions[0].height,
                                GroundElevationHAE: updatedPositions[0].height,
                                AltitudeMSL: updatedPositions[0].height + this.flightPlan.DefaultWaypointAltitude,
                                AltitudeHAE: updatedPositions[0].height + this.flightPlan.DefaultWaypointAltitude,
                                FlightSpeed: this.flightPlan.DefaultFlightSpeed,
                                Name: 'Waypoint',
                                Type: 'waypoint',
                                Expanded: true
                            };
                        }

                        this.callback(waypointCommand);
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
