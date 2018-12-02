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
  undefined |
  schema.SimpleTypes |
  tuple.Tuple0 |
  tuple.Tuple1<
    schema.SimpleTypes
  > |
  tuple.Tuple2<
    schema.SimpleTypes,
    schema.SimpleTypes
  > |
  tuple.Tuple3<
    schema.SimpleTypes,
    schema.SimpleTypes,
    schema.SimpleTypes
  > |
  tuple.Tuple4<
    schema.SimpleTypes,
    schema.SimpleTypes,
    schema.SimpleTypes,
    schema.SimpleTypes
  > |
  tuple.Tuple5<
    schema.SimpleTypes,
    schema.SimpleTypes,
    schema.SimpleTypes,
    schema.SimpleTypes,
    schema.SimpleTypes
  > |
  tuple.Tuple6<
    schema.SimpleTypes,
    schema.SimpleTypes,
    schema.SimpleTypes,
    schema.SimpleTypes,
    schema.SimpleTypes,
    schema.SimpleTypes
  > |
  tuple.Tuple7<
    schema.SimpleTypes,
    schema.SimpleTypes,
    schema.SimpleTypes,
    schema.SimpleTypes,
    schema.SimpleTypes,
    schema.SimpleTypes,
    schema.SimpleTypes
  >

export type MainObjectType<T extends SchemaMainObjectType> =
  T extends undefined ? json.Json : // or `SimpleTypes<schema.SimpleTypes>
  T extends schema.SimpleTypes ? SimpleTypes<T> :
  T extends tuple.Tuple0 ?
    never :
  T extends tuple.Tuple1<infer T0> ?
    SimpleTypesUnknown<T0> :
  T extends tuple.Tuple2<infer T0, infer T1> ?
    SimpleTypesUnknown<T0> |
    SimpleTypesUnknown<T1> :
  T extends tuple.Tuple3<infer T0, infer T1, infer T2> ?
    SimpleTypesUnknown<T0> |
    SimpleTypesUnknown<T1> |
    SimpleTypesUnknown<T2> :
  T extends tuple.Tuple4<infer T0, infer T1, infer T2, infer T3> ?
    SimpleTypesUnknown<T0> |
    SimpleTypesUnknown<T1> |
    SimpleTypesUnknown<T2> |
    SimpleTypesUnknown<T3> :
  T extends tuple.Tuple5<infer T0, infer T1, infer T2, infer T3, infer T4> ?
    SimpleTypesUnknown<T0> |
    SimpleTypesUnknown<T1> |
    SimpleTypesUnknown<T2> |
    SimpleTypesUnknown<T3> |
    SimpleTypesUnknown<T4> :
  T extends tuple.Tuple6<infer T0, infer T1, infer T2, infer T3, infer T4, infer T5> ?
    SimpleTypesUnknown<T0> |
    SimpleTypesUnknown<T1> |
    SimpleTypesUnknown<T2> |
    SimpleTypesUnknown<T3> |
    SimpleTypesUnknown<T4> |
    SimpleTypesUnknown<T5> :
  T extends tuple.Tuple7<infer T0, infer T1, infer T2, infer T3, infer T4, infer T5, infer T6> ?
    SimpleTypesUnknown<T0> |
    SimpleTypesUnknown<T1> |
    SimpleTypesUnknown<T2> |
    SimpleTypesUnknown<T3> |
    SimpleTypesUnknown<T4> |
    SimpleTypesUnknown<T5> |
    SimpleTypesUnknown<T6> :
  never

