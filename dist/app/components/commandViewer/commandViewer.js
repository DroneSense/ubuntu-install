System.register(['@dronesense/model', '../tools/waypointTool/waypointCommandInstance', '../tools/sensorCaptureTool/sensorCaptureToolInstance', '../../common/dsRepeatSwitch'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var model_1, waypointCommandInstance_1, sensorCaptureToolInstance_1, dsRepeatSwitch_1;
    var CommandViewer;
    return {
        setters:[
            function (model_1_1) {
                model_1 = model_1_1;
            },
            function (waypointCommandInstance_1_1) {
                waypointCommandInstance_1 = waypointCommandInstance_1_1;
            },
            function (sensorCaptureToolInstance_1_1) {
                sensorCaptureToolInstance_1 = sensorCaptureToolInstance_1_1;
            },
            function (dsRepeatSwitch_1_1) {
                dsRepeatSwitch_1 = dsRepeatSwitch_1_1;
            }],
        execute: function() {
            CommandViewer = (function () {
                function CommandViewer(bindings, db) {
                    var _this = this;
                    this.bindings = bindings;
                    this.db = db;
                    // Initialize command array
                    this.commands = [];
                    // Load flight plan
                    this.loadCommands();
                    try {
                        this.map.entities.add({
                            name: 'Flight Path',
                            polyline: {
                                // TODO - move to static property and manually trigger the redraw for trigger changes.
                                positions: new Cesium.CallbackProperty(function () {
                                    //console.log('command viewer property callback');
                                    var degreesArray = [];
                                    _this.commands.forEach(function (command) {
                                        degreesArray.push(Cesium.Cartesian3.fromDegrees(command.Position.lng, command.Position.lat, command.AltitudeHAE));
                                    });
                                    return degreesArray;
                                }, false),
                                width: 2,
                                material: Cesium.Color.fromCssColorString('#07eae4')
                            } //,
                        });
                    }
                    catch (exception) {
                        console.log(exception);
                    }
                }
                CommandViewer.prototype.loadCommands = function () {
                    var _this = this;
                    // Load all commands and add to UI
                    this.commandsHandle = this.db.commands.getCommandsForFlightPlanWithId(this.flightPlanId);
                    this.commandsHandle.on(this.commandsHandle.EVENTS.LIST_CHANGED, function (data) {
                        // Handle inbound command list change
                        _this.HandleListChanged(data);
                    });
                };
                // Handles any firebase callbacks that the commands list has been updated by a reorder, add or delete
                CommandViewer.prototype.HandleListChanged = function (data) {
                    var _this = this;
                    // first check for delete by comparing length
                    if (data.length < this.commands.length) {
                        var deleteList = [];
                        this.commands.forEach(function (command) {
                            if (_.findIndex(data, function (handle) {
                                return command.handle.id === handle.id;
                            }) === -1) {
                                deleteList.push(command);
                            }
                        });
                        deleteList.forEach(function (command) {
                            _this.DeleteCommand(command);
                        });
                        // Reorder as necessary
                        this.SetCommandOrderDB();
                        return;
                    }
                    // figure out if it is a add, delete, re-order
                    data.forEach(function (handle, index) {
                        var position = _.findIndex(_this.commands, function (command) {
                            return command.handle.id === handle.id;
                        });
                        // add if it doesn't exist in command
                        if (position === -1) {
                            _this.AddCommand(handle);
                            return;
                        }
                        // check if index has changed
                        if (index !== position) {
                            _this.MoveCommand(position, index);
                        }
                    });
                    // Reorder as necessary
                    this.SetCommandOrderDB();
                };
                // Add command from database callback event
                CommandViewer.prototype.AddCommand = function (data) {
                    var command;
                    switch (data.handle.data.type.toLowerCase()) {
                        case 'takeoff':
                            //command = new TakeoffCommand(data.id, data.handle);
                            break;
                        case 'waypoint':
                            command = new model_1.WaypointCommand('waypoint', data.id, data.handle, false);
                            break;
                        case 'sensor':
                            command = new model_1.SensorCaptureCommand('sensor', data.id, data.handle, false);
                            break;
                        case 'survey':
                            //command = new SurveyCommandView(data.id, data.handle);
                            break;
                        case 'poi':
                            //command = new OrbitCommand(data.id, data.handle);
                            break;
                        default:
                            break;
                    }
                    var newIndex = this.commands.push(command);
                    this.bindings.$applyAsync();
                    // Make sure to add takeoff at index 0
                    if (command.Type.toLowerCase() === 'takeoff') {
                        if (newIndex - 1 > 0) {
                        }
                    }
                };
                // Delete command from database callback event
                CommandViewer.prototype.DeleteCommand = function (command) {
                    // Unwire events
                    command.RemoveHandle();
                    // TODO - Review where this belongs for survey command
                    //if (command.Type.toLowerCase() === 'survey') {
                    //    // call delete on survey data service for command
                    //    this.surveyDataService.deleteSurveyData(this.surveyDataService.getSurveyDataById(command.Uid));
                    //    this.map.removeLayer(command.MasterLayer);
                    //}
                    var index = _.findIndex(this.commands, function (com) {
                        return command.handle.id === com.id;
                    });
                    if (index === -1) {
                        throw 'Command not found for delete.';
                    }
                    this.commands.splice(index, 1);
                    // TODO - how to remove from map here
                    //this.map.removeLayer(command.MapLayer.layer);
                    // command.ModelUpdated.off((): void => {
                    // });
                    // Call apply to update list
                    this.bindings.$applyAsync();
                };
                // Handle command reorder database callback
                CommandViewer.prototype.MoveCommand = function (oldIndex, newIndex) {
                    while (oldIndex < 0) {
                        oldIndex += this.commands.length;
                    }
                    while (newIndex < 0) {
                        newIndex += this.commands.length;
                    }
                    if (newIndex >= this.commands.length) {
                        var k = newIndex - this.commands.length;
                        while ((k--) + 1) {
                            this.commands.push(undefined);
                        }
                    }
                    this.commands.splice(newIndex, 0, this.commands.splice(oldIndex, 1)[0]);
                };
                // Update command order property after add, delete or move
                CommandViewer.prototype.SetCommandOrderDB = function () {
                    this.commands.forEach(function (cv, index) {
                        //cv.Command.Order = index + 1;
                        cv.SaveOrder(index + 1);
                    });
                    // TODO - Figure out high level redraw
                    //this.GenerateVisualFlightPath();
                };
                CommandViewer.prototype.reorderCommands = function () {
                };
                // Trigger Delete command in DB
                CommandViewer.prototype.DeleteCommandDB = function (id) {
                    this.db.commands.deleteCommandWithIdFromFlightPlanWithId(id, this.flightPlanId);
                };
                // Manages what command entity is currently tracked
                CommandViewer.prototype.TrackEntity = function (id) {
                    // first check to see if current tracked entity is requesting to be turned off
                    if (this.trackedEntityId === id) {
                        this.map.trackedEntity = undefined;
                        this.trackedEntityId = undefined;
                        return;
                    }
                    this.map.trackedEntity = this.map.entities.getById(id);
                    this.trackedEntityId = id;
                };
                // Constructor
                CommandViewer.$inject = [
                    '$scope',
                    'db'
                ];
                return CommandViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.CommandViewer', [
                dsRepeatSwitch_1.default.name,
                waypointCommandInstance_1.default.name,
                sensorCaptureToolInstance_1.default.name
            ]).component('dsCommandViewer', {
                transclude: true,
                bindings: {
                    flightPlanId: '<',
                    map: '<',
                    user: '<',
                    camera: '<',
                    settings: '<'
                },
                controller: CommandViewer,
                templateUrl: './app/components/commandViewer/commandViewer.html'
            }));
        }
    }
});

//# sourceMappingURL=commandViewer.js.map
