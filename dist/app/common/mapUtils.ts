

export class CesiumMapUtils {

    static getCameraFocus(map: Cesium.Viewer, inWorldCoordinates: boolean): Cesium.Cartesian3 {

        let unprojectedScratch: Cesium.Cartographic = new Cesium.Cartographic();
        let rayScratch: Cesium.Ray = new Cesium.Ray();

        let scene: Cesium.Scene = map.scene;
        let camera: Cesium.Camera = scene.camera;

        if (scene.mode === Cesium.SceneMode.MORPHING) {
            return undefined;
        }

        let result: Cesium.Cartesian3 = new Cesium.Cartesian3();

        // TODO bug when tracking: if entity moves the current position should be used and not only the one when starting orbiting/rotating
        // TODO bug when tracking: reset should reset to default view of tracked entity

        if (map.trackedEntity) {
            result = map.trackedEntity.position.getValue(map.clock.currentTime);
        } else {
            rayScratch.origin = camera.positionWC;
            rayScratch.direction = camera.directionWC;
            result = scene.globe.pick(rayScratch, scene, result);
        }

        if (!result) {
            return undefined;
        }

        if (scene.mode === Cesium.SceneMode.SCENE2D || scene.mode === Cesium.SceneMode.COLUMBUS_VIEW) {
            result = camera.worldToCameraCoordinatesPoint(result, result);

            if (inWorldCoordinates) {
                result = scene.globe.ellipsoid.cartographicToCartesian(scene.mapProjection.unproject(result, unprojectedScratch), result);
            }
        } else {
            if (!inWorldCoordinates) {
                result = camera.worldToCameraCoordinatesPoint(result, result);
            }
        }

        return result;
    }

    static zoom(map: Cesium.Viewer, zoomIn: boolean): void {

        let relativeAmount: number = 1.2;
        let cartesian3Scratch: Cesium.Cartesian3 = new Cesium.Cartesian3();

        if (zoomIn) {
            // this ensures that zooming in is the inverse of zooming out and vice versa
            // e.g. the camera position remains when zooming in and out
            relativeAmount = 1 / relativeAmount;
        }

        if (map) {
            let scene: Cesium.Scene = map.scene;

            let camera: Cesium.Camera = scene.camera;
            let orientation: any;

            switch (scene.mode) {
                case Cesium.SceneMode.MORPHING:
                    break;
                case Cesium.SceneMode.SCENE2D:
                    camera.zoomIn(camera.positionCartographic.height * (1 - relativeAmount));
                    break;
                default:
                    let focus: Cesium.Cartesian3;

                    if (map.trackedEntity) {
                        focus = new Cesium.Cartesian3();
                    } else {
                        focus = CesiumMapUtils.getCameraFocus(map, false);
                    }

                    if (focus) {
                        // Camera direction is not pointing at the globe, so use the ellipsoid horizon point as
                        // the focal point.
                        let ray: Cesium.Ray = new Cesium.Ray(camera.worldToCameraCoordinatesPoint(scene.globe.ellipsoid.cartographicToCartesian(camera.positionCartographic)), camera.directionWC);
                        focus = Cesium.IntersectionTests.grazingAltitudeLocation(ray, scene.globe.ellipsoid);

                        orientation = {
                            heading: camera.heading,
                            pitch: camera.pitch,
                            roll: camera.roll
                        };
                    } else {
                        orientation = {
                            direction: camera.direction,
                            up: camera.up
                        };
                    }

                    let direction: Cesium.Cartesian3 = Cesium.Cartesian3.subtract(camera.position, focus, cartesian3Scratch);
                    let movementVector: Cesium.Cartesian3 = Cesium.Cartesian3.multiplyByScalar(direction, relativeAmount, direction);
                    let endPosition: Cesium.Cartesian3 = Cesium.Cartesian3.add(focus, movementVector, focus);

                    if (map.trackedEntity || scene.mode === Cesium.SceneMode.COLUMBUS_VIEW) {
                        // sometimes flyTo does not work (jumps to wrong position) so just set the position without any animation
                        // do not use flyTo when tracking an entity because during animatiuon the position of the entity may change
                        camera.position = endPosition;
                    } else {
                        camera.flyTo({
                            destination: endPosition,
                            orientation: orientation,
                            duration: 0.5,
                            convert: false
                        });
                    }
            }
        }
    }

}
