System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var GeocodeService, GeocodeResult;
    return {
        setters:[],
        execute: function() {
            GeocodeService = (function () {
                function GeocodeService($q, $http) {
                    this.$q = $q;
                    this.$http = $http;
                }
                GeocodeService.prototype.getGeocodeForLatLng = function (lat, lng) {
                    var deferred = this.$q.defer();
                    var geocodeService = new google.maps.Geocoder();
                    geocodeService.geocode({ 'location': new google.maps.LatLng(lat, lng) }, function (results, status) {
                        if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
                            var geocodeResult = new GeocodeResult(results);
                            deferred.resolve(geocodeResult);
                        }
                        else {
                            deferred.reject('There was an error geocoding the location.');
                        }
                    });
                    return deferred.promise;
                };
                GeocodeService.prototype.getGeocodeForAddress = function (address) {
                    var deferred = this.$q.defer();
                    // TODO Implement
                    return deferred.promise;
                };
                GeocodeService.$inject = ['$q', '$http'];
                return GeocodeService;
            }());
            exports_1("default",angular.module('DroneSense.Web.GeocodeService', []).service('geocodeService', GeocodeService));
            GeocodeResult = (function () {
                function GeocodeResult(data) {
                    this.current = data;
                    this.parseCityState(data[0]);
                }
                GeocodeResult.prototype.parseCityState = function (result) {
                    var addressComponents = result.address_components;
                    for (var i = 0; i < addressComponents.length; ++i) {
                        if (addressComponents[i].types[0] === 'administrative_area_level_1') {
                            this.state = addressComponents[i].long_name;
                        }
                        if (addressComponents[i].types[0] === 'locality') {
                            this.city = addressComponents[i].long_name;
                        }
                    }
                };
                return GeocodeResult;
            }());
            exports_1("GeocodeResult", GeocodeResult);
        }
    }
});

//# sourceMappingURL=geocodeService.js.map
