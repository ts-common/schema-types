import * as schema from "@ts-common/schema"
import * as json from "@ts-common/json"
import * as tuple from "@ts-common/tuple"

export type PropertyX<T, K extends keyof T> = T[K]

export type Property<B, T extends B, K extends keyof B, D> = unknown extends T[K] ? D : T[K]

export interface ArrayType<Items extends SchemaMainObject|undefined> extends
  ReadonlyArray<MainObject<Items>>
{
}

export type JsonArray = ArrayType<{}>

export type Json = json.JsonPrimitive|json.JsonObject|JsonArray

export type SimpleTypes<T extends schema.SimpleTypes, Items extends SchemaMainObject|undefined> =
  T extends "string" ? string :
  T extends "boolean" ? boolean :
  T extends "integer"|"number" ? number :
  T extends "null" ? null :
  T extends "array" ? ArrayType<Items> :
  T extends "object" ? json.JsonObject :
  never

// export type SimpleTypes<T extends schema.SimpleTypes> = SimpleTypesX<T, undefined>

export type SimpleTypesUnknown<T, Items extends SchemaMainObject> =
  T extends schema.SimpleTypes ? SimpleTypes<T, Items> :
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

export type Type<T extends SchemaMainObjectType, Items extends SchemaMainObject> =
  T extends undefined ? Json : // SimpleTypes<schema.SimpleTypes, Items> :
  T extends schema.SimpleTypes ? SimpleTypes<T, Items> :
  T extends tuple.Tuple0 ?
    void :
  T extends tuple.Tuple1<infer T0> ?
    SimpleTypesUnknown<T0, Items> :
  T extends tuple.Tuple2<infer T0, infer T1> ?
    SimpleTypesUnknown<T0, Items> |
    SimpleTypesUnknown<T1, Items> :
  T extends tuple.Tuple3<infer T0, infer T1, infer T2> ?
    SimpleTypesUnknown<T0, Items> |
    SimpleTypesUnknown<T1, Items> |
    SimpleTypesUnknown<T2, Items> :
  T extends tuple.Tuple4<infer T0, infer T1, infer T2, infer T3> ?
    SimpleTypesUnknown<T0, Items> |
    SimpleTypesUnknown<T1, Items> |
    SimpleTypesUnknown<T2, Items> |
    SimpleTypesUnknown<T3, Items> :
  T extends tuple.Tuple5<infer T0, infer T1, infer T2, infer T3, infer T4> ?
    SimpleTypesUnknown<T0, Items> |
    SimpleTypesUnknown<T1, Items> |
    SimpleTypesUnknown<T2, Items> |
    SimpleTypesUnknown<T3, Items> |
    SimpleTypesUnknown<T4, Items> :
  T extends tuple.Tuple6<infer T0, infer T1, infer T2, infer T3, infer T4, infer T5> ?
    SimpleTypesUnknown<T0, Items> |
    SimpleTypesUnknown<T1, Items> |
    SimpleTypesUnknown<T2, Items> |
    SimpleTypesUnknown<T3, Items> |
    SimpleTypesUnknown<T4, Items> |
    SimpleTypesUnknown<T5, Items> :
  T extends tuple.Tuple7<infer T0, infer T1, infer T2, infer T3, infer T4, infer T5, infer T6> ?
    SimpleTypesUnknown<T0, Items> |
    SimpleTypesUnknown<T1, Items> |
    SimpleTypesUnknown<T2, Items> |
    SimpleTypesUnknown<T3, Items> |
    SimpleTypesUnknown<T4, Items> |
    SimpleTypesUnknown<T5, Items> |
    SimpleTypesUnknown<T6, Items> :
  never

export type MainObjectType<T extends SchemaMainObjectType, Items = SchemaMainObject> = Type<T, Items>

export interface SchemaMainObject {
  // readonly $id?: string;
  // readonly $schema?: string;
  // readonly $ref?: string;
  // readonly $comment?: string;
  // readonly title?: string;
  // readonly description?: string;
  // readonly default?: TsCommonJson.Json;
  // readonly readOnly?: boolean;
  // readonly examples?: ReadonlyArray<TsCommonJson.Json>;
  // readonly multipleOf?: number;
  // readonly maximum?: number;
  // readonly exclusiveMaximum?: number;
  // readonly minimum?: number;
  // readonly exclusiveMinimum?: number;
  // readonly maxLength?: NonNegativeInteger;
  // readonly minLength?: NonNegativeIntegerDefault0;
  // readonly pattern?: string;
  // readonly additionalItems?: Main;
  // readonly items?: Main | SchemaArray;
  readonly items?: SchemaMainObject
  readonly type?: SchemaMainObjectType
}

export type MainObject<T extends SchemaMainObject|undefined> =
  T extends SchemaMainObject ?
    MainObjectType<Property<SchemaMainObject, T, "type", undefined>, Property<SchemaMainObject, T, "items", {}>> :
  Json