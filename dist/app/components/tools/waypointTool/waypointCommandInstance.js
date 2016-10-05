System.register(['@dronesense/model/lib/common/Utility', '../../../components/commandHeader/commandHeader', '../../../components/formatters/infoFormatter', '../../../common/readableElevation', '../../../components/formatters/unitString', '../../../services/mapService'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Utility_1, commandHeader_1, infoFormatter_1, readableElevation_1, unitString_1, mapService_1;
    var WaypointCommandInstance;
    return {
        setters:[
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            },
            function (commandHeader_1_1) {
                commandHeader_1 = commandHeader_1_1;
            },
            function (infoFormatter_1_1) {
                infoFormatter_1 = infoFormatter_1_1;
            },
            function (readableElevation_1_1) {
                readableElevation_1 = readableElevation_1_1;
            },
            function (unitString_1_1) {
                unitString_1 = unitString_1_1;
            },
            function (mapService_1_1) {
                mapService_1 = mapService_1_1;
            }],
        execute: function() {
            WaypointCommandInstance = (function () {
                function WaypointCommandInstance(bindings, db, mapService) {
                    var _this = this;
                    this.bindings = bindings;
                    this.db = db;
                    this.mapService = mapService;
                    // Flag to indicate if command is being edited in map
                    this.isEditing = false;
                    this.trackedFlag = false;
                    this.SetupEditingHandlers();
                    // Create copy for UI binding
                    this.SetupViewData();
                    // Add UI to map
                    this.generateMapUI();
                    // Listen for model changes
                    this.command.on('propertyChanged', function (name, value) {
                        _this.bindings.$applyAsync();
                    });
                    this.bindings.$on('$destroy', function () {
                        // watchers are automatically destroyed
                        // destruction code here
                        _this.user.off();
                        _this.command.off();
                        // Clean up editing handler
                        _this.editingHandler.destroy();
                    });
                    // Update camera track changes
                    this.bindings.$watch(function () { return _this.trackedEntity; }, function (newValue, oldValue) {
                        _this.trackedFlag = (_this.entity.id === newValue);
                    });
                    //this.isAGLAltitudeMode = !this.settings.PlanningAltitudeMSL;
                }
                // Handle on blur property change
                WaypointCommandInstance.prototype.UpdateAltitude = function (positionChanged) {
                    var _this = this;
                    var groundElevationMSL;
                    var groundElevationHAE;
                    // If position changed we need to query the elevation service
                    if (positionChanged) {
                        // Make call to get elevation
                        this.mapService.getElevation(this.position.lat, this.position.lng).then(function (terrainElevation) {
                            groundElevationMSL = terrainElevation;
                            groundElevationHAE = terrainElevation;
                            _this.UpdateDBAltitudes(groundElevationMSL, groundElevationHAE);
                        });
                    }
                    else {
                        groundElevationMSL = this.command.GroundElevationMSL;
                        groundElevationHAE = this.command.GroundElevationHAE;
                        this.UpdateDBAltitudes(groundElevationMSL, groundElevationHAE);
                    }
                };
                WaypointCommandInstance.prototype.UpdateDBAltitudes = function (groundElevationMSL, groundElevationHAE) {
                    // If we are in AGL mode then altitudeMSL must be calculated
                    if (this.isAGLAltitudeMode) {
                        this.command.UpdateProperties({
                            Altitude: this.altitude,
                            GroundElevationMSL: groundElevationMSL,
                            GroundElevationHAE: groundElevationHAE,
                            AltitudeMSL: groundElevationMSL + this.altitude,
                            AltitudeHAE: groundElevationHAE + this.altitude
                        });
                    }
                    else {
                        this.command.UpdateProperties({
                            Altitude: this.altitudeMSL - this.command.GroundElevationMSL,
                            GroundElevationMSL: groundElevationMSL,
                            GroundElevationHAE: groundElevationHAE,
                            AltitudeMSL: this.altitudeMSL,
                            AltitudeHAE: this.altitudeMSL
                        });
                    }
                };
                WaypointCommandInstance.prototype.UpdatePosition = function () {
                    // Save property on model
                    this.command.SaveProperty(this.position, 'Position');
                    // Update new position altitude
                    this.UpdateAltitude(true);
                };
                // Remove self from map then call viewer for removal
                WaypointCommandInstance.prototype.Delete = function () {
                    // Remove UI from map
                    this.map.entities.remove(this.entity);
                    // Call parent delete function
                    this.onDelete({ commandId: this.command.handle.id });
                };
                // Fly camera to this command
                WaypointCommandInstance.prototype.FlyTo = function () {
                    this.map.flyTo(this.entity);
                };
                // Toggle visibility on map
                WaypointCommandInstance.prototype.HideShow = function () {
                    this.entity.show = !this.entity.show;
                };
                // Bind two way fields that are also update
                WaypointCommandInstance.prototype.SetupViewData = function () {
                    var _this = this;
                    this.flightSpeed = this.command.FlightSpeed;
                    this.bindings.$watch(function () { return _this.command.FlightSpeed; }, function (newValue, oldValue) {
                        _this.flightSpeed = _this.command.FlightSpeed;
                    });
                    this.position = this.command.Position;
                    this.bindings.$watch(function () { return _this.command.Position; }, function (newValue, oldValue) {
                        _this.position = _this.command.Position;
                    });
                    this.altitude = this.command.Altitude;
                    this.bindings.$watch(function () { return _this.command.Altitude; }, function (newValue, oldValue) {
                        _this.altitude = _this.command.Altitude;
                    });
                    this.altitudeMSL = this.command.AltitudeMSL;
                    this.bindings.$watch(function () { return _this.command.AltitudeMSL; }, function (newValue, oldValue) {
                        _this.altitudeMSL = _this.command.AltitudeMSL;
                    });
                };
                WaypointCommandInstance.prototype.SetupEditingHandlers = function () {
                    this.editingHandler = new Cesium.ScreenSpaceEventHandler(this.map.canvas);
                };
                WaypointCommandInstance.prototype.getWaypointSVG = function (index) {
                    return '';
                };
                WaypointCommandInstance.prototype.generateMapUI = function () {
                    var _this = this;
                    // create the svg image string
                    var svgDataDeclare = 'data:image/svg+xml,';
                    //var svgCircle: string = '<path style="fill:#ffffff" d="M12,23.9L0.1,12L12,0.1L23.9,12L12,23.9z M4.4,12l7.6,7.6l7.6-7.6L12,4.4L4.4,12z"/>';
                    var svgCircle = "<defs>\n                <rect id=\"path-1\" x=\"6\" y=\"6\" width=\"25\" height=\"25\"></rect>\n            </defs>\n            <g id=\"Flight-Plan\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n                <g id=\"Rectangle-474\" transform=\"translate(18.500000, 18.500000) rotate(-315.000000) translate(-18.500000, -18.500000) \">\n                <use stroke=\"#FFFFFF\" stroke-width=\"2\" fill-opacity=\"0.5\" fill=\"#0A92EA\" fill-rule=\"evenodd\" xlink:href=\"#path-1\"></use>\n                </g>\n                <text id=\"2\" font-family=\"OpenSans-Extrabold, Open Sans\" font-size=\"15\" font-weight=\"600\" fill=\"#FFFFFF\">\n                <tspan text-anchor=\"middle\" x=\"18.5\" y=\"24\">" + this.command.Order + "</tspan>\n                </text>\n            </g>";
                    var svgPrefix = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 43 43" xml:space="preserve">';
                    var svgSuffix = '</svg>';
                    var svgString = svgPrefix + svgCircle + svgSuffix;
                    var newWaypoint = "<svg width=\"35\" height=\"35\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:svg=\"http://www.w3.org/2000/svg\">\n                <g>\n                    <title>Layer 1</title>\n                    <g id=\"diamond\">\n                        <rect id=\"svg_1\" height=\"25\" width=\"25\" fill-opacity=\"0.5\" fill=\"#0A92EA\" transform=\"matrix(0.7071,-0.7071,0.7071,0.7071,-8.4939,20.5061) \" y=\"4.006014\" x=\"8.006292\"/>\n                        <rect id=\"svg_2\" height=\"25\" width=\"25\" stroke-miterlimit=\"10\" stroke-width=\"2\" stroke=\"#FFFFFF\" fill=\"none\" transform=\"matrix(0.7071,-0.7071,0.7071,0.7071,-8.4939,20.5061) \" y=\"4.006012\" x=\"8.006292\"/>\n                    </g>\n                    <g stroke=\"null\" id=\"number\">\n                        <text stroke-width=\"0\" stroke=\"null\" font-weight=\"normal\" font-style=\"normal\" x=\"50%\" y=\"50%\" id=\"svg_3\" font-size=\"15px\" font-family=\"&#x27;OpenSans-Semibold'\" fill=\"#FFFFFF\" transform=\"matrix(1,0,0,0.9583181738853455,13.0693,25.413596181405495) \">" + this.command.Order + "</text>\n                    </g>\n                </g>\n            </svg>";
                    // create the cesium entity
                    var svgEntityImage = svgDataDeclare + svgString;
                    //  var entity = viewer.entities.add({
                    //      position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883, 10),
                    //      billboard: {
                    //          image: svgEntityImage
                    //      }
                    //  });
                    this.entity = this.map.entities.add({
                        name: this.command.Name,
                        id: this.command.handle.id,
                        polyline: {
                            positions: new Cesium.CallbackProperty(function () {
                                return Cesium.Cartesian3.fromDegreesArrayHeights([_this.position.lng, _this.position.lat, _this.command.GroundElevationHAE,
                                    _this.position.lng, _this.position.lat, _this.altitude + _this.command.GroundElevationHAE]);
                            }, false),
                            width: 2,
                            material: Cesium.Color.fromBytes(255, 255, 255, 255)
                        },
                        position: new Cesium.CallbackProperty(function () {
                            return Cesium.Cartesian3.fromDegrees(_this.position.lng, _this.position.lat, _this.altitude + _this.command.GroundElevationHAE);
                        }, false),
                        billboard: {
                            image: svgEntityImage,
                            sizeInMeters: false,
                            width: 43,
                            height: 43,
                            pixelOffset: new Cesium.Cartesian2(3, 7),
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        }
                    });
                    // Add bottom triangle to waypoint line
                    //  TODO - Track this entity so it can be removed later
                    this.map.entities.add({
                        position: new Cesium.CallbackProperty(function () {
                            return Cesium.Cartesian3.fromDegrees(_this.position.lng, _this.position.lat, _this.command.GroundElevationHAE);
                        }, false),
                        billboard: {
                            image: svgEntityImage,
                            sizeInMeters: false,
                            width: 5,
                            height: 5,
                            pixelOffset: new Cesium.Cartesian2(3, 7),
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        }
                    });
                    // Wire up handler to listen for left click
                    this.editingHandler.setInputAction(function (click) {
                        // Check to see what the mouse has selected
                        var pickedObject = _this.map.scene.pick(click.position);
                        // Check to make sure we are only grabbing the entity we are editing
                        if (Cesium.defined(pickedObject) && pickedObject.id === _this.entity) {
                            console.log(pickedObject.id);
                            _this.ShowMenu();
                        }
                    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                };
                WaypointCommandInstance.prototype.ShowMenu = function () {
                    var _this = this;
                    var svgMenuString = "<svg version=\"1.1\" id=\"contextMenu\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\"\n                    y=\"0px\" viewBox=\"0 0 110.8 93.7\" enable-background=\"new 0 0 110.8 93.7\" xml:space=\"preserve\">\n                <style>\n                    .foo:hover {\n                        fill: #eee;\n                    }\n                </style>\n                <g id=\"map\" transform=\"translate(385.000000, 90.000000)\">\n                    <g id=\"waypoints\" transform=\"translate(7.000000, 59.000000)\">\n                        <g id=\"waypoint\" transform=\"translate(165.000000, 363.000000)\">\n                            <g id=\"context-menu\">\n                                <g id=\"Page-1\" opacity=\"0.9\">\n                                    <path class=\"foo\" id=\"Fill-1\" fill=\"#FFFFFF\" d=\"M-501.7-480c6,0,11.5,2.3,15.7,6l22.6-22.6c-9.9-9.5-23.4-15.4-38.3-15.4\n                                        s-28.3,5.9-38.3,15.4l22.6,22.6C-513.2-477.7-507.7-480-501.7-480\"/>\n                                    <path id=\"Fill-3\" fill=\"#FFFFFF\" d=\"M-461.6-494.9l-22.6,22.6c3.7,4.1,6,9.6,6,15.7c0,6-2.3,11.5-6,15.7l22.6,22.6\n                                        c9.5-9.9,15.4-23.4,15.4-38.3C-446.2-471.5-452.1-484.9-461.6-494.9\"/>\n                                    <path id=\"Fill-6\" fill=\"#FFFFFF\" d=\"M-519-472.3l-22.6-22.6c-9.5,9.9-15.4,23.4-15.4,38.3s5.9,28.3,15.4,38.3L-519-441\n                                        c-3.7-4.1-6-9.6-6-15.7S-522.7-468.2-519-472.3z\"/>\n                                </g>\n                            </g>\n                        </g>\n                    </g>\n                </g>\n                <g>\n                    <path fill=\"#0A92EA\" d=\"M16.5,53.4c-0.3,0-0.6,0.1-0.8,0.2c-0.5,0.2-0.9,0.6-1.1,1.1c-0.2,0.5-0.2,1.1,0,1.6\n                        c0.3,0.8,1.1,1.3,1.9,1.3c0.3,0,0.6-0.1,0.8-0.2c0.5-0.2,0.9-0.6,1.1-1.1c0.2-0.5,0.2-1.1,0-1.6C18.1,53.9,17.3,53.4,16.5,53.4z\"/>\n                    <path fill=\"#0A92EA\" d=\"M23.9,57l-1-1c0-0.1,0-0.1,0-0.2c0-0.3,0-0.6,0-1l1-1.1c0.1-0.1,0.1-0.2,0.1-0.3c-0.1-0.4-0.2-0.8-0.4-1.2\n                        c-0.1-0.3-0.3-0.5-0.4-0.8c-0.1-0.1-0.2-0.1-0.3-0.1l-1.4,0c-0.3-0.4-0.6-0.7-1-1l0-1.5c0-0.1-0.1-0.2-0.1-0.3\n                        c-0.6-0.3-1.2-0.6-1.9-0.8c-0.1,0-0.2,0-0.3,0.1l-1,1c-0.1,0-0.1,0-0.2,0c-0.4,0-0.8,0-1.2,0l-1.1-1c-0.1-0.1-0.2-0.1-0.3-0.1\n                        c-0.3,0.1-0.7,0.2-1,0.3c-0.3,0.1-0.6,0.3-0.9,0.5c-0.1,0.1-0.1,0.2-0.1,0.3l0,1.5c-0.3,0.3-0.6,0.6-0.9,1l-1.5,0\n                        c-0.1,0-0.2,0.1-0.3,0.2c-0.3,0.6-0.6,1.3-0.7,1.9c0,0.1,0,0.2,0.1,0.3l1.2,1.1c0,0.4,0,0.8,0,1.1l-1.1,1.1\n                        c-0.1,0.1-0.1,0.2-0.1,0.3c0.1,0.3,0.2,0.6,0.3,0.9c0.2,0.4,0.4,0.7,0.6,1.1c0.1,0.1,0.1,0.1,0.3,0.1l1.6,0\n                        c0.2,0.2,0.4,0.5,0.7,0.7l0,1.6c0,0.1,0.1,0.2,0.2,0.3c0.7,0.4,1.4,0.6,2.1,0.8c0,0,0,0,0.1,0c0.1,0,0.2,0,0.2-0.1l1.1-1.2\n                        c0.3,0,0.6,0,0.9,0l1.1,1.1c0.1,0.1,0.2,0.1,0.3,0.1c0.4-0.1,0.7-0.2,1.1-0.4c0.3-0.1,0.7-0.3,1-0.5c0.1-0.1,0.1-0.2,0.1-0.3l0-1.5\n                        c0.2-0.2,0.5-0.4,0.7-0.7l1.5,0c0.1,0,0.2-0.1,0.3-0.1c0.4-0.6,0.7-1.3,0.8-2.1C24,57.2,24,57.1,23.9,57z M20.7,57.1\n                        c-0.4,1.1-1.3,2-2.4,2.5c-0.6,0.2-1.2,0.4-1.8,0.4c-1.8,0-3.5-1.1-4.2-2.7c-0.5-1.1-0.5-2.4-0.1-3.5c0.4-1.1,1.3-2,2.4-2.5\n                        c0.6-0.3,1.2-0.4,1.8-0.4c1.8,0,3.5,1.1,4.2,2.7C21.2,54.8,21.2,56,20.7,57.1z\"/>\n                </g>\n                <g>\n                    <ellipse fill=\"#0A92EA\" cx=\"55\" cy=\"18.4\" rx=\"2.2\" ry=\"2.2\"/>\n                    <path fill=\"#0A92EA\" d=\"M57.8,13.4v-2.1H52v2.1h-4.9v10.1h15.7V13.4H57.8z M55,22.3c-2.1,0-3.8-1.7-3.8-3.8s1.7-3.8,3.8-3.8\n                        c2.1,0,3.8,1.7,3.8,3.8S57.1,22.3,55,22.3z\"/>\n                </g>\n                <polygon fill=\"#0A92EA\" points=\"95.7,49 95.7,48 92.4,48 92.4,49 88.1,49 88.1,50.3 100.1,50.3 100.1,49 \"/>\n                <path fill=\"#0A92EA\" d=\"M89.2,63h9.7V51.3h-9.7V63z M95.9,53h1v8.3h-1V53z M93.6,53h1v8.3h-1V53z M91.2,53h1v8.3h-1V53z\"/>\n            </svg>";
                    // HTMLDivElement
                    var menuContainer = document.createElement('div');
                    menuContainer.innerHTML = svgMenuString;
                    this.map.container.appendChild(menuContainer);
                    menuContainer.style.display = 'none';
                    menuContainer.style.position = 'absolute';
                    menuContainer.style.top = '0';
                    menuContainer.style.left = '0';
                    menuContainer.style.width = '120px';
                    menuContainer.style.height = '93px';
                    menuContainer.style['pointer-events'] = 'none'; //Disable mouse interaction
                    //The geolocation that we want to the element t olive.
                    var anchor = Cesium.Cartesian3.fromDegrees(this.position.lng, this.position.lat, this.altitude + this.command.GroundElevationHAE);
                    //Every frame, figure out if the geolocation is on the screen
                    //and move the element accordingly.
                    var tmp = new Cesium.Cartesian2();
                    this.map.scene.preRender.addEventListener(function () {
                        var result = Cesium.SceneTransforms.wgs84ToWindowCoordinates(_this.map.scene, anchor, tmp);
                        if (Cesium.defined(result)) {
                            menuContainer.style.display = 'block';
                            menuContainer.style.top = tmp.y + 12 + 'px';
                            menuContainer.style.left = tmp.x + 5 + 'px';
                        }
                        else {
                            menuContainer.style.display = 'none';
                        }
                    });
                };
                WaypointCommandInstance.prototype.Edit = function () {
                    var _this = this;
                    if (this.isEditing) {
                        this.isEditing = false;
                        // Turn off editing and make appropriate updates
                        this.editingHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
                        this.editingHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
                        this.editingHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    }
                    else {
                        // Turn on editing and wire up event listening
                        this.isEditing = true;
                        var dragging;
                        // Wire up handler to listen for left mouse down event
                        this.editingHandler.setInputAction(function (click) {
                            // Check to see what the mouse has selected
                            var pickedObject = _this.map.scene.pick(click.position);
                            // Check to make sure we are only grabbing the entity we are editing
                            if (Cesium.defined(pickedObject) && pickedObject.id === _this.entity) {
                                dragging = pickedObject;
                                // Turn off rotation so we only move the entity
                                _this.map.scene.screenSpaceCameraController.enableRotate = false;
                                // Turn off depth testing so we can see the feature around terrain
                                _this.map.scene.globe.depthTestAgainstTerrain = false;
                            }
                        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
                        // Wire up handler to listen for left mouse up event
                        this.editingHandler.setInputAction(function () {
                            // Check if dragging entity is defined
                            if (Cesium.defined(dragging)) {
                                // Reset to undefined
                                dragging = undefined;
                                // Renable rotation
                                _this.map.scene.screenSpaceCameraController.enableRotate = true;
                                // Turn depth testing back on
                                _this.map.scene.globe.depthTestAgainstTerrain = true;
                                _this.UpdatePosition();
                            }
                        }, Cesium.ScreenSpaceEventType.LEFT_UP);
                        // Wire up handler for each mouse move while entity is being dragged
                        this.editingHandler.setInputAction(function (movement) {
                            // Return immediately if we are not dragging anything
                            if (!dragging) {
                                return;
                            }
                            // Use ray pick to get position and convert
                            var ray = _this.map.camera.getPickRay(movement.endPosition);
                            var position = _this.map.scene.globe.pick(ray, _this.map.scene);
                            // Check to see if the position is defined
                            if (!Cesium.defined(position) || !dragging) {
                                return;
                            }
                            var positionCartographic = _this.map.scene.globe.ellipsoid.cartesianToCartographic(position);
                            positionCartographic.height = 0;
                            //position = this.map.scene.globe.ellipsoid.cartographicToCartesian(positionCartographic);
                            //var cartographic: Cesium.Cartographic = Cesium.Cartographic.fromCartesian(position);
                            var longitude = Utility_1.Conversions.formatCoordinate(Cesium.Math.toDegrees(positionCartographic.longitude), 8);
                            var latitude = Utility_1.Conversions.formatCoordinate(Cesium.Math.toDegrees(positionCartographic.latitude), 8);
                            _this.position.lng = longitude;
                            _this.position.lat = latitude;
                            _this.bindings.$applyAsync();
                        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    }
                };
                WaypointCommandInstance.prototype.TrackEntity = function () {
                    this.onTrackEntity({ id: this.entity.id });
                };
                // Constructor
                WaypointCommandInstance.$inject = [
                    '$scope',
                    'db',
                    'mapService'
                ];
                return WaypointCommandInstance;
            }());
            exports_1("WaypointCommandInstance", WaypointCommandInstance);
            exports_1("default",angular.module('DroneSense.Web.Tools.WaypointCommandInstance', [
                commandHeader_1.default.name,
                infoFormatter_1.default.name,
                readableElevation_1.default.name,
                unitString_1.default.name,
                mapService_1.default.name
            ]).component('dsWaypointCommandInstance', {
                transclude: true,
                bindings: {
                    command: '<',
                    onCommandChange: '&',
                    map: '<',
                    user: '<',
                    onDelete: '&',
                    trackedEntity: '<',
                    onTrackEntity: '&',
                    camera: '<',
                    settings: '<'
                },
                controller: WaypointCommandInstance,
                templateUrl: './app/components/tools/waypointTool/waypointCommandInstance.html'
            }));
        }
    }
});

//# sourceMappingURL=waypointCommandInstance.js.map
