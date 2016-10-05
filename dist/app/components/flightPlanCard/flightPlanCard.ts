import UserAvatar from '../userAvatar/userAvatar';
import { FlightPlan } from '@dronesense/model';

export interface IFlightPlanCard extends ng.IScope {
}

class FlightPlanCard {

    flightPlan: FlightPlan;

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state',
        '$mdDialog',
        'db'
    ];

    constructor(public bindings: IFlightPlanCard,
                public stateService: angular.ui.IStateService,
                public mdDialog: ng.material.MDDialogService,
                public db: any) {

    }

    $onInit(): void {
        
        // Listen for flight plan changes
        this.flightPlan.on('propertyChanged', (property: string, value: any) => {
            this.bindings.$applyAsync();
        });
    }

    $onDestroy(): void {
        // Un-wire flight plan change listener
        this.flightPlan.off();
    }

    showFlightPlanCard(id: string): void {
        this.mdDialog.show({
            template: '<ds-flight-plan-card-detail flight-plan="$ctrl.flightPlan"></ds-flight-plan-card-detail>',
            scope: this.bindings,
            preserveScope: true,
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            escapeToClose: true
        });

    }

    fly(): void {
        this.stateService.go('control');
    }

}

export default angular.module('DroneSense.Web.FlightPlanCard', [
    UserAvatar.name
]).component('dsFlightPlanCard', {
    bindings: {
        flightPlan: '<'
    },
    controller: FlightPlanCard,
    templateUrl: './app/components/flightPlanCard/FlightPlanCard.html'
});
