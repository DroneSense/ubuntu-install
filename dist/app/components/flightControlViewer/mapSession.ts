import ISession from '@dronesense/core/lib/common/ISession';
import IDrone from '@dronesense/core/lib/common/IDrone';
import ServerConnection from './serverConnection';
import { MapDrone } from './mapDrone';

import { IEventEmitter } from '@dronesense/core/lib/common/IEventEmitter';
import { FlightControlViewerEventing } from './FlightControlViewer';

import BackboneEvents from 'backbone-events-standalone';

import { MapMode } from './mapMode';
import { Conversions } from '@dronesense/model/lib/common/Utility';

export interface IMapSessionEvents extends IEventEmitter {
    on(eventName: string, callback?: Function, context?: any): any;
    on(eventName: 'locating-drone', callback?: (username: string) => void, context?: any): any;
}

import { IGuidedWaypoint } from '@dronesense/core/lib/common/entities/IGuidedWaypoint';

export class MapWaypoint {

    longitude: number;
    latitude: number;
    altitudeAGL: number;
    speed: number;
    name: string = 'A';
    time: number;
    distance: number;
    index: number;
    hae: number;
    reached: boolean = false;
    isActive: boolean = false;

    guidedWaypoint: IGuidedWaypoint;

    entity: Cesium.Entity;

    constructor(guidedWaypoint: IGuidedWaypoint, index: number, hae: number) {
        this.guidedWaypoint = guidedWaypoint;

        this.longitude = this.guidedWaypoint.longitude;
        this.latitude = this.guidedWaypoint.lattitude;
        this.altitudeAGL = this.guidedWaypoint.altitude;
        this.speed = this.guidedWaypoint.speed;
        this.name = this.guidedWaypoint.name;
        this.reached = this.guidedWaypoint.isReached;
        this.index = index;
        this.hae = hae;

    }

}

export class MapWaypoints {

    waypoints: Array<MapWaypoint> = [];

    currentWaypoint: MapWaypoint;

    currentIndex: number;

    drone: MapDrone;

    map: Cesium.Viewer;

    color: string;

    sessionId: string;

    // Container for all map UI related to this session
    mapEntityCollection: Cesium.CustomDataSource;

    constructor(drone: MapDrone, map: Cesium.Viewer, color: string, sesisonId: string, entityCollection: Cesium.CustomDataSource, public eventing: FlightControlViewerEventing) {
        this.drone = drone;
        this.map = map;
        this.color = color;
        this.sessionId = sesisonId;
        this.mapEntityCollection = entityCollection;

        this.startInterval();

        for (let index: number = 0; index < this.drone.drone.FlightController.Guided.Waypoints.length; index++) {
            let wp: IGuidedWaypoint = this.drone.drone.FlightController.Guided.Waypoints[index];

            this.getHAE(wp.lattitude, wp.longitude).then((height: number) => {
                
                let newWaypoint: MapWaypoint = new MapWaypoint(wp, index, height);

                this.waypoints.splice(index, 0, newWaypoint);

                this.addWaypointToMap(newWaypoint);

                if (!this.currentWaypoint) {
                    if (!newWaypoint.reached) {
                        this.currentWaypoint = newWaypoint;
                        this.currentIndex = index;
                    }
                }

            });
        }

        this.calculateTimeAndDistance();

        this.drone.drone.FlightController.Guided.on('waypoint-added', (wayPoint: IGuidedWaypoint, index: number) => {
            console.log('waypoint-added: ' + index + ':' + wayPoint);

            try {
                this.getHAE(wayPoint.lattitude, wayPoint.longitude).then((height: number) => {

                    this.waypoints.splice(index, 0, new MapWaypoint(wayPoint, index, height));

                    this.addWaypointToMap(this.waypoints[index]);

                    // Fix the animation clock
                    this.map.clock.currentTime = Cesium.JulianDate.now();

                    this.updateIndexes();

                });
            } catch (error) {
                console.log(error);
            }
        });

        this.drone.drone.FlightController.Guided.on('waypoint-removed', (index: number) => {
            console.log('waypoint-removed: ' + index);

            try {
                this.removeWaypointFromMap(this.waypoints[index].name);
                this.waypoints.splice(index, 1);
                this.updateIndexes();
            } catch (error) {
                console.log(error);
            }
        });
        
        this.drone.drone.FlightController.Guided.on('waypoints-changed', () => {
            console.log('waypoints-changed');
        });

        this.drone.drone.FlightController.Guided.on('waypoint-error', (index: number, error: any) => {
            console.log('waypoint-error: ' + index);

            try {
                if (this.waypoints[index]) {
                    this.eventing.trigger('waypoint-error', this.waypoints[index].name);
                }
            } catch (error) {
                console.log(error);
            }
        });

        this.drone.drone.FlightController.Guided.on('waypoint-started', (index: number) => {
            console.log('waypoint-started: ' + index);

            try {
                if (this.currentWaypoint) {
                    this.currentWaypoint.isActive = false;
                }

                this.currentWaypoint = this.waypoints[index];
                this.currentIndex = index;
                this.waypoints[index].isActive = true;
            } catch (error) {
                console.log(error);
            }
        });

        this.drone.drone.FlightController.Guided.on('waypoint-reached', (index: number) => {
            console.log('waypoint-reached: ' + index);

            try {
                this.waypoints[index].reached = true;
                this.waypoints[index].isActive = false;
                this.waypoints[index].entity.show = this.showHistoricalWaypoints;
            } catch (error) {
                console.log(error);
            }
        });
    }

