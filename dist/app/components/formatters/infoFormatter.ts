import { User } from '@dronesense/model';
import { Conversions } from '@dronesense/model/lib/common/Utility';

class InfoFormatter {

    user: User;
    label: string;
    value: number;
    format: string;

    unit: string;

    onEdit: any;

    static $inject: Array<string> = [
        '$scope'
    ];

    viewData: number;

    constructor(public bindings: ng.IScope) {

        this.viewData = this.value;

        this.bindings.$watch(() => {
            return this.value;
        }, (newValue: number, oldValue: number) => {

            this.setValues();

        });

        this.bindings.$watch(() => {
            return this.user.UnitPreference;
        }, (newValue: string, oldValue: string) => {

            this.setValues();
        });
    }

    setValues(): void {
        if (this.user.isMetric()) {

            this.viewData = Conversions.roundToTwo(this.value);

            if (this.format === 'elevation') {
                this.unit = 'meters';
            } else if (this.format === 'speed') {
                this.unit = 'm/s';
            }
        } else {

            this.viewData = Conversions.metersToFeet(this.value);

            if (this.format === 'elevation') {
                this.unit = 'feet';
            } else if (this.format === 'speed') {
                this.unit = 'ft/s';
            }
        }
    }
}

// Register component with Angular
export default angular.module('DroneSense.Web.InfoFormatter', []).component('dsInfoFormatter', {
    bindings: {
        user: '<',
        label: '@',
        value: '<',
        format: '@',
        canEdit: '@',
        onEdit: '&'
    },
    controller: InfoFormatter,
    templateUrl: './app/components/formatters/infoFormatter.html'
});

