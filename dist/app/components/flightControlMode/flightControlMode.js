System.register(['@dronesense/core/lib/common/enums/SystemStatus', '@dronesense/core/lib/common/enums/FlightMode'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SystemStatus_1, FlightMode_1;
    var FlightControlMode, ButtonActions, GuidedMode, RTLMode, ManualMode;
    return {
        setters:[
            function (SystemStatus_1_1) {
                SystemStatus_1 = SystemStatus_1_1;
            },
            function (FlightMode_1_1) {
                FlightMode_1 = FlightMode_1_1;
            }],
        execute: function() {
            FlightControlMode = (function () {
                function FlightControlMode(bindings) {
                    var _this = this;
                    this.bindings = bindings;
                    // Flag to show RTL button
                    this.rtlButtonVisible = false;
                    this.rtlIndicatorVisible = false;
                    // Flag to show guided mode button
                    this.guidedModeButtonVisible = false;
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
                    this.manualMode = new ManualMode(this.bindings.$ctrl);
                    // Guided Mode
                    this.guidedMode = new GuidedMode(this.bindings.$ctrl);
                    // RTL Mode
                    this.rtlMode = new RTLMode(this.bindings.$ctrl);
                    this.waypointAddActive = false;
                    this.showWaypointDialog = false;
                    this.waypointAltitudeValue = 50;
                    this.waypointSpeedValue = 5;
                    this.waypointFlyToNow = false;
                    this.takeoffAltitude = 50;
                    this.wayPointNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ',];
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
                                // Set new status
                                _this.status = value.status;
                                // Check to see if current mode has been set
                                if (_this.currentMode) {
                                    _this.currentMode.handleStatusChange(_this.status);
                                }
                            }
                            // Check if flight mode has changed
                            if (_this.flightMode !== value.flightMode) {
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
                    this.drone.FlightController.setFlightMode(FlightMode_1.FlightMode.Loiter).then(function () {
                    }).catch(function (error) {
                    });
                };
                FlightControlMode.prototype.setGuidedMode = function () {
                    this.drone.FlightController.setFlightMode(FlightMode_1.FlightMode.Guided).then(function () {
                    }).catch(function (error) {
                    });
                };
                FlightControlMode.prototype.setFlightModeState = function () {
                    if (this.currentMode) {
                        this.currentMode.teardownUI();
                        this.bindings.$applyAsync();
                    }
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
                        default:
                            this.currentMode = null;
                            break;
                    }
                    if (this.currentMode) {
                        this.currentMode.initialize(this.status, this.flightMode, this.drone);
                        this.currentMode.setupUI();
                        this.bindings.$applyAsync();
                    }
                };
                FlightControlMode.prototype.rtl = function () {
                    this.rtlIndicatorVisible = true;
                    this.currentMode.handleButtonClick(ButtonActions.RTL);
                };
                FlightControlMode.prototype.takeoff = function () {
                    this.currentMode.handleButtonClick(ButtonActions.Takeoff);
                };
                FlightControlMode.prototype.resume = function () {
                    this.resumeIndicatorVisible = true;
                    this.currentMode.handleButtonClick(ButtonActions.Resume);
                };
                FlightControlMode.prototype.pause = function () {
                    this.pauseIndicatorVisible = true;
                    this.currentMode.handleButtonClick(ButtonActions.Pause);
                };
                FlightControlMode.prototype.setHomePoint = function () {
                    this.currentMode.handleButtonClick(ButtonActions.SetHomePoint);
                };
                FlightControlMode.prototype.changeAltitude = function () {
                    this.currentMode.handleButtonClick(ButtonActions.ChangeAltitude);
                };
                FlightControlMode.prototype.addWaypoint = function () {
                    if (!this.mouseHandler) {
                        console.log('initialize mouse handler');
                        this.initializeMapMouseHandler();
                    }
                    if (this.waypointAddActive) {
                        this.waypointAddActive = false;
                    }
                    else {
                        this.showWaypointDialog = true;
                    }
                };
                FlightControlMode.prototype.takeoffToAltitude = function () {
                    this.drone.FlightController.takeoff(this.takeoffAltitude).then(function () {
                    }).catch(function (error) {
                        console.log(error);
                    });
                    this.getTakeoffAltitudeVisible = false;
                };
                FlightControlMode.prototype.cancelTakeoff = function () {
                    this.getTakeoffAltitudeVisible = false;
                };
                FlightControlMode.prototype.changeAltitudeTo = function () {
                    this.drone.FlightController.Guided.setAcceptanceRadius(1);
                    this.drone.FlightController.Guided.addWaypoint({
                        lattitude: this.drone.FlightController.Telemetry.Position.lattitude,
                        longitude: this.drone.FlightController.Telemetry.Position.longitude,
                        altitude: this.changeAltitudeValue,
                        speed: 5,
                        name: this.getNextName()
                    }, true).then(function () {
                    }).catch(function (error) {
                        console.log(error);
                    });
                    this.getChangeAltitudeVisible = false;
                };
                FlightControlMode.prototype.cancelChangeAltitude = function () {
                    this.getChangeAltitudeVisible = false;
                };
                FlightControlMode.prototype.closeWaypointDialog = function () {
                    this.showWaypointDialog = false;
                };
                FlightControlMode.prototype.setWaypointsActive = function () {
                    this.closeWaypointDialog();
                    this.waypointAddActive = true;
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
                    if (!this.waypointAddActive) {
                        return;
                    }
                    var start = new Date().getTime();
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
                        this.drone.FlightController.Guided.addWaypoint({
                            lattitude: latitudeString,
                            longitude: longitudeString,
                            altitude: this.waypointAltitudeValue,
                            speed: this.waypointSpeedValue,
                            name: this.getNextName()
                        }, this.waypointFlyToNow).then(function () {
                            // console.log('waypoing added callback');
                            var end = new Date().getTime();
                            var time = end - start;
                            console.log('Execution time: ' + time);
                        });
                    }
                };
                FlightControlMode.prototype.getNextName = function () {
                    var current = this.nextNameIndex;
                    this.nextNameIndex++;
                    return this.wayPointNames[current];
                };
                // Constructor
                FlightControlMode.$inject = [
                    '$scope'
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
            GuidedMode = (function () {
                function GuidedMode(flightControlMode) {
                    this.flightControlMode = flightControlMode;
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
                    this.flightControlMode.addWaypointButtonVisible = true;
                    this.flightControlMode.setNewHomePointButtonVisible = true;
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
                    this.flightControlMode.addWaypointButtonVisible = false;
                };
                GuidedMode.prototype.handleButtonClick = function (button) {
                    switch (button) {
                        case ButtonActions.RTL:
                            this.drone.FlightController.setFlightMode(FlightMode_1.FlightMode.RTL).then(function () {
                            }).catch(function (error) {
                                // TODO: handle error changing modes
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
                            this.drone.FlightController.pause(true).then(function () {
                            }).catch(function (error) {
                                console.log(error);
                            });
                            break;
                        case ButtonActions.Resume:
                            this.drone.FlightController.pause(false).then(function () {
                            }).catch(function (error) {
                                console.log(error);
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
                function RTLMode(flightControlMode) {
                    this.flightControlMode = flightControlMode;
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
                    switch (button) {
                        case ButtonActions.Pause:
                            this.drone.FlightController.setFlightMode(FlightMode_1.FlightMode.Guided).then(function () {
                            }).catch(function (error) {
                                console.log(error);
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
                function ManualMode(flightControlMode) {
                    this.flightControlMode = flightControlMode;
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
                    // Let status change handle status specific buttons
                    this.handleStatusChange(this.systemStatus);
                };
                ManualMode.prototype.teardownUI = function () {
                    this.flightControlMode.manualModeButtonVisible = false;
                    this.flightControlMode.setNewHomePointButtonVisible = false;
                    this.flightControlMode.rtlButtonVisible = false;
                    this.flightControlMode.changeToGuidedModeButtonVisible = false;
                };
                ManualMode.prototype.handleButtonClick = function (button) {
                    switch (button) {
                        case ButtonActions.RTL:
                            this.drone.FlightController.setFlightMode(FlightMode_1.FlightMode.RTL).then(function () {
                            }).catch(function (error) {
                                // TODO: handle error changing modes
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
