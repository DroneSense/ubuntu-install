System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Translations;
    return {
        setters:[],
        execute: function() {
            Translations = (function () {
                function Translations() {
                }
                Translations.en = {
                    ACCOUNT: {
                        ACCOUNTSETTINGS: 'Account Settings',
                        ACCOUNTINFORMATION: 'Account Information',
                        ACCOUNTDETAILS: 'Your Account Details',
                        COMPANYINFORMATION: 'Company Information',
                        YOURORGANIZATIONDETAILS: 'Your Organization Details',
                        ACCOUNTNAME: 'Account Name',
                        ACCOUNTTYPE: 'Account Type',
                        COMPANYNAME: 'Company Name',
                        PRIMARYEMAILADDRESS: 'Primary Email Address',
                        WEBSITE: 'Website',
                        COMPANYPHONENUMBER: 'Company Phone',
                        ADMIN: 'Admin(s)',
                        COMPANYAVATAR: 'Company Avatar',
                        ADDCOMPANYLOGO: 'Add your company logo or avatar',
                        UPLOAD: 'Upload',
                        MAILINGBILLING: 'Mailing & Billing Address',
                        MAILINGBILLINGDESC: 'Where we send your bills and your mail to',
                        MAILINGADDRESS1: 'Mailing Address 1',
                        MAILINGADDRESS2: 'Mailing Address 2',
                        CITY: 'City',
                        COUNTRY: 'Country',
                        STATE: 'State',
                        POSTALCODE: 'Postal Code',
                        BILLINGADDRESS: 'Billing Address',
                        BILLINGADDRESS1: 'Billing Address 1',
                        BILLINGADDRESS2: 'Billing Address 2',
                        USEMAILINGADDRESS: 'Use Mailing Address',
                        PLANBILLING: 'Plan and Billing'
                    },
                    TABS: {
                        DASHBOARD: 'Dashboard',
                        FLIGHTPLANS: 'Flight Plans',
                        HARDWARE: 'Hardware',
                        PILOTS: 'Pilots',
                        CHECKLISTS: 'Checklists',
                        DOCUMENTS: 'Documents',
                        MODELS: '3D Models',
                        SCHEDULES: 'Schedules',
                        MYPROFILE: 'My Profile',
                        MANAGEACCOUNT: 'Manage Account',
                        SIGNOUT: 'Sign Out'
                    },
                    PROFILE: {
                        MYPROFILE: 'My Profile',
                        PERSONALINFORMATION: 'Personal Information',
                        YOURPERSONALDETAILS: 'Your personal details',
                        FIRSTNAME: 'First Name',
                        LASTNAME: 'Last Name',
                        EMAIL: 'Email',
                        ADDRESS1: 'Address 1',
                        ADDRESS2: 'Address 2',
                        CITY: 'City',
                        STATE: 'State',
                        COUNTRY: 'Country',
                        PHONE: 'Phone',
                        ROLE: 'Role',
                        CERTIFICATETYPE: 'Certificate Type',
                        CERTIFICATENO: 'Certificate #',
                        ACCOUNTTYPE: 'Account Type',
                        AVATAR: 'Avatar',
                        EMPLOYEDSINCE: 'Employed since January 21, 2010',
                        UPLOAD: 'Upload',
                        CANCEL: 'Cancel',
                        SAVE: 'Save',
                        USERSETTINGS: 'User Settings',
                        SELECTUSERPREFERENCES: 'Select User Preferences',
                        TIMEZONE: 'Time Zone',
                        UNITPREFS: 'Unit Preferences',
                        COORDINATEPREFS: 'Coordinate Preferences',
                        PASSWORDHEADING: 'Password',
                        CHANGEPASSWORDHEADING: 'Change Your Password',
                        CURRENTPASSWORD: 'Current Password',
                        NEWPASSWORD: 'New Password',
                        CONFIRMPASSWORD: 'Confirm Password',
                        UPDATE: 'Update',
                        HIREDATE: 'Hire Date',
                        ZIP: 'Zip',
                        ADDAVATAR: 'Add a profile logo or avatar.'
                    },
                    FLIGHTPLANDETAIL: {
                        LASTEDITEDBY: 'Last Edited By',
                        LASTEDITDAY: 'Last Edit Day',
                        STARTTIME: 'Start Time',
                        ENDTIME: 'End Time',
                        STARTLOCATION: 'Start Location',
                        PILOT: 'Pilot',
                        OBSERVER: 'Observer',
                        DRONE: 'Drone',
                        BATTERY: 'Battery',
                        CAMERA: 'Camera',
                        CONTROLLER: 'Controller',
                        NOTES: 'Notes',
                        EDITFLIGHT: 'Edit Flight',
                        FLYNOW: 'Fly Now'
                    },
                    FLIGHTPLANDETAILS: {
                        FLIGHTINFO: 'FLIGHT INFO',
                        FLIGHTDATE: 'Date of Flight',
                        FLIGHTTIME: 'Time of Flight',
                        TOTALFLIGHTTIME: 'Total Flight Time',
                        TOTALFLIGHTDISTANCE: 'Total Flight Distance',
                        HIGHELEVATION: 'High Elevation',
                        LOWELEVATION: 'Low Elevation',
                        WAYPOINTCOUNT: 'Waypoint Count',
                        MAXDRONEDISTANCE: 'Max Drone Distance',
                        STARTLOCATION: 'Start Location',
                        DATECREATED: 'Date Created',
                        OWNERS: 'Owners',
                        DRONE: 'Drone',
                        BATTERY: 'Battery',
                        CAMERA: 'Camera',
                        SENSOR: 'Sensor',
                        NOTES: 'Notes',
                        EDIT: 'Edit',
                        FLYNOW: 'Fly Now',
                        STARTLATLNG: 'Start Lat/Lng',
                        DATEMODIFIED: 'Date Modified',
                        USERMODIFIED: 'Modified by',
                        USERCREATED: 'Created by'
                    },
                    HARDWAREDETAIL: {
                        MANUFACTURER: 'Manufacturer',
                        SERIALNUMBER: 'Serial Number',
                        MODELTYPE: 'Model Type',
                        FAAREGISTRATION: 'FAA Registration Number',
                        MODELNUMBER: 'Model Number',
                        OWNER: 'Owner',
                        STATUS: 'Status',
                        TOTALFLIGHTTIME: 'Total Flight Time',
                        AIRWORTHY: 'Airworthy',
                        PREFLIGHTCHECKLIST: 'Pre-Flight Checklist',
                        SERVICEHISTORY: 'Service History',
                        DOCUMENTS: 'Documents',
                        NOTES: 'Notes',
                        EDIT: 'Edit'
                    },
                    MODEL: {
                        UPLOADEDBY: 'Uploaded by',
                        UPLOADDATE: 'Upload Date',
                        LASTMODIFIED: 'Last Modified',
                        POLYGONCOUNT: 'Polygon Count',
                        MATERIALCOUNT: 'Material Count',
                        SKPFILESIZE: '.SKP File size',
                        DESCRIPTION: 'Description',
                        LABELS: 'Labels',
                        NOTES: 'Notes',
                        EDIT: 'Edit',
                        SCHEDULES: 'Schedules'
                    },
                    DOCUMENTSUPLOAD: {
                        UPLOADDOCUMENTS: 'Upload Documents',
                        UPLOADINSTRUCTIONS: 'Drag and drop the documents you want to upload or',
                        CANCEL: 'Cancel',
                        DONE: 'Done',
                        BROWSE: 'browse',
                        SUGGESTEDDOCTYPES: 'Including Exemptions, Insurance, or Regulatory Documents',
                        DOCUMENTNAME: 'Document Name',
                        DOCUMENTTYPE: 'Document Type'
                    },
                    MODELUPLOAD: {
                        UPLOADMODEL: 'Upload 3D Models',
                        UPLOADINSTRUCTIONS: 'Drag and drop the 3D Models you want to upload or ',
                        BROWSE: 'browse',
                        SUGGESTEDMODELTYPES: 'File types accepted: SKP, KMZ, OBJ - Maximum upload size is 50 MB',
                        MODELNAME: '3D Model Title',
                        MODELTYPE: '3D Model Description',
                        CANCEL: 'Cancel',
                        UPLOAD: 'Upload'
                    },
                    DETAILSDRONE: {
                        DRONEDETAILS: 'Drone Details',
                        DRONENAME: 'Drone Name',
                        MANUFACTURER: 'Manufacturer',
                        MODEL: 'Model',
                        SERIALNO: 'Serial No.',
                        TOTALHOURS: 'Total Hours',
                        AIRWORTHY: 'Airworthy',
                        LASTSERVICED: 'Last Serviced',
                        NOTES: 'Notes',
                        CANCEL: 'Cancel',
                        SAVE: 'Save'
                    },
                    DETAILSBATTERY: {
                        BATTERYDETAILS: 'Battery Details',
                        BATTERYNAME: 'Battery Name',
                        BATTERYTYPE: 'Battery Type',
                        CAPACITY: 'Capacity',
                        SERIALNO: 'Serial No.',
                        MODEL: 'Model',
                        TOTALHOURS: 'Total Hours',
                        LASTSERVICED: 'Last Serviced',
                        NOTES: 'Notes',
                        CANCEL: 'Cancel',
                        SAVE: 'Save'
                    },
                    DETAILSSENSOR: {
                        SENSORDETAILS: 'Sensor Details',
                        SENSORNAME: 'Sensor Name',
                        SENSORTYPE: 'Sensor Type',
                        PARTOF: 'Part of / Link to',
                        SERIALNO: 'Serial No.',
                        MODEL: 'Model',
                        OWNER: 'Owner',
                        NOTES: 'Notes',
                        CANCEL: 'Cancel',
                        SAVE: 'Save'
                    },
                    ADDPILOT: {
                        FLIGHTPLAN: 'Flight Plan',
                        ASSIGNPERSON: 'Select Person to Assign',
                        ACCEPT: 'Accept'
                    },
                    INVITE: {
                        INVITETODRONESENSE: 'Invite to DroneSense',
                        INVITEEMAIL: 'Invite by Email',
                        ROLE: 'Role',
                        INVITE: 'Invite'
                    },
                    FLIGHTPLAN: {
                        CHOOSEFLIGHTPLAN: 'CHOOSE WHICH FLIGHT PLAN IS RIGHT FOR YOU',
                        FREEPLAN: 'FREE',
                        PLANFEATURES: 'Plan Features',
                        SELECT: 'Select',
                        MOSTPOPULARPLAN: 'Most Popular Plan',
                        FREEFEATURE1: 'Feature 1',
                        FREEFEATURE2: 'Feature 2',
                        BASICPLAN: 'BASIC',
                        BASICFEATURE1: 'Feature 1',
                        BASICFEATURE2: 'Feature 2',
                        BASICFEATURE3: 'Feature 3',
                        ADVANCEDPLAN: 'ADVANCED',
                        ADVANCEDFEATURE1: 'Feature 1',
                        ADVANCEDFEATURE2: 'Feature 2',
                        ADVANCEDFEATURE3: 'Feature 3',
                        ADVANCEDFEATURE4: 'Feature 4',
                        PROPLAN: 'PRO',
                        PROFEATURE1: 'Feature 1',
                        PROFEATURE2: 'Feature 2',
                        PROFEATURE3: 'Feature 3',
                        PROFEATURE4: 'Feature 4',
                        PROFEATURE5: 'Feature 5',
                    },
                    REGISTER: {
                        REGISTERFORACCOUNT: 'register for your account',
                        FIRSTNAME: 'First Name',
                        LASTNAME: 'Last Name',
                        EMAIL: 'Email',
                        CREATEPASSWORD: 'Create Password',
                        CONFIRMPASSWORD: 'Confirm Password',
                        PHONE: 'Phone',
                        NUMBERPILOTS: '# of Pilots',
                        INDUSTRY: 'What Industry?',
                        CREATEACCOUNT: 'Create My Account',
                        SIGNUPGOOGLE: 'Sign Up with Google',
                        SIGNUPFACEBOOK: 'Sign Up with Facebook',
                        ALREADYHAVEACCOUNT: 'Already have an account? ',
                        SIGNIN: 'Sign In',
                    },
                    CREDITCARD: {
                        YOUHAVECHOSEN: 'You have chosen:',
                        CHOSENPLAN: 'Advanced Flying Plan - $79',
                        ENTERCREDITCARDINFO: 'Please enter your credit card information',
                        CARDNUMBER: 'Card Number',
                        CVV: 'CVV',
                        EXPIRATION: 'Expiration (MM/YY)',
                        ZIPPOSTALCODE: 'Zipcode or Postal Code',
                        FINEPRINT: 'Some fine print about your credit card. This is some more fine print about your credit card. You should always pay your credit card.',
                        CONFIRMPAY: 'Confirm and Pay'
                    },
                    SIGNIN: {
                        SIGNIN: 'Sign in to your account',
                        EMAIL: 'Email Address',
                        PASSWORD: 'Password',
                        FORGOTPASSWORD: 'Forgot Password?',
                        SIGNINBUTTON: 'Sign In',
                        SIGNINGOOGLE: 'Sign In with Google',
                        SIGNINFACEBOOK: 'Sign In with Facebook',
                        DONTHAVEACCOUNT: 'Don\'t have an account? ',
                        REGISTER: 'Register'
                    },
                    RECOVERPASSWORD: {
                        PASSWORDRECOVERY: 'Password Recovery',
                        ENTERPASSWORD: 'Please enter the email address you used when creating your account. We will send you a link to reset your password.',
                        EMAIL: 'Email Address',
                        SEND: 'Send',
                        BACKTOLOGIN: 'Back to Login'
                    },
                    PASSWORDSENT: {
                        PASSWORDRECOVERY: 'Password Recovery',
                        PASSWORDSENTMESSAGE: 'An email has been sent to you. Click the link and enter your new password.',
                        DIDNTRECEIVE: 'Didn\'t receive an email?'
                    },
                    SETPASSWORD: {
                        PASSWORDRECOVERY: 'Password Recovery',
                        ENTERNEWPASSWORD: 'Enter your new password',
                        NEWPASSWORD: 'New Password',
                        CONFIRMPASSWORD: 'Confirm Password',
                        RESETPASSWORD: 'Reset My Password'
                    },
                    CONGRATS: {
                        CONGRATS: 'congratulations!',
                        SUCCESSMESSAGE: 'You have successfully reset your password. You may now have access to your account.',
                        GOTOACCOUNT: 'Go to My Account'
                    },
                    EMPLOYEEINFOCARD: {
                        EDITINFO: 'Edit Info',
                        NOTES: 'Notes',
                        HIREDATE: 'Hire Date',
                        ROLE: 'Role',
                        PERMISSIONS: 'Permissions',
                        EMAIL: 'Email',
                        ADDRESS: 'Address',
                        PHONE: 'Phone',
                    },
                    SWITCHACCOUNT: {
                        HEADING: 'SELECT AN ACCOUNT'
                    },
                    CONTROLCONNECT: {
                        TITLE: 'Controller Server Settings',
                        SERVERIP: 'IP Address',
                        SERVERPORT: 'Port',
                        CONNECT: 'Connect',
                        CANCEL: 'Cancel'
                    },
                    CONTROLSERVERERROR: {
                        TITLE: 'Could not connect to server',
                        MESSAGE: 'Ensure your server is turned on and you have the correct settings.',
                        RETRY: 'Retry Connect',
                        CHANGE: 'Change Server Settings'
                    }
                };
                Translations.de = {
                    ACCOUNT: {
                        ACCOUNTSETTINGS: 'Account Einstellungen',
                        COMPANYINFORMATION: 'Firmeninformation',
                        YOURORGANIZATIONDETAILS: 'Ihre Organisation Details',
                        COMPANYNAME: 'Name der Firma'
                    },
                    TABS: {
                        DASHBOARD: 'Instrumententafel',
                        FLIGHTPLANS: 'Flugpläne',
                        HARDWARE: 'Hardware',
                        PILOTS: 'Piloten',
                        CHECKLISTS: 'Checklisten',
                        DOCUMENTS: 'UNTERLAGEN',
                        MODELS: '3D-Modelle',
                        SCHEDULES: 'Zeitpläne'
                    }
                };
                Translations.ch = {
                    TABS: {
                        DASHBOARD: '仪表板',
                        FLIGHTPLANS: '飞行计划',
                        HARDWARE: '硬件',
                        PILOTS: '飞行员',
                        CHECKLISTS: '清单',
                        DOCUMENTS: '文件',
                        MODELS: '楷模',
                        SCHEDULES: '时间表'
                    }
                };
                Translations.sp = {
                    TABS: {
                        DASHBOARD: 'tablero',
                        FLIGHTPLANS: 'planes de vuelo',
                        HARDWARE: 'equipos',
                        PILOTS: 'pilotos',
                        CHECKLISTS: '清单',
                        DOCUMENTS: 'documentos',
                        MODELS: 'modelos 3d',
                        SCHEDULES: 'horarios'
                    }
                };
                return Translations;
            }());
            exports_1("Translations", Translations);
        }
    }
});

//# sourceMappingURL=translations.js.map
