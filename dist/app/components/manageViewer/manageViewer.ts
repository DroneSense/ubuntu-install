import dashboard from '../dashboardViewer/dashboardViewer';

import lazyShow from '../../common/ngLazyShow';
import { User, Account } from '@dronesense/model';
import { IDataService } from '../../services/dataService';

export interface IManageViewer extends ng.IScope {
}

class ManageViewer {

    selectedTab: number;

    user: User;

    currentAccount: Account;

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state',
        'dataService'
    ];

    constructor(
        public bindings: IManageViewer,
        public stateService: angular.ui.IStateService,
        public dataService: IDataService) {
        
        this.setActiveTab();

        dataService.getUser().then((user: User) => {
            this.user = user;

            dataService.getCurrentAccount().then((account: Account) => {
                this.currentAccount = account;
            });

        }).catch((error): void => {
            console.log(error);
        });

        // this.user.ModelUpdated.on((): void => {
        //     this.bindings.$applyAsync();
        // });
    }

    // Set the active tab based on URL
    setActiveTab(): void {
        
        if (this.stateService.current.name === 'manage.flightplans') {
            this.selectedTab = 1;
        } else if (this.stateService.current.name === 'manage.hardware') {
            this.selectedTab = 2;
        } else if (this.stateService.current.name === 'manage.profile') {
            this.selectedTab = -1;
        } else if (this.stateService.current.name === 'manage.account') {
            this.selectedTab = -1;
        }
    }

    // Transition to new state defined in the app.ts file.
    goTo(state: string): void {
        this.stateService.go(state);
    }

    loadProfile(): void {
        console.log('load profile');
    }

    signOut(): void {
        this.dataService.logout();
        this.dataService.login();
    }

}

export default angular.module('DroneSense.Web.ManageViewer', [
    dashboard.name,
    lazyShow.name
]).component('dsManage', {
    bindings: {
    },
    controller: ManageViewer,
    templateUrl: './app/components/manageViewer/manageViewer.html'
});

