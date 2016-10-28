System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var MapWaypoint;
    return {
        setters:[],
        execute: function() {
            MapWaypoint = (function () {
                function MapWaypoint(guidedWaypoint, index, hae) {
                    this.name = 'A';
                    this.reached = false;
                    this.isActive = false;
                    this.guidedWaypoint = guidedWaypoint;
                    this.longitude = this.guidedWaypoint.longitude;
                    this.latitude = this.guidedWaypoint.lattitude;
                    this.altitudeAGL = this.guidedWaypoint.altitude;
                    this.speed = this.guidedWaypoint.speed;
                    this.name = this.guidedWaypoint.name;
                    this.reached = this.guidedWaypoint.isReached;
                    this.index = index;
                    this.hae = hae;
                }
                return MapWaypoint;
            }());
            exports_1("MapWaypoint", MapWaypoint);
        }
    }
});

//# sourceMappingURL=mapWaypoint.js.map
