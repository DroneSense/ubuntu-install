System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var VideoFeed;
    return {
        setters:[],
        execute: function() {
            VideoFeed = (function () {
                function VideoFeed(bindings) {
                    this.bindings = bindings;
                    this.videoFeedInitialized = false;
                }
                VideoFeed.prototype.$onInit = function () {
                    /* !web-start */
                    this.initializePlayer();
                    /* !web-stop */
                };
                VideoFeed.prototype.initializePlayer = function () {
                    var _this = this;
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
                            .then(function (videoControls) {
                            _this.videoControls = videoControls;
                            _this.videoControls.play();
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
                // Constructor
                VideoFeed.$inject = [
                    '$scope'
                ];
                return VideoFeed;
            }());
            exports_1("default",angular.module('DroneSense.Web.VideoFeed', []).component('dsVideoFeed', {
                bindings: {
                    name: '<',
                    ip: '<'
                },
                controller: VideoFeed,
                templateUrl: './app/components/multiVideoPlayer/videoFeed.html'
            }));
        }
    }
});

//# sourceMappingURL=videoFeed.js.map
