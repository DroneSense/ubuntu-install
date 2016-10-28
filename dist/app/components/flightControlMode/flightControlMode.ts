import { Conversions } from '@dronesense/model/lib/common/Utility';
import { SessionController } from '../flightControlViewer/sessionController';
import { OwnerMapSession } from '../flightControlViewer/ownerMapSession';
import { IDrone } from '@dronesense/core/lib/common/IDrone';
import { SystemStatus } from '@dronesense/core/lib/common/enums/SystemStatus';
import { FlightMode } from '@dronesense/core/lib/common/enums/FlightMode';
import { ISystem } from '@dronesense/core/lib/common/entities/ISystem';
import { IRedProService } from '../../services/redProService';

export interface IFlightControlMode extends ng.IScope {
    $ctrl: any;

    // Flag to show RTL button
    rtlButtonVisible: boolean;

    // Flag to show guided mode button
    guidedModeButtonVisible: boolean;
    changeToGuidedModeButtonVisible: boolean;

    // Flag to show manual mode button
    manualModeButtonVisible: boolean;
    changeToManualModeButtonVisible: boolean;

    orbitModeButtonVisible: boolean;
    changeToOrbitModeButtonVisible: boolean;

    // RTL mode button visibility
    rtlModeButtonVisible: boolean;
    rtlIndicatorVisible: boolean;

    // Flag to show takeoff command button
    takeoffButtonVisible: boolean;
    takeoffIndicatorVisible: boolean;

    // Flag to show the flight resume button
    resumeButtonVisible: boolean;
    resumeIndicatorVisible: boolean;

    // Flag to show the flight pause button
    pauseButtonVisible: boolean;
    pauseIndicatorVisible: boolean;

    // Flag to show the set new home point button
    setNewHomePointButtonVisible: boolean;

    // Flag to show the change altitude button
    changeAltitudeButtonVisible: boolean;

    // Add waypoint button visible
    addWaypointButtonVisible: boolean;

    addTargetButtonVisible: boolean;
    targetAddActive: boolean;
    targetLatLngAcquired: boolean;

    getTakeoffAltitudeVisible: boolean;

    getChangeAltitudeVisible: boolean;

    changeAltitudeValue: number;

    waypointAddActive: boolean;

    showWaypointDialog: boolean;

    manualModeChangeIndicatorVisible: boolean;
    guidedModeChangeIndicatorVisible: boolean;
    rtlModeChangeIndicatorVisible: boolean;
    orbitModeChangeIndicatorVisible: boolean;

    hasLanded(): void;

}

class FlightControlMode {

    // Flag to show RTL button
    rtlButtonVisible: boolean = false;
    rtlIndicatorVisible: boolean = false;

    // Flag to show guided mode button
    guidedModeButtonVisible: boolean = false;

    changeToOrbitModeButtonVisible: boolean = false;
    orbitModeButtonVisible: boolean = false;
    
    targetAddActive: boolean = false;
    addTargetButtonVisible: boolean = false;

    changeToGuidedModeButtonVisible: boolean = false;

    // Flag to show manual mode button
    manualModeButtonVisible: boolean = false;

    changeToManualModeButtonVisible: boolean = false;

    // RTL mode button visibility
    rtlModeButtonVisible: boolean = false;

    // Flag to show takeoff command button
    takeoffButtonVisible: boolean = false;

    // Flag to show the flight resume button
    resumeButtonVisible: boolean = false;
    resumeIndicatorVisible: boolean = false;

    // Flag to show the flight pause button
    pauseButtonVisible: boolean = false;
    pauseIndicatorVisible: boolean = false;

    // Flag to show the set new home point button
    setNewHomePointButtonVisible: boolean = false;

    // Flag to show the change altitude button
    changeAltitudeButtonVisible: boolean = false;

    // Add waypoint button visible
    addWaypointButtonVisible: boolean = false;

    // Flag whether get altitude is visible
    getTakeoffAltitudeVisible: boolean = false;

    // Flag whether change altitude dialog is visible
    getChangeAltitudeVisible: boolean = false;

    modesOpen: boolean = false;

    // Current session controller
    sessionController: SessionController;

    // Current drone for session
    drone: IDrone;

    // Current drone status
    status: SystemStatus;

    // Current flight mode
    flightMode: FlightMode;

    // Flag to indicate if drone is armed
    armed: boolean;

    // Current mode state
    currentMode: IMode;

    // Manual Mode
    manualMode: ManualMode = new ManualMode(this.bindings.$ctrl, this.$log);

    // Guided Mode
    guidedMode: GuidedMode = new GuidedMode(this.bindings.$ctrl, this.$log);

    // RTL Mode
    rtlMode: RTLMode = new RTLMode(this.bindings.$ctrl, this.$log);

    // Orbit Mode
    orbitMode: OrbitMode = new OrbitMode(this.bindings.$ctrl, this.$log);

    waypointAddActive: boolean = false;

    showWaypointDialog: boolean = false;
    waypointAltitudeValue: number = 50;
    waypointSpeedValue: number = 5;
    waypointFlyToNow: boolean = false;

    sessionColor: string;

    showTargetDialog: boolean = false;

