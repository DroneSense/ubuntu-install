import { FlightPlan, User, Account, Address, Subscription, Tag } from '@dronesense/model';
import _ from 'lodash';

export interface IDataService {
    getUserFlightPlans(): Promise<Array<FlightPlan>>;
    logout(): void;
    login(): void;
    getUser(): Promise<User>;
    getCurrentAccount(): Promise<Account>;
    getAccountFlightPlanTags(): Promise<Array<Tag>>;
}

// Data service is responsible for loading data and returning to the UI for binding.  It will hold the objects across views so that
// subsequent model creation is not necessary if the data has already been return and loaded into a model.
class DataService {

    user: User;

    userHandle: any;

    accounts: Array<Account>;

    accountsHandle: any;

    accountsLoaded: boolean = false;

    currentAccount: Account;

    flightPlans: Array<FlightPlan> = [];

    flightPlansLoaded: boolean = false;

    flightPlansHandle: any;

    flightPlanTags: Array<Tag>;

    defaultIndividualAccount: any = {
            Name: 'Individual',
            AccountType: 'Individual',
            CompanyName: '',
            Admins: [this.sampleUser],
            AvatarUrl: '',
            Phone: '',
            Website: '',
            Email: '',
            MailAddress: {
                Address1: '1400 Winsted Ln',
                Address2: '',
                City: 'Austin',
                State: 'Texas',
                Zip: '78703',
                Country: 'United States'
            },
            BillAddress: '',
            Plan: null,
            Users: [this.sampleUser]
    };

    testCompany: Account = new Account();


    defaultCompanyAccount: any = {
            Name: 'DroneSense Team 1',
            AccountType: 'Company',
            CompanyName: 'DroneSense',
            Admins: [this.sampleUser],
            AvatarUrl: '',
            Phone: '512-573-2280',
            Website: 'http://www.dronesense.com',
            Email: 'contact@dronesense.com',
            MailAddress: {
                Address1: '1400 Winsted Ln',
                Address2: '',
                City: 'Austin',
                State: 'Texas',
                Zip: '78703',
                Country: 'United States'
            },
            BillAddress: '',
            Plan: null,
            Users: [this.sampleUser]
    };

    sampleUser: any = {
            UserInitials: 'CE',
            FirstName: 'Christopher',
            LastName: 'Eyhorn',
            Email: 'chris.eyhorn@gmail.com',
            TimeZone: '(UTC-06:00) Central Time (US & Canada)',
            UnitPreference: 'Metric',
            CoordinatePreference: 'Decimal Degrees',
            AvatarUrl: '',
            Accounts: [this.defaultIndividualAccount],
            UserName: 'Christopher Eyhorn',
            CertificateType: 'Private',
            CertificateNumber: '12982398',
            HireDate: new Date('05/23/2016'),
            Phone: '5125732280',
            ID: 'lasdlkfajkdf'
    };

    sampleUser1: any = {
            UserInitials: 'GJ',
            FirstName: 'Gerard',
            LastName: 'Juarez',
            Email: 'Gerard.Juarez@gmail.com',
            TimeZone: 'Central',
            UnitPreference: 'Metric',
            CoordinatePreference: 'Decimal',
            AvatarUrl: '',
            Accounts: [this.defaultIndividualAccount],
            UserName: 'Gerard Juarez',
            CertificateType: 'Drone',
            CertificateNumber: '12982398',
            ID: 'lasdlkfaasdjkdf'
    };

    sampleUser2: any = {
            UserInitials: 'RS',
            FirstName: 'Robert',
            LastName: 'Shoemate',
            Email: 'Robert.Shoemate@gmail.com',
            TimeZone: 'Central',
            UnitPreference: 'Metric',
            CoordinatePreference: 'Decimal',
            AvatarUrl: '',
            Accounts: [this.defaultIndividualAccount],
            UserName: 'Robert Shoemate',
            ID: 'lasdlkfasadfj3kdf'
    };

    flightPlan1: any = {
        Name: 'XYZ CORP. #002-MOUNTAIN PASS-00001',
        LocationName: 'Austin, Texas',
        CreateDate: new Date('8/17/2016'),
        ScheduledDate: new Date('8/19/2016'),
        CreatedUser: this.sampleUser,
        Owners: [this.sampleUser],
        ThumbnailUrl: 'blah.com/image',
        Tags: ['Survey', 'Iris+', 'Canon S100', 'Foo Bar']
    };

    flightPlan2: any = {
        Name: 'ABC CORP. #002-MOUNTAIN PASS-00001',
        LocationName: 'Foobar, Texas',
        CreateDate: new Date('8/19/2016'),
        ScheduledDate: new Date('10/19/2016'),
        CreatedUser: this.sampleUser,
        Owners: [this.sampleUser],
        ThumbnailUrl: 'blah.com/image',
        Tags: ['Survey', 'Phantom 4', 'Nikon S100', 'Foo Bar', 'Hello', 'Bar', 'Apple', 'Oragne', 'Chris']
    };

