import hardwareCard from '../hardwareCard/hardwareCard';
import hardwareCardDetail from '../hardwareCardDetail/hardwareCardDetail';

export interface IHardwareViewer extends ng.IScope {
}

class HardwareViewer {

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state',
        '$mdDialog'
    ];

    constructor(
        public bindings: IHardwareViewer,
        public stateService: angular.ui.IStateService,
        public mdDialog: ng.material.MDDialogService) {
            
        console.log('hardware constructor called ' + stateService.params['id']);

        if (stateService.params['id']) {
            this.showHardwareCard(stateService.params['id']);
        }
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

export default angular.module('DroneSense.Web.HardwareViewer', [
    hardwareCard.name,
    hardwareCardDetail.name
]).component('dsHardwareViewer', {
    bindings: {
    },
    controller: HardwareViewer,
    templateUrl: './app/components/hardwareViewer/hardwareViewer.html'
});

