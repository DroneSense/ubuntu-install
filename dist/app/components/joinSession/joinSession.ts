
import ISession from '@dronesense/core/lib/common/ISession';
import { ISessionMetadata } from '@dronesense/core/lib/common/metadata/ISessionMetadata';
import ServerConnection from '../../components/flightControlViewer/serverConnection';
import { SessionController } from '../flightControlViewer/sessionController';

export interface IJoinSession extends ng.IScope {

}

class JoinSession {

    // Flag to indicate if service is tryin to connect
    joining: boolean = false;

    // Server connection to use for session creation
    serverConnection: ServerConnection;

    // Flag to show on error
    sessionFindError: boolean = false;

    // Text to show on connect button while connecting
    joinButtonText: string = 'Join';

    // Session to return
    session: ISession;

    // Sessions available to join
    sessions: Array<ISessionMetadata> = [];

    // Current ISessionMetadata selected
    selectedSession: ISessionMetadata;

    // Flag to hide sessions while initiating session join operation
    hideSessions: boolean = false;

    // Flag to hide message about initiating session join operation
    showWaitingForConnectMessage: boolean = false;

    // Flag to hide message about session join time out.
    sessionJoinTimedOutMessage: boolean = false;

    // Flag to hide/show message that request has been denied
    sessionJoinDeniedMessage: boolean = false;

    // Reference to the session controller to check for existing connections
    sessionController: SessionController;

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$log'
    ];
    constructor(public bindings: IJoinSession, public $log: angular.ILogService) {

    }

    // Load available drones on init.
    $onInit(): void {
        
        // exit if connection is already in progress
        if (this.joining) {
            return;
        }

        // Change button text to show user that we are connecting
        this.joinButtonText = 'Loading sessions...';

        // turn error off if shown
        this.sessionFindError = false;

        // Turn on progress bar
        this.joining = true;
        
        // Get sessions available for connection
        this.serverConnection.droneService.SessionManager.getSessions().then((sessionMetaData: Array<ISessionMetadata>) => {
                            
            // Check if we have drones returne if not show error.
            if (sessionMetaData.length > 0) {
                // bind to userinterface for selection;

                this.sessions = sessionMetaData.filter((value: ISessionMetadata, index: number): boolean => {
                    
                    for (let i: number = 0; i < this.sessionController.guestSession.length; i++) {
                        if (this.sessionController.guestSession[i].id === value.id) {
                            return false;
                        }                            
                    }
                    return true;
                }).filter((value: ISessionMetadata, index: number): boolean => {
                    if (this.sessionController.ownerSession) {
                        if (value.id === this.sessionController.ownerSession.id) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                });

                // Check if there are any session left to display
                if (this.sessions.length === 0) {
                    // show error message
                    this.sessionFindError = true;

                    // Change button text back to normal
                    this.joinButtonText = 'Retry';
                } else {
                    // Change button text back to normal
                    this.joinButtonText = 'Join';
                }

                // Turn off the progress indicator
                this.joining = false;

                // force UI update
                this.bindings.$applyAsync();

            } else {
                // Turn off the progress indicator
                this.joining = false;

                // show error message
                this.sessionFindError = true;

                // Change button text back to normal
                this.joinButtonText = 'Retry';

                // force UI update
                this.bindings.$applyAsync();

                this.$log.log({ message: 'No sessions available to join.' });
            }
        }).catch((error: any) => {
            // connect error

            // Turn off the progress indicator
            this.joining = false;

            // show error message
            this.sessionFindError = true;

            // Change button text back to normal
            this.joinButtonText = 'Join';

            // force UI update
            this.bindings.$applyAsync();

            this.$log.log({ message: 'Error getting sessions available for connection.', error: error });
        });
    }

    // helper to clear session selection and set new one
    clearSessionSelection(selected: any): void {
        
        this.sessions.forEach((session: any) => {
            session.isSelected = false;
        });

        this.selectedSession = selected;

    }
    
    onJoin(session: any): void {}

    joinSession(): void {

        // check that drone has been selected and we have a valid name
        if (!this.selectedSession) {
            // need to select a session message
            return;
        }

        // exit if connection is already in progress
        if (this.joining) {
            return;
        }

        // Check if the user is attempting a retry and reset state
        if (this.joinButtonText === 'Retry') {
            this.joinButtonText = '';
            this.$onInit();
            return;
        }

        // Change button text to show user that we are connecting
        this.joinButtonText = 'Joining session...';

        // turn error off if shown
        this.sessionFindError = false;

        // turn off previous join timeout if on
        this.sessionJoinTimedOutMessage = false;

        // Turn on progress bar
        this.joining = true;

        // Hide sessions
        this.hideSessions = true;

        // Show message that we are joing
        this.showWaitingForConnectMessage = true;

        this.$log.log({ message: 'Joining session.', session: this.selectedSession });

        // Try to create session
        this.serverConnection.droneService.SessionManager.joinSession(this.selectedSession, 10000).then((session: ISession) => {

            // Return joined session
            this.onJoin({ session: session });

        }).catch((error: any) => {

            this.joining = false;

            this.showWaitingForConnectMessage = false;

            if (error.parentError.code === 500) {
                this.sessionJoinTimedOutMessage = true;
            } else {
                this.sessionJoinDeniedMessage = true;
            }

            this.hideSessions = false;

            this.joinButtonText = 'Join';

            this.bindings.$applyAsync();

            // error creating session
            this.$log.log({ message: 'Error joining session.', error: error });
        });

    }

}

export default angular.module('DroneSense.Web.JoinSession', [
]).component('dsJoinSession', {
    bindings: {
        onJoin: '&',
        onCancel: '&',
        serverConnection: '<',
        sessionController: '<'
    },
    controller: JoinSession,
    templateUrl: './app/components/joinSession/joinSession.html'
});
