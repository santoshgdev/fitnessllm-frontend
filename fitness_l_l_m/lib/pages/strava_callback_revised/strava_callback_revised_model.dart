import '/auth/firebase_auth/auth_util.dart';
import '/backend/api_requests/api_calls.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import 'dart:ui';
import '/index.dart';
import 'strava_callback_revised_widget.dart' show StravaCallbackRevisedWidget;
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

class StravaCallbackRevisedModel
    extends FlutterFlowModel<StravaCallbackRevisedWidget> {
  ///  Local state fields for this page.

  dynamic pageLevelApiPayload;

  bool isLoading = false;

  ///  State fields for stateful widgets in this page.

  // Stores action output result for [Backend Call - API (API Router)] action in Strava_callback_revised widget.
  ApiCallResponse? apiResponse;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}

  /// Action blocks.
  Future isStravaConnectedPageStateUpdate(BuildContext context) async {
    FFAppState().isStravaConnected = true;
  }

  Future updatePayloadPageState(BuildContext context) async {
    FFAppState().apiPayload = <String, String?>{
      'target_api': 'strava_auth_initiate',
      'code': widget!.code,
    };
  }
}
