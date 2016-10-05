import { User } from '@dronesense/model';

export interface IUserService {
    CurrentUser: User;
    Logout(): void;
}

export interface IDSRootScope extends ng.IRootScopeService {
    isMetric: boolean;
}

class UserService {

    db: any;
    $state: angular.ui.IStateService;

    CurrentUser: User;

    static $inject: Array<string> = ['db', '$rootScope', '$state'];
    constructor(db: any, $rootScope: IDSRootScope, $state: angular.ui.IStateService) {

        this.db = db;
        this.$state = $state;

        this.CurrentUser = new User(db.session.handle.userHandle);

        this.CurrentUser.on('propertyChanged', (name: string, value: any): void => {

            if (this.CurrentUser && this.CurrentUser.UnitPreference && this.CurrentUser.UnitPreference.toLowerCase() === 'metric') {
                $rootScope.isMetric = true;
            } else {
                $rootScope.isMetric = false;
            }

            // emit broadcast to all rootScope.on
            $rootScope.$emit('unitPrefChanged', $rootScope.isMetric);

            $rootScope.$applyAsync();

        });

    }

    Logout(): void {
        this.db.session.logout();
        this.$state.go('login');
    }

}

export default angular.module('DroneSense.Web.UserService', [

]).service('userService', UserService);