    manualModeChangeIndicatorVisible: boolean = false;
    guidedModeChangeIndicatorVisible: boolean = false;
    rtlModeChangeIndicatorVisible: boolean = false;
    orbitModeChangeIndicatorVisible: boolean = false;

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        'redProService',
        '$mdToast',
        '$log'
    ];
    constructor(public bindings: IFlightControlMode, public red5proService: IRedProService, public mdToast: angular.material.MDToastService, public $log: angular.ILogService) {

        this.sessionController.eventing.on('session-added', (ownerSession: OwnerMapSession) => {
            
            this.sessionColor = ownerSession.color;
            this.drone = ownerSession.mapDrone.drone;
            this.status = this.drone.FlightController.Telemetry.System.status;
            this.flightMode = this.drone.FlightController.Telemetry.System.flightMode;

            this.setFlightModeState();

            this.drone.FlightController.Telemetry.on('System', (value: ISystem) => {
                
                // Check if status has changed
                if (this.status !== value.status) {
                    
                    // Log the status change
                    this.$log.log({ message: 'System Status Change', fromStatus: this.status, toStatus: value.status });

                    // Set new status
                    this.status = value.status;

                    // Check to see if current mode has been set
                    if (this.currentMode) {
                        this.currentMode.handleStatusChange(this.status);
                    }
                }

                // Check if flight mode has changed
                if (this.flightMode !== value.flightMode) {

                    // Log the mode change
                    this.$log.log({ message: 'Flight Mode Change', fromMode: this.flightMode, toMode: value.flightMode });

                    // Set new status
                    this.flightMode = value.flightMode;

                    // Set current flight mode
                    this.setFlightModeState();                    
                }

                if (this.armed !== value.armed) {

                }

            });

            this.bindings.$applyAsync();

        });

        this.sessionController.eventing.on('map-loaded', () => {
            this.initializeMapMouseHandler();
        });
    }

    setManualMode(): void {
        this.guidedModeChangeIndicatorVisible = true;
        this.rtlModeChangeIndicatorVisible = true;
        this.orbitModeChangeIndicatorVisible = true;
        
        this.$log.log({ message: 'Set Manual Mode Requested'});

        this.drone.FlightController.setFlightMode(FlightMode.Loiter).then(() => {
            this.$log.log({ message: 'Set Manual Mode Returned' });
        }).catch((error) => {
            this.$log.error({ message: 'Set Manual Mode Error.', error: error });
        });
    }

    setGuidedMode(): void {
        this.manualModeChangeIndicatorVisible = true;
        this.rtlModeChangeIndicatorVisible = true;
        this.orbitModeChangeIndicatorVisible = true;

        this.$log.log({ message: 'Set Guided Mode Requested'});

        this.drone.FlightController.setFlightMode(FlightMode.Guided).then( () => {
            this.$log.log({ message: 'Set Guided Mode Returned' });
        }).catch((error) => {
            this.$log.error({ message: 'Set Guided Mode Error.', error: error });
        });
    }


    setOrbitMode(): void {
        this.manualModeChangeIndicatorVisible = true;
        this.rtlModeChangeIndicatorVisible = true;
        this.guidedModeChangeIndicatorVisible = true;

        this.$log.log({ message: 'Set Orbit Mode Requested'});

        this.drone.FlightController.setFlightMode(FlightMode.Orbit).then( () => {
            this.$log.log({ message: 'Set Orbit Mode Returned' });
        }).catch((error) => {
            this.$log.error({ message: 'Set Orbit Mode Error.', error: error });
        });
    }

    // Sets the flight mode state from this.drone.FlightController.Telemetry.on('System', (value: ISystem) callback
    setFlightModeState(): void {
        
        // Teardown existing mode before requesting change
        if (this.currentMode) {
            this.currentMode.teardownUI();
            this.bindings.$applyAsync();
        }

        // Set new mode based on these mappings
        switch (this.flightMode) {
            case FlightMode.Loiter:
                this.currentMode = this.manualMode;
                break;
            case FlightMode.Stabilize:
                this.currentMode = this.manualMode;
                break;
            case FlightMode.AltHold:
                this.currentMode = this.manualMode;
                break;
            case FlightMode.Guided:
                this.currentMode = this.guidedMode;
                break;
            case FlightMode.RTL:
                this.currentMode = this.rtlMode;
                break;
            case FlightMode.Orbit:
                this.currentMode = this.orbitMode;
                break;
            default:
                this.currentMode = null;
                this.$log.error({ message: 'Flight mode was not recognized and is set as null.'});
                break;
        }

        // Setup new flight mode UI
        if (this.currentMode) {
            this.currentMode.initialize(this.status, this.flightMode, this.drone);
            this.currentMode.setupUI();
            this.bindings.$applyAsync();
        }

    }

    // User clicked the RTL button in the user interface
    rtl(): void {
        this.rtlIndicatorVisible = true;
        this.currentMode.handleButtonClick(ButtonActions.RTL);
        this.$log.log({ message: 'RTL button clicked, sending to flight mode for processing.'});
    }

    // User clicked the Takeoff button in the user interface
    takeoff(): void {
        this.currentMode.handleButtonClick(ButtonActions.Takeoff);
        this.$log.log({ message: 'Takeoff button clicked, sending to flight mode for processing.'});
    }

    // User clicked the resume button in the user interface
    resume(): void {
        this.resumeIndicatorVisible = true;
        this.currentMode.handleButtonClick(ButtonActions.Resume);
        this.$log.log({ message: 'Resume button clicked, sending to flight mode for processing.'});
    }

    // User clicked the puase button in the user interface
    pause(): void {
        this.pauseIndicatorVisible = true;
        this.currentMode.handleButtonClick(ButtonActions.Pause);
        this.$log.log({ message: 'Pause button clicked, sending to flight mode for processing.'});
    }

    // User clicked the set home point button in the user interface
    setHomePoint(): void {
        this.currentMode.handleButtonClick(ButtonActions.SetHomePoint);
        this.$log.log({ message: 'Set Home Point button clicked, sending to flight mode for processing.'});
    }

    // User clicked the change altitude button in the user interface
    changeAltitude(): void {
        this.currentMode.handleButtonClick(ButtonActions.ChangeAltitude);
        this.$log.log({ message: 'Changed Altitude button clicked, sending to flight mode for processing.'});
    }

    // User clicked the add waypoint button in the user interface
    addWaypoint(): void {
        if (!this.mouseHandler) {
            this.initializeMapMouseHandler();
            this.$log.log({ message: 'Initializing Map Mouse Handler.'});
        }

        if (this.waypointAddActive) {
            this.waypointAddActive = false;
        } else {
            this.showWaypointDialog = true;
            this.$log.log({ message: 'Showing waypoint dialog.'});
        }

    }

    // Orbit target parameters
    targetLat: number;
    targetLng: number;
    targetLatLngAcquired: boolean = false;
    
    addOrbitTarget(): void {
        if (!this.mouseHandler) {
            this.initializeMapMouseHandler();
            this.$log.log({ message: 'Initializing Map Mouse Handler.'});
        }

        if (this.targetAddActive) {
            this.targetAddActive = false;
            this.targetLatLngAcquired = false;
            this.sessionController.activeSession.mapEntityCollection.entities.remove(this.currentOrbitTarget);
            this.sessionController.activeSession.mapEntityCollection.entities.remove(this.currentOrbitRadius);
            this.$log.log({ message: 'Orbit Selection Mode DeActivated, UI cleaned up.'});
        } else {
            this.targetAddActive = true;
            this.mdToast.show(
            this.mdToast.simple()
                .content('Select orbit target on map.')
                .position('top left')
                .hideDelay(3000)
            );
            this.$log.log({ message: 'Orbit Selection Mode Active'});
            //this.showTargetDialog = true;
        }
    }

    takeoffAltitude: number = 50;
    isRecordingFromTakeoff: boolean = false;

    // Called after user accepts takeoff parameters
    takeoffToAltitude(): void {

        this.$log.log({ message: 'Takeoff Requested on flight controller.'});
        this.drone.FlightController.takeoff(this.takeoffAltitude).then(() => {
            
            this.$log.log({ message: 'Takeoff request returned.'});
            
            if (this.sessionController.ownerSession.startRecording) {

                this.$log.log({ message: 'Start Recording Requested.'});
                this.drone.Camera.startRecording().then(() => {
                    this.isRecordingFromTakeoff = true;
                    this.$log.log({ message: 'Start Recording Started.'});
                    
                    // TODO: Removing until we get the CORS issued resolved.
                    // try {
                    //     this.red5proService.startVODRecording(this.sessionController.ownerSession.name).then((recording: boolean) => {
                    //         console.log('server vod recording started');
                    //     });
                    // } catch (error) {
                    //     console.log(error);
                    // }
                }).catch((error) => {
                    this.$log.error({ message: 'Takeoff Start Recording Request Error.', error: error });
                });
            }
        }).catch((error) => {
             this.$log.error({ message: 'Takeoff request error.', error: error });
        });

        this.getTakeoffAltitudeVisible = false;
    }

    // Called from modes after drone status changes indicating a landing
    hasLanded(): void {
        
        if (this.isRecordingFromTakeoff) {

            this.$log.log({ message: 'Recording Stop Requested.'});
            if (this.sessionController.ownerSession.startRecording) {
                this.drone.Camera.stopRecording().then(() => {
                    this.$log.log({ message: 'Recording Stop Returned.'});
                    // try {
                    //     this.red5proService.stopVODRecording(this.sessionController.ownerSession.name).then((recording: boolean) => {
                    //         console.log('server vod recording stopped');
                    //         this.isRecordingFromTakeoff = false;
                    //     });
                    // } catch (error) {
                    //     console.log(error);
                    // }
                }).catch((error) => {
                    this.$log.error({ message: 'Landing Stop Recording Request Error.', error: error });
                });
            }
        }
    }

    cancelTakeoff(): void {
        this.getTakeoffAltitudeVisible = false;
        this.$log.log({ message: 'Takeoff Dialog Cancelled.'});
    }

    changeAltitudeValue: number;
    changeAltitudeTo(): void {

        // Make sure current mode is guided
        if (this.currentMode.flightMode === FlightMode.Guided) {

            // Set acceptance radius to 1 meter
            this.drone.FlightController.Guided.setAcceptanceRadius(1);

            this.$log.log({ message: 'Change altitude requested from guided mode.'});
            // Call add waypoing for the altitude change.
            this.drone.FlightController.Guided.addWaypoint({
                lattitude: this.drone.FlightController.Telemetry.Position.lattitude,
                longitude: this.drone.FlightController.Telemetry.Position.longitude,
                altitude: this.changeAltitudeValue,
                speed: 5,
                name: this.getNextName()
            }, true).then(() => {
                this.$log.log({ message: 'Change altitude requested returned from guided mode.'});
            }).catch((error) => {
                this.$log.error({ message: 'Change altitude requested error from guided mode.', error: error });
            });

            this.getChangeAltitudeVisible = false;
        }

        if (this.currentMode.flightMode === FlightMode.Orbit) {
            
            // Convert time into angular velocity
            let av: number = 360 / this.targetVelocity;

            this.$log.log({ message: 'Orbit requested.', lat: this.targetLat, lng: this.targetLng, alt: this.targetAltitude, rad: this.targetRadius, dir: this.targetDirection, vel: av });
            
            // Call new orbit code with new altitude
            this.drone.FlightController.Orbit.orbit(this.targetLat, this.targetLng, this.changeAltitudeValue, this.targetRadius,
            this.targetDirection, av).then(() => {
                this.getChangeAltitudeVisible = false;
                this.$log.log({ message: 'Change altitude requested returned from orbit mode.'});
            }).catch((error) => {
                // Keep dialog open and show error
                this.getChangeAltitudeVisible = false;
                this.$log.error({ message: 'Change altitude requested error from orbit mode.', error: error });
            });
        
        }
    }

    cancelChangeAltitude(): void {
        this.getChangeAltitudeVisible = false;
    }

    closeWaypointDialog(): void {
        this.showWaypointDialog = false;
    }

    closeActiveDialog(): void {
        this.showTargetDialog = false;
        this.targetAddActive = false;
        this.targetLatLngAcquired = false;
        this.sessionController.activeSession.mapEntityCollection.entities.remove(this.currentOrbitTarget);
        this.sessionController.activeSession.mapEntityCollection.entities.remove(this.currentOrbitRadius);
    }

    setWaypointsActive(): void {
        this.closeWaypointDialog();
        this.waypointAddActive = true;
    }
    
    sendingTargetToDrone: boolean = false;
    setTargetActive(): void {
        // Convert time into angular velocity
        let av: number = 360 / this.targetVelocity;

        // Check if number exceeds max velocity
        this.$log.log({ message: 'Add code to check if orbit speed exceeds max angular velocity.' });

        this.sendingTargetToDrone = true;

        this.$log.log({ message: 'Orbit requested.', lat: this.targetLat, lng: this.targetLng, alt: this.targetAltitude, rad: this.targetRadius, dir: this.targetDirection, vel: av });
        this.drone.FlightController.Orbit.orbit(this.targetLat, this.targetLng, this.targetAltitude, this.targetRadius,
        this.targetDirection, av).then(() => {
            this.showTargetDialog = false;
            this.targetAddActive = false;
            this.targetLatLngAcquired = false;
            this.sendingTargetToDrone = false;

            this.$log.log({ message: 'Orbit request returned.' });
        }).catch((error) => {
            // Keep dialog open and show error
            this.sendingTargetToDrone = false;
            this.$log.error({ message: 'Orbit request returned an error.', error: error });
        });
    }

    mouseHandler: Cesium.ScreenSpaceEventHandler;
    initializeMapMouseHandler(): void {

            // wire up left mouse click event
        this.mouseHandler = new Cesium.ScreenSpaceEventHandler(this.sessionController.map.canvas, false);

        this.mouseHandler.setInputAction((click: any) => {
                this.handleMouseClick(click);
            },
            Cesium.ScreenSpaceEventType.LEFT_CLICK
        );
    }

    handleMouseClick(click: any): void {

        if (!this.waypointAddActive && !this.targetAddActive) {
            return;
        }

        //let start: any = new Date().getTime();

        var ray: any = this.sessionController.map.camera.getPickRay(click.position);
        var position: any = this.sessionController.map.scene.globe.pick(ray, this.sessionController.map.scene);
        //console.log(position);
        if (Cesium.defined(position)) {
            // Make the height of the position = 0 so it works with groundPrimitive
            var positionCartographic: Cesium.Cartographic = this.sessionController.map.scene.globe.ellipsoid.cartesianToCartographic(position);
            positionCartographic.height = 0;
            //position = this.map.scene.globe.ellipsoid.cartographicToCartesian(positionCartographic);

            //var cartographic: Cesium.Cartographic = Cesium.Cartographic.fromCartesian(position);
            var longitudeString: number = Cesium.Math.toDegrees(positionCartographic.longitude);
            var latitudeString: number = Cesium.Math.toDegrees(positionCartographic.latitude);

            if (this.waypointAddActive) {

                this.$log.log({ message: 'User selected waypoint on map, making add waypoint request.'});
                this.drone.FlightController.Guided.addWaypoint({
                    lattitude: latitudeString,
                    longitude: longitudeString,
                    altitude: this.waypointAltitudeValue,
                    speed: this.waypointSpeedValue,
                    name: this.getNextName()
                }, this.waypointFlyToNow).then(() => {

                    this.$log.log({ message: 'Add Waypoint Request Returned.' });

                }).catch((error) => {
                    this.$log.log({ message: 'Add Waypoint Request Returned Error', error: error });
                });
            }

            try {
                if (this.targetAddActive) {
                    // If we have a target orbit point then calculate the radius distance and show dialog
                    if (this.targetLatLngAcquired) {
                        let distance: number = Conversions.distance2(this.targetLat, this.targetLng, latitudeString, longitudeString);
                        this.targetRadius = Conversions.roundToTwo(distance);
                        this.targetAltitude = Conversions.roundToTwo(this.sessionController.ownerSession.mapDrone.currentAGLAlt);

                        this.sessionController.activeSession.mapEntityCollection.entities.remove(this.currentOrbitRadius);
                        this.currentOrbitRadius = this.sessionController.activeSession.mapEntityCollection.entities.add({
                            position : Cesium.Cartesian3.fromDegrees(this.targetLng, this.targetLat, this.sessionController.ownerSession.mapDrone.currentAlt),
                            ellipse : {
                                semiMinorAxis : this.targetRadius,
                                semiMajorAxis : this.targetRadius,
                                height: this.sessionController.ownerSession.mapDrone.currentAlt,
                                material : Cesium.Color.TRANSPARENT,
                                outline : true,
                                outlineColor : Cesium.Color.fromCssColorString('#0a92ea'),
                                outlineWidth: 3
                            }
                        });

                        this.showTargetDialog = true;
                    } else {
                        this.targetLat = latitudeString;
                        this.targetLng = longitudeString;
                        this.targetLatLngAcquired = true;
                        
                        this.sessionController.activeSession.mapEntityCollection.entities.remove(this.currentOrbitTarget);
                        this.currentOrbitTarget = this.sessionController.activeSession.mapEntityCollection.entities.add({
                            position : Cesium.Cartesian3.fromDegrees(longitudeString, latitudeString, 1),
                            point : {
                                color : Cesium.Color.fromCssColorString('#0a92ea'),
                                pixelSize : 10,
                                outlineColor : Cesium.Color.WHITE,
                                outlineWidth : 3,
                                heightReference : Cesium.HeightReference.RELATIVE_TO_GROUND
                            }
                        });

                        this.mdToast.show(
                        this.mdToast.simple()
                            .content('Select orbit radius point on map.')
                            .position('top left')
                            .hideDelay(3000)
                        );
                    }
                }
            } catch (error) {
                this.$log.error({ message: 'Error in orbit map adding UI code.', error: error });
            }
        }
    }

    currentOrbitTarget: any;
    currentOrbitRadius: any;

    targetAltitude: number = 50;
    targetRadius: number = 10;
    targetDirection: boolean = true;
    targetVelocity: number = 60;

    wayPointNames: Array<string> = ['A', 'B', 'C', 'D', 'E', 'F', 'G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX','AY','AZ', 'BA', 'BB', 'BC', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ'];
    nextNameIndex: number = 0;

    getNextName(): string {
        let current: number = this.nextNameIndex;
        this.nextNameIndex++;
        return this.wayPointNames[current];
    }
}

