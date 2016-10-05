import modelCard from '../modelCard/modelCard';
import modelCardDetail from '../modelCardDetail/modelCardDetail';

export interface IModelViewer extends ng.IScope {
}

class ModelViewer {

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state',
        '$mdDialog'
    ];

    constructor(
        public bindings: IModelViewer,
        public stateService: angular.ui.IStateService,
        public mdDialog: ng.material.MDDialogService) {
            
        console.log('3d Models constructor called ' + stateService.params['id']);

        if (stateService.params['id']) {
            this.showModelCard(stateService.params['id']);
        }
    }

    showModelCard(id: string): void {
        this.mdDialog.show({
            template: '<ds-model-card-detail></ds-model-card-detail>',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            escapeToClose: true
        });
    }

}

export default angular.module('DroneSense.Web.ModelViewer', [
    modelCard.name,
    modelCardDetail.name
]).component('dsModelViewer', {
    bindings: {
    },
    controller: ModelViewer,
    templateUrl: './app/components/modelViewer/modelViewer.html'
});

