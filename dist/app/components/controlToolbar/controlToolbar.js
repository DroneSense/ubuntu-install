System.register(['../gpsStatusIcon/gpsStatusIcon', '../batteryStatusIcon/batteryStatusIcon', '../batteryStatusIndicator/batteryStatusIndicator', '../telemetryStatusIcon/telemetryStatusIcon', '../rcStatusIcon/rcStatusIcon', '../videoStatusIcon/videoStatusIcon', '@dronesense/core/lib/common/enums/Firmware'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var gpsStatusIcon_1, batteryStatusIcon_1, batteryStatusIndicator_1, telemetryStatusIcon_1, rcStatusIcon_1, videoStatusIcon_1, Firmware_1;
    var ControlToolbar;
    return {
        setters:[
            function (gpsStatusIcon_1_1) {
                gpsStatusIcon_1 = gpsStatusIcon_1_1;
            },
            function (batteryStatusIcon_1_1) {
                batteryStatusIcon_1 = batteryStatusIcon_1_1;
            },
            function (batteryStatusIndicator_1_1) {
                batteryStatusIndicator_1 = batteryStatusIndicator_1_1;
            },
            function (telemetryStatusIcon_1_1) {
                telemetryStatusIcon_1 = telemetryStatusIcon_1_1;
            },
            function (rcStatusIcon_1_1) {
                rcStatusIcon_1 = rcStatusIcon_1_1;
            },
            function (videoStatusIcon_1_1) {
                videoStatusIcon_1 = videoStatusIcon_1_1;
            },
            function (Firmware_1_1) {
                Firmware_1 = Firmware_1_1;
            }],
        execute: function() {
            ControlToolbar = (function () {
                function ControlToolbar(bindings) {
                    var _this = this;
                    this.bindings = bindings;
                    this.batteryVoltage = 0;
                    this.batteryCurrent = 0;
                    this.batteryRemainingPercent = 0;
                    this.batteryTemp = 0;
                    this.remainingMah = 0;
                    this.timeRemaining = 0;
                    this.lifetimeRemaining = 0;
                    this.videoSignalPercentage = 0;
                    this.rcSignalPercentage = 0;
                    this.gpsFixType = 0;
                    this.satCount = 0;
                    this.gpsHdop = 0;
                    this.gpsVdop = 0;
                    this.isDJIDrone = true;
                    this.selectedTab = -1;
                    this.sessionController.eventing.on('session-added', function (ownerSession) {
                        _this.drone = _this.sessionController.activeSession.mapDrone.drone;
                        _this.isDJIDrone = _this.drone.FlightController.Firmware === Firmware_1.Firmware.DJI ? true : false;
                        _this.bindings.$applyAsync();
                        _this.wireUpChanges();
                    });
                    this.sessionController.eventing.on('session-removed', function (ownerSession) {
                        _this.unwireChanges();
                        _this.drone = null;
                        _this.bindings.$applyAsync();
                    });
                    this.sessionController.eventing.on('session-changed', function (session) {
                        _this.unwireChanges();
                        _this.drone = session.mapDrone.drone;
                        _this.bindings.$applyAsync();
                        _this.wireUpChanges();
                    });
                }
                ControlToolbar.prototype.unwireChanges = function () {
                    if (this.drone) {
                        this.drone.FlightController.Telemetry.off('propertyChanged');
                    }
                    this.batteryVoltage = 0;
                    this.batteryCurrent = 0;
                    this.batteryRemainingPercent = 0;
                    this.videoSignalPercentage = 0;
                    this.rcSignalPercentage = 0;
                    this.gpsFixType = 0;
                    this.satCount = 0;
                    this.gpsHdop = 0;
                    this.gpsVdop = 0;
                };
                ControlToolbar.prototype.wireUpChanges = function () {
                    var _this = this;
                    this.drone.FlightController.Telemetry.on('propertyChanged', function (name, value) {
                        if (_this.isDJIDrone) {
                            if (_this.drone.FlightController.Telemetry.DJIRadio) {
                                _this.videoSignalPercentage = _this.drone.FlightController.Telemetry.DJIRadio.videoSignalPercent;
                                _this.rcSignalPercentage = _this.drone.FlightController.Telemetry.DJIRadio.remoteSignalPercent;
                            }
                            if (_this.drone.FlightController.Telemetry.DJIBattery) {
                                _this.batteryVoltage = +(_this.drone.FlightController.Telemetry.DJIBattery.currentVoltage * .001).toFixed(2);
                                _this.batteryCurrent = _this.drone.FlightController.Telemetry.DJIBattery.currentCurrent;
                                _this.batteryRemainingPercent = _this.drone.FlightController.Telemetry.DJIBattery.batteryEnergyRemainingPercent;
                                _this.batteryTemp = _this.drone.FlightController.Telemetry.DJIBattery.batteryTemperature;
                                _this.remainingMah = _this.drone.FlightController.Telemetry.DJIBattery.currentEnergy;
                                _this.timeRemaining = (((_this.remainingMah / Math.abs(_this.batteryCurrent)) * 60) * 60) * 1000;
                                _this.lifetimeRemaining = _this.drone.FlightController.Telemetry.DJIBattery.lifetimeRemainingPercent;
                            }
                        }
                        else {
                            _this.batteryVoltage = +(_this.drone.FlightController.Telemetry.Battery.voltage * .001).toFixed(2);
                            _this.batteryCurrent = +(_this.drone.FlightController.Telemetry.Battery.current * .01).toFixed(2);
                            _this.batteryRemainingPercent = _this.drone.FlightController.Telemetry.Battery.percentRemaining;
                        }
                        _this.gpsFixType = _this.drone.FlightController.Telemetry.Position.fixType;
                        _this.satCount = _this.drone.FlightController.Telemetry.Position.satelliteCount;
                        _this.gpsHdop = _this.drone.FlightController.Telemetry.Position.hdop;
                        _this.gpsVdop = _this.drone.FlightController.Telemetry.Position.vdop;
                        _this.bindings.$applyAsync();
                    });
                };
                // Show cordova log viewer from checklist button click until this is implemented
                ControlToolbar.prototype.showLog = function () {
                };
                ControlToolbar.prototype.hidetabs = function () {
                    this.gps = false;
                    this.telementry = false;
                    this.datalink = false;
                    this.sysStatus = false;
                    this.battery = false;
                    this.videoLink = false;
                    this.settingsDialog = false;
                };
                ControlToolbar.prototype.toggleTab = function (name) {
                    if (name === 'battery') {
                        if (this.battery) {
                            this.battery = false;
                            this.selectedTab = -1;
                        }
                        else {
                            this.hidetabs();
                            this.battery = true;
                            this.selectedTab = 4;
                        }
                    }
                    if (name === 'gps') {
                        if (this.gps) {
                            this.gps = false;
                            this.selectedTab = -1;
                        }
                        else {
                            this.hidetabs();
                            this.gps = true;
                            this.selectedTab = 0;
                        }
                    }
                    if (name === 'settings') {
                        if (this.settingsDialog) {
                            this.settingsDialog = false;
                            this.selectedTab = -1;
                        }
                        else {
                            this.hidetabs();
                            this.settingsDialog = true;
                            this.selectedTab = 6;
                        }
                    }
                };
                // Constructor
                ControlToolbar.$inject = [
                    '$scope'
                ];
                return ControlToolbar;
            }());
            exports_1("default",angular.module('DroneSense.Web.ControlToolbar', [
                gpsStatusIcon_1.default.name,
                batteryStatusIcon_1.default.name,
                batteryStatusIndicator_1.default.name,
                telemetryStatusIcon_1.default.name,
                rcStatusIcon_1.default.name,
                videoStatusIcon_1.default.name
            ]).component('dsControlToolbar', {
                bindings: {
                    sessionController: '<',
                    settings: '<'
                },
                controller: ControlToolbar,
                templateUrl: './app/components/controlToolbar/controlToolbar.html'
            }));
        }
    }
});

//# sourceMappingURL=controlToolbar.js.map