enum ButtonActions {
    Takeoff,
    RTL,
    Resume,
    Pause,
    SetHomePoint,
    ChangeAltitude,
    AddWaypoint
}

interface IMode {

    setupUI(): void;
    teardownUI(): void;
    handleButtonClick(button: ButtonActions): void;
    handleStatusChange(systemStatus: SystemStatus): void;
    initialize(systemStatus: SystemStatus, flightMode: FlightMode, drone: IDrone): void;
    flightMode: FlightMode;
    $log: angular.ILogService;
}

class OrbitMode implements IMode {
    
    systemStatus: SystemStatus;
    flightMode: FlightMode;
    drone: IDrone;

    constructor(public flightControlMode: IFlightControlMode, public $log: angular.ILogService) {

    }

    initialize(systemStatus: SystemStatus, flightMode: FlightMode, drone: IDrone): void {
        this.systemStatus = systemStatus;
        this.flightMode = flightMode;
        this.drone = drone;

        this.drone.FlightController.Telemetry.on('System', (value: ISystem) => {
            this.flightControlMode.pauseButtonVisible = !value.paused;
            this.flightControlMode.resumeButtonVisible = value.paused;

            this.flightControlMode.pauseIndicatorVisible = false;
            this.flightControlMode.resumeIndicatorVisible = false;
        }); 
    }

