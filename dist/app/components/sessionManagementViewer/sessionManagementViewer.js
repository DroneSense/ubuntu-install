System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SessionManagementViewer;
    return {
        setters:[],
        execute: function() {
            SessionManagementViewer = (function () {
                function SessionManagementViewer(bindings) {
                    this.bindings = bindings;
                    this.showSessionManagement = false;
                    this.currentSessionVisible = false;
                    this.guestSessionVisible = false;
                    this.chatVisible = false;
                    this.waypointCollab = false;
                    this.name = this.sessionController.activeSession.name;
                    this.server = this.sessionController.activeSession.serverConnection.ip + ':' + this.sessionController.activeSession.serverConnection.port;
                    this.color = this.sessionController.activeSession.color;
                    if (this.sessionController.ownerSession) {
                        this.ownerSession = this.sessionController.ownerSession;
                        this.currentSessionVisible = true;
                    }
                    else {
                        this.guestSessionVisible = true;
                    }
                    this.sessionController.eventing.on('session-added', function (session) {
                        //this.ownerSession = session;
                    });
                    // this.sessionController.eventing.on('session-changed', (session: MapSession) => {
                    // });
                }
                SessionManagementViewer.prototype.leaveSession = function (session) {
                    this.sessionController.removeGuestSession(session);
                };
                SessionManagementViewer.prototype.changeActiveSession = function (session) {
                    if (!this.ownerSession) {
                        this.sessionController.changeActiveSession(session);
                    }
                };
                SessionManagementViewer.prototype.endSession = function () {
                    this.sessionController.activeSession.session.endSession();
                };
                // Constructor
                SessionManagementViewer.$inject = [
                    '$scope'
                ];
                return SessionManagementViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.SessionManagementViewer', []).component('dsSessionManagementViewer', {
                bindings: {
                    sessionController: '<',
                    onJoinSession: '&'
                },
                controller: SessionManagementViewer,
                templateUrl: './app/components/sessionManagementViewer/sessionManagementViewer.html'
            }));
        }
    }
});

//# sourceMappingURL=sessionManagementViewer.js.map
