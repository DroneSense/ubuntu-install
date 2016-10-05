System.register(['../weatherViewer/weatherViewer'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var weatherViewer_1;
    var FlightInfoViewer;
    return {
        setters:[
            function (weatherViewer_1_1) {
                weatherViewer_1 = weatherViewer_1_1;
            }],
        execute: function() {
            FlightInfoViewer = (function () {
                function FlightInfoViewer(bindings) {
                }
                // Constructor
                FlightInfoViewer.$inject = [
                    '$scope',
                ];
                return FlightInfoViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.FlightInfoViewer', [
                weatherViewer_1.default.name
            ]).component('dsFlightInfoViewer', {
                bindings: {
                    map: '<',
                    uiStateService: '=',
                    flightPlan: '<'
                },
                controller: FlightInfoViewer,
                templateUrl: './app/components/flightInfoViewer/flightInfoViewer.html'
            }).filter('percentage', ['$filter', function ($filter) {
                    return function (input, decimals) {
                        return $filter('number')(input * 100, decimals) + '%';
                    };
                }]));
        }
    }
});

//# sourceMappingURL=flightInfoViewer.js.map
