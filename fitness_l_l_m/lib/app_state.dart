import 'package:flutter/material.dart';
import '/backend/backend.dart';
import '/backend/schema/structs/index.dart';
import '/backend/schema/enums/enums.dart';
import '/backend/api_requests/api_manager.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'flutter_flow/flutter_flow_util.dart';
import 'dart:convert';

class FFAppState extends ChangeNotifier {
  static FFAppState _instance = FFAppState._internal();

  factory FFAppState() {
    return _instance;
  }

  FFAppState._internal();

  static void reset() {
    _instance = FFAppState._internal();
  }

  Future initializePersistedState() async {
    prefs = await SharedPreferences.getInstance();
    _safeInit(() {
      if (prefs.containsKey('ff_apiPayload')) {
        try {
          _apiPayload = jsonDecode(prefs.getString('ff_apiPayload') ?? '');
        } catch (e) {
          print("Can't decode persisted json. Error: $e.");
        }
      }
    });
    _safeInit(() {
      _isStravaConnected =
          prefs.getBool('ff_isStravaConnected') ?? _isStravaConnected;
    });
  }

  void update(VoidCallback callback) {
    callback();
    notifyListeners();
  }

  late SharedPreferences prefs;

  /// Payload for API Router
  dynamic _apiPayload = jsonDecode('{\"target_api\":\"\",\"payload\":{}}');
  dynamic get apiPayload => _apiPayload;
  set apiPayload(dynamic value) {
    _apiPayload = value;
    prefs.setString('ff_apiPayload', jsonEncode(value));
  }

  bool _isStravaConnected = false;
  bool get isStravaConnected => _isStravaConnected;
  set isStravaConnected(bool value) {
    _isStravaConnected = value;
    prefs.setBool('ff_isStravaConnected', value);
  }
}

void _safeInit(Function() initializeField) {
  try {
    initializeField();
  } catch (_) {}
}

Future _safeInitAsync(Function() initializeField) async {
  try {
    await initializeField();
  } catch (_) {}
}
