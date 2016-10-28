
export interface IRedProService {
    getLiveStreams(): Promise<Array<RedProStream>>;
    getLiveStreamStatistics(red5ProStream: RedProStream): Promise<void>;
    startVODRecording(sessionName: string): Promise<boolean>;
    stopVODRecording(sessionName: string): Promise<boolean>;
}

export class RedProStream {

    bytes_received: number;
    active_subscribers: number;
    total_subscribers: number;
    max_subscribers: number;
    id: number;
    name: string;
    publish_name: string;
    creation_time: number;
    scope_path: string;
    is_recording: boolean;
    state: string;

    constructor(publishName: string) {
        this.publish_name = publishName;
    }
}

class RedProService {

    $http: ng.IHttpService;

    appName: string = 'live';
    accessToken: string = 'dronesense';
    red5proServerIp: string = 'afd.dronesense.com'; // '192.168.0.115';
    red5proServerPort: string = '5080';

    static $inject: Array<string> = [
        '$http'
    ];

    constructor($http: ng.IHttpService) {
        this.$http = $http;
    }

    startVODRecording(sessionName: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject ) => {
            this.$http.get('http://' + this.red5proServerIp + ':' + this.red5proServerPort + '/api/v1/applications/' + this.appName + '/streams/' + sessionName + '/action/startrecord?accessToken=' + this.accessToken).success((data: any): void => {
                
                if (data.data.is_recording) {
                    resolve(true);
                } else {
                    reject(false);
                }
            }).error((error) => {
                console.log(error);
                reject(error);
            });
        });
    }

    stopVODRecording(sessionName: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject ) => {
            this.$http.get('http://' + this.red5proServerIp + ':' + this.red5proServerPort + '/api/v1/applications/' + this.appName + '/streams/' + sessionName + '/action/stoprecord?accessToken=' + this.accessToken).success((data: any): void => {
                
                if (data.data.is_recording) {
                    resolve(true);
                } else {
                    reject(false);
                }
            }).error((error) => {
                console.log(error);
                reject(error);
            });
        });
    }

    getLiveStreams(): Promise<Array<RedProStream>> {
        return new Promise<Array<RedProStream>>((resolve, reject) => {

            this.$http.get('http://' + this.red5proServerIp + ':' + this.red5proServerPort + '/api/v1/applications/' + this.appName + '/streams?accessToken=' + this.accessToken).success((data: any): void => {
                
                let streams: Array<RedProStream> = [];
                
                data.data.forEach((stream: string) => {
                    streams.push(new RedProStream(stream));
                });

                resolve(streams);
            }).error((error) => {
                console.log(error);
                reject(error);
            });

        }); 
    }

    getLiveStreamStatistics(red5ProStream: RedProStream): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.$http.get('http://' + this.red5proServerIp + ':' + this.red5proServerPort + '/api/v1/applications/' + this.appName + '/streams/' + red5ProStream.publish_name + '?accessToken=' + this.accessToken).success((data: any): void => {
                
                red5ProStream.active_subscribers = data.data.active_subscribers;
                red5ProStream.total_subscribers = data.data.total_subscribers;
                red5ProStream.max_subscribers = data.data.max_subscribers;
                red5ProStream.id = data.data.id;
                red5ProStream.publish_name = data.data.publish_name;
                red5ProStream.creation_time = data.data.creation_time;
                red5ProStream.scope_path = data.data.scope_path;
                red5ProStream.is_recording = data.data.is_recording;
                red5ProStream.state = data.data.state;
                red5ProStream.name = data.data.name;

                resolve();
            }).error(() => {
                reject();
            });
        });
    }
}

export default angular.module('DroneSense.Web.RedProService', [
    
]).service('redProService', RedProService);

