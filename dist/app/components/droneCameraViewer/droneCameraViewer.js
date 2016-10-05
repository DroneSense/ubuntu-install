System.register(['@dronesense/model', '@dronesense/model/lib/common/Enums'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var model_1, Enums_1, Enums_2, Enums_3;
    var DroneCameraViewer;
    return {
        setters:[
            function (model_1_1) {
                model_1 = model_1_1;
            },
            function (Enums_1_1) {
                Enums_1 = Enums_1_1;
                Enums_2 = Enums_1_1;
                Enums_3 = Enums_1_1;
            }],
        execute: function() {
            DroneCameraViewer = (function () {
                function DroneCameraViewer(bindings, $q, db) {
                    this.bindings = bindings;
                    this.$q = $q;
                    this.db = db;
                    // flag to indicate that the drone is read only mode
                    this.droneReadOnly = true;
                    // flag to indicate that the camera is read only mode
                    this.cameraReadOnly = true;
                    // flag to indicate that the drone is in edit mode
                    this.droneEditMode = false;
                    // flag to indicate that the camera is in edit mode
                    this.cameraEditMode = false;
                    // flag to indicate that the form is in add drone mode
                    this.addUserDroneMode = false;
                    // flag to indicate that the form is in add camera mode
                    this.addUserCameraMode = false;
                    // List of loaded user drones
                    this.UserDrones = [];
                    // List of loaded catalog drones
                    this.CatalogDrones = [];
                    // List of loaded catalog cameras
                    this.CatalogCameras = [];
                    // List of loaded user cameras
                    this.UserCameras = [];
                }
                DroneCameraViewer.prototype.$onInit = function () {
                    var _this = this;
                    this.bindings.$watch(function () { return _this.camera; }, function (newValue, oldValue) {
                        _this.isCatalogCamera = _this.camera.Type.toLowerCase() === 'catalog';
                        console.log(_this.isCatalogCamera);
                    });
                    this.bindings.$watch(function () { return _this.drone; }, function (newValue, oldValue) {
                        _this.isCatalogDrone = _this.drone.Type.toLowerCase() === 'catalog';
                    });
                    this.LoadUserAndCatalogDronesAndCameras();
                };
                DroneCameraViewer.prototype.LoadUserAndCatalogDronesAndCameras = function () {
                    var _this = this;
                    var catalogDrones = this.db.drones.getCatalogDrones();
                    var userDrones = this.db.drones.getDronesForUser();
                    var catalogCameras = this.db.cameras.getCatalogCameras();
                    var userCameras = this.db.cameras.getCamerasForUser();
                    catalogDrones.on(catalogDrones.EVENTS.LIST_CHANGED, function (drones) {
                        _this.CatalogDrones = [];
                        drones.forEach(function (droneHandle) {
                            _this.CatalogDrones.push(new model_1.Drone(droneHandle.id, droneHandle.handle));
                        });
                    });
                    catalogCameras.on(catalogCameras.EVENTS.LIST_CHANGED, function (cameras) {
                        _this.CatalogCameras = [];
                        cameras.forEach(function (cameraHandle) {
                            _this.CatalogCameras.push(new model_1.Camera(cameraHandle.id, cameraHandle.handle, cameraHandle.type));
                        });
                    });
                    userDrones.on(userDrones.EVENTS.LIST_CHANGED, function (drones) {
                        _this.UserDrones.splice(0, _this.UserDrones.length);
                        drones.forEach(function (droneHandle) {
                            _this.UserDrones.push(new model_1.Drone(droneHandle.id, droneHandle.handle));
                        });
                        _this.bindings.$applyAsync();
                    });
                    userCameras.on(userCameras.EVENTS.LIST_CHANGED, function (cameras) {
                        _this.UserCameras.splice(0, _this.UserCameras.length);
                        cameras.forEach(function (cameraHandle) {
                            _this.UserCameras.push(new model_1.Camera(cameraHandle.id, cameraHandle.handle, cameraHandle.type));
                        });
                        _this.bindings.$applyAsync();
                    });
                };
                DroneCameraViewer.prototype.saveCamera = function () {
                    this.onSaveCamera({
                        camera: this.camera
                    });
                };
                DroneCameraViewer.prototype.saveDrone = function () {
                    this.onSaveDrone({
                        drone: this.drone
                    });
                };
                DroneCameraViewer.prototype.GetFrameTypes = function () {
                    return Enums_2.EnumEx.getNames(Enums_1.FrameType);
                };
                DroneCameraViewer.prototype.GetFrameValue = function (frameType) {
                    return Enums_1.FrameType[frameType];
                };
                DroneCameraViewer.prototype.GetBatteryTypes = function () {
                    return Enums_2.EnumEx.getNames(Enums_3.BatteryType);
                };
                DroneCameraViewer.prototype.GetBatteryValue = function (batteryType) {
                    return Enums_3.BatteryType[batteryType];
                };
                DroneCameraViewer.prototype.GetFlightControllerTypes = function () {
                    return ['DJI', 'APM'];
                };
                // Constructor
                DroneCameraViewer.$inject = [
                    '$scope',
                    '$q',
                    'db'
                ];
                return DroneCameraViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.DroneCameraViewer', []).component('dsDroneCameraViewer', {
                bindings: {
                    camera: '<',
                    drone: '<',
                    onSaveCamera: '&',
                    onSaveDrone: '&'
                },
                controller: DroneCameraViewer,
                templateUrl: './app/components/droneCameraViewer/droneCameraViewer.html'
            }));
        }
    }
});

//# sourceMappingURL=droneCameraViewer.js.map
