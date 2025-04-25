import '/auth/firebase_auth/auth_util.dart';
import '/backend/api_requests/api_calls.dart';
import '/backend/api_requests/api_manager.dart';
import '/backend/backend.dart';
import '/backend/schema/enums/enums.dart';
import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';

Future syncNow(BuildContext context) async {
  ApiCallResponse? tokenRefreshOutput;
  ApiCallResponse? dataRunOutput;

  FFAppState().apiPayload = <String, dynamic>{
    'target_api': 'token_refresh',
    'payload': <String, String?>{
      'data_source': 'strava',
    },
  };
  tokenRefreshOutput = await APIRouterCall.call(
    apiPayloadJson: FFAppState().apiPayload,
    authToken: currentJwtToken,
  );

  if ((tokenRefreshOutput?.succeeded ?? true)) {
    FFAppState().apiPayload = <String, dynamic>{
      'target_api': 'data_run',
      'payload': <String, String?>{
        'data_source': 'strava',
      },
    };
    dataRunOutput = await APIRouterCall.call(
      apiPayloadJson: FFAppState().apiPayload,
      authToken: currentJwtToken,
    );

    return;
  } else {
    await showDialog(
      context: context,
      builder: (alertDialogContext) {
        return AlertDialog(
          title: Text('App Status'),
          content: Text('Token Refresh Failed'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(alertDialogContext),
              child: Text('Ok'),
            ),
          ],
        );
      },
    );
    return;
  }
}

/// Refresh Token for Strava in Firebase
Future tokenRefresh(
  BuildContext context, {
  String? datasource,
}) async {
  ApiCallResponse? tokenRefresh;

  FFAppState().apiPayload = <String, dynamic>{
    'target_api': 'token_refresh',
    'payload': <String, String?>{
      'data_source': datasource,
    },
  };
  tokenRefresh = await APIRouterCall.call(
    apiPayloadJson: FFAppState().apiPayload,
    authToken: currentJwtToken,
  );
}

/// Update Stream/Integration App State
Future updateState(BuildContext context) async {
  FFAppState().apiPayload = <String, dynamic>{
    'target_api': 'token_refresh',
    'payload': <String, String?>{
      'data_source': 'strava',
    },
  };
}
