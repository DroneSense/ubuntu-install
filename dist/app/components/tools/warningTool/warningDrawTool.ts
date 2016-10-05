import { IDrawTool } from '../IDrawTool';

export class WarningTool implements IDrawTool {

    IconPath: string = './app/components/tools/warningTool/images/warning.svg';
    ToolTip: string = 'Add Warning Note';
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


