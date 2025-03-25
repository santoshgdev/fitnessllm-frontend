// Automatic FlutterFlow imports
import '/backend/backend.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'index.dart'; // Imports other custom actions
import 'package:flutter/material.dart';
// Begin custom action code
// DO NOT REMOVE OR MODIFY THE CODE ABOVE!

import 'package:url_launcher/url_launcher.dart';

Future stravaAuthAction() async {
  // Your Strava application credentials
  const clientId = '144789'; // Replace with your actual client ID
  const redirectUri =
      'https://dev.fitnessllm.app/strava-callback'; // Your verified redirect URI
  const scope =
      'read,activity:read_all,profile:read_all'; // Required permissions

  // Build the authorization URL
  final authorizationUrl = Uri.parse('https://www.strava.com/oauth/authorize'
          '?client_id=$clientId'
          '&redirect_uri=${Uri.encodeComponent(redirectUri)}'
          '&response_type=code'
          '&approval_prompt=auto'
          '&scope=${Uri.encodeComponent(scope)}')
      .toString();

  // Launch the URL in browser
  if (await canLaunch(authorizationUrl)) {
    await launch(
      authorizationUrl,
      webOnlyWindowName: '_self', // Important for web apps
    );
  } else {
    throw 'Could not launch Strava authorization';
  }
}
