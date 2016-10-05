import IDroneService from '@dronesense/core/lib/common/IDroneSenseService';

export default class ServerConnection {

    // Server name if it has one
    //name: string;

    get name(): string {
        // TODO: uncomment once name has been added to the drone service
        
        // if (this.droneService.Name) {
        //     return this.droneService.Name;
        // } else {
            return 'http://' + this.ip + ':' + this.port;
        //}
    }

    // flag to indicate if the server is connected
    isConnected: boolean;

    // Last connection error string
    lastConnectionError: string;

    constructor(public ip: string, public port: number, public droneService: IDroneService) {

        // wire up the connection events
        this.droneService.on('connected', () => {
            this.isConnected = true;
        });

        // wire up disconnected event
        this.droneService.on('disconnected', () => {
            this.disconnect().then(() => {
                this.isConnected = false;
            });
        });

        this.droneService.on('connect-error', (error: any) => {
            this.lastConnectionError = error;
        });
    }

    // disconnect call
    disconnect(): Promise<void> {
        
            return this.droneService.disconnect().then(() => {
                this.droneService.off('connected');
                this.droneService.off('disconnected');
                this.droneService.off('connect-error');

        });
    }

}
