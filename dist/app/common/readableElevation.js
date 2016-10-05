System.register(['@dronesense/model/lib/common/Utility'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Utility_1;
    var readableElevation;
    return {
        setters:[
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            }],
        execute: function() {
            readableElevation = ['$rootScope', function ($rootScope) {
                    return {
                        restrict: 'A',
                        require: 'ngModel',
                        link: function (scope, element, attr, ngModel) {
                            scope.$watch(function () { return $rootScope.isMetric; }, function (newValue, oldValue) {
                                if ($rootScope.isMetric || $rootScope.isMetric === undefined) {
                                    ngModel.$setViewValue(ngModel.$modelValue.toFixed(2));
                                }
                                else {
                                    ngModel.$setViewValue(Utility_1.Conversions.metersToFeet(ngModel.$modelValue));
                                }
                                ngModel.$render();
                            });
                            // What to show
                            ngModel.$formatters.push(function (value) {
                                if ($rootScope.isMetric || $rootScope.isMetric === undefined) {
                                    return parseFloat(value.toFixed(2));
                                }
                                else {
                                    return Utility_1.Conversions.metersToFeet(value);
                                }
                            });
                            // What to give to the model
                            ngModel.$parsers.push(function (value) {
                                if (!$rootScope.isMetric || $rootScope.isMetric === undefined) {
                                    return Utility_1.Conversions.feetToMeters(value);
                                }
                                else {
                                    return value;
                                }
                            });
                        }
                    };
                }];
            exports_1("default",angular.module('DroneSense.Web.ReadableElevation', []).directive('readableElevation', readableElevation));
        }
    }
});

//# sourceMappingURL=readableElevation.js.map
