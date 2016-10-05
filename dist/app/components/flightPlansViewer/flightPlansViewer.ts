import flightPlanCard from '../flightPlanCard/flightPlanCard';
import flightPlanCardDetail from '../flightPlanCardDetail/flightPlanCardDetail';
import viewerToolbar from '../viewerToolbar/viewerToolbar';
import ngLazyShow from '../../common/ngLazyShow';
import { FlightPlan, User, Tag } from '@dronesense/model';
import _ from 'lodash';
import { IDataService } from '../../services/dataService';
import DataService from '../../services/dataService';

export interface IFlightPlansViewer extends ng.IScope {
}

class FlightPlansViewer {

    gridVisible: boolean;

    flightPlans: Array<FlightPlan> = [];

    searchText: string;

    masterTagList: Array<Tag> = [];

    filter: {tags: Array<Tag>, option: string } = {
        tags: [],
        option: ''
    };

    sort: {options: Array<string>, orderType: string, orderDirection: boolean} = {
        options: [],
        orderType: '',
        orderDirection: false
    };

    flightPlansHandle: any;


    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state',
        '$mdDialog',
        'dataService',
        'db'
    ];

    constructor(public bindings: IFlightPlansViewer,
                public stateService: angular.ui.IStateService,
                public mdDialog: ng.material.MDDialogService,
                public dataService: IDataService,
                public db: any) {

        if (stateService.params['id']) {
            this.showFlightPlanCard(stateService.params['id']);
        }

        // Make grid the default view
        this.gridVisible = true;

        // Define sort options to give the viewer toolbar
        this.sort.options.push('Name: A-Z');
        this.sort.options.push('Name: Z-A');
        this.sort.options.push('Location: A-Z');
        this.sort.options.push('Location: Z-A');
        this.sort.options.push('Created: Newest');
        this.sort.options.push('Created: Oldest');
        this.sort.options.push('Scheduled: Newest');
        this.sort.options.push('Scheduled: Oldest');

        // Set default view sort order
        this.sort.orderType = 'Created';
        this.sort.orderDirection = true;

        // Load the flight plans from data service
        this.dataService.getUserFlightPlans().then((flightPlans: Array<FlightPlan>): void => {
            this.flightPlans = flightPlans;

            this.bindings.$watchCollection<Array<FlightPlan>>('this.flightPlans', (newValue, oldValue): void => {
                this.bindings.$applyAsync();
            });
        });

        this.dataService.getAccountFlightPlanTags().then((tags: Array<Tag>) => {
            this.masterTagList = tags;
        });
    }

    showFlightPlanCard(id: string): void {
        this.mdDialog.show({
            template: '<ds-flight-plan-card-detail></ds-flight-plan-card-detail>',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            escapeToClose: true
        });
    }

    showListView(): void {
        this.gridVisible = false;
    }

    showGridView(): void {
        this.gridVisible = true;
    }

    addFlightPlan(): void {
        this.stateService.go('flightplan');
    }

    // Apply selected sort from viewer toolbar component
    sortSelected(sortItem: string): void {
        switch (sortItem) {
            case 'Name: A-Z':
                this.sort.orderType = 'Name';
                this.sort.orderDirection = false;
                break;
            case 'Name: Z-A':
                this.sort.orderType = 'Name';
                this.sort.orderDirection = true;
                break;
            case 'Location: A-Z':
                this.sort.orderType = 'Location';
                this.sort.orderDirection = false;
                break;
            case 'Location: Z-A':
                this.sort.orderType = 'Location';
                this.sort.orderDirection = true;
                break;
            case 'Created: Newest':
                this.sort.orderType = 'Created';
                this.sort.orderDirection = true;
                break;
            case 'Created: Oldest':
                this.sort.orderType = 'Created';
                this.sort.orderDirection = false;
                break;
            case 'Scheduled: Newest':
                this.sort.orderType = 'Scheduled';
                this.sort.orderDirection = true;
                break;
            case 'Scheduled: Oldest':
                this.sort.orderType = 'Scheduled';
                this.sort.orderDirection = false;
                break;
            default:
                this.sort.orderType = '';
                break;
        }

    }

    searchFlightPlans(search: string): void {
        this.searchText = search;
    }

    applyTagFilter(tags: Array<Tag>, option: string): void {
        this.filter.tags = tags;
        this.filter.option = option;
    }

    // TODO - Review this with tag array changes
    tagMatches(fp: FlightPlan): boolean {
        if (this.filter.tags.length === 0) {
            return true;
        } else {
            // This filter only looks for one tag match to include in results
            if (this.filter.option === 'any') {

                if (_.intersection(fp.Tags, this.filter.tags).length > 0) {
                    return true;
                } else {
                    return false;
                }
            // This filter makes sure that the FP contains all tags selected
            } else {
                if (_.without.apply(this, [this.filter.tags].concat(fp.Tags)).length === 0) {
                    return true;
                } else {
                    return false;
                }
            }
        }


    }

}

export default angular.module('DroneSense.Web.FlightPlansViewer', [
    flightPlanCard.name,
    flightPlanCardDetail.name,
    viewerToolbar.name,
    ngLazyShow.name,
    DataService.name
]).component('dsFlightPlansViewer', {
    bindings: {
    },
    controller: FlightPlansViewer,
    templateUrl: './app/components/flightPlansViewer/FlightPlansViewer.html'
});
