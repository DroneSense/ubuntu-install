System.register(['@dronesense/model/lib/common/Utility', '../../../components/commandHeader/commandHeader', '../../../components/formatters/infoFormatter', '../../../common/readableElevation', '../../../components/formatters/unitString', '../../../services/mapService'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Utility_1, commandHeader_1, infoFormatter_1, readableElevation_1, unitString_1, mapService_1;
    var EditMode, SensorCaptureInstance;
    return {
        setters:[
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            },
            function (commandHeader_1_1) {
                commandHeader_1 = commandHeader_1_1;
            },
            function (infoFormatter_1_1) {
                infoFormatter_1 = infoFormatter_1_1;
            },
            function (readableElevation_1_1) {
                readableElevation_1 = readableElevation_1_1;
            },
            function (unitString_1_1) {
                unitString_1 = unitString_1_1;
            },
            function (mapService_1_1) {
                mapService_1 = mapService_1_1;
            }],
        execute: function() {
            (function (EditMode) {
                EditMode[EditMode["AGL"] = 0] = "AGL";
                EditMode[EditMode["MSL"] = 1] = "MSL";
                EditMode[EditMode["GSD"] = 2] = "GSD";
            })(EditMode || (EditMode = {}));
            // Represents a position in space to capture sensor data
            SensorCaptureInstance = (function () {
                function SensorCaptureInstance(bindings, db, mapService) {
                    var _this = this;
                    this.bindings = bindings;
                    this.db = db;
                    this.mapService = mapService;
                    // Flag to indicate if command is being edited in map
                    this.isEditing = false;
                    this.trackedFlag = false;
                    // Create copy for UI binding
                    this.SetupViewData();
                    // Add UI to map
                    this.generateMapUI();
                    // Listen for model changes
                    this.command.on('propertyChanged', function (propName, propValue) {
                        _this.bindings.$applyAsync();
                    });
                    this.bindings.$on('$destroy', function () {
                        // watchers are automatically destroyed
                        // destruction code here
                        _this.user.off();
                        _this.command.off();
                        // Clean up editing handler
                        _this.editingHandler.destroy();
                    });
                    // Update camera track changes
                    this.bindings.$watch(function () { return _this.trackedEntity; }, function (newValue, oldValue) {
                        _this.trackedFlag = (_this.entity.id === newValue);
                    });
                    // Update camera track changes
                    this.bindings.$watch(function () { return _this.camera; }, function (newValue, oldValue) {
                        _this.drawSensor();
                    });
                    this.SetupEditingHandlers();
                    // Set current edit mode based on the flight plan settings object.
                    this.editMode = this.flightPlan.DefaultAltitudeMSL ? EditMode.MSL : EditMode.AGL;
                }
                // Handle on blur property change
                SensorCaptureInstance.prototype.UpdateAltitude = function (positionChanged) {
                    var _this = this;
                    var groundElevationMSL;
                    var groundElevationHAE;
                    // If position changed we need to query the elevation service
                    if (positionChanged) {
                        // Make call to get elevation
                        this.mapService.getElevation(this.position.lat, this.position.lng).then(function (terrainElevation) {
                            groundElevationMSL = terrainElevation;
                            groundElevationHAE = terrainElevation;
                            _this.UpdateDBAltitudes(groundElevationMSL, groundElevationHAE);
                        });
                    }
                    else {
                        groundElevationMSL = this.command.GroundElevationMSL;
                        groundElevationHAE = this.command.GroundElevationHAE;
                        this.UpdateDBAltitudes(groundElevationMSL, groundElevationHAE);
                    }
                    this.drawSensor();
                };
                // There are three values here that need to change.  1) AltitudeAGL 2) AltitudeMSL and GSD
                // On is input and the other two are calculated.
                // First we need to figure out what mode we are in and calculate the other two.
                SensorCaptureInstance.prototype.UpdateDBAltitudes = function (groundElevationMSL, groundElevationHAE) {
                    // If we are in AGL mode then altitudeMSL must be calculated
                    switch (this.editMode) {
                        // Set agl and calculate msl and gsd
                        case EditMode.AGL:
                            this.command.UpdateProperties({
                                Altitude: this.altitude,
                                GroundElevationMSL: groundElevationMSL,
                                GroundElevationHAE: groundElevationHAE,
                                AltitudeMSL: groundElevationMSL + this.altitude,
                                AltitudeHAE: groundElevationHAE + this.altitude,
                                GSD: this.camera.getGSD(this.altitude)
                            });
                            break;
                        // Set MSL and calculate agl and gsd.
                        case EditMode.MSL:
                            this.command.UpdateProperties({
                                Altitude: this.altitudeMSL - this.command.GroundElevationMSL,
                                GroundElevationMSL: groundElevationMSL,
                                GroundElevationHAE: groundElevationHAE,
                                AltitudeMSL: this.altitudeMSL,
                                AltitudeHAE: this.altitudeMSL,
                                GSD: this.camera.getGSD(this.altitudeMSL - this.command.GroundElevationMSL)
                            });
                            break;
                        // Set GSD and calculate agl and msl
                        case EditMode.GSD:
                            this.command.UpdateProperties({
                                Altitude: this.altitudeMSL - this.command.GroundElevationMSL,
                                GroundElevationMSL: groundElevationMSL,
                                GroundElevationHAE: groundElevationHAE,
                                AltitudeMSL: this.altitudeMSL,
                                AltitudeHAE: this.altitudeMSL,
                                GSD: this.gsd
                            });
                            break;
                        default:
                            break;
                    }
                };
                SensorCaptureInstance.prototype.UpdatePosition = function () {
                    // Save property on model
                    this.command.SaveProperty(this.position, 'Position');
                    // Update new position altitude
                    this.UpdateAltitude(true);
                };
                // Remove self from map then call viewer for removal
                SensorCaptureInstance.prototype.Delete = function () {
                    // Remove UI from map
                    this.map.entities.remove(this.entity);
                    // Clean up primitives from map
                    if (this.map.scene.primitives.contains(this.sensor)) {
                        this.map.scene.primitives.remove(this.sensor);
                    }
                    // Call parent delete function
                    this.onDelete({ commandId: this.command.handle.id });
                };
                // Fly camera to this command
                SensorCaptureInstance.prototype.FlyTo = function () {
                    this.map.flyTo(this.entity);
                };
                // Toggle visibility on map
                SensorCaptureInstance.prototype.HideShow = function () {
                    this.entity.show = !this.entity.show;
                };
                // Bind two way fields that are also update
                SensorCaptureInstance.prototype.SetupViewData = function () {
                    var _this = this;
                    this.flightSpeed = this.command.FlightSpeed;
                    this.bindings.$watch(function () { return _this.command.FlightSpeed; }, function (newValue, oldValue) {
                        _this.flightSpeed = _this.command.FlightSpeed;
                    });
                    this.position = this.command.Position;
                    this.bindings.$watch(function () { return _this.command.Position; }, function (newValue, oldValue) {
                        _this.position = _this.command.Position;
                    });
                    this.altitude = this.command.Altitude;
                    this.bindings.$watch(function () { return _this.command.Altitude; }, function (newValue, oldValue) {
                        _this.altitude = _this.command.Altitude;
                    });
                    this.altitudeMSL = this.command.AltitudeMSL;
                    this.bindings.$watch(function () { return _this.command.AltitudeMSL; }, function (newValue, oldValue) {
                        _this.altitudeMSL = _this.command.AltitudeMSL;
                    });
                    this.gsd = this.command.GSD;
                    this.bindings.$watch(function () { return _this.command.GSD; }, function (newValue, oldValue) {
                        _this.gsd = _this.command.GSD;
                    });
                    this.heading = this.command.Heading;
                    this.bindings.$watch(function () { return _this.command.Heading; }, function (newValue, oldValue) {
                        _this.heading = _this.command.Heading;
                    });
                    this.pitch = this.command.Pitch;
                    this.bindings.$watch(function () { return _this.command.Pitch; }, function (newValue, oldValue) {
                        _this.pitch = _this.command.Pitch;
                    });
                    this.roll = this.command.Roll;
                    this.bindings.$watch(function () { return _this.command.Roll; }, function (newValue, oldValue) {
                        _this.roll = _this.command.Roll;
                    });
                };
                SensorCaptureInstance.prototype.SetupEditingHandlers = function () {
                    this.editingHandler = new Cesium.ScreenSpaceEventHandler(this.map.canvas);
                };
                SensorCaptureInstance.prototype.EditMode = function (modeName) {
                    if (EditMode[this.editMode] === modeName) {
                        return true;
                    }
                    else if (EditMode[this.editMode] === modeName) {
                        return true;
                    }
                    else if (EditMode[this.editMode] === modeName) {
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                SensorCaptureInstance.prototype.drawSensor = function () {
                    if (!this.camera) {
                        return;
                    }
                    // check to see if exists on map
                    if (this.map.scene.primitives.contains(this.sensor)) {
                        this.map.scene.primitives.remove(this.sensor);
                    }
                    this.sensor = new Cesium.RectangularSensor();
                    this.sensor.modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(Cesium.Cartesian3.fromDegrees(this.position.lng, this.position.lat, this.altitudeMSL), Utility_1.Conversions.toRadians(this.heading), Utility_1.Conversions.toRadians(this.pitch), Utility_1.Conversions.toRadians(this.roll));
                    // Figure out this calculation
                    this.sensor.radius = 10000;
                    this.sensor.xHalfAngle = this.camera.getHalfAngleX();
                    this.sensor.yHalfAngle = this.camera.getHalfAngleY();
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
                    this.sensor.lateralSurfaceMaterial = Cesium.Material.fromType('Grid', {});
                    //this.sensor.lateralSurfaceMaterial.color = new Cesium.Color(1, 1, 1, 0.7);
                    //this.sensor.lateralSurfaceMaterial.uniforms.color = new Cesium.Color(1.0, 1.0, 1.0, 0.8);
                    this.map.scene.primitives.add(this.sensor);
                };
                SensorCaptureInstance.prototype.generateMapUI = function () {
                    var _this = this;
                    this.drawSensor();
                    // create the svg image string
                    var svgDataDeclare = 'data:image/svg+xml,';
                    var svgCircle = '<path style="fill:#ffffff" d="M12,23.9L0.1,12L12,0.1L23.9,12L12,23.9z M4.4,12l7.6,7.6l7.6-7.6L12,4.4L4.4,12z"/>';
                    var svgPrefix = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xml:space="preserve">';
                    var svgSuffix = '</svg>';
                    var svgString = svgPrefix + svgCircle + svgSuffix;
                    // create the cesium entity
                    var svgEntityImage = svgDataDeclare + svgString;
                    //  var entity = viewer.entities.add({
                    //      position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883, 10),
                    //      billboard: {
                    //          image: svgEntityImage
                    //      }
                    //  });
                    this.entity = this.map.entities.add({
                        name: this.command.Name,
                        id: this.command.handle.id,
                        polyline: {
                            positions: new Cesium.CallbackProperty(function () {
                                return Cesium.Cartesian3.fromDegreesArrayHeights([_this.position.lng, _this.position.lat, _this.command.GroundElevationHAE,
                                    _this.position.lng, _this.position.lat, _this.altitude + _this.command.GroundElevationHAE]);
                            }, false),
                            width: 2,
                            material: Cesium.Color.fromBytes(255, 255, 255, 255)
                        },
                        position: new Cesium.CallbackProperty(function () {
                            return Cesium.Cartesian3.fromDegrees(_this.position.lng, _this.position.lat, _this.altitude + _this.command.GroundElevationHAE);
                        }, false),
                        billboard: {
                            image: svgEntityImage,
                            sizeInMeters: false
                        }
                    });
                };
                SensorCaptureInstance.prototype.Edit = function () {
                    var _this = this;
                    if (this.isEditing) {
                        this.isEditing = false;
                        // Turn off editing and make appropriate updates
                        this.editingHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
                        this.editingHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
                        this.editingHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    }
                    else {
                        // Turn on editing and wire up event listening
                        this.isEditing = true;
                        var dragging;
                        // Wire up handler to listen for left mouse down event
                        this.editingHandler.setInputAction(function (click) {
                            // Check to see what the mouse has selected
                            var pickedObject = _this.map.scene.pick(click.position);
                            // Check to make sure we are only grabbing the entity we are editing
                            if (Cesium.defined(pickedObject) && pickedObject.id === _this.entity) {
                                dragging = pickedObject;
                                // Turn off rotation so we only move the entity
                                _this.map.scene.screenSpaceCameraController.enableRotate = false;
                                // Turn off depth testing so we can see the feature around terrain
                                _this.map.scene.globe.depthTestAgainstTerrain = false;
                            }
                        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
                        // Wire up handler to listen for left mouse up event
                        this.editingHandler.setInputAction(function () {
                            // Check if dragging entity is defined
                            if (Cesium.defined(dragging)) {
                                // Reset to undefined
                                dragging = undefined;
                                // Renable rotation
                                _this.map.scene.screenSpaceCameraController.enableRotate = true;
                                // Turn depth testing back on
                                _this.map.scene.globe.depthTestAgainstTerrain = true;
                                _this.UpdatePosition();
                            }
                        }, Cesium.ScreenSpaceEventType.LEFT_UP);
                        // Wire up handler for each mouse move while entity is being dragged
                        this.editingHandler.setInputAction(function (movement) {
                            // Return immediately if we are not dragging anything
                            if (!dragging) {
                                return;
                            }
                            // Use ray pick to get position and convert
                            var ray = _this.map.camera.getPickRay(movement.endPosition);
                            var position = _this.map.scene.globe.pick(ray, _this.map.scene);
                            // Check to see if the position is defined
                            if (!Cesium.defined(position) || !dragging) {
                                return;
                            }
                            var positionCartographic = _this.map.scene.globe.ellipsoid.cartesianToCartographic(position);
                            positionCartographic.height = 0;
                            //position = this.map.scene.globe.ellipsoid.cartographicToCartesian(positionCartographic);
                            //var cartographic: Cesium.Cartographic = Cesium.Cartographic.fromCartesian(position);
                            var longitude = Utility_1.Conversions.formatCoordinate(Cesium.Math.toDegrees(positionCartographic.longitude), 8);
                            var latitude = Utility_1.Conversions.formatCoordinate(Cesium.Math.toDegrees(positionCartographic.latitude), 8);
                            _this.position.lng = longitude;
                            _this.position.lat = latitude;
                            _this.bindings.$applyAsync();
                        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    }
                };
                SensorCaptureInstance.prototype.TrackEntity = function () {
                    this.onTrackEntity({ id: this.entity.id });
                };
                // Constructor
                SensorCaptureInstance.$inject = [
                    '$scope',
                    'db',
                    'mapService'
                ];
                return SensorCaptureInstance;
            }());
            exports_1("default",angular.module('DroneSense.Web.SensorCaptureInstance', [
                commandHeader_1.default.name,
                infoFormatter_1.default.name,
                readableElevation_1.default.name,
                unitString_1.default.name,
                mapService_1.default.name
            ]).component('dsSensorCaptureInstance', {
                transclude: true,
                bindings: {
                    command: '<',
                    onCommandChange: '&',
                    map: '<',
                    user: '<',
                    onDelete: '&',
                    trackedEntity: '<',
                    onTrackEntity: '&',
                    camera: '<',
                    flightPlan: '<'
                },
                controller: SensorCaptureInstance,
                templateUrl: './app/components/tools/sensorCaptureTool/sensorCaptureToolInstance.html'
            }));
        }
    }
});

//# sourceMappingURL=sensorCaptureToolInstance.js.map
