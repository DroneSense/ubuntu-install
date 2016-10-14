import { } from '@dronesense/model';

import IDrone from '@dronesense/core/lib/common/IDrone';
import gpsStatusIcon from '../gpsStatusIcon/gpsStatusIcon';
import batteryStatusIcon from '../batteryStatusIcon/batteryStatusIcon';
import batteryStatusIndicator from '../batteryStatusIndicator/batteryStatusIndicator';
import telemetryStatusIcon from '../telemetryStatusIcon/telemetryStatusIcon';
import rcStatusIcon from '../rcStatusIcon/rcStatusIcon';
import videoStatusIcon from '../videoStatusIcon/videoStatusIcon';

import { SessionController } from '../flightControlViewer/sessionController';
import { OwnerMapSession, MapSession } from '../flightControlViewer/mapSession';
import { Firmware } from '@dronesense/core/lib/common/enums/Firmware';

import { FlightControlSettings } from '../flightControlViewer/flightControlSettings';

export interface IControlToolbar extends ng.IScope {

}

class ControlToolbar {

    batteryVoltage: number = 0;
    batteryCurrent: number = 0;
    batteryRemainingPercent: number = 0;
    batteryTemp: number = 0;
    remainingMah: number = 0;
    timeRemaining: number = 0;
    lifetimeRemaining: number = 0;

    videoSignalPercentage: number = 0;
    rcSignalPercentage: number = 0;

    gpsFixType: number = 0;
    satCount: number = 0;
    gpsHdop: number = 0;
    gpsVdop: number = 0;


    selectedTab: number;

    gps: boolean;
    telementry: boolean;
    datalink: boolean;
    sysStatus: boolean;
    battery: boolean;
    videoLink: boolean;
    settingsDialog: boolean;

    sessionController: SessionController;

    drone: IDrone;

    isDJIDrone: boolean = true;

    settings: FlightControlSettings;

    // Constructor
    static $inject: Array<string> = [
        '$scope'
    ];
    constructor(public bindings: IControlToolbar) {
        this.selectedTab = -1;

        this.sessionController.eventing.on('session-added', (ownerSession: OwnerMapSession) => {
            this.drone = this.sessionController.activeSession.mapDrone.drone;
            this.isDJIDrone = this.drone.FlightController.Firmware === Firmware.DJI ? true : false;

            this.bindings.$applyAsync();

            this.wireUpChanges();
        });

        this.sessionController.eventing.on('session-removed', (ownerSession: MapSession) => {
            
            this.unwireChanges();

            this.drone = null;

            this.bindings.$applyAsync();
        });

        this.sessionController.eventing.on('session-changed', (session: MapSession) => {
            
            this.unwireChanges();
            
            this.drone = session.mapDrone.drone;
            this.bindings.$applyAsync();

            this.wireUpChanges();
        });
    }

    unwireChanges(): void {
        if (this.drone) {
            this.drone.FlightController.Telemetry.off('propertyChanged');
        }
        this.batteryVoltage = 0;
        this.batteryCurrent = 0;
        this.batteryRemainingPercent = 0;
        this.videoSignalPercentage = 0;
        this.rcSignalPercentage = 0;
        this.gpsFixType = 0;
        this.satCount = 0;
        this.gpsHdop = 0;
        this.gpsVdop = 0;
    }

    wireUpChanges(): void {
        this.drone.FlightController.Telemetry.on('propertyChanged', (name, value) => {
            
            if (this.isDJIDrone) {
                if (this.drone.FlightController.Telemetry.DJIRadio) {
                    this.videoSignalPercentage = this.drone.FlightController.Telemetry.DJIRadio.videoSignalPercent;
                    this.rcSignalPercentage = this.drone.FlightController.Telemetry.DJIRadio.remoteSignalPercent;
                }
                if (this.drone.FlightController.Telemetry.DJIBattery) {
                    this.batteryVoltage = +(this.drone.FlightController.Telemetry.DJIBattery.currentVoltage * .001).toFixed(2);
                    this.batteryCurrent = this.drone.FlightController.Telemetry.DJIBattery.currentCurrent;
                    this.batteryRemainingPercent = this.drone.FlightController.Telemetry.DJIBattery.batteryEnergyRemainingPercent;
                    this.batteryTemp = this.drone.FlightController.Telemetry.DJIBattery.batteryTemperature;
                    this.remainingMah = this.drone.FlightController.Telemetry.DJIBattery.currentEnergy;
                    this.timeRemaining = (((this.remainingMah / Math.abs(this.batteryCurrent)) * 60) * 60) * 1000;
                    this.lifetimeRemaining = this.drone.FlightController.Telemetry.DJIBattery.lifetimeRemainingPercent;
                }
                //console.log(this.timeRemaining);
            } else {
                this.batteryVoltage = +(this.drone.FlightController.Telemetry.Battery.voltage * .001).toFixed(2);
                this.batteryCurrent = +(this.drone.FlightController.Telemetry.Battery.current * .01).toFixed(2);
                this.batteryRemainingPercent = this.drone.FlightController.Telemetry.Battery.percentRemaining;
            }

            this.gpsFixType = this.drone.FlightController.Telemetry.Position.fixType;
            this.satCount = this.drone.FlightController.Telemetry.Position.satelliteCount;
            this.gpsHdop = this.drone.FlightController.Telemetry.Position.hdop;
            this.gpsVdop = this.drone.FlightController.Telemetry.Position.vdop;
            
            this.bindings.$applyAsync();
        });
    }

    hidetabs(): void {
        this.gps = false;
        this.telementry = false;
        this.datalink = false;
        this.sysStatus = false;
        this.battery = false;
        this.videoLink = false;
        this.settingsDialog = false;
    }

    toggleTab(name: string): void {

        if (name === 'battery') {
            if (this.battery) {
                this.battery = false;
                this.selectedTab = -1;
            } else {
                this.hidetabs();
                this.battery = true;
                this.selectedTab = 4;
            }
        }

        if (name === 'gps') {
            if (this.gps) {
                this.gps = false;
                this.selectedTab = -1;
            } else {
                this.hidetabs();
                this.gps = true;
                this.selectedTab = 0;
            }
        }

        if (name === 'settings') {
            if (this.settingsDialog) {
                this.settingsDialog = false;
                this.selectedTab = -1;
            } else {
                this.hidetabs();
                this.settingsDialog = true;
                this.selectedTab = 6;
            }
        }
    }
}

export default angular.module('DroneSense.Web.ControlToolbar', [
    gpsStatusIcon.name,
    batteryStatusIcon.name,
    batteryStatusIndicator.name,
    telemetryStatusIcon.name,
    rcStatusIcon.name,
    videoStatusIcon.name
]).component('dsControlToolbar', {
    bindings: {
        sessionController: '<',
        settings: '<'
    },
    controller: ControlToolbar,
    templateUrl: './app/components/controlToolbar/controlToolbar.html'
});
