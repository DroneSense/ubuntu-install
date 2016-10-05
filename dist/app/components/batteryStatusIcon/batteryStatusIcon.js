System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var BatteryStatusIcon;
    return {
        setters:[],
        execute: function() {
            BatteryStatusIcon = (function () {
                function BatteryStatusIcon(bindings) {
                    this.bindings = bindings;
                    // Green - #00C121
                    // Yellow - #dcd300
                    // Red - #ea0707
                    // Default - #abafb9
                    // If the battery percentage is between 0-25 then we will show
                    // one bar and everything will be red.
                    this.batteryPercentage = 0;
                }
                Object.defineProperty(BatteryStatusIcon.prototype, "Bar1Color", {
                    get: function () {
                        if (this.batteryPercentage === 0) {
                            return '#abafb9';
                        }
                        else if (this.batteryPercentage <= 25) {
                            return '#ea0707';
                        }
                        else if (this.batteryPercentage > 25 && this.batteryPercentage <= 50) {
                            return '#dcd300';
                        }
                        else if (this.batteryPercentage > 50) {
                            return '#00C121';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BatteryStatusIcon.prototype, "Bar2Color", {
                    get: function () {
                        if (this.batteryPercentage === 0) {
                            return '#abafb9';
                        }
                        else if (this.batteryPercentage <= 25) {
                            return 'rgba(0, 0, 0, 0)';
                        }
                        else if (this.batteryPercentage > 25 && this.batteryPercentage <= 50) {
                            return '#dcd300';
                        }
                        else if (this.batteryPercentage > 50) {
                            return '#00C121';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BatteryStatusIcon.prototype, "Bar3Color", {
                    get: function () {
                        if (this.batteryPercentage === 0) {
                            return '#abafb9';
                        }
                        else if (this.batteryPercentage <= 50) {
                            return 'rgba(0, 0, 0, 0)';
                        }
                        else if (this.batteryPercentage > 50) {
                            return '#00C121';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BatteryStatusIcon.prototype, "Bar4Color", {
                    get: function () {
                        if (this.batteryPercentage === 0) {
                            return '#abafb9';
                        }
                        else if (this.batteryPercentage <= 75) {
                            return 'rgba(0, 0, 0, 0)';
                        }
                        else if (this.batteryPercentage > 75) {
                            return '#00C121';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BatteryStatusIcon.prototype, "MainIconColor", {
                    get: function () {
                        if (this.batteryPercentage === 0) {
                            return '#abafb9';
                        }
                        else if (this.batteryPercentage <= 25) {
                            return '#ea0707';
                        }
                        else if (this.batteryPercentage > 25 && this.batteryPercentage <= 50) {
                            return '#dcd300';
                        }
                        else if (this.batteryPercentage > 50) {
                            return '#00C121';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                // Constructor
                BatteryStatusIcon.$inject = [
                    '$scope'
                ];
                return BatteryStatusIcon;
            }());
            exports_1("default",angular.module('DroneSense.Web.BatteryStatusIcon', []).component('dsBatteryStatusIcon', {
                bindings: {
                    batteryPercentage: '<'
                },
                controller: BatteryStatusIcon,
                templateUrl: './app/components/batteryStatusIcon/batteryStatusIcon.html'
            }));
        }
    }
});

//# sourceMappingURL=batteryStatusIcon.js.map
