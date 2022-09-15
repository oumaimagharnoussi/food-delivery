// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  server: 'http://localhost:8000',

  sse_server: 'http://localhost:3000',

  api_url: 'http://localhost:8000/api/',

  firebase :{
    apiKey: "AIzaSyC9Y1XY7jFJCvB5Wt3_EEUc-BETpOWbQXc",
    authDomain: "delivery-app-b0d50.firebaseapp.com",
    projectId: "delivery-app-b0d50",
    storageBucket: "delivery-app-b0d50.appspot.com",
    messagingSenderId: "96743398709",
    appId: "1:96743398709:web:1d6f572bed7ed21059007c",
    measurementId: "G-KMSECRKKWY"
  }
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