    setupUI(): void {
        // Turn on primary mode on/off buttons
        this.flightControlMode.orbitModeButtonVisible = true;
        this.flightControlMode.changeToManualModeButtonVisible = true;
        this.flightControlMode.changeToGuidedModeButtonVisible = true;
        this.flightControlMode.setNewHomePointButtonVisible = true;

        // Turn off indicators from mode change
        this.flightControlMode.manualModeChangeIndicatorVisible = false;
        this.flightControlMode.guidedModeChangeIndicatorVisible = false;
        this.flightControlMode.rtlModeChangeIndicatorVisible = false;
        this.flightControlMode.orbitModeChangeIndicatorVisible = false;

        // Let status change handle status specific buttons
        this.handleStatusChange(this.systemStatus);

    }

    teardownUI(): void {
        this.flightControlMode.orbitModeButtonVisible = false;
        this.flightControlMode.guidedModeButtonVisible = false;
        this.flightControlMode.setNewHomePointButtonVisible = false;
        this.flightControlMode.rtlButtonVisible = false;
        this.flightControlMode.changeAltitudeButtonVisible = false;
        this.flightControlMode.pauseButtonVisible = false;
        this.flightControlMode.resumeButtonVisible = false;
        this.flightControlMode.takeoffButtonVisible = false;
        this.flightControlMode.changeToManualModeButtonVisible = false;
        this.flightControlMode.changeToGuidedModeButtonVisible = false;
        this.flightControlMode.addTargetButtonVisible = false;

        this.flightControlMode.targetAddActive = false;
        this.flightControlMode.targetLatLngAcquired = false;
    }

