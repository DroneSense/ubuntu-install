System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var BatteryStatusIndicator;
    return {
        setters:[],
        execute: function() {
            BatteryStatusIndicator = (function () {
                function BatteryStatusIndicator(bindings) {
                    this.bindings = bindings;
                    // Green - #00C121
                    // Yellow - #dcd300
                    // Red - #ea0707
                    // Default - #abafb9
                    // If the battery percentage is between 0-25 then we will show
                    // one bar and everything will be red.
                    this.batteryPercentage = 0;
                    this.timeRemaining = 0;
                }
                Object.defineProperty(BatteryStatusIndicator.prototype, "timeRemainingString", {
                    get: function () {
                        var foo = new Date(this.timeRemaining);
                        var hours = foo.getUTCHours().toString();
                        var minutes = this.formatToDigits(foo.getUTCMinutes());
                        var seconds = this.formatToDigits(foo.getUTCSeconds());
                        return hours !== '0' ? hours + ':' + minutes + ':' + seconds : minutes + ':' + seconds;
                    },
                    enumerable: true,
                    configurable: true
                });
                BatteryStatusIndicator.prototype.formatToDigits = function (n) {
                    return n < 10 ? '0' + n.toString() : n.toString();
                };
                // Constructor
                BatteryStatusIndicator.$inject = [
                    '$scope'
                ];
                return BatteryStatusIndicator;
            }());
            exports_1("default",angular.module('DroneSense.Web.BatteryStatusIndicator', []).component('dsBatteryStatusIndicator', {
                bindings: {
                    batteryPercentage: '<',
                    timeRemaining: '<'
                },
                controller: BatteryStatusIndicator,
                templateUrl: './app/components/batteryStatusIndicator/batteryStatusIndicator.html'
            }));
        }
    }
});

//# sourceMappingURL=batteryStatusIndicator.js.map
