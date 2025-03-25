// Automatic FlutterFlow imports
import '/backend/backend.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'index.dart'; // Imports other custom widgets
import '/custom_code/actions/index.dart'; // Imports custom actions
import 'package:flutter/material.dart';
// Begin custom widget code
// DO NOT REMOVE OR MODIFY THE CODE ABOVE!

import 'package:cloud_functions/cloud_functions.dart';
import 'package:go_router/go_router.dart';

class StravaCallbackHandler extends StatefulWidget {
  const StravaCallbackHandler({
    Key? key,
    this.width,
    this.height,
  }) : super(key: key);

  final double? width;
  final double? height;

  @override
  _StravaCallbackHandlerState createState() => _StravaCallbackHandlerState();
}

class _StravaCallbackHandlerState extends State<StravaCallbackHandler> {
  bool _isLoading = true;
  String _status = 'Processing Strava authorization...';
  bool _hasError = false;

  @override
  void initState() {
    super.initState();
    print('StravaCallbackHandler: initState called');
    print('TESTING 123');
    _handleStravaCallback();
  }

  Future<void> _handleStravaCallback() async {
    try {
      print('StravaCallbackHandler: Starting callback handling');

      // Get the current URL
      final uri = GoRouterState.of(context).uri.toString();
      print('StravaCallbackHandler: Current URI: $uri');

      // Extract the authorization code from the URL
      final code = Uri.parse(uri).queryParameters['code'];
      print('StravaCallbackHandler: Extracted code: $code');

      if (code == null) {
        print('StravaCallbackHandler: No code found in URL');
        setState(() {
          _isLoading = false;
          _hasError = true;
          _status = 'Error: No authorization code found in URL';
        });
        return;
      }

      // Call the cloud function with the correct parameter name
      print('StravaCallbackHandler: Calling cloud function with code: $code');
      final callable =
          FirebaseFunctions.instance.httpsCallable('stravaAuthInitiate');
      final response = await callable.call(<String, dynamic>{
        'authorizationCode':
            code, // Changed from 'code' to 'authorizationCode' to match cloud function
      });
      print('StravaCallbackHandler: Cloud function response: $response');

      setState(() {
        _isLoading = false;
        _status = 'Successfully connected with Strava!';
      });

      // Navigate back to home or profile page after 2 seconds
      Future.delayed(const Duration(seconds: 2), () {
        print('StravaCallbackHandler: Navigating to home page');
        context.go('/'); // Adjust this path as needed
      });
    } catch (e) {
      print('StravaCallbackHandler: Error occurred: $e');
      setState(() {
        _isLoading = false;
        _hasError = true;
        _status = 'Error: ${e.toString()}';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: widget.width ?? double.infinity,
      height: widget.height ?? 300,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (_isLoading) const CircularProgressIndicator(),
            const SizedBox(height: 20),
            Text(
              _status,
              style: TextStyle(
                color: _hasError ? Colors.red : Colors.black,
                fontSize: 16,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
