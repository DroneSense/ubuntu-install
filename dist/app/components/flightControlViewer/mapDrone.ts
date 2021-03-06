
import IDrone from '@dronesense/core/lib/common/IDrone';
import IPosition from '@dronesense/core/lib/common/entities/IPosition';
import { FlightControlViewerEventing } from './flightControlViewer';
import { IEventEmitter } from '@dronesense/core/lib/common/IEventEmitter';
import BackboneEvents from 'backbone-events-standalone';

export interface IMapDroneEvents extends IEventEmitter {
    on(eventName: string, callback?: Function, context?: any): any;
    on(eventName: 'locating-drone', callback?: (username: string) => void, context?: any): any;
    on(eventName: 'drone-located', callback?: (username: string) => void, context?: any): any;
    on(eventName: 'drone-connected', callback?: (username: string) => void, context?: any): any;
    on(eventName: 'drone-disconnected', callback?: (username: string) => void, context?: any): any;
    on(eventName: 'drone-unreachable', callback?: (username: string) => void, context?: any): any;
}

export class MapDrone implements IMapDroneEvents {

    on: (eventName: string, callback?: Function, context?: any) => any;
    once: (events: string, callback: Function, context?: any) => any;
    off: (eventName?: string, callback?: Function, context?: any) => any;
    trigger: (eventName: string, ...args: any[]) => any;

    // Default distance for flyto
    defaultZoomDistance: number = 10;

    // Current map
    map: Cesium.Viewer;

    // Session drone
    drone: IDrone;

    // Drone entity on map
    droneEntity: Cesium.Entity;

    // Hold updated position from telemetry stream
    dronePosition: Cesium.Cartesian3;

    // Property update
    extrapolatedDronePosition: Cesium.SampledPositionProperty;

    eventing: FlightControlViewerEventing;

    // The current longitude reported from the drone
    currentLng: number;

    // The current lat reported from the drone
    currentLat: number;

    // The current msl alititude repported from the drone
    currentAlt: number;

    // Current AGL altitude
    currentAGLAlt: number;

    // Current heading value
    currentHeading: number;

    // Current pitch
    currentPitch: number;

    // Current roll
    currentRoll: number;

    // Home location height above terrain
    homeHAE: number = 0;

    // Color for session id
    pathColor: string;

    // Variable for interval timer
    intervalTimer: any;

    // Reference to parent sessions entity collection
    mapEntityCollection: Cesium.CustomDataSource;

    // Height correction factor applied to the model so that it appears to be on the ground.
    modelHeightCorrection: number = .4;

    // flag to indicate if this sessino is an owner session so we can handle lookup
    isOwnerSession: boolean;

    constructor(mapEntityCollection: Cesium.CustomDataSource, public $log: angular.ILogService) {
        this.mapEntityCollection = mapEntityCollection;
    }

    initializeDrone(eventing: FlightControlViewerEventing, drone: IDrone, map: Cesium.Viewer, color: string, isOwnerSession: boolean): Promise<MapDrone> {

        return new Promise<MapDrone>((resolve) => {

            this.map = map;
            this.drone = drone;
            this.eventing = eventing;
            this.pathColor = color;
            this.isOwnerSession = isOwnerSession;

            this.$log.log({ message: 'Locating Drone' });
            this.trigger('locating-drone');
            this.eventing.trigger('locating-drone');

            this.getDroneLocation().then(() => {

                this.startDronePositionUpdatesStream();

                this.createDrone();

                this.startInterval();

                this.drone.on('disconnected', () => {
                    this.trigger('drone-disconnected');
                    this.$log.log({ message: 'Drone Disconnected'});
                });

                this.drone.on('connected', () => {
                    this.trigger('drone-connected');
                    this.$log.log({ message: 'Drone Connected'});
                });

                this.drone.on('unreachable', () => {
                    this.trigger('drone-unreachable');
                    this.$log.log({ message: 'Drone Unreachable'});
                });

                this.trigger('drone-located');
                this.eventing.trigger('drone-located');
                this.$log.log({ message: 'Drone Located', lat: this.currentLat, lng: this.currentLng});

                resolve(this);
            });

        });

    }

