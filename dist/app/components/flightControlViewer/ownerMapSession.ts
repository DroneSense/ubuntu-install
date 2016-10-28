import ISession from '@dronesense/core/lib/common/ISession';
import IDrone from '@dronesense/core/lib/common/IDrone';
import ServerConnection from './serverConnection';
import { MapDrone } from './mapDrone';
import { FlightControlViewerEventing } from './flightControlViewer';
import { MapMode } from './mapMode';
import { MapWaypoints } from './mapWaypoints';
import { MapSession } from './mapSession';

// Represents
export class OwnerMapSession extends MapSession {

    // Flag to indicate whether the user created the session allowing all guests without
    // prompting for permission
    allowAllGuestsWithoutPrompt: boolean = false;

    // Auto start recording on takeoff
    startRecording: boolean;

    // List of guests that are connected
    connectedGuests: Array<string> = [];

    constructor(public $log: angular.ILogService) {
        super($log);
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
            
                this.mapDrone = new MapDrone(this.mapEntityCollection, this.$log);

                this.mapDrone.initializeDrone(this.eventing, drones[0], this.map, this.color, true).then((mapDrone: MapDrone) => {
                    this.mapDrone = mapDrone;

                    this.setupEvents();

                    // Initialize waypoints for guided mode
                    this.mapWaypoints = new MapWaypoints(this.mapDrone, this.map, this.color, this.id, this.mapEntityCollection, this.eventing, this.$log);

                    resolve(this);
                });                
            });

        });

    }

    setupEvents(): void {

        this.session.on('slave-connected', (username: string) => {
            
            // Add username
            this.connectedGuests.push(username);

            this.$log.log({ message: 'Slave Connected.', username: username});
        });

        this.session.on('slave-disconnected', (username: string) => {

            try {
                // Remove username
                _.remove<string>(this.connectedGuests, (name: string) => {
                    return username.toLowerCase() === name.toLowerCase() ? true : false;
                });
            } catch (error) {
                this.$log.error({ message: 'Slave Disconnected Error.', error: error});
            }

            this.$log.log({ message: 'Slave Disconnected.', username: username});
        });

        // Wire up slave connection request
        this.session.on('slave-requesting-connection', (username: string, cb: (accepted: boolean) => { }) => {
            
            // check allow all guests flag and return true and exit
            if (this.allowAllGuestsWithoutPrompt) {
                cb(true);
                return;
            }

            this.eventing.trigger('guest-connect-request', username, cb);
            this.$log.log({ message: 'Guest Connect Request', username: username});
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