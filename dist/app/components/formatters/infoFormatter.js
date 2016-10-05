System.register(['@dronesense/model/lib/common/Utility'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Utility_1;
    var InfoFormatter;
    return {
        setters:[
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            }],
        execute: function() {
            InfoFormatter = (function () {
                function InfoFormatter(bindings) {
                    var _this = this;
                    this.bindings = bindings;
                    this.viewData = this.value;
                    this.bindings.$watch(function () {
                        return _this.value;
                    }, function (newValue, oldValue) {
                        _this.setValues();
                    });
                    this.bindings.$watch(function () {
                        return _this.user.UnitPreference;
                    }, function (newValue, oldValue) {
                        _this.setValues();
                    });
                }
                InfoFormatter.prototype.setValues = function () {
                    if (this.user.isMetric()) {
                        this.viewData = Utility_1.Conversions.roundToTwo(this.value);
                        if (this.format === 'elevation') {
                            this.unit = 'meters';
                        }
                        else if (this.format === 'speed') {
                            this.unit = 'm/s';
                        }
                    }
                    else {
                        this.viewData = Utility_1.Conversions.metersToFeet(this.value);
                        if (this.format === 'elevation') {
                            this.unit = 'feet';
                        }
                        else if (this.format === 'speed') {
                            this.unit = 'ft/s';
                        }
                    }
                };
                InfoFormatter.$inject = [
                    '$scope'
                ];
                return InfoFormatter;
            }());
            exports_1("default",angular.module('DroneSense.Web.InfoFormatter', []).component('dsInfoFormatter', {
                bindings: {
                    user: '<',
                    label: '@',
                    value: '<',
                    format: '@',
                    canEdit: '@',
                    onEdit: '&'
                },
                controller: InfoFormatter,
                templateUrl: './app/components/formatters/infoFormatter.html'
            }));
        }
    }
});

//# sourceMappingURL=infoFormatter.js.map
