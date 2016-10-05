import { Command } from '@dronesense/model';
import { IUIStateService } from '../../services/uiStateService';

import { WaypointCommand, SensorCaptureCommand, TakeoffCommand } from '@dronesense/model';

import WaypointCommandInstance from '../tools/waypointTool/waypointCommandInstance';
import SensorCommandInstance from '../tools/sensorCaptureTool/sensorCaptureToolInstance';

import BnRepeatSwitch from '../../common/dsRepeatSwitch';

export interface ICommandViewer extends ng.IScope {
    flightPlanId: string;
    map: Cesium.Viewer;
}

class CommandViewer {

    // Passed in flight plan id
    flightPlanId: string;

    // The flight plan model object
    commands: Array<Command>;

    // Handle to current flight plan
    commandsHandle: any;

    uiStateService: IUIStateService;

    map: Cesium.Viewer;

    // Id of currently tracked command entity
    trackedEntityId: string;

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        'db'
    ];

    constructor(public bindings: ICommandViewer,
                public db: any) {

        // Initialize command array
        this.commands = [];

        // Load flight plan
        this.loadCommands();

        try {

            this.map.entities.add({
                name: 'Flight Path',
                polyline: {
                    // TODO - move to static property and manually trigger the redraw for trigger changes.
                    positions: new Cesium.CallbackProperty( (): any => {

                        //console.log('command viewer property callback');

                        var degreesArray: Array<Cesium.Cartesian3> = [];

                        this.commands.forEach((command: Command): void => {
                            degreesArray.push(Cesium.Cartesian3.fromDegrees((<WaypointCommand>command).Position.lng, (<WaypointCommand>command).Position.lat, (<WaypointCommand>command).AltitudeHAE));
                        });

                        return degreesArray;

                    }, false),
                    width: 2,
                    material: Cesium.Color.fromCssColorString('#07eae4')
                }//,
                // wall: {
                //     positions: new Cesium.CallbackProperty( (): any => {

                //         var degreesArray: Array<Cesium.Cartesian3> = [];

                //         this.commands.forEach((command: Command): void => {
                //             degreesArray.push(Cesium.Cartesian3.fromDegrees((<WaypointCommand>command).Position.lng, (<WaypointCommand>command).Position.lat, (<WaypointCommand>command).AltitudeHAE));
                //         });

                //         return degreesArray;

                //     }, false) ,
                //     material: Cesium.Color.fromBytes(10, 146, 234, 100)
                // }
            });

        } catch (exception) {
            console.log(exception);
        }
    }

    loadCommands(): void {

        // Load all commands and add to UI
        this.commandsHandle = this.db.commands.getCommandsForFlightPlanWithId(this.flightPlanId);

        this.commandsHandle.on(this.commandsHandle.EVENTS.LIST_CHANGED, (data: any): void => {

            // Handle inbound command list change
            this.HandleListChanged(data);

        });

    }

    // Handles any firebase callbacks that the commands list has been updated by a reorder, add or delete
    HandleListChanged(data: any): void {

        // first check for delete by comparing length
        if (data.length < this.commands.length) {

            var deleteList: Array<Command> = [];

            this.commands.forEach((command: Command): void => {
                if (_.findIndex(data, (handle: any): boolean => {
                        return command.handle.id === handle.id;
                    }) === -1) {
                    deleteList.push(command);
                }
            });

            deleteList.forEach((command: Command): void => {
                this.DeleteCommand(command);
            });

            // Reorder as necessary
            this.SetCommandOrderDB();

            return;
        }

        // figure out if it is a add, delete, re-order
        data.forEach((handle: any, index: number): void => {
            var position: number = _.findIndex(this.commands, (command: Command): boolean => {
                return command.handle.id === handle.id;
            });

            // add if it doesn't exist in command
            if (position === -1) {
                this.AddCommand(handle);
                return;
            }

            // check if index has changed
            if (index !== position) {
                this.MoveCommand(position, index);
            }
        });

        // Reorder as necessary
        this.SetCommandOrderDB();
    }

    // Add command from database callback event
    AddCommand(data: any): void {

        var command: Command;

        switch (data.handle.data.type.toLowerCase()) {
            case 'takeoff':

                //command = new TakeoffCommand(data.id, data.handle);

                break;
            case 'waypoint':

                command = new WaypointCommand('waypoint', data.id, data.handle, false);

                break;
            case 'sensor':

                command = new SensorCaptureCommand('sensor', data.id, data.handle, false);

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

        var newIndex: number = this.commands.push(command);

        this.bindings.$applyAsync();

        // Make sure to add takeoff at index 0
        if (command.Type.toLowerCase() === 'takeoff') {

            if (newIndex - 1 > 0) {
                //this.commandsHandle.moveCommandWithIdBeforeCommandWithId(command.id, this.commands[0].id);
            }
        }
    }

    // Delete command from database callback event
    DeleteCommand(command: Command): void {

        // Unwire events
        command.RemoveHandle();

        // TODO - Review where this belongs for survey command
        //if (command.Type.toLowerCase() === 'survey') {
        //    // call delete on survey data service for command
        //    this.surveyDataService.deleteSurveyData(this.surveyDataService.getSurveyDataById(command.Uid));
        //    this.map.removeLayer(command.MasterLayer);
        //}

        var index: number = _.findIndex(this.commands, (com: any): boolean => {
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

    }

    // Handle command reorder database callback
    MoveCommand(oldIndex: number, newIndex: number): void {
        while (oldIndex < 0) {
            oldIndex += this.commands.length;
        }
        while (newIndex < 0) {
            newIndex += this.commands.length;
        }
        if (newIndex >= this.commands.length) {
            var k: number = newIndex - this.commands.length;
            while ((k--) + 1) {
                this.commands.push(undefined);
            }
        }
        this.commands.splice(newIndex, 0, this.commands.splice(oldIndex, 1)[0]);

    }

    // Update command order property after add, delete or move
    SetCommandOrderDB(): void {

        this.commands.forEach((cv: Command, index: number): void => {
            //cv.Command.Order = index + 1;
            cv.SaveOrder(index + 1);
        });

        // TODO - Figure out high level redraw
        //this.GenerateVisualFlightPath();
    }

    reorderCommands(): void {

    }

    // Trigger Delete command in DB
    DeleteCommandDB(id: string): void {
        this.db.commands.deleteCommandWithIdFromFlightPlanWithId(id, this.flightPlanId);
    }

    // Manages what command entity is currently tracked
    TrackEntity(id: string): void {

        // first check to see if current tracked entity is requesting to be turned off
        if (this.trackedEntityId === id) {
            this.map.trackedEntity = undefined;
            this.trackedEntityId = undefined;
            return;
        }

        this.map.trackedEntity = this.map.entities.getById(id);
        this.trackedEntityId = id;
    }
}

export default angular.module('DroneSense.Web.CommandViewer', [
    BnRepeatSwitch.name,
    WaypointCommandInstance.name,
    SensorCommandInstance.name
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
});

