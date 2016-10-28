
import { IGuidedWaypoint } from '@dronesense/core/lib/common/entities/IGuidedWaypoint';

export class MapWaypoint {

    longitude: number;
    latitude: number;
    altitudeAGL: number;
    speed: number;
    name: string = 'A';
    time: number;
    distance: number;
    index: number;
    hae: number;
    reached: boolean = false;
    isActive: boolean = false;

    guidedWaypoint: IGuidedWaypoint;

    entity: Cesium.Entity;

    constructor(guidedWaypoint: IGuidedWaypoint, index: number, hae: number) {
        this.guidedWaypoint = guidedWaypoint;

        this.longitude = this.guidedWaypoint.longitude;
        this.latitude = this.guidedWaypoint.lattitude;
        this.altitudeAGL = this.guidedWaypoint.altitude;
        this.speed = this.guidedWaypoint.speed;
        this.name = this.guidedWaypoint.name;
        this.reached = this.guidedWaypoint.isReached;
        this.index = index;
        this.hae = hae;

    }

}
