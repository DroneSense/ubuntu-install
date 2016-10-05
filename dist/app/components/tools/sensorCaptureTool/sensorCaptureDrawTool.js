System.register(['@dronesense/model', '@dronesense/model/lib/common/Utility'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var model_1, Utility_1;
    var SensorCaptureTool;
    return {
        setters:[
            function (model_1_1) {
                model_1 = model_1_1;
            },
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            }],
        execute: function() {
            SensorCaptureTool = (function () {
                function SensorCaptureTool(map, callback, flightPlan) {
                    this.map = map;
                    this.callback = callback;
                    this.flightPlan = flightPlan;
                    this.IconPath = './app/components/tools/sensorCaptureTool/images/sensorCapture.svg';
                    this.ToolTip = 'Add Sensor Capture Location';
                    this.dragging = false;
                }
                SensorCaptureTool.prototype.UpdateSensor = function (lng, lat, alt) {
                    if (!this.flightPlan.Camera) {
                        return;
                    }
                    // check to see if exists on map
                    if (this.map.scene.primitives.contains(this.sensor)) {
                        this.map.scene.primitives.remove(this.sensor);
                    }
                    this.sensor = new Cesium.RectangularSensor();
                    this.sensor.modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(Cesium.Cartesian3.fromDegrees(lng, lat, alt), 0, -3.14159, 0);
                    // Figure out this calculation
                    this.sensor.radius = 10000;
                    this.sensor.xHalfAngle = this.flightPlan.Camera.getHalfAngleX();
                    this.sensor.yHalfAngle = this.flightPlan.Camera.getHalfAngleY();
                    this.sensor.showIntersection = true;
                    // var material = new Cesium.GridMaterialProperty({
                    //     color : Cesium.Color.WHITE,
                    //     cellAlpha : 0.1,
                    //     lineCount : new Cesium.Cartesian2(8, 8),
                    //     lineThickness: new Cesium.Cartesian2(1.0, 1.0),
                    //     lineOffset: new Cesium.Cartesian2(0.0, 0.0)
                    // });
                    //var material: Cesium.GridMaterialProperty = new Cesium.GridMaterialProperty();
                    //this.sensor.lateralSurfaceMaterial = material;
                    this.sensor.lateralSurfaceMaterial = Cesium.Material.fromType('Grid');
                    this.sensor.lateralSurfaceMaterial.color = new Cesium.Color(0.0, 1.0, 1.0, 0.7);
                    //this.sensor.lateralSurfaceMaterial.uniforms.color = new Cesium.Color(0.0, 1.0, 1.0, 0.5);
                    this.map.scene.primitives.add(this.sensor);
                };
                SensorCaptureTool.prototype.StartEdit = function () {
                    var _this = this;
                    if (this.Selected) {
                        this.StopEdit();
                        return;
                    }
                    this.Selected = true;
                    this.dragging = true;
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
                                url: 'https://www.cesiumcontent.com/api/terrain/world?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkMTM4ZDE2OS05NWYwLTQ0YmItOWY3YS0yNjEwOGE5Y2Y3NjYiLCJpZCI6NywiaWF0IjoxNDU1MjkyNzg5fQ.NDKlrwQZE_04ntDuL89hvatEmuycQo5llhtz3Mi6Wo0'
                            });
                            var positions = [
                                Cesium.Cartographic.fromDegrees(longitudeString, latitudeString)
                            ];
                            // Get terrain height at click location before adding takeoff point
                            Cesium.sampleTerrain(terrainProvider, 15, positions).then(function (updatedPositions) {
                                var surveyCaptureCommand = {
                                    Position: new model_1.GeoPoint(latitudeString, longitudeString),
                                    Altitude: 50,
                                    GroundElevationMSL: updatedPositions[0].height,
                                    GroundElevationHAE: updatedPositions[0].height,
                                    AltitudeMSL: updatedPositions[0].height + 50,
                                    AltitudeHAE: updatedPositions[0].height + 50,
                                    FlightSpeed: 5,
                                    Name: 'Sensor Capture Point',
                                    Type: 'sensor',
                                    Expanded: true,
                                    Heading: 0,
                                    Pitch: -180,
                                    Roll: 0
                                };
                                _this.callback(surveyCaptureCommand);
                            });
                            // check to see if exists on map
                            if (_this.map.scene.primitives.contains(_this.sensor)) {
                                _this.map.scene.primitives.remove(_this.sensor);
                            }
                            _this.StopEdit();
                        }
                    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    // Wire up handler for each mouse move while entity is being dragged
                    this._mouseHandler.setInputAction(function (movement) {
                        console.log(_this.dragging);
                        // Return immediately if we are not dragging anything
                        if (!_this.dragging) {
                            return;
                        }
                        // Use ray pick to get position and convert
                        var ray = _this.map.camera.getPickRay(movement.endPosition);
                        var position = _this.map.scene.globe.pick(ray, _this.map.scene);
                        // Check to see if the position is defined
                        if (!Cesium.defined(position) || !_this.dragging) {
                            return;
                        }
                        var positionCartographic = _this.map.scene.globe.ellipsoid.cartesianToCartographic(position);
                        positionCartographic.height = 0;
                        //position = this.map.scene.globe.ellipsoid.cartographicToCartesian(positionCartographic);
                        //var cartographic: Cesium.Cartographic = Cesium.Cartographic.fromCartesian(position);
                        var longitude = Utility_1.Conversions.formatCoordinate(Cesium.Math.toDegrees(positionCartographic.longitude), 8);
                        var latitude = Utility_1.Conversions.formatCoordinate(Cesium.Math.toDegrees(positionCartographic.latitude), 8);
                        _this.UpdateSensor(longitude, latitude, 200);
                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                };
                SensorCaptureTool.prototype.StopEdit = function () {
                    this._mouseHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    this._mouseHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    this.Selected = false;
                };
                return SensorCaptureTool;
            }());
            exports_1("SensorCaptureTool", SensorCaptureTool);
        }
    }
});

//# sourceMappingURL=sensorCaptureDrawTool.js.map
