import { IDrawTool } from '../IDrawTool';

export class NoteTool implements IDrawTool {

    IconPath: string = './app/components/tools/noteTool/images/note.svg';
    ToolTip: string = 'Add note';
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
