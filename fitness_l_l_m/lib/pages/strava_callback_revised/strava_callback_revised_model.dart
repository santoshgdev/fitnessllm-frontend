import '/backend/custom_cloud_functions/custom_cloud_function_response_manager.dart';
import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import 'dart:ui';
import '/custom_code/widgets/index.dart' as custom_widgets;
import '/index.dart';
import 'strava_callback_revised_widget.dart' show StravaCallbackRevisedWidget;
import 'package:cloud_functions/cloud_functions.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

class StravaCallbackRevisedModel
    extends FlutterFlowModel<StravaCallbackRevisedWidget> {
  ///  State fields for stateful widgets in this page.

  // Stores action output result for [Cloud Function - stravaAuthInitiate] action in Strava_callback_revised widget.
  StravaAuthInitiateCloudFunctionCallResponse? cloudFunctionk75;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}

  /// Action blocks.
  Future onPageLoad(BuildContext context) async {
    FFAppState().isStravaConnected = true;
  }
}
