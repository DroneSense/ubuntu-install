System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var UnitFormatter;
    return {
        setters:[],
        execute: function() {
            UnitFormatter = (function () {
                function UnitFormatter(bindings) {
                    var _this = this;
                    this.bindings = bindings;
                    this.bindings.$watch(function () {
                        return _this.user.UnitPreference;
                    }, function (newValue, oldValue) {
                        if (_this.user.isMetric()) {
                            if (_this.format === 'elevation') {
                                _this.unit = 'meters';
                            }
                            else if (_this.format === 'speed') {
                                _this.unit = 'm/s';
                            }
                        }
                        else {
                            if (_this.format === 'elevation') {
                                _this.unit = 'feet';
                            }
                            else if (_this.format === 'speed') {
                                _this.unit = 'ft/s';
                            }
                        }
                    });
                }
                UnitFormatter.$inject = [
                    '$scope'
                ];
                return UnitFormatter;
            }());
            exports_1("default",angular.module('DroneSense.Web.UnitString', []).component('dsUnitString', {
                bindings: {
                    user: '<',
                    format: '@'
                },
                controller: UnitFormatter,
                template: ' <div class="input-unit">{{ $ctrl.unit }}</div>'
            }));
        }
    }
});

//# sourceMappingURL=unitString.js.map
