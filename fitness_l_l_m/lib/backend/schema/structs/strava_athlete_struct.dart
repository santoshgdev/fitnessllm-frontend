// ignore_for_file: unnecessary_getters_setters

import 'package:cloud_firestore/cloud_firestore.dart';

import '/backend/schema/util/firestore_util.dart';
import '/backend/schema/util/schema_util.dart';
import '/backend/schema/enums/enums.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class StravaAthleteStruct extends FFFirebaseStruct {
  StravaAthleteStruct({
    int? id,
    String? firstname,
    String? lastname,
    String? profile,
    FirestoreUtilData firestoreUtilData = const FirestoreUtilData(),
  })  : _id = id,
        _firstname = firstname,
        _lastname = lastname,
        _profile = profile,
        super(firestoreUtilData);

  // "id" field.
  int? _id;
  int get id => _id ?? 0;
  set id(int? val) => _id = val;

  void incrementId(int amount) => id = id + amount;

  bool hasId() => _id != null;

  // "firstname" field.
  String? _firstname;
  String get firstname => _firstname ?? '';
  set firstname(String? val) => _firstname = val;

  bool hasFirstname() => _firstname != null;

  // "lastname" field.
  String? _lastname;
  String get lastname => _lastname ?? '';
  set lastname(String? val) => _lastname = val;

  bool hasLastname() => _lastname != null;

  // "profile" field.
  String? _profile;
  String get profile => _profile ?? '';
  set profile(String? val) => _profile = val;

  bool hasProfile() => _profile != null;

  static StravaAthleteStruct fromMap(Map<String, dynamic> data) =>
      StravaAthleteStruct(
        id: castToType<int>(data['id']),
        firstname: data['firstname'] as String?,
        lastname: data['lastname'] as String?,
        profile: data['profile'] as String?,
      );

  static StravaAthleteStruct? maybeFromMap(dynamic data) => data is Map
      ? StravaAthleteStruct.fromMap(data.cast<String, dynamic>())
      : null;

  Map<String, dynamic> toMap() => {
        'id': _id,
        'firstname': _firstname,
        'lastname': _lastname,
        'profile': _profile,
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'id': serializeParam(
          _id,
          ParamType.int,
        ),
        'firstname': serializeParam(
          _firstname,
          ParamType.String,
        ),
        'lastname': serializeParam(
          _lastname,
          ParamType.String,
        ),
        'profile': serializeParam(
          _profile,
          ParamType.String,
        ),
      }.withoutNulls;

  static StravaAthleteStruct fromSerializableMap(Map<String, dynamic> data) =>
      StravaAthleteStruct(
        id: deserializeParam(
          data['id'],
          ParamType.int,
          false,
        ),
        firstname: deserializeParam(
          data['firstname'],
          ParamType.String,
          false,
        ),
        lastname: deserializeParam(
          data['lastname'],
          ParamType.String,
          false,
        ),
        profile: deserializeParam(
          data['profile'],
          ParamType.String,
          false,
        ),
      );

  @override
  String toString() => 'StravaAthleteStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    return other is StravaAthleteStruct &&
        id == other.id &&
        firstname == other.firstname &&
        lastname == other.lastname &&
        profile == other.profile;
  }

  @override
  int get hashCode =>
      const ListEquality().hash([id, firstname, lastname, profile]);
}

StravaAthleteStruct createStravaAthleteStruct({
  int? id,
  String? firstname,
  String? lastname,
  String? profile,
  Map<String, dynamic> fieldValues = const {},
  bool clearUnsetFields = true,
  bool create = false,
  bool delete = false,
}) =>
    StravaAthleteStruct(
      id: id,
      firstname: firstname,
      lastname: lastname,
      profile: profile,
      firestoreUtilData: FirestoreUtilData(
        clearUnsetFields: clearUnsetFields,
        create: create,
        delete: delete,
        fieldValues: fieldValues,
      ),
    );

StravaAthleteStruct? updateStravaAthleteStruct(
  StravaAthleteStruct? stravaAthlete, {
  bool clearUnsetFields = true,
  bool create = false,
}) =>
    stravaAthlete
      ?..firestoreUtilData = FirestoreUtilData(
        clearUnsetFields: clearUnsetFields,
        create: create,
      );

void addStravaAthleteStructData(
  Map<String, dynamic> firestoreData,
  StravaAthleteStruct? stravaAthlete,
  String fieldName, [
  bool forFieldValue = false,
]) {
  firestoreData.remove(fieldName);
  if (stravaAthlete == null) {
    return;
  }
  if (stravaAthlete.firestoreUtilData.delete) {
    firestoreData[fieldName] = FieldValue.delete();
    return;
  }
  final clearFields =
      !forFieldValue && stravaAthlete.firestoreUtilData.clearUnsetFields;
  if (clearFields) {
    firestoreData[fieldName] = <String, dynamic>{};
  }
  final stravaAthleteData =
      getStravaAthleteFirestoreData(stravaAthlete, forFieldValue);
  final nestedData =
      stravaAthleteData.map((k, v) => MapEntry('$fieldName.$k', v));

  final mergeFields = stravaAthlete.firestoreUtilData.create || clearFields;
  firestoreData
      .addAll(mergeFields ? mergeNestedFields(nestedData) : nestedData);
}

Map<String, dynamic> getStravaAthleteFirestoreData(
  StravaAthleteStruct? stravaAthlete, [
  bool forFieldValue = false,
]) {
  if (stravaAthlete == null) {
    return {};
  }
  final firestoreData = mapToFirestore(stravaAthlete.toMap());

  // Add any Firestore field values
  stravaAthlete.firestoreUtilData.fieldValues
      .forEach((k, v) => firestoreData[k] = v);

  return forFieldValue ? mergeNestedFields(firestoreData) : firestoreData;
}

List<Map<String, dynamic>> getStravaAthleteListFirestoreData(
  List<StravaAthleteStruct>? stravaAthletes,
) =>
    stravaAthletes
        ?.map((e) => getStravaAthleteFirestoreData(e, true))
        .toList() ??
    [];