    // Get the drone location and set its current values
    getDroneLocation(): Promise<void> {
        
        return new Promise<void>((resolve) => {

            try {

                this.drone.FlightController.Telemetry.once('Position', (value: IPosition) => {
                    
                    this.currentLng = value.longitude;
                    this.currentLat = value.lattitude;
                    this.currentAlt = value.altitudeMSL + this.modelHeightCorrection;
                    this.currentAGLAlt = value.altitudeAGL;
                    this.currentHeading = Cesium.Math.toRadians(value.heading);

                    if (this.drone.FlightController.Telemetry.Attitude) {
                        this.currentPitch = this.drone.FlightController.Telemetry.Attitude.pitch;
                        this.currentRoll = this.drone.FlightController.Telemetry.Attitude.roll;
                    }
                    
                    this.dronePosition = Cesium.Cartesian3.fromDegrees(this.currentLng, this.currentLat, this.currentAlt);

                    // Check if owner session and get hae and set, if not just resolve
                    if (this.isOwnerSession) {

                        this.getDroneHAE(this.currentLat, this.currentLng).then((height: number) => {
                            
                            if (height) {
                                this.homeHAE = height;
                            }

                            this.drone.FlightController.enableAltitudeMSLOffset(true, height).then(() => {

                            resolve();

                            }).catch((error) => {
                                this.$log.error({ message: 'Error from EnableAltitudeMSLOffset.', error: error});
                            });
                        });
                    } else {
                        this.homeHAE = value.altitudeMSL - value.altitudeAGL;
                        resolve();
                    }

                });

            } catch (error) {
                this.$log.error({ message: 'Error in getting telemetry position.', error: error});
            }
        });

    }

    startDronePositionUpdatesStream(): void {

        this.drone.FlightController.Telemetry.on('Position', (value: IPosition) => {
                
            this.currentLng = value.longitude;
            this.currentLat = value.lattitude;
            this.currentAlt = value.altitudeMSL + this.modelHeightCorrection;
            this.currentAGLAlt = value.altitudeAGL;
            this.currentHeading = Cesium.Math.toRadians(value.heading);
            this.currentPitch = this.drone.FlightController.Telemetry.Attitude.pitch;
            this.currentRoll = this.drone.FlightController.Telemetry.Attitude.roll;

            this.dronePosition = Cesium.Cartesian3.fromDegrees(this.currentLng, this.currentLat, this.currentAlt);

        });
    }

    terrainProvider: any = new Cesium.CesiumTerrainProvider({
        url : 'https://www.cesiumcontent.com/api/terrain/world?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkMTM4ZDE2OS05NWYwLTQ0YmItOWY3YS0yNjEwOGE5Y2Y3NjYiLCJpZCI6NywiaWF0IjoxNDU1MjkyNzg5fQ.NDKlrwQZE_04ntDuL89hvatEmuycQo5llhtz3Mi6Wo0'
        //url: '//assets.agi.com/stk-terrain/world'
    });

    getDroneHAE(latitude?: number, longitude?: number): Promise<number> {
                
        return new Promise<number>((resolve) => {

            let positions: Array<Cesium.Cartographic>;

            if (latitude && longitude) {
                 positions = [
                    Cesium.Cartographic.fromDegrees(longitude, latitude)
                ];
            } else {
                positions = [
                    Cesium.Cartographic.fromDegrees(this.currentLng, this.currentLat)
                ];
            }

            try {

                // Get terrain height at click location before adding takeoff point
                Cesium.sampleTerrain(this.terrainProvider, 15, positions).then((updatedPositions: any): void => {
                    
                    resolve(updatedPositions[0].height);

                });
            } catch (error) {
                this.$log.error({ message: 'Error in Cesium sample terrain.', error: error});
            }

        });
    }

