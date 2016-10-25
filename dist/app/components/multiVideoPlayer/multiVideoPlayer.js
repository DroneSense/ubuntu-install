System.register(['./videoFeed'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var videoFeed_1;
    var feed, MultiVideoPlayer;
    return {
        setters:[
            function (videoFeed_1_1) {
                videoFeed_1 = videoFeed_1_1;
            }],
        execute: function() {
            feed = (function () {
                function feed(name, ip) {
                    this.name = name;
                    this.ip = ip;
                    this.showing = true;
                }
                return feed;
            }());
            MultiVideoPlayer = (function () {
                function MultiVideoPlayer(bindings) {
                    this.bindings = bindings;
                    // Object to manage video feeds
                    this.videoFeeds = [];
                    // Flag to track if map is visible
                    this.showMap = true;
                    // Flag to track if we are showing a video
                    this.showingVideo = false;
                    this.playerWidth = '469px';
                    this.playerHeight = '264px';
                    this.top = '115px';
                    this.right = '64px';
                    this.zindex = '0';
                }
                MultiVideoPlayer.prototype.$onInit = function () {
                    /* !web-start */
                    var _this = this;
                    // Wire up session added event so we can create a video feed for it
                    this.sessionController.eventing.on('session-added', function (session) {
                        // Create video feed
                        _this.videoFeeds.push(new feed(session.name, _this.settings.localVideoServerIP));
                        // Switch active video feed
                        for (var index = 0; index < _this.videoFeeds.length; index++) {
                            var f = _this.videoFeeds[index];
                            if (f.name === session.name) {
                                f.showing = true;
                            }
                            else {
                                f.showing = false;
                            }
                        }
                    });
                    this.sessionController.eventing.on('session-changed', function (session) {
                        // Switch active video feed
                        for (var index = 0; index < _this.videoFeeds.length; index++) {
                            var feed = _this.videoFeeds[index];
                            if (feed.name === session.name) {
                                feed.showing = true;
                            }
                            else {
                                feed.showing = false;
                            }
                        }
                    });
                    /* !web-stop */
                };
                MultiVideoPlayer.prototype.$onDestroy = function () {
                    // Unwire events
                    this.sessionController.eventing.off('session-added');
                    this.sessionController.eventing.off('session-changed');
                };
                MultiVideoPlayer.prototype.showVideo = function () {
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
                            //this.player.stop();
                            this.showingVideo = false;
                            /* !web-stop */
                            return;
                        }
                        // Check if 
                        if (this.showingVideo) {
                            this.showingVideo = false;
                        }
                        else {
                            this.showingVideo = true;
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                };
                MultiVideoPlayer.prototype.showFullScreen = function () {
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
                MultiVideoPlayer.$inject = [
                    '$scope'
                ];
                return MultiVideoPlayer;
            }());
            exports_1("default",angular.module('DroneSense.Web.MultiVideoPlayer', [
                videoFeed_1.default.name
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
            }));
        }
    }
});

//# sourceMappingURL=multiVideoPlayer.js.map
