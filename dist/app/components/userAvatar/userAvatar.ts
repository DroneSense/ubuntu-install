import { User } from '@dronesense/model';


export interface IUserAvatar extends ng.IScope {
    user: User;
}

class UserAvatar {

    hasAvatar: boolean = false;

    user: User;

    size: number;

    fontSize: number;

    color: string;

    colorOptions: Array<string> = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#2196f3', '#00bcd4', '#009688', '#4caf50', '#ff5722', '#9e9e9e', '#607d8b'];

    // Constructor
    static $inject: Array<string> = [
        '$scope'
    ];

    constructor(public bindings: IUserAvatar) {
        if (this.user && this.user.AvatarUrl && this.user.AvatarUrl !== '') {
            this.hasAvatar = true;
        }

        if (this.size === 46) {
            this.fontSize = 18;
        }
        if (this.size === 30) {
            this.fontSize = 14;
        }

        if (this.size === 100) {
            this.fontSize = 28;
        }

        this.color = this.colorOptions[_.random(0, this.colorOptions.length - 1)];
    }

}

export default angular.module('DroneSense.Web.UserAvatar', [

]).component('dsUserAvatar', {
    bindings: {
        user: '<',
        size: '<'
    },
    controller: UserAvatar,
    templateUrl: './app/components/userAvatar/userAvatar.html'
});
