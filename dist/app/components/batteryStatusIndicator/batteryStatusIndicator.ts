
export interface IBatteryStatusIndicator extends ng.IScope {

}

class BatteryStatusIndicator {

    // Green - #00C121
    // Yellow - #dcd300
    // Red - #ea0707
    // Default - #abafb9

    // If the battery percentage is between 0-25 then we will show
    // one bar and everything will be red.

    batteryPercentage: number = 0;

    timeRemaining: number = 0;

    get timeRemainingString(): string {
        let foo: Date = new Date(this.timeRemaining);        
        
        let hours: string = foo.getUTCHours().toString();
        let minutes: string = this.formatToDigits(foo.getUTCMinutes());
        let seconds: string = this.formatToDigits(foo.getUTCSeconds());

        return hours !== '0' ? hours + ':' + minutes + ':' + seconds : minutes + ':' + seconds;
    }

    formatToDigits(n: number): string {
        return n < 10 ? '0' + n.toString() : n.toString();
    }

    // Constructor
    static $inject: Array<string> = [
        '$scope'
    ];
    constructor(public bindings: IBatteryStatusIndicator) {

    }

}

export default angular.module('DroneSense.Web.BatteryStatusIndicator', [
]).component('dsBatteryStatusIndicator', {
    bindings: {
        batteryPercentage: '<',
        timeRemaining: '<'
    },
    controller: BatteryStatusIndicator,
    templateUrl: './app/components/batteryStatusIndicator/batteryStatusIndicator.html'
});
