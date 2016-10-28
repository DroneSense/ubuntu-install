System.register(['backbone-events-standalone', './mapMode', './mapSession', './ownerMapSession'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var backbone_events_standalone_1, mapMode_1, mapSession_1, ownerMapSession_1;
    var SessionController;
    return {
        setters:[
            function (backbone_events_standalone_1_1) {
                backbone_events_standalone_1 = backbone_events_standalone_1_1;
            },
            function (mapMode_1_1) {
                mapMode_1 = mapMode_1_1;
            },
            function (mapSession_1_1) {
                mapSession_1 = mapSession_1_1;
            },
            function (ownerMapSession_1_1) {
                ownerMapSession_1 = ownerMapSession_1_1;
            }],
        execute: function() {
            SessionController = (function () {
                function SessionController(eventing, $log) {
                    this.$log = $log;
                    // Guest sessions Array
                    this.guestSession = [];
                    this.eventing = eventing;
                }
                SessionController.prototype.addOwnerSession = function (session, serverConnection, mapMode, allowAllGuestsWithoutPrompt, startRecording) {
                    var _this = this;
                    try {
                        this.initializeMap(mapMode);
                        this.ownerSession = new ownerMapSession_1.OwnerMapSession(this.$log);
                        this.map.dataSources.add(this.ownerSession.mapEntityCollection);
                        // TODO: make static call
                        this.ownerSession.initializeOwnerSession(this.eventing, session, serverConnection, this.map, mapMode, allowAllGuestsWithoutPrompt, startRecording).then(function (ownerSession) {
                            // Set returned owner session
                            _this.ownerSession = ownerSession;
                            // Set as tracked entity
                            _this.map.trackedEntity = ownerSession.mapDrone.droneEntity;
                            // Fly to
                            ownerSession.mapDrone.flyToDroneOn3DMap();
                            _this.activeSession = ownerSession;
                            // Start video stream if drone is connected and this is an owner session
                            _this.eventing.trigger('session-added', _this.ownerSession);
                            _this.$log.log({ message: 'Owner session initialized.' });
                        });
                    }
                    catch (error) {
                        this.$log.error({ message: 'Error adding owner session.', error: error });
                    }
                };
                SessionController.prototype.addGuestSession = function (session, serverConnection, mapMode) {
                    var _this = this;
                    try {
                        // check if map is loaded
                        this.initializeMap(mapMode);
                        var mapSessionInstance = new mapSession_1.MapSession(this.$log);
                        this.map.dataSources.add(mapSessionInstance.mapEntityCollection);
                        // TODO: Make static call on mapsession
                        mapSessionInstance.initializeSession(this.eventing, session, serverConnection, this.map, mapMode).then(function (mapSession) {
                            _this.guestSession.push(mapSession);
                            // If we don't have an owner session then fly to the drone
                            if (!_this.ownerSession) {
                                // Set as the tracked entity
                                _this.map.trackedEntity = mapSession.mapDrone.droneEntity;
                                // Only do fly to animation if it's the first guest session
                                if (_this.guestSession.length === 0) {
                                    mapSession.mapDrone.flyToDroneOn3DMap();
                                }
                                _this.activeSession = mapSession;
                                _this.eventing.trigger('session-added', mapSession);
                                setTimeout(function () {
                                    _this.map.camera.zoomOut(40);
                                }, 250);
                            }
                            // Start video stream if drone is connected and this is an owner session
                            _this.$log.log({ message: 'Guest session initialized.' });
                        });
                    }
                    catch (error) {
                        this.$log.error({ message: 'Error adding guest session.', error: error });
                    }
                };
                SessionController.prototype.changeActiveSession = function (session) {
                    var _this = this;
                    try {
                        if (this.activeSession === session) {
                            return;
                        }
                        this.activeSession = session;
                        this.map.trackedEntity = session.mapDrone.droneEntity;
                        // Start video stream if drone is connected and this is an owner session
                        this.eventing.trigger('session-changed', session);
                        this.$log.log({ message: 'Change active session.' });
                        setTimeout(function () {
                            _this.map.camera.zoomOut(40);
                        }, 250);
                    }
                    catch (error) {
                        this.$log.error({ message: 'Error changing active session.', error: error });
                    }
                };
                SessionController.prototype.removeGuestSession = function (session) {
                    try {
                        // There are two paths for removing guests
                        if (this.ownerSession) {
                        }
                        else {
                            this.activeSession = null;
                            this.map.trackedEntity = null;
                            this.eventing.trigger('session-removed', session);
                            this.$log.log({ message: 'Remove guest session.' });
                        }
                        // suspend this collections events
                        session.mapEntityCollection.entities.suspendEvents();
                        // remove and destroy
                        this.map.dataSources.remove(session.mapEntityCollection, true);
                        // resumt map events
                        session.mapEntityCollection.entities.resumeEvents();
                        session.session.leaveSession();
                        this.guestSession.splice(this.guestSession.indexOf(session), 1);
                    }
                    catch (error) {
                        this.$log.error({ message: 'Error removing guest session.', error: error });
                    }
                };
                ;
                // Creates map object with selected mode
                SessionController.prototype.initializeMap = function (mapMode) {
                    //'//assets.agi.com/stk-terrain/world'
                    // https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html
                    try {
                        // Only initialize map if it doesn't exist.
                        if (this.map) {
                            return;
                        }
                        // By default Cesium uses the location of the Cesium.js file as the location where the rest of the files are stored. You can either set a global CESIUM_BASE_URL variable or just call Cesium.buildModuleUrl.setBaseUrl to point it at a different location.
                        Cesium.BingMapsApi.defaultKey = 'AiGfGytmoPZ6lnYVDiRzKe08ZI_kzjHTjhVrcuj3pPrpC9BmxvFP_vfGT8fB9z-T';
                        var sceneMode = mapMode === mapMode_1.MapMode.ThreeDimensional ? Cesium.SceneMode.SCENE3D : Cesium.SceneMode.SCENE2D;
                        this.map = new Cesium.Viewer(document.getElementById('cesiumContainer'), {
                            terrainProvider: new Cesium.CesiumTerrainProvider({
                                url: 'https://www.cesiumcontent.com/api/terrain/world?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkMTM4ZDE2OS05NWYwLTQ0YmItOWY3YS0yNjEwOGE5Y2Y3NjYiLCJpZCI6NywiaWF0IjoxNDU1MjkyNzg5fQ.NDKlrwQZE_04ntDuL89hvatEmuycQo5llhtz3Mi6Wo0',
                                requestWaterMask: false,
                                requestVertexNormals: false
                            }),
                            // imageryProvider : new Cesium.ArcGisMapServerImageryProvider({
                            //     url : "//services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
                            // }),
                            // terrainProvider : new Cesium.CesiumTerrainProvider({
                            //     url : '//assets.agi.com/stk-terrain/world',
                            //     requestWaterMask : true,
                            //     requestVertexNormals : true
                            // }),
                            // imageryProvider: new Cesium.MapboxImageryProvider({
                            //     mapId: 'digitalglobe.nmnghj3m',
                            //     // sat with streets: digitalglobe.nmnghj3m
                            //     // sat only: digitalglobe.nmmnloo2
                            //     //Get your DigitalGlobe Maps API Access Token here: http://developer.digitalglobe.com/maps-api
                            //     accessToken: 'pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNpZnB2bWUzNDZoczlzaWtxMmd2bDc3ZHQifQ.AHiF6mR5aXL0rdI4eLz2dA',
                            //     credit: 'DigitalGlobe Maps API'
                            // }),
                            // imageryProvider: new Cesium.MapboxImageryProvider({
                            //     mapId: 'chriseyhorn.3sjrlik9',
                            //     // sat with streets: digitalglobe.nmnghj3m
                            //     // sat only: digitalglobe.nmmnloo2
                            //     //Get your DigitalGlobe Maps API Access Token here: http://developer.digitalglobe.com/maps-api
                            //     accessToken: 'pk.eyJ1IjoiY2hyaXNleWhvcm4iLCJhIjoiaDFPdEM2ZyJ9.m41bT4PKxsjLH3MgC-pGCw'
                            // }),
                            baseLayerPicker: false,
                            fullscreenButton: false,
                            homeButton: false,
                            sceneModePicker: false,
                            selectionIndicator: false,
                            timeline: false,
                            animation: false,
                            geocoder: false,
                            navigationHelpButton: false,
                            infobox: false,
                            scene3DOnly: false,
                            sceneMode: sceneMode //,
                        });
                        var options = {};
                        options.enableCompass = false;
                        options.enableZoomControls = true;
                        options.enableDistanceLegend = false;
                        this.map.extend(Cesium.viewerCesiumNavigationMixin, options);
                        // this.map.scene.primitives.add(new Cesium.Cesium3DTileset({
                        //     url: 'https://www.cesiumcontent.com/api/assets/3/data?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkZjgxNGRiYS0wMjc0LTQ2ZWMtYTJhNC1kMzRhYzkyNDE0YjgiLCJpZCI6NSwiYXNzZXRzIjpbM10sImlhdCI6MTQ1NzQ1ODEwOX0.-kwaVNM63oY4-rqLiZHqSedHRImPCZtkizCU50SuKwA'
                        // }));
                        // this.map.scene.primitives.add(new Cesium.Cesium3DTileset({
                        //     url : '../newyork/'
                        // }));
                        // Decreases map performance but make rendering look better at distances
                        //this.map.scene.fog.enabled = true;
                        // This sets night/day in the scene
                        //this.map.scene.globe.enableLighting = true;
                        // For debug development purposes
                        this.map.scene.debugShowFramesPerSecond = false;
                        // Necessary for 3D models to stay in place
                        this.map.scene.globe.depthTestAgainstTerrain = true;
                        // Change mapping to mouse buttons so that the right mouse button will tilt and rotate.
                        this.map.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.RIGHT_DRAG, Cesium.CameraEventType.PINCH, {
                                eventType: Cesium.CameraEventType.LEFT_DRAG,
                                modifier: Cesium.KeyboardEventModifier.CTRL
                            }, {
                                eventType: Cesium.CameraEventType.RIGHT_DRAG,
                                modifier: Cesium.KeyboardEventModifier.CTRL
                            }];
                        // Remove right mouse button from zooming on hold and move
                        this.map.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
                        // this.map.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
                        //        url : '//mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi?',
                        //        layers : 'nexrad-n0r',
                        //        parameters : {
                        //            transparent : 'true',
                        //            format : 'image/png'
                        //        }
                        // }));
                        this.eventing.trigger('map-loaded');
                        this.$log.log({ message: 'Map loaded.' });
                    }
                    catch (error) {
                        this.$log.error({ message: 'Error initializing map.', error: error });
                    }
                };
                SessionController.prototype.endSession = function () {
                    this.ownerSession.session.endSession();
                    this.$log.log({ message: 'End session.' });
                };
                return SessionController;
            }());
            exports_1("SessionController", SessionController);
            backbone_events_standalone_1.default.mixin(SessionController.prototype);
        }
    }
});

//# sourceMappingURL=sessionController.js.map
