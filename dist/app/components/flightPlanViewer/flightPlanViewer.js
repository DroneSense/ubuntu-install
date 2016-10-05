System.register(['@dronesense/model', '../appbar/appBar', '../toolbar/toolbar', '../commandViewer/commandViewer', '../mapTools/mapTools', '../mapControls/mapControls', '../flightInfoViewer/flightInfoViewer', '../../services/uiStateService', '../../services/userService'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var model_1, appBar_1, toolbar_1, commandViewer_1, mapTools_1, mapControls_1, flightInfoViewer_1, uiStateService_1, userService_1;
    var FlightPlanViewer;
    return {
        setters:[
            function (model_1_1) {
                model_1 = model_1_1;
            },
            function (appBar_1_1) {
                appBar_1 = appBar_1_1;
            },
            function (toolbar_1_1) {
                toolbar_1 = toolbar_1_1;
            },
            function (commandViewer_1_1) {
                commandViewer_1 = commandViewer_1_1;
            },
            function (mapTools_1_1) {
                mapTools_1 = mapTools_1_1;
            },
            function (mapControls_1_1) {
                mapControls_1 = mapControls_1_1;
            },
            function (flightInfoViewer_1_1) {
                flightInfoViewer_1 = flightInfoViewer_1_1;
            },
            function (uiStateService_1_1) {
                uiStateService_1 = uiStateService_1_1;
            },
            function (userService_1_1) {
                userService_1 = userService_1_1;
            }],
        execute: function() {
            FlightPlanViewer = (function () {
                function FlightPlanViewer(bindings, $element, stateService, db, uiStateService, ngDialog, $q, dataService) {
                    this.bindings = bindings;
                    this.$element = $element;
                    this.stateService = stateService;
                    this.db = db;
                    this.uiStateService = uiStateService;
                    this.ngDialog = ngDialog;
                    this.$q = $q;
                    this.dataService = dataService;
                    // Get current user
                    this.loadCurrentUser();
                    this.initializeMap();
                    // Load flight plan
                    this.loadFlightPlan();
                }
                // Get current user from user service
                FlightPlanViewer.prototype.loadCurrentUser = function () {
                    //this.user = this.userService.CurrentUser;
                    var _this = this;
                    this.dataService.getUser().then(function (user) {
                        _this.user = user;
                    });
                };
                // Show/Hide user settings
                FlightPlanViewer.prototype.showUserSettings = function (show) {
                    console.log('show user settings' + show);
                    this.uiStateService.UserSettingsVisible = show;
                };
                // Show/Hide drone and camera settings
                FlightPlanViewer.prototype.showDroneCamera = function (show) {
                    this.uiStateService.DroneCameraVisible = show;
                };
                FlightPlanViewer.prototype.loadFlightPlan = function () {
                    var _this = this;
                    // Get flight plan id from url
                    this.flightPlanId = this.stateService.params['id'];
                    // Check url to see if a flight plan id has been passed in for loading
                    if (this.flightPlanId === '' || angular.isUndefined(this.flightPlanId)) {
                        // Create a new flight plan id and load
                        this.db.flightplans.createFlightPlanForUser('foo').then(function (flightplan) {
                            // TODO is there a better way to handle this?  Can we just set in url and recall self?
                            _this.stateService.go('flightplan', { id: flightplan.id });
                        });
                    }
                    else {
                        // Get flight plan handle
                        this.flightPlanHandle = this.db.flightplans.getFlightPlanWithId(this.flightPlanId);
                        // Create new flight plan with id and handle
                        this.flightPlan = new model_1.FlightPlan(this.flightPlanHandle);
                        // Initialize UI state service
                        this.uiStateService.InitializeUIState(this.flightPlanId);
                    }
                };
                FlightPlanViewer.prototype.initializeMap = function () {
                    //'//assets.agi.com/stk-terrain/world'
                    // https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html
                    var _this = this;
                    // By default Cesium uses the location of the Cesium.js file as the location where the rest of the files are stored. You can either set a global CESIUM_BASE_URL variable or just call Cesium.buildModuleUrl.setBaseUrl to point it at a different location.
                    Cesium.BingMapsApi.defaultKey = 'AiGfGytmoPZ6lnYVDiRzKe08ZI_kzjHTjhVrcuj3pPrpC9BmxvFP_vfGT8fB9z-T';
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
                        sceneModePicker: true,
                        selectionIndicator: false,
                        timeline: false,
                        animation: false,
                        geocoder: false,
                        navigationHelpButton: false,
                        infobox: false,
                        scene3DOnly: false
                    });
                    // this.map.scene.primitives.add(new Cesium.Cesium3DTileset({
                    //     url: 'https://www.cesiumcontent.com/api/assets/3/data?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkZjgxNGRiYS0wMjc0LTQ2ZWMtYTJhNC1kMzRhYzkyNDE0YjgiLCJpZCI6NSwiYXNzZXRzIjpbM10sImlhdCI6MTQ1NzQ1ODEwOX0.-kwaVNM63oY4-rqLiZHqSedHRImPCZtkizCU50SuKwA'
                    // }));
                    // this.map.scene.primitives.add(new Cesium.Cesium3DTileset({
                    //     url : '../newyork/'
                    // }));
                    // Decreases map performance but make rendering look better at distances
                    this.map.scene.fog.enabled = true;
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
                    //navigationInitialization('cesiumContainer', this.map);
                    //this.createDrawTools();
                    //this.layers = this.cesiumViewer.imageryLayers;
                    //Grand Island, Nebraska in radians
                    // var startingLocation: any = {
                    //     centerLong: (-98.343286 * Math.PI / 180),
                    //     centerLat: (40.923664 * Math.PI / 180)
                    // };
                    //var dataSource = Cesium.CzmlDataSource.load(this.czml);
                    //this.map.dataSources.add(dataSource);
                    //-97.73870945, 30.2721422
                    this.map.camera.flyTo({
                        //destination: Cesium.Cartesian3.fromDegrees(-100.25752233, 32.454968103, 1500),
                        destination: Cesium.Cartesian3.fromDegrees(-97.73870945, 30.2721422, 1500),
                        duration: 1
                    });
                    //var imageryLayers = this.map.imageryLayers;
                    //
                    //angular.forEach(imageryLayers, (value: any, key: any) => {
                    //    console.log(value);
                    //    console.log(key);
                    //});
                    //this.cesiumViewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
                    //    url : '//mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi?',
                    //    layers : 'nexrad-n0r',
                    //    parameters : {
                    //        transparent : 'true',
                    //        format : 'image/png'
                    //    }
                    //}));
                    //this.cesiumViewer.entities.add({
                    //    position: Cesium.Cartesian3.fromDegrees(startingLocation.centerLong * 180 / Math.PI, startingLocation.centerLat * 180 / Math.PI, 500),
                    //    point: {
                    //        pixelSize: 32
                    //    }
                    //});
                    // this makes sure our parent app gets its cesiumInstance back
                    //this.cesiumDirective.cesiumInstance = new cesiumService(this.cesiumViewer);
                    //-100.25752233, 32.454968103
                    //-100.257630019 32.455315432
                    //console.log($ctrl.cesiumViewer.imageryLayers);
                    //this.addSurfacePolygon('image area', Cesium.Cartesian3.fromDegreesArray([
                    //    -97.73870945, 30.2721422,
                    //    -97.73713231, 30.27620983,
                    //    -97.74134874, 30.27721976,
                    //    -97.74281859, 30.27326337
                    //]), new Cesium.Color(Cesium.Color.byteToFloat(10), Cesium.Color.byteToFloat(146), Cesium.Color.byteToFloat(234), .1));
                    //
                    //this.addSurfacePolyline('foo', Cesium.Cartesian3.fromDegreesArray([
                    //    -97.73870945, 30.2721422,
                    //    -97.73713231, 30.27620983,
                    //    -97.74134874, 30.27721976,
                    //    -97.74281859, 30.27326337,
                    //    -97.73870945, 30.2721422
                    //]), new Cesium.Color(Cesium.Color.byteToFloat(10), Cesium.Color.byteToFloat(146), Cesium.Color.byteToFloat(234), 1));
                    //this.getTerrainHeight(-100.257640661, 32.455307523);
                    //this.addRectangularSensor();
                    //this.addPoint(-97.73888916, 30.27218853, 167);
                    var handler = new Cesium.ScreenSpaceEventHandler(this.map.canvas, false);
                    handler.setInputAction(function (click) {
                        var ray = _this.map.camera.getPickRay(click.position);
                        var position = _this.map.scene.globe.pick(ray, _this.map.scene);
                        console.log(position);
                        if (Cesium.defined(position)) {
                            // Make the height of the position = 0 so it works with groundPrimitive
                            var positionCartographic = _this.map.scene.globe.ellipsoid.cartesianToCartographic(position);
                            positionCartographic.height = 0;
                            position = _this.map.scene.globe.ellipsoid.cartographicToCartesian(positionCartographic);
                            var cartographic = Cesium.Cartographic.fromCartesian(position);
                            //    var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(9);
                            //    var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(9);
                            _this.map.camera.flyTo({
                                //destination: Cesium.Cartesian3.fromDegrees(-100.25752233, 32.454968103, 1500),
                                destination: Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)),
                                duration: 1
                            });
                        }
                    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
                    //var entity = this.map.entities.add({
                    //    label : {
                    //        show : false
                    //    }
                    //});
                    //// Mouse over the globe to see the cartographic position
                    //var handler2 = new Cesium.ScreenSpaceEventHandler(this.cesiumViewer.scene.canvas);
                    //handler2.setInputAction((movement) => {
                    //    var cartesian = this.cesiumViewer.camera.pickEllipsoid(movement.endPosition, this.cesiumViewer.scene.globe.ellipsoid);
                    //    console.log(cartesian);
                    //    if (cartesian) {
                    //        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    //        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(9);
                    //        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(9);
                    //
                    //        entity.position = cartesian;
                    //        entity.label.show = true;
                    //        entity.label.text = '(' + longitudeString + ', ' + latitudeString + ')';
                    //    } else {
                    //        entity.label.show = false;
                    //    }
                    //}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    //         var handler2: Cesium.ScreenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(this.map.scene.canvas);
                    //         handler2.setInputAction((movement) => {
                    //             //Set bounds of our simulation time
                    //             var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
                    //             var stop = Cesium.JulianDate.addSeconds(start, 855, new Cesium.JulianDate());
                    // //Make sure viewer is at the desired time.
                    //             this.map.clock.startTime = start.clone();
                    //             this.map.clock.stopTime = stop.clone();
                    //             this.map.clock.currentTime = start.clone();
                    //             this.map.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
                    //             this.map.clock.multiplier = 10;
                    //             var property = new Cesium.SampledPositionProperty();
                    //             var initialHeight = 730;
                    //             for (var i = 0; i <= 855; i += 15) {
                    //                 initialHeight += 2;
                    //                 var radians = Cesium.Math.toRadians(i);
                    //                 var time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
                    //                 var position = Cesium.Cartesian3.fromDegrees(-100.257642589 + (.0001 * Math.cos(radians)), 32.455307234 + (.0001 * Math.sin(radians)), initialHeight);
                    //                 property.addSample(time, position);
                    //                 //Also create a point for each sample we generate.
                    //                 this.map.entities.add({
                    //                     position : position,
                    //                     point : {
                    //                         pixelSize : 6,
                    //                         color : Cesium.Color.TRANSPARENT,
                    //                         outlineColor : Cesium.Color.fromBytes(242, 101, 34, 255),
                    //                         outlineWidth : 3
                    //                     }
                    //                 });
                    //             }
                    //             this.map.entities.add({
                    //                 //Set the entity availability to the same interval as the simulation time.
                    //                 availability : new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                    //                     start : start,
                    //                     stop : stop
                    //                 })]),
                    //                 //Use our computed positions
                    //                 position : property,
                    //                 //Automatically compute orientation based on position movement.
                    //                 //orientation : new Cesium.VelocityOrientationProperty(position),
                    //                 //Load the Cesium plane model to represent the entity
                    //                 model : {
                    //                     uri : '/components/cesiumMap/models/inspire.glb',
                    //                     scale: .3
                    //                     //minimumPixelSize : 64
                    //                 },
                    //                 //Show the path as a pink line sampled in 1 second increments.
                    //                 path : {
                    //                     resolution : 1,
                    //                     material : new Cesium.PolylineGlowMaterialProperty({
                    //                         glowPower : 0.1,
                    //                         color : Cesium.Color.fromBytes(242, 101, 34, 255)
                    //                     }),
                    //                     width : 10
                    //                 }
                    //             });
                    //         }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
                    //var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
                    //var stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate());
                    //
                    ////Compute the entity position property.
                    //var position = computeCirclularFlight(-112.110693, 36.0994841, 0.03);
                };
                FlightPlanViewer.prototype.getTerrainHeight = function (longitude, latitude) {
                    var deferred = this.$q.defer();
                    // Query the terrain height of two Cartographic positions
                    var terrainProvider = new Cesium.CesiumTerrainProvider({
                        url: '//assets.agi.com/stk-terrain/world'
                    });
                    var positions = [
                        Cesium.Cartographic.fromDegrees(longitude, latitude)
                    ];
                    Cesium.sampleTerrain(terrainProvider, 11, positions).then(function (updatedPositions) {
                        deferred.resolve(updatedPositions[0].height);
                    });
                    return deferred.promise;
                };
                // Save flight plan
                FlightPlanViewer.prototype.saveFlightPlan = function (name) {
                    // Check if flight plan has a name and save
                    if (name === '') {
                        this.flightPlan.SaveProperty('Untitled Flight Plan', 'Name');
                    }
                    else {
                        this.flightPlan.SaveProperty(name, 'Name');
                    }
                    // Set flag in flight plan that it has been saved, this keeps unsaved flight plans from being shown on dashboard
                    this.flightPlan.SaveProperty(true, 'Saved');
                    // TODO - take snapshot for dashboard
                };
                // Check for saved flight plan and go to dashboar
                FlightPlanViewer.prototype.exitFlightPlan = function () {
                    if (this.flightPlan.Saved) {
                        this.stateService.go('dashboard');
                    }
                    else {
                    }
                };
                // Handle command added from map tools component
                FlightPlanViewer.prototype.addCommand = function (command) {
                    // Need to apply high level duplication rules here
                    // For example, you can't have two takeoff commands
                    this.db.commands.createCommandForFlightPlanWithId(this.flightPlanId, command.Type.toUpperCase(), command).then(function (data) {
                        console.log(data);
                    });
                };
                // Handle clear flight plan callback from toolbar
                FlightPlanViewer.prototype.clearFlightPlan = function () {
                    var _this = this;
                    // open confirm model
                    var model = this.ngDialog.open({
                        template: './app/components/flightPlanViewer/clearFPModal.html',
                        className: 'ngdialog-theme-ds',
                        showClose: false
                    });
                    model.closePromise.then(function (data) {
                        // delete flight plan
                        if (data.value === true) {
                            _this.db.commands.deleteCommandsFromFlightPlanWithId(_this.flightPlanId);
                        }
                    });
                };
                FlightPlanViewer.prototype.mapFlyTo = function (lat, lng) {
                    var _this = this;
                    this.getTerrainHeight(lng, lat).then(function (alt) {
                        _this.map.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(lng, lat, alt + 500.0)
                        });
                    });
                    //this.map.camera.setView({
                    //    destination : Cesium.Cartesian3.fromDegrees(lng, lat, 500.0)
                    //});
                };
                FlightPlanViewer.prototype.saveCamera = function (camera) {
                    //this.flightPlan.SaveProperty(camera, 'Camera');
                    this.flightPlan.SaveProperty({
                        Type: camera.Type,
                        Name: camera.Name,
                        Id: camera.Id,
                        SensorWidth: camera.SensorWidth,
                        SensorHeight: camera.SensorHeight,
                        FocalLength: camera.FocalLength,
                        HorizontalResolution: camera.HorizontalResolution,
                        VerticalResolution: camera.VerticalResolution
                    }, 'Camera');
                };
                FlightPlanViewer.prototype.showSettings = function () {
                    if (this.buildings && this.map.scene.primitives.contains(this.buildings)) {
                        this.map.scene.primitives.remove(this.buildings);
                    }
                    else {
                        this.buildings = this.map.scene.primitives.add(new Cesium.Cesium3DTileset({
                            url: 'https://www.cesiumcontent.com/api/assets/3/data/tileset.json?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkZjgxNGRiYS0wMjc0LTQ2ZWMtYTJhNC1kMzRhYzkyNDE0YjgiLCJpZCI6NSwiYXNzZXRzIjpbM10sImlhdCI6MTQ1NzQ1ODEwOX0.-kwaVNM63oY4-rqLiZHqSedHRImPCZtkizCU50SuKwA'
                        }));
                        var greenCylinder = this.map.entities.add({
                            name: 'KAUS Airspace',
                            position: Cesium.Cartesian3.fromDegrees(-97.6663058, 30.1974292, 150.0),
                            cylinder: {
                                length: 1280.0,
                                topRadius: 9260.0,
                                bottomRadius: 9260.0,
                                material: Cesium.Color.MAGENTA.withAlpha(0.3),
                                outline: true,
                                outlineColor: Cesium.Color.WHITE
                            }
                        });
                    }
                };
                FlightPlanViewer.prototype.saveDrone = function (drone) {
                    console.log(drone.Name);
                    //this.flightPlan.SaveProperty(drone, 'Drone');
                    this.flightPlan.SaveProperty({
                        Type: drone.Type,
                        Name: drone.Name,
                        Id: drone.Id,
                        Endurance: drone.Endurance,
                        BatterySize: drone.BatterySize,
                        BatteryType: drone.BatteryType,
                        FrameType: drone.FrameType,
                        AutopilotType: drone.AutopilotType
                    }, 'Drone');
                };
                // Constructor
                FlightPlanViewer.$inject = [
                    '$scope',
                    '$element',
                    '$state',
                    'db',
                    'uiStateService',
                    'ngDialog',
                    '$q',
                    'dataService'
                ];
                return FlightPlanViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.FlightPlanViewer', [
                uiStateService_1.default.name,
                userService_1.default.name,
                appBar_1.default.name,
                toolbar_1.default.name,
                commandViewer_1.default.name,
                mapTools_1.default.name,
                mapControls_1.default.name,
                flightInfoViewer_1.default.name,
                'ngDialog'
            ]).component('dsFlightPlanViewer', {
                bindings: {},
                controller: FlightPlanViewer,
                templateUrl: './app/components/flightPlanViewer/flightPlanViewer.html'
            }).filter('secondsToDateTime', [function () {
                    return function (seconds) {
                        return new Date(1970, 0, 1).setSeconds(seconds);
                    };
                }]));
        }
    }
});

//# sourceMappingURL=flightPlanViewer.js.map
