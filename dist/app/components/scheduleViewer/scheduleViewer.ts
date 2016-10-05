
export interface IScheduleViewer extends ng.IScope {
}

class ScheduleViewer {

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state'
    ];

    constructor(
        public bindings: IScheduleViewer,
        public stateService: angular.ui.IStateService) {
            
        console.log('schedules constructor');
    }

}

export default angular.module('DroneSense.Web.ScheduleViewer', [

]).component('dsScheduleViewer', {
    bindings: {
    },
    controller: ScheduleViewer,
    templateUrl: './app/components/scheduleViewer/ScheduleViewer.html'
});
