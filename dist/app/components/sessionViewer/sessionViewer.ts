import { IRedProService, RedProStream } from '../../services/redProService';
import RedProService from '../../services/redProService';
import { FlightPlan, User, Tag } from '@dronesense/model';
import viewerToolbar from '../viewerToolbar/viewerToolbar';
import SessionCard from '../sessionCard/sessionCard';

export interface ISessionViewer extends ng.IScope {
}

class SessionViewer {

    activeSessions: Array<RedProStream> = [];

    redTeam: RedProStream;
    blueTeam: RedProStream;

    gridVisible: boolean;

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

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        'redProService'
    ];

    constructor(
        public bindings: ISessionViewer,
        public redProService: IRedProService) {
        
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

        this.redTeam = new RedProStream('Red-Team');
        this.redTeam.name = 'Red Team';
        this.redTeam.color = '#ea0707';

        this.blueTeam = new RedProStream('Blue-Team');
        this.blueTeam.name = 'Blue Team';
        this.blueTeam.color = '#0A92EA';

        this.activeSessions.push(this.blueTeam);
        this.activeSessions.push(this.redTeam);
    }

    $onInit(): void {
        // this.redProService.getLiveStreams().then((value: Array<RedProStream>) => {
        //     this.activeSessions = value;
        //     this.activeSessions.forEach((stream: RedProStream) => {
        //         this.redProService.getLiveStreamStatistics(stream).then(() => {
        //             console.log(stream);
        //         });
        //     });
        // });

        

    }

    showListView(): void {
        this.gridVisible = false;
    }

    showGridView(): void {
        this.gridVisible = true;
    }
}

export default angular.module('DroneSense.Web.SessionViewer', [
    RedProService.name,
    viewerToolbar.name,
    SessionCard.name
]).component('dsSessionViewer', {
    bindings: {
    },
    controller: SessionViewer,
    templateUrl: './app/components/sessionViewer/sessionViewer.html'
});
