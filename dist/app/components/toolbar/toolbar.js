System.register(['../../common/ngLazyShow', '../dsEnterKey/dsEnterKey', '../droneCameraViewer/droneCameraViewer'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ngLazyShow_1, dsEnterKey_1, droneCameraViewer_1;
    var Toolbar;
    return {
        setters:[
            function (ngLazyShow_1_1) {
                ngLazyShow_1 = ngLazyShow_1_1;
            },
            function (dsEnterKey_1_1) {
                dsEnterKey_1 = dsEnterKey_1_1;
            },
            function (droneCameraViewer_1_1) {
                droneCameraViewer_1 = droneCameraViewer_1_1;
            }],
        execute: function() {
            Toolbar = (function () {
                function Toolbar(bindings, $q) {
                    this.$q = $q;
                    // Flag to indicate if drone camera is showing
                    this.showDroneCamera = false;
                    this.gmapsService = new google.maps.places.AutocompleteService();
                    this.geocoder = new google.maps.Geocoder();
                }
                Toolbar.prototype.search = function (text) {
                    var deferred = this.$q.defer();
                    this.getResults(text).then(function (predictions) {
                        var results = [];
                        if (predictions !== null) {
                            for (var i = 0, prediction; prediction = predictions[i]; i++) {
                                results.push(prediction.description);
                            }
                        }
                        deferred.resolve(results);
                    });
                    return deferred.promise;
                };
                Toolbar.prototype.getResults = function (text) {
                    var deferred = this.$q.defer();
                    this.gmapsService.getQueryPredictions({ input: text }, function (data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                };
                Toolbar.prototype.geoCode = function (text) {
                    var that = this;
                    this.geocoder.geocode({ 'address': text }, function (results, status) {
                        if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
                            var location = results[0].geometry.location;
                            that.onLocationSearch({
                                lat: location.lat(),
                                lng: location.lng()
                            });
                        }
                    });
                };
                Toolbar.prototype.goTo = function (location) {
                    // Geocode location text
                    this.geoCode(location);
                };
                // Constructor
                Toolbar.$inject = [
                    '$scope',
                    '$q',
                ];
                return Toolbar;
            }());
            exports_1("default",angular.module('DroneSense.Web.Toolbar', [
                droneCameraViewer_1.default.name,
                ngLazyShow_1.default.name,
                dsEnterKey_1.default.name
            ]).component('dsToolbar', {
                bindings: {
                    onClearFlightPlan: '&',
                    onShowSettings: '&',
                    onLocationSearch: '&',
                    view: '@',
                    camera: '<',
                    drone: '<',
                    onSaveCamera: '&',
                    onSaveDrone: '&',
                    showDroneCamera: '<',
                    onShowDroneCamera: '&'
                },
                controller: Toolbar,
                templateUrl: './app/components/toolbar/toolbar.html'
            }));
        }
    }
});

//# sourceMappingURL=toolbar.js.map
