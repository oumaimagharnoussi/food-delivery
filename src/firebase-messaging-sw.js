importScripts('https://www.gstatic.com/firebasejs/8.3.3/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.3.3/firebase-messaging.js')


  // Initialize Firebase
  firebase.initializeApp(
    {
        apiKey: "AIzaSyC9Y1XY7jFJCvB5Wt3_EEUc-BETpOWbQXc",
        authDomain: "delivery-app-b0d50.firebaseapp.com",
        projectId: "delivery-app-b0d50",
        storageBucket: "delivery-app-b0d50.appspot.com",
        messagingSenderId: "96743398709",
        appId: "1:96743398709:web:1d6f572bed7ed21059007c",
        measurementId: "G-KMSECRKKWY"
      }
  );

  const messaging =firebase.messaging();