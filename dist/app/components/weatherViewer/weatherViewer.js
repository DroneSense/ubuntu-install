System.register(['../../services/weatherService', '../../services/geocodeService'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var weatherService_1, geocodeService_1;
    var WeatherViewer;
    return {
        setters:[
            function (weatherService_1_1) {
                weatherService_1 = weatherService_1_1;
            },
            function (geocodeService_1_1) {
                geocodeService_1 = geocodeService_1_1;
            }],
        execute: function() {
            WeatherViewer = (function () {
                function WeatherViewer(bindings, weatherService, geocodeService) {
                    this.bindings = bindings;
                    this.weatherService = weatherService;
                    this.geocodeService = geocodeService;
                    this.weatherLoading = false;
                    this.showIcon = false;
                }
                WeatherViewer.prototype.$onInit = function () {
                    this.getWeather();
                };
                WeatherViewer.prototype.getWeather = function () {
                    // TODO - This can only be used if we can detect that the map has moved
                    //// If weather has been check within the last 10 minutes just return
                    //if (this.lastWeatherLoad !== undefined && Math.floor((new Date().getTime() - this.lastWeatherLoad.getTime()) / 60000) < 10 ) {
                    //    return;
                    //}
                    var _this = this;
                    // Start Spinner
                    this.weatherLoading = true;
                    var cartoPosition = this.map.camera.positionCartographic;
                    this.weatherService.getWeather(Cesium.Math.toDegrees(cartoPosition.latitude), Cesium.Math.toDegrees(cartoPosition.longitude)).then(function (weather) {
                        //console.log(weather);
                        // Load Data
                        _this.weatherData = weather;
                        _this.lastWeatherLoad = new Date();
                        // Stop Spinner
                        _this.showIcon = true;
                        _this.weatherLoading = false;
                    });
                    this.geocodeService.getGeocodeForLatLng(Cesium.Math.toDegrees(cartoPosition.latitude), Cesium.Math.toDegrees(cartoPosition.longitude)).then(function (geocodeResult) {
                        _this.geocodeData = geocodeResult;
                    });
                };
                // Constructor
                WeatherViewer.$inject = [
                    '$scope',
                    'weatherService',
                    'geocodeService'
                ];
                return WeatherViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.WeatherViewer', [
                weatherService_1.default.name,
                geocodeService_1.default.name
            ]).component('dsWeatherViewer', {
                bindings: {
                    map: '<'
                },
                controller: WeatherViewer,
                templateUrl: './app/components/weatherViewer/weatherViewer.html'
            }));
        }
    }
});

//# sourceMappingURL=weatherViewer.js.map
