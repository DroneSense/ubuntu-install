
import ControlToolbar from '../controlToolbar/controlToolbar';
import ControlTelemetry from '../controlTelemetry/controlTelemetry';
import ISession from '@dronesense/core/lib/common/ISession';
import ControlConnect from '../controlConnect/controlConnect';
import StartSession from '../startSession/startSession';
import JoinSession from '../joinSession/joinSession';
import ServerConnection from './serverConnection';
import { SessionController } from './sessionController';
import { OwnerMapSession, MapSession } from './mapSession';
import FlightControlMode from '../flightControlMode/flightControlMode';
import { MapMode } from './mapMode';
import BackboneEvents from 'backbone-events-standalone';
import SessionManagementViewer from '../sessionManagementViewer/sessionManagementViewer';
import WaypointListViewer from '../waypointListViewer/waypointListViewer';
import MayLayers from '../mapLayers/mapLayers';
import { CesiumMapUtils } from '../../common/mapUtils';
import { FlightControlSettings } from './flightControlSettings';
import VideoPlayer from '../videoPlayer/videoPlayer';
import MultiVideoPlayer from '../multiVideoPlayer/multiVideoPlayer';

import { IEventEmitter } from '@dronesense/core/lib/common/IEventEmitter';

export interface IFlightControlViewerEvents extends IEventEmitter {
    on(eventName: string, callback?: Function, context?: any): any;
    on(eventName: 'locating-drone', callback?: (username: string) => void, context?: any): any;
    on(eventName: 'drone-located', callback?: (username: string) => void, context?: any): any;
    on(eventName: 'guest-connect-request', callback?: (username: string, cb: (accepted: boolean) => {} ) => void, context?: any): any;
    on(eventName: 'session-added', callback?: (session: OwnerMapSession) => void, context?: any): any;
    on(eventName: 'session-removed', callback?: (session: MapSession) => void, context?: any): any;
    on(eventName: 'map-loaded', callback?: () => void, context?: any): any;
    on(eventName: 'session-changed', callback?: (session: MapSession) => void, context?: any): any;
    on(eventName: 'server-disconnected', callback?: (serverConnection: ServerConnection) => void, context?: any): any;
    on(eventName: 'waypoint-error', callback?: (name: string) => void, context?: any): any;
}

export class FlightControlViewerEventing implements IFlightControlViewerEvents {
    
    on: (eventName: string, callback?: Function, context?: any) => any;
    once: (events: string, callback: Function, context?: any) => any;
    off: (eventName?: string, callback?: Function, context?: any) => any;
    trigger: (eventName: string, ...args: any[]) => any;

    constructor() {

    }
}

BackboneEvents.mixin(FlightControlViewerEventing.prototype);

export interface IFlightControlViewer extends ng.IScope {
    map: Cesium.Viewer;
}

class FlightControlViewer {
    
    // List of server that are currently connected
    connectedServers: Array<ServerConnection> = [];

    // Current server connection to use for dialogs
    currentServerConnection: ServerConnection;

    // Flag to pass to controller connect component
    newFlightSession: boolean;

    // Flag to indicate if a guest user request has been made and 
    // show the dialog
    guestUserRequest: boolean = false;

    // Username of the guest join request
    guestUserRequestName: string;

    // Session controller manages all sessions
    sessionController: SessionController;

    // eventing object for UI messages from objects
    eventing: FlightControlViewerEventing;

    // Save callback from guest request
    guestRequestCallback: any;

    // Dialog to show while drone is being locating
    locatingDroneDialog: boolean = false;

    // Flag to hide connect buttons
    hideButtons: boolean = false;

    flightControlSettings: FlightControlSettings;

    hasLoadedMap: boolean = false;

    hideBackground: boolean = false;

    lockCamera: boolean = true;

    firstSessionLoaded: boolean = false;

    serverDisconnect: boolean = false;

    waypointError: boolean = false;
    waypointErrorName: string = '';

