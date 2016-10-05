import { IDrawTool } from '../IDrawTool';

export class VolumeMeasureTool implements IDrawTool {

    IconPath: string = './app/components/tools/volumeMeasureTool/images/volume.svg';
    ToolTip: string = 'Calculate Volume';
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
