System.register(['@dronesense/model/lib/common/Utility', '@dronesense/core/lib/common/enums/SystemStatus', '@dronesense/core/lib/common/enums/FlightMode'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Utility_1, SystemStatus_1, FlightMode_1;
    var FlightControlMode, ButtonActions, OrbitMode, GuidedMode, RTLMode, ManualMode;
    return {
        setters:[
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            },
            function (SystemStatus_1_1) {
                SystemStatus_1 = SystemStatus_1_1;
            },
            function (FlightMode_1_1) {
                FlightMode_1 = FlightMode_1_1;
            }],
        execute: function() {
            FlightControlMode = (function () {
                function FlightControlMode(bindings, red5proService, mdToast, $log) {
                    var _this = this;
                    this.bindings = bindings;
                    this.red5proService = red5proService;
                    this.mdToast = mdToast;
                    this.$log = $log;
                    // Flag to show RTL button
                    this.rtlButtonVisible = false;
                    this.rtlIndicatorVisible = false;
                    // Flag to show guided mode button
                    this.guidedModeButtonVisible = false;
                    this.changeToOrbitModeButtonVisible = false;
                    this.orbitModeButtonVisible = false;
                    this.targetAddActive = false;
                    this.addTargetButtonVisible = false;
                    this.changeToGuidedModeButtonVisible = false;
                    // Flag to show manual mode button
                    this.manualModeButtonVisible = false;
                    this.changeToManualModeButtonVisible = false;
                    // RTL mode button visibility
                    this.rtlModeButtonVisible = false;
                    // Flag to show takeoff command button
                    this.takeoffButtonVisible = false;
                    // Flag to show the flight resume button
                    this.resumeButtonVisible = false;
                    this.resumeIndicatorVisible = false;
                    // Flag to show the flight pause button
                    this.pauseButtonVisible = false;
                    this.pauseIndicatorVisible = false;
                    // Flag to show the set new home point button
                    this.setNewHomePointButtonVisible = false;
                    // Flag to show the change altitude button
                    this.changeAltitudeButtonVisible = false;
                    // Add waypoint button visible
                    this.addWaypointButtonVisible = false;
                    // Flag whether get altitude is visible
                    this.getTakeoffAltitudeVisible = false;
                    // Flag whether change altitude dialog is visible
                    this.getChangeAltitudeVisible = false;
                    this.modesOpen = false;
                    // Manual Mode
                    this.manualMode = new ManualMode(this.bindings.$ctrl, this.$log);
                    // Guided Mode
                    this.guidedMode = new GuidedMode(this.bindings.$ctrl, this.$log);
                    // RTL Mode
                    this.rtlMode = new RTLMode(this.bindings.$ctrl, this.$log);
                    // Orbit Mode
                    this.orbitMode = new OrbitMode(this.bindings.$ctrl, this.$log);
                    this.waypointAddActive = false;
                    this.showWaypointDialog = false;
                    this.waypointAltitudeValue = 50;
                    this.waypointSpeedValue = 5;
                    this.waypointFlyToNow = false;
                    this.showTargetDialog = false;
                    this.manualModeChangeIndicatorVisible = false;
                    this.guidedModeChangeIndicatorVisible = false;
                    this.rtlModeChangeIndicatorVisible = false;
                    this.orbitModeChangeIndicatorVisible = false;
                    this.targetLatLngAcquired = false;
                    this.takeoffAltitude = 50;
                    this.isRecordingFromTakeoff = false;
                    this.sendingTargetToDrone = false;
                    this.targetAltitude = 50;
                    this.targetRadius = 10;
                    this.targetDirection = true;
                    this.targetVelocity = 60;
                    this.wayPointNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ', 'BA', 'BB', 'BC', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ'];
                    this.nextNameIndex = 0;
                    this.sessionController.eventing.on('session-added', function (ownerSession) {
                        _this.sessionColor = ownerSession.color;
                        _this.drone = ownerSession.mapDrone.drone;
                        _this.status = _this.drone.FlightController.Telemetry.System.status;
                        _this.flightMode = _this.drone.FlightController.Telemetry.System.flightMode;
                        _this.setFlightModeState();
                        _this.drone.FlightController.Telemetry.on('System', function (value) {
                            // Check if status has changed
                            if (_this.status !== value.status) {
                                // Log the status change
                                _this.$log.log({ message: 'System Status Change', fromStatus: _this.status, toStatus: value.status });
                                // Set new status
                                _this.status = value.status;
                                // Check to see if current mode has been set
                                if (_this.currentMode) {
                                    _this.currentMode.handleStatusChange(_this.status);
                                }
                            }
                            // Check if flight mode has changed
                            if (_this.flightMode !== value.flightMode) {
                                // Log the mode change
                                _this.$log.log({ message: 'Flight Mode Change', fromMode: _this.flightMode, toMode: value.flightMode });
                                // Set new status
                                _this.flightMode = value.flightMode;
                                // Set current flight mode
                                _this.setFlightModeState();
                            }
                            if (_this.armed !== value.armed) {
                            }
                        });
                        _this.bindings.$applyAsync();
                    });
                    this.sessionController.eventing.on('map-loaded', function () {
                        _this.initializeMapMouseHandler();
                    });
                }
                FlightControlMode.prototype.setManualMode = function () {
                    var _this = this;
                    this.guidedModeChangeIndicatorVisible = true;
                    this.rtlModeChangeIndicatorVisible = true;
                    this.orbitModeChangeIndicatorVisible = true;
                    this.$log.log({ message: 'Set Manual Mode Requested' });
                    this.drone.FlightController.setFlightMode(FlightMode_1.FlightMode.Loiter).then(function () {
                        _this.$log.log({ message: 'Set Manual Mode Returned' });
                    }).catch(function (error) {
                        _this.$log.error({ message: 'Set Manual Mode Error.', error: error });
                    });
                };
                FlightControlMode.prototype.setGuidedMode = function () {
                    var _this = this;
                    this.manualModeChangeIndicatorVisible = true;
                    this.rtlModeChangeIndicatorVisible = true;
                    this.orbitModeChangeIndicatorVisible = true;
                    this.$log.log({ message: 'Set Guided Mode Requested' });
                    this.drone.FlightController.setFlightMode(FlightMode_1.FlightMode.Guided).then(function () {
                        _this.$log.log({ message: 'Set Guided Mode Returned' });
                    }).catch(function (error) {
                        _this.$log.error({ message: 'Set Guided Mode Error.', error: error });
                    });
                };
                FlightControlMode.prototype.setOrbitMode = function () {
                    var _this = this;
                    this.manualModeChangeIndicatorVisible = true;
                    this.rtlModeChangeIndicatorVisible = true;
                    this.guidedModeChangeIndicatorVisible = true;
                    this.$log.log({ message: 'Set Orbit Mode Requested' });
                    this.drone.FlightController.setFlightMode(FlightMode_1.FlightMode.Orbit).then(function () {
                        _this.$log.log({ message: 'Set Orbit Mode Returned' });
                    }).catch(function (error) {
                        _this.$log.error({ message: 'Set Orbit Mode Error.', error: error });
                    });
                };
                // Sets the flight mode state from this.drone.FlightController.Telemetry.on('System', (value: ISystem) callback
                FlightControlMode.prototype.setFlightModeState = function () {
                    // Teardown existing mode before requesting change
                    if (this.currentMode) {
                        this.currentMode.teardownUI();
                        this.bindings.$applyAsync();
                    }
                    // Set new mode based on these mappings
                    switch (this.flightMode) {
                        case FlightMode_1.FlightMode.Loiter:
                            this.currentMode = this.manualMode;
                            break;
                        case FlightMode_1.FlightMode.Stabilize:
                            this.currentMode = this.manualMode;
                            break;
                        case FlightMode_1.FlightMode.AltHold:
                            this.currentMode = this.manualMode;
                            break;
                        case FlightMode_1.FlightMode.Guided:
                            this.currentMode = this.guidedMode;
                            break;
                        case FlightMode_1.FlightMode.RTL:
                            this.currentMode = this.rtlMode;
                            break;
                        case FlightMode_1.FlightMode.Orbit:
                            this.currentMode = this.orbitMode;
                            break;
                        default:
                            this.currentMode = null;
                            this.$log.error({ message: 'Flight mode was not recognized and is set as null.' });
                            break;
                    }
                    // Setup new flight mode UI
                    if (this.currentMode) {
                        this.currentMode.initialize(this.status, this.flightMode, this.drone);
                        this.currentMode.setupUI();
                        this.bindings.$applyAsync();
                    }
                };
                // User clicked the RTL button in the user interface
                FlightControlMode.prototype.rtl = function () {
                    this.rtlIndicatorVisible = true;
                    this.currentMode.handleButtonClick(ButtonActions.RTL);
                    this.$log.log({ message: 'RTL button clicked, sending to flight mode for processing.' });
                };
                // User clicked the Takeoff button in the user interface
                FlightControlMode.prototype.takeoff = function () {
                    this.currentMode.handleButtonClick(ButtonActions.Takeoff);
                    this.$log.log({ message: 'Takeoff button clicked, sending to flight mode for processing.' });
                };
                // User clicked the resume button in the user interface
                FlightControlMode.prototype.resume = function () {
                    this.resumeIndicatorVisible = true;
                    this.currentMode.handleButtonClick(ButtonActions.Resume);
                    this.$log.log({ message: 'Resume button clicked, sending to flight mode for processing.' });
                };
                // User clicked the puase button in the user interface
                FlightControlMode.prototype.pause = function () {
                    this.pauseIndicatorVisible = true;
                    this.currentMode.handleButtonClick(ButtonActions.Pause);
                    this.$log.log({ message: 'Pause button clicked, sending to flight mode for processing.' });
                };
                // User clicked the set home point button in the user interface
                FlightControlMode.prototype.setHomePoint = function () {
                    this.currentMode.handleButtonClick(ButtonActions.SetHomePoint);
                    this.$log.log({ message: 'Set Home Point button clicked, sending to flight mode for processing.' });
                };
                // User clicked the change altitude button in the user interface
                FlightControlMode.prototype.changeAltitude = function () {
                    this.currentMode.handleButtonClick(ButtonActions.ChangeAltitude);
                    this.$log.log({ message: 'Changed Altitude button clicked, sending to flight mode for processing.' });
                };
                // User clicked the add waypoint button in the user interface
                FlightControlMode.prototype.addWaypoint = function () {
                    if (!this.mouseHandler) {
                        this.initializeMapMouseHandler();
                        this.$log.log({ message: 'Initializing Map Mouse Handler.' });
                    }
                    if (this.waypointAddActive) {
                        this.waypointAddActive = false;
                    }
                    else {
                        this.showWaypointDialog = true;
                        this.$log.log({ message: 'Showing waypoint dialog.' });
                    }
                };
                FlightControlMode.prototype.addOrbitTarget = function () {
                    if (!this.mouseHandler) {
                        this.initializeMapMouseHandler();
                        this.$log.log({ message: 'Initializing Map Mouse Handler.' });
                    }
                    if (this.targetAddActive) {
                        this.targetAddActive = false;
                        this.targetLatLngAcquired = false;
                        this.sessionController.activeSession.mapEntityCollection.entities.remove(this.currentOrbitTarget);
                        this.sessionController.activeSession.mapEntityCollection.entities.remove(this.currentOrbitRadius);
                        this.$log.log({ message: 'Orbit Selection Mode DeActivated, UI cleaned up.' });
                    }
                    else {
                        this.targetAddActive = true;
                        this.mdToast.show(this.mdToast.simple()
                            .content('Select orbit target on map.')
                            .position('top left')
                            .hideDelay(3000));
                        this.$log.log({ message: 'Orbit Selection Mode Active' });
                    }
                };
                // Called after user accepts takeoff parameters
                FlightControlMode.prototype.takeoffToAltitude = function () {
                    var _this = this;
                    this.$log.log({ message: 'Takeoff Requested on flight controller.' });
                    this.drone.FlightController.takeoff(this.takeoffAltitude).then(function () {
                        _this.$log.log({ message: 'Takeoff request returned.' });
                        if (_this.sessionController.ownerSession.startRecording) {
                            _this.$log.log({ message: 'Start Recording Requested.' });
                            _this.drone.Camera.startRecording().then(function () {
                                _this.isRecordingFromTakeoff = true;
                                _this.$log.log({ message: 'Start Recording Started.' });
                                // TODO: Removing until we get the CORS issued resolved.
                                // try {
                                //     this.red5proService.startVODRecording(this.sessionController.ownerSession.name).then((recording: boolean) => {
                                //         console.log('server vod recording started');
                                //     });
                                // } catch (error) {
                                //     console.log(error);
                                // }
                            }).catch(function (error) {
                                _this.$log.error({ message: 'Takeoff Start Recording Request Error.', error: error });
                            });
                        }
                    }).catch(function (error) {
                        _this.$log.error({ message: 'Takeoff request error.', error: error });
                    });
                    this.getTakeoffAltitudeVisible = false;
                };
                // Called from modes after drone status changes indicating a landing
                FlightControlMode.prototype.hasLanded = function () {
                    var _this = this;
                    if (this.isRecordingFromTakeoff) {
                        this.$log.log({ message: 'Recording Stop Requested.' });
                        if (this.sessionController.ownerSession.startRecording) {
                            this.drone.Camera.stopRecording().then(function () {
                                _this.$log.log({ message: 'Recording Stop Returned.' });
                                // try {
                                //     this.red5proService.stopVODRecording(this.sessionController.ownerSession.name).then((recording: boolean) => {
                                //         console.log('server vod recording stopped');
                                //         this.isRecordingFromTakeoff = false;
                                //     });
                                // } catch (error) {
                                //     console.log(error);
                                // }
                            }).catch(function (error) {
                                _this.$log.error({ message: 'Landing Stop Recording Request Error.', error: error });
                            });
                        }
                    }
                };
                FlightControlMode.prototype.cancelTakeoff = function () {
                    this.getTakeoffAltitudeVisible = false;
                    this.$log.log({ message: 'Takeoff Dialog Cancelled.' });
                };
                FlightControlMode.prototype.changeAltitudeTo = function () {
                    var _this = this;
                    // Make sure current mode is guided
                    if (this.currentMode.flightMode === FlightMode_1.FlightMode.Guided) {
                        // Set acceptance radius to 1 meter
                        this.drone.FlightController.Guided.setAcceptanceRadius(1);
                        this.$log.log({ message: 'Change altitude requested from guided mode.' });
                        // Call add waypoing for the altitude change.
                        this.drone.FlightController.Guided.addWaypoint({
                            lattitude: this.drone.FlightController.Telemetry.Position.lattitude,
                            longitude: this.drone.FlightController.Telemetry.Position.longitude,
                            altitude: this.changeAltitudeValue,
                            speed: 5,
                            name: this.getNextName()
                        }, true).then(function () {
                            _this.$log.log({ message: 'Change altitude requested returned from guided mode.' });
                        }).catch(function (error) {
                            _this.$log.error({ message: 'Change altitude requested error from guided mode.', error: error });
                        });
                        this.getChangeAltitudeVisible = false;
                    }
                    if (this.currentMode.flightMode === FlightMode_1.FlightMode.Orbit) {
                        // Convert time into angular velocity
                        var av = 360 / this.targetVelocity;
                        this.$log.log({ message: 'Orbit requested.', lat: this.targetLat, lng: this.targetLng, alt: this.targetAltitude, rad: this.targetRadius, dir: this.targetDirection, vel: av });
                        // Call new orbit code with new altitude
                        this.drone.FlightController.Orbit.orbit(this.targetLat, this.targetLng, this.changeAltitudeValue, this.targetRadius, this.targetDirection, av).then(function () {
                            _this.getChangeAltitudeVisible = false;
                            _this.$log.log({ message: 'Change altitude requested returned from orbit mode.' });
                        }).catch(function (error) {
                            // Keep dialog open and show error
                            _this.getChangeAltitudeVisible = false;
                            _this.$log.error({ message: 'Change altitude requested error from orbit mode.', error: error });
                        });
                    }
                };
                FlightControlMode.prototype.cancelChangeAltitude = function () {
                    this.getChangeAltitudeVisible = false;
                };
                FlightControlMode.prototype.closeWaypointDialog = function () {
                    this.showWaypointDialog = false;
                };
                FlightControlMode.prototype.closeActiveDialog = function () {
                    this.showTargetDialog = false;
                    this.targetAddActive = false;
                    this.targetLatLngAcquired = false;
                    this.sessionController.activeSession.mapEntityCollection.entities.remove(this.currentOrbitTarget);
                    this.sessionController.activeSession.mapEntityCollection.entities.remove(this.currentOrbitRadius);
                };
                FlightControlMode.prototype.setWaypointsActive = function () {
                    this.closeWaypointDialog();
                    this.waypointAddActive = true;
                };
                FlightControlMode.prototype.setTargetActive = function () {
                    var _this = this;
                    // Convert time into angular velocity
                    var av = 360 / this.targetVelocity;
                    // Check if number exceeds max velocity
                    this.$log.log({ message: 'Add code to check if orbit speed exceeds max angular velocity.' });
                    this.sendingTargetToDrone = true;
                    this.$log.log({ message: 'Orbit requested.', lat: this.targetLat, lng: this.targetLng, alt: this.targetAltitude, rad: this.targetRadius, dir: this.targetDirection, vel: av });
                    this.drone.FlightController.Orbit.orbit(this.targetLat, this.targetLng, this.targetAltitude, this.targetRadius, this.targetDirection, av).then(function () {
                        _this.showTargetDialog = false;
                        _this.targetAddActive = false;
                        _this.targetLatLngAcquired = false;
                        _this.sendingTargetToDrone = false;
                        _this.$log.log({ message: 'Orbit request returned.' });
                    }).catch(function (error) {
                        // Keep dialog open and show error
                        _this.sendingTargetToDrone = false;
                        _this.$log.error({ message: 'Orbit request returned an error.', error: error });
                    });
                };
                FlightControlMode.prototype.initializeMapMouseHandler = function () {
                    var _this = this;
                    // wire up left mouse click event
                    this.mouseHandler = new Cesium.ScreenSpaceEventHandler(this.sessionController.map.canvas, false);
                    this.mouseHandler.setInputAction(function (click) {
                        _this.handleMouseClick(click);
                    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                };
                FlightControlMode.prototype.handleMouseClick = function (click) {
                    var _this = this;
                    if (!this.waypointAddActive && !this.targetAddActive) {
                        return;
                    }
                    //let start: any = new Date().getTime();
                    var ray = this.sessionController.map.camera.getPickRay(click.position);
                    var position = this.sessionController.map.scene.globe.pick(ray, this.sessionController.map.scene);
                    //console.log(position);
                    if (Cesium.defined(position)) {
                        // Make the height of the position = 0 so it works with groundPrimitive
                        var positionCartographic = this.sessionController.map.scene.globe.ellipsoid.cartesianToCartographic(position);
                        positionCartographic.height = 0;
                        //position = this.map.scene.globe.ellipsoid.cartographicToCartesian(positionCartographic);
                        //var cartographic: Cesium.Cartographic = Cesium.Cartographic.fromCartesian(position);
                        var longitudeString = Cesium.Math.toDegrees(positionCartographic.longitude);
                        var latitudeString = Cesium.Math.toDegrees(positionCartographic.latitude);
                        if (this.waypointAddActive) {
                            this.$log.log({ message: 'User selected waypoint on map, making add waypoint request.' });
                            this.drone.FlightController.Guided.addWaypoint({
                                lattitude: latitudeString,
                                longitude: longitudeString,
                                altitude: this.waypointAltitudeValue,
                                speed: this.waypointSpeedValue,
                                name: this.getNextName()
                            }, this.waypointFlyToNow).then(function () {
                                _this.$log.log({ message: 'Add Waypoint Request Returned.' });
                            }).catch(function (error) {
                                _this.$log.log({ message: 'Add Waypoint Request Returned Error', error: error });
                            });
                        }
                        try {
                            if (this.targetAddActive) {
                                // If we have a target orbit point then calculate the radius distance and show dialog
                                if (this.targetLatLngAcquired) {
                                    var distance = Utility_1.Conversions.distance2(this.targetLat, this.targetLng, latitudeString, longitudeString);
                                    this.targetRadius = Utility_1.Conversions.roundToTwo(distance);
                                    this.targetAltitude = Utility_1.Conversions.roundToTwo(this.sessionController.ownerSession.mapDrone.currentAGLAlt);
                                    this.sessionController.activeSession.mapEntityCollection.entities.remove(this.currentOrbitRadius);
                                    this.currentOrbitRadius = this.sessionController.activeSession.mapEntityCollection.entities.add({
                                        position: Cesium.Cartesian3.fromDegrees(this.targetLng, this.targetLat, this.sessionController.ownerSession.mapDrone.currentAlt),
                                        ellipse: {
                                            semiMinorAxis: this.targetRadius,
                                            semiMajorAxis: this.targetRadius,
                                            height: this.sessionController.ownerSession.mapDrone.currentAlt,
                                            material: Cesium.Color.TRANSPARENT,
                                            outline: true,
                                            outlineColor: Cesium.Color.fromCssColorString('#0a92ea'),
                                            outlineWidth: 3
                                        }
                                    });
                                    this.showTargetDialog = true;
                                }
                                else {
                                    this.targetLat = latitudeString;
                                    this.targetLng = longitudeString;
                                    this.targetLatLngAcquired = true;
                                    this.sessionController.activeSession.mapEntityCollection.entities.remove(this.currentOrbitTarget);
                                    this.currentOrbitTarget = this.sessionController.activeSession.mapEntityCollection.entities.add({
                                        position: Cesium.Cartesian3.fromDegrees(longitudeString, latitudeString, 1),
                                        point: {
                                            color: Cesium.Color.fromCssColorString('#0a92ea'),
                                            pixelSize: 10,
                                            outlineColor: Cesium.Color.WHITE,
                                            outlineWidth: 3,
                                            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
                                        }
                                    });
                                    this.mdToast.show(this.mdToast.simple()
                                        .content('Select orbit radius point on map.')
                                        .position('top left')
                                        .hideDelay(3000));
                                }
                            }
                        }
                        catch (error) {
                            this.$log.error({ message: 'Error in orbit map adding UI code.', error: error });
                        }
                    }
                };
                FlightControlMode.prototype.getNextName = function () {
                    var current = this.nextNameIndex;
                    this.nextNameIndex++;
                    return this.wayPointNames[current];
                };
                // Constructor
                FlightControlMode.$inject = [
                    '$scope',
                    'redProService',
                    '$mdToast',
                    '$log'
                ];
                return FlightControlMode;
            }());
            (function (ButtonActions) {
                ButtonActions[ButtonActions["Takeoff"] = 0] = "Takeoff";
                ButtonActions[ButtonActions["RTL"] = 1] = "RTL";
                ButtonActions[ButtonActions["Resume"] = 2] = "Resume";
                ButtonActions[ButtonActions["Pause"] = 3] = "Pause";
                ButtonActions[ButtonActions["SetHomePoint"] = 4] = "SetHomePoint";
                ButtonActions[ButtonActions["ChangeAltitude"] = 5] = "ChangeAltitude";
                ButtonActions[ButtonActions["AddWaypoint"] = 6] = "AddWaypoint";
            })(ButtonActions || (ButtonActions = {}));
            OrbitMode = (function () {
                function OrbitMode(flightControlMode, $log) {
                    this.flightControlMode = flightControlMode;
                    this.$log = $log;
                }
                OrbitMode.prototype.initialize = function (systemStatus, flightMode, drone) {
                    var _this = this;
                    this.systemStatus = systemStatus;
                    this.flightMode = flightMode;
                    this.drone = drone;
                    this.drone.FlightController.Telemetry.on('System', function (value) {
                        _this.flightControlMode.pauseButtonVisible = !value.paused;
                        _this.flightControlMode.resumeButtonVisible = value.paused;
                        _this.flightControlMode.pauseIndicatorVisible = false;
                        _this.flightControlMode.resumeIndicatorVisible = false;
                    });
                };
                OrbitMode.prototype.setupUI = function () {
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
                };
                OrbitMode.prototype.teardownUI = function () {
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
                };
                OrbitMode.prototype.handleButtonClick = function (button) {
                    var _this = this;
                    switch (button) {
                        case ButtonActions.RTL:
                            this.$log.log({ message: 'Requesting RTL from Orbit Mode.' });
                            this.drone.FlightController.setFlightMode(FlightMode_1.FlightMode.RTL).then(function () {
                                _this.$log.log({ message: 'Request RTL from Orbit Mode returned.' });
                            }).catch(function (error) {
                                _this.$log.error({ message: 'Request RTL from Orbit Mode Error.', error: error });
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
                            this.$log.log({ message: 'Requesting Pause from Orbit Mode.' });
                            this.drone.FlightController.pause(true).then(function () {
                                _this.$log.log({ message: 'Request Pause from Orbit Mode returned.' });
                            }).catch(function (error) {
                                _this.$log.error({ message: 'Request Pause from Orbit Mode Error.', error: error });
                            });
                            break;
                        case ButtonActions.Resume:
                            this.$log.log({ message: 'Requesting Resume from Orbit Mode.' });
                            this.drone.FlightController.pause(false).then(function () {
                                _this.$log.log({ message: 'Request Resume from Orbit Mode returned.' });
                            }).catch(function (error) {
                                _this.$log.error({ message: 'Request Resume from Orbit Mode Error.', error: error });
                            });
                            break;
                        default:
                            break;
                    }
                };
                OrbitMode.prototype.handleStatusChange = function (systemStatus) {
                    switch (systemStatus) {
                        // System is active and might be already airborne. Motors are engaged.
                        case SystemStatus_1.SystemStatus.Active:
                            this.flightControlMode.rtlButtonVisible = true;
                            this.flightControlMode.changeAltitudeButtonVisible = true;
                            this.flightControlMode.pauseButtonVisible = true;
                            this.flightControlMode.setNewHomePointButtonVisible = true;
                            this.flightControlMode.addTargetButtonVisible = true;
                            break;
                        // System is booting up.
                        case SystemStatus_1.SystemStatus.Booting:
                            this.flightControlMode.rtlButtonVisible = false;
                            break;
                        // System is calibrating and not flight-ready.
                        case SystemStatus_1.SystemStatus.Calibrating:
                            this.flightControlMode.rtlButtonVisible = false;
                            break;
                        // System is in a non-normal flight mode. It can however still navigate.
                        case SystemStatus_1.SystemStatus.Critical:
                            this.flightControlMode.rtlButtonVisible = true;
                            break;
                        // System is in a non-normal flight mode. It lost control over parts or over the whole airframe. It is in mayday and going down.
                        case SystemStatus_1.SystemStatus.Emergency:
                            this.flightControlMode.rtlButtonVisible = true;
                            break;
                        // System just initialized its power-down sequence, will shut down now.
                        case SystemStatus_1.SystemStatus.PowerOff:
                            this.flightControlMode.rtlButtonVisible = false;
                            break;
                        // System is grounded and on standby. It can be launched any time.
                        case SystemStatus_1.SystemStatus.Standby:
                            this.flightControlMode.rtlButtonVisible = false;
                            this.flightControlMode.hasLanded();
                            break;
                        // Uninitialized system, state is unknown.
                        case SystemStatus_1.SystemStatus.Unknown:
                            this.flightControlMode.rtlButtonVisible = false;
                            break;
                        default:
                            break;
                    }
                };
                return OrbitMode;
            }());
            GuidedMode = (function () {
                function GuidedMode(flightControlMode, $log) {
                    this.flightControlMode = flightControlMode;
                    this.$log = $log;
                }
                GuidedMode.prototype.initialize = function (systemStatus, flightMode, drone) {
                    var _this = this;
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
                    this.drone.FlightController.Telemetry.on('System', function (value) {
                        _this.flightControlMode.pauseButtonVisible = !value.paused;
                        _this.flightControlMode.resumeButtonVisible = value.paused;
                        _this.flightControlMode.pauseIndicatorVisible = false;
                        _this.flightControlMode.resumeIndicatorVisible = false;
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
                };
                GuidedMode.prototype.setupUI = function () {
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
                };
                GuidedMode.prototype.teardownUI = function () {
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
                };
                GuidedMode.prototype.handleButtonClick = function (button) {
                    var _this = this;
                    switch (button) {
                        case ButtonActions.RTL:
                            this.$log.log({ message: 'Requesting RTL from Guided Mode.' });
                            this.drone.FlightController.setFlightMode(FlightMode_1.FlightMode.RTL).then(function () {
                                _this.$log.log({ message: 'Request RTL from Guided Mode returned.' });
                            }).catch(function (error) {
                                _this.$log.error({ message: 'Request RTL from Guided Mode Error.', error: error });
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
                            this.$log.log({ message: 'Requesting Pause from Guided Mode.' });
                            this.drone.FlightController.pause(true).then(function () {
                                _this.$log.log({ message: 'Request Pause from Guided Mode returned.' });
                            }).catch(function (error) {
                                _this.$log.error({ message: 'Request Pause from Guided Mode Error.', error: error });
                            });
                            break;
                        case ButtonActions.Resume:
                            this.$log.log({ message: 'Requesting Resume from Guided Mode.' });
                            this.drone.FlightController.pause(false).then(function () {
                                _this.$log.log({ message: 'Request Resume from Guided Mode returned.' });
                            }).catch(function (error) {
                                _this.$log.error({ message: 'Request Resume from Guided Mode Error.', error: error });
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
                };
                GuidedMode.prototype.handleStatusChange = function (systemStatus) {
                    switch (systemStatus) {
                        // System is active and might be already airborne. Motors are engaged.
                        case SystemStatus_1.SystemStatus.Active:
                            this.flightControlMode.rtlButtonVisible = true;
                            this.flightControlMode.changeAltitudeButtonVisible = true;
                            this.flightControlMode.pauseButtonVisible = true;
                            this.flightControlMode.setNewHomePointButtonVisible = true;
                            this.flightControlMode.takeoffButtonVisible = false;
                            break;
                        // System is booting up.
                        case SystemStatus_1.SystemStatus.Booting:
                            this.flightControlMode.rtlButtonVisible = false;
                            break;
                        // System is calibrating and not flight-ready.
                        case SystemStatus_1.SystemStatus.Calibrating:
                            this.flightControlMode.rtlButtonVisible = false;
                            break;
                        // System is in a non-normal flight mode. It can however still navigate.
                        case SystemStatus_1.SystemStatus.Critical:
                            this.flightControlMode.rtlButtonVisible = true;
                            break;
                        // System is in a non-normal flight mode. It lost control over parts or over the whole airframe. It is in mayday and going down.
                        case SystemStatus_1.SystemStatus.Emergency:
                            this.flightControlMode.rtlButtonVisible = true;
                            break;
                        // System just initialized its power-down sequence, will shut down now.
                        case SystemStatus_1.SystemStatus.PowerOff:
                            this.flightControlMode.rtlButtonVisible = false;
                            break;
                        // System is grounded and on standby. It can be launched any time.
                        case SystemStatus_1.SystemStatus.Standby:
                            this.flightControlMode.rtlButtonVisible = false;
                            this.flightControlMode.takeoffButtonVisible = true;
                            this.flightControlMode.hasLanded();
                            break;
                        // Uninitialized system, state is unknown.
                        case SystemStatus_1.SystemStatus.Unknown:
                            this.flightControlMode.rtlButtonVisible = false;
                            break;
                        default:
                            break;
                    }
                };
                return GuidedMode;
            }());
            RTLMode = (function () {
                function RTLMode(flightControlMode, $log) {
                    this.flightControlMode = flightControlMode;
                    this.$log = $log;
                }
                RTLMode.prototype.initialize = function (systemStatus, flightMode, drone) {
                    this.systemStatus = systemStatus;
                    this.flightMode = flightMode;
                    this.drone = drone;
                };
                RTLMode.prototype.setupUI = function () {
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
                };
                RTLMode.prototype.teardownUI = function () {
                    this.flightControlMode.rtlModeButtonVisible = false;
                    this.flightControlMode.pauseButtonVisible = false;
                    this.flightControlMode.changeToManualModeButtonVisible = false;
                    this.flightControlMode.changeToGuidedModeButtonVisible = false;
                };
                RTLMode.prototype.handleButtonClick = function (button) {
                    var _this = this;
                    switch (button) {
                        case ButtonActions.Pause:
                            this.$log.log({ message: 'Pause requested from RTL mode, setting mode to Guided.' });
                            this.drone.FlightController.setFlightMode(FlightMode_1.FlightMode.Guided).then(function () {
                                _this.$log.log({ message: 'Pause requested from RTL mode, setting mode to Guided returned.' });
                            }).catch(function (error) {
                                _this.$log.log({ message: 'Pause requested from RTL mode, setting mode to Guided returned error.', error: error });
                            });
                            break;
                        default:
                            break;
                    }
                };
                RTLMode.prototype.handleStatusChange = function (systemStatus) {
                    switch (systemStatus) {
                        // System is active and might be already airborne. Motors are engaged.
                        case SystemStatus_1.SystemStatus.Active:
                            this.flightControlMode.pauseButtonVisible = true;
                            break;
                        // System is booting up.
                        case SystemStatus_1.SystemStatus.Booting:
                            break;
                        // System is calibrating and not flight-ready.
                        case SystemStatus_1.SystemStatus.Calibrating:
                            break;
                        // System is in a non-normal flight mode. It can however still navigate.
                        case SystemStatus_1.SystemStatus.Critical:
                            break;
                        // System is in a non-normal flight mode. It lost control over parts or over the whole airframe. It is in mayday and going down.
                        case SystemStatus_1.SystemStatus.Emergency:
                            break;
                        // System just initialized its power-down sequence, will shut down now.
                        case SystemStatus_1.SystemStatus.PowerOff:
                            break;
                        // System is grounded and on standby. It can be launched any time.
                        case SystemStatus_1.SystemStatus.Standby:
                            this.flightControlMode.pauseButtonVisible = false;
                            this.flightControlMode.hasLanded();
                            break;
                        // Uninitialized system, state is unknown.
                        case SystemStatus_1.SystemStatus.Unknown:
                            break;
                        default:
                            break;
                    }
                };
                return RTLMode;
            }());
            ManualMode = (function () {
                function ManualMode(flightControlMode, $log) {
                    this.flightControlMode = flightControlMode;
                    this.$log = $log;
                }
                ManualMode.prototype.initialize = function (systemStatus, flightMode, drone) {
                    this.systemStatus = systemStatus;
                    this.flightMode = flightMode;
                    this.drone = drone;
                };
                ManualMode.prototype.setupUI = function () {
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
                };
                ManualMode.prototype.teardownUI = function () {
                    this.flightControlMode.manualModeButtonVisible = false;
                    this.flightControlMode.setNewHomePointButtonVisible = false;
                    this.flightControlMode.rtlButtonVisible = false;
                    this.flightControlMode.changeToGuidedModeButtonVisible = false;
                    this.flightControlMode.changeToOrbitModeButtonVisible = false;
                };
                ManualMode.prototype.handleButtonClick = function (button) {
                    var _this = this;
                    switch (button) {
                        case ButtonActions.RTL:
                            this.$log.log({ message: 'RTL requested from manual mode, setting flight mode to RTL.' });
                            this.drone.FlightController.setFlightMode(FlightMode_1.FlightMode.RTL).then(function () {
                                _this.$log.log({ message: 'RTL requested from manual mode, setting flight mode to RTL returned.' });
                            }).catch(function (error) {
                                _this.$log.log({ message: 'RTL requested from manual mode, setting flight mode to RTL returned error.', error: error });
                            });
                            break;
                        case ButtonActions.SetHomePoint:
                            //this.drone.FlightController.setHomePoint(lat/lng);
                            break;
                        default:
                            break;
                    }
                };
                ManualMode.prototype.handleStatusChange = function (systemStatus) {
                    switch (systemStatus) {
                        // System is active and might be already airborne. Motors are engaged.
                        case SystemStatus_1.SystemStatus.Active:
                            this.flightControlMode.rtlButtonVisible = true;
                            break;
                        // System is booting up.
                        case SystemStatus_1.SystemStatus.Booting:
                            this.flightControlMode.rtlButtonVisible = false;
                            break;
                        // System is calibrating and not flight-ready.
                        case SystemStatus_1.SystemStatus.Calibrating:
                            this.flightControlMode.rtlButtonVisible = false;
                            break;
                        // System is in a non-normal flight mode. It can however still navigate.
                        case SystemStatus_1.SystemStatus.Critical:
                            this.flightControlMode.rtlButtonVisible = true;
                            break;
                        // System is in a non-normal flight mode. It lost control over parts or over the whole airframe. It is in mayday and going down.
                        case SystemStatus_1.SystemStatus.Emergency:
                            this.flightControlMode.rtlButtonVisible = true;
                            break;
                        // System just initialized its power-down sequence, will shut down now.
                        case SystemStatus_1.SystemStatus.PowerOff:
                            this.flightControlMode.rtlButtonVisible = false;
                            break;
                        // System is grounded and on standby. It can be launched any time.
                        case SystemStatus_1.SystemStatus.Standby:
                            this.flightControlMode.rtlButtonVisible = false;
                            this.flightControlMode.hasLanded();
                            break;
                        // Uninitialized system, state is unknown.
                        case SystemStatus_1.SystemStatus.Unknown:
                            this.flightControlMode.rtlButtonVisible = false;
                            break;
                        default:
                            break;
                    }
                };
                return ManualMode;
            }());
            exports_1("default",angular.module('DroneSense.Web.FlightControlMode', []).component('dsFlightControlMode', {
                bindings: {
                    sessionController: '<'
                },
                controller: FlightControlMode,
                templateUrl: './app/components/flightControlMode/flightControlMode.html'
            }));
        }
    }
});

//# sourceMappingURL=flightControlMode.js.map
