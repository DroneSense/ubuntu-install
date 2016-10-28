import { MapWaypoint } from './mapWaypoint';
import { MapDrone } from './mapDrone';
import { IGuidedWaypoint } from '@dronesense/core/lib/common/entities/IGuidedWaypoint';
import { FlightControlViewerEventing } from './flightControlViewer';
import { Conversions } from '@dronesense/model/lib/common/Utility';

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

    constructor(drone: MapDrone, map: Cesium.Viewer, color: string, sesisonId: string, entityCollection: Cesium.CustomDataSource, public eventing: FlightControlViewerEventing,
        public $log: angular.ILogService) {
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

            this.$log.log({ message: 'Waypoint Added', index: index, waypoint: wayPoint});

            try {
                this.getHAE(wayPoint.lattitude, wayPoint.longitude).then((height: number) => {

                    this.waypoints.splice(index, 0, new MapWaypoint(wayPoint, index, height));

                    this.addWaypointToMap(this.waypoints[index]);

                    // Fix the animation clock
                    this.map.clock.currentTime = Cesium.JulianDate.now();

                    this.updateIndexes();

                });
            } catch (error) {
                this.$log.error({ message: 'Error getting hae for waypoint and adding to map handler.', error: error });
            }
        });

        this.drone.drone.FlightController.Guided.on('waypoint-removed', (index: number) => {

            try {
                this.$log.log({ message: 'Waypoint Removed', index: index, name: this.waypoints[index].name});
                this.removeWaypointFromMap(this.waypoints[index].name);
                this.waypoints.splice(index, 1);
                this.updateIndexes();
            } catch (error) {
                 this.$log.error({ message: 'Error removing waypoint handler.', error: error });
            }
        });
        
        this.drone.drone.FlightController.Guided.on('waypoints-changed', () => {
            this.$log.log({ message: 'Waypoint Changed' });
        });

        this.drone.drone.FlightController.Guided.on('waypoint-error', (index: number, error: any) => {

            try {
                this.$log.error({ message: 'Waypoint Error', index: index, name: this.waypoints[index].name, error: error});

                if (this.waypoints[index]) {
                    this.eventing.trigger('waypoint-error', this.waypoints[index].name);
                }
            } catch (error) {
                this.$log.error({ message: 'Error in waypoint error handler.', error: error });
            }
        });

        this.drone.drone.FlightController.Guided.on('waypoint-started', (index: number) => {

            try {
                this.$log.log({ message: 'Waypoint Started', index: index, name: this.waypoints[index].name });

                if (this.currentWaypoint) {
                    this.currentWaypoint.isActive = false;
                }

                this.currentWaypoint = this.waypoints[index];
                this.currentIndex = index;
                this.waypoints[index].isActive = true;
            } catch (error) {
                this.$log.error({ message: 'Error in starting waypoint handler.', error: error });
            }
        });

        this.drone.drone.FlightController.Guided.on('waypoint-reached', (index: number) => {

            try {
                this.$log.log({ message: 'Waypoint Reached', index: index, name: this.waypoints[index].name });

                this.waypoints[index].reached = true;
                this.waypoints[index].isActive = false;
                this.waypoints[index].entity.show = this.showHistoricalWaypoints;
            } catch (error) {
                this.$log.error({ message: 'Error in waypoing reached handler.', error: error });
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

        try {

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

        } catch (error) {
            this.$log.error({ message: 'Error in adding waypoint to map code.', error: error });
        }
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
                this.$log.error({ message: 'Error in getting waypoing HAE', error: error });
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

        try {
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
        } catch (error) {
            this.$log.error({ message: 'calculate time and distance function', error: error });
        }
    }
}
