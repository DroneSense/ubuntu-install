System.register(['../../services/redProService', '../viewerToolbar/viewerToolbar', '../sessionCard/sessionCard'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var redProService_1, redProService_2, viewerToolbar_1, sessionCard_1;
    var SessionViewer;
    return {
        setters:[
            function (redProService_1_1) {
                redProService_1 = redProService_1_1;
                redProService_2 = redProService_1_1;
            },
            function (viewerToolbar_1_1) {
                viewerToolbar_1 = viewerToolbar_1_1;
            },
            function (sessionCard_1_1) {
                sessionCard_1 = sessionCard_1_1;
            }],
        execute: function() {
            SessionViewer = (function () {
                function SessionViewer(bindings, redProService) {
                    this.bindings = bindings;
                    this.redProService = redProService;
                    this.activeSessions = [];
                    this.masterTagList = [];
                    this.filter = {
                        tags: [],
                        option: ''
                    };
                    this.sort = {
                        options: [],
                        orderType: '',
                        orderDirection: false
                    };
                    // Make grid the default view
                    this.gridVisible = true;
                    // Define sort options to give the viewer toolbar
                    this.sort.options.push('Name: A-Z');
                    this.sort.options.push('Name: Z-A');
                    this.sort.options.push('Location: A-Z');
                    this.sort.options.push('Location: Z-A');
                    this.sort.options.push('Created: Newest');
                    this.sort.options.push('Created: Oldest');
                    this.sort.options.push('Scheduled: Newest');
                    this.sort.options.push('Scheduled: Oldest');
                    // Set default view sort order
                    this.sort.orderType = 'Created';
                    this.sort.orderDirection = true;
                    this.redTeam = new redProService_1.RedProStream('Red-Team');
                    this.redTeam.name = 'Red Team';
                    this.redTeam.color = '#ea0707';
                    this.blueTeam = new redProService_1.RedProStream('Blue-Team');
                    this.blueTeam.name = 'Blue Team';
                    this.blueTeam.color = '#0A92EA';
                    this.activeSessions.push(this.blueTeam);
                    this.activeSessions.push(this.redTeam);
                }
                SessionViewer.prototype.$onInit = function () {
                    // this.redProService.getLiveStreams().then((value: Array<RedProStream>) => {
                    //     this.activeSessions = value;
                    //     this.activeSessions.forEach((stream: RedProStream) => {
                    //         this.redProService.getLiveStreamStatistics(stream).then(() => {
                    //             console.log(stream);
                    //         });
                    //     });
                    // });
                };
                SessionViewer.prototype.showListView = function () {
                    this.gridVisible = false;
                };
                SessionViewer.prototype.showGridView = function () {
                    this.gridVisible = true;
                };
                // Constructor
                SessionViewer.$inject = [
                    '$scope',
                    'redProService'
                ];
                return SessionViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.SessionViewer', [
                redProService_2.default.name,
                viewerToolbar_1.default.name,
                sessionCard_1.default.name
            ]).component('dsSessionViewer', {
                bindings: {},
                controller: SessionViewer,
                templateUrl: './app/components/sessionViewer/sessionViewer.html'
            }));
        }
    }
});

//# sourceMappingURL=sessionViewer.js.map
