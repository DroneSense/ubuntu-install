import { User } from '@dronesense/model';

class UnitFormatter {

    user: User;
    format: string;

    unit: string;

    static $inject: Array<string> = [
        '$scope'
    ];

    constructor(public bindings: ng.IScope) {
        this.bindings.$watch(() => {
            return this.user.UnitPreference;
        }, (newValue: string, oldValue: string) => {

            if (this.user.isMetric()) {
                if (this.format === 'elevation') {
                    this.unit = 'meters';
                } else if (this.format === 'speed') {
                    this.unit = 'm/s';
                }
            } else {
                if (this.format === 'elevation') {
                    this.unit = 'feet';
                } else if (this.format === 'speed') {
                    this.unit = 'ft/s';
                }
            }
        });
    }
}

// Register component with Angular
export default angular.module('DroneSense.Web.UnitString', [

]).component('dsUnitString', {
    bindings: {
        user: '<',
        format: '@'
    },
    controller: UnitFormatter,
    template: ' <div class="input-unit">{{ $ctrl.unit }}</div>'
});
