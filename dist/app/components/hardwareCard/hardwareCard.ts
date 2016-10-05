
export interface IHardwareCard extends ng.IScope {
}

class HardwareCard {

    testChipNames: Array<string> = ['DJI Phantom 3'];

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state',
        '$mdDialog'
    ];

    constructor(
        public bindings: IHardwareCard,
        public stateService: angular.ui.IStateService,
        public mdDialog: ng.material.MDDialogService) {
    }

    showHardwareCard(id: string): void {
        this.mdDialog.show({
            template: '<ds-hardware-card-detail></ds-hardware-card-detail>',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            escapeToClose: true
        });
    }

}

export default angular.module('DroneSense.Web.HardwareCard', [

]).component('dsHardwareCard', {
    bindings: {
    },
    controller: HardwareCard,
    templateUrl: './app/components/hardwareCard/HardwareCard.html'
});
