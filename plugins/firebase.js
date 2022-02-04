import { initializeApp, getApps } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
const config = require("../firebaseConfig.js");

const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId,
  appId: config.firebase.appId,
  measurementId: config.firebase.measurementId,
};

const apps = getApps();
let firebaseApp;
if (!apps.length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = apps[0];
}

const db = getFirestore();

if (process.env.NODE_ENV === "production") {
  enableIndexedDbPersistence(db, {
    experimentalTabSynchronization: true,
  }).catch((err) => {
    if (err.code == "failed-precondition") {
      console.log("err", err);
    } else if (err.code == "unimplemented") {
      console.log("err", err);
    }
  });
}

export { db };