    createDrone(): void {
        
        // First initialize the position property
        this.extrapolatedDronePosition = new Cesium.SampledPositionProperty();
        this.extrapolatedDronePosition.forwardExtrapolationDuration = 0;
        this.extrapolatedDronePosition.forwardExtrapolationType = Cesium.ExtrapolationType.EXTRAPOLATE;
        // this.extrapolatedDronePosition.setInterpolationOptions({
        //     interpolationDegree : 0,
        //     interpolationAlgorithm : Cesium.HermitePolynomialApproximation
        // });

        // Get the quaternion from local heading-pitch-roll at cartographic (0.0, 0.0) to Earth's fixed frame.
        // let center: Cesium.Cartesian3 = Cesium.Cartesian3.fromDegrees(0, 0, 0);
        // let heading: number = 0; // this.drone.FlightController.Telemetry.Position.heading;
        // let pitch: number = 0; // this.drone.FlightController.Telemetry.Attitude.pitch;
        // let roll: number = 0; //this.drone.FlightController.Telemetry.Attitude.roll;
        // let quaternion: Cesium.Quaternion = Cesium.Transforms.headingPitchRollQuaternion(center, this.currentHeading, pitch, roll);
        
        // Add to map entities
        this.droneEntity = this.mapEntityCollection.entities.add({

            //Use our computed positions
            position : this.extrapolatedDronePosition,

            // This callback gets the drones position
            // position: new Cesium.CallbackProperty(() => {
            //     return this.dronePosition;
            // }, true),

            //Automatically compute orientation based on position movement.
            //orientation : quaternion, // new Cesium.VelocityOrientationProperty(this.extrapolatedDronePosition),

            orientation: new Cesium.CallbackProperty(() => {
                return Cesium.Transforms.headingPitchRollQuaternion(this.dronePosition, this.currentHeading, this.currentRoll, this.currentPitch);
            }, true),

            //Load the Cesium plane model to represent the entity
            model : {
                //uri : './node_modules/phantom4_notexture.glb',
                uri : './node_modules/DJI_Phantom_4_G6.glb',
                scale: 2,
                minimumPixelSize : 64,
                // minimumPixelSize : 128,
                maximumScale : 100,
                shadows: Cesium.ShadowMode.CAST_ONLY
            }
        });

    }

    startInterval(): void {

        this.intervalTimer = setInterval(() => {

            var time: Cesium.JulianDate = Cesium.JulianDate.now();

            try {

                this.extrapolatedDronePosition.addSample(time, this.dronePosition);

                // Drop track crumbs
                this.mapEntityCollection.entities.add({
                    position : this.dronePosition,
                    point : {
                        pixelSize : 5,
                        color : Cesium.Color.fromCssColorString(this.pathColor)
                    }
                });

            } catch (error) {
                this.$log.error({ message: 'Error in adding sample time to extrapolatedDronePosition.', error: error});
            }

        }, 1000);
    }

    flyToDroneOn3DMap(): void {

        try {

            // Fly to drone location and rotate down
            this.map.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(this.currentLng, this.currentLat, this.currentAGLAlt + this.homeHAE + this.defaultZoomDistance),
                duration: 10,
                complete: (): void => {
                    
                    this.map.camera.rotateDown(Cesium.Math.toRadians(-80));
                }
            });
        } catch (error) {
            this.$log.error({ message: 'Error in fly to drone position.', error: error});
        }
    }

    remove(): void {
        // Turn off telemetry
        this.drone.FlightController.Telemetry.off('Position');

        // clear intervalTimer
        clearInterval(this.intervalTimer);
        
        // Remove drone from map
        this.mapEntityCollection.entities.remove(this.droneEntity);

        // TODO: Still need to remove the breadcrumbs once we have the new implementation
    }
}

BackboneEvents.mixin(MapDrone.prototype);
