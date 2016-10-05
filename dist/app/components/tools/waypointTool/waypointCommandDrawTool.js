System.register(['@dronesense/model', '@dronesense/model/lib/common/Utility'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var model_1, Utility_1;
    var WaypointCommandDrawTool;
    return {
        setters:[
            function (model_1_1) {
                model_1 = model_1_1;
            },
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            }],
        execute: function() {
            WaypointCommandDrawTool = (function () {
                function WaypointCommandDrawTool(map, callback, flightPlan) {
                    this.map = map;
                    this.callback = callback;
                    this.flightPlan = flightPlan;
                    this.IconPath = './app/components/tools/waypointTool/images/waypoint.svg';
                    this.ToolTip = 'Add Waypoint';
                }
                WaypointCommandDrawTool.prototype.StartEdit = function () {
                    var _this = this;
                    if (this.Selected) {
                        this.StopEdit();
                        return;
                    }
                    this.Selected = true;
                    // wire up left mouse click event
                    this._mouseHandler = new Cesium.ScreenSpaceEventHandler(this.map.canvas, false);
                    this._mouseHandler.setInputAction(function (click) {
                        var ray = _this.map.camera.getPickRay(click.position);
                        var position = _this.map.scene.globe.pick(ray, _this.map.scene);
                        console.log(position);
                        if (Cesium.defined(position)) {
                            // Make the height of the position = 0 so it works with groundPrimitive
                            var positionCartographic = _this.map.scene.globe.ellipsoid.cartesianToCartographic(position);
                            positionCartographic.height = 0;
                            //position = this.map.scene.globe.ellipsoid.cartographicToCartesian(positionCartographic);
                            //var cartographic: Cesium.Cartographic = Cesium.Cartographic.fromCartesian(position);
                            var longitudeString = Utility_1.Conversions.formatCoordinate(Cesium.Math.toDegrees(positionCartographic.longitude), 8);
                            var latitudeString = Utility_1.Conversions.formatCoordinate(Cesium.Math.toDegrees(positionCartographic.latitude), 8);
                            var terrainProvider = new Cesium.CesiumTerrainProvider({
                                //url: 'https://www.cesiumcontent.com/api/terrain/world?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkMTM4ZDE2OS05NWYwLTQ0YmItOWY3YS0yNjEwOGE5Y2Y3NjYiLCJpZCI6NywiaWF0IjoxNDU1MjkyNzg5fQ.NDKlrwQZE_04ntDuL89hvatEmuycQo5llhtz3Mi6Wo0'
                                url: '//assets.agi.com/stk-terrain/world'
                            });
                            var positions = [
                                Cesium.Cartographic.fromDegrees(longitudeString, latitudeString)
                            ];
                            // Get terrain height at click location before adding takeoff point
                            Cesium.sampleTerrain(terrainProvider, 15, positions).then(function (updatedPositions) {
                                var waypointCommand;
                                if (_this.flightPlan.DefaultAltitudeMSL && (_this.flightPlan.DefaultWaypointAltitude - updatedPositions[0].height) > updatedPositions[0].height) {
                                    waypointCommand = {
                                        Position: new model_1.GeoPoint(latitudeString, longitudeString),
                                        Altitude: _this.flightPlan.DefaultWaypointAltitude - updatedPositions[0].height,
                                        GroundElevationMSL: updatedPositions[0].height,
                                        GroundElevationHAE: updatedPositions[0].height,
                                        AltitudeMSL: _this.flightPlan.DefaultWaypointAltitude,
                                        AltitudeHAE: _this.flightPlan.DefaultWaypointAltitude,
                                        FlightSpeed: _this.flightPlan.DefaultFlightSpeed,
                                        Name: 'Waypoint',
                                        Type: 'waypoint',
                                        Expanded: true
                                    };
                                }
                                else {
                                    waypointCommand = {
                                        Position: new model_1.GeoPoint(latitudeString, longitudeString),
                                        Altitude: _this.flightPlan.DefaultWaypointAltitude,
                                        GroundElevationMSL: updatedPositions[0].height,
                                        GroundElevationHAE: updatedPositions[0].height,
                                        AltitudeMSL: updatedPositions[0].height + _this.flightPlan.DefaultWaypointAltitude,
                                        AltitudeHAE: updatedPositions[0].height + _this.flightPlan.DefaultWaypointAltitude,
                                        FlightSpeed: _this.flightPlan.DefaultFlightSpeed,
                                        Name: 'Waypoint',
                                        Type: 'waypoint',
                                        Expanded: true
                                    };
                                }
                                _this.callback(waypointCommand);
                            });
                            _this.StopEdit();
                        }
                    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                };
                WaypointCommandDrawTool.prototype.StopEdit = function () {
                    this._mouseHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    this.Selected = false;
                };
                return WaypointCommandDrawTool;
            }());
            exports_1("WaypointCommandDrawTool", WaypointCommandDrawTool);
        }
    }
});

//# sourceMappingURL=waypointCommandDrawTool.js.map
