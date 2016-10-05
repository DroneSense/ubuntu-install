
export interface IModelCard extends ng.IScope {
}

class ModelCard {

    testChipNames: Array<string> = ['Towers','London','Landmarks'];

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state',
        '$mdDialog'
    ];

    constructor(
        public bindings: IModelCard,
        public stateService: angular.ui.IStateService,
        public mdDialog: ng.material.MDDialogService) {
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

export default angular.module('DroneSense.Web.ModelCard', [

]).component('dsModelCard', {
    bindings: {
    },
    controller: ModelCard,
    templateUrl: './app/components/modelCard/modelCard.html'
});
