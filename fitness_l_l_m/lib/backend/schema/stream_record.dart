import 'dart:async';

import 'package:collection/collection.dart';

import '/backend/schema/util/firestore_util.dart';
import '/backend/schema/util/schema_util.dart';
import '/backend/schema/enums/enums.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class StreamRecord extends FirestoreRecord {
  StreamRecord._(
    DocumentReference reference,
    Map<String, dynamic> data,
  ) : super(reference, data) {
    _initializeFields();
  }

  // "type" field.
  String? _type;
  String get type => _type ?? '';
  bool hasType() => _type != null;

  // "accessToken" field.
  String? _accessToken;
  String get accessToken => _accessToken ?? '';
  bool hasAccessToken() => _accessToken != null;

  // "refreshToken" field.
  String? _refreshToken;
  String get refreshToken => _refreshToken ?? '';
  bool hasRefreshToken() => _refreshToken != null;

  // "expiresAt" field.
  int? _expiresAt;
  int get expiresAt => _expiresAt ?? 0;
  bool hasExpiresAt() => _expiresAt != null;

  // "scope" field.
  String? _scope;
  String get scope => _scope ?? '';
  bool hasScope() => _scope != null;

  // "connected" field.
  bool? _connected;
  bool get connected => _connected ?? false;
  bool hasConnected() => _connected != null;

  // "athlete" field.
  StravaAthleteStruct? _athlete;
  StravaAthleteStruct get athlete => _athlete ?? StravaAthleteStruct();
  bool hasAthlete() => _athlete != null;

  // "firstConnected" field.
  DateTime? _firstConnected;
  DateTime? get firstConnected => _firstConnected;
  bool hasFirstConnected() => _firstConnected != null;

  // "lastTokenRefresh" field.
  DateTime? _lastTokenRefresh;
  DateTime? get lastTokenRefresh => _lastTokenRefresh;
  bool hasLastTokenRefresh() => _lastTokenRefresh != null;

  // "lastUpdated" field.
  DateTime? _lastUpdated;
  DateTime? get lastUpdated => _lastUpdated;
  bool hasLastUpdated() => _lastUpdated != null;

  // "version" field.
  String? _version;
  String get version => _version ?? '';
  bool hasVersion() => _version != null;

  // "uid" field.
  String? _uid;
  String get uid => _uid ?? '';
  bool hasUid() => _uid != null;

  DocumentReference get parentReference => reference.parent.parent!;

  void _initializeFields() {
    _type = snapshotData['type'] as String?;
    _accessToken = snapshotData['accessToken'] as String?;
    _refreshToken = snapshotData['refreshToken'] as String?;
    _expiresAt = castToType<int>(snapshotData['expiresAt']);
    _scope = snapshotData['scope'] as String?;
    _connected = snapshotData['connected'] as bool?;
    _athlete = snapshotData['athlete'] is StravaAthleteStruct
        ? snapshotData['athlete']
        : StravaAthleteStruct.maybeFromMap(snapshotData['athlete']);
    _firstConnected = snapshotData['firstConnected'] as DateTime?;
    _lastTokenRefresh = snapshotData['lastTokenRefresh'] as DateTime?;
    _lastUpdated = snapshotData['lastUpdated'] as DateTime?;
    _version = snapshotData['version'] as String?;
    _uid = snapshotData['uid'] as String?;
  }

  static Query<Map<String, dynamic>> collection([DocumentReference? parent]) =>
      parent != null
          ? parent.collection('stream')
          : FirebaseFirestore.instance.collectionGroup('stream');

  static DocumentReference createDoc(DocumentReference parent, {String? id}) =>
      parent.collection('stream').doc(id);

  static Stream<StreamRecord> getDocument(DocumentReference ref) =>
      ref.snapshots().map((s) => StreamRecord.fromSnapshot(s));

  static Future<StreamRecord> getDocumentOnce(DocumentReference ref) =>
      ref.get().then((s) => StreamRecord.fromSnapshot(s));

  static StreamRecord fromSnapshot(DocumentSnapshot snapshot) => StreamRecord._(
        snapshot.reference,
        mapFromFirestore(snapshot.data() as Map<String, dynamic>),
      );

  static StreamRecord getDocumentFromData(
    Map<String, dynamic> data,
    DocumentReference reference,
  ) =>
      StreamRecord._(reference, mapFromFirestore(data));

  @override
  String toString() =>
      'StreamRecord(reference: ${reference.path}, data: $snapshotData)';

  @override
  int get hashCode => reference.path.hashCode;

  @override
  bool operator ==(other) =>
      other is StreamRecord &&
      reference.path.hashCode == other.reference.path.hashCode;
}

Map<String, dynamic> createStreamRecordData({
  String? type,
  String? accessToken,
  String? refreshToken,
  int? expiresAt,
  String? scope,
  bool? connected,
  StravaAthleteStruct? athlete,
  DateTime? firstConnected,
  DateTime? lastTokenRefresh,
  DateTime? lastUpdated,
  String? version,
  String? uid,
}) {
  final firestoreData = mapToFirestore(
    <String, dynamic>{
      'type': type,
      'accessToken': accessToken,
      'refreshToken': refreshToken,
      'expiresAt': expiresAt,
      'scope': scope,
      'connected': connected,
      'athlete': StravaAthleteStruct().toMap(),
      'firstConnected': firstConnected,
      'lastTokenRefresh': lastTokenRefresh,
      'lastUpdated': lastUpdated,
      'version': version,
      'uid': uid,
    }.withoutNulls,
  );

  // Handle nested data for "athlete" field.
  addStravaAthleteStructData(firestoreData, athlete, 'athlete');

  return firestoreData;
}

class StreamRecordDocumentEquality implements Equality<StreamRecord> {
  const StreamRecordDocumentEquality();

  @override
  bool equals(StreamRecord? e1, StreamRecord? e2) {
    return e1?.type == e2?.type &&
        e1?.accessToken == e2?.accessToken &&
        e1?.refreshToken == e2?.refreshToken &&
        e1?.expiresAt == e2?.expiresAt &&
        e1?.scope == e2?.scope &&
        e1?.connected == e2?.connected &&
        e1?.athlete == e2?.athlete &&
        e1?.firstConnected == e2?.firstConnected &&
        e1?.lastTokenRefresh == e2?.lastTokenRefresh &&
        e1?.lastUpdated == e2?.lastUpdated &&
        e1?.version == e2?.version &&
        e1?.uid == e2?.uid;
  }

  @override
  int hash(StreamRecord? e) => const ListEquality().hash([
        e?.type,
        e?.accessToken,
        e?.refreshToken,
        e?.expiresAt,
        e?.scope,
        e?.connected,
        e?.athlete,
        e?.firstConnected,
        e?.lastTokenRefresh,
        e?.lastUpdated,
        e?.version,
        e?.uid
      ]);

  @override
  bool isValidKey(Object? o) => o is StreamRecord;
}
