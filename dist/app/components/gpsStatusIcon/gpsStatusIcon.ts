
export interface IGpsStatusIcon extends ng.IScope {

}

class GpsStatusIcon {

    gpsLock: number = 0;

    // 0-1: no fix, 2: 2D fix, 3: 3D fix, 4: DGPS, 5: RTK

    get Bar1Color(): string {
        if (this.gpsLock === 0) {
            return '#abafb9';
        } else if (this.gpsLock > 2) {
            return '#00C121';
        } else if (this.gpsLock === 1 || this.gpsLock === 2) {
            return '#ea0707';
        }
    }

    get Bar2Color(): string {
        if (this.gpsLock === 0 || this.gpsLock === 1) {
            return '#abafb9';
        } else if (this.gpsLock > 2) {
            return '#00C121';
        } else if (this.gpsLock === 2) {
            return '#ea0707';
        }
    }

    get Bar3Color(): string {
        if (this.gpsLock > 2) {
            return '#00C121';
        } else {
            return '#abafb9';
        }
    }

    get Bar4Color(): string {
        if (this.gpsLock > 3) {
            return '#00C121';
        } else {
            return '#abafb9';
        }
    }

    get Bar5Color(): string {
        if (this.gpsLock > 4) {
            return '#00C121';
        } else {
            return '#abafb9';
        }
    }

    get MainIconColor(): string {
        if (this.gpsLock === 0) {
            return '#abafb9';
        } else if (this.gpsLock > 2) {
            return '#00C121';
        } else if (this.gpsLock === 1 || this.gpsLock === 2) {
            return '#ea0707';
        }
    }

    // Constructor
    static $inject: Array<string> = [
        '$scope'
    ];
    constructor(public bindings: IGpsStatusIcon) {

    }

}

export default angular.module('DroneSense.Web.GpsStatusIcon', [
]).component('dsGpsStatusIcon', {
    bindings: {
        gpsLock: '<'
    },
    controller: GpsStatusIcon,
    templateUrl: './app/components/gpsStatusIcon/gpsStatusIcon.html'
});
