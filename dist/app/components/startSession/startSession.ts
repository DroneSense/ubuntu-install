
import ISession from '@dronesense/core/lib/common/ISession';
import { IDroneMetadata } from '@dronesense/core/lib/common/metadata/IDroneMetadata';
import ServerConnection from '../../components/flightControlViewer/serverConnection';
import { ISessionMetadata } from '@dronesense/core/lib/common/metadata/ISessionMetadata';

export interface IStartSession extends ng.IScope {

}

class StartSession {

    // url of the new session
    name: string = 'Blue Team';

    // Flag to indicate if name has been changed by user
    nameChanged: boolean = false;

    // Flag to indicate if service is tryin to connect
    creating: boolean = false;

    // Server connection to use for session creation
    serverConnection: ServerConnection;

    // Flag to show on error
    showError: boolean = false;

    // Session no name error
    sessionNoNameError: boolean = false;

    // Session no drone error
    sessionNoDroneError: boolean = false;

    // Session name already exists error
    sessionNameExistsError: boolean = false;

    // Session color already exists error
    sessionColorExistsError: boolean = false;

    // Text to show on connect button while connecting
    connectButtonText: string = 'Start';

    // Session to return
    session: ISession;

    // List to hold returned drones
    drones: Array<IDroneMetadata> = [];

    // Selected drone from session
    selectedDrone: IDroneMetadata;

    // Flag whether guests can connect without need a prompt for explicit permission
    guestCanConnect: boolean = true;

    // Flag to start recording on takeoff automatically
    autoRecordOnTakeoff: boolean = true;

    existingSessions: Array<ISessionMetadata>;

    // On start callback
    onStart(session: any): void {}

