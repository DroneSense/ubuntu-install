System.register(['./mapDrone', 'backbone-events-standalone', './mapMode', '@dronesense/model/lib/common/Utility'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var mapDrone_1, backbone_events_standalone_1, mapMode_1, Utility_1;
    var MapWaypoint, MapWaypoints, MapSession, OwnerMapSession;
    return {
        setters:[
            function (mapDrone_1_1) {
                mapDrone_1 = mapDrone_1_1;
            },
            function (backbone_events_standalone_1_1) {
                backbone_events_standalone_1 = backbone_events_standalone_1_1;
            },
            function (mapMode_1_1) {
                mapMode_1 = mapMode_1_1;
            },
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            }],
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
            MapWaypoints = (function () {
                function MapWaypoints(drone, map, color, sesisonId, entityCollection, eventing) {
                    var _this = this;
                    this.eventing = eventing;
                    this.waypoints = [];
                    this.terrainProvider = new Cesium.CesiumTerrainProvider({
                        url: 'https://www.cesiumcontent.com/api/terrain/world?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkMTM4ZDE2OS05NWYwLTQ0YmItOWY3YS0yNjEwOGE5Y2Y3NjYiLCJpZCI6NywiaWF0IjoxNDU1MjkyNzg5fQ.NDKlrwQZE_04ntDuL89hvatEmuycQo5llhtz3Mi6Wo0'
                    });
                    this.drone = drone;
                    this.map = map;
                    this.color = color;
                    this.sessionId = sesisonId;
                    this.mapEntityCollection = entityCollection;
                    this.startInterval();
                    var _loop_1 = function(index) {
                        var wp = this_1.drone.drone.FlightController.Guided.Waypoints[index];
                        this_1.getHAE(wp.lattitude, wp.longitude).then(function (height) {
                            var newWaypoint = new MapWaypoint(wp, index, height);
                            _this.waypoints.splice(index, 0, newWaypoint);
                            _this.addWaypointToMap(newWaypoint);
                            if (!_this.currentWaypoint) {
                                if (!newWaypoint.reached) {
                                    _this.currentWaypoint = newWaypoint;
                                    _this.currentIndex = index;
                                }
                            }
                        });
                    };
                    var this_1 = this;
                    for (var index = 0; index < this.drone.drone.FlightController.Guided.Waypoints.length; index++) {
                        _loop_1(index);
                    }
                    this.calculateTimeAndDistance();
                    this.drone.drone.FlightController.Guided.on('waypoint-added', function (wayPoint, index) {
                        console.log('waypoint-added: ' + index + ':' + wayPoint);
                        try {
                            _this.getHAE(wayPoint.lattitude, wayPoint.longitude).then(function (height) {
                                _this.waypoints.splice(index, 0, new MapWaypoint(wayPoint, index, height));
                                _this.addWaypointToMap(_this.waypoints[index]);
                                // Fix the animation clock
                                _this.map.clock.currentTime = Cesium.JulianDate.now();
                                _this.updateIndexes();
                            });
                        }
                        catch (error) {
                            console.log(error);
                        }
                    });
                    this.drone.drone.FlightController.Guided.on('waypoint-removed', function (index) {
                        console.log('waypoint-removed: ' + index);
                        try {
                            _this.removeWaypointFromMap(_this.waypoints[index].name);
                            _this.waypoints.splice(index, 1);
                            _this.updateIndexes();
                        }
                        catch (error) {
                            console.log(error);
                        }
                    });
                    this.drone.drone.FlightController.Guided.on('waypoints-changed', function () {
                        console.log('waypoints-changed');
                    });
                    this.drone.drone.FlightController.Guided.on('waypoint-error', function (index, error) {
                        console.log('waypoint-error: ' + index);
                        try {
                            if (_this.waypoints[index]) {
                                _this.eventing.trigger('waypoint-error', _this.waypoints[index].name);
                            }
                        }
                        catch (error) {
                            console.log(error);
                        }
                    });
                    this.drone.drone.FlightController.Guided.on('waypoint-started', function (index) {
                        console.log('waypoint-started: ' + index);
                        try {
                            if (_this.currentWaypoint) {
                                _this.currentWaypoint.isActive = false;
                            }
                            _this.currentWaypoint = _this.waypoints[index];
                            _this.currentIndex = index;
                            _this.waypoints[index].isActive = true;
                        }
                        catch (error) {
                            console.log(error);
                        }
                    });
                    this.drone.drone.FlightController.Guided.on('waypoint-reached', function (index) {
                        console.log('waypoint-reached: ' + index);
                        try {
                            _this.waypoints[index].reached = true;
                            _this.waypoints[index].isActive = false;
                        }
                        catch (error) {
                            console.log(error);
                        }
                    });
                }
                MapWaypoints.prototype.removeWaypointFromMap = function (name) {
                    this.mapEntityCollection.entities.removeById(this.sessionId + name);
                };
                MapWaypoints.prototype.updateIndexes = function () {
                    this.waypoints.forEach(function (wp, index) {
                        wp.index = index;
                    });
                };
                MapWaypoints.prototype.addWaypointToMap = function (waypoint) {
                    if (!waypoint) {
                        return;
                    }
                    // create the svg image string
                    var svgDataDeclare = 'data:image/svg+xml,';
                    //var svgCircle: string = '<path style="fill:#ffffff" d="M12,23.9L0.1,12L12,0.1L23.9,12L12,23.9z M4.4,12l7.6,7.6l7.6-7.6L12,4.4L4.4,12z"/>';
                    var svgCircle = "<defs>\n            <rect id=\"path-1\" x=\"6\" y=\"6\" width=\"25\" height=\"25\"></rect>\n        </defs>\n        <g id=\"Flight-Plan\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n            <g id=\"Rectangle-474\" transform=\"translate(18.500000, 18.500000) rotate(-315.000000) translate(-18.500000, -18.500000) \">\n                <use stroke=\"#FFFFFF\" stroke-width=\"2\" fill-opacity=\"0.5\" fill=\"" + this.color + "\" fill-rule=\"evenodd\" xlink:href=\"#path-1\"></use>\n            </g>\n            <text id=\"2\" font-family=\"OpenSans\" font-size=\"15\" font-weight=\"500\" fill=\"#FFFFFF\">\n                <tspan text-anchor=\"middle\" x=\"18.5\" y=\"24\">" + waypoint.name + "</tspan>\n            </text>\n        </g>";
                    var svgPrefix = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 43 43" xml:space="preserve">';
                    var svgSuffix = '</svg>';
                    var svgString = svgPrefix + svgCircle + svgSuffix;
                    // let newWaypoint: string =
                    // `<svg width="35" height="35" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
                    //     <g>
                    //         <title>Layer 1</title>
                    //         <g id="diamond">
                    //             <rect id="svg_1" height="25" width="25" fill-opacity="0.5" fill="#0A92EA" transform="matrix(0.7071,-0.7071,0.7071,0.7071,-8.4939,20.5061) " y="4.006014" x="8.006292"/>
                    //             <rect id="svg_2" height="25" width="25" stroke-miterlimit="10" stroke-width="2" stroke="#FFFFFF" fill="none" transform="matrix(0.7071,-0.7071,0.7071,0.7071,-8.4939,20.5061) " y="4.006012" x="8.006292"/>
                    //         </g>
                    //         <g stroke="null" id="number">
                    //             <text stroke-width="0" stroke="null" font-weight="normal" font-style="normal" x="50%" y="50%" id="svg_3" font-size="15px" font-family="&#x27;OpenSans-Semibold'" fill="#FFFFFF" transform="matrix(1,0,0,0.9583181738853455,13.0693,25.413596181405495) ">` + waypoint.name + `</text>
                    //         </g>
                    //     </g>
                    // </svg>`;
                    // create the cesium entity
                    var svgEntityImage = svgDataDeclare + svgString;
                    waypoint.entity = this.mapEntityCollection.entities.add({
                        name: waypoint.name,
                        id: this.sessionId + waypoint.name,
                        polyline: {
                            // positions: new Cesium.CallbackProperty( (): any => {
                            //     return Cesium.Cartesian3.fromDegreesArrayHeights(
                            //         [waypoint.longitude, waypoint.latitude, waypoint.hae,
                            //             waypoint.longitude, waypoint.latitude, waypoint.altitudeAGL + this.drone.homeHAE]);
                            // }, false) ,
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights([waypoint.longitude, waypoint.latitude, waypoint.hae,
                                waypoint.longitude, waypoint.latitude, waypoint.altitudeAGL + this.drone.homeHAE]),
                            width: 2,
                            followSurface: false,
                            material: Cesium.Color.WHITE
                        },
                        // position: new Cesium.CallbackProperty( (): any => {
                        //     return Cesium.Cartesian3.fromDegrees(waypoint.longitude, waypoint.latitude, waypoint.altitudeAGL + this.drone.homeHAE);
                        // }, false),
                        position: Cesium.Cartesian3.fromDegrees(waypoint.longitude, waypoint.latitude, waypoint.altitudeAGL + this.drone.homeHAE),
                        billboard: {
                            image: svgEntityImage,
                            sizeInMeters: false,
                            width: 43,
                            height: 43,
                            pixelOffset: new Cesium.Cartesian2(3, 7),
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        }
                    });
                    // Add bottom triangle to waypoint line
                    //  TODO - Track this entity so it can be removed later
                    // this.mapEntityCollection.add({
                    //     position: Cesium.Cartesian3.fromDegrees(waypoint.longitude, waypoint.latitude, 50),
                    //     billboard: {
                    //             image: svgEntityImage,
                    //             sizeInMeters : false,
                    //             width : 5,
                    //             height : 5,
                    //             pixelOffset: new Cesium.Cartesian2(3,7),
                    //             verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                    //             heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
                    //     }
                    // });
                    // Wire up handler to listen for left click
                    // this.editingHandler.setInputAction( (click: any): void => {
                    //     // Check to see what the mouse has selected
                    //     var pickedObject: any = this.map.scene.pick(click.position);
                    //     // Check to make sure we are only grabbing the entity we are editing
                    //     if (Cesium.defined(pickedObject) && pickedObject.id === this.entity) {
                    //         console.log(pickedObject.id);
                    //         this.ShowMenu();
                    //     }
                    // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                };
                MapWaypoints.prototype.getHAE = function (latitude, longitude) {
                    var _this = this;
                    return new Promise(function (resolve) {
                        var positions = [
                            Cesium.Cartographic.fromDegrees(longitude, latitude)
                        ];
                        try {
                            // Get terrain height at click location before adding takeoff point
                            Cesium.sampleTerrain(_this.terrainProvider, 15, positions).then(function (updatedPositions) {
                                resolve(updatedPositions[0].height);
                            });
                        }
                        catch (error) {
                            console.log(error);
                        }
                    });
                };
                MapWaypoints.prototype.startInterval = function () {
                    var _this = this;
                    this.intervalTimer = setInterval(function () {
                        if (_this.waypoints.length > 0 && _this.currentWaypoint) {
                            _this.calculateTimeAndDistance();
                        }
                    }, 500);
                };
                // TODO: Refactor into loop
                MapWaypoints.prototype.calculateTimeAndDistance = function () {
                    if (this.waypoints.length === 0) {
                        return;
                    }
                    var currentTotal = 0;
                    // first calculate distance from drone to next waypoint and set as distance for that waypoint
                    currentTotal = this.currentWaypoint.distance = +(Utility_1.Conversions.distance2(this.drone.currentLat, this.drone.currentLng, this.currentWaypoint.latitude, this.currentWaypoint.longitude).toFixed());
                    this.currentWaypoint.time = (this.currentWaypoint.distance / this.drone.drone.FlightController.Telemetry.Position.groundSpeed) * 1000;
                    // second do same for the next 5 waypoints adding the previous total
                    if (this.waypoints[this.currentIndex + 1]) {
                        currentTotal += +(Utility_1.Conversions.distance2(this.currentWaypoint.latitude, this.currentWaypoint.longitude, this.waypoints[this.currentIndex + 1].latitude, this.waypoints[this.currentIndex + 1].longitude).toFixed(2));
                        this.waypoints[this.currentIndex + 1].distance = +currentTotal.toFixed();
                        this.waypoints[this.currentIndex + 1].time = (currentTotal / this.drone.drone.FlightController.Telemetry.Position.groundSpeed) * 1000;
                    }
                    if (this.waypoints[this.currentIndex + 2]) {
                        currentTotal += +(Utility_1.Conversions.distance2(this.waypoints[this.currentIndex + 1].latitude, this.waypoints[this.currentIndex + 1].longitude, this.waypoints[this.currentIndex + 2].latitude, this.waypoints[this.currentIndex + 2].longitude).toFixed(2));
                        this.waypoints[this.currentIndex + 2].distance = +currentTotal.toFixed();
                        this.waypoints[this.currentIndex + 2].time = (currentTotal / this.drone.drone.FlightController.Telemetry.Position.groundSpeed) * 1000;
                    }
                    if (this.waypoints[this.currentIndex + 3]) {
                        currentTotal += +(Utility_1.Conversions.distance2(this.waypoints[this.currentIndex + 2].latitude, this.waypoints[this.currentIndex + 2].longitude, this.waypoints[this.currentIndex + 3].latitude, this.waypoints[this.currentIndex + 3].longitude).toFixed(2));
                        this.waypoints[this.currentIndex + 3].distance = +currentTotal.toFixed();
                        this.waypoints[this.currentIndex + 3].time = (currentTotal / this.drone.drone.FlightController.Telemetry.Position.groundSpeed) * 1000;
                    }
                    if (this.waypoints[this.currentIndex + 4]) {
                        currentTotal += +(Utility_1.Conversions.distance2(this.waypoints[this.currentIndex + 3].latitude, this.waypoints[this.currentIndex + 3].longitude, this.waypoints[this.currentIndex + 4].latitude, this.waypoints[this.currentIndex + 4].longitude).toFixed(2));
                        this.waypoints[this.currentIndex + 4].distance = +currentTotal.toFixed();
                        this.waypoints[this.currentIndex + 4].time = (currentTotal / this.drone.drone.FlightController.Telemetry.Position.groundSpeed) * 1000;
                    }
                };
                return MapWaypoints;
            }());
            exports_1("MapWaypoints", MapWaypoints);
            MapSession = (function () {
                function MapSession() {
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
                            _this.mapDrone = new mapDrone_1.MapDrone(_this.mapEntityCollection);
                            // Suspend entity events while adding all waypoints to map
                            _this.mapEntityCollection.entities.suspendEvents();
                            _this.mapDrone.initializeDrone(_this.eventing, drones[0], _this.map, _this.color, false).then(function (mapDrone) {
                                _this.mapDrone = mapDrone;
                                // Initialize waypoints for guided mode
                                _this.mapWaypoints = new MapWaypoints(_this.mapDrone, _this.map, _this.color, _this.id, _this.mapEntityCollection, _this.eventing);
                                // Resume entity events after added
                                _this.mapEntityCollection.entities.resumeEvents();
                                resolve(_this);
                            });
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
                    catch (exception) {
                        console.log(exception);
                    }
                };
                return MapSession;
            }());
            exports_1("MapSession", MapSession);
            backbone_events_standalone_1.default.mixin(MapSession.prototype);
            // Represents
            OwnerMapSession = (function (_super) {
                __extends(OwnerMapSession, _super);
                function OwnerMapSession() {
                    _super.call(this);
                    // Flag to indicate whether the user created the session allowing all guests without
                    // prompting for permission
                    this.allowAllGuestsWithoutPrompt = false;
                    // List of guests that are connected
                    this.connectedGuests = [];
                }
                OwnerMapSession.prototype.initializeOwnerSession = function (eventing, session, serverConnection, map, mapMode, allowAllGuestsWithoutPrompt) {
                    var _this = this;
                    return new Promise(function (resolve) {
                        _this.map = map;
                        _this.session = session;
                        _this.serverConnection = serverConnection;
                        _this.mapMode = mapMode;
                        _this.name = _this.session.Name;
                        _this.eventing = eventing;
                        _this.allowAllGuestsWithoutPrompt = allowAllGuestsWithoutPrompt;
                        _this.color = _this.session.Color;
                        _this.id = _this.session.Id;
                        // WARNING BAD CODE (Robert made me do this!) - drone index 0 is hardcoded here
                        _this.session.getDrones().then(function (drones) {
                            _this.mapDrone = new mapDrone_1.MapDrone(_this.mapEntityCollection);
                            _this.mapDrone.initializeDrone(_this.eventing, drones[0], _this.map, _this.color, true).then(function (mapDrone) {
                                _this.mapDrone = mapDrone;
                                _this.setupEvents();
                                // Initialize waypoints for guided mode
                                _this.mapWaypoints = new MapWaypoints(_this.mapDrone, _this.map, _this.color, _this.id, _this.mapEntityCollection, _this.eventing);
                                resolve(_this);
                            });
                        });
                    });
                };
                OwnerMapSession.prototype.setupEvents = function () {
                    var _this = this;
                    this.session.on('slave-connected', function (username) {
                        // Add username
                        _this.connectedGuests.push(username);
                    });
                    this.session.on('slave-disconnected', function (username) {
                        // Remove username
                        _.remove(_this.connectedGuests, function (name) {
                            return username.toLowerCase() === name.toLowerCase() ? true : false;
                        });
                    });
                    // Wire up slave connection request
                    this.session.on('slave-requesting-connection', function (username, cb) {
                        // check allow all guests flag and return true and exit
                        if (_this.allowAllGuestsWithoutPrompt) {
                            cb(true);
                            return;
                        }
                        _this.eventing.trigger('guest-connect-request', username, cb);
                    });
                };
                OwnerMapSession.prototype.remove = function () {
                    // First call remove on the drone
                    this.mapDrone.remove();
                    this.session.off('slave-connected');
                    this.session.off('slave-disconnected');
                    this.session.off('slave-requesting-connection');
                };
                return OwnerMapSession;
            }(MapSession));
            exports_1("OwnerMapSession", OwnerMapSession);
        }
    }
});

//# sourceMappingURL=mapSession.js.map
