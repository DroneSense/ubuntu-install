import { IDrawTool } from '../IDrawTool';

export class GeofenceTool implements IDrawTool {

    IconPath: string = './app/components/tools/geofenceTool/images/geofence.svg';
    ToolTip: string = 'Add Geofence';
    Selected: boolean;

    // Editing handler reference
    editingHandler: Cesium.ScreenSpaceEventHandler;

    constructor(public map: Cesium.Viewer, public callback: Function) {

    }

    StartEdit(): void {

    }

    StopEdit(): void {


        this.Selected = false;
    }
}
