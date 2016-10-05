System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TelemetryStatusIcon;
    return {
        setters:[],
        execute: function() {
            TelemetryStatusIcon = (function () {
                function TelemetryStatusIcon(bindings) {
                    this.bindings = bindings;
                    // Green - #00C121
                    // Yellow - #dcd300
                    // Red - #ea0707
                    // Default - #abafb9
                    this.signalStrength = 0;
                }
                Object.defineProperty(TelemetryStatusIcon.prototype, "Bar1Color", {
                    get: function () {
                        if (this.signalStrength === 0) {
                            return '#abafb9';
                        }
                        else if (this.signalStrength >= 1 && this.signalStrength < 20) {
                            return '#ea0707';
                        }
                        else if (this.signalStrength >= 20 && this.signalStrength < 40) {
                            return '#dcd300';
                        }
                        else if (this.signalStrength >= 40) {
                            return '#00C121';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TelemetryStatusIcon.prototype, "Bar2Color", {
                    get: function () {
                        if (this.signalStrength === 0) {
                            return '#abafb9';
                        }
                        else if (this.signalStrength >= 20 && this.signalStrength < 40) {
                            return '#dcd300';
                        }
                        else if (this.signalStrength >= 40) {
                            return '#00C121';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TelemetryStatusIcon.prototype, "Bar3Color", {
                    get: function () {
                        if (this.signalStrength === 0) {
                            return '#abafb9';
                        }
                        else if (this.signalStrength >= 40) {
                            return '#00C121';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TelemetryStatusIcon.prototype, "Bar4Color", {
                    get: function () {
                        if (this.signalStrength === 0) {
                            return '#abafb9';
                        }
                        else if (this.signalStrength >= 60) {
                            return '#00C121';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TelemetryStatusIcon.prototype, "Bar5Color", {
                    get: function () {
                        if (this.signalStrength === 0) {
                            return '#abafb9';
                        }
                        else if (this.signalStrength >= 80) {
                            return '#00C121';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TelemetryStatusIcon.prototype, "MainIconColor", {
                    get: function () {
                        if (this.signalStrength === 0) {
                            return '#abafb9';
                        }
                        else if (this.signalStrength >= 1 && this.signalStrength < 20) {
                            return '#ea0707';
                        }
                        else if (this.signalStrength >= 20 && this.signalStrength < 40) {
                            return '#dcd300';
                        }
                        else if (this.signalStrength >= 40) {
                            return '#00C121';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                // Constructor
                TelemetryStatusIcon.$inject = [
                    '$scope'
                ];
                return TelemetryStatusIcon;
            }());
            exports_1("default",angular.module('DroneSense.Web.TelemetryStatusIcon', []).component('dsTelemetryStatusIcon', {
                bindings: {
                    signalStrength: '<',
                },
                controller: TelemetryStatusIcon,
                templateUrl: './app/components/telemetryStatusIcon/telemetryStatusIcon.html'
            }));
        }
    }
});

//# sourceMappingURL=telemetryStatusIcon.js.map
