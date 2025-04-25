import '/backend/schema/structs/index.dart';

class StravaAuthInitiateCloudFunctionCallResponse {
  StravaAuthInitiateCloudFunctionCallResponse({
    this.errorCode,
    this.succeeded,
    this.jsonBody,
  });
  String? errorCode;
  bool? succeeded;
  dynamic jsonBody;
}
