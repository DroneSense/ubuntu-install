
import Client from '@dronesense/client/lib/index';
import IDroneService from '@dronesense/core/lib/common/IDroneSenseService';

import ServerConnection from '../../components/flightControlViewer/serverConnection';

export interface IControlConnect extends ng.IScope {

}

class ControlConnect {

    // Ip address of server passed in from bindings
    ip: string = '192.168.0.115';

    // port address of server passed in from bindings
    port: number = 3005;

    // url of remote server
    url: string = 'https://afd.dronesense.com';

    // Flag to indicate if service is trying to connect
    connecting: boolean = false;

    // Flag to indicate if this is a new flight session connection
    newFlightSession: boolean;

    // Flag to show connection error
    showConnectionError: boolean = false;

    // Flag to show same server connection error text
    showSameServerConnectionError: boolean = false;

    // Text to show on connect button while connecting
    connectButtonText: string = 'Connect';

    // List of servers already connected
    connectedServers: Array<ServerConnection>;

    // On connect component callback
    onConnect(dservice: any): void {}

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$mdDialog',
        '$log'
    ];
    constructor(public bindings: IControlConnect,
                public mdDialog: angular.material.MDDialogService,
                public $log: angular.ILogService) {
                    
    }

    $onInit(): void {

        // // Remove disconnected servers
        // this.connectedServers.forEach((server: ServerConnection) => {
        //     if (server.disconnect) {

        //     }
        // });
    }

    connect(): void {

        // exit if connection is already in progress
        if (this.connecting) {
            return;
        }

        // check if the new connection already matches a connected server and return an error
        let detection: boolean = false;

        this.connectedServers.forEach((serverConnection: ServerConnection) => {
            if (this.ip === serverConnection.ip && this.port === serverConnection.port) {
                detection = true;
            }
        });

        // Check if we found a duplicate
        if (detection) {
            this.showSameServerConnectionError = true;
            return;
        } else {
            this.showSameServerConnectionError = false;
        }

        // Change button text to show user that we are connecting
        this.connectButtonText = 'Connecting...';

        // turn error off if shown
        this.showConnectionError = false;

        // Turn on progress bar
        this.connecting = true;
        
        // Create the client with the ip and port address
        let droneService: IDroneService = Client.createClient('http://' + this.ip + ':' + this.port);

        this.$log.log('Attempting connection to ' + 'http://' + this.ip + ':' + this.port);

        // TODO - Pass in user from data service
        droneService.connect('christopher').then(() => {
            
            this.$log.log('Connection sucessful to ' + 'http://' + this.ip + ':' + this.port);
            this.$log.log('Is new flight session:' + this.newFlightSession);

            // success
            // 1) make call to check server health to ensure all services are running
            // this.droneService.checkServerHealth(() => {

                    let newServerConnection: ServerConnection = new ServerConnection(this.ip, this.port, droneService);

                    // we have a sucessful connection so lets return the drone service
                    this.onConnect({ serverConnection: newServerConnection, useExisting: this.newFlightSession });
            
            //}).catch((error: any)=> {
                // prompt user to reboot The box
            //});

        }).catch((error: any) => {

            // Turn off the progress indicator
            this.connecting = false;

            // show error message
            this.showConnectionError = true;

            // Change button text back to normal
            this.connectButtonText = 'Connect';

            // force UI update
            this.bindings.$applyAsync();

            this.$log.error({ message: 'Error during connection to ' + 'http://' + this.ip + ':' + this.port, error: error });
        });

    }

    // Callback to flight control
    setSelectedServer(server: ServerConnection): void {
        this.onConnect({ serverConnection: server, useExisting: true });
    }

}

export default angular.module('DroneSense.Web.ControlConnect', [
]).component('dsControlConnect', {
    bindings: {
        onConnect: '&',
        onCancel: '&',
        connectedServers: '<',
        newFlightSession: '<'
    },
    controller: ControlConnect,
    templateUrl: './app/components/controlConnect/controlConnect.html'
});