    handleButtonClick(button: ButtonActions): void {

        switch (button) {
            case ButtonActions.RTL:
                this.$log.log({ message: 'Requesting RTL from Orbit Mode.'});
                this.drone.FlightController.setFlightMode(FlightMode.RTL).then(() => {
                    this.$log.log({ message: 'Request RTL from Orbit Mode returned.'});
                }).catch((error) => {
                    this.$log.error({ message: 'Request RTL from Orbit Mode Error.', error: error });
                });
                break;
            case ButtonActions.SetHomePoint:
                //this.drone.FlightController.setHomePoint(lat/lng);
                break;
            case ButtonActions.ChangeAltitude:
                this.flightControlMode.changeAltitudeValue = this.drone.FlightController.Telemetry.Position.altitudeAGL;
                this.flightControlMode.getChangeAltitudeVisible = true;
                break;
            case ButtonActions.Pause:
                this.$log.log({ message: 'Requesting Pause from Orbit Mode.'});
                this.drone.FlightController.pause(true).then(() => {
                    this.$log.log({ message: 'Request Pause from Orbit Mode returned.'});
                }).catch((error) => {
                    this.$log.error({ message: 'Request Pause from Orbit Mode Error.', error: error });
                });
                break;
            case ButtonActions.Resume:
                this.$log.log({ message: 'Requesting Resume from Orbit Mode.'});
                this.drone.FlightController.pause(false).then(() => {
                    this.$log.log({ message: 'Request Resume from Orbit Mode returned.'});
                }).catch((error) => {
                    this.$log.error({ message: 'Request Resume from Orbit Mode Error.', error: error });
                });
                break;        
            default:
                break;
        }
    }

