export interface IVideoFeed extends ng.IScope {

}

class VideoFeed {

    videoFeedInitialized: boolean = false;

    videoControls: any;

    subscriber: any;

    videoViewer: any;

    name: string;

    ip: string;

    // Constructor
    static $inject: Array<string> = [
        '$scope'
    ];
    constructor(public bindings: IVideoFeed) {

    }

    $onInit(): void {
        /* !web-start */
        this.initializePlayer();
        /* !web-stop */
    }

    initializePlayer(): void {
        try {

            // Create a view instance based on video element id.
            this.videoViewer = new red5prosdk.PlaybackView('red5pro-video');

            // Create a new instance of the Flash/RTMP subcriber.
            this.subscriber = new red5prosdk.RTMPSubscriber();
            // Attach the subscriber to the view.
            this.videoViewer.attachSubscriber(this.subscriber);

            // Initialize
            this.subscriber.init({
                protocol: 'rtmp',
                host: this.ip,
                port: 1935,
                app: 'live',
                streamName: this.name.replace(' ', '-'),
                mimeType: 'rtmp/flv',
                useVideoJS: false,
                buffer: 0.2,
                swf: 'node_modules/red5pro-subscriber.swf',
                swfobjectURL: 'node_modules/swfobject.js',
                width: '100%',
                height: '100%'

            })
            .then((videoControls: any) => {

                this.videoControls = videoControls;
                this.videoControls.play();
            })
            .catch((error: any) => {
                // A fault occurred while trying to initialize and playback the stream.
                console.error(error);
            });

        } catch (error) {
            console.log(error);
        }
    }

}

export default angular.module('DroneSense.Web.VideoFeed', [

]).component('dsVideoFeed', {
    bindings: {
        name: '<',
        ip: '<'
    },
    controller: VideoFeed,
    templateUrl: './app/components/multiVideoPlayer/videoFeed.html'
});
