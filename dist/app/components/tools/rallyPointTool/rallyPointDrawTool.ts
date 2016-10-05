import { IDrawTool } from '../IDrawTool';

export class RallyPointTool implements IDrawTool {

    IconPath: string = './app/components/tools/rallyPointTool/images/rallypoint.svg';
    ToolTip: string = 'Add Rallypoints';
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