    handleStatusChange(systemStatus: SystemStatus): void {
        switch (systemStatus) {
            // System is active and might be already airborne. Motors are engaged.
            case SystemStatus.Active:
                this.flightControlMode.rtlButtonVisible = true;
                this.flightControlMode.changeAltitudeButtonVisible = true;
                this.flightControlMode.pauseButtonVisible = true;
                this.flightControlMode.setNewHomePointButtonVisible = true;
                this.flightControlMode.addTargetButtonVisible = true;
                break;
            // System is booting up.
            case SystemStatus.Booting:
                this.flightControlMode.rtlButtonVisible = false;
                break;
            // System is calibrating and not flight-ready.
            case SystemStatus.Calibrating:
                this.flightControlMode.rtlButtonVisible = false;
                break;
            // System is in a non-normal flight mode. It can however still navigate.
            case SystemStatus.Critical:
                this.flightControlMode.rtlButtonVisible = true;
                break;
            // System is in a non-normal flight mode. It lost control over parts or over the whole airframe. It is in mayday and going down.
            case SystemStatus.Emergency:
                this.flightControlMode.rtlButtonVisible = true;
                break;
            // System just initialized its power-down sequence, will shut down now.
            case SystemStatus.PowerOff:
                this.flightControlMode.rtlButtonVisible = false;
                break;
            // System is grounded and on standby. It can be launched any time.
            case SystemStatus.Standby:
                this.flightControlMode.rtlButtonVisible = false;
                this.flightControlMode.hasLanded();
                break;
            // Uninitialized system, state is unknown.
            case SystemStatus.Unknown:
                this.flightControlMode.rtlButtonVisible = false;
                break;
            default:
                break;
        }
    }

}

class GuidedMode implements IMode {
    
    systemStatus: SystemStatus;
    flightMode: FlightMode;
    drone: IDrone;

    constructor(public flightControlMode: IFlightControlMode, public $log: angular.ILogService) {

    }

    initialize(systemStatus: SystemStatus, flightMode: FlightMode, drone: IDrone): void {
        this.systemStatus = systemStatus;
        this.flightMode = flightMode;
        this.drone = drone;

        // this.drone.FlightController.Guided.on('waypoint-added', (wayPoint: IGuidedWaypoint, index: number) => {
        //     console.log('waypoint-added: ' + index + ':' + wayPoint);
        // });

        // this.drone.FlightController.Guided.on('waypoint-removed', (index: number) => {
        //     console.log('waypoint-removed: ' + index);
        // });

        // this.drone.FlightController.Guided.on('waypoints-changed', () => {
        //     console.log('waypoints-changed');
        // });

        this.drone.FlightController.Telemetry.on('System', (value: ISystem) => {
            this.flightControlMode.pauseButtonVisible = !value.paused;
            this.flightControlMode.resumeButtonVisible = value.paused;

            this.flightControlMode.pauseIndicatorVisible = false;
            this.flightControlMode.resumeIndicatorVisible = false;
        });

        // this.drone.FlightController.Guided.on('playback-paused', () => {
        //     this.flightControlMode.pauseButtonVisible = false;
        //     this.flightControlMode.resumeButtonVisible = true;
        // });

        // this.drone.FlightController.Guided.on('playback-resumed', () => {
        //     this.flightControlMode.resumeButtonVisible = false;
        //     this.flightControlMode.pauseButtonVisible = true;
        // });

        // this.drone.FlightController.Guided.on('waypoint-error', (index: number, error: any) => {
        //     console.log('waypoint-error: ' + index);
        // });

        // this.drone.FlightController.Guided.on('waypoint-started', (index: number) => {
        //     console.log('waypoint-started: ' + index);
        // });

        // this.drone.FlightController.Guided.on('waypoint-reached', (index: number) => {
        //     console.log('waypoint-reached: ' + index);
        // });
        
    }

    setupUI(): void {
        // Turn on primary mode on/off buttons
        this.flightControlMode.guidedModeButtonVisible = true;
        this.flightControlMode.changeToManualModeButtonVisible = true;
        this.flightControlMode.changeToOrbitModeButtonVisible = true;
        this.flightControlMode.addWaypointButtonVisible = true;
        this.flightControlMode.setNewHomePointButtonVisible = true;

        // Turn off indicators from mode change
        this.flightControlMode.manualModeChangeIndicatorVisible = false;
        this.flightControlMode.guidedModeChangeIndicatorVisible = false;
        this.flightControlMode.rtlModeChangeIndicatorVisible = false;
        this.flightControlMode.orbitModeChangeIndicatorVisible = false;

        // Let status change handle status specific buttons
        this.handleStatusChange(this.systemStatus);

    }

