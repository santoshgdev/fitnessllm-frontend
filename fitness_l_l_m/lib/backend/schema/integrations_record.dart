import 'dart:async';

import 'package:collection/collection.dart';

import '/backend/schema/util/firestore_util.dart';
import '/backend/schema/util/schema_util.dart';
import '/backend/schema/enums/enums.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class IntegrationsRecord extends FirestoreRecord {
  IntegrationsRecord._(
    DocumentReference reference,
    Map<String, dynamic> data,
  ) : super(reference, data) {
    _initializeFields();
  }

  // "strava" field.
  StravaIntegrationStruct? _strava;
  StravaIntegrationStruct get strava => _strava ?? StravaIntegrationStruct();
  bool hasStrava() => _strava != null;

  DocumentReference get parentReference => reference.parent.parent!;

  void _initializeFields() {
    _strava = snapshotData['strava'] is StravaIntegrationStruct
        ? snapshotData['strava']
        : StravaIntegrationStruct.maybeFromMap(snapshotData['strava']);
  }

  static Query<Map<String, dynamic>> collection([DocumentReference? parent]) =>
      parent != null
          ? parent.collection('integrations')
          : FirebaseFirestore.instance.collectionGroup('integrations');

  static DocumentReference createDoc(DocumentReference parent, {String? id}) =>
      parent.collection('integrations').doc(id);

  static Stream<IntegrationsRecord> getDocument(DocumentReference ref) =>
      ref.snapshots().map((s) => IntegrationsRecord.fromSnapshot(s));

  static Future<IntegrationsRecord> getDocumentOnce(DocumentReference ref) =>
      ref.get().then((s) => IntegrationsRecord.fromSnapshot(s));

  static IntegrationsRecord fromSnapshot(DocumentSnapshot snapshot) =>
      IntegrationsRecord._(
        snapshot.reference,
        mapFromFirestore(snapshot.data() as Map<String, dynamic>),
      );

  static IntegrationsRecord getDocumentFromData(
    Map<String, dynamic> data,
    DocumentReference reference,
  ) =>
      IntegrationsRecord._(reference, mapFromFirestore(data));

  @override
  String toString() =>
      'IntegrationsRecord(reference: ${reference.path}, data: $snapshotData)';

  @override
  int get hashCode => reference.path.hashCode;

  @override
  bool operator ==(other) =>
      other is IntegrationsRecord &&
      reference.path.hashCode == other.reference.path.hashCode;
}

Map<String, dynamic> createIntegrationsRecordData({
  StravaIntegrationStruct? strava,
}) {
  final firestoreData = mapToFirestore(
    <String, dynamic>{
      'strava': StravaIntegrationStruct().toMap(),
    }.withoutNulls,
  );

  // Handle nested data for "strava" field.
  addStravaIntegrationStructData(firestoreData, strava, 'strava');

  return firestoreData;
}

class IntegrationsRecordDocumentEquality
    implements Equality<IntegrationsRecord> {
  const IntegrationsRecordDocumentEquality();

  @override
  bool equals(IntegrationsRecord? e1, IntegrationsRecord? e2) {
    return e1?.strava == e2?.strava;
  }

  @override
  int hash(IntegrationsRecord? e) => const ListEquality().hash([e?.strava]);

  @override
  bool isValidKey(Object? o) => o is IntegrationsRecord;
}
