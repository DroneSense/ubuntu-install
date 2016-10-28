System.register(['./mapDrone', './mapMode', './mapWaypoints'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var mapDrone_1, mapMode_1, mapWaypoints_1;
    var MapSession;
    return {
        setters:[
            function (mapDrone_1_1) {
                mapDrone_1 = mapDrone_1_1;
            },
            function (mapMode_1_1) {
                mapMode_1 = mapMode_1_1;
            },
            function (mapWaypoints_1_1) {
                mapWaypoints_1 = mapWaypoints_1_1;
            }],
        execute: function() {
            MapSession = (function () {
                function MapSession($log) {
                    this.$log = $log;
                    // The selected mode of the map
                    this.mapMode = mapMode_1.MapMode.ThreeDimensional;
                    this.mapEntityCollection = new Cesium.CustomDataSource;
                }
                MapSession.prototype.initializeSession = function (eventing, session, serverConnection, map, mapMode) {
                    var _this = this;
                    return new Promise(function (resolve) {
                        _this.map = map;
                        _this.session = session;
                        _this.serverConnection = serverConnection;
                        _this.mapMode = mapMode;
                        _this.name = _this.session.Name;
                        _this.eventing = eventing;
                        _this.color = _this.session.Color;
                        _this.id = _this.session.Id;
                        // WARNING BAD CODE (Robert made me do this!) - drone index 0 is hardcoded here
                        _this.session.getDrones().then(function (drones) {
                            _this.mapDrone = new mapDrone_1.MapDrone(_this.mapEntityCollection, _this.$log);
                            // Suspend entity events while adding all waypoints to map
                            _this.mapEntityCollection.entities.suspendEvents();
                            _this.mapDrone.initializeDrone(_this.eventing, drones[0], _this.map, _this.color, false).then(function (mapDrone) {
                                _this.mapDrone = mapDrone;
                                // Initialize waypoints for guided mode
                                _this.mapWaypoints = new mapWaypoints_1.MapWaypoints(_this.mapDrone, _this.map, _this.color, _this.id, _this.mapEntityCollection, _this.eventing, _this.$log);
                                // Resume entity events after added
                                _this.mapEntityCollection.entities.resumeEvents();
                                resolve(_this);
                            }).catch(function (error) {
                                _this.$log.error({ message: 'Error initializing drone.', error: error });
                            });
                        }).catch(function (error) {
                            _this.$log.error({ message: 'Error in getting drones.', error: error });
                        });
                    });
                };
                MapSession.prototype.remove = function () {
                    // This will remove everyting in the collection associated with this session
                    this.mapEntityCollection.entities.removeAll();
                };
                MapSession.prototype.drawFlightPath = function () {
                    try {
                        this.mapEntityCollection.entities.add({
                            name: 'Flight Path',
                            polyline: {
                                // TODO - move to static property and manually trigger the redraw for trigger changes.
                                positions: new Cesium.CallbackProperty(function () {
                                    //console.log('command viewer property callback');
                                    var degreesArray = [];
                                    // this.commands.forEach((command: Command): void => {
                                    //     degreesArray.push(Cesium.Cartesian3.fromDegrees((<WaypointCommand>command).Position.lng, (<WaypointCommand>command).Position.lat, (<WaypointCommand>command).AltitudeHAE));
                                    // });
                                    return degreesArray;
                                }, false),
                                width: 2,
                                material: Cesium.Color.fromCssColorString(this.color)
                            } //,
                        });
                    }
                    catch (error) {
                        this.$log.error({ message: 'Error drawing flight path.', error: error });
                    }
                };
                return MapSession;
            }());
            exports_1("MapSession", MapSession);
        }
    }
});

//# sourceMappingURL=mapSession.js.map
