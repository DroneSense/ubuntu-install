System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var RcStatusIcon;
    return {
        setters:[],
        execute: function() {
            RcStatusIcon = (function () {
                function RcStatusIcon(bindings) {
                    this.bindings = bindings;
                    // Green - #00C121
                    // Yellow - #dcd300
                    // Red - #ea0707
                    // Default - #abafb9
                    this.signalStrength = 0;
                    this.isDJI = true;
                    // TODO: Check flight controller type and show appropriate icon
                }
                Object.defineProperty(RcStatusIcon.prototype, "Bar1Color", {
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
                Object.defineProperty(RcStatusIcon.prototype, "Bar2Color", {
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
                Object.defineProperty(RcStatusIcon.prototype, "Bar3Color", {
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
                Object.defineProperty(RcStatusIcon.prototype, "Bar4Color", {
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
                Object.defineProperty(RcStatusIcon.prototype, "Bar5Color", {
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
                Object.defineProperty(RcStatusIcon.prototype, "MainIconColor", {
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
                RcStatusIcon.$inject = [
                    '$scope'
                ];
                return RcStatusIcon;
            }());
            exports_1("default",angular.module('DroneSense.Web.RcStatusIcon', []).component('dsRcStatusIcon', {
                bindings: {
                    signalStrength: '<'
                },
                controller: RcStatusIcon,
                templateUrl: './app/components/rcStatusIcon/rcStatusIcon.html'
            }));
        }
    }
});

//# sourceMappingURL=rcStatusIcon.js.map
