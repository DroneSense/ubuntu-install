import { User } from '@dronesense/model';
import UserService from '../../services/userService';
import { IUserService } from '../../services/userService';

class UserSettings {

    user: User;
    NewPassword: string;
    CurrentPassword: string;
    Unit: string;

    units: Array<string> = ['Standard', 'Metric'];

    timezones: Array<string> = [
        'Alpha Time Zone UTC +1:00',
        'Australian Central Daylight Time UTC +10:30',
        'Australian Central Standard Time UTC +9:30',
      'Pacific Time',
      'Mountain Time',
      'Central Time',
      'Eastern Time'
    ];

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        'db',
        'userService'
    ];
    constructor(public bindings: ng.IScope, public db: any, public userService: IUserService) {

    }

        // Methods
    changePassword(): void {
      this.db.session.changePassword(this.user.Email, this.CurrentPassword, this.NewPassword)
          .then(this.db.$apply(this.bindings, function (): void {
            this.passwordSuccess = 'Password updated';
            this.NewPassword = '';
            this.CurrentPassword = '';
            this.$timeout((function (): void {
              this.passwordSuccess = null;
            }).bind(this), 2000);
          }, this))
          .catch(this.db.$apply(this.bindings, function (err: any): void {
            this.passwordError = err.message;
          }, this));
    }

    logout(): void {
      this.userService.Logout();
    }

    updateProperty(model: User, prop: any, propName: string): void {
      //model.SaveProperty(prop, propName);
    }

    SetUnitPref(value: any): void {
      //this.userService.CurrentUser.SaveProperty(this.user.UnitPreference, 'UnitPreference');
    }

    SetTimeZone(): void {
      //this.userService.CurrentUser.SaveProperty(this.user.TimeZone, 'TimeZone');
    }

}

export default angular.module('DroneSense.Web.UserSettings', [
    UserService.name
]).component('dsUserSettings', {
    bindings: {
        user: '<'
    },
    controller: UserSettings,
    templateUrl: './app/components/userSettings/userSettings.html'
});
