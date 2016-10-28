import { FlightPlan, Account, User, Tag } from '@dronesense/model';
import { IDataService } from '../../services/dataService';

export interface IFlightPlanCardDetail extends ng.IScope {
}

class FlightPlanCardDetail {

    flightInfo: boolean = true;

    flightPlan: FlightPlan;

    account: Account;

    owners: Array<User> = [];

    tags: Array<Tag>;

    editNotes: boolean = false;

    tagSearchText: string;

    tagSelectedSearch: any;

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state',
        'dataService'
    ];

    constructor(public bindings: IFlightPlanCardDetail,
                public stateService: angular.ui.IStateService,
                public dataService: IDataService) {
            // TODO: retrieve flight plan from dataService

            // Check to see if a flight plan has been passed in, 
            // else load it from dataService
            if (!this.flightPlan) {
                //this.flightPlan = this.dataService.getFlightPlan(id);
            }

            this.dataService.getAccountFlightPlanTags().then((tags: Array<Tag>): void => {
                this.tags = tags;
            });

            this.dataService.getCurrentAccount().then((account: Account): void => {
                this.account = account;


            });
    }

    tagSearch(text: string): void {
      let results: any = text ? this.tags.filter(this.createFilterFor(text)) : [];
      return results;
    }

    createFilterFor(text: string): any {
      var lowercaseQuery: string = angular.lowercase(text);

      return function filterFn(tag: Tag): boolean {
        return (tag.Name.toLowerCase().indexOf(lowercaseQuery) === 0);
      };

    }

    close(): void {

    }

    fly(): void {
        this.stateService.go('control');
    }

    plan(): void {
        this.stateService.go('flightplan');
    }

}

export default angular.module('DroneSense.Web.FlightPlanCardDetail', [

]).component('dsFlightPlanCardDetail', {
    bindings: {
        flightPlan: '<'
    },
    controller: FlightPlanCardDetail,
    templateUrl: './app/components/flightPlanCardDetail/flightPlanCardDetail.html'
});
