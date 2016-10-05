System.register(['../tools/waypointTool/waypointCommandDrawTool', '../tools/geofenceTool/geofenceDrawTool', '../tools/rallyPointTool/rallyPointDrawTool', '../tools/takeoffTool/takeoffCommandDrawTool', '../tools/surveyTool/surveyCommandDrawTool', '../tools/3dModelTool/3dModelDrawTool', '../tools/orbitTool/orbitDrawTool', '../tools/measureTool/measureDrawTool', '../tools/elevationTool/elevationDrawTool', '../tools/volumeMeasureTool/volumeMeasureDrawTool', '../tools/polygon3DTool/polygon3DDrawTool', '../tools/circle3DTool/circle3DDrawTool', '../tools/noteTool/noteDrawTool', '../tools/warningTool/warningDrawTool', '../tools/sensorCaptureTool/sensorCaptureDrawTool'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var waypointCommandDrawTool_1, geofenceDrawTool_1, rallyPointDrawTool_1, takeoffCommandDrawTool_1, surveyCommandDrawTool_1, _3dModelDrawTool_1, orbitDrawTool_1, measureDrawTool_1, elevationDrawTool_1, volumeMeasureDrawTool_1, polygon3DDrawTool_1, circle3DDrawTool_1, noteDrawTool_1, warningDrawTool_1, sensorCaptureDrawTool_1;
    var MapTools;
    return {
        setters:[
            function (waypointCommandDrawTool_1_1) {
                waypointCommandDrawTool_1 = waypointCommandDrawTool_1_1;
            },
            function (geofenceDrawTool_1_1) {
                geofenceDrawTool_1 = geofenceDrawTool_1_1;
            },
            function (rallyPointDrawTool_1_1) {
                rallyPointDrawTool_1 = rallyPointDrawTool_1_1;
            },
            function (takeoffCommandDrawTool_1_1) {
                takeoffCommandDrawTool_1 = takeoffCommandDrawTool_1_1;
            },
            function (surveyCommandDrawTool_1_1) {
                surveyCommandDrawTool_1 = surveyCommandDrawTool_1_1;
            },
            function (_3dModelDrawTool_1_1) {
                _3dModelDrawTool_1 = _3dModelDrawTool_1_1;
            },
            function (orbitDrawTool_1_1) {
                orbitDrawTool_1 = orbitDrawTool_1_1;
            },
            function (measureDrawTool_1_1) {
                measureDrawTool_1 = measureDrawTool_1_1;
            },
            function (elevationDrawTool_1_1) {
                elevationDrawTool_1 = elevationDrawTool_1_1;
            },
            function (volumeMeasureDrawTool_1_1) {
                volumeMeasureDrawTool_1 = volumeMeasureDrawTool_1_1;
            },
            function (polygon3DDrawTool_1_1) {
                polygon3DDrawTool_1 = polygon3DDrawTool_1_1;
            },
            function (circle3DDrawTool_1_1) {
                circle3DDrawTool_1 = circle3DDrawTool_1_1;
            },
            function (noteDrawTool_1_1) {
                noteDrawTool_1 = noteDrawTool_1_1;
            },
            function (warningDrawTool_1_1) {
                warningDrawTool_1 = warningDrawTool_1_1;
            },
            function (sensorCaptureDrawTool_1_1) {
                sensorCaptureDrawTool_1 = sensorCaptureDrawTool_1_1;
            }],
        execute: function() {
            // Map tools are the Draw Handlers for various commands that add UI to the map
            MapTools = (function () {
                // Take a list of tools and load
                function MapTools(bindings, db) {
                    this.bindings = bindings;
                    this.db = db;
                    var $ctrl = this;
                    // Initialize tool array
                    this.singleInstanceTools = [];
                    this.multiInstanceTools = [];
                    this.measureTools = [];
                    this.threeDCreationTools = [];
                    this.annotationTools = [];
                    this.drawEnd = function (command) {
                        $ctrl.onAddCommand({ command: command });
                    };
                    //    this.bindings.$watch(() => { return this.camera; }, (newValue: Camera, oldValue: Camera): void => {
                    //         this.camera = newValue;
                    //     });
                    // add DS tools
                    this.AddDSTools();
                }
                // Load all tools
                MapTools.prototype.AddDSTools = function () {
                    var geofence = new geofenceDrawTool_1.GeofenceTool(this.map, this.drawEnd);
                    var rallyPoint = new rallyPointDrawTool_1.RallyPointTool(this.map, this.drawEnd);
                    var waypointTool = new waypointCommandDrawTool_1.WaypointCommandDrawTool(this.map, this.drawEnd, this.flightPlan);
                    var takeTool = new takeoffCommandDrawTool_1.TakeoffCommandDrawTool(this.map, this.drawEnd);
                    var surveyTool = new surveyCommandDrawTool_1.SurveyCommandDrawTool(this.map, this.drawEnd);
                    var model3DTool = new _3dModelDrawTool_1.Model3DDrawTool(this.map, this.drawEnd);
                    var orbitTool = new orbitDrawTool_1.OrbitTool(this.map, this.drawEnd);
                    var measureTool = new measureDrawTool_1.MeasureTool(this.map, this.drawEnd);
                    var elevationTool = new elevationDrawTool_1.ElevationTool(this.map, this.drawEnd);
                    var volumeTool = new volumeMeasureDrawTool_1.VolumeMeasureTool(this.map, this.drawEnd);
                    var polygon3DTool = new polygon3DDrawTool_1.Polygon3DTool(this.map, this.drawEnd);
                    var circle3DTool = new circle3DDrawTool_1.Circle3DTool(this.map, this.drawEnd);
                    var noteTool = new noteDrawTool_1.NoteTool(this.map, this.drawEnd);
                    var warningTool = new warningDrawTool_1.WarningTool(this.map, this.drawEnd);
                    var sensorCapture = new sensorCaptureDrawTool_1.SensorCaptureTool(this.map, this.drawEnd, this.flightPlan);
                    this.singleInstanceTools.push(geofence);
                    this.singleInstanceTools.push(rallyPoint);
                    this.multiInstanceTools.push(takeTool);
                    this.multiInstanceTools.push(waypointTool);
                    this.multiInstanceTools.push(surveyTool);
                    this.multiInstanceTools.push(orbitTool);
                    this.multiInstanceTools.push(sensorCapture);
                    this.measureTools.push(measureTool);
                    this.measureTools.push(elevationTool);
                    this.measureTools.push(volumeTool);
                    this.threeDCreationTools.push(model3DTool);
                    this.threeDCreationTools.push(polygon3DTool);
                    this.threeDCreationTools.push(circle3DTool);
                    this.annotationTools.push(noteTool);
                    this.annotationTools.push(warningTool);
                };
                // Constructor
                MapTools.$inject = [
                    '$scope',
                    'db'
                ];
                return MapTools;
            }());
            exports_1("default",angular.module('DroneSense.Web.MapTools', []).component('dsMapTools', {
                bindings: {
                    map: '<',
                    //onDrawStart: '&',
                    //onDrawEnd: '&',
                    onAddCommand: '&',
                    flightPlan: '<'
                },
                controller: MapTools,
                templateUrl: './app/components/mapTools/mapTools.html'
            }));
        }
    }
});

//# sourceMappingURL=mapTools.js.map
