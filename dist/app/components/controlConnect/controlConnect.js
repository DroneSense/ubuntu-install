System.register(['@dronesense/client/lib/index', '../../components/flightControlViewer/serverConnection'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var index_1, serverConnection_1;
    var ControlConnect;
    return {
        setters:[
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (serverConnection_1_1) {
                serverConnection_1 = serverConnection_1_1;
            }],
        execute: function() {
            ControlConnect = (function () {
                function ControlConnect(bindings, mdDialog, $log) {
                    this.bindings = bindings;
                    this.mdDialog = mdDialog;
                    this.$log = $log;
                    // Ip address of server passed in from bindings
                    this.ip = '192.168.0.115';
                    // port address of server passed in from bindings
                    this.port = 3005;
                    // url of remote server
                    this.url = 'https://afd.dronesense.com';
                    // Flag to indicate if service is trying to connect
                    this.connecting = false;
                    // Flag to show connection error
                    this.showConnectionError = false;
                    // Flag to show same server connection error text
                    this.showSameServerConnectionError = false;
                    // Text to show on connect button while connecting
                    this.connectButtonText = 'Connect';
                }
                // On connect component callback
                ControlConnect.prototype.onConnect = function (dservice) { };
                ControlConnect.prototype.$onInit = function () {
                    // // Remove disconnected servers
                    // this.connectedServers.forEach((server: ServerConnection) => {
                    //     if (server.disconnect) {
                    //     }
                    // });
                };
                ControlConnect.prototype.connect = function () {
                    var _this = this;
                    // exit if connection is already in progress
                    if (this.connecting) {
                        return;
                    }
                    // check if the new connection already matches a connected server and return an error
                    var detection = false;
                    this.connectedServers.forEach(function (serverConnection) {
                        if (_this.ip === serverConnection.ip && _this.port === serverConnection.port) {
                            detection = true;
                        }
                    });
                    // Check if we found a duplicate
                    if (detection) {
                        this.showSameServerConnectionError = true;
                        return;
                    }
                    else {
                        this.showSameServerConnectionError = false;
                    }
                    // Change button text to show user that we are connecting
                    this.connectButtonText = 'Connecting...';
                    // turn error off if shown
                    this.showConnectionError = false;
                    // Turn on progress bar
                    this.connecting = true;
                    // Create the client with the ip and port address
                    var droneService = index_1.default.createClient('http://' + this.ip + ':' + this.port);
                    this.$log.log('Attempting connection to ' + 'http://' + this.ip + ':' + this.port);
                    // TODO - Pass in user from data service
                    droneService.connect('christopher').then(function () {
                        _this.$log.log('Connection sucessful to ' + 'http://' + _this.ip + ':' + _this.port);
                        _this.$log.log('Is new flight session:' + _this.newFlightSession);
                        // success
                        // 1) make call to check server health to ensure all services are running
                        // this.droneService.checkServerHealth(() => {
                        var newServerConnection = new serverConnection_1.default(_this.ip, _this.port, droneService);
                        // we have a sucessful connection so lets return the drone service
                        _this.onConnect({ serverConnection: newServerConnection, useExisting: _this.newFlightSession });
                        //}).catch((error: any)=> {
                        // prompt user to reboot The box
                        //});
                    }).catch(function (error) {
                        // Turn off the progress indicator
                        _this.connecting = false;
                        // show error message
                        _this.showConnectionError = true;
                        // Change button text back to normal
                        _this.connectButtonText = 'Connect';
                        // force UI update
                        _this.bindings.$applyAsync();
                        _this.$log.error({ message: 'Error during connection to ' + 'http://' + _this.ip + ':' + _this.port, error: error });
                    });
                };
                // Callback to flight control
                ControlConnect.prototype.setSelectedServer = function (server) {
                    this.onConnect({ serverConnection: server, useExisting: true });
                };
                // Constructor
                ControlConnect.$inject = [
                    '$scope',
                    '$mdDialog',
                    '$log'
                ];
                return ControlConnect;
            }());
            exports_1("default",angular.module('DroneSense.Web.ControlConnect', []).component('dsControlConnect', {
                bindings: {
                    onConnect: '&',
                    onCancel: '&',
                    connectedServers: '<',
                    newFlightSession: '<'
                },
                controller: ControlConnect,
                templateUrl: './app/components/controlConnect/controlConnect.html'
            }));
        }
    }
});

//# sourceMappingURL=controlConnect.js.map
