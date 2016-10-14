System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ControlTelemetry;
    return {
        setters:[],
        execute: function() {
            ControlTelemetry = (function () {
                function ControlTelemetry(bindings) {
                    var _this = this;
                    this.bindings = bindings;
                    this.isDJIDrone = true;
                    this.horizontalSpeedValue = '-180deg';
                    this.verticalSpeedValue = '-180deg';
                    this.hSpeed = 0;
                    this.vSpeed = 0;
                    this.agl = 0;
                    this.cssAGL = '0px';
                    this.rollCSS = '0deg';
                    this.pitch = 0;
                    this.pitchCSS = '0px';
                    this.headingCSS = '0';
                    this.brown = '#6c5735';
                    this.heading = 0;
                    this.waypoints = [];
                    // Gimbal Properties 
                    this.gimbalPitch = 0;
                    this.gimbalHeading = 0;
                    this.sessionController.eventing.on('session-added', function (ownerSession) {
                        _this.drone = ownerSession.mapDrone.drone;
                        _this.bindings.$applyAsync();
                        _this.setupWaypoints();
                        _this.wireUpChanges();
                    });
                    this.sessionController.eventing.on('session-removed', function (session) {
                        _this.unwireChanges();
                        _this.removeWaypoint();
                        _this.drone = null;
                        _this.bindings.$applyAsync();
                    });
                    this.sessionController.eventing.on('session-changed', function (session) {
                        if (_this.drone) {
                            _this.drone.FlightController.Guided.off('waypoints-changed');
                        }
                        _this.drone = session.mapDrone.drone;
                        _this.setupWaypoints();
                        _this.wireUpChanges();
                        _this.bindings.$applyAsync();
                    });
                }
                Object.defineProperty(ControlTelemetry.prototype, "verticalSpeedColor", {
                    get: function () {
                        if (this.vSpeed > 0) {
                            return '#2f87c3';
                        }
                        else {
                            return '#00c121';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ControlTelemetry.prototype, "aglColor", {
                    get: function () {
                        if (this.agl >= 120) {
                            return 'red';
                        }
                        else {
                            return '#2f87c3';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                ControlTelemetry.prototype.unwireChanges = function () {
                    if (this.drone) {
                        this.drone.FlightController.Telemetry.off('propertyChanged');
                        this.drone.Gimbal.off('state-updated');
                    }
                    this.hSpeed = 0;
                    this.vSpeed = 0;
                    this.agl = 0;
                    this.cssAGL = '0px';
                    this.rollCSS = '0deg';
                    this.pitch = 0;
                    this.pitchCSS = '0px';
                    this.headingCSS = '0';
                    this.brown = '#6c5735';
                    this.heading = 0;
                    this.horizontalSpeedValue = '-180deg';
                    this.verticalSpeedValue = '-180deg';
                    this.gimbalHeading = 0;
                    this.gimbalPitch = 0;
                };
                ControlTelemetry.prototype.wireUpChanges = function () {
                    var _this = this;
                    this.drone.FlightController.Telemetry.on('propertyChanged', function (name, value) {
                        if (name === 'Position') {
                            _this.hSpeed = +(_this.drone.FlightController.Telemetry.Position.groundSpeed).toFixed(1);
                            _this.horizontalSpeedValue = (-180 + ((_this.hSpeed / 25) * 180)).toString() + 'deg';
                            _this.vSpeed = +(_this.drone.FlightController.Telemetry.Position.zVelocity).toFixed(1);
                            _this.verticalSpeedValue = (-180 + ((Math.abs(_this.vSpeed) / 10) * 180)).toString() + 'deg';
                            _this.agl = +(_this.drone.FlightController.Telemetry.Position.altitudeAGL).toFixed(1);
                            _this.cssAGL = ((_this.agl / 150) * 100).toString() + 'px';
                        }
                        if (name === 'Attitude') {
                            _this.rollCSS = (_this.toDegrees(_this.drone.FlightController.Telemetry.Attitude.roll) * -1).toString() + 'deg';
                            _this.pitchCSS = (_this.toDegrees(_this.drone.FlightController.Telemetry.Attitude.pitch) * 2).toString() + 'px';
                            _this.headingCSS = (_this.drone.FlightController.Telemetry.Position.heading).toString();
                            _this.heading = Math.round(_this.drone.FlightController.Telemetry.Position.heading);
                        }
                        _this.drone.Gimbal.on('state-updated', function (gimbal) {
                            if (gimbal) {
                                _this.gimbalHeading = Math.round(gimbal.yaw);
                                _this.gimbalPitch = Math.round(gimbal.pitch) * -1;
                            }
                        });
                        _this.bindings.$applyAsync();
                    });
                };
                ControlTelemetry.prototype.setupWaypoints = function () {
                    var _this = this;
                    this.waypoints = this.sessionController.activeSession.mapWaypoints.waypoints;
                    this.drone.FlightController.Guided.on('waypoints-changed', function () {
                        _this.bindings.$applyAsync();
                    });
                };
                ControlTelemetry.prototype.removeWaypoint = function () {
                    this.waypoints = null;
                    if (this.drone) {
                        this.drone.FlightController.Guided.off('waypoints-changed');
                    }
                };
                ControlTelemetry.prototype.waypointFilter = function (wp) {
                    if (wp.reached) {
                        return false;
                    }
                    else {
                        return true;
                    }
                };
                ControlTelemetry.prototype.roundToTwo = function (num) {
                    return +num.toFixed(2);
                };
                ControlTelemetry.prototype.toDegrees = function (radians) {
                    return radians * 180 / Math.PI;
                };
                // speed range 0-25 m/s
                // Constructor
                ControlTelemetry.$inject = [
                    '$scope'
                ];
                return ControlTelemetry;
            }());
            exports_1("default",angular.module('DroneSense.Web.ControlTelemetry', []).component('dsControlTelemetry', {
                bindings: {
                    sessionController: '<'
                },
                controller: ControlTelemetry,
                templateUrl: './app/components/controlTelemetry/controlTelemetry.html'
            }));
        }
    }
});

//# sourceMappingURL=controlTelemetry.js.map
