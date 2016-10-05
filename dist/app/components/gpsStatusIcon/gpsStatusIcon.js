System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var GpsStatusIcon;
    return {
        setters:[],
        execute: function() {
            GpsStatusIcon = (function () {
                function GpsStatusIcon(bindings) {
                    this.bindings = bindings;
                    this.gpsLock = 0;
                }
                Object.defineProperty(GpsStatusIcon.prototype, "Bar1Color", {
                    // 0-1: no fix, 2: 2D fix, 3: 3D fix, 4: DGPS, 5: RTK
                    get: function () {
                        if (this.gpsLock === 0) {
                            return '#abafb9';
                        }
                        else if (this.gpsLock > 2) {
                            return '#00C121';
                        }
                        else if (this.gpsLock === 1 || this.gpsLock === 2) {
                            return '#ea0707';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GpsStatusIcon.prototype, "Bar2Color", {
                    get: function () {
                        if (this.gpsLock === 0 || this.gpsLock === 1) {
                            return '#abafb9';
                        }
                        else if (this.gpsLock > 2) {
                            return '#00C121';
                        }
                        else if (this.gpsLock === 2) {
                            return '#ea0707';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GpsStatusIcon.prototype, "Bar3Color", {
                    get: function () {
                        if (this.gpsLock > 2) {
                            return '#00C121';
                        }
                        else {
                            return '#abafb9';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GpsStatusIcon.prototype, "Bar4Color", {
                    get: function () {
                        if (this.gpsLock > 3) {
                            return '#00C121';
                        }
                        else {
                            return '#abafb9';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GpsStatusIcon.prototype, "Bar5Color", {
                    get: function () {
                        if (this.gpsLock > 4) {
                            return '#00C121';
                        }
                        else {
                            return '#abafb9';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GpsStatusIcon.prototype, "MainIconColor", {
                    get: function () {
                        if (this.gpsLock === 0) {
                            return '#abafb9';
                        }
                        else if (this.gpsLock > 2) {
                            return '#00C121';
                        }
                        else if (this.gpsLock === 1 || this.gpsLock === 2) {
                            return '#ea0707';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                // Constructor
                GpsStatusIcon.$inject = [
                    '$scope'
                ];
                return GpsStatusIcon;
            }());
            exports_1("default",angular.module('DroneSense.Web.GpsStatusIcon', []).component('dsGpsStatusIcon', {
                bindings: {
                    gpsLock: '<'
                },
                controller: GpsStatusIcon,
                templateUrl: './app/components/gpsStatusIcon/gpsStatusIcon.html'
            }));
        }
    }
});

//# sourceMappingURL=gpsStatusIcon.js.map
