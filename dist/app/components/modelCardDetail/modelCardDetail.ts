
export interface IModelCardDetail extends ng.IScope {
}

class ModelCardDetail {

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state',
        '$mdDialog'
    ];

    constructor(
        public bindings: IModelCardDetail,
        public stateService: angular.ui.IStateService,
        public mdDialog: ng.material.MDDialogService) {
            
        console.log('model plans constructor called ' + stateService.params['id']);
    }

}

export default angular.module('DroneSense.Web.ModelCardDetail', [

]).component('dsModelCardDetail', {
    bindings: {
    },
    controller: ModelCardDetail,
    templateUrl: './app/components/modelCardDetail/modelCardDetail.html'
});
