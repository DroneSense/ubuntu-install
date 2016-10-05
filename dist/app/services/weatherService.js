System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var WeatherService, Weather;
    return {
        setters:[],
        execute: function() {
            WeatherService = (function () {
                function WeatherService($q, $http) {
                    this.weatherAPIBaseURL = 'http://uavconditions.cloudapp.net/';
                    this.$q = $q;
                    this.$http = $http;
                }
                WeatherService.prototype.getWeather = function (lat, lng) {
                    var deferred = this.$q.defer();
                    this.$http.get(this.weatherAPIBaseURL + lat + '/' + lng)
                        .success(function (data) {
                        var weather = new Weather(data);
                        console.log(data);
                        deferred.resolve(weather);
                    }).error(function () {
                        deferred.reject('There was an error getting the weather.');
                    });
                    return deferred.promise;
                };
                WeatherService.$inject = ['$q', '$http'];
                return WeatherService;
            }());
            exports_1("default",angular.module('DroneSense.Web.WeatherService', []).service('weatherService', WeatherService));
            Weather = (function () {
                function Weather(data) {
                    this.current = data.weather.current;
                    this.daily = data.weather.daily;
                    this.hourly = data.weather.hourly;
                    this.kp = data.kp;
                }
                return Weather;
            }());
            exports_1("Weather", Weather);
        }
    }
});

//# sourceMappingURL=weatherService.js.map
