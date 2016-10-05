import { SessionController } from '../flightControlViewer/sessionController';
import { MapSession, OwnerMapSession } from '../flightControlViewer/mapSession';

export interface ISessionManagementViewer extends ng.IScope {

}

class SessionManagementViewer {

    sessionController: SessionController;

    ownerSession: OwnerMapSession;

    showSessionManagement: boolean = false;

    currentSessionVisible: boolean = false;
    guestSessionVisible: boolean = false;
    chatVisible: boolean = false;
    waypointCollab: boolean = false;

    name: string;

    server: string;

    owner: string;
    color: string;

    // Constructor
    static $inject: Array<string> = [
        '$scope'
    ];
    constructor(public bindings: ISessionManagementViewer) {

        this.name = this.sessionController.activeSession.name;
        this.server = this.sessionController.activeSession.serverConnection.ip + ':' + this.sessionController.activeSession.serverConnection.port;
        this.color = this.sessionController.activeSession.color;

        if (this.sessionController.ownerSession) {
            this.ownerSession = this.sessionController.ownerSession;
            this.currentSessionVisible = true;
        } else {
            this.guestSessionVisible = true;
        }

        this.sessionController.eventing.on('session-added', (session: OwnerMapSession) => {
            //this.ownerSession = session;
        });

        // this.sessionController.eventing.on('session-changed', (session: MapSession) => {

        // });
    }

    leaveSession(session: MapSession): void {
        this.sessionController.removeGuestSession(session);
    }

    changeActiveSession(session: MapSession): void {
        if (!this.ownerSession) {
            this.sessionController.changeActiveSession(session);
        }
    }

    endSession(): void {
        this.sessionController.activeSession.session.endSession();
    }


}

export default angular.module('DroneSense.Web.SessionManagementViewer', [

]).component('dsSessionManagementViewer', {
    bindings: {
        sessionController: '<',
        onJoinSession: '&'
    },
    controller: SessionManagementViewer,
    templateUrl: './app/components/sessionManagementViewer/sessionManagementViewer.html'
});
