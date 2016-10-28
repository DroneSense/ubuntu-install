import { FlightControlSettings } from '../flightControlViewer/flightControlSettings';
import { SessionController } from '../flightControlViewer/sessionController';
import { MapSession } from '../flightControlViewer/mapSession';
import  VideoFeed from './videoFeed';

export interface IMultiVideoPlayer extends ng.IScope {

}

class feed {

    showing: boolean = true;

    constructor(public name: string, public ip: string) {

    }
}

class MultiVideoPlayer {

    // Server settings
    settings: FlightControlSettings;

    sessionController: SessionController;

    // Callback to exit full screen
    onExitFullScreen: () => {};
    
    // Callback to enter full screen
    onFullScreen: () => {};

    // Object to manage video feeds
    videoFeeds: Array<feed> = [];

    // Flag to track if map is visible
    showMap: boolean = true;

    // Flag to track if we are showing a video
    showingVideo: boolean = false;

    isCordova: boolean = false;

    playerWidth: string = '469px';
    playerHeight: string = '264px';
    top: string = '115px';
    right: string = '64px';
    zindex: string = '0';

    // Constructor
    static $inject: Array<string> = [
        '$scope'
    ];
    constructor(public bindings: IMultiVideoPlayer) {
        
    }

    $onInit(): void {

        /* !web-start */

        // Wire up session added event so we can create a video feed for it
        this.sessionController.eventing.on('session-added', (session: MapSession) => {
            
            // Create video feed
            this.videoFeeds.push(new feed(session.name, this.settings.localVideoServerIP));

            // Switch active video feed
            for (var index: number = 0; index < this.videoFeeds.length; index++) {
                var f: feed = this.videoFeeds[index];
                
                if (f.name === session.name) {
                    f.showing = true;
                } else {
                    f.showing = false;
                }
            }
            
        });

        this.sessionController.eventing.on('session-changed', (session: MapSession) => {
            
            // Switch active video feed
            for (var index: number = 0; index < this.videoFeeds.length; index++) {
                var feed: feed = this.videoFeeds[index];
                
                if (feed.name === session.name) {
                    feed.showing = true;
                } else {
                    feed.showing = false;
                }
            }
        });

        /* !web-stop */

        /* !cordova-start */
        this.isCordova = true;
        /* !cordova-stop */

    }

    $onDestroy(): void {
        // Unwire events
        this.sessionController.eventing.off('session-added');
        this.sessionController.eventing.off('session-changed');
    }

    showVideo(): void {
        
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
                //this.player.stop();
                this.showingVideo = false;
                /* !web-stop */

                return;
            }

            // Check if 
            if (this.showingVideo) {
                this.showingVideo = false;

                /* !web-start */
                //this.player.stop();
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
                //this.player.play();
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

export default angular.module('DroneSense.Web.MultiVideoPlayer', [
    VideoFeed.name
]).component('dsMultiVideoPlayer', {
    bindings: {
        onFullScreen: '&',
        onExitFullScreen: '&',
        settings: '<',
        sessionName: '<',
        sessionController: '<'
    },
    controller: MultiVideoPlayer,
    templateUrl: './app/components/multiVideoPlayer/multiVideoPlayer.html'
});
