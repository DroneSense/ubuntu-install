System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var UIStateService;
    return {
        setters:[],
        execute: function() {
            UIStateService = (function () {
                function UIStateService(db, $rootScope) {
                    this._flightInfoVisible = false;
                    this._flightElevationVisible = false;
                    this._flightWeatherVisible = false;
                    this._flightSurveyVisible = false;
                    this._flightSurveyImagesVisible = false;
                    this.droneCameraVisible = false;
                    this.userSettingsVisible = false;
                    this.commandsVisible = false;
                    this._data = {};
                    this.db = db;
                    this.$rootScope = $rootScope;
                }
                Object.defineProperty(UIStateService.prototype, "FlightInfoVisible", {
                    get: function () {
                        return this._flightInfoVisible;
                    },
                    set: function (value) {
                        var data = {
                            flightInfoVisible: value,
                            flightElevationVisible: false,
                            flightWeatherVisible: false,
                            flightSurveyVisible: false,
                            flightSurveyImagesVisible: false
                        };
                        this.UIStateHandle.update(data);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UIStateService.prototype, "FlightElevationVisible", {
                    get: function () {
                        return this._flightElevationVisible;
                    },
                    set: function (value) {
                        var data = {
                            flightInfoVisible: false,
                            flightElevationVisible: value,
                            flightWeatherVisible: false,
                            flightSurveyVisible: false,
                            flightSurveyImagesVisible: false
                        };
                        this.UIStateHandle.update(data);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UIStateService.prototype, "FlightWeatherVisible", {
                    get: function () {
                        return this._flightWeatherVisible;
                    },
                    set: function (value) {
                        var data = {
                            flightInfoVisible: false,
                            flightElevationVisible: false,
                            flightWeatherVisible: value,
                            flightSurveyVisible: false,
                            flightSurveyImagesVisible: false
                        };
                        this.UIStateHandle.update(data);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UIStateService.prototype, "FlightSurveyVisible", {
                    get: function () {
                        return this._flightSurveyVisible;
                    },
                    set: function (value) {
                        var data = {
                            flightInfoVisible: false,
                            flightElevationVisible: false,
                            flightWeatherVisible: false,
                            flightSurveyVisible: value,
                            flightSurveyImagesVisible: false
                        };
                        this.UIStateHandle.update(data);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UIStateService.prototype, "FlightSurveyImagesVisible", {
                    get: function () {
                        return this._flightSurveyImagesVisible;
                    },
                    set: function (value) {
                        var data = {
                            flightInfoVisible: false,
                            flightElevationVisible: false,
                            flightWeatherVisible: false,
                            flightSurveyVisible: false,
                            flightSurveyImagesVisible: value
                        };
                        this.UIStateHandle.update(data);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UIStateService.prototype, "ActiveSurveyDataId", {
                    set: function (id) {
                        var data = {
                            activeSurveyDataId: id,
                        };
                        this.UIStateHandle.update(data);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UIStateService.prototype, "DroneCameraVisible", {
                    get: function () {
                        return this.droneCameraVisible;
                    },
                    set: function (value) {
                        var data = {
                            droneCameraVisible: value
                        };
                        this.UIStateHandle.update(data);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UIStateService.prototype, "UserSettingsVisible", {
                    get: function () {
                        return this.userSettingsVisible;
                    },
                    set: function (value) {
                        var data = {
                            userSettingsVisible: value
                        };
                        this.UIStateHandle.update(data);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UIStateService.prototype, "CommandsVisible", {
                    get: function () {
                        return this.commandsVisible;
                    },
                    set: function (value) {
                        var data = {
                            commandsVisible: value
                        };
                        this.UIStateHandle.update(data);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UIStateService.prototype, "MapCenterLatLng", {
                    get: function () {
                        return this.mapCenterLatLng;
                    },
                    set: function (value) {
                        var data = {
                            mapCenterLatLng: value
                        };
                        this.UIStateHandle.update(data);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UIStateService.prototype, "MapZoomLevel", {
                    get: function () {
                        return this.mapZoomLevel;
                    },
                    set: function (value) {
                        var data = {
                            mapZoomLevel: value
                        };
                        this.UIStateHandle.update(data);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UIStateService.prototype, "SelectedMap", {
                    get: function () {
                        return this.selectedMap;
                    },
                    set: function (name) {
                        var data = {
                            selectedMap: name
                        };
                        this.UIStateHandle.update(data);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UIStateService.prototype, "SelectedOverlay", {
                    get: function () {
                        return this.selectedOverlay;
                    },
                    set: function (name) {
                        var data = {
                            selectedOverlay: name
                        };
                        this.UIStateHandle.update(data);
                    },
                    enumerable: true,
                    configurable: true
                });
                UIStateService.prototype.InitializeUIState = function (flightPlanId) {
                    if (this.UIStateHandle) {
                        // First turn off previous handle updates
                        this.UIStateHandle.off(this.UIStateHandle.EVENTS.DATA_CHANGED);
                    }
                    this._data = {};
                    // Load new handle with new flight plan ID
                    this.UIStateHandle = this.db.flightplans.ui.getStateForFlightPlanWithId(flightPlanId);
                    var that = this;
                    this.UIStateHandle.on(this.UIStateHandle.EVENTS.DATA_CHANGED, function (data) {
                        that.LoadValues(data);
                    });
                };
                UIStateService.prototype.LoadValues = function (data) {
                    if (data) {
                        if (this._data.flightInfoVisible !== data.flightInfoVisible) {
                            this._flightInfoVisible = data.flightInfoVisible;
                        }
                        if (this._data.flightElevationVisible !== data.flightElevationVisible) {
                            this._flightElevationVisible = data.flightElevationVisible;
                        }
                        if (this._data.flightWeatherVisible !== data.flightWeatherVisible) {
                            this._flightWeatherVisible = data.flightWeatherVisible;
                            if (this._flightWeatherVisible) {
                            }
                        }
                        if (this._data.flightSurveyVisible !== data.flightSurveyVisible) {
                            this._flightSurveyVisible = data.flightSurveyVisible;
                        }
                        if (this._data.flightSurveyImagesVisible !== data.flightSurveyImagesVisible) {
                            this._flightSurveyImagesVisible = data.flightSurveyImagesVisible;
                        }
                        if (this._data.activeSurveyDataId !== data.activeSurveyDataId) {
                            this._activeSurveyDataId = data.activeSurveyDataId;
                        }
                        if (this._data.mapCenterLatLng !== data.mapCenterLatLng) {
                            this.mapCenterLatLng = data.mapCenterLatLng;
                        }
                        if (this._data.mapZoomLevel !== data.mapZoomLevel) {
                            this.mapZoomLevel = data.mapZoomLevel;
                        }
                        if (this._data.selectedMap !== data.selectedMap) {
                            this.selectedMap = data.selectedMap;
                        }
                        // TODO figure out how to make this work as a list
                        //if (this._data.selectedOverlay !== data.selectedOverlay) {
                        //    this.selectedOverlay = data.selectedOverlay;
                        //
                        //    this.$rootScope.$emit('uiStateService:mapOverlayChange', this.selectedOverlay);
                        //}
                        if (this._data.userSettingsVisible !== data.userSettingsVisible) {
                            this.userSettingsVisible = data.userSettingsVisible;
                        }
                        if (this._data.droneCameraVisible !== data.droneCameraVisible) {
                            this.droneCameraVisible = data.droneCameraVisible;
                        }
                        if (this._data.commandsVisible !== data.commandsVisible) {
                            this.commandsVisible = data.commandsVisible;
                        }
                        this._data = data;
                        this.$rootScope.$applyAsync();
                    }
                };
                UIStateService.$inject = [
                    'db',
                    '$rootScope'
                ];
                return UIStateService;
            }());
            exports_1("default",angular.module('DroneSense.Web.UIStateService', []).service('uiStateService', UIStateService));
        }
    }
});
// Code to persist the camera view angles
// var StoredView = function()
// {
//         this.position = undefined;
//         this.direction = undefined;
//         this.up = undefined;
//         this.right = undefined;
//         this.transform = undefined;
//         this.frustum = undefined;
// };
// StoredView.prototype.save = function(camera)
// {
//         if(typeof camera === 'undefined')
//         {
//             throw new DeveloperError('camera is required');
//         }
//         this.position = camera.position.clone(this.position);
//         this.direction = camera.direction.clone(this.direction);
//         this.up = camera.up.clone(this.up);
//         this.right = camera.right.clone(this.right);
//         this.transform = camera.transform.clone(this.transform);
//         this.frustum = camera.frustum.clone(this.frustum);
// };
// StoredView.prototype.load = function(camera)
// {
//         if(typeof this.position === 'undefined')
//         {
//             throw new DeveloperError('no view has been stored');
//         }
//         this.position.clone(camera.position);
//         this.direction.clone(camera.direction);
//         this.up.clone(camera.up);
//         this.right.clone(camera.right);
//         this.transform.clone(camera.transform);
//         this.frustum.clone(camera.frustum);
// };

//# sourceMappingURL=uiStateService.js.map
