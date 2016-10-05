import userAvatar from '../userAvatar/userAvatar';
import { IDataService } from '../../services/dataService';
import { User } from '@dronesense/model';
import { CommonData } from '../../services/commonData';

export interface IProfileViewer extends ng.IScope {
}

class ProfileViewer {

    user: User;

    states: any = CommonData.states;

    countries: any = CommonData.countries;

    timezones: any = CommonData.timezones;

    units: any = CommonData.unitTypes;

    coordinates: any = CommonData.coordinateTypes;

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state',
        'dataService'
    ];

    constructor(
        public bindings: IProfileViewer,
        public stateService: angular.ui.IStateService,
        public dataService: IDataService) {

        this.dataService.getUser().then((user: User) => {
            this.user = user;
        });
    }

}

export default angular.module('DroneSense.Web.ProfileViewer', [
    userAvatar.name
]).component('dsProfileViewer', {
    bindings: {
    },
    controller: ProfileViewer,
    templateUrl: './app/components/profileViewer/profileViewer.html'
});
