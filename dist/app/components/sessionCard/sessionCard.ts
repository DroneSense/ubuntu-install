import UserAvatar from '../userAvatar/userAvatar';
import { RedProStream } from '../../services/redProService';

export interface ISessionCard extends ng.IScope {
}

class SessionCard {

    session: RedProStream;

    videoViewer: any;

    subscriber: any;

    player: any;

    playerWidth: string = '469px';
    playerHeight: string = '264px';
    top: string = '115px';
    right: string = '64px';
    zindex: string = '0';

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state',
        '$mdDialog',
        'db'
    ];

    constructor(public bindings: ISessionCard,
                public stateService: angular.ui.IStateService,
                public mdDialog: ng.material.MDDialogService,
                public db: any) {

    }

    $onInit(): void {
        // try {

        //     /* !web-start */
        //     // Create a view instance based on video element id.
        //     this.videoViewer = new red5prosdk.PlaybackView('red5pro-video');

        //     // Create a new instance of the Flash/RTMP subcriber.
        //     this.subscriber = new red5prosdk.RTMPSubscriber();
        //     // Attach the subscriber to the view.
        //     this.videoViewer.attachSubscriber(this.subscriber);

        //     // Initialize
        //     this.subscriber.init({
        //         protocol: 'rtmp',
        //         host: '192.168.0.115',
        //         port: 1935,
        //         app: 'live',
        //         //context: 'room1',
        //         streamName: this.session.publish_name.replace(' ', '-'),
        //         mimeType: 'rtmp/flv',
        //         swf: 'node_modules/red5pro-video-js.swf',
        //         useVideoJS: true
        //     })
        //     .then((player: any) => {
        //         // `player` is the WebRTC Player instance.
        //         // Invoke the play action.
        //         //player.play();
        //         this.player = player;
        //     })
        //     .catch((error: any) => {
        //         // A fault occurred while trying to initialize and playback the stream.
        //         console.error(error);
        //     });
        //     /* !web-stop */

        // } catch (error) {
        //     console.log(error);
        // }
    }

    $onDestroy(): void {

    }

    showPreview(): void {
        try {

            this.player.play();

        } catch (error) {
            console.log(error);
        }
    }

    showVideo(): void {
        window.open('http://afd.dronesense.com/#/video?name=' + this.session.publish_name + '&buffer=10');
        //window.open('http://www.google.com');
    }
}

export default angular.module('DroneSense.Web.SessionCard', [
    UserAvatar.name
]).component('dsSessionCard', {
    bindings: {
        session: '<'
    },
    controller: SessionCard,
    templateUrl: './app/components/sessionCard/sessionCard.html'
});