    showMap: boolean = true;

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state',
        '$mdDialog'
    ];

    constructor(
        public bindings: IFlightControlViewer,
        public stateService: angular.ui.IStateService,
        public mdDialog: angular.material.MDDialogService) {

    }

    $onInit(): void {

        // Create new for now, eventually load from profile
        this.flightControlSettings = new FlightControlSettings();

        this.eventing = new FlightControlViewerEventing();

        this.sessionController = new SessionController(this.eventing);
        
        this.eventing.on('locating-drone', () => {
            this.locatingDroneDialog = true;
            this.bindings.$applyAsync();
        });

        this.eventing.on('drone-located', () => {
            this.locatingDroneDialog = false;

            this.firstSessionLoaded = true;

            this.initCamera();

            this.bindings.$applyAsync();
        });

        this.eventing.on('guest-connect-request', (username: string, cb: any) => {
            
            // Set call so we can call from dialog return
            this.guestRequestCallback = cb; 
            
            // Set username
            this.guestUserRequestName = username;

            // Show dialog
            this.guestUserRequest = true;
            
            // Update user interface
            this.bindings.$applyAsync();
        });

        this.eventing.on('server-disconnected', (serverConnection: ServerConnection) => {
            
            if (this.sessionController.ownerSession) {
                this.serverDisconnect = true;
                
                // Update user interface
                this.bindings.$applyAsync();
            }

            // Add to active connections if does not already exist.
            if (this.connectedServers.filter((connection: ServerConnection) => {
                if (connection.ip === serverConnection.ip && connection.port === serverConnection.port) {
                    return true;
                } else {
                    return false;
                }
            }).length === 1) {
                this.connectedServers.splice(this.connectedServers.indexOf(serverConnection), 1);
            };
            
        });

        // Only wire up to event if ownerSession
        if (this.sessionController.ownerSession) {
            this.eventing.on('waypoint-error', (name: string) => {
                this.waypointError = true;
                this.waypointErrorName = name;
            });
        }
    }

    // Start new flight button clicked on main screen
    startNewFlight(): void {
        // Get local server connection settings
        this.getServerSettings(true);
    }

    // Join existing flight button clicked on main screen
    joinExistingFlight(serverConnection: ServerConnection): void {
        // Get local server connection settings
        this.getServerSettings(false);
    }

    // Launch the control connect dialog to get the connection
    getServerSettings(newFlight: boolean): void {
        
        // set flag if this is a new session request or a join
        this.newFlightSession = newFlight;

        // Launch dialog
        this.mdDialog.show({
            template: '<ds-control-connect new-flight-session="$ctrl.newFlightSession" connected-servers="$ctrl.connectedServers" on-connect="$ctrl.controllerConnected(serverConnection, useExisting);" on-cancel="$ctrl.cancelDialog()"></ds-control-connect>',
            scope: this.bindings,
            preserveScope: true,
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            escapeToClose: true
        });
    }

    // Connection has been made and passed back
    controllerConnected(serverConnection: ServerConnection, useExisting: boolean): void {
           
        // Close connection dialog
        this.mdDialog.hide();
        
        // Check if user is using an existing connection or a new one
        // if (!useExisting) {
        //     this.connectedServers.push(serverConnection);
        // }

        // Add to active connections if does not already exist.
        if (this.connectedServers.filter((connection: ServerConnection) => {
            if (connection.ip === serverConnection.ip && connection.port === serverConnection.port) {
                return true;
            } else {
                return false;
            }
        }).length === 0) {
            serverConnection.eventing = this.eventing;
            this.connectedServers.push(serverConnection);
        };
        
        // check if this is a new flight or join exisitng session
        if (this.newFlightSession) {
            this.getNewSession(serverConnection);
        } else {
            this.joinExistingSession(serverConnection);
        }
        
    }

    // Launch start new flight dialog and get the session object back
    getNewSession(serverConnection: ServerConnection): void {

        // Necessary for component consumption
        this.currentServerConnection = serverConnection;

        this.mdDialog.show({
            template: '<ds-start-session server-connection="$ctrl.currentServerConnection" on-start="$ctrl.ownerSessionCreated(session, allowAllGuests, startRecording);" on-cancel="$ctrl.cancelDialog()"></ds-control-connect>',
            scope: this.bindings,
            preserveScope: true,
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            escapeToClose: true
        });
    }

    // Launch start new flight dialog and get the session object back
    joinExistingSession(serverConnection: ServerConnection): void {

        // Necessary for component consumption
        this.currentServerConnection = serverConnection;

        this.mdDialog.show({
            template: '<ds-join-session server-connection="$ctrl.currentServerConnection" session-controller="$ctrl.sessionController" on-join="$ctrl.guestSessionJoined(session);" on-cancel="$ctrl.cancelDialog()"></ds-control-connect>',
            scope: this.bindings,
            preserveScope: true,
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            escapeToClose: true
        });
    }

    // Add to list of guest sessions
    guestSessionJoined(session: ISession): void {
        
        // Close dialog
        this.mdDialog.hide();

        // Hide bg image
        this.hideBackground = true;

        // Remove buttons after session returns
        this.hideButtons = true;

        // Pass to session controller as guest
        this.sessionController.addGuestSession(session, this.currentServerConnection, MapMode.ThreeDimensional);

    }

    // Call back from start new flight dialog that returns a session
    ownerSessionCreated(session: ISession, allowAllGuests: boolean, startRecording: boolean): void {

        // Close dialog
        this.mdDialog.hide();

        // Hide background image
        this.hideBackground = true;

        // Remove buttons after session returns
        this.hideButtons = true;

        this.sessionController.addOwnerSession(session, this.currentServerConnection, MapMode.ThreeDimensional, allowAllGuests, startRecording);
    }

    // Return true if user accepts
    acceptGuestRequest(): void {
        this.guestRequestCallback(true);
        
        // Hide dialog
        this.guestUserRequest = false;
    }

    // Return false if user rejects
    denyGuestRequest(): void {
        this.guestRequestCallback(false);

        // Hide dialog
        this.guestUserRequest = false;
    }
    
    // Close dialog
    cancelDialog(): void {
        this.mdDialog.hide();
    }

    toggleLockCamera(): void {
        if (this.lockCamera) {
            this.sessionController.map.trackedEntity = this.sessionController.activeSession.mapDrone.droneEntity;
            setTimeout(() => {
                //this.loadCameraView();
                this.sessionController.map.camera.zoomOut(40);
            }, 250);
            
        } else {
            //this.saveCameraView();
            this.sessionController.map.trackedEntity = null;
        }
    }

    position: any;
    heading: any;
    pitch: any;
    roll: any;
    transform: any;
    saveCameraView(): void {
        this.position = Cesium.Cartesian3.clone(this.sessionController.map.camera.positionWC, this.position);
        this.heading = this.sessionController.map.camera.heading;
        this.pitch = this.sessionController.map.camera.pitch;
        this.roll = this.sessionController.map.camera.roll;
        this.transform = Cesium.Matrix4.clone(this.sessionController.map.camera.transform, this.transform);
    }

    loadCameraView(): void {
        let newPosition: Cesium.Cartesian3 = Cesium.Cartesian3.fromDegrees(this.sessionController.activeSession.mapDrone.currentLng, this.sessionController.activeSession.mapDrone.currentLat, this.sessionController.activeSession.mapDrone.currentAlt);
        newPosition.z = this.position.z;
        this.sessionController.map.camera.setView({
            destination : newPosition,
                orientation: {
                    heading : this.heading,
                    pitch : this.pitch,
                    roll : this.roll
            }
        });
    }

    zoomIn(): void {
        this.sessionController.map.cesiumNavigation.navigationViewModel.controls[0].activate();
    }

    zoomOut(): void {
        this.sessionController.map.cesiumNavigation.navigationViewModel.controls[2].activate();
    }

    lookDownBoundingBox(): void {
        this.sessionController.map.flyTo(this.sessionController.activeSession.mapEntityCollection);
        this.lockCamera = false;
    }

    isRecording: boolean = false;
    cameraInit: boolean = false;
    recordIndicatorVisible: boolean = false;
    toggleRecording(): void {
        this.recordIndicatorVisible = true;

        if (!this.cameraInit) {
            this.initCamera();
        }
        if (this.isRecording) {
            this.sessionController.ownerSession.mapDrone.drone.Camera.stopRecording().then().catch((error) => {
                console.log(error);
            });
        } else {
            this.sessionController.ownerSession.mapDrone.drone.Camera.startRecording().then(() => {

            }).catch((error) => {
                console.log(error);
            });
        }
    }
    initCamera(): void {
        if (this.sessionController.ownerSession) {
            this.isRecording = this.sessionController.ownerSession.mapDrone.drone.Camera.IsRecording;

            this.sessionController.ownerSession.mapDrone.drone.Camera.on('recording-started', () => {
                this.isRecording = true;
                this.recordIndicatorVisible = false;
            });
            this.sessionController.ownerSession.mapDrone.drone.Camera.on('recording-stopped', () => {
                this.isRecording = false;
                this.recordIndicatorVisible = false;
            });
            this.sessionController.ownerSession.mapDrone.drone.Camera.on('take-picture-finished', () => {
                this.takePictureComplete = true;
            });
            this.cameraInit = true;
        }
    }
    takePictureComplete: boolean = true;
    takePicture(): void {
        if (!this.cameraInit) {
            this.initCamera();
        }
        this.takePictureComplete = false;
        this.sessionController.ownerSession.mapDrone.drone.Camera.takePicture();
    }
}

export default angular.module('DroneSense.Web.FlightControlViewer', [
    ControlToolbar.name,
    ControlConnect.name,
    JoinSession.name,
    StartSession.name,
    ControlTelemetry.name,
    FlightControlMode.name,
    SessionManagementViewer.name,
    WaypointListViewer.name,
    MayLayers.name,
    VideoPlayer.name,
    MultiVideoPlayer.name
]).component('dsFlightControlViewer', {
    bindings: {

    },
    controller: FlightControlViewer,
    templateUrl: './app/components/flightControlViewer/flightControlViewer.html'
});
