import UserSettings from '../userSettings/userSettings';
// import User from '../../models/User';
import { User } from '@dronesense/model';
import KeyEnter from '../dsEnterKey/dsEnterKey';

export interface IAppBar extends ng.IScope {

}

class AppBar {

    user: User;

    // Class properties
    flightPlanNameFocus: boolean = false;

    flightPlanName: string;
    userInitials: string;
    userName: string;

    userSettingsVisible: boolean;

    // Constructor
    static $inject: Array<string> = [
        '$scope'
    ];
    constructor(bindings: IAppBar) {

    }

}

export default angular.module('DroneSense.Web.AppBar', [
    UserSettings.name,
    KeyEnter.name
]).component('dsAppBar', {
    bindings: {
        onExit: '&',
        mode: '@',
        onSaveFlightPlan: '&',
        flightPlanName: '@',
        flightPlanSaved: '<',
        userInitials: '@',
        userName: '@',
        userSettingsVisible: '<',
        onShowUserSettings: '&',
        user: '<'
    },
    controller: AppBar,
    templateUrl: './app/components/appbar/appbar.html'
});
