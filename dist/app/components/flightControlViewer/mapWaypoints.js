System.register(['./mapWaypoint', '@dronesense/model/lib/common/Utility'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var mapWaypoint_1, Utility_1;
    var MapWaypoints;
    return {
        setters:[
            function (mapWaypoint_1_1) {
                mapWaypoint_1 = mapWaypoint_1_1;
            },
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            }],
        execute: function() {
            MapWaypoints = (function () {
                function MapWaypoints(drone, map, color, sesisonId, entityCollection, eventing, $log) {
                    var _this = this;
                    this.eventing = eventing;
                    this.$log = $log;
                    this.waypoints = [];
                    this.showHistoricalWaypoints = true;
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
                            var newWaypoint = new mapWaypoint_1.MapWaypoint(wp, index, height);
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
                        _this.$log.log({ message: 'Waypoint Added', index: index, waypoint: wayPoint });
                        try {
                            _this.getHAE(wayPoint.lattitude, wayPoint.longitude).then(function (height) {
                                _this.waypoints.splice(index, 0, new mapWaypoint_1.MapWaypoint(wayPoint, index, height));
                                _this.addWaypointToMap(_this.waypoints[index]);
                                // Fix the animation clock
                                _this.map.clock.currentTime = Cesium.JulianDate.now();
                                _this.updateIndexes();
                            });
                        }
                        catch (error) {
                            _this.$log.error({ message: 'Error getting hae for waypoint and adding to map handler.', error: error });
                        }
                    });
                    this.drone.drone.FlightController.Guided.on('waypoint-removed', function (index) {
                        try {
                            _this.$log.log({ message: 'Waypoint Removed', index: index, name: _this.waypoints[index].name });
                            _this.removeWaypointFromMap(_this.waypoints[index].name);
                            _this.waypoints.splice(index, 1);
                            _this.updateIndexes();
                        }
                        catch (error) {
                            _this.$log.error({ message: 'Error removing waypoint handler.', error: error });
                        }
                    });
                    this.drone.drone.FlightController.Guided.on('waypoints-changed', function () {
                        _this.$log.log({ message: 'Waypoint Changed' });
                    });
                    this.drone.drone.FlightController.Guided.on('waypoint-error', function (index, error) {
                        try {
                            _this.$log.error({ message: 'Waypoint Error', index: index, name: _this.waypoints[index].name, error: error });
                            if (_this.waypoints[index]) {
                                _this.eventing.trigger('waypoint-error', _this.waypoints[index].name);
                            }
                        }
                        catch (error) {
                            _this.$log.error({ message: 'Error in waypoint error handler.', error: error });
                        }
                    });
                    this.drone.drone.FlightController.Guided.on('waypoint-started', function (index) {
                        try {
                            _this.$log.log({ message: 'Waypoint Started', index: index, name: _this.waypoints[index].name });
                            if (_this.currentWaypoint) {
                                _this.currentWaypoint.isActive = false;
                            }
                            _this.currentWaypoint = _this.waypoints[index];
                            _this.currentIndex = index;
                            _this.waypoints[index].isActive = true;
                        }
                        catch (error) {
                            _this.$log.error({ message: 'Error in starting waypoint handler.', error: error });
                        }
                    });
                    this.drone.drone.FlightController.Guided.on('waypoint-reached', function (index) {
                        try {
                            _this.$log.log({ message: 'Waypoint Reached', index: index, name: _this.waypoints[index].name });
                            _this.waypoints[index].reached = true;
                            _this.waypoints[index].isActive = false;
                            _this.waypoints[index].entity.show = _this.showHistoricalWaypoints;
                        }
                        catch (error) {
                            _this.$log.error({ message: 'Error in waypoing reached handler.', error: error });
                        }
                    });
                }
                MapWaypoints.prototype.hideHistoryWaypoints = function (show) {
                    this.showHistoricalWaypoints = show;
                    this.waypoints.forEach(function (waypoint) {
                        if (waypoint.reached) {
                            waypoint.entity.show = show;
                        }
                    });
                };
                MapWaypoints.prototype.removeWaypointFromMap = function (name) {
                    this.mapEntityCollection.entities.removeById(this.sessionId + name);
                };
                MapWaypoints.prototype.updateIndexes = function () {
                    this.waypoints.forEach(function (wp, index) {
                        wp.index = index;
                    });
                };
                MapWaypoints.prototype.addWaypointToMap = function (waypoint) {
                    try {
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
                    }
                    catch (error) {
                        this.$log.error({ message: 'Error in adding waypoint to map code.', error: error });
                    }
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
                            _this.$log.error({ message: 'Error in getting waypoing HAE', error: error });
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
                    try {
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
                    }
                    catch (error) {
                        this.$log.error({ message: 'calculate time and distance function', error: error });
                    }
                };
                return MapWaypoints;
            }());
            exports_1("MapWaypoints", MapWaypoints);
        }
    }
});

//# sourceMappingURL=mapWaypoints.js.map
