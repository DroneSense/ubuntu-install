
export interface IHardwareCardDetail extends ng.IScope {
}

class HardwareCardDetail {

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state',
        '$mdDialog'
    ];

    constructor(
        public bindings: IHardwareCardDetail,
        public stateService: angular.ui.IStateService,
        public mdDialog: ng.material.MDDialogService) {
            
        console.log('hardware plans constructor called ' + stateService.params['id']);
    }

}

export default angular.module('DroneSense.Web.HardwareCardDetail', [

]).component('dsHardwareCardDetail', {
    bindings: {
    },
    controller: HardwareCardDetail,
    templateUrl: './app/components/hardwareCardDetail/hardwareCardDetail.html'
});
