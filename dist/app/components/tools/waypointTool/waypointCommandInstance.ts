import { Conversions } from '@dronesense/model/lib/common/Utility';
import { User, WaypointCommand, Camera, GeoPoint } from '@dronesense/model';

import commandHeader from '../../../components/commandHeader/commandHeader';
import formatter from '../../../components/formatters/infoFormatter';
import readableElevation from '../../../common/readableElevation';
import unitString from '../../../components/formatters/unitString';

import MapService from '../../../services/mapService';
import { IMapService } from '../../../services/mapService';

export interface IWaypointCommandInstance extends ng.IScope {
    command: WaypointCommand;
    user: User;
    trackedEntity: string;
    onTrackEntity: any;
}

export class WaypointCommandInstance {

    // The waypoint command passed in
    command: WaypointCommand;

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

    isAGLAltitudeMode: boolean;

    flightSpeed: number;

    position: GeoPoint;

    altitude: number;

    altitudeMSL: number;

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
    }

    UpdateDBAltitudes(groundElevationMSL: number, groundElevationHAE: number): void {
        // If we are in AGL mode then altitudeMSL must be calculated
        if (this.isAGLAltitudeMode) {
            this.command.UpdateProperties({
                Altitude: this.altitude,
                GroundElevationMSL: groundElevationMSL,
                GroundElevationHAE: groundElevationHAE,
                AltitudeMSL: groundElevationMSL + this.altitude,
                AltitudeHAE: groundElevationHAE + this.altitude
            });
        } else {
            this.command.UpdateProperties({
                Altitude: this.altitudeMSL - this.command.GroundElevationMSL,
                GroundElevationMSL: groundElevationMSL,
                GroundElevationHAE: groundElevationHAE,
                AltitudeMSL: this.altitudeMSL,
                AltitudeHAE: this.altitudeMSL
            });
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

    constructor(public bindings: IWaypointCommandInstance,
                public db: any,
                public mapService: IMapService) {


        this.SetupEditingHandlers();

        // Create copy for UI binding
        this.SetupViewData();

        // Add UI to map
        this.generateMapUI();

        // Listen for model changes
        this.command.on('propertyChanged', (name: string, value: any): void => {

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

        //this.isAGLAltitudeMode = !this.settings.PlanningAltitudeMSL;
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
    }

    SetupEditingHandlers(): void {
        this.editingHandler = new Cesium.ScreenSpaceEventHandler(this.map.canvas);
    }

    getWaypointSVG(index: number): string {
        return '';
    }

    generateMapUI(): void {

            // create the svg image string
            var svgDataDeclare: string = 'data:image/svg+xml,';
            //var svgCircle: string = '<path style="fill:#ffffff" d="M12,23.9L0.1,12L12,0.1L23.9,12L12,23.9z M4.4,12l7.6,7.6l7.6-7.6L12,4.4L4.4,12z"/>';
            var svgCircle: string =
            `<defs>
                <rect id="path-1" x="6" y="6" width="25" height="25"></rect>
            </defs>
            <g id="Flight-Plan" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Rectangle-474" transform="translate(18.500000, 18.500000) rotate(-315.000000) translate(-18.500000, -18.500000) ">
                <use stroke="#FFFFFF" stroke-width="2" fill-opacity="0.5" fill="#0A92EA" fill-rule="evenodd" xlink:href="#path-1"></use>
                </g>
                <text id="2" font-family="OpenSans-Extrabold, Open Sans" font-size="15" font-weight="600" fill="#FFFFFF">
                <tspan text-anchor="middle" x="18.5" y="24">` + this.command.Order + `</tspan>
                </text>
            </g>`;
            var svgPrefix: string = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 43 43" xml:space="preserve">';
            var svgSuffix: string = '</svg>';
            var svgString: string = svgPrefix + svgCircle + svgSuffix;

            var newWaypoint: string =
            `<svg width="35" height="35" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
                <g>
                    <title>Layer 1</title>
                    <g id="diamond">
                        <rect id="svg_1" height="25" width="25" fill-opacity="0.5" fill="#0A92EA" transform="matrix(0.7071,-0.7071,0.7071,0.7071,-8.4939,20.5061) " y="4.006014" x="8.006292"/>
                        <rect id="svg_2" height="25" width="25" stroke-miterlimit="10" stroke-width="2" stroke="#FFFFFF" fill="none" transform="matrix(0.7071,-0.7071,0.7071,0.7071,-8.4939,20.5061) " y="4.006012" x="8.006292"/>
                    </g>
                    <g stroke="null" id="number">
                        <text stroke-width="0" stroke="null" font-weight="normal" font-style="normal" x="50%" y="50%" id="svg_3" font-size="15px" font-family="&#x27;OpenSans-Semibold'" fill="#FFFFFF" transform="matrix(1,0,0,0.9583181738853455,13.0693,25.413596181405495) ">` + this.command.Order + `</text>
                    </g>
                </g>
            </svg>`;

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
                    sizeInMeters : false,
                    width : 43,
                    height : 43,
                    pixelOffset: new Cesium.Cartesian2(3,7),
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
            }
            // point: {
            //     pixelSize: 10,
            //     color: Cesium.Color.fromBytes(255, 255, 255, 0),
            //     outlineColor: Cesium.Color.fromBytes(255, 255, 255, 255),
            //     outlineWidth: 2
            // }
        });

        // Add bottom triangle to waypoint line
        //  TODO - Track this entity so it can be removed later
        this.map.entities.add({
            position: new Cesium.CallbackProperty( (): any => {
                return Cesium.Cartesian3.fromDegrees(this.position.lng, this.position.lat, this.command.GroundElevationHAE);
            }, false),
            billboard: {
                    image: svgEntityImage,
                    sizeInMeters : false,
                    width : 5,
                    height : 5,
                    pixelOffset: new Cesium.Cartesian2(3,7),
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
            }
        });

        // Wire up handler to listen for left click
        this.editingHandler.setInputAction( (click: any): void => {

            // Check to see what the mouse has selected
            var pickedObject: any = this.map.scene.pick(click.position);

            // Check to make sure we are only grabbing the entity we are editing
            if (Cesium.defined(pickedObject) && pickedObject.id === this.entity) {
                console.log(pickedObject.id);
                this.ShowMenu();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    }

    ShowMenu(): void {

            var svgMenuString: string =
            `<svg version="1.1" id="contextMenu" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                    y="0px" viewBox="0 0 110.8 93.7" enable-background="new 0 0 110.8 93.7" xml:space="preserve">
                <style>
                    .foo:hover {
                        fill: #eee;
                    }
                </style>
                <g id="map" transform="translate(385.000000, 90.000000)">
                    <g id="waypoints" transform="translate(7.000000, 59.000000)">
                        <g id="waypoint" transform="translate(165.000000, 363.000000)">
                            <g id="context-menu">
                                <g id="Page-1" opacity="0.9">
                                    <path class="foo" id="Fill-1" fill="#FFFFFF" d="M-501.7-480c6,0,11.5,2.3,15.7,6l22.6-22.6c-9.9-9.5-23.4-15.4-38.3-15.4
                                        s-28.3,5.9-38.3,15.4l22.6,22.6C-513.2-477.7-507.7-480-501.7-480"/>
                                    <path id="Fill-3" fill="#FFFFFF" d="M-461.6-494.9l-22.6,22.6c3.7,4.1,6,9.6,6,15.7c0,6-2.3,11.5-6,15.7l22.6,22.6
                                        c9.5-9.9,15.4-23.4,15.4-38.3C-446.2-471.5-452.1-484.9-461.6-494.9"/>
                                    <path id="Fill-6" fill="#FFFFFF" d="M-519-472.3l-22.6-22.6c-9.5,9.9-15.4,23.4-15.4,38.3s5.9,28.3,15.4,38.3L-519-441
                                        c-3.7-4.1-6-9.6-6-15.7S-522.7-468.2-519-472.3z"/>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
                <g>
                    <path fill="#0A92EA" d="M16.5,53.4c-0.3,0-0.6,0.1-0.8,0.2c-0.5,0.2-0.9,0.6-1.1,1.1c-0.2,0.5-0.2,1.1,0,1.6
                        c0.3,0.8,1.1,1.3,1.9,1.3c0.3,0,0.6-0.1,0.8-0.2c0.5-0.2,0.9-0.6,1.1-1.1c0.2-0.5,0.2-1.1,0-1.6C18.1,53.9,17.3,53.4,16.5,53.4z"/>
                    <path fill="#0A92EA" d="M23.9,57l-1-1c0-0.1,0-0.1,0-0.2c0-0.3,0-0.6,0-1l1-1.1c0.1-0.1,0.1-0.2,0.1-0.3c-0.1-0.4-0.2-0.8-0.4-1.2
                        c-0.1-0.3-0.3-0.5-0.4-0.8c-0.1-0.1-0.2-0.1-0.3-0.1l-1.4,0c-0.3-0.4-0.6-0.7-1-1l0-1.5c0-0.1-0.1-0.2-0.1-0.3
                        c-0.6-0.3-1.2-0.6-1.9-0.8c-0.1,0-0.2,0-0.3,0.1l-1,1c-0.1,0-0.1,0-0.2,0c-0.4,0-0.8,0-1.2,0l-1.1-1c-0.1-0.1-0.2-0.1-0.3-0.1
                        c-0.3,0.1-0.7,0.2-1,0.3c-0.3,0.1-0.6,0.3-0.9,0.5c-0.1,0.1-0.1,0.2-0.1,0.3l0,1.5c-0.3,0.3-0.6,0.6-0.9,1l-1.5,0
                        c-0.1,0-0.2,0.1-0.3,0.2c-0.3,0.6-0.6,1.3-0.7,1.9c0,0.1,0,0.2,0.1,0.3l1.2,1.1c0,0.4,0,0.8,0,1.1l-1.1,1.1
                        c-0.1,0.1-0.1,0.2-0.1,0.3c0.1,0.3,0.2,0.6,0.3,0.9c0.2,0.4,0.4,0.7,0.6,1.1c0.1,0.1,0.1,0.1,0.3,0.1l1.6,0
                        c0.2,0.2,0.4,0.5,0.7,0.7l0,1.6c0,0.1,0.1,0.2,0.2,0.3c0.7,0.4,1.4,0.6,2.1,0.8c0,0,0,0,0.1,0c0.1,0,0.2,0,0.2-0.1l1.1-1.2
                        c0.3,0,0.6,0,0.9,0l1.1,1.1c0.1,0.1,0.2,0.1,0.3,0.1c0.4-0.1,0.7-0.2,1.1-0.4c0.3-0.1,0.7-0.3,1-0.5c0.1-0.1,0.1-0.2,0.1-0.3l0-1.5
                        c0.2-0.2,0.5-0.4,0.7-0.7l1.5,0c0.1,0,0.2-0.1,0.3-0.1c0.4-0.6,0.7-1.3,0.8-2.1C24,57.2,24,57.1,23.9,57z M20.7,57.1
                        c-0.4,1.1-1.3,2-2.4,2.5c-0.6,0.2-1.2,0.4-1.8,0.4c-1.8,0-3.5-1.1-4.2-2.7c-0.5-1.1-0.5-2.4-0.1-3.5c0.4-1.1,1.3-2,2.4-2.5
                        c0.6-0.3,1.2-0.4,1.8-0.4c1.8,0,3.5,1.1,4.2,2.7C21.2,54.8,21.2,56,20.7,57.1z"/>
                </g>
                <g>
                    <ellipse fill="#0A92EA" cx="55" cy="18.4" rx="2.2" ry="2.2"/>
                    <path fill="#0A92EA" d="M57.8,13.4v-2.1H52v2.1h-4.9v10.1h15.7V13.4H57.8z M55,22.3c-2.1,0-3.8-1.7-3.8-3.8s1.7-3.8,3.8-3.8
                        c2.1,0,3.8,1.7,3.8,3.8S57.1,22.3,55,22.3z"/>
                </g>
                <polygon fill="#0A92EA" points="95.7,49 95.7,48 92.4,48 92.4,49 88.1,49 88.1,50.3 100.1,50.3 100.1,49 "/>
                <path fill="#0A92EA" d="M89.2,63h9.7V51.3h-9.7V63z M95.9,53h1v8.3h-1V53z M93.6,53h1v8.3h-1V53z M91.2,53h1v8.3h-1V53z"/>
            </svg>`;

            // HTMLDivElement
            var menuContainer: any = document.createElement('div');
            menuContainer.innerHTML = svgMenuString;

            this.map.container.appendChild(menuContainer);
            menuContainer.style.display = 'none';
            menuContainer.style.position = 'absolute';
            menuContainer.style.top = '0';
            menuContainer.style.left = '0';
            menuContainer.style.width = '120px';
            menuContainer.style.height = '93px';
            menuContainer.style['pointer-events'] = 'none'; //Disable mouse interaction

            //The geolocation that we want to the element t olive.
            var anchor: Cesium.Cartesian3 = Cesium.Cartesian3.fromDegrees(this.position.lng, this.position.lat, this.altitude + this.command.GroundElevationHAE);

            //Every frame, figure out if the geolocation is on the screen
            //and move the element accordingly.
            var tmp: Cesium.Cartesian2 = new Cesium.Cartesian2();
            this.map.scene.preRender.addEventListener(() => {
                var result = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.map.scene, anchor, tmp);
                if(Cesium.defined(result)) {
                    menuContainer.style.display = 'block';
                    menuContainer.style.top = tmp.y + 12 + 'px';
                    menuContainer.style.left = tmp.x + 5 + 'px';
                } else {
                    menuContainer.style.display = 'none';
                }
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
export default angular.module('DroneSense.Web.Tools.WaypointCommandInstance', [
    commandHeader.name,
    formatter.name,
    readableElevation.name,
    unitString.name,
    MapService.name
]).component('dsWaypointCommandInstance', {
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
        settings: '<'
    },
    controller: WaypointCommandInstance,
    templateUrl: './app/components/tools/waypointTool/waypointCommandInstance.html'
});

