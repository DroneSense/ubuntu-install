System.register(['../userAvatar/userAvatar'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var userAvatar_1;
    var SessionCard;
    return {
        setters:[
            function (userAvatar_1_1) {
                userAvatar_1 = userAvatar_1_1;
            }],
        execute: function() {
            SessionCard = (function () {
                function SessionCard(bindings, stateService, mdDialog, db) {
                    this.bindings = bindings;
                    this.stateService = stateService;
                    this.mdDialog = mdDialog;
                    this.db = db;
                    this.playerWidth = '469px';
                    this.playerHeight = '264px';
                    this.top = '115px';
                    this.right = '64px';
                    this.zindex = '0';
                }
                SessionCard.prototype.$onInit = function () {
                    var _this = this;
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
                            host: '192.168.0.115',
                            port: 1935,
                            app: 'live',
                            //context: 'room1',
                            streamName: this.session.publish_name.replace(' ', '-'),
                            mimeType: 'rtmp/flv',
                            swf: 'node_modules/red5pro-video-js.swf',
                            useVideoJS: true
                        })
                            .then(function (player) {
                            // `player` is the WebRTC Player instance.
                            // Invoke the play action.
                            //player.play();
                            _this.player = player;
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
                SessionCard.prototype.$onDestroy = function () {
                };
                SessionCard.prototype.showPreview = function () {
                    try {
                        this.player.play();
                    }
                    catch (error) {
                        console.log(error);
                    }
                };
                SessionCard.prototype.showVideo = function () {
                    window.open('http://192.168.0.115:5080/live/flash.jsp?host=192.168.0.115&stream=' + this.session.publish_name);
                };
                // Constructor
                SessionCard.$inject = [
                    '$scope',
                    '$state',
                    '$mdDialog',
                    'db'
                ];
                return SessionCard;
            }());
            exports_1("default",angular.module('DroneSense.Web.SessionCard', [
                userAvatar_1.default.name
            ]).component('dsSessionCard', {
                bindings: {
                    session: '<'
                },
                controller: SessionCard,
                templateUrl: './app/components/sessionCard/sessionCard.html'
            }));
        }
    }
});

//# sourceMappingURL=sessionCard.js.map