    flightPlan3: any = {
        Name: 'Orbit Work around Chase Tower',
        LocationName: 'Dallas, Texas',
        CreateDate: new Date('8/17/2015'),
        ScheduledDate: new Date('8/19/2016'),
        CreatedUser: this.sampleUser,
        Owners: [this.sampleUser],
        ThumbnailUrl: 'blah.com/image',
        Tags: ['Orbit', 'Phantom 4', 'Nikon S100', 'Foo Bar']
    };

    flightPlan4: any = {
        Name: 'Capital Survey',
        LocationName: 'Austin, Texas',
        CreateDate: new Date('8/17/2016'),
        ScheduledDate: new Date('8/19/2016'),
        CreatedUser: this.sampleUser,
        Owners: [this.sampleUser],
        ThumbnailUrl: 'blah.com/image',
        Tags: ['Orbit', 'Phantom 4', 'Nikon S100', 'Foo Bar']
    };

    flightPlan5: any = {
        Name: 'Round Rock construction site',
        ScheduledDate: new Date('8/19/2016'),
        Distance: 3542,
        NavPointCount: 56,
        FlightTime: 300,
        HighElevation: 219,
        LowElevation: 100,
        ThumbnailUrl: 'blah.com/image',
        LocationName: 'Austin, Texas',
        LocationLatLng: '30.2672° N, 97.7431° W',
        MaxDistance: 234,
        CreateDate: new Date('8/17/2016'),
        ModifiedDate: new Date('8/17/2016'),
        CreatedUser: this.sampleUser,
        ModifiedUser: this.sampleUser,
        Owners: [this.sampleUser],
        Notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip exa commodo.',
        Tags: [{Name: 'Survey', ID: '1'}, { Name: 'Iris+', ID: '2'}, { Name: 'Canon S100', ID: '3'}, { Name: 'Foo Bar', ID: '4'}],
        Drone: {
            Name: 'Inspire 1'
        },
        Camera: {
            Name: 'Inspire 1 X5'
        }
    };

    betaPlan: Subscription;

    sampleUserFlightPlans: any = [this.flightPlan1, this.flightPlan2, this.flightPlan3, this.flightPlan4, this.flightPlan5];

    static $inject: Array<string> = [
        'db'
    ];

    constructor(public db: any) {

        this.testCompany.Name = 'DroneSense';
        this.testCompany.Users = [];
        this.testCompany.Users.push(this.sampleUser);
        this.testCompany.Users.push(this.sampleUser1);
        this.testCompany.Users.push(this.sampleUser2);
        this.testCompany.Email = this.sampleUser.Email;
        this.testCompany.Website = 'http://wwww.dronesense.com';
        this.testCompany.Phone = '512-573-2280';

        this.testCompany.MailAddress = new Address();
        
        this.testCompany.Admins = [];
        this.testCompany.Admins.push(this.sampleUser1);

        this.betaPlan = new Subscription();
        this.betaPlan.PlanName = 'DroneSense Beta';
        this.betaPlan.BillingFrequency = 'Monthly';
        
        this.testCompany.Plan = this.betaPlan;

        // Return mock data here
        this.user = this.sampleUser;
        this.currentAccount = this.testCompany;
        this.accountsLoaded = true;

        this.flightPlansLoaded = true;
        this.flightPlans = this.sampleUserFlightPlans;

    }

    getFlightPlanTags(): Promise<Array<string>> {
        return new Promise<Array<string>>((resolve, reject) => {
            _.union(this.flightPlan1.Tags, this.flightPlan2.Tags, this.flightPlan3.Tags, this.flightPlan4.Tags, this.flightPlan5.Tags);
        });
    }

    getCurrentAccount(): Promise<Account> {

        return new Promise<Account>((resolve, reject) => {
            if (this.accountsLoaded) {
                // TODO remove only for testing this.setActiveAccount();
                resolve(this.currentAccount);
            } else {
                this.getAccounts().then((accounts: Array<Account>) => {
                    this.setActiveAccount();
                    resolve(this.currentAccount);
                });
            }
        });

    }

    getAccountFlightPlanTags(): Promise<Array<Tag>> {
                return new Promise<Array<Tag>>((resolve, reject) => {

            let foo: any;
            foo = [{ Name: 'Survey', ID: '1'}, { Name: 'Orbit', ID: '2'}, { Name: 'Waypoint', ID: '3'}, { Name: 'Foo', ID: '4'}];
            return resolve(foo);
        }); 
    }

    private setActiveAccount(): void {
        if (this.accountsLoaded && this.user) {
            this.accounts.forEach((account: Account): void => {
                if (this.user.LastLoadedAccountName === account.Name) {
                    this.currentAccount = account;
                }
            });
            // Handle case where the current account didn't get set because of no match
            if (!this.currentAccount) {
                if (this.accounts[0]) {
                    this.currentAccount = this.accounts[0];
                }
            }
        }
    }

