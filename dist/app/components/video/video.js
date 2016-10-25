System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Video;
    return {
        setters:[],
        execute: function() {
            Video = (function () {
                function Video(bindings, stateService) {
                    this.bindings = bindings;
                    this.stateService = stateService;
                    this.playerWidth = '469px';
                    this.playerHeight = '264px';
                    this.top = '115px';
                    this.right = '64px';
                    this.zindex = '0';
                    this.ip = '127.0.0.1';
                    this.port = '1935';
                    this.buffer = 0;
                    if (stateService.params['ip']) {
                        this.ip = stateService.params['ip'];
                    }
                    if (stateService.params['port']) {
                        this.port = stateService.params['port'];
                    }
                    if (stateService.params['name']) {
                        this.streamName = stateService.params['name'];
                    }
                    if (stateService.params['buffer']) {
                        this.buffer = stateService.params['buffer'];
                    }
                }
                Video.prototype.$onInit = function () {
                    try {
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
                            host: this.ip,
                            port: this.port,
                            app: 'live',
                            streamName: this.streamName.replace(' ', '-'),
                            mimeType: 'rtmp/flv',
                            //swf: 'node_modules/red5pro-video-js.swf',
                            useVideoJS: false,
                            //swfobjectURL: 'node_modules/swfobject.js',
                            width: '100%',
                            height: '100%',
                            swf: 'node_modules/red5pro-subscriber.swf',
                            swfobjectURL: 'node_modules/swfobject.js',
                            buffer: this.buffer
                        })
                            .then(function (player) {
                            // `player` is the WebRTC Player instance.
                            // Invoke the play action.
                            player.play();
                            //this.player = player;
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
                Video.prototype.$onDestroy = function () {
                };
                // Constructor
                Video.$inject = [
                    '$scope',
                    '$state'
                ];
                return Video;
            }());
            exports_1("default",angular.module('DroneSense.Web.Video', []).component('dsVideo', {
                bindings: {},
                controller: Video,
                templateUrl: './app/components/video/video.html'
            }));
        }
    }
});

//# sourceMappingURL=video.js.map
