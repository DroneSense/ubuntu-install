import { Command } from '@dronesense/model';
import focusOnShow from '../../common/focusOnShow';
import enterKey from '../dsEnterKey/dsEnterKey';

class CommandHeader {

    command: Command;

    static $inject: Array<string> = [
        '$scope'
    ];

    constructor(public bindings: ng.IScope) {

    }
}

// Register component with Angular
export default angular.module('DroneSense.Web.CommandHeader', [
    focusOnShow.name,
    enterKey.name
]).component('dsCommandHeader', {
    bindings: {
        command: '<',
        onFlyTo: '&'
    },
    controller: CommandHeader,
    templateUrl: './app/components/commandHeader/commandHeader.html'
});
