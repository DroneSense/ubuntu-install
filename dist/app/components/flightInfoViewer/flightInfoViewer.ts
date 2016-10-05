import { FlightPlan } from '@dronesense/model';
import WeatherViewer from '../weatherViewer/weatherViewer';

export interface IFlightInfoViewer extends ng.IScope {

}

class FlightInfoViewer {

    map: Cesium.Viewer;

    flightPlan: FlightPlan;

    // Constructor
    static $inject: Array<string> = [
        '$scope',
    ];
    constructor(bindings: IFlightInfoViewer) {

    }

}

export default angular.module('DroneSense.Web.FlightInfoViewer', [
    WeatherViewer.name
]).component('dsFlightInfoViewer', {
    bindings: {
        map: '<',
        uiStateService: '=',
        flightPlan: '<'
    },
    controller: FlightInfoViewer,
    templateUrl: './app/components/flightInfoViewer/flightInfoViewer.html'
}).filter('percentage', ['$filter', ($filter: any) => {
        return (input: number, decimals: number) => {
            return $filter('number')(input * 100, decimals) + '%';
        };
}]);

