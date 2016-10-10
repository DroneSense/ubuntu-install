System.register(['backbone-events-standalone'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var backbone_events_standalone_1;
    var MapDrone;
    return {
        setters:[
            function (backbone_events_standalone_1_1) {
                backbone_events_standalone_1 = backbone_events_standalone_1_1;
            }],
        execute: function() {
            // export interface IMapDroneEvents extends IEventEmitter {
            //     on(eventName: string, callback?: Function, context?: any): any;
            //     on(eventName: 'locating-drone', callback?: (username: string) => void, context?: any): any;
            //     on(eventName: 'drone-located', callback?: (username: string) => void, context?: any): any;
            // }
            MapDrone = (function () {
                function MapDrone(mapEntityCollection) {
                    // Backbone events    
                    // on: (eventName: string, callback?: Function, context?: any) => any;
                    // once: (events: string, callback: Function, context?: any) => any;
                    // off: (eventName?: string, callback?: Function, context?: any) => any;
                    // protected trigger: (eventName: string, ...args: any[]) => any;
                    // Default distance for flyto
                    this.defaultZoomDistance = 20;
                    // Height correction factor applied to the model so that it appears to be on the ground.
                    this.modelHeightCorrection = .4;
                    this.terrainProvider = new Cesium.CesiumTerrainProvider({
                        url: 'https://www.cesiumcontent.com/api/terrain/world?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkMTM4ZDE2OS05NWYwLTQ0YmItOWY3YS0yNjEwOGE5Y2Y3NjYiLCJpZCI6NywiaWF0IjoxNDU1MjkyNzg5fQ.NDKlrwQZE_04ntDuL89hvatEmuycQo5llhtz3Mi6Wo0'
                    });
                    this.mapEntityCollection = mapEntityCollection;
                }
                MapDrone.prototype.initializeDrone = function (eventing, drone, map, color, isOwnerSession) {
                    var _this = this;
                    return new Promise(function (resolve) {
                        _this.map = map;
                        _this.drone = drone;
                        _this.eventing = eventing;
                        _this.pathColor = color;
                        _this.isOwnerSession = isOwnerSession;
                        _this.eventing.trigger('locating-drone');
                        _this.getDroneLocation().then(function () {
                            _this.startDronePositionUpdatesStream();
                            _this.createDrone();
                            _this.startInterval();
                            _this.drone.on('disconnected', function () {
                                console.log('drone disconnected');
                            });
                            _this.drone.on('connected', function () {
                                console.log('drone connected');
                            });
                            _this.drone.on('unreachable', function () {
                                console.log('drone unreachable');
                            });
                            _this.eventing.trigger('drone-located');
                            resolve(_this);
                        });
                    });
                };
                // Get the drone location and set its current values
                MapDrone.prototype.getDroneLocation = function () {
                    var _this = this;
                    return new Promise(function (resolve) {
                        _this.drone.FlightController.Telemetry.once('Position', function (value) {
                            console.log('getting drone position promise');
                            _this.currentLng = value.longitude;
                            _this.currentLat = value.lattitude;
                            _this.currentAlt = value.altitudeMSL + _this.modelHeightCorrection;
                            _this.currentHeading = Cesium.Math.toRadians(value.heading);
                            if (_this.drone.FlightController.Telemetry.Attitude) {
                                _this.currentPitch = _this.drone.FlightController.Telemetry.Attitude.pitch;
                                _this.currentRoll = _this.drone.FlightController.Telemetry.Attitude.roll;
                            }
                            _this.dronePosition = Cesium.Cartesian3.fromDegrees(_this.currentLng, _this.currentLat, _this.currentAlt);
                            // Check if owner session and get hae and set, if not just resolve
                            if (_this.isOwnerSession) {
                                _this.getDroneHAE(_this.currentLat, _this.currentLng).then(function (height) {
                                    _this.homeHAE = height;
                                    _this.drone.FlightController.enableAltitudeMSLOffset(true, height).then(function () {
                                        resolve();
                                    }).catch(function (error) {
                                        console.log(error);
                                    });
                                });
                            }
                            else {
                                _this.homeHAE = value.altitudeMSL - value.altitudeAGL;
                                resolve();
                            }
                        });
                    });
                };
                MapDrone.prototype.startDronePositionUpdatesStream = function () {
                    var _this = this;
                    this.drone.FlightController.Telemetry.on('Position', function (value) {
                        _this.currentLng = value.longitude;
                        _this.currentLat = value.lattitude;
                        _this.currentAlt = value.altitudeMSL + _this.modelHeightCorrection;
                        _this.currentHeading = Cesium.Math.toRadians(value.heading);
                        _this.currentPitch = _this.drone.FlightController.Telemetry.Attitude.pitch;
                        _this.currentRoll = _this.drone.FlightController.Telemetry.Attitude.roll;
                        _this.dronePosition = Cesium.Cartesian3.fromDegrees(_this.currentLng, _this.currentLat, _this.currentAlt);
                    });
                };
                MapDrone.prototype.getDroneHAE = function (latitude, longitude) {
                    var _this = this;
                    return new Promise(function (resolve) {
                        var positions;
                        if (latitude && longitude) {
                            positions = [
                                Cesium.Cartographic.fromDegrees(longitude, latitude)
                            ];
                        }
                        else {
                            positions = [
                                Cesium.Cartographic.fromDegrees(_this.currentLng, _this.currentLat)
                            ];
                        }
                        // Get terrain height at click location before adding takeoff point
                        Cesium.sampleTerrain(_this.terrainProvider, 15, positions).then(function (updatedPositions) {
                            resolve(updatedPositions[0].height);
                        });
                    });
                };
                MapDrone.prototype.createDrone = function () {
                    var _this = this;
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
                        position: this.extrapolatedDronePosition,
                        // This callback gets the drones position
                        // position: new Cesium.CallbackProperty(() => {
                        //     return this.dronePosition;
                        // }, true),
                        //Automatically compute orientation based on position movement.
                        //orientation : quaternion, // new Cesium.VelocityOrientationProperty(this.extrapolatedDronePosition),
                        orientation: new Cesium.CallbackProperty(function () {
                            return Cesium.Transforms.headingPitchRollQuaternion(_this.dronePosition, _this.currentHeading, _this.currentRoll, _this.currentPitch);
                        }, true),
                        //Load the Cesium plane model to represent the entity
                        model: {
                            //uri : './node_modules/phantom4_notexture.glb',
                            uri: './node_modules/DJI_Phantom_4_G6.glb',
                            scale: 2,
                            minimumPixelSize: 64,
                            // minimumPixelSize : 128,
                            maximumScale: 100,
                            shadows: Cesium.ShadowMode.CAST_ONLY
                        },
                    });
                };
                MapDrone.prototype.startInterval = function () {
                    var _this = this;
                    this.intervalTimer = setInterval(function () {
                        var time = Cesium.JulianDate.now();
                        try {
                            _this.extrapolatedDronePosition.addSample(time, _this.dronePosition);
                            // Drop track crumbs
                            _this.mapEntityCollection.entities.add({
                                position: _this.dronePosition,
                                point: {
                                    pixelSize: 5,
                                    color: Cesium.Color.fromCssColorString(_this.pathColor)
                                }
                            });
                        }
                        catch (error) {
                            console.log(error);
                        }
                    }, 1000);
                };
                MapDrone.prototype.flyToDroneOn3DMap = function () {
                    // Fly to drone location and rotate down
                    this.map.camera.flyTo({
                        destination: Cesium.Cartesian3.fromDegrees(this.currentLng, this.currentLat, this.currentAlt + this.defaultZoomDistance),
                        duration: 10,
                        complete: function () {
                            //this.map.camera.rotateDown(Cesium.Math.toRadians(-80));
                            //this.map.camera.rotateRight(Cesium.Math.toRadians(-70));
                        }
                    });
                };
                MapDrone.prototype.remove = function () {
                    // Turn off telemetry
                    this.drone.FlightController.Telemetry.off('Position');
                    // clear intervalTimer
                    clearInterval(this.intervalTimer);
                    // Remove drone from map
                    this.mapEntityCollection.entities.remove(this.droneEntity);
                    // TODO: Still need to remove the breadcrumbs once we have the new implementation
                };
                return MapDrone;
            }());
            exports_1("MapDrone", MapDrone);
            backbone_events_standalone_1.default.mixin(MapDrone.prototype);
        }
    }
});

//# sourceMappingURL=mapDrone.js.map
