import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';

Future initFirebase() async {
  if (kIsWeb) {
    await Firebase.initializeApp(
        options: FirebaseOptions(
            apiKey: "AIzaSyCu5Lf5E7MxuSUYR5T7zqUo9HNLFaD1530",
            authDomain: "stable-splicer-447620-b4.firebaseapp.com",
            projectId: "stable-splicer-447620-b4",
            storageBucket: "stable-splicer-447620-b4.firebasestorage.app",
            messagingSenderId: "413377316902",
            appId: "1:413377316902:web:505f5448bc023e68fabee7"));
  } else {
    await Firebase.initializeApp();
  }
}
