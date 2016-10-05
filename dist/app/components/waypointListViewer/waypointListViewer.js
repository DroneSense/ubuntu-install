System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var WaypointListViewer;
    return {
        setters:[],
        execute: function() {
            WaypointListViewer = (function () {
                function WaypointListViewer(bindings) {
                    var _this = this;
                    this.bindings = bindings;
                    this.showHistory = false;
                    this.waypoints = [];
                    this.sessionController.eventing.on('session-added', function (ownerSession) {
                        _this.setupWaypoints();
                        _this.bindings.$applyAsync();
                    });
                }
                // Set local waypoints to active session waypoints
                WaypointListViewer.prototype.setupWaypoints = function () {
                    this.waypoints = this.sessionController.activeSession.mapWaypoints.waypoints;
                };
                // Call delete waypoint
                WaypointListViewer.prototype.delete = function (wp) {
                    this.sessionController.ownerSession.mapDrone.drone.FlightController.Guided.removeWaypoint(wp.index);
                };
                WaypointListViewer.prototype.waypointFilter = function (wp) {
                    if (wp.reached) {
                        return false;
                    }
                    else {
                        return true;
                    }
                };
                WaypointListViewer.prototype.historyFilter = function (wp) {
                    if (wp.reached) {
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                // Constructor
                WaypointListViewer.$inject = [
                    '$scope'
                ];
                return WaypointListViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.WaypointListViewer', []).component('dsWaypointListViewer', {
                bindings: {
                    sessionController: '<'
                },
                controller: WaypointListViewer,
                templateUrl: './app/components/waypointListViewer/waypointListViewer.html'
            }));
        }
    }
});

//# sourceMappingURL=waypointListViewer.js.map
