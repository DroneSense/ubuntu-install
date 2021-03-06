System.register(['../controlToolbar/controlToolbar', '../controlTelemetry/controlTelemetry', '../controlConnect/controlConnect', '../startSession/startSession', '../joinSession/joinSession', './sessionController', '../flightControlMode/flightControlMode', './mapMode', 'backbone-events-standalone', '../sessionManagementViewer/sessionManagementViewer', '../waypointListViewer/waypointListViewer', '../mapLayers/mapLayers', './flightControlSettings', '../videoPlayer/videoPlayer', '../multiVideoPlayer/multiVideoPlayer'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var controlToolbar_1, controlTelemetry_1, controlConnect_1, startSession_1, joinSession_1, sessionController_1, flightControlMode_1, mapMode_1, backbone_events_standalone_1, sessionManagementViewer_1, waypointListViewer_1, mapLayers_1, flightControlSettings_1, videoPlayer_1, multiVideoPlayer_1;
    var FlightControlViewerEventing, FlightControlViewer;
    return {
        setters:[
            function (controlToolbar_1_1) {
                controlToolbar_1 = controlToolbar_1_1;
            },
            function (controlTelemetry_1_1) {
                controlTelemetry_1 = controlTelemetry_1_1;
            },
            function (controlConnect_1_1) {
                controlConnect_1 = controlConnect_1_1;
            },
            function (startSession_1_1) {
                startSession_1 = startSession_1_1;
            },
            function (joinSession_1_1) {
                joinSession_1 = joinSession_1_1;
            },
            function (sessionController_1_1) {
                sessionController_1 = sessionController_1_1;
            },
            function (flightControlMode_1_1) {
                flightControlMode_1 = flightControlMode_1_1;
            },
            function (mapMode_1_1) {
                mapMode_1 = mapMode_1_1;
            },
            function (backbone_events_standalone_1_1) {
                backbone_events_standalone_1 = backbone_events_standalone_1_1;
            },
            function (sessionManagementViewer_1_1) {
                sessionManagementViewer_1 = sessionManagementViewer_1_1;
            },
            function (waypointListViewer_1_1) {
                waypointListViewer_1 = waypointListViewer_1_1;
            },
            function (mapLayers_1_1) {
                mapLayers_1 = mapLayers_1_1;
            },
            function (flightControlSettings_1_1) {
                flightControlSettings_1 = flightControlSettings_1_1;
            },
            function (videoPlayer_1_1) {
                videoPlayer_1 = videoPlayer_1_1;
            },
            function (multiVideoPlayer_1_1) {
                multiVideoPlayer_1 = multiVideoPlayer_1_1;
            }],
        execute: function() {
            FlightControlViewerEventing = (function () {
                function FlightControlViewerEventing() {
                }
                return FlightControlViewerEventing;
            }());
            exports_1("FlightControlViewerEventing", FlightControlViewerEventing);
            backbone_events_standalone_1.default.mixin(FlightControlViewerEventing.prototype);
            FlightControlViewer = (function () {
                function FlightControlViewer(bindings, stateService, mdDialog, $log) {
                    this.bindings = bindings;
                    this.stateService = stateService;
                    this.mdDialog = mdDialog;
                    this.$log = $log;
                    // List of server that are currently connected
                    this.connectedServers = [];
                    // Flag to indicate if a guest user request has been made and 
                    // show the dialog
                    this.guestUserRequest = false;
                    // Dialog to show while drone is being locating
                    this.locatingDroneDialog = false;
                    // Flag to hide connect buttons
                    this.hideButtons = false;
                    this.hasLoadedMap = false;
                    this.hideBackground = false;
                    this.lockCamera = true;
                    this.firstSessionLoaded = false;
                    this.serverDisconnect = false;
                    this.waypointError = false;
                    this.waypointErrorName = '';
                    this.showMap = true;
                    this.isRecording = false;
                    this.cameraInit = false;
                    this.recordIndicatorVisible = false;
                    this.takePictureComplete = true;
                }
                FlightControlViewer.prototype.$onInit = function () {
                    var _this = this;
                    // Create new for now, eventually load from profile
                    this.flightControlSettings = new flightControlSettings_1.FlightControlSettings();
                    this.eventing = new FlightControlViewerEventing();
                    this.sessionController = new sessionController_1.SessionController(this.eventing, this.$log);
                    this.eventing.on('locating-drone', function () {
                        _this.locatingDroneDialog = true;
                        _this.bindings.$applyAsync();
                    });
                    this.eventing.on('drone-located', function () {
                        _this.locatingDroneDialog = false;
                        _this.firstSessionLoaded = true;
                        _this.initCamera();
                        _this.bindings.$applyAsync();
                    });
                    this.eventing.on('guest-connect-request', function (username, cb) {
                        // Set call so we can call from dialog return
                        _this.guestRequestCallback = cb;
                        // Set username
                        _this.guestUserRequestName = username;
                        // Show dialog
                        _this.guestUserRequest = true;
                        // Update user interface
                        _this.bindings.$applyAsync();
                        _this.$log.log({ message: 'Guest connect request from ' + username });
                    });
                    this.eventing.on('server-disconnected', function (serverConnection) {
                        if (_this.sessionController.ownerSession) {
                            _this.serverDisconnect = true;
                            // Update user interface
                            _this.bindings.$applyAsync();
                        }
                        // Add to active connections if does not already exist.
                        if (_this.connectedServers.filter(function (connection) {
                            if (connection.ip === serverConnection.ip && connection.port === serverConnection.port) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }).length === 1) {
                            _this.connectedServers.splice(_this.connectedServers.indexOf(serverConnection), 1);
                        }
                        ;
                        _this.$log.log({ message: 'Server Disconnected' });
                    });
                    // Only wire up to event if ownerSession
                    if (this.sessionController.ownerSession) {
                        this.eventing.on('waypoint-error', function (name) {
                            _this.waypointError = true;
                            _this.waypointErrorName = name;
                            _this.$log.error({ message: 'Waypoint Error', name: name });
                        });
                    }
                };
                // Start new flight button clicked on main screen
                FlightControlViewer.prototype.startNewFlight = function () {
                    // Get local server connection settings
                    this.getServerSettings(true);
                    this.$log.log({ message: 'Start New Flight' });
                };
                // Join existing flight button clicked on main screen
                FlightControlViewer.prototype.joinExistingFlight = function (serverConnection) {
                    // Get local server connection settings
                    this.getServerSettings(false);
                    this.$log.log({ message: 'Join Existing Flight' });
                };
                // Launch the control connect dialog to get the connection
                FlightControlViewer.prototype.getServerSettings = function (newFlight) {
                    // set flag if this is a new session request or a join
                    this.newFlightSession = newFlight;
                    // Launch dialog
                    this.mdDialog.show({
                        template: '<ds-control-connect new-flight-session="$ctrl.newFlightSession" connected-servers="$ctrl.connectedServers" on-connect="$ctrl.controllerConnected(serverConnection, useExisting);" on-cancel="$ctrl.cancelDialog()"></ds-control-connect>',
                        scope: this.bindings,
                        preserveScope: true,
                        parent: angular.element(document.body),
                        clickOutsideToClose: false,
                        escapeToClose: true
                    });
                };
                // Connection has been made and passed back
                FlightControlViewer.prototype.controllerConnected = function (serverConnection, useExisting) {
                    // Close connection dialog
                    this.mdDialog.hide();
                    // Check if user is using an existing connection or a new one
                    // if (!useExisting) {
                    //     this.connectedServers.push(serverConnection);
                    // }
                    // Add to active connections if does not already exist.
                    if (this.connectedServers.filter(function (connection) {
                        if (connection.ip === serverConnection.ip && connection.port === serverConnection.port) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }).length === 0) {
                        serverConnection.eventing = this.eventing;
                        this.connectedServers.push(serverConnection);
                    }
                    ;
                    // check if this is a new flight or join exisitng session
                    if (this.newFlightSession) {
                        this.getNewSession(serverConnection);
                    }
                    else {
                        this.joinExistingSession(serverConnection);
                    }
                };
                // Launch start new flight dialog and get the session object back
                FlightControlViewer.prototype.getNewSession = function (serverConnection) {
                    // Necessary for component consumption
                    this.currentServerConnection = serverConnection;
                    this.mdDialog.show({
                        template: '<ds-start-session server-connection="$ctrl.currentServerConnection" on-start="$ctrl.ownerSessionCreated(session, allowAllGuests, startRecording);" on-cancel="$ctrl.cancelDialog()"></ds-control-connect>',
                        scope: this.bindings,
                        preserveScope: true,
                        parent: angular.element(document.body),
                        clickOutsideToClose: false,
                        escapeToClose: true
                    });
                };
                // Launch start new flight dialog and get the session object back
                FlightControlViewer.prototype.joinExistingSession = function (serverConnection) {
                    // Necessary for component consumption
                    this.currentServerConnection = serverConnection;
                    this.mdDialog.show({
                        template: '<ds-join-session server-connection="$ctrl.currentServerConnection" session-controller="$ctrl.sessionController" on-join="$ctrl.guestSessionJoined(session);" on-cancel="$ctrl.cancelDialog()"></ds-control-connect>',
                        scope: this.bindings,
                        preserveScope: true,
                        parent: angular.element(document.body),
                        clickOutsideToClose: false,
                        escapeToClose: true
                    });
                };
                // Add to list of guest sessions
                FlightControlViewer.prototype.guestSessionJoined = function (session) {
                    // Close dialog
                    this.mdDialog.hide();
                    // Hide bg image
                    this.hideBackground = true;
                    // Remove buttons after session returns
                    this.hideButtons = true;
                    // Pass to session controller as guest
                    this.sessionController.addGuestSession(session, this.currentServerConnection, mapMode_1.MapMode.ThreeDimensional);
                };
                // Call back from start new flight dialog that returns a session
                FlightControlViewer.prototype.ownerSessionCreated = function (session, allowAllGuests, startRecording) {
                    // Close dialog
                    this.mdDialog.hide();
                    // Hide background image
                    this.hideBackground = true;
                    // Remove buttons after session returns
                    this.hideButtons = true;
                    this.sessionController.addOwnerSession(session, this.currentServerConnection, mapMode_1.MapMode.ThreeDimensional, allowAllGuests, startRecording);
                };
                // Return true if user accepts
                FlightControlViewer.prototype.acceptGuestRequest = function () {
                    this.guestRequestCallback(true);
                    // Hide dialog
                    this.guestUserRequest = false;
                    this.$log.log({ message: 'Accepted guest join request.' });
                };
                // Return false if user rejects
                FlightControlViewer.prototype.denyGuestRequest = function () {
                    this.guestRequestCallback(false);
                    // Hide dialog
                    this.guestUserRequest = false;
                    this.$log.log({ message: 'Denied guest join request.' });
                };
                // Close dialog
                FlightControlViewer.prototype.cancelDialog = function () {
                    this.mdDialog.hide();
                };
                FlightControlViewer.prototype.toggleLockCamera = function () {
                    var _this = this;
                    if (this.lockCamera) {
                        this.sessionController.map.trackedEntity = this.sessionController.activeSession.mapDrone.droneEntity;
                        setTimeout(function () {
                            //this.loadCameraView();
                            _this.sessionController.map.camera.zoomOut(40);
                        }, 250);
                    }
                    else {
                        //this.saveCameraView();
                        this.sessionController.map.trackedEntity = null;
                    }
                };
                FlightControlViewer.prototype.saveCameraView = function () {
                    this.position = Cesium.Cartesian3.clone(this.sessionController.map.camera.positionWC, this.position);
                    this.heading = this.sessionController.map.camera.heading;
                    this.pitch = this.sessionController.map.camera.pitch;
                    this.roll = this.sessionController.map.camera.roll;
                    this.transform = Cesium.Matrix4.clone(this.sessionController.map.camera.transform, this.transform);
                };
                FlightControlViewer.prototype.loadCameraView = function () {
                    var newPosition = Cesium.Cartesian3.fromDegrees(this.sessionController.activeSession.mapDrone.currentLng, this.sessionController.activeSession.mapDrone.currentLat, this.sessionController.activeSession.mapDrone.currentAlt);
                    newPosition.z = this.position.z;
                    this.sessionController.map.camera.setView({
                        destination: newPosition,
                        orientation: {
                            heading: this.heading,
                            pitch: this.pitch,
                            roll: this.roll
                        }
                    });
                };
                FlightControlViewer.prototype.zoomIn = function () {
                    this.sessionController.map.cesiumNavigation.navigationViewModel.controls[0].activate();
                };
                FlightControlViewer.prototype.zoomOut = function () {
                    this.sessionController.map.cesiumNavigation.navigationViewModel.controls[2].activate();
                };
                FlightControlViewer.prototype.lookDownBoundingBox = function () {
                    this.sessionController.map.flyTo(this.sessionController.activeSession.mapEntityCollection);
                    this.lockCamera = false;
                };
                FlightControlViewer.prototype.toggleRecording = function () {
                    var _this = this;
                    this.recordIndicatorVisible = true;
                    if (!this.cameraInit) {
                        this.initCamera();
                    }
                    if (this.isRecording) {
                        this.sessionController.ownerSession.mapDrone.drone.Camera.stopRecording().then(function () {
                            _this.$log.log({ message: 'Stop Recording Requested' });
                        }).catch(function (error) {
                            _this.$log.error({ message: 'Error: stop recording call.', error: error });
                        });
                    }
                    else {
                        this.sessionController.ownerSession.mapDrone.drone.Camera.startRecording().then(function () {
                            _this.$log.log({ message: 'Start Recording Requested' });
                        }).catch(function (error) {
                            _this.$log.error({ message: 'Error: start recording call.', error: error });
                        });
                    }
                };
                FlightControlViewer.prototype.initCamera = function () {
                    var _this = this;
                    if (this.sessionController.ownerSession) {
                        this.isRecording = this.sessionController.ownerSession.mapDrone.drone.Camera.IsRecording;
                        this.sessionController.ownerSession.mapDrone.drone.Camera.on('recording-started', function () {
                            _this.isRecording = true;
                            _this.recordIndicatorVisible = false;
                            _this.$log.log({ message: 'Recording Started' });
                        });
                        this.sessionController.ownerSession.mapDrone.drone.Camera.on('recording-stopped', function () {
                            _this.isRecording = false;
                            _this.recordIndicatorVisible = false;
                            _this.$log.log({ message: 'Recording Stopped' });
                        });
                        this.sessionController.ownerSession.mapDrone.drone.Camera.on('take-picture-finished', function () {
                            _this.takePictureComplete = true;
                            _this.$log.log({ message: 'Take picture finished' });
                        });
                        this.cameraInit = true;
                    }
                };
                FlightControlViewer.prototype.takePicture = function () {
                    var _this = this;
                    if (!this.cameraInit) {
                        this.initCamera();
                    }
                    this.takePictureComplete = false;
                    this.sessionController.ownerSession.mapDrone.drone.Camera.takePicture().then(function () {
                        _this.$log.log({ message: 'Take picture Requested' });
                    }).catch(function (error) {
                        _this.$log.error({ message: 'Error: take picture request.', error: error });
                    });
                };
                // Trigger a picture download from the last image taken.
                FlightControlViewer.prototype.downloadPicture = function () {
                };
                // Constructor
                FlightControlViewer.$inject = [
                    '$scope',
                    '$state',
                    '$mdDialog',
                    '$log'
                ];
                return FlightControlViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.FlightControlViewer', [
                controlToolbar_1.default.name,
                controlConnect_1.default.name,
                joinSession_1.default.name,
                startSession_1.default.name,
                controlTelemetry_1.default.name,
                flightControlMode_1.default.name,
                sessionManagementViewer_1.default.name,
                waypointListViewer_1.default.name,
                mapLayers_1.default.name,
                videoPlayer_1.default.name,
                multiVideoPlayer_1.default.name
            ]).component('dsFlightControlViewer', {
                bindings: {},
                controller: FlightControlViewer,
                templateUrl: './app/components/flightControlViewer/flightControlViewer.html'
            }));
        }
    }
});

//# sourceMappingURL=flightControlViewer.js.map
