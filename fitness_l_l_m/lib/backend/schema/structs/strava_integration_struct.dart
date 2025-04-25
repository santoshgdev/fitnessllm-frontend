// ignore_for_file: unnecessary_getters_setters

import 'package:cloud_firestore/cloud_firestore.dart';

import '/backend/schema/util/firestore_util.dart';
import '/backend/schema/util/schema_util.dart';
import '/backend/schema/enums/enums.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class StravaIntegrationStruct extends FFFirebaseStruct {
  StravaIntegrationStruct({
    int? athleteId,
    bool? connected,
    String? connectionStatus,
    DateTime? lastUpdated,
    String? scope,
    FirestoreUtilData firestoreUtilData = const FirestoreUtilData(),
  })  : _athleteId = athleteId,
        _connected = connected,
        _connectionStatus = connectionStatus,
        _lastUpdated = lastUpdated,
        _scope = scope,
        super(firestoreUtilData);

  // "athleteId" field.
  int? _athleteId;
  int get athleteId => _athleteId ?? 0;
  set athleteId(int? val) => _athleteId = val;

  void incrementAthleteId(int amount) => athleteId = athleteId + amount;

  bool hasAthleteId() => _athleteId != null;

  // "connected" field.
  bool? _connected;
  bool get connected => _connected ?? false;
  set connected(bool? val) => _connected = val;

  bool hasConnected() => _connected != null;

  // "connectionStatus" field.
  String? _connectionStatus;
  String get connectionStatus => _connectionStatus ?? '';
  set connectionStatus(String? val) => _connectionStatus = val;

  bool hasConnectionStatus() => _connectionStatus != null;

  // "lastUpdated" field.
  DateTime? _lastUpdated;
  DateTime? get lastUpdated => _lastUpdated;
  set lastUpdated(DateTime? val) => _lastUpdated = val;

  bool hasLastUpdated() => _lastUpdated != null;

  // "scope" field.
  String? _scope;
  String get scope => _scope ?? '';
  set scope(String? val) => _scope = val;

  bool hasScope() => _scope != null;

  static StravaIntegrationStruct fromMap(Map<String, dynamic> data) =>
      StravaIntegrationStruct(
        athleteId: castToType<int>(data['athleteId']),
        connected: data['connected'] as bool?,
        connectionStatus: data['connectionStatus'] as String?,
        lastUpdated: data['lastUpdated'] as DateTime?,
        scope: data['scope'] as String?,
      );

  static StravaIntegrationStruct? maybeFromMap(dynamic data) => data is Map
      ? StravaIntegrationStruct.fromMap(data.cast<String, dynamic>())
      : null;

  Map<String, dynamic> toMap() => {
        'athleteId': _athleteId,
        'connected': _connected,
        'connectionStatus': _connectionStatus,
        'lastUpdated': _lastUpdated,
        'scope': _scope,
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'athleteId': serializeParam(
          _athleteId,
          ParamType.int,
        ),
        'connected': serializeParam(
          _connected,
          ParamType.bool,
        ),
        'connectionStatus': serializeParam(
          _connectionStatus,
          ParamType.String,
        ),
        'lastUpdated': serializeParam(
          _lastUpdated,
          ParamType.DateTime,
        ),
        'scope': serializeParam(
          _scope,
          ParamType.String,
        ),
      }.withoutNulls;

  static StravaIntegrationStruct fromSerializableMap(
          Map<String, dynamic> data) =>
      StravaIntegrationStruct(
        athleteId: deserializeParam(
          data['athleteId'],
          ParamType.int,
          false,
        ),
        connected: deserializeParam(
          data['connected'],
          ParamType.bool,
          false,
        ),
        connectionStatus: deserializeParam(
          data['connectionStatus'],
          ParamType.String,
          false,
        ),
        lastUpdated: deserializeParam(
          data['lastUpdated'],
          ParamType.DateTime,
          false,
        ),
        scope: deserializeParam(
          data['scope'],
          ParamType.String,
          false,
        ),
      );

  @override
  String toString() => 'StravaIntegrationStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    return other is StravaIntegrationStruct &&
        athleteId == other.athleteId &&
        connected == other.connected &&
        connectionStatus == other.connectionStatus &&
        lastUpdated == other.lastUpdated &&
        scope == other.scope;
  }

  @override
  int get hashCode => const ListEquality()
      .hash([athleteId, connected, connectionStatus, lastUpdated, scope]);
}

StravaIntegrationStruct createStravaIntegrationStruct({
  int? athleteId,
  bool? connected,
  String? connectionStatus,
  DateTime? lastUpdated,
  String? scope,
  Map<String, dynamic> fieldValues = const {},
  bool clearUnsetFields = true,
  bool create = false,
  bool delete = false,
}) =>
    StravaIntegrationStruct(
      athleteId: athleteId,
      connected: connected,
      connectionStatus: connectionStatus,
      lastUpdated: lastUpdated,
      scope: scope,
      firestoreUtilData: FirestoreUtilData(
        clearUnsetFields: clearUnsetFields,
        create: create,
        delete: delete,
        fieldValues: fieldValues,
      ),
    );

StravaIntegrationStruct? updateStravaIntegrationStruct(
  StravaIntegrationStruct? stravaIntegration, {
  bool clearUnsetFields = true,
  bool create = false,
}) =>
    stravaIntegration
      ?..firestoreUtilData = FirestoreUtilData(
        clearUnsetFields: clearUnsetFields,
        create: create,
      );

void addStravaIntegrationStructData(
  Map<String, dynamic> firestoreData,
  StravaIntegrationStruct? stravaIntegration,
  String fieldName, [
  bool forFieldValue = false,
]) {
  firestoreData.remove(fieldName);
  if (stravaIntegration == null) {
    return;
  }
  if (stravaIntegration.firestoreUtilData.delete) {
    firestoreData[fieldName] = FieldValue.delete();
    return;
  }
  final clearFields =
      !forFieldValue && stravaIntegration.firestoreUtilData.clearUnsetFields;
  if (clearFields) {
    firestoreData[fieldName] = <String, dynamic>{};
  }
  final stravaIntegrationData =
      getStravaIntegrationFirestoreData(stravaIntegration, forFieldValue);
  final nestedData =
      stravaIntegrationData.map((k, v) => MapEntry('$fieldName.$k', v));

  final mergeFields = stravaIntegration.firestoreUtilData.create || clearFields;
  firestoreData
      .addAll(mergeFields ? mergeNestedFields(nestedData) : nestedData);
}

Map<String, dynamic> getStravaIntegrationFirestoreData(
  StravaIntegrationStruct? stravaIntegration, [
  bool forFieldValue = false,
]) {
  if (stravaIntegration == null) {
    return {};
  }
  final firestoreData = mapToFirestore(stravaIntegration.toMap());

  // Add any Firestore field values
  stravaIntegration.firestoreUtilData.fieldValues
      .forEach((k, v) => firestoreData[k] = v);

  return forFieldValue ? mergeNestedFields(firestoreData) : firestoreData;
}

List<Map<String, dynamic>> getStravaIntegrationListFirestoreData(
  List<StravaIntegrationStruct>? stravaIntegrations,
) =>
    stravaIntegrations
        ?.map((e) => getStravaIntegrationFirestoreData(e, true))
        .toList() ??
    [];
