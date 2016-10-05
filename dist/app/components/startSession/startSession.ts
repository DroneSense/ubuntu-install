
import ISession from '@dronesense/core/lib/common/ISession';
import { IDroneMetadata } from '@dronesense/core/lib/common/metadata/IDroneMetadata';
import ServerConnection from '../../components/flightControlViewer/serverConnection';

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

    teamColors: Array<string> = ['#0A92EA', '#ea0707', '#00c121', '#dcd300', '#673ab7'];
    teamNames: Array<string> = ['Blue Team', 'Red Team', 'Green Team', 'Yellow Team', 'Purple Team'];
    selectedColor: string = '#0A92EA';

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$mdDialog'
    ];
    constructor(public bindings: IStartSession,
                public mdDialog: angular.material.MDDialogService) {

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

            console.log(error);
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

    onStart(session: any): void {}

    createSession(): void {

        // check that drone has been selected and we have a valid name
        if (!this.selectedDrone) {
            // need to select a drone message
            return;
        }

        if (this.name === '') {
            // message to tell user they need a session name
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

        // Try to create session
        this.serverConnection.droneService.SessionManager.createSession(this.name, this.selectedColor, [this.selectedDrone]).then((session: ISession) => {
            session.getDrones().then((drones) => {

                // This return the drones requested for the session so for now we can assume it will
                // always be the first drone in the array.
                if (drones.length > 0) {
                    drones[0].connect().then(() => {

                        console.log('drone connected');
                        // // set current drone
                        // this.currentDrone = drones[0];

                        this.onStart({ session: session, allowAllGuests: this.guestCanConnect });
                        
                        // this.currentDrone.FlightController.Telemetry.on('propertyChanged', (name, value) => {
                        //     //this.bindings.$applyAsync(); 
                        //     //console.log(name);
                        // });

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

                        console.log(error);
                    });
                } else {
                    // no drones were returned to connect to
                    console.log('no drones were returned to connect to');
                }

            }).catch((error: any) => {
                // error getting drones
                console.log(error);
            });
        }).catch((error: any) => {
            // error creating session
            console.log(error);
        });

    }

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
