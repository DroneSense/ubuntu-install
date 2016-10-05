
class Login {
    
    // Class properties
    email: string;
    password: string;
    confirm: string;
    createMode: boolean;
    
    static $inject: Array<string> = [
        '$scope', '$state', 'db'
    ]
    constructor(public $scope: ng.IScope, 
                public $state: angular.ui.IStateService, 
                public db: any) {
        
    }
        
    // Create FB email and password account and then sign user in
    createAccount(email: string, password: string): void {
        var handle: any = this.db.session.createUser(email, password);
        handle.once(handle.EVENTS.USER_CREATED, this.db.$apply(this.$scope, function (): any {
            this.$scope.message = 'User " + email + " has been created.';
            this.onLogin(handle);
        }), this);

        handle.once(handle.EVENTS.USER_CREATE_ERRORED, this.db.$apply(this.$scope, function (err: any): any {
            if (err.code === 'EMAIL_TAKEN') {
                this.$scope.error = email + ' is not available.';
            } else if (err.code === 'BAD_EMAIL_PASSWORD') {
                this.$scope.error = 'Please enter a valid email and/or password';
            } else {
                console.log(err.code);
                this.$scope.error = 'User account could not be created.  Please try again later.';
            }
        }), this);
    }
    
    login(email: string, password: string): void {
        this.onLogin(this.db.session.login(this.db.session.LOGIN_TYPES.EMAIL_PASSWORD, email, password));
    }

    loginFacebook(): void {
        this.onLogin(this.db.session.login(this.db.session.LOGIN_TYPES.FACEBOOK));
    }

    loginGoogle(): void {
        this.onLogin(this.db.session.login(this.db.session.LOGIN_TYPES.GOOGLE));
    }
    
    onLogin(handle: any): void {
        handle.once(handle.EVENTS.LOGGED_IN, function (): any {
            this.$state.go('flightplan');
        }, this);
        handle.once(handle.EVENTS.LOGIN_ERRORED, this.db.$apply(this.$scope, function (err: any): any {
            if (err.code === 'BAD_EMAIL_PASSWORD') {
                this.$scope.error = 'Please enter a valid email and/or password';
            } else {
                console.log(err.code);
                this.$scope.error = 'An error occurred during login. Please try again later.';
            }
        }), this);
    }
}

export default angular.module('DroneSense.Web.Login', [
    
]).component('dsLogin', {
    controller:Login,
    templateUrl: './app/components/login/login.html'
});