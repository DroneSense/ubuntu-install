import IDrone from '@dronesense/core/lib/common/IDrone';


export interface IRcStatusIcon extends ng.IScope {

}

class RcStatusIcon {

    // Green - #00C121
    // Yellow - #dcd300
    // Red - #ea0707
    // Default - #abafb9

    signalStrength: number = 0;

    isDJI: boolean = true;

    get Bar1Color(): string {
        if (this.signalStrength === 0) {
            return '#abafb9';
        } else if (this.signalStrength >= 1 && this.signalStrength < 20) {
            return '#ea0707';
        } else if (this.signalStrength >= 20 && this.signalStrength < 40) {
            return '#dcd300';
        } else if (this.signalStrength >= 40) {
            return '#00C121';
        }
    }

    get Bar2Color(): string {
        if (this.signalStrength === 0) {
            return '#abafb9';
        } else if (this.signalStrength >= 20 && this.signalStrength < 40) {
            return '#dcd300';
        } else if (this.signalStrength >= 40) {
            return '#00C121';
        }
    }

    get Bar3Color(): string {
        if (this.signalStrength === 0) {
            return '#abafb9';
        } else if (this.signalStrength >= 40) {
            return '#00C121';
        }
    }

    get Bar4Color(): string {
        if (this.signalStrength === 0) {
            return '#abafb9';
        } else if (this.signalStrength >= 60) {
            return '#00C121';
        }
    }

    get Bar5Color(): string {
        if (this.signalStrength === 0) {
            return '#abafb9';
        } else if (this.signalStrength >= 80) {
            return '#00C121';
        }
    }

    get MainIconColor(): string {
        if (this.signalStrength === 0) {
            return '#abafb9';
        } else if (this.signalStrength >= 1 && this.signalStrength < 20) {
            return '#ea0707';
        } else if (this.signalStrength >= 20 && this.signalStrength < 40) {
            return '#dcd300';
        } else if (this.signalStrength >= 40) {
            return '#00C121';
        }
    }

    // Constructor
    static $inject: Array<string> = [
        '$scope'
    ];
    constructor(public bindings: IRcStatusIcon) {
        // TODO: Check flight controller type and show appropriate icon
    }

}

export default angular.module('DroneSense.Web.RcStatusIcon', [
]).component('dsRcStatusIcon', {
    bindings: {
        signalStrength: '<'
    },
    controller: RcStatusIcon,
    templateUrl: './app/components/rcStatusIcon/rcStatusIcon.html'
});
