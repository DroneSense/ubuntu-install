System.register(['@dronesense/model', 'lodash'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var model_1, lodash_1;
    var DataService;
    return {
        setters:[
            function (model_1_1) {
                model_1 = model_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            // Data service is responsible for loading data and returning to the UI for binding.  It will hold the objects across views so that
            // subsequent model creation is not necessary if the data has already been return and loaded into a model.
            DataService = (function () {
                function DataService(db) {
                    this.db = db;
                    this.accountsLoaded = false;
                    this.flightPlans = [];
                    this.flightPlansLoaded = false;
                    this.defaultIndividualAccount = {
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
                    this.testCompany = new model_1.Account();
                    this.defaultCompanyAccount = {
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
                    this.sampleUser = {
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
                    this.sampleUser1 = {
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
                    this.sampleUser2 = {
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
                    this.flightPlan1 = {
                        Name: 'XYZ CORP. #002-MOUNTAIN PASS-00001',
                        LocationName: 'Austin, Texas',
                        CreateDate: new Date('8/17/2016'),
                        ScheduledDate: new Date('8/19/2016'),
                        CreatedUser: this.sampleUser,
                        Owners: [this.sampleUser],
                        ThumbnailUrl: 'blah.com/image',
                        Tags: ['Survey', 'Iris+', 'Canon S100', 'Foo Bar']
                    };
                    this.flightPlan2 = {
                        Name: 'ABC CORP. #002-MOUNTAIN PASS-00001',
                        LocationName: 'Foobar, Texas',
                        CreateDate: new Date('8/19/2016'),
                        ScheduledDate: new Date('10/19/2016'),
                        CreatedUser: this.sampleUser,
                        Owners: [this.sampleUser],
                        ThumbnailUrl: 'blah.com/image',
                        Tags: ['Survey', 'Phantom 4', 'Nikon S100', 'Foo Bar', 'Hello', 'Bar', 'Apple', 'Oragne', 'Chris']
                    };
                    this.flightPlan3 = {
                        Name: 'Orbit Work around Chase Tower',
                        LocationName: 'Dallas, Texas',
                        CreateDate: new Date('8/17/2015'),
                        ScheduledDate: new Date('8/19/2016'),
                        CreatedUser: this.sampleUser,
                        Owners: [this.sampleUser],
                        ThumbnailUrl: 'blah.com/image',
                        Tags: ['Orbit', 'Phantom 4', 'Nikon S100', 'Foo Bar']
                    };
                    this.flightPlan4 = {
                        Name: 'Capital Survey',
                        LocationName: 'Austin, Texas',
                        CreateDate: new Date('8/17/2016'),
                        ScheduledDate: new Date('8/19/2016'),
                        CreatedUser: this.sampleUser,
                        Owners: [this.sampleUser],
                        ThumbnailUrl: 'blah.com/image',
                        Tags: ['Orbit', 'Phantom 4', 'Nikon S100', 'Foo Bar']
                    };
                    this.flightPlan5 = {
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
                        Tags: [{ Name: 'Survey', ID: '1' }, { Name: 'Iris+', ID: '2' }, { Name: 'Canon S100', ID: '3' }, { Name: 'Foo Bar', ID: '4' }],
                        Drone: {
                            Name: 'Inspire 1'
                        },
                        Camera: {
                            Name: 'Inspire 1 X5'
                        }
                    };
                    this.sampleUserFlightPlans = [this.flightPlan1, this.flightPlan2, this.flightPlan3, this.flightPlan4, this.flightPlan5];
                    this.testCompany.Name = 'DroneSense';
                    this.testCompany.Users = [];
                    this.testCompany.Users.push(this.sampleUser);
                    this.testCompany.Users.push(this.sampleUser1);
                    this.testCompany.Users.push(this.sampleUser2);
                    this.testCompany.Email = this.sampleUser.Email;
                    this.testCompany.Website = 'http://wwww.dronesense.com';
                    this.testCompany.Phone = '512-573-2280';
                    this.testCompany.MailAddress = new model_1.Address();
                    this.testCompany.Admins = [];
                    this.testCompany.Admins.push(this.sampleUser1);
                    this.betaPlan = new model_1.Subscription();
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
                DataService.prototype.getFlightPlanTags = function () {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        lodash_1.default.union(_this.flightPlan1.Tags, _this.flightPlan2.Tags, _this.flightPlan3.Tags, _this.flightPlan4.Tags, _this.flightPlan5.Tags);
                    });
                };
                DataService.prototype.getCurrentAccount = function () {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        if (_this.accountsLoaded) {
                            // TODO remove only for testing this.setActiveAccount();
                            resolve(_this.currentAccount);
                        }
                        else {
                            _this.getAccounts().then(function (accounts) {
                                _this.setActiveAccount();
                                resolve(_this.currentAccount);
                            });
                        }
                    });
                };
                DataService.prototype.getAccountFlightPlanTags = function () {
                    return new Promise(function (resolve, reject) {
                        var foo;
                        foo = [{ Name: 'Survey', ID: '1' }, { Name: 'Orbit', ID: '2' }, { Name: 'Waypoint', ID: '3' }, { Name: 'Foo', ID: '4' }];
                        return resolve(foo);
                    });
                };
                DataService.prototype.setActiveAccount = function () {
                    var _this = this;
                    if (this.accountsLoaded && this.user) {
                        this.accounts.forEach(function (account) {
                            if (_this.user.LastLoadedAccountName === account.Name) {
                                _this.currentAccount = account;
                            }
                        });
                        // Handle case where the current account didn't get set because of no match
                        if (!this.currentAccount) {
                            if (this.accounts[0]) {
                                this.currentAccount = this.accounts[0];
                            }
                        }
                    }
                };
                DataService.prototype.getAccounts = function () {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        if (_this.accountsLoaded) {
                            return resolve(_this.accounts);
                        }
                        else {
                            _this.accountsHandle = _this.db.accounts.getAccountsForUser(_this.user);
                            _this.accountsHandle.once(_this.accountsHandle.EVENTS.ACCOUNT_LIST_CHANGED, function (data) {
                                data.forEach(function (handle, index) {
                                    _this.addAccount(handle);
                                });
                                // Set loaded flag
                                _this.accountsLoaded = true;
                                // Wire up on list changed callback
                                _this.listenForAccountChanges();
                                // Resolve with flight plans array
                                return resolve(_this.accounts);
                            });
                        }
                    });
                };
                DataService.prototype.getUser = function () {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        if (_this.user) {
                            return resolve(_this.user);
                        }
                        else {
                            _this.userHandle = _this.db.users.getHandleForSession();
                            _this.userHandle.once(_this.userHandle.EVENTS.DATA_CHANGED, function (data) {
                                if (data) {
                                    _this.user = new model_1.User(data.handle);
                                    return resolve(_this.user);
                                }
                                else {
                                    return reject('No user returned.');
                                }
                            });
                        }
                    });
                };
                DataService.prototype.getUserFlightPlans = function () {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        if (_this.flightPlansLoaded) {
                            return resolve(_this.flightPlans);
                        }
                        else {
                            _this.flightPlansHandle = _this.db.flightplans.getFlightPlansForUser();
                            // Call once on the handle for the initial flight plan load
                            _this.flightPlansHandle.once(_this.flightPlansHandle.EVENTS.FLIGHTPLAN_LIST_CHANGED, function (data) {
                                data.forEach(function (handle, index) {
                                    _this.addFlightPlan(handle);
                                });
                                // Set loaded flag
                                _this.flightPlansLoaded = true;
                                // Wire up on list changed callback
                                //this.listenForFlightPlanChanges();
                                // Resolve with flight plans array
                                return resolve(_this.flightPlans);
                            });
                        }
                    });
                };
                // Log the user out
                DataService.prototype.logout = function () {
                    this.db.logout();
                };
                // Log the user in
                DataService.prototype.login = function () {
                    this.db.login();
                };
                DataService.prototype.addAccount = function (account) {
                    this.accounts.push(account);
                };
                // Wire up the on flight plan list changed lisenter
                DataService.prototype.listenForAccountChanges = function () {
                    var _this = this;
                    this.flightPlansHandle.on(this.flightPlansHandle.EVENTS.FLIGHTPLAN_LIST_CHANGED, function (data) {
                        _this.handleListChanged(data);
                    });
                };
                // Wire up the on flight plan list changed lisenter
                DataService.prototype.listenForFlightPlanChanges = function () {
                    var _this = this;
                    this.flightPlansHandle.on(this.flightPlansHandle.EVENTS.FLIGHTPLAN_LIST_CHANGED, function (data) {
                        _this.handleListChanged(data);
                    });
                };
                // Handles any firebase callbacks that the flight plan list has been updated by an add or delete
                DataService.prototype.handleListChanged = function (data) {
                    var _this = this;
                    // first check for delete by comparing length
                    if (data.length < this.flightPlans.length) {
                        var deleteList_1 = [];
                        this.flightPlans.forEach(function (flightPlan) {
                            if (lodash_1.default.findIndex(data, function (handle) {
                                return flightPlan.handle.id === handle.id;
                            }) === -1) {
                                deleteList_1.push(flightPlan);
                            }
                        });
                        deleteList_1.forEach(function (flightPlan) {
                            _this.deleteFlightPlan(flightPlan);
                        });
                        return;
                    }
                    // figure out if it is an add or delete
                    data.forEach(function (handle, index) {
                        var position = lodash_1.default.findIndex(_this.flightPlans, function (flightPlan) {
                            return flightPlan.handle.id === handle.id;
                        });
                        // add if it doesn't exist in command
                        if (position === -1) {
                            _this.addFlightPlan(handle);
                            return;
                        }
                    });
                };
                // Add flight plan from database callback event
                DataService.prototype.addFlightPlan = function (data) {
                    var flightPlan;
                    flightPlan = new model_1.FlightPlan(data);
                    this.flightPlans.push(flightPlan);
                };
                // Delete flight plan from database callback event
                DataService.prototype.deleteFlightPlan = function (flightPlan) {
                    // Unwire events
                    flightPlan.RemoveHandle();
                    var index = lodash_1.default.findIndex(this.flightPlans, function (com) {
                        return flightPlan.handle.id === com.id;
                    });
                    if (index === -1) {
                        throw 'Flight Plan not found for deletion.';
                    }
                    this.flightPlans.splice(index, 1);
                    // throw event to update UI.
                };
                DataService.$inject = [
                    'db'
                ];
                return DataService;
            }());
            exports_1("default",angular.module('DroneSense.Web.DataService', []).service('dataService', DataService));
        }
    }
});

//# sourceMappingURL=dataService.js.map
