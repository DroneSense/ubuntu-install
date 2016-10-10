System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ServerConnection;
    return {
        setters:[],
        execute: function() {
            ServerConnection = (function () {
                function ServerConnection(ip, port, droneService) {
                    var _this = this;
                    this.ip = ip;
                    this.port = port;
                    this.droneService = droneService;
                    // wire up the connection events
                    this.droneService.on('connected', function () {
                        _this.isConnected = true;
                    });
                    // wire up disconnected event
                    this.droneService.on('disconnected', function () {
                        _this.disconnect().then(function () {
                            _this.isConnected = false;
                            _this.eventing.trigger('server-disconnected', _this);
                        });
                    });
                    this.droneService.on('connect-error', function (error) {
                        _this.lastConnectionError = error;
                    });
                }
                Object.defineProperty(ServerConnection.prototype, "name", {
                    // Server name if it has one
                    //name: string;
                    get: function () {
                        // TODO: uncomment once name has been added to the drone service
                        // if (this.droneService.Name) {
                        //     return this.droneService.Name;
                        // } else {
                        return 'http://' + this.ip + ':' + this.port;
                        //}
                    },
                    enumerable: true,
                    configurable: true
                });
                // disconnect call
                ServerConnection.prototype.disconnect = function () {
                    var _this = this;
                    return this.droneService.disconnect().then(function () {
                        _this.droneService.off('connected');
                        _this.droneService.off('disconnected');
                        _this.droneService.off('connect-error');
                    });
                };
                return ServerConnection;
            }());
            exports_1("default", ServerConnection);
        }
    }
});

//# sourceMappingURL=serverConnection.js.map
