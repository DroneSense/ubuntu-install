
export interface IChecklistViewer extends ng.IScope {
}

class ChecklistViewer {

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state'
    ];

    constructor(
        public bindings: IChecklistViewer,
        public stateService: angular.ui.IStateService) {
            
    }

}

export default angular.module('DroneSense.Web.ChecklistViewer', [

]).component('dsChecklistViewer', {
    bindings: {
    },
    controller: ChecklistViewer,
    templateUrl: './app/components/checklistViewer/checklistViewer.html'
});
