// Automatic FlutterFlow imports
import '/backend/backend.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'index.dart'; // Imports other custom actions
import 'package:flutter/material.dart';
// Begin custom action code
// DO NOT REMOVE OR MODIFY THE CODE ABOVE!

import 'package:url_launcher/url_launcher.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

Future stravaAuthAction(BuildContext context) async {
  print('StravaAuthAction: Starting authentication process');

  const clientId = '144789';
  const redirectUri = 'https://dev.fitnessllm.app/strava-callback';
  const responseType = 'code';
  const scope = 'read,activity:read_all,profile:read_all';

  final url = Uri.https('www.strava.com', '/oauth/authorize', {
    'client_id': clientId,
    'redirect_uri': redirectUri,
    'response_type': responseType,
    'scope': scope,
    'approval_prompt': 'auto',
  });

  print('StravaAuthAction: Generated auth URL: $url');

  try {
    if (await canLaunchUrl(url)) {
      print('StravaAuthAction: Launching URL');
      if (kIsWeb) {
        // For web, use window.open approach
        await launchUrl(
          url,
          webOnlyWindowName: '_self',
          mode: LaunchMode.platformDefault,
        );
      } else {
        // For mobile platforms
        await launchUrl(
          url,
          mode: LaunchMode.externalApplication,
        );
      }
    } else {
      print('StravaAuthAction: Could not launch URL');
      throw Exception('Could not launch Strava authorization URL');
    }
  } catch (e) {
    print('StravaAuthAction: Error launching URL: $e');
    throw Exception('Error launching Strava authorization: $e');
  }
}
