import { FlightControlSettings } from '../flightControlViewer/flightControlSettings';

export interface IVideoPlayer extends ng.IScope {

}

class VideoPlayer {

    videoViewer: any;

    subscriber: any;

    showingVideo: boolean = false;

    showMap: boolean = true;

    playerInitialized: boolean = false;

    playerWidth: string = '469px';
    playerHeight: string = '264px';
    top: string = '115px';
    right: string = '64px';
    zindex: string = '0';

    onExitFullScreen: () => {};
    onFullScreen: () => {};

    settings: FlightControlSettings;

    sessionName: string;

    // Constructor
    static $inject: Array<string> = [
        '$scope'
    ];
    constructor(public bindings: IVideoPlayer) {

    }

    $onInit(): void {
        /* !web-start */
        this.initializePlayer();
        /* !web-stop */
    }

    initializePlayer(): void {
        try {

            if (this.playerInitialized) {
                return;
            }

            /* !web-start */
            // Create a view instance based on video element id.
            this.videoViewer = new red5prosdk.PlaybackView('red5pro-video');

            // Create a new instance of the Flash/RTMP subcriber.
            this.subscriber = new red5prosdk.RTMPSubscriber();
            // Attach the subscriber to the view.
            this.videoViewer.attachSubscriber(this.subscriber);

            // Initialize
            this.subscriber.init({
                protocol: 'rtmp',
                host: this.settings.localVideoServerIP,
                port: 1935,
                app: 'live',
                //context: 'room1',
                streamName: this.sessionName.replace(' ', '-'),
                mimeType: 'rtmp/flv',
                swf: 'node_modules/red5pro-video-js.swf',
                useVideoJS: true
                //swf: 'node_modules/red5pro-subscriber.swf',
                //swfobjectURL: 'node_modules/swfobject.js'
            })
            .then((player: any) => {
                // `player` is the WebRTC Player instance.
                // Invoke the play action.
                // player.play();
                this.player = player;

                this.playerInitialized = true;
            })
            .catch((error: any) => {
                // A fault occurred while trying to initialize and playback the stream.
                console.error(error);
            });
            /* !web-stop */

        } catch (error) {
            console.log(error);
        }
    }

    player: any;

    showVideoPreview(): void {

        try {

            // check if in full screen mode by looking at map visibility flag
            if (!this.showMap) {
                this.showMap = true;

                /* !cordova-start */
                dronesense.bridgeManager.hideVideoView();
                this.onExitFullScreen();
                /* !cordova-stop */

                /* !web-start */
                this.playerWidth = '469px';
                this.playerHeight = '264px';
                this.right = '64px';
                this.top = '115px';
                this.zindex = '0';
                this.onExitFullScreen();
                this.player.stop();
                this.showingVideo = false;
                /* !web-stop */

                return;
            }

            // Check if 
            if (this.showingVideo) {
                this.showingVideo = false;

                /* !web-start */
                this.player.stop();
                /* !web-stop */

                /* !cordova-start */
                dronesense.bridgeManager.hideVideoView();
                /* !cordova-stop */

            } else {
                this.showingVideo = true;

                /* !cordova-start */
                // Left, Top, Width, Height
                dronesense.bridgeManager.setVideoViewSmall(660, 115, 300, 168);
                /* !cordova-stop */

                /* !web-start */
                this.player.play();
                /* !web-stop */
            }

        } catch (error) {
            console.log(error);
        }

    }

    showFullScreen(): void {
        
        try {

            /* !cordova-start */
            dronesense.bridgeManager.setVideoViewFull();
            
            this.showMap = false;

            this.showingVideo = false;

            this.onFullScreen();
            /* !cordova-stop */

            /* !web-start */
            this.playerWidth = '100%';
            this.playerHeight = '100%';
            this.right = '0px';
            this.top = '0px';
            this.zindex = '-1';
            this.onFullScreen();
            this.showMap = false;
            /* !web-stop */
        
        } catch (error) {
            console.log(error);
        }
    }

}

export default angular.module('DroneSense.Web.VideoPlayer', [

]).component('dsVideoPlayer', {
    bindings: {
        onFullScreen: '&',
        onExitFullScreen: '&',
        settings: '<',
        sessionName: '<'
    },
    controller: VideoPlayer,
    templateUrl: './app/components/videoPlayer/videoPlayer.html'
});
