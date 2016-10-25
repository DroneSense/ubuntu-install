import pilotCard from '../pilotCard/pilotCard';

export interface IPilotViewer extends ng.IScope {
}

class PilotViewer {

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state'
    ];

    constructor(
        public bindings: IPilotViewer,
        public stateService: angular.ui.IStateService) {
            
    }

}

export default angular.module('DroneSense.Web.PilotViewer', [
    pilotCard.name
]).component('dsPilotViewer', {
    bindings: {
    },
    controller: PilotViewer,
    templateUrl: './app/components/pilotViewer/pilotViewer.html'
});
