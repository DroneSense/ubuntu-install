
export interface IBatteryStatusIcon extends ng.IScope {

}

class BatteryStatusIcon {

    // Green - #00C121
    // Yellow - #dcd300
    // Red - #ea0707
    // Default - #abafb9

    // If the battery percentage is between 0-25 then we will show
    // one bar and everything will be red.

    batteryPercentage: number = 0;

    get Bar1Color(): string {
        if (this.batteryPercentage === 0) {
            return '#abafb9';
        } else if (this.batteryPercentage <= 25) {
            return '#ea0707';
        } else if (this.batteryPercentage > 25 && this.batteryPercentage <= 50) {
            return '#dcd300';
        } else if (this.batteryPercentage > 50) {
            return '#00C121';
        }
    }

    get Bar2Color(): string {
        if (this.batteryPercentage === 0) {
            return '#abafb9';
        } else if (this.batteryPercentage <= 25) {
            return 'rgba(0, 0, 0, 0)';
        } else if (this.batteryPercentage > 25 && this.batteryPercentage <= 50) {
            return '#dcd300';
        } else if (this.batteryPercentage > 50) {
            return '#00C121';
        }
    }

    get Bar3Color(): string {
        if (this.batteryPercentage === 0) {
            return '#abafb9';
        } else if (this.batteryPercentage <= 50) {
            return 'rgba(0, 0, 0, 0)';
        } else if (this.batteryPercentage > 50) {
            return '#00C121';
        }
    }

    get Bar4Color(): string {
        if (this.batteryPercentage === 0) {
            return '#abafb9';
        } else if (this.batteryPercentage <= 75) {
            return 'rgba(0, 0, 0, 0)';
        } else if (this.batteryPercentage > 75) {
            return '#00C121';
        }
    }

    get MainIconColor(): string {
        if (this.batteryPercentage === 0) {
            return '#abafb9';
        } else if (this.batteryPercentage <= 25) {
            return '#ea0707';
        } else if (this.batteryPercentage > 25 && this.batteryPercentage <= 50) {
            return '#dcd300';
        } else if (this.batteryPercentage > 50) {
            return '#00C121';
        }
    }

    // Constructor
    static $inject: Array<string> = [
        '$scope'
    ];
    constructor(public bindings: IBatteryStatusIcon) {

    }

}

export default angular.module('DroneSense.Web.BatteryStatusIcon', [
]).component('dsBatteryStatusIcon', {
    bindings: {
        batteryPercentage: '<'
    },
    controller: BatteryStatusIcon,
    templateUrl: './app/components/batteryStatusIcon/batteryStatusIcon.html'
});
