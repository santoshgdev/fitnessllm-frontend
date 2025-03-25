import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'strava_callback_revised_model.dart';
export 'strava_callback_revised_model.dart';

class StravaCallbackRevisedWidget extends StatefulWidget {
  const StravaCallbackRevisedWidget({super.key});

  static String routeName = 'Strava_callback_revised';
  static String routePath = '/strava-callback';

  @override
  State<StravaCallbackRevisedWidget> createState() =>
      _StravaCallbackRevisedWidgetState();
}

class _StravaCallbackRevisedWidgetState
    extends State<StravaCallbackRevisedWidget> {
  late StravaCallbackRevisedModel _model;
  final scaffoldKey = GlobalKey<ScaffoldState>();
  String _status = 'Processing...';
  bool _isError = false;

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => StravaCallbackRevisedModel());
    _handleStravaCallback();
  }

  Future<void> _handleStravaCallback() async {
    try {
      print('Starting Strava callback handling...');
      // Get the authorization code from URL
      final uri = Uri.parse(GoRouter.of(context)
          .routerDelegate
          .currentConfiguration
          .uri
          .toString());
      final code = uri.queryParameters['code'];
      final error = uri.queryParameters['error'];

      print('URI: $uri');
      print('Code: $code');
      print('Error: $error');

      if (error != null) {
        setState(() {
          _status = 'Authorization failed: $error';
          _isError = true;
        });
        return;
      }

      if (code == null) {
        setState(() {
          _status = 'No authorization code received';
          _isError = true;
        });
        return;
      }

      setState(() {
        _status = 'Exchanging authorization code...';
      });

      // Call the Cloud Function
      final callable =
          FirebaseFunctions.instance.httpsCallable('stravaAuthInitiate');
      print('Calling cloud function with code: $code');

      final result = await callable.call({
        'authorizationCode': code,
      });

      print('Cloud function result: $result');

      if (result.data['success'] == true) {
        setState(() {
          _status = 'Authorization successful!';
        });
        // Delay navigation to show success message
        await Future.delayed(Duration(seconds: 2));
        if (mounted) {
          context.goNamed('Logged_in');
        }
      } else {
        setState(() {
          _status = 'Failed to complete authorization';
          _isError = true;
        });
      }
    } catch (e) {
      print('Error in Strava callback: $e');
      setState(() {
        _status = 'Error: ${e.toString()}';
        _isError = true;
      });
    }
  }

  @override
  void dispose() {
    _model.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      child: Scaffold(
        key: scaffoldKey,
        backgroundColor: FlutterFlowTheme.of(context).primaryBackground,
        body: SafeArea(
          top: true,
          child: Column(
            mainAxisSize: MainAxisSize.max,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(24.0, 0.0, 24.0, 0.0),
                child: Column(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Container(
                      width: 100.0,
                      height: 100.0,
                      decoration: BoxDecoration(
                        color: _isError
                            ? FlutterFlowTheme.of(context).error
                            : FlutterFlowTheme.of(context).primary,
                        boxShadow: [
                          BoxShadow(
                            blurRadius: 4.0,
                            color: Color(0x1A000000),
                            offset: Offset(0.0, 2.0),
                          )
                        ],
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        _isError ? Icons.error : Icons.check_rounded,
                        color: FlutterFlowTheme.of(context).info,
                        size: 50.0,
                      ),
                    ),
                    Padding(
                      padding:
                          EdgeInsetsDirectional.fromSTEB(0.0, 24.0, 0.0, 0.0),
                      child: Text(
                        _isError
                            ? 'Authorization Failed'
                            : 'Authorization in Progress',
                        textAlign: TextAlign.center,
                        style: FlutterFlowTheme.of(context)
                            .headlineMedium
                            .override(
                              fontFamily: 'Inter Tight',
                              letterSpacing: 0.0,
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                    ),
                    Padding(
                      padding:
                          EdgeInsetsDirectional.fromSTEB(0.0, 16.0, 0.0, 0.0),
                      child: Text(
                        _status,
                        textAlign: TextAlign.center,
                        style: FlutterFlowTheme.of(context).bodyLarge.override(
                              fontFamily: 'Inter',
                              color: FlutterFlowTheme.of(context).secondaryText,
                              letterSpacing: 0.0,
                            ),
                      ),
                    ),
                    if (_isError)
                      Padding(
                        padding:
                            EdgeInsetsDirectional.fromSTEB(0.0, 32.0, 0.0, 0.0),
                        child: FFButtonWidget(
                          onPressed: () => context.goNamed('Logged_in'),
                          text: 'Return to Dashboard',
                          options: FFButtonOptions(
                            width: double.infinity,
                            height: 50.0,
                            padding: EdgeInsets.all(8.0),
                            iconPadding: EdgeInsetsDirectional.fromSTEB(
                                0.0, 0.0, 0.0, 0.0),
                            color: FlutterFlowTheme.of(context).primary,
                            textStyle: FlutterFlowTheme.of(context)
                                .titleSmall
                                .override(
                                  fontFamily: 'Inter Tight',
                                  color: FlutterFlowTheme.of(context).info,
                                  letterSpacing: 0.0,
                                ),
                            elevation: 0.0,
                            borderRadius: BorderRadius.circular(30.0),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
