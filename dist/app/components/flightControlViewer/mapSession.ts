import ISession from '@dronesense/core/lib/common/ISession';
import IDrone from '@dronesense/core/lib/common/IDrone';
import ServerConnection from './serverConnection';
import { MapDrone } from './mapDrone';
import { FlightControlViewerEventing } from './flightControlViewer';
import { MapMode } from './mapMode';
import { MapWaypoints } from './mapWaypoints';

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

    constructor(public $log: angular.ILogService) {
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
            
                this.mapDrone = new MapDrone(this.mapEntityCollection, this.$log);

                // Suspend entity events while adding all waypoints to map
                this.mapEntityCollection.entities.suspendEvents();

                this.mapDrone.initializeDrone(this.eventing, drones[0], this.map, this.color, false).then((mapDrone: MapDrone) => {
                    this.mapDrone = mapDrone;

                    // Initialize waypoints for guided mode
                    this.mapWaypoints = new MapWaypoints(this.mapDrone, this.map, this.color, this.id, this.mapEntityCollection, this.eventing, this.$log);

                    // Resume entity events after added
                    this.mapEntityCollection.entities.resumeEvents();

                    resolve(this);
                }).catch((error) => {
                    this.$log.error({ message: 'Error initializing drone.', error: error});
                });                
            }).catch((error) => {
                this.$log.error({ message: 'Error in getting drones.', error: error});
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

        } catch (error) {
            this.$log.error({ message: 'Error drawing flight path.', error: error});
        }
    }
}
