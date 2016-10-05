import { User, SensorCaptureCommand, Camera, GeoPoint, FlightPlan  } from '@dronesense/model';
import { Conversions } from '@dronesense/model/lib/common/Utility';
import commandHeader from '../../../components/commandHeader/commandHeader';
import formatter from '../../../components/formatters/infoFormatter';
import readableElevation from '../../../common/readableElevation';
import unitString from '../../../components/formatters/unitString';

import MapService from '../../../services/mapService';
import { IMapService } from '../../../services/mapService';

export interface ISensorCaptureInstance extends ng.IScope {

}

enum EditMode {
    AGL,
    MSL,
    GSD
}

// Represents a position in space to capture sensor data
class SensorCaptureInstance {

    // Enum to indicate what edit mode we are in.
    editMode: EditMode;

    // The waypoint command passed in
    command: SensorCaptureCommand;

    // Map instance passed in
    map: Cesium.Viewer;

    // User object allows us to modify presentation of data based on user settings
    user: User;

    // On delete callback
    onDelete: any;

    // Currently tracked entity passed in from command viewer
    trackedEntity: string;

    // Called to notify command viewer of a request for tracking
    onTrackEntity: any;

    // Camera object for sensor visualization
    camera: Camera;

    // Visual representation of command
    entity: Cesium.Entity;

    // Flag to indicate if command is being edited in map
    isEditing: boolean = false;

    // Editing handler reference
    editingHandler: Cesium.ScreenSpaceEventHandler;

    // All properties that can be edited in the command.
    flightSpeed: number;

    position: GeoPoint;

    altitude: number;

    altitudeMSL: number;

    heading: number;

    pitch: number;

    roll: number;

    gsd: number;

    flightPlan: FlightPlan;

    // Handle on blur property change
    UpdateAltitude(positionChanged: boolean): void {

        var groundElevationMSL: number;
        var groundElevationHAE: number;

        // If position changed we need to query the elevation service
        if (positionChanged) {

            // Make call to get elevation
            this.mapService.getElevation(this.position.lat, this.position.lng).then((terrainElevation: number): void => {

                groundElevationMSL = terrainElevation;
                groundElevationHAE = terrainElevation;

                this.UpdateDBAltitudes(groundElevationMSL, groundElevationHAE);

            });
        // no need to use elevation service if the position hasn't changed just use existing values
        } else {

            groundElevationMSL = this.command.GroundElevationMSL;
            groundElevationHAE = this.command.GroundElevationHAE;

            this.UpdateDBAltitudes(groundElevationMSL, groundElevationHAE);
        }

        this.drawSensor();
    }

    // There are three values here that need to change.  1) AltitudeAGL 2) AltitudeMSL and GSD
    // On is input and the other two are calculated.
    // First we need to figure out what mode we are in and calculate the other two.
    UpdateDBAltitudes(groundElevationMSL: number, groundElevationHAE: number): void {
        // If we are in AGL mode then altitudeMSL must be calculated

        switch (this.editMode) {

            // Set agl and calculate msl and gsd
            case EditMode.AGL:
                this.command.UpdateProperties({
                    Altitude: this.altitude,
                    GroundElevationMSL: groundElevationMSL,
                    GroundElevationHAE: groundElevationHAE,
                    AltitudeMSL: groundElevationMSL + this.altitude,
                    AltitudeHAE: groundElevationHAE + this.altitude,
                    GSD: this.camera.getGSD(this.altitude)
                });
            break;

            // Set MSL and calculate agl and gsd.
            case EditMode.MSL:
                this.command.UpdateProperties({
                    Altitude: this.altitudeMSL - this.command.GroundElevationMSL,
                    GroundElevationMSL: groundElevationMSL,
                    GroundElevationHAE: groundElevationHAE,
                    AltitudeMSL: this.altitudeMSL,
                    AltitudeHAE: this.altitudeMSL,
                    GSD: this.camera.getGSD(this.altitudeMSL - this.command.GroundElevationMSL)
                });
            break;

            // Set GSD and calculate agl and msl
            case EditMode.GSD:
                this.command.UpdateProperties({
                    Altitude: this.altitudeMSL - this.command.GroundElevationMSL,
                    GroundElevationMSL: groundElevationMSL,
                    GroundElevationHAE: groundElevationHAE,
                    AltitudeMSL: this.altitudeMSL,
                    AltitudeHAE: this.altitudeMSL,
                    GSD: this.gsd
                });
            break;

            default:
            break;
        }
    }

