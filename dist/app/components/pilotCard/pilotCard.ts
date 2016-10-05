
export interface IPilotCard extends ng.IScope {
}

class PilotCard {

    testChipNames: Array<string> = ['Owner', 'Pilot'];

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state',
        '$mdDialog'
    ];

    constructor(
        public bindings: IPilotCard,
        public stateService: angular.ui.IStateService,
        public mdDialog: ng.material.MDDialogService) {
    }

    showPilotCard(id: string): void {
        this.mdDialog.show({
            template: '<ds-pilot-card-detail></ds-pilot-plan-card-detail>',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            escapeToClose: true
        });
    }

}

export default angular.module('DroneSense.Web.PilotCard', [

]).component('dsPilotCard', {
    bindings: {
    },
    controller: PilotCard,
    templateUrl: './app/components/pilotCard/pilotCard.html'
});