    teamColors: Array<string> = ['#0A92EA', '#ea0707', '#00c121', '#dcd300', '#673ab7'];
    teamNames: Array<string> = ['Blue Team', 'Red Team', 'Green Team', 'Yellow Team', 'Purple Team'];
    selectedColor: string = this.teamColors[0];

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$mdDialog',
        '$log'
    ];
    constructor(public bindings: IStartSession,
                public mdDialog: angular.material.MDDialogService,
                public $log: angular.ILogService) {

    }

    // Load available drones on init.
    $onInit(): void {
        
        // exit if connection is already in progress
        if (this.creating) {
            return;
        }

        // Change button text to show user that we are connecting
        this.connectButtonText = 'Getting drones...';

        // turn error off if shown
        this.showError = false;

        // Turn on progress bar
        this.creating = true;

        // Get existing sessions so we can check for name and color conflicts.
        this.serverConnection.droneService.SessionManager.getSessions().then((sessions: Array<ISessionMetadata>) => {
            
            // Set sessions
            this.existingSessions = sessions;

            // Remove used colors from option array
            if (this.existingSessions.length > 0) {
                this.existingSessions.forEach((value: ISessionMetadata) => {
                    let index: number = this.teamColors.indexOf(value.color);
                    this.teamColors.splice(index, 1);
                    this.teamNames.splice(index, 1);
                });

                this.selectedColor = this.teamColors[0];
                this.name = this.teamNames[0];
            }

            // Get drones available for connection
            this.serverConnection.droneService.DroneManager.getDrones().then((droneMetaData: Array<IDroneMetadata>) => {
                                
                // Check if we have drones returne if not show error.
                if (droneMetaData.length > 0) {
                    // bind to userinterface for selection;

                    this.drones = droneMetaData;

                    this.bindings.$applyAsync();

                    // Turn off the progress indicator
                    this.creating = false;

                    // Change button text back to normal
                    this.connectButtonText = 'Start';

                } else {
                    // Turn off the progress indicator
                    this.creating = false;

                    // show error message
                    this.showError = true;

                    // Change button text back to normal
                    this.connectButtonText = 'Retry';

                    // force UI update
                    this.bindings.$applyAsync();

                    this.$log.log({ message: 'No drones available for connection.'});
                }
            }).catch((error: any) => {
                // connect error

                // Turn off the progress indicator
                this.creating = false;

                // show error message
                this.showError = true;

                // Change button text back to normal
                this.connectButtonText = 'Start';

                // force UI update
                this.bindings.$applyAsync();

                this.$log.log({ message: 'Error getting drone list for session.', error: error });
            });
        }).catch((error) => {
            this.$log.log({ message: 'Error getting existing session list.', error: error });
        });
    }

    // helper to clear drone selection and set new one
    clearDroneSelection(selected: any): void {
        
        if (selected.checkoutState.isCheckedOut) {
            selected.isSelected = false;
            return;
        }
        
        this.drones.forEach((drone: any) => {
            drone.isSelected = false;
        });

        this.selectedDrone = selected;

    }

    createSession(): void {

        // check that drone has been selected and we have a valid name
        if (!this.selectedDrone) {
            this.sessionNoDroneError = true;
            return;
        } else {
            this.sessionNoDroneError = false;
        }

        if (this.name === '') {
            // message to tell user they need a session name
            this.sessionNoNameError = true;
            return;
        } else {
            this.sessionNoNameError = false;
        }
        
        // check if session name is already in use
        let nameMatch: boolean = false;
        let colorMatch: boolean = false;

        // check for existing color and name
        this.existingSessions.forEach((session: ISessionMetadata) => {
            if (this.name.toLowerCase() === session.name.toLocaleLowerCase()) {
                nameMatch = true;
            }
            if (this.selectedColor === session.color) {
                colorMatch = true;
            }
        });

        // show existing name match error
        if (nameMatch) {
            this.sessionNameExistsError = true;
            return;
        } else {
            this.sessionNameExistsError = false;
        }

        // show existing color match error
        if (colorMatch) {
            this.sessionColorExistsError = true;
            return;
        } else {
            this.sessionColorExistsError = false;
        }

        // exit if connection is already in progress
        if (this.creating) {
            return;
        }

        // Check if the user is attempting a retry and reset state
        if (this.connectButtonText === 'Retry') {
            this.connectButtonText = '';
            this.$onInit();
            return;
        }

        // Change button text to show user that we are connecting
        this.connectButtonText = 'Starting session...';

        // turn error off if shown
        this.showError = false;

        // Turn on progress bar
        this.creating = true;

        this.$log.log({ message: 'Starting session.', 
                        name: this.name, 
                        color: this.selectedColor, 
                        drone: this.selectedDrone, 
                        allowAllGuests: this.guestCanConnect, 
                        startRecording: this.autoRecordOnTakeoff });

        // Try to create session
        this.serverConnection.droneService.SessionManager.createSession(this.name, this.selectedColor, [this.selectedDrone]).then((session: ISession) => {
            session.getDrones().then((drones) => {

                // This return the drones requested for the session so for now we can assume it will
                // always be the first drone in the array.
                if (drones.length > 0) {
                    drones[0].connect().then(() => {

                        this.$log.log({ message: 'Connected to drone.', drone: drones[0].Name });

                        // // set current drone
                        // this.currentDrone = drones[0];

                        this.onStart({ session: session, allowAllGuests: this.guestCanConnect, startRecording: this.autoRecordOnTakeoff });
                        
                    }).catch((error: any) => {
                        // error connection to selected drone
                        // Turn off the progress indicator
                        this.creating = false;

                        // show error message
                        this.showError = true;

                        // Change button text back to normal
                        this.connectButtonText = 'Start';

                        // force UI update
                        this.bindings.$applyAsync();

                        this.$log.log({ message: 'Error connecting to drone', error: error });
                    });
                } else {
                    // no drones were returned to connect to
                    this.$log.log({ message: 'No drones were returned to connect to.' });
                }

            }).catch((error: any) => {
                // error getting drones
                this.$log.log({ message: 'Error getting drones.', error: error });
            });
        }).catch((error: any) => {
            // error creating session
            this.$log.log({ message: 'Error creating session.', error: error });
        });

    }

    // Set team name based on color selection only if name has not been edited
    setTeamName(colorIndex: number): void {
        if (!this.nameChanged) {
            this.name = this.teamNames[colorIndex];
        }
    }

}

export default angular.module('DroneSense.Web.StartSession', [
]).component('dsStartSession', {
    bindings: {
        onStart: '&',
        onCancel: '&',
        serverConnection: '<'
    },
    controller: StartSession,
    templateUrl: './app/components/startSession/startSession.html'
});
