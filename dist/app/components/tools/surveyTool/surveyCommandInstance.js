System.register(['@dronesense/model/lib/common/Utility'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Utility_1;
    var SurveyCommandInstance;
    return {
        setters:[
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            }],
        execute: function() {
            SurveyCommandInstance = (function () {
                function SurveyCommandInstance(bindings, db) {
                    var _this = this;
                    this.bindings = bindings;
                    this.db = db;
                    // Flag to indicate if command is being edited in map
                    this.isEditing = false;
                    this.trackedFlag = false;
                    // Create copy for UI binding
                    this.SetupViewData();
                    // Add UI to map
                    this.generateMapUI();
                    // Listen for model changes
                    // this.command.ModelUpdated.on((type: string): void => {
                    //     this.bindings.$applyAsync();
                    // });
                    this.bindings.$on('$destroy', function () {
                        // watchers are automatically destroyed
                        // destruction code here
                        // this.user.ModelUpdated.off((): void => {
                        // });
                        // this.command.ModelUpdated.off((): void => {
                        // });
                        // Clean up editing handler
                        _this.editingHandler.destroy();
                    });
                    // Update camera track changes
                    this.bindings.$watch(function () { return _this.trackedEntity; }, function (newValue, oldValue) {
                        _this.trackedFlag = (_this.entity.id === newValue);
                    });
                    this.SetupEditingHandlers();
                }
                // Handle on blur property change
                SurveyCommandInstance.prototype.UpdateAltitude = function () {
                    // Setup terrain provider
                    var terrainProvider = new Cesium.CesiumTerrainProvider({
                        url: 'https://www.cesiumcontent.com/api/terrain/world?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkMTM4ZDE2OS05NWYwLTQ0YmItOWY3YS0yNjEwOGE5Y2Y3NjYiLCJpZCI6NywiaWF0IjoxNDU1MjkyNzg5fQ.NDKlrwQZE_04ntDuL89hvatEmuycQo5llhtz3Mi6Wo0'
                    });
                    // Create positions object for terrain query
                    var positions = [
                        Cesium.Cartographic.fromDegrees(this.position.lng, this.position.lat)
                    ];
                    // Call async sampleTerrain TODO - This will fail if we don't have the terrain tile either from the server or in cache
                    // TODO - Move this to common function
                    Cesium.sampleTerrain(terrainProvider, 15, positions).then(function (updatedPositions) {
                        // Save property on model
                        // this.command.UpdateProperties({
                        //     Altitude: this.altitude,
                        //     GroundElevationMSL: updatedPositions[0].height,
                        //     GroundElevationHAE: updatedPositions[0].height,
                        //     AltitudeMSL: updatedPositions[0].height + this.altitude,
                        //     AltitudeHAE: updatedPositions[0].height + this.altitude
                        // });
                    });
                };
                SurveyCommandInstance.prototype.UpdatePosition = function () {
                    // Save property on model
                    //this.command.SaveProperty(this.position, 'Position');
                    this.UpdateAltitude();
                };
                // Remove self from map then call viewer for removal
                SurveyCommandInstance.prototype.Delete = function () {
                    // Remove UI from map
                    this.map.entities.remove(this.entity);
                    // Call parent delete function
                    //this.onDelete({commandId: this.command.id });
                };
                // Fly camera to this command
                SurveyCommandInstance.prototype.FlyTo = function () {
                    this.map.flyTo(this.entity);
                };
                // Toggle visibility on map
                SurveyCommandInstance.prototype.HideShow = function () {
                    this.entity.show = !this.entity.show;
                };
                // Bind two way fields that are also update
                SurveyCommandInstance.prototype.SetupViewData = function () {
                    // this.flightSpeed = this.command.Speed;
                    // this.bindings.$watch(() => { return this.command.Speed; }, (newValue: number, oldValue: number) => {
                    //     this.flightSpeed = this.command.Speed;
                    // });
                    // // this.position = this.command.Position;
                    // // this.bindings.$watch(() => { return this.command.Position; }, (newValue: number, oldValue: number) => {
                    // //     this.position = this.command.Position;
                    // // });
                    // this.altitude = this.command.Altitude;
                    // this.bindings.$watch(() => { return this.command.Altitude; }, (newValue: number, oldValue: number) => {
                    //     this.altitude = this.command.Altitude;
                    // });
                };
                SurveyCommandInstance.prototype.SetupEditingHandlers = function () {
                    this.editingHandler = new Cesium.ScreenSpaceEventHandler(this.map.canvas);
                };
                SurveyCommandInstance.prototype.generateMapUI = function () {
                    // this.entity = this.map.entities.add({
                    //     name: this.command.Name,
                    //     id: this.command.id,
                    //     polyline: {
                    //         positions: new Cesium.CallbackProperty( (): any => {
                    //             return Cesium.Cartesian3.fromDegreesArrayHeights(
                    //                 [this.position.lng, this.position.lat, this.command.GroundElevationHAE,
                    //                     this.position.lng, this.position.lat, this.altitude + this.command.GroundElevationHAE]);
                    //         }, false) ,
                    //         width: 10,
                    //         material: new Cesium.PolylineGlowMaterialProperty({
                    //             glowPower: 0.1,
                    //             color: Cesium.Color.fromBytes(242, 101, 34, 255)
                    //         })
                    //     },
                    //     position: new Cesium.CallbackProperty( (): any => {
                    //         return Cesium.Cartesian3.fromDegrees(this.position.lng, this.position.lat, this.altitude + this.command.GroundElevationHAE);
                    //     }, false) ,
                    //     point: {
                    //         pixelSize: 10,
                    //         color: Cesium.Color.fromBytes(242, 101, 34, 255)
                    //     }
                    // });
                };
                SurveyCommandInstance.prototype.Edit = function () {
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
                            position = _this.map.scene.globe.ellipsoid.cartographicToCartesian(positionCartographic);
                            var cartographic = Cesium.Cartographic.fromCartesian(position);
                            var longitude = Utility_1.Conversions.formatCoordinate(Cesium.Math.toDegrees(cartographic.longitude), 8);
                            var latitude = Utility_1.Conversions.formatCoordinate(Cesium.Math.toDegrees(cartographic.latitude), 8);
                            _this.position.lng = longitude;
                            _this.position.lat = latitude;
                            _this.bindings.$applyAsync();
                        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    }
                };
                SurveyCommandInstance.prototype.TrackEntity = function () {
                    this.onTrackEntity({ id: this.entity.id });
                };
                // Constructor
                SurveyCommandInstance.$inject = [
                    '$scope',
                    'db'
                ];
                return SurveyCommandInstance;
            }());
            exports_1("default",angular.module('DroneSense.Web.SurveyCommandInstance', []).component('dsSurveyCommandInstance', {
                transclude: true,
                bindings: {
                    command: '<',
                    onCommandChange: '&',
                    map: '<',
                    user: '<',
                    onDelete: '&',
                    trackedEntity: '<',
                    onTrackEntity: '&'
                },
                controller: SurveyCommandInstance,
                templateUrl: './app/components/tools/surveyTool/surveyCommandInstance.html'
            }));
        }
    }
});

//# sourceMappingURL=surveyCommandInstance.js.map
