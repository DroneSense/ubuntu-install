System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var VideoPlayer;
    return {
        setters:[],
        execute: function() {
            VideoPlayer = (function () {
                function VideoPlayer(bindings) {
                    this.bindings = bindings;
                    this.showingVideo = false;
                    this.showMap = true;
                    this.playerInitialized = false;
                    this.playerWidth = '469px';
                    this.playerHeight = '264px';
                    this.top = '115px';
                    this.right = '64px';
                    this.zindex = '0';
                }
                VideoPlayer.prototype.$onInit = function () {
                    /* !web-start */
                    this.initializePlayer();
                    /* !web-stop */
                };
                VideoPlayer.prototype.initializePlayer = function () {
                    var _this = this;
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
                            //swf: 'node_modules/red5pro-video-js.swf',
                            useVideoJS: false,
                            buffer: 0.2,
                            swf: 'node_modules/red5pro-subscriber.swf',
                            swfobjectURL: 'node_modules/swfobject.js',
                            width: '100%',
                            height: '100%'
                        })
                            .then(function (player) {
                            // `player` is the WebRTC Player instance.
                            // Invoke the play action.
                            // player.play();
                            _this.player = player;
                            _this.playerInitialized = true;
                        })
                            .catch(function (error) {
                            // A fault occurred while trying to initialize and playback the stream.
                            console.error(error);
                        });
                    }
                    catch (error) {
                        console.log(error);
                    }
                };
                VideoPlayer.prototype.showVideoPreview = function () {
                    try {
                        // check if in full screen mode by looking at map visibility flag
                        if (!this.showMap) {
                            this.showMap = true;
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
                        }
                        else {
                            this.showingVideo = true;
                            /* !web-start */
                            this.player.play();
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                };
                VideoPlayer.prototype.showFullScreen = function () {
                    try {
                        /* !web-start */
                        this.playerWidth = '100%';
                        this.playerHeight = '100%';
                        this.right = '0px';
                        this.top = '0px';
                        this.zindex = '-1';
                        this.onFullScreen();
                        this.showMap = false;
                    }
                    catch (error) {
                        console.log(error);
                    }
                };
                // Constructor
                VideoPlayer.$inject = [
                    '$scope'
                ];
                return VideoPlayer;
            }());
            exports_1("default",angular.module('DroneSense.Web.VideoPlayer', []).component('dsVideoPlayer', {
                bindings: {
                    onFullScreen: '&',
                    onExitFullScreen: '&',
                    settings: '<',
                    sessionName: '<'
                },
                controller: VideoPlayer,
                templateUrl: './app/components/videoPlayer/videoPlayer.html'
            }));
        }
    }
});

//# sourceMappingURL=videoPlayer.js.map
