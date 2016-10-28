System.register(['./mapDrone', './mapWaypoints', './mapSession'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var mapDrone_1, mapWaypoints_1, mapSession_1;
    var OwnerMapSession;
    return {
        setters:[
            function (mapDrone_1_1) {
                mapDrone_1 = mapDrone_1_1;
            },
            function (mapWaypoints_1_1) {
                mapWaypoints_1 = mapWaypoints_1_1;
            },
            function (mapSession_1_1) {
                mapSession_1 = mapSession_1_1;
            }],
        execute: function() {
            // Represents
            OwnerMapSession = (function (_super) {
                __extends(OwnerMapSession, _super);
                function OwnerMapSession($log) {
                    _super.call(this, $log);
                    this.$log = $log;
                    // Flag to indicate whether the user created the session allowing all guests without
                    // prompting for permission
                    this.allowAllGuestsWithoutPrompt = false;
                    // List of guests that are connected
                    this.connectedGuests = [];
                }
                OwnerMapSession.prototype.initializeOwnerSession = function (eventing, session, serverConnection, map, mapMode, allowAllGuestsWithoutPrompt, startRecording) {
                    var _this = this;
                    return new Promise(function (resolve) {
                        _this.map = map;
                        _this.session = session;
                        _this.serverConnection = serverConnection;
                        _this.mapMode = mapMode;
                        _this.name = _this.session.Name;
                        _this.eventing = eventing;
                        _this.allowAllGuestsWithoutPrompt = allowAllGuestsWithoutPrompt;
                        _this.color = _this.session.Color;
                        _this.id = _this.session.Id;
                        _this.startRecording = startRecording;
                        // WARNING BAD CODE (Robert made me do this!) - drone index 0 is hardcoded here
                        _this.session.getDrones().then(function (drones) {
                            _this.mapDrone = new mapDrone_1.MapDrone(_this.mapEntityCollection, _this.$log);
                            _this.mapDrone.initializeDrone(_this.eventing, drones[0], _this.map, _this.color, true).then(function (mapDrone) {
                                _this.mapDrone = mapDrone;
                                _this.setupEvents();
                                // Initialize waypoints for guided mode
                                _this.mapWaypoints = new mapWaypoints_1.MapWaypoints(_this.mapDrone, _this.map, _this.color, _this.id, _this.mapEntityCollection, _this.eventing, _this.$log);
                                resolve(_this);
                            });
                        });
                    });
                };
                OwnerMapSession.prototype.setupEvents = function () {
                    var _this = this;
                    this.session.on('slave-connected', function (username) {
                        // Add username
                        _this.connectedGuests.push(username);
                        _this.$log.log({ message: 'Slave Connected.', username: username });
                    });
                    this.session.on('slave-disconnected', function (username) {
                        try {
                            // Remove username
                            _.remove(_this.connectedGuests, function (name) {
                                return username.toLowerCase() === name.toLowerCase() ? true : false;
                            });
                        }
                        catch (error) {
                            _this.$log.error({ message: 'Slave Disconnected Error.', error: error });
                        }
                        _this.$log.log({ message: 'Slave Disconnected.', username: username });
                    });
                    // Wire up slave connection request
                    this.session.on('slave-requesting-connection', function (username, cb) {
                        // check allow all guests flag and return true and exit
                        if (_this.allowAllGuestsWithoutPrompt) {
                            cb(true);
                            return;
                        }
                        _this.eventing.trigger('guest-connect-request', username, cb);
                        _this.$log.log({ message: 'Guest Connect Request', username: username });
                    });
                };
                OwnerMapSession.prototype.remove = function () {
                    // First call remove on the drone
                    this.mapDrone.remove();
                    this.session.off('slave-connected');
                    this.session.off('slave-disconnected');
                    this.session.off('slave-requesting-connection');
                };
                return OwnerMapSession;
            }(mapSession_1.MapSession));
            exports_1("OwnerMapSession", OwnerMapSession);
        }
    }
});

//# sourceMappingURL=ownerMapSession.js.map