    UpdatePosition(): void {

        // Save property on model
        this.command.SaveProperty(this.position, 'Position');

        // Update new position altitude
        this.UpdateAltitude(true);

    }

    // Remove self from map then call viewer for removal
    Delete(): void {

        // Remove UI from map
        this.map.entities.remove(this.entity);

        // Clean up primitives from map
        if (this.map.scene.primitives.contains(this.sensor)) {
            this.map.scene.primitives.remove(this.sensor);
        }

        // Call parent delete function
        this.onDelete({commandId: this.command.handle.id });
    }

    // Fly camera to this command
    FlyTo(): void {
        this.map.flyTo(this.entity);
    }

    // Toggle visibility on map
    HideShow(): void {
        this.entity.show = !this.entity.show;
    }

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        'db',
        'mapService'
    ];

    constructor(public bindings: ISensorCaptureInstance,
                public db: any,
                public mapService: IMapService) {

        // Create copy for UI binding
        this.SetupViewData();

        // Add UI to map
        this.generateMapUI();

        // Listen for model changes
        this.command.on('propertyChanged', (propName: string, propValue: any) => {
            this.bindings.$applyAsync();
        });

        this.bindings.$on('$destroy', (): void => {

            // watchers are automatically destroyed

            // destruction code here
            this.user.off();

            this.command.off();

            // Clean up editing handler
            this.editingHandler.destroy();
        });

        // Update camera track changes
        this.bindings.$watch(() => { return this.trackedEntity; }, (newValue: string, oldValue: string): void => {

            this.trackedFlag = (this.entity.id === newValue);

        });

        // Update camera track changes
        this.bindings.$watch(() => { return this.camera; }, (newValue: Camera, oldValue: Camera): void => {

            this.drawSensor();

        });

        this.SetupEditingHandlers();

        // Set current edit mode based on the flight plan settings object.
        this.editMode = this.flightPlan.DefaultAltitudeMSL ? EditMode.MSL : EditMode.AGL;
    }

    // Bind two way fields that are also update
    SetupViewData(): void {

        this.flightSpeed = this.command.FlightSpeed;

        this.bindings.$watch(() => { return this.command.FlightSpeed; }, (newValue: number, oldValue: number) => {
            this.flightSpeed = this.command.FlightSpeed;
        });

        this.position = this.command.Position;

        this.bindings.$watch(() => { return this.command.Position; }, (newValue: GeoPoint, oldValue: GeoPoint) => {
            this.position = this.command.Position;
        });

        this.altitude = this.command.Altitude;

        this.bindings.$watch(() => { return this.command.Altitude; }, (newValue: number, oldValue: number) => {
            this.altitude = this.command.Altitude;
        });

        this.altitudeMSL = this.command.AltitudeMSL;

        this.bindings.$watch(() => { return this.command.AltitudeMSL; }, (newValue: number, oldValue: number) => {
            this.altitudeMSL = this.command.AltitudeMSL;
        });

        this.gsd = this.command.GSD;

        this.bindings.$watch(() => { return this.command.GSD; }, (newValue: number, oldValue: number) => {
            this.gsd = this.command.GSD;
        });

        this.heading = this.command.Heading;

        this.bindings.$watch(() => { return this.command.Heading; }, (newValue: number, oldValue: number) => {
            this.heading = this.command.Heading;
        });

        this.pitch = this.command.Pitch;

        this.bindings.$watch(() => { return this.command.Pitch; }, (newValue: number, oldValue: number) => {
            this.pitch = this.command.Pitch;
        });

        this.roll = this.command.Roll;

        this.bindings.$watch(() => { return this.command.Roll; }, (newValue: number, oldValue: number) => {
            this.roll = this.command.Roll;
        });
    }

    SetupEditingHandlers(): void {
        this.editingHandler = new Cesium.ScreenSpaceEventHandler(this.map.canvas);
    }

    EditMode(modeName: string): boolean {
        if (EditMode[this.editMode] === modeName) {
            return true;
        } else if (EditMode[this.editMode] === modeName) {
            return true;
        } else if (EditMode[this.editMode] === modeName) {
            return true;
        } else {
            return false;
        }
    }

    // Sensor object on map
    sensor: Cesium.RectangularSensor;

    drawSensor(): void {

        if (!this.camera) {
            return;
        }

        // check to see if exists on map
        if (this.map.scene.primitives.contains(this.sensor)) {
            this.map.scene.primitives.remove(this.sensor);
        }

        this.sensor = new Cesium.RectangularSensor();

        this.sensor.modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
            Cesium.Cartesian3.fromDegrees(this.position.lng, this.position.lat, this.altitudeMSL),
            Conversions.toRadians(this.heading),
            Conversions.toRadians(this.pitch),
            Conversions.toRadians(this.roll));

        // Figure out this calculation
        this.sensor.radius = 10000;
        this.sensor.xHalfAngle = this.camera.getHalfAngleX();
        this.sensor.yHalfAngle = this.camera.getHalfAngleY();
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

        this.sensor.lateralSurfaceMaterial = Cesium.Material.fromType('Grid', {
            // color : new Cesium.Color.fromBytes(7, 215, 68),
            // cellAlpha : 0.3,
            // lineCount : new Cesium.Cartesian2(11, 11),
            // lineThickness: new Cesium.Cartesian2(1.0, 1.0),
            // lineOffset: new Cesium.Cartesian2(0.0, 0.0)
        });
        //this.sensor.lateralSurfaceMaterial.color = new Cesium.Color(1, 1, 1, 0.7);
        //this.sensor.lateralSurfaceMaterial.uniforms.color = new Cesium.Color(1.0, 1.0, 1.0, 0.8);
        this.map.scene.primitives.add(this.sensor);
    }

    generateMapUI(): void {
        this.drawSensor();

        // create the svg image string
        var svgDataDeclare: string = 'data:image/svg+xml,';
        var svgCircle: string = '<path style="fill:#ffffff" d="M12,23.9L0.1,12L12,0.1L23.9,12L12,23.9z M4.4,12l7.6,7.6l7.6-7.6L12,4.4L4.4,12z"/>';
        var svgPrefix: string = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xml:space="preserve">';
        var svgSuffix: string = '</svg>';
        var svgString: string = svgPrefix + svgCircle + svgSuffix;

        // create the cesium entity
        var svgEntityImage: any = svgDataDeclare + svgString;

    //  var entity = viewer.entities.add({
    //      position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883, 10),
    //      billboard: {
    //          image: svgEntityImage
    //      }
    //  });

        this.entity = this.map.entities.add({
            name: this.command.Name,
            id: this.command.handle.id,
            polyline: {
                positions: new Cesium.CallbackProperty( (): any => {
                    return Cesium.Cartesian3.fromDegreesArrayHeights(
                        [this.position.lng, this.position.lat, this.command.GroundElevationHAE,
                            this.position.lng, this.position.lat, this.altitude + this.command.GroundElevationHAE]);
                }, false) ,
                width: 2,
                material: Cesium.Color.fromBytes(255, 255, 255, 255)
            },
            position: new Cesium.CallbackProperty( (): any => {
                return Cesium.Cartesian3.fromDegrees(this.position.lng, this.position.lat, this.altitude + this.command.GroundElevationHAE);
            }, false),
            billboard: {
                    image: svgEntityImage,
                    sizeInMeters : false
            }
            // point: {
            //     pixelSize: 10,
            //     color: Cesium.Color.fromBytes(255, 255, 255, 0),
            //     outlineColor: Cesium.Color.fromBytes(255, 255, 255, 255),
            //     outlineWidth: 2
            // }
        });
    }

    Edit(): void {
        if (this.isEditing) {
            this.isEditing = false;
            // Turn off editing and make appropriate updates

            this.editingHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
            this.editingHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
            this.editingHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        } else {
            // Turn on editing and wire up event listening

            this.isEditing = true;
            var dragging: any;

            // Wire up handler to listen for left mouse down event
            this.editingHandler.setInputAction( (click: any): void => {

                // Check to see what the mouse has selected
                var pickedObject: any = this.map.scene.pick(click.position);

                // Check to make sure we are only grabbing the entity we are editing
                if (Cesium.defined(pickedObject) && pickedObject.id === this.entity) {
                    dragging = pickedObject;

                    // Turn off rotation so we only move the entity
                    this.map.scene.screenSpaceCameraController.enableRotate = false;

                    // Turn off depth testing so we can see the feature around terrain
                    this.map.scene.globe.depthTestAgainstTerrain = false;
                }
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

            // Wire up handler to listen for left mouse up event
            this.editingHandler.setInputAction( (): void => {

                // Check if dragging entity is defined
                if (Cesium.defined(dragging)) {

                    // Reset to undefined
                    dragging = undefined;

                    // Renable rotation
                    this.map.scene.screenSpaceCameraController.enableRotate = true;

                    // Turn depth testing back on
                    this.map.scene.globe.depthTestAgainstTerrain = true;

                    this.UpdatePosition();
                }
            }, Cesium.ScreenSpaceEventType.LEFT_UP);

            // Wire up handler for each mouse move while entity is being dragged
            this.editingHandler.setInputAction( (movement: any): void => {

                // Return immediately if we are not dragging anything
                if (!dragging) {
                    return;
                }

                // Use ray pick to get position and convert
                var ray: any = this.map.camera.getPickRay(movement.endPosition);
                var position: any = this.map.scene.globe.pick(ray, this.map.scene);

                // Check to see if the position is defined
                if (!Cesium.defined(position) || !dragging) {
                    return;
                }

                var positionCartographic: any = this.map.scene.globe.ellipsoid.cartesianToCartographic(position);
                positionCartographic.height = 0;
                //position = this.map.scene.globe.ellipsoid.cartographicToCartesian(positionCartographic);

                //var cartographic: Cesium.Cartographic = Cesium.Cartographic.fromCartesian(position);
                var longitude: number = Conversions.formatCoordinate(Cesium.Math.toDegrees(positionCartographic.longitude), 8);
                var latitude: number = Conversions.formatCoordinate(Cesium.Math.toDegrees(positionCartographic.latitude), 8);

                this.position.lng = longitude;
                this.position.lat = latitude;

                this.bindings.$applyAsync();

            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }
    }

    trackedFlag: boolean = false;

    TrackEntity(): void {
        this.onTrackEntity({id: this.entity.id });
    }
}

// Register component with Angular
export default angular.module('DroneSense.Web.SensorCaptureInstance', [
    commandHeader.name,
    formatter.name,
    readableElevation.name,
    unitString.name,
    MapService.name
]).component('dsSensorCaptureInstance', {
    transclude: true,
    bindings: {
        command: '<',
        onCommandChange: '&',
        map: '<',
        user: '<',
        onDelete: '&',
        trackedEntity: '<',
        onTrackEntity: '&',
        camera: '<',
        flightPlan: '<'
    },
    controller: SensorCaptureInstance,
    templateUrl: './app/components/tools/sensorCaptureTool/sensorCaptureToolInstance.html'
});
