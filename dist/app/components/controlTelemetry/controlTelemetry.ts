import { } from '@dronesense/model';

import IDrone from '@dronesense/core/lib/common/IDrone';
import IGimbalState from '@dronesense/core/lib/common/entities/IGimbalState';

import { SessionController } from '../flightControlViewer/sessionController';
import { OwnerMapSession, MapSession } from '../flightControlViewer/mapSession';

import { IGuidedWaypoint } from '@dronesense/core/lib/common/entities/IGuidedWaypoint';

import { MapWaypoint } from '../flightControlViewer/mapSession';

export interface IControlTelemetry extends ng.IScope {

}

class ControlTelemetry {

    sessionController: SessionController;

    drone: IDrone;

    isDJIDrone: boolean = true;

    horizontalSpeedValue: string = '-180deg';

    verticalSpeedValue: string = '-180deg';

    get verticalSpeedColor(): string {
        if (this.vSpeed > 0) {
            return '#2f87c3';
        } else {
            return '#00c121';
        }
    }

    hSpeed: number = 0;

    vSpeed: number = 0;

    agl: number = 0;

    cssAGL: string = '0px';

    rollCSS: string = '0deg';

    pitch: number = 0;

    pitchCSS: string = '0px';

    headingCSS: string = '0';

    brown: string = '#6c5735';

    heading: number = 0;

    waypoints: Array<MapWaypoint> = [];

    get aglColor(): string {
        if (this.agl >= 120) {
            return 'red';
        } else {
            return '#2f87c3';
        }
    }

    // Gimbal Properties 

    gimbalPitch: number = 0;
    gimbalHeading: number = 0;

    // speed range 0-25 m/s

    // Constructor
    static $inject: Array<string> = [
        '$scope'
    ];
    constructor(public bindings: IControlTelemetry) {

        this.sessionController.eventing.on('session-added', (ownerSession: OwnerMapSession) => {
            
            this.unwireChanges();
            
            this.drone = ownerSession.mapDrone.drone;

            this.bindings.$applyAsync();

            this.setupWaypoints();

            this.wireUpChanges();

        });

        this.sessionController.eventing.on('session-removed', (session: MapSession) => {
            
            this.unwireChanges();

            this.removeWaypoint();
            
            this.drone = null;

            this.bindings.$applyAsync();
        });

        this.sessionController.eventing.on('session-changed', (session: MapSession) => {
            
            this.unwireChanges();

            if (this.drone) {
                this.drone.FlightController.Guided.off('waypoints-changed');
            }
            
            this.drone = session.mapDrone.drone;

            this.setupWaypoints();

            this.wireUpChanges();

            this.bindings.$applyAsync();
        });
    }

    unwireChanges(): void {
        if (this.drone) {
            this.drone.FlightController.Telemetry.off('propertyChanged');
            this.drone.Gimbal.off('state-updated');
        }
        this.hSpeed = 0;
        this.vSpeed = 0;
        this.agl = 0;
        this.cssAGL = '0px';
        this.rollCSS = '0deg';
        this.pitch = 0;
        this.pitchCSS = '0px';
        this.headingCSS = '0';
        this.brown = '#6c5735';
        this.heading = 0;
        this.horizontalSpeedValue = '-180deg';
        this.verticalSpeedValue = '-180deg';
        this.gimbalHeading = 0;
        this.gimbalPitch = 0;
    }

    wireUpChanges(): void {

        this.drone.FlightController.Telemetry.on('propertyChanged', (name, value) => {
        
            if (name === 'Position') {
                this.hSpeed = +(this.drone.FlightController.Telemetry.Position.groundSpeed).toFixed(1);
                this.horizontalSpeedValue = (-180 + ((this.hSpeed / 25) * 180)).toString() + 'deg';

                this.vSpeed = +(this.drone.FlightController.Telemetry.Position.zVelocity).toFixed(1);
                this.verticalSpeedValue = (-180 + ((Math.abs(this.vSpeed) / 10) * 180)).toString() + 'deg';

                this.agl = +(this.drone.FlightController.Telemetry.Position.altitudeAGL).toFixed(1);
                this.cssAGL = ((this.agl / 150) * 100).toString() + 'px';

            }

            if (name === 'Attitude') {

                this.rollCSS = (this.toDegrees(this.drone.FlightController.Telemetry.Attitude.roll) * -1).toString() + 'deg';

                this.pitchCSS = (this.toDegrees(this.drone.FlightController.Telemetry.Attitude.pitch) * 2).toString() + 'px';

                this.headingCSS = (this.drone.FlightController.Telemetry.Position.heading).toString();

                this.heading = Math.round(this.drone.FlightController.Telemetry.Position.heading);
            }
            
            this.bindings.$applyAsync();

        });

        this.drone.Gimbal.on('state-updated', (gimbal: IGimbalState) => {
            if (gimbal) {
                this.gimbalHeading = Math.round(gimbal.yaw);
                this.gimbalPitch = Math.round(gimbal.pitch) * -1;
            }
        });
    }

    setupWaypoints(): void {
        this.waypoints = this.sessionController.activeSession.mapWaypoints.waypoints;

        this.drone.FlightController.Guided.on('waypoints-changed', () => {
            this.bindings.$applyAsync();
        });
    }

    removeWaypoint(): void {
        this.waypoints = null;

        if (this.drone) {
            this.drone.FlightController.Guided.off('waypoints-changed');
        }
    }
    
    waypointFilter(wp: MapWaypoint): boolean {
        if (wp.reached) {
            return false;
        } else {
            return true;
        }
    }

    roundToTwo(num: number): number {
        return +num.toFixed(2);
    }

    toDegrees(radians: number): number {
        return radians * 180 / Math.PI;
    }
}

export default angular.module('DroneSense.Web.ControlTelemetry', [

]).component('dsControlTelemetry', {
    bindings: {
        sessionController: '<'
    },
    controller: ControlTelemetry,
    templateUrl: './app/components/controlTelemetry/controlTelemetry.html'
});
