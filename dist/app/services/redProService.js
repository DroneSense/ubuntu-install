System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var RedProStream, RedProService;
    return {
        setters:[],
        execute: function() {
            RedProStream = (function () {
                function RedProStream(publishName) {
                    this.publish_name = publishName;
                }
                return RedProStream;
            }());
            exports_1("RedProStream", RedProStream);
            RedProService = (function () {
                function RedProService($http) {
                    this.appName = 'live';
                    this.accessToken = 'dronesense';
                    this.red5proServerIp = 'localhost'; // '192.168.0.115';
                    this.red5proServerPort = '5080';
                    this.$http = $http;
                }
                RedProService.prototype.startVODRecording = function (sessionName) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.$http.get('http://' + _this.red5proServerIp + ':' + _this.red5proServerPort + '/api/v1/applications/' + _this.appName + '/streams/' + sessionName + '/action/startrecord?accessToken=' + _this.accessToken).success(function (data) {
                            if (data.data.is_recording) {
                                resolve(true);
                            }
                            else {
                                reject(false);
                            }
                        }).error(function (error) {
                            console.log(error);
                            reject(error);
                        });
                    });
                };
                RedProService.prototype.stopVODRecording = function (sessionName) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.$http.get('http://' + _this.red5proServerIp + ':' + _this.red5proServerPort + '/api/v1/applications/' + _this.appName + '/streams/' + sessionName + '/action/stoprecord?accessToken=' + _this.accessToken).success(function (data) {
                            if (data.data.is_recording) {
                                resolve(true);
                            }
                            else {
                                reject(false);
                            }
                        }).error(function (error) {
                            console.log(error);
                            reject(error);
                        });
                    });
                };
                RedProService.prototype.getLiveStreams = function () {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.$http.get('http://' + _this.red5proServerIp + ':' + _this.red5proServerPort + '/api/v1/applications/' + _this.appName + '/streams?accessToken=' + _this.accessToken).success(function (data) {
                            var streams = [];
                            data.data.forEach(function (stream) {
                                streams.push(new RedProStream(stream));
                            });
                            resolve(streams);
                        }).error(function (error) {
                            console.log(error);
                            reject(error);
                        });
                    });
                };
                RedProService.prototype.getLiveStreamStatistics = function (red5ProStream) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.$http.get('http://' + _this.red5proServerIp + ':' + _this.red5proServerPort + '/api/v1/applications/' + _this.appName + '/streams/' + red5ProStream.publish_name + '?accessToken=' + _this.accessToken).success(function (data) {
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
                        }).error(function () {
                            reject();
                        });
                    });
                };
                RedProService.$inject = [
                    '$http'
                ];
                return RedProService;
            }());
            exports_1("default",angular.module('DroneSense.Web.RedProService', []).service('redProService', RedProService));
        }
    }
});

//# sourceMappingURL=redProService.js.map
