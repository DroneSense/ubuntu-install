export interface IDashboardViewer extends ng.IScope {
}

class DashboardViewer {

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state'
    ];

    constructor(
        public bindings: IDashboardViewer,
        public stateService: angular.ui.IStateService) {
            
    }

}

export default angular.module('DroneSense.Web.DashboardViewer', [

]).component('dsDashboardViewer', {
    bindings: {
    },
    controller: DashboardViewer,
    templateUrl: './app/components/dashboardViewer/dashboardViewer.html'
});
