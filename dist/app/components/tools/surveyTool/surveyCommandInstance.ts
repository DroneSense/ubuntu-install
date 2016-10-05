import { User, GeoPoint } from '@dronesense/model';
import { Conversions } from '@dronesense/model/lib/common/Utility';

export interface ISurveyCommandInstance extends ng.IScope {
    //command: SurveyCommand;
    user: User;
    trackedEntity: string;
    onTrackEntity: any;
}

class SurveyCommandInstance {

    // The waypoint command passed in
    //command: SurveyCommand;

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

    // Visual representation of command
    entity: Cesium.Entity;

    // Flag to indicate if command is being edited in map
    isEditing: boolean = false;

    // Editing handler reference
    editingHandler: Cesium.ScreenSpaceEventHandler;

    flightSpeed: number;

    position: GeoPoint;

    altitude: number;

    // Handle on blur property change
    UpdateAltitude(): void {

        // Setup terrain provider
        var terrainProvider: any = new Cesium.CesiumTerrainProvider({
            url: 'https://www.cesiumcontent.com/api/terrain/world?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkMTM4ZDE2OS05NWYwLTQ0YmItOWY3YS0yNjEwOGE5Y2Y3NjYiLCJpZCI6NywiaWF0IjoxNDU1MjkyNzg5fQ.NDKlrwQZE_04ntDuL89hvatEmuycQo5llhtz3Mi6Wo0'
        });

        // Create positions object for terrain query
        var positions: Array<Cesium.Cartographic> = [
            Cesium.Cartographic.fromDegrees(this.position.lng, this.position.lat)
        ];

        // Call async sampleTerrain TODO - This will fail if we don't have the terrain tile either from the server or in cache
        // TODO - Move this to common function
        Cesium.sampleTerrain(terrainProvider, 15, positions).then((updatedPositions: any): void => {

            // Save property on model
            // this.command.UpdateProperties({
            //     Altitude: this.altitude,
            //     GroundElevationMSL: updatedPositions[0].height,
            //     GroundElevationHAE: updatedPositions[0].height,
            //     AltitudeMSL: updatedPositions[0].height + this.altitude,
            //     AltitudeHAE: updatedPositions[0].height + this.altitude
            // });
        });
    }

    UpdatePosition(): void {

        // Save property on model
        //this.command.SaveProperty(this.position, 'Position');

        this.UpdateAltitude();

    }

    // Remove self from map then call viewer for removal
    Delete(): void {

        // Remove UI from map
        this.map.entities.remove(this.entity);

        // Call parent delete function
        //this.onDelete({commandId: this.command.id });
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
        'db'
    ];

    constructor(public bindings: ISurveyCommandInstance,
                public db: any) {

        // Create copy for UI binding
        this.SetupViewData();

        // Add UI to map
        this.generateMapUI();

        // Listen for model changes
        // this.command.ModelUpdated.on((type: string): void => {

        //     this.bindings.$applyAsync();
        // });

        this.bindings.$on('$destroy', (): void => {

            // watchers are automatically destroyed

            // destruction code here
            // this.user.ModelUpdated.off((): void => {
            // });

            // this.command.ModelUpdated.off((): void => {
            // });

            // Clean up editing handler
            this.editingHandler.destroy();
        });

        // Update camera track changes
        this.bindings.$watch(() => { return this.trackedEntity; }, (newValue: string, oldValue: string): void => {

            this.trackedFlag = (this.entity.id === newValue);

        });

        this.SetupEditingHandlers();
    }

    // Bind two way fields that are also update
    SetupViewData(): void {

        // this.flightSpeed = this.command.Speed;

        // this.bindings.$watch(() => { return this.command.Speed; }, (newValue: number, oldValue: number) => {
        //     this.flightSpeed = this.command.Speed;
        // });

        // // this.position = this.command.Position;

        // // this.bindings.$watch(() => { return this.command.Position; }, (newValue: number, oldValue: number) => {
        // //     this.position = this.command.Position;
        // // });

        // this.altitude = this.command.Altitude;

        // this.bindings.$watch(() => { return this.command.Altitude; }, (newValue: number, oldValue: number) => {
        //     this.altitude = this.command.Altitude;
        // });

    }

    SetupEditingHandlers(): void {
        this.editingHandler = new Cesium.ScreenSpaceEventHandler(this.map.canvas);
    }

    generateMapUI(): void {
        // this.entity = this.map.entities.add({
        //     name: this.command.Name,
        //     id: this.command.id,
        //     polyline: {
        //         positions: new Cesium.CallbackProperty( (): any => {
        //             return Cesium.Cartesian3.fromDegreesArrayHeights(
        //                 [this.position.lng, this.position.lat, this.command.GroundElevationHAE,
        //                     this.position.lng, this.position.lat, this.altitude + this.command.GroundElevationHAE]);
        //         }, false) ,
        //         width: 10,
        //         material: new Cesium.PolylineGlowMaterialProperty({
        //             glowPower: 0.1,
        //             color: Cesium.Color.fromBytes(242, 101, 34, 255)
        //         })
        //     },
        //     position: new Cesium.CallbackProperty( (): any => {
        //         return Cesium.Cartesian3.fromDegrees(this.position.lng, this.position.lat, this.altitude + this.command.GroundElevationHAE);
        //     }, false) ,
        //     point: {
        //         pixelSize: 10,
        //         color: Cesium.Color.fromBytes(242, 101, 34, 255)
        //     }
        // });
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
                position = this.map.scene.globe.ellipsoid.cartographicToCartesian(positionCartographic);

                var cartographic: Cesium.Cartographic = Cesium.Cartographic.fromCartesian(position);
                var longitude: number = Conversions.formatCoordinate(Cesium.Math.toDegrees(cartographic.longitude), 8);
                var latitude: number = Conversions.formatCoordinate(Cesium.Math.toDegrees(cartographic.latitude), 8);

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
export default angular.module('DroneSense.Web.SurveyCommandInstance', [

]).component('dsSurveyCommandInstance', {
    transclude: true,
    bindings: {
        command: '<',
        onCommandChange: '&',
        map: '<',
        user: '<',
        onDelete: '&',
        trackedEntity: '<',
        onTrackEntity: '&'
    },
    controller: SurveyCommandInstance,
    templateUrl: './app/components/tools/surveyTool/surveyCommandInstance.html'
});