    teardownUI(): void {
        this.flightControlMode.guidedModeButtonVisible = false;
        this.flightControlMode.setNewHomePointButtonVisible = false;
        this.flightControlMode.rtlButtonVisible = false;
        this.flightControlMode.changeAltitudeButtonVisible = false;
        this.flightControlMode.pauseButtonVisible = false;
        this.flightControlMode.resumeButtonVisible = false;
        this.flightControlMode.takeoffButtonVisible = false;
        this.flightControlMode.changeToManualModeButtonVisible = false;
        this.flightControlMode.changeToOrbitModeButtonVisible = false;
        this.flightControlMode.addWaypointButtonVisible = false;

        this.flightControlMode.waypointAddActive = false;
    }

    handleButtonClick(button: ButtonActions): void {

        switch (button) {
            case ButtonActions.RTL:
                this.$log.log({ message: 'Requesting RTL from Guided Mode.'});
                this.drone.FlightController.setFlightMode(FlightMode.RTL).then(() => {
                    this.$log.log({ message: 'Request RTL from Guided Mode returned.'});
                }).catch((error) => {
                    this.$log.error({ message: 'Request RTL from Guided Mode Error.', error: error });
                });
                break;
            case ButtonActions.SetHomePoint:
                //this.drone.FlightController.setHomePoint(lat/lng);
                break;
            case ButtonActions.ChangeAltitude:
                this.flightControlMode.changeAltitudeValue = this.drone.FlightController.Telemetry.Position.altitudeAGL;
                this.flightControlMode.getChangeAltitudeVisible = true;
                break;
            case ButtonActions.Pause:
                this.$log.log({ message: 'Requesting Pause from Guided Mode.'});
                this.drone.FlightController.pause(true).then(() => {
                    this.$log.log({ message: 'Request Pause from Guided Mode returned.'});
                }).catch((error) => {
                    this.$log.error({ message: 'Request Pause from Guided Mode Error.', error: error });
                });
                break;
            case ButtonActions.Resume:
                this.$log.log({ message: 'Requesting Resume from Guided Mode.'});
                this.drone.FlightController.pause(false).then(() => {
                    this.$log.log({ message: 'Request Resume from Guided Mode returned.'});
                }).catch((error) => {
                    this.$log.error({ message: 'Request Resume from Guided Mode Error.', error: error });
                });
                break;   
            case ButtonActions.Takeoff:
                this.flightControlMode.getTakeoffAltitudeVisible = true;
                break;
            case ButtonActions.AddWaypoint:
                // handled in flight control mode controller for now
                break;
        
            default:
                break;
        }
    }

    handleStatusChange(systemStatus: SystemStatus): void {
        switch (systemStatus) {
            // System is active and might be already airborne. Motors are engaged.
            case SystemStatus.Active:
                this.flightControlMode.rtlButtonVisible = true;
                this.flightControlMode.changeAltitudeButtonVisible = true;
                this.flightControlMode.pauseButtonVisible = true;
                this.flightControlMode.setNewHomePointButtonVisible = true;

                this.flightControlMode.takeoffButtonVisible = false;
                break;
            // System is booting up.
            case SystemStatus.Booting:
                this.flightControlMode.rtlButtonVisible = false;
                break;
            // System is calibrating and not flight-ready.
            case SystemStatus.Calibrating:
                this.flightControlMode.rtlButtonVisible = false;
                break;
            // System is in a non-normal flight mode. It can however still navigate.
            case SystemStatus.Critical:
                this.flightControlMode.rtlButtonVisible = true;
                break;
            // System is in a non-normal flight mode. It lost control over parts or over the whole airframe. It is in mayday and going down.
            case SystemStatus.Emergency:
                this.flightControlMode.rtlButtonVisible = true;
                break;
            // System just initialized its power-down sequence, will shut down now.
            case SystemStatus.PowerOff:
                this.flightControlMode.rtlButtonVisible = false;
                break;
            // System is grounded and on standby. It can be launched any time.
            case SystemStatus.Standby:
                this.flightControlMode.rtlButtonVisible = false;
                this.flightControlMode.takeoffButtonVisible = true;
                this.flightControlMode.hasLanded();
                break;
            // Uninitialized system, state is unknown.
            case SystemStatus.Unknown:
                this.flightControlMode.rtlButtonVisible = false;
                break;
            default:
                break;
        }
    }
}

class RTLMode implements IMode {

    systemStatus: SystemStatus;
    flightMode: FlightMode;
    drone: IDrone;

    constructor(public flightControlMode: IFlightControlMode, public $log: angular.ILogService) {

    }

    initialize(systemStatus: SystemStatus, flightMode: FlightMode, drone: IDrone): void {
        this.systemStatus = systemStatus;
        this.flightMode = flightMode;
        this.drone = drone;
    }

    setupUI(): void {
        this.flightControlMode.rtlIndicatorVisible = false;
        // Turn on primary mode on/off buttons
        this.flightControlMode.rtlModeButtonVisible = true;

        this.flightControlMode.changeToManualModeButtonVisible = true;
        this.flightControlMode.changeToGuidedModeButtonVisible = true;

        // Turn off indicators from mode change
        this.flightControlMode.manualModeChangeIndicatorVisible = false;
        this.flightControlMode.guidedModeChangeIndicatorVisible = false;
        this.flightControlMode.rtlModeChangeIndicatorVisible = false;
        this.flightControlMode.orbitModeChangeIndicatorVisible = false;

        // Let status change handle status specific buttons
        this.handleStatusChange(this.systemStatus);
    }

    teardownUI(): void {
        this.flightControlMode.rtlModeButtonVisible = false;
        this.flightControlMode.pauseButtonVisible = false;

        this.flightControlMode.changeToManualModeButtonVisible = false;
        this.flightControlMode.changeToGuidedModeButtonVisible = false;
    }

