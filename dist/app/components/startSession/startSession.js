System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var StartSession;
    return {
        setters:[],
        execute: function() {
            StartSession = (function () {
                function StartSession(bindings, mdDialog) {
                    this.bindings = bindings;
                    this.mdDialog = mdDialog;
                    // url of the new session
                    this.name = 'Blue Team';
                    // Flag to indicate if name has been changed by user
                    this.nameChanged = false;
                    // Flag to indicate if service is tryin to connect
                    this.creating = false;
                    // Flag to show on error
                    this.showError = false;
                    // Session no name error
                    this.sessionNoNameError = false;
                    // Session no drone error
                    this.sessionNoDroneError = false;
                    // Session name already exists error
                    this.sessionNameExistsError = false;
                    // Session color already exists error
                    this.sessionColorExistsError = false;
                    // Text to show on connect button while connecting
                    this.connectButtonText = 'Start';
                    // List to hold returned drones
                    this.drones = [];
                    // Flag whether guests can connect without need a prompt for explicit permission
                    this.guestCanConnect = true;
                    // Flag to start recording on takeoff automatically
                    this.autoRecordOnTakeoff = true;
                    this.teamColors = ['#0A92EA', '#ea0707', '#00c121', '#dcd300', '#673ab7'];
                    this.teamNames = ['Blue Team', 'Red Team', 'Green Team', 'Yellow Team', 'Purple Team'];
                    this.selectedColor = this.teamColors[0];
                }
                // Load available drones on init.
                StartSession.prototype.$onInit = function () {
                    var _this = this;
                    // exit if connection is already in progress
                    if (this.creating) {
                        return;
                    }
                    // Change button text to show user that we are connecting
                    this.connectButtonText = 'Getting drones...';
                    // turn error off if shown
                    this.showError = false;
                    // Turn on progress bar
                    this.creating = true;
                    // Get existing sessions so we can check for name and color conflicts.
                    this.serverConnection.droneService.SessionManager.getSessions().then(function (sessions) {
                        // Set sessions
                        _this.existingSessions = sessions;
                        // Remove used colors from option array
                        if (_this.existingSessions.length > 0) {
                            _this.existingSessions.forEach(function (value) {
                                var index = _this.teamColors.indexOf(value.color);
                                _this.teamColors.splice(index, 1);
                                _this.teamNames.splice(index, 1);
                            });
                            _this.selectedColor = _this.teamColors[0];
                            _this.name = _this.teamNames[0];
                        }
                        // Get drones available for connection
                        _this.serverConnection.droneService.DroneManager.getDrones().then(function (droneMetaData) {
                            // Check if we have drones returne if not show error.
                            if (droneMetaData.length > 0) {
                                // bind to userinterface for selection;
                                _this.drones = droneMetaData;
                                _this.bindings.$applyAsync();
                                // Turn off the progress indicator
                                _this.creating = false;
                                // Change button text back to normal
                                _this.connectButtonText = 'Start';
                            }
                            else {
                                // Turn off the progress indicator
                                _this.creating = false;
                                // show error message
                                _this.showError = true;
                                // Change button text back to normal
                                _this.connectButtonText = 'Retry';
                                // force UI update
                                _this.bindings.$applyAsync();
                            }
                        }).catch(function (error) {
                            // connect error
                            // Turn off the progress indicator
                            _this.creating = false;
                            // show error message
                            _this.showError = true;
                            // Change button text back to normal
                            _this.connectButtonText = 'Start';
                            // force UI update
                            _this.bindings.$applyAsync();
                            console.log(error);
                        });
                    }).catch(function (error) {
                        console.log(error);
                    });
                };
                // helper to clear drone selection and set new one
                StartSession.prototype.clearDroneSelection = function (selected) {
                    if (selected.checkoutState.isCheckedOut) {
                        selected.isSelected = false;
                        return;
                    }
                    this.drones.forEach(function (drone) {
                        drone.isSelected = false;
                    });
                    this.selectedDrone = selected;
                };
                StartSession.prototype.onStart = function (session) { };
                StartSession.prototype.createSession = function () {
                    var _this = this;
                    // check that drone has been selected and we have a valid name
                    if (!this.selectedDrone) {
                        this.sessionNoDroneError = true;
                        return;
                    }
                    else {
                        this.sessionNoDroneError = false;
                    }
                    if (this.name === '') {
                        // message to tell user they need a session name
                        this.sessionNoNameError = true;
                        return;
                    }
                    else {
                        this.sessionNoNameError = false;
                    }
                    // check if session name is already in use
                    var nameMatch = false;
                    var colorMatch = false;
                    // check for existing color and name
                    this.existingSessions.forEach(function (session) {
                        if (_this.name.toLowerCase() === session.name.toLocaleLowerCase()) {
                            nameMatch = true;
                        }
                        if (_this.selectedColor === session.color) {
                            colorMatch = true;
                        }
                    });
                    // show existing name match error
                    if (nameMatch) {
                        this.sessionNameExistsError = true;
                        return;
                    }
                    else {
                        this.sessionNameExistsError = false;
                    }
                    // show existing color match error
                    if (colorMatch) {
                        this.sessionColorExistsError = true;
                        return;
                    }
                    else {
                        this.sessionColorExistsError = false;
                    }
                    // exit if connection is already in progress
                    if (this.creating) {
                        return;
                    }
                    // Check if the user is attempting a retry and reset state
                    if (this.connectButtonText === 'Retry') {
                        this.connectButtonText = '';
                        this.$onInit();
                        return;
                    }
                    // Change button text to show user that we are connecting
                    this.connectButtonText = 'Starting session...';
                    // turn error off if shown
                    this.showError = false;
                    // Turn on progress bar
                    this.creating = true;
                    // Try to create session
                    this.serverConnection.droneService.SessionManager.createSession(this.name, this.selectedColor, [this.selectedDrone]).then(function (session) {
                        session.getDrones().then(function (drones) {
                            // This return the drones requested for the session so for now we can assume it will
                            // always be the first drone in the array.
                            if (drones.length > 0) {
                                drones[0].connect().then(function () {
                                    console.log('drone connected');
                                    // // set current drone
                                    // this.currentDrone = drones[0];
                                    _this.onStart({ session: session, allowAllGuests: _this.guestCanConnect, startRecording: _this.autoRecordOnTakeoff });
                                }).catch(function (error) {
                                    // error connection to selected drone
                                    // Turn off the progress indicator
                                    _this.creating = false;
                                    // show error message
                                    _this.showError = true;
                                    // Change button text back to normal
                                    _this.connectButtonText = 'Start';
                                    // force UI update
                                    _this.bindings.$applyAsync();
                                    console.log(error);
                                });
                            }
                            else {
                                // no drones were returned to connect to
                                console.log('no drones were returned to connect to');
                            }
                        }).catch(function (error) {
                            // error getting drones
                            console.log(error);
                        });
                    }).catch(function (error) {
                        // error creating session
                        console.log(error);
                    });
                };
                StartSession.prototype.setTeamName = function (colorIndex) {
                    if (!this.nameChanged) {
                        this.name = this.teamNames[colorIndex];
                    }
                };
                // Constructor
                StartSession.$inject = [
                    '$scope',
                    '$mdDialog'
                ];
                return StartSession;
            }());
            exports_1("default",angular.module('DroneSense.Web.StartSession', []).component('dsStartSession', {
                bindings: {
                    onStart: '&',
                    onCancel: '&',
                    serverConnection: '<'
                },
                controller: StartSession,
                templateUrl: './app/components/startSession/startSession.html'
            }));
        }
    }
});

//# sourceMappingURL=startSession.js.map