    private getAccounts(): Promise<Array<Account>> {
        return new Promise<Array<Account>>((resolve, reject) => {
            if (this.accountsLoaded) {
                return resolve(this.accounts);
            } else {
                this.accountsHandle = this.db.accounts.getAccountsForUser(this.user);

                this.accountsHandle.once(this.accountsHandle.EVENTS.ACCOUNT_LIST_CHANGED, (data: any): void => {
                    
                    data.forEach((handle: any, index: number): void => {
                        this.addAccount(handle);
                    });
                    
                    // Set loaded flag
                    this.accountsLoaded = true;

                    // Wire up on list changed callback
                    this.listenForAccountChanges();

                    // Resolve with flight plans array
                    return resolve(this.accounts);
                });
            }
        });
    }

    getUser(): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            if (this.user) {
                return resolve(this.user);
            } else {
                this.userHandle = this.db.users.getHandleForSession();

                this.userHandle.once(this.userHandle.EVENTS.DATA_CHANGED, (data: any): void => {
                    if (data) {
                        this.user = new User(data.handle);
                        return resolve(this.user);

                    } else {
                        return reject('No user returned.');
                    }
                });
            }
        });
    }

    getUserFlightPlans(): Promise<Array<FlightPlan>> {
        return new Promise<Array<FlightPlan>>((resolve, reject) => {
            if (this.flightPlansLoaded) {
                return resolve(this.flightPlans);
            } else {

                this.flightPlansHandle = this.db.flightplans.getFlightPlansForUser();

                // Call once on the handle for the initial flight plan load
                this.flightPlansHandle.once(this.flightPlansHandle.EVENTS.FLIGHTPLAN_LIST_CHANGED, (data: any): void => {

                    data.forEach((handle: any, index: number): void => {
                        this.addFlightPlan(handle);
                    });
                    
                    // Set loaded flag
                    this.flightPlansLoaded = true;

                    // Wire up on list changed callback
                    //this.listenForFlightPlanChanges();

                    // Resolve with flight plans array
                    return resolve(this.flightPlans);
                });

            }
        });
    }

    // Log the user out
    logout(): void {
        this.db.logout();
    }

    // Log the user in
    login(): void {
        this.db.login();
    }

    private addAccount(account: Account): void {
        this.accounts.push(account);
    }

    // Wire up the on flight plan list changed lisenter
    private listenForAccountChanges(): void {
        
        this.flightPlansHandle.on(this.flightPlansHandle.EVENTS.FLIGHTPLAN_LIST_CHANGED, (data: any): void => {
            
            this.handleListChanged(data);
        });
    }

    // Wire up the on flight plan list changed lisenter
    private listenForFlightPlanChanges(): void {
        
        this.flightPlansHandle.on(this.flightPlansHandle.EVENTS.FLIGHTPLAN_LIST_CHANGED, (data: any): void => {
            
            this.handleListChanged(data);
        });
    }

    // Handles any firebase callbacks that the flight plan list has been updated by an add or delete
    private handleListChanged(data: any): void {

        // first check for delete by comparing length
        if (data.length < this.flightPlans.length) {

            let deleteList: Array<FlightPlan> = [];

            this.flightPlans.forEach((flightPlan: FlightPlan): void => {
                if (_.findIndex(data, (handle: any): boolean => {
                        return flightPlan.handle.id === handle.id;
                    }) === -1) {
                    deleteList.push(flightPlan);
                }
            });

            deleteList.forEach((flightPlan: FlightPlan): void => {
                this.deleteFlightPlan(flightPlan);
            });

            return;
        }

        // figure out if it is an add or delete
        data.forEach((handle: any, index: number): void => {
            let position: number = _.findIndex(this.flightPlans, (flightPlan: FlightPlan): boolean => {
                return flightPlan.handle.id === handle.id;
            });

            // add if it doesn't exist in command
            if (position === -1) {
                this.addFlightPlan(handle);
                return;
            }
        });

    }

    // Add flight plan from database callback event
    private addFlightPlan(data: any): void {

        let flightPlan: FlightPlan;

        flightPlan = new FlightPlan(data);

        this.flightPlans.push(flightPlan);
    }

    // Delete flight plan from database callback event
    private deleteFlightPlan(flightPlan: FlightPlan): void {

        // Unwire events
        flightPlan.RemoveHandle();

        var index: number = _.findIndex(this.flightPlans, (com: any): boolean => {
            return flightPlan.handle.id === com.id;
        });

        if (index === -1) {
            throw 'Flight Plan not found for deletion.';
        }

        this.flightPlans.splice(index, 1);

        // throw event to update UI.
    }

}

export default angular.module('DroneSense.Web.DataService', [

]).service('dataService', DataService);
