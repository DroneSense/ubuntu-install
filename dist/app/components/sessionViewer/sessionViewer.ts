import { IRedProService, RedProStream } from '../../services/redProService';
import RedProService from '../../services/redProService';

export interface ISessionViewer extends ng.IScope {
}

class SessionViewer {

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        'redProService'
    ];

    constructor(
        public bindings: ISessionViewer,
        public redProService: IRedProService) {
        
    }

    $onInit(): void {
        this.redProService.getLiveStreams().then((value: Array<RedProStream>) => {
            value.forEach((stream: RedProStream) => {
                this.redProService.getLiveStreamStatistics(stream).then(() => {
                    console.log(stream);
                });
            });
        });
    }
}

export default angular.module('DroneSense.Web.SessionViewer', [
    RedProService.name
]).component('dsSessionViewer', {
    bindings: {
    },
    controller: SessionViewer,
    templateUrl: './app/components/sessionViewer/sessionViewer.html'
});
