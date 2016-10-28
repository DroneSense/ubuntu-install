System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var JoinSession;
    return {
        setters:[],
        execute: function() {
            JoinSession = (function () {
                function JoinSession(bindings, $log) {
                    this.bindings = bindings;
                    this.$log = $log;
                    // Flag to indicate if service is tryin to connect
                    this.joining = false;
                    // Flag to show on error
                    this.sessionFindError = false;
                    // Text to show on connect button while connecting
                    this.joinButtonText = 'Join';
                    // Sessions available to join
                    this.sessions = [];
                    // Flag to hide sessions while initiating session join operation
                    this.hideSessions = false;
                    // Flag to hide message about initiating session join operation
                    this.showWaitingForConnectMessage = false;
                    // Flag to hide message about session join time out.
                    this.sessionJoinTimedOutMessage = false;
                    // Flag to hide/show message that request has been denied
                    this.sessionJoinDeniedMessage = false;
                }
                // Load available drones on init.
                JoinSession.prototype.$onInit = function () {
                    var _this = this;
                    // exit if connection is already in progress
                    if (this.joining) {
                        return;
                    }
                    // Change button text to show user that we are connecting
                    this.joinButtonText = 'Loading sessions...';
                    // turn error off if shown
                    this.sessionFindError = false;
                    // Turn on progress bar
                    this.joining = true;
                    // Get sessions available for connection
                    this.serverConnection.droneService.SessionManager.getSessions().then(function (sessionMetaData) {
                        // Check if we have drones returne if not show error.
                        if (sessionMetaData.length > 0) {
                            // bind to userinterface for selection;
                            _this.sessions = sessionMetaData.filter(function (value, index) {
                                for (var i = 0; i < _this.sessionController.guestSession.length; i++) {
                                    if (_this.sessionController.guestSession[i].id === value.id) {
                                        return false;
                                    }
                                }
                                return true;
                            }).filter(function (value, index) {
                                if (_this.sessionController.ownerSession) {
                                    if (value.id === _this.sessionController.ownerSession.id) {
                                        return false;
                                    }
                                    else {
                                        return true;
                                    }
                                }
                                else {
                                    return true;
                                }
                            });
                            // Check if there are any session left to display
                            if (_this.sessions.length === 0) {
                                // show error message
                                _this.sessionFindError = true;
                                // Change button text back to normal
                                _this.joinButtonText = 'Retry';
                            }
                            else {
                                // Change button text back to normal
                                _this.joinButtonText = 'Join';
                            }
                            // Turn off the progress indicator
                            _this.joining = false;
                            // force UI update
                            _this.bindings.$applyAsync();
                        }
                        else {
                            // Turn off the progress indicator
                            _this.joining = false;
                            // show error message
                            _this.sessionFindError = true;
                            // Change button text back to normal
                            _this.joinButtonText = 'Retry';
                            // force UI update
                            _this.bindings.$applyAsync();
                            _this.$log.log({ message: 'No sessions available to join.' });
                        }
                    }).catch(function (error) {
                        // connect error
                        // Turn off the progress indicator
                        _this.joining = false;
                        // show error message
                        _this.sessionFindError = true;
                        // Change button text back to normal
                        _this.joinButtonText = 'Join';
                        // force UI update
                        _this.bindings.$applyAsync();
                        _this.$log.log({ message: 'Error getting sessions available for connection.', error: error });
                    });
                };
                // helper to clear session selection and set new one
                JoinSession.prototype.clearSessionSelection = function (selected) {
                    this.sessions.forEach(function (session) {
                        session.isSelected = false;
                    });
                    this.selectedSession = selected;
                };
                JoinSession.prototype.onJoin = function (session) { };
                JoinSession.prototype.joinSession = function () {
                    var _this = this;
                    // check that drone has been selected and we have a valid name
                    if (!this.selectedSession) {
                        // need to select a session message
                        return;
                    }
                    // exit if connection is already in progress
                    if (this.joining) {
                        return;
                    }
                    // Check if the user is attempting a retry and reset state
                    if (this.joinButtonText === 'Retry') {
                        this.joinButtonText = '';
                        this.$onInit();
                        return;
                    }
                    // Change button text to show user that we are connecting
                    this.joinButtonText = 'Joining session...';
                    // turn error off if shown
                    this.sessionFindError = false;
                    // turn off previous join timeout if on
                    this.sessionJoinTimedOutMessage = false;
                    // Turn on progress bar
                    this.joining = true;
                    // Hide sessions
                    this.hideSessions = true;
                    // Show message that we are joing
                    this.showWaitingForConnectMessage = true;
                    this.$log.log({ message: 'Joining session.', session: this.selectedSession });
                    // Try to create session
                    this.serverConnection.droneService.SessionManager.joinSession(this.selectedSession, 10000).then(function (session) {
                        // Return joined session
                        _this.onJoin({ session: session });
                    }).catch(function (error) {
                        _this.joining = false;
                        _this.showWaitingForConnectMessage = false;
                        if (error.parentError.code === 500) {
                            _this.sessionJoinTimedOutMessage = true;
                        }
                        else {
                            _this.sessionJoinDeniedMessage = true;
                        }
                        _this.hideSessions = false;
                        _this.joinButtonText = 'Join';
                        _this.bindings.$applyAsync();
                        // error creating session
                        _this.$log.log({ message: 'Error joining session.', error: error });
                    });
                };
                // Constructor
                JoinSession.$inject = [
                    '$scope',
                    '$log'
                ];
                return JoinSession;
            }());
            exports_1("default",angular.module('DroneSense.Web.JoinSession', []).component('dsJoinSession', {
                bindings: {
                    onJoin: '&',
                    onCancel: '&',
                    serverConnection: '<',
                    sessionController: '<'
                },
                controller: JoinSession,
                templateUrl: './app/components/joinSession/joinSession.html'
            }));
        }
    }
});

//# sourceMappingURL=joinSession.js.map
