import * as schema from "@ts-common/schema"
import * as json from "@ts-common/json"
import * as tuple from "@ts-common/tuple"

export type SimpleTypes<T extends schema.SimpleTypes> =
  T extends "string" ? string :
  T extends "boolean" ? boolean :
  T extends "integer"|"number" ? number :
  T extends "null" ? null :
  T extends "array" ? json.JsonArray :
  T extends "object" ? json.JsonObject :
  never

export type SimpleTypesUnknown<T> =
  T extends schema.SimpleTypes ? SimpleTypes<T> :
  never

export type SchemaMainObjectType =
  undefined|
  schema.SimpleTypes|
  tuple.Tuple0|
  tuple.Tuple1<schema.SimpleTypes>|
  tuple.Tuple2<schema.SimpleTypes, schema.SimpleTypes>

export type MainObjectType<T extends SchemaMainObjectType> =
  T extends undefined ? json.Json : // or `SimpleTypes<schema.SimpleTypes>
  T extends schema.SimpleTypes ? SimpleTypes<T> :
  T extends tuple.Tuple0 ? never :
  T extends tuple.Tuple1<infer T0> ? SimpleTypesUnknown<T0> :
  T extends tuple.Tuple2<infer T0, infer T1> ? SimpleTypesUnknown<T0>|SimpleTypesUnknown<T1> :
  never
