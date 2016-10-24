import { SessionController } from '../flightControlViewer/sessionController';
import { MapSession, MapWaypoint } from '../flightControlViewer/mapSession';

export interface IWaypointListViewer extends ng.IScope {

}

class WaypointListViewer {

    sessionController: SessionController;

    showHistory: boolean = false;

    showWaypointList: boolean;

    waypoints: Array<MapWaypoint> = [];

    // Constructor
    static $inject: Array<string> = [
        '$scope'
    ];
    constructor(public bindings: IWaypointListViewer) {

        this.sessionController.eventing.on('session-added', (ownerSession: MapSession) => {

            this.setupWaypoints();

            this.bindings.$applyAsync();
        });
    }

    // Set local waypoints to active session waypoints
    setupWaypoints(): void {
        this.waypoints = this.sessionController.activeSession.mapWaypoints.waypoints;
    }

    // Call delete waypoint
    delete(wp: MapWaypoint): void {
        this.sessionController.ownerSession.mapDrone.drone.FlightController.Guided.removeWaypoint(wp.index);
    }

    waypointFilter(wp: MapWaypoint): boolean {
        if (wp.reached) {
            return false;
        } else {
            return true;
        }
    }

    historyFilter(wp: MapWaypoint): boolean {
        if (wp.reached) {
            return true;
        } else {
            return false;
        }
    }

    hidingHistoricalWaypoints: boolean = false;

    hideHistoryWaypoint(): void {
        this.sessionController.activeSession.mapWaypoints.hideHistoryWaypoints(!this.hidingHistoricalWaypoints);
        this.hidingHistoricalWaypoints = !this.hidingHistoricalWaypoints;
    }

}


export default angular.module('DroneSense.Web.WaypointListViewer', [

]).component('dsWaypointListViewer', {
    bindings: {
        sessionController: '<'
    },
    controller: WaypointListViewer,
    templateUrl: './app/components/waypointListViewer/waypointListViewer.html'
});