    handleButtonClick(button: ButtonActions): void {
        switch (button) {
            case ButtonActions.Pause:
                this.$log.log({ message: 'Pause requested from RTL mode, setting mode to Guided.'});
                this.drone.FlightController.setFlightMode(FlightMode.Guided).then(() => {
                    this.$log.log({ message: 'Pause requested from RTL mode, setting mode to Guided returned.'});
                }).catch((error) => {
                     this.$log.log({ message: 'Pause requested from RTL mode, setting mode to Guided returned error.', error: error });
                });
                break;        
            default:
                break;
        }
    }

    handleStatusChange(systemStatus: SystemStatus): void {
        switch (systemStatus) {
            // System is active and might be already airborne. Motors are engaged.
            case SystemStatus.Active:
                this.flightControlMode.pauseButtonVisible = true;
                break;
            // System is booting up.
            case SystemStatus.Booting:

                break;
            // System is calibrating and not flight-ready.
            case SystemStatus.Calibrating:

                break;
            // System is in a non-normal flight mode. It can however still navigate.
            case SystemStatus.Critical:

                break;
            // System is in a non-normal flight mode. It lost control over parts or over the whole airframe. It is in mayday and going down.
            case SystemStatus.Emergency:

                break;
            // System just initialized its power-down sequence, will shut down now.
            case SystemStatus.PowerOff:

                break;
            // System is grounded and on standby. It can be launched any time.
            case SystemStatus.Standby:
                this.flightControlMode.pauseButtonVisible = false;
                this.flightControlMode.hasLanded();
                break;
            // Uninitialized system, state is unknown.
            case SystemStatus.Unknown:

                break;
            default:
                break;
        }
    }
}

class ManualMode implements IMode {

    systemStatus: SystemStatus;
    flightMode: FlightMode;
    drone: IDrone;

    constructor(public flightControlMode: IFlightControlMode, public $log: angular.ILogService) {

    }

    initialize(systemStatus: SystemStatus, flightMode: FlightMode, drone: IDrone): void {
        this.systemStatus = systemStatus;
        this.flightMode = flightMode;
        this.drone = drone;
    }

    setupUI(): void {
        // Turn on primary mode on/off buttons
        this.flightControlMode.manualModeButtonVisible = true;
        this.flightControlMode.setNewHomePointButtonVisible = true;
        this.flightControlMode.changeToGuidedModeButtonVisible = true;
        this.flightControlMode.changeToOrbitModeButtonVisible = true;

        // Turn off indicators from mode change
        this.flightControlMode.manualModeChangeIndicatorVisible = false;
        this.flightControlMode.guidedModeChangeIndicatorVisible = false;
        this.flightControlMode.rtlModeChangeIndicatorVisible = false;
        this.flightControlMode.orbitModeChangeIndicatorVisible = false;

        // Let status change handle status specific buttons
        this.handleStatusChange(this.systemStatus);
    }

    teardownUI(): void {
        this.flightControlMode.manualModeButtonVisible = false;
        this.flightControlMode.setNewHomePointButtonVisible = false;
        this.flightControlMode.rtlButtonVisible = false;
        this.flightControlMode.changeToGuidedModeButtonVisible = false;
        this.flightControlMode.changeToOrbitModeButtonVisible = false;
    }

    handleButtonClick(button: ButtonActions): void {

        switch (button) {
            case ButtonActions.RTL:
                this.$log.log({ message: 'RTL requested from manual mode, setting flight mode to RTL.'});
                this.drone.FlightController.setFlightMode(FlightMode.RTL).then(() => {
                    this.$log.log({ message: 'RTL requested from manual mode, setting flight mode to RTL returned.'});
                }).catch((error) => {
                    this.$log.log({ message: 'RTL requested from manual mode, setting flight mode to RTL returned error.', error: error });
                });
                break;
            case ButtonActions.SetHomePoint:
                //this.drone.FlightController.setHomePoint(lat/lng);
                break;
        
            default:
                break;
        }
    }

    handleStatusChange(systemStatus: SystemStatus): void {
        switch (systemStatus) {
            // System is active and might be already airborne. Motors are engaged.
            case SystemStatus.Active:
                this.flightControlMode.rtlButtonVisible = true;
                break;
            // System is booting up.
            case SystemStatus.Booting:
                this.flightControlMode.rtlButtonVisible = false;
                break;
            // System is calibrating and not flight-ready.
            case SystemStatus.Calibrating:
                this.flightControlMode.rtlButtonVisible = false;
                break;
            // System is in a non-normal flight mode. It can however still navigate.
            case SystemStatus.Critical:
                this.flightControlMode.rtlButtonVisible = true;
                break;
            // System is in a non-normal flight mode. It lost control over parts or over the whole airframe. It is in mayday and going down.
            case SystemStatus.Emergency:
                this.flightControlMode.rtlButtonVisible = true;
                break;
            // System just initialized its power-down sequence, will shut down now.
            case SystemStatus.PowerOff:
                this.flightControlMode.rtlButtonVisible = false;
                break;
            // System is grounded and on standby. It can be launched any time.
            case SystemStatus.Standby:
                this.flightControlMode.rtlButtonVisible = false;
                this.flightControlMode.hasLanded();
                break;
            // Uninitialized system, state is unknown.
            case SystemStatus.Unknown:
                this.flightControlMode.rtlButtonVisible = false;
                break;
            default:
                break;
        }
    }
}

export default angular.module('DroneSense.Web.FlightControlMode', [

]).component('dsFlightControlMode', {
    bindings: {
        sessionController: '<'
    },
    controller: FlightControlMode,
    templateUrl: './app/components/flightControlMode/flightControlMode.html'
});
