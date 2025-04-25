import 'package:collection/collection.dart';

/// Enum for API Payload
enum ApiPayload {
  target_api,
  payload,
}

extension FFEnumExtensions<T extends Enum> on T {
  String serialize() => name;
}

extension FFEnumListExtensions<T extends Enum> on Iterable<T> {
  T? deserialize(String? value) =>
      firstWhereOrNull((e) => e.serialize() == value);
}

T? deserializeEnum<T>(String? value) {
  switch (T) {
    case (ApiPayload):
      return ApiPayload.values.deserialize(value) as T?;
    default:
      return null;
  }
}
