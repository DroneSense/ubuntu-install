import { IDataService } from '../../services/dataService';
import { Account, Address } from '@dronesense/model';
import { CommonData } from '../../services/commonData';

export interface IAccountViewer extends ng.IScope {
}

class AccountViewer {

    account: Account;

    useMailForBill: boolean = false;

    countries: any = CommonData.countries;

    states: any = CommonData.states;

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state',
        'dataService'
    ];

    constructor(
        public bindings: IAccountViewer,
        public stateService: angular.ui.IStateService,
        public dataService: IDataService) {

        dataService.getCurrentAccount().then((account: Account) => {
            this.account = account;
        });
    }

    setOrClearMailToBill(): void {
        if (this.useMailForBill) {
            this.account.BillAddress = this.account.MailAddress;
        } else {
            this.account.BillAddress = new Address();
        }
    }

    test(value: string): void {
        console.log(value);
    }
}

export default angular.module('DroneSense.Web.AccountViewer', [

]).component('dsAccountViewer', {
    bindings: {
    },
    controller: AccountViewer,
    templateUrl: './app/components/accountViewer/accountViewer.html'
});
