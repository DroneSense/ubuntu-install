System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var FlightControlSettings;
    return {
        setters:[],
        execute: function() {
            FlightControlSettings = (function () {
                function FlightControlSettings() {
                    this.localVideoServerIP = '192.168.0.115';
                    this.localVideoServerPort = 8554;
                    this.remoteVideoServerEnabled = false;
                    this.remoteVideoServerIP = '104.154.235.145';
                    this.remoteVideoServerPort = 8554;
                }
                return FlightControlSettings;
            }());
            exports_1("FlightControlSettings", FlightControlSettings);
        }
    }
});

//# sourceMappingURL=flightControlSettings.js.map
