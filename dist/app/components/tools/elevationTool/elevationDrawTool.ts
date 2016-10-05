import { IDrawTool } from '../IDrawTool';

export class ElevationTool implements IDrawTool {

    IconPath: string = './app/components/tools/elevationTool/images/elevation.svg';
    ToolTip: string = 'Sample elevation';
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