    showHistoricalWaypoints: boolean = true;

    hideHistoryWaypoints(show: boolean): void {
        this.showHistoricalWaypoints = show;
        this.waypoints.forEach((waypoint: MapWaypoint) => {
            if (waypoint.reached) {
                waypoint.entity.show = show;
            }
        });
    }

    removeWaypointFromMap(name: string): void {
        this.mapEntityCollection.entities.removeById(this.sessionId + name);
    }

    updateIndexes(): void {
        this.waypoints.forEach((wp: MapWaypoint, index: number) => {
            wp.index = index;
        });
    }

    addWaypointToMap(waypoint: MapWaypoint): void {

        if (!waypoint) {
            return;
        }

        // create the svg image string
        let svgDataDeclare: string = 'data:image/svg+xml,';
        //var svgCircle: string = '<path style="fill:#ffffff" d="M12,23.9L0.1,12L12,0.1L23.9,12L12,23.9z M4.4,12l7.6,7.6l7.6-7.6L12,4.4L4.4,12z"/>';
        let svgCircle: string =
        `<defs>
            <rect id="path-1" x="6" y="6" width="25" height="25"></rect>
        </defs>
        <g id="Flight-Plan" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Rectangle-474" transform="translate(18.500000, 18.500000) rotate(-315.000000) translate(-18.500000, -18.500000) ">
                <use stroke="#FFFFFF" stroke-width="2" fill-opacity="0.5" fill="` + this.color + `" fill-rule="evenodd" xlink:href="#path-1"></use>
            </g>
            <text id="2" font-family="OpenSans" font-size="15" font-weight="500" fill="#FFFFFF">
                <tspan text-anchor="middle" x="18.5" y="24">` + waypoint.name + `</tspan>
            </text>
        </g>`;
        let svgPrefix: string = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 43 43" xml:space="preserve">';
        let svgSuffix: string = '</svg>';
        let svgString: string = svgPrefix + svgCircle + svgSuffix;

        // let newWaypoint: string =
        // `<svg width="35" height="35" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
        //     <g>
        //         <title>Layer 1</title>
        //         <g id="diamond">
        //             <rect id="svg_1" height="25" width="25" fill-opacity="0.5" fill="#0A92EA" transform="matrix(0.7071,-0.7071,0.7071,0.7071,-8.4939,20.5061) " y="4.006014" x="8.006292"/>
        //             <rect id="svg_2" height="25" width="25" stroke-miterlimit="10" stroke-width="2" stroke="#FFFFFF" fill="none" transform="matrix(0.7071,-0.7071,0.7071,0.7071,-8.4939,20.5061) " y="4.006012" x="8.006292"/>
        //         </g>
        //         <g stroke="null" id="number">
        //             <text stroke-width="0" stroke="null" font-weight="normal" font-style="normal" x="50%" y="50%" id="svg_3" font-size="15px" font-family="&#x27;OpenSans-Semibold'" fill="#FFFFFF" transform="matrix(1,0,0,0.9583181738853455,13.0693,25.413596181405495) ">` + waypoint.name + `</text>
        //         </g>
        //     </g>
        // </svg>`;

        // create the cesium entity
        let svgEntityImage: any = svgDataDeclare + svgString;

        waypoint.entity = this.mapEntityCollection.entities.add({
            name: waypoint.name,
            id: this.sessionId + waypoint.name,
            polyline: {
                // positions: new Cesium.CallbackProperty( (): any => {
                //     return Cesium.Cartesian3.fromDegreesArrayHeights(
                //         [waypoint.longitude, waypoint.latitude, waypoint.hae,
                //             waypoint.longitude, waypoint.latitude, waypoint.altitudeAGL + this.drone.homeHAE]);
                // }, false) ,
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(
                        [waypoint.longitude, waypoint.latitude, waypoint.hae,
                            waypoint.longitude, waypoint.latitude, waypoint.altitudeAGL + this.drone.homeHAE]),
                width: 2,
                followSurface: false,
                material: Cesium.Color.WHITE
            },
            // position: new Cesium.CallbackProperty( (): any => {
            //     return Cesium.Cartesian3.fromDegrees(waypoint.longitude, waypoint.latitude, waypoint.altitudeAGL + this.drone.homeHAE);
            // }, false),
            position: Cesium.Cartesian3.fromDegrees(waypoint.longitude, waypoint.latitude, waypoint.altitudeAGL + this.drone.homeHAE),
            billboard: {
                    image: svgEntityImage,
                    sizeInMeters : false,
                    width : 43,
                    height : 43,
                    pixelOffset: new Cesium.Cartesian2(3, 7),
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
        // this.mapEntityCollection.add({
        //     position: Cesium.Cartesian3.fromDegrees(waypoint.longitude, waypoint.latitude, 50),
        //     billboard: {
        //             image: svgEntityImage,
        //             sizeInMeters : false,
        //             width : 5,
        //             height : 5,
        //             pixelOffset: new Cesium.Cartesian2(3,7),
        //             verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
        //             heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        //     }
        // });

        // Wire up handler to listen for left click
        // this.editingHandler.setInputAction( (click: any): void => {

        //     // Check to see what the mouse has selected
        //     var pickedObject: any = this.map.scene.pick(click.position);

        //     // Check to make sure we are only grabbing the entity we are editing
        //     if (Cesium.defined(pickedObject) && pickedObject.id === this.entity) {
        //         console.log(pickedObject.id);
        //         this.ShowMenu();
        //     }
        // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    terrainProvider: any = new Cesium.CesiumTerrainProvider({
        url : 'https://www.cesiumcontent.com/api/terrain/world?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkMTM4ZDE2OS05NWYwLTQ0YmItOWY3YS0yNjEwOGE5Y2Y3NjYiLCJpZCI6NywiaWF0IjoxNDU1MjkyNzg5fQ.NDKlrwQZE_04ntDuL89hvatEmuycQo5llhtz3Mi6Wo0'
        //url: '//assets.agi.com/stk-terrain/world'
    });

    getHAE(latitude: number, longitude: number): Promise<number> {
                
        return new Promise<number>((resolve) => {

            var positions: Array<Cesium.Cartographic> = [
                Cesium.Cartographic.fromDegrees(longitude, latitude)
            ];

            try {

                // Get terrain height at click location before adding takeoff point
                Cesium.sampleTerrain(this.terrainProvider, 15, positions).then((updatedPositions: any): void => {
                    
                    resolve(updatedPositions[0].height);

                });
            } catch (error) {
                console.log(error);
            }

        });
    }

    // Variable for interval timer
    intervalTimer: any;

    startInterval(): void {

        this.intervalTimer = setInterval(() => {

            if (this.waypoints.length > 0 && this.currentWaypoint) {
                this.calculateTimeAndDistance();
            }

        }, 500);
    }

    // TODO: Refactor into loop
    calculateTimeAndDistance(): void {

        if (this.waypoints.length === 0) {
            return;
        }

        let currentTotal: number = 0;

        // first calculate distance from drone to next waypoint and set as distance for that waypoint
        currentTotal = this.currentWaypoint.distance = +(Conversions.distance2(this.drone.currentLat, this.drone.currentLng, this.currentWaypoint.latitude, this.currentWaypoint.longitude).toFixed());
        this.currentWaypoint.time = (this.currentWaypoint.distance / this.drone.drone.FlightController.Telemetry.Position.groundSpeed) * 1000;
        // second do same for the next 5 waypoints adding the previous total

        if (this.waypoints[this.currentIndex + 1]) {

            currentTotal += +(Conversions.distance2(this.currentWaypoint.latitude, this.currentWaypoint.longitude, this.waypoints[this.currentIndex + 1].latitude, this.waypoints[this.currentIndex + 1].longitude).toFixed(2));
            this.waypoints[this.currentIndex + 1].distance = +currentTotal.toFixed();
            this.waypoints[this.currentIndex + 1].time = (currentTotal / this.drone.drone.FlightController.Telemetry.Position.groundSpeed) * 1000;
        }

        if (this.waypoints[this.currentIndex + 2]) {

            currentTotal += +(Conversions.distance2(this.waypoints[this.currentIndex + 1].latitude, this.waypoints[this.currentIndex + 1].longitude, this.waypoints[this.currentIndex + 2].latitude, this.waypoints[this.currentIndex + 2].longitude).toFixed(2));
            this.waypoints[this.currentIndex + 2].distance = +currentTotal.toFixed();
            this.waypoints[this.currentIndex + 2].time = (currentTotal / this.drone.drone.FlightController.Telemetry.Position.groundSpeed) * 1000;
        }

        if (this.waypoints[this.currentIndex + 3]) {

            currentTotal += +(Conversions.distance2(this.waypoints[this.currentIndex + 2].latitude, this.waypoints[this.currentIndex + 2].longitude, this.waypoints[this.currentIndex + 3].latitude, this.waypoints[this.currentIndex + 3].longitude).toFixed(2));
            this.waypoints[this.currentIndex + 3].distance = +currentTotal.toFixed();
            this.waypoints[this.currentIndex + 3].time = (currentTotal / this.drone.drone.FlightController.Telemetry.Position.groundSpeed) * 1000;
        }

        if (this.waypoints[this.currentIndex + 4]) {

            currentTotal += +(Conversions.distance2(this.waypoints[this.currentIndex + 3].latitude, this.waypoints[this.currentIndex + 3].longitude, this.waypoints[this.currentIndex + 4].latitude, this.waypoints[this.currentIndex + 4].longitude).toFixed(2));
            this.waypoints[this.currentIndex + 4].distance = +currentTotal.toFixed();
            this.waypoints[this.currentIndex + 4].time = (currentTotal / this.drone.drone.FlightController.Telemetry.Position.groundSpeed) * 1000;
        }
    }
}

export class MapSession {

    // Map reference
    map: Cesium.Viewer;

    // Server session object
    session: ISession;

    // The current drone on the map
    mapDrone: MapDrone;

    // Server connection
    serverConnection: ServerConnection;

    // The selected mode of the map
    mapMode: MapMode = MapMode.ThreeDimensional;

    // Name of current session
    name: string;

    mapWaypoints: MapWaypoints;

    // Color to render map UI
    color: string;

    eventing: FlightControlViewerEventing;

    id: string;

    // Container for all map UI related to this session
    mapEntityCollection: Cesium.CustomDataSource;

    constructor() {
        this.mapEntityCollection = new Cesium.CustomDataSource;
    }

    initializeSession(eventing: FlightControlViewerEventing, session: ISession, serverConnection: ServerConnection, map: Cesium.Viewer, mapMode: MapMode): Promise<MapSession> {

        return new Promise<MapSession>((resolve) => {

            this.map = map;
            this.session = session;
            this.serverConnection = serverConnection;
            this.mapMode =  mapMode;
            this.name = this.session.Name;
            this.eventing = eventing;
            this.color = this.session.Color;
            this.id = this.session.Id;
            
            // WARNING BAD CODE (Robert made me do this!) - drone index 0 is hardcoded here
            this.session.getDrones().then((drones: Array<IDrone>) => {
            
                this.mapDrone = new MapDrone(this.mapEntityCollection);

                // Suspend entity events while adding all waypoints to map
                this.mapEntityCollection.entities.suspendEvents();

                this.mapDrone.initializeDrone(this.eventing, drones[0], this.map, this.color, false).then((mapDrone: MapDrone) => {
                    this.mapDrone = mapDrone;

                    // Initialize waypoints for guided mode
                    this.mapWaypoints = new MapWaypoints(this.mapDrone, this.map, this.color, this.id, this.mapEntityCollection, this.eventing);

                    // Resume entity events after added
                    this.mapEntityCollection.entities.resumeEvents();

                    resolve(this);
                });                
            });

        });

    }

    remove(): void {
        // This will remove everyting in the collection associated with this session
        this.mapEntityCollection.entities.removeAll();
    }

    drawFlightPath(): void {
        try {
            this.mapEntityCollection.entities.add({
                name: 'Flight Path',
                polyline: {
                    // TODO - move to static property and manually trigger the redraw for trigger changes.
                    positions: new Cesium.CallbackProperty( (): any => {

                        //console.log('command viewer property callback');

                        var degreesArray: Array<Cesium.Cartesian3> = [];

                        // this.commands.forEach((command: Command): void => {
                        //     degreesArray.push(Cesium.Cartesian3.fromDegrees((<WaypointCommand>command).Position.lng, (<WaypointCommand>command).Position.lat, (<WaypointCommand>command).AltitudeHAE));
                        // });

                        return degreesArray;

                    }, false),
                    width: 2,
                    material: Cesium.Color.fromCssColorString(this.color)
                }//,
                // wall: {
                //     positions: new Cesium.CallbackProperty( (): any => {

                //         var degreesArray: Array<Cesium.Cartesian3> = [];

                //         this.commands.forEach((command: Command): void => {
                //             degreesArray.push(Cesium.Cartesian3.fromDegrees((<WaypointCommand>command).Position.lng, (<WaypointCommand>command).Position.lat, (<WaypointCommand>command).AltitudeHAE));
                //         });

                //         return degreesArray;

                //     }, false) ,
                //     material: Cesium.Color.fromBytes(10, 146, 234, 100)
                // }
            });

        } catch (exception) {
            console.log(exception);
        }
    }
}

BackboneEvents.mixin(MapSession.prototype);

// Represents
export class OwnerMapSession extends MapSession implements IMapSessionEvents {

    // Backbone events    
    on: (eventName: string, callback?: Function, context?: any) => any;
    once: (events: string, callback: Function, context?: any) => any;
    off: (eventName?: string, callback?: Function, context?: any) => any;
    protected trigger: (eventName: string, ...args: any[]) => any;

    // Flag to indicate whether the user created the session allowing all guests without
    // prompting for permission
    allowAllGuestsWithoutPrompt: boolean = false;

    // Auto start recording on takeoff
    startRecording: boolean;

    // List of guests that are connected
    connectedGuests: Array<string> = [];

    constructor() {
        super();
    }

    initializeOwnerSession(eventing: FlightControlViewerEventing, session: ISession, serverConnection: ServerConnection, map: Cesium.Viewer, mapMode: MapMode, allowAllGuestsWithoutPrompt: boolean, startRecording: boolean): Promise<OwnerMapSession> {

        return new Promise<OwnerMapSession>((resolve) => {

            this.map = map;
            this.session = session;
            this.serverConnection = serverConnection;
            this.mapMode =  mapMode;
            this.name = this.session.Name;
            this.eventing = eventing;
            this.allowAllGuestsWithoutPrompt = allowAllGuestsWithoutPrompt;
            this.color = this.session.Color;
            this.id = this.session.Id;
            this.startRecording = startRecording;
            
            // WARNING BAD CODE (Robert made me do this!) - drone index 0 is hardcoded here
            this.session.getDrones().then((drones: Array<IDrone>) => {
            
                this.mapDrone = new MapDrone(this.mapEntityCollection);

                this.mapDrone.initializeDrone(this.eventing, drones[0], this.map, this.color, true).then((mapDrone: MapDrone) => {
                    this.mapDrone = mapDrone;

                    this.setupEvents();

                    // Initialize waypoints for guided mode
                    this.mapWaypoints = new MapWaypoints(this.mapDrone, this.map, this.color, this.id, this.mapEntityCollection, this.eventing);

                    resolve(this);
                });                
            });

        });

    }

    setupEvents(): void {

        this.session.on('slave-connected', (username: string) => {
            
            // Add username
            this.connectedGuests.push(username);

        });

        this.session.on('slave-disconnected', (username: string) => {

            // Remove username
            _.remove<string>(this.connectedGuests, (name: string) => {
                return username.toLowerCase() === name.toLowerCase() ? true : false;
            });

        });

        // Wire up slave connection request
        this.session.on('slave-requesting-connection', (username: string, cb: (accepted: boolean) => { }) => {
            
            // check allow all guests flag and return true and exit
            if (this.allowAllGuestsWithoutPrompt) {
                cb(true);
                return;
            }

            this.eventing.trigger('guest-connect-request', username, cb);
            
        });

    }

    remove(): void {
        // First call remove on the drone
        this.mapDrone.remove();

        this.session.off('slave-connected');

        this.session.off('slave-disconnected');

        this.session.off('slave-requesting-connection');
    }
}
