import * as tscSchema from "@ts-common/schema"
import * as tscJson from "@ts-common/json"
import * as tuple from "@ts-common/tuple"

export namespace meta {

  export type Property<B, T extends B, K extends keyof B, D = undefined> =
    unknown extends T[K] ? D :
    undefined extends T[K] ? D :
    T[K]

  export type Equal<A, B> = A | B extends A & B ? true : false

}

// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01
export namespace schema {

  export type SimpleTypes = tscSchema.SimpleTypes

  export namespace simpleTypes {
    // returns T extends SimpleType
    export type FromMainObjectType<T extends MainObjectType> =
      T extends undefined|tuple.Tuple0 ? SimpleTypes :
      T extends SimpleTypes ? T :
      T extends Iterable<infer U> ? U :
      never // error
  }

  export type MainObjectType =
    undefined | //  validates against any instance
    SimpleTypes |
    ReadonlyArray<SimpleTypes>

  export type MainObject = {
    readonly type?: MainObjectType
    readonly items?: Main
  }

  export namespace mainObject {

    export type GetType<T extends MainObject> =
      simpleTypes.FromMainObjectType<meta.Property<MainObject, T, "type">>

    export type GetItems<T extends MainObject> =
      meta.Property<MainObject, T, "items", {}>
  }

  export type Main = MainObject|boolean

  export type Norm = {
    readonly type?: SimpleTypes
    readonly items?: Norm
  }

  export namespace norm {

    // returns R extends SimpleTypes
    export type GetType<T extends Norm> = meta.Property<Norm, T, "type", SimpleTypes>

    export type GetItems<T extends Norm> = meta.Property<Norm, T, "items", {}>

    export type FromSimpleTypes<Type extends SimpleTypes> =
      SimpleTypes extends Type ? {} :
      { readonly type: Type }

    export type ItemsFromMainObject<Items extends MainObject> =
      {} extends Items ? {} :
      { readonly items: FromMainObject<Items> }

    export type FromParameters<Type extends SimpleTypes, M extends MainObject> =
      FromSimpleTypes<Type> &
      ("array" extends Type ? ItemsFromMainObject<mainObject.GetItems<M>> : {})

    // returns T extends Norm
    export type FromMainObject<T extends MainObject> =
      FromParameters<mainObject.GetType<T>, T>

    // returns T extends Norm
    export type FromMain<T extends Main> =
      T extends true ? {} :
      T extends false ? never :
      T extends MainObject ? FromMainObject<T> :
      never // error
  }
}

export namespace json {

  export interface SpecialArrayType<Items extends schema.Norm> extends ReadonlyArray<FromNorm<Items>> {}

  export type ArrayType<Items extends schema.Norm> =
    {} extends Items ? tscJson.JsonArray : SpecialArrayType<Items>

  export type SimpleTypes<S extends schema.SimpleTypes, N extends schema.Norm> =
    S extends "array" ? ArrayType<schema.norm.GetItems<N>> :
    S extends "boolean" ? boolean :
    S extends "integer" | "number" ? number :
    S extends "null" ? null :
    S extends "string" ? string :
    S extends "object" ? tscJson.JsonObject :
    never

  export type FromNorm<S extends schema.Norm> =
    SimpleTypes<schema.norm.GetType<S>, S>

  export type FromMain<S extends schema.Main> =
    FromNorm<schema.norm.FromMain<S>>
}

/*
export interface JsonArray<Items extends SchemaMainObject|undefined = {}> extends
  ReadonlyArray<MainObject<Items>>
{
}

export type Json = json.JsonPrimitive|json.JsonObject|JsonArray

export type SimpleTypes<T extends schema.SimpleTypes, Items extends SchemaMainObject|undefined> =
  T extends "string" ? string :
  T extends "boolean" ? boolean :
  T extends "integer"|"number" ? number :
  T extends "null" ? null :
  T extends "array" ? JsonArray<Items> :
  T extends "object" ? json.JsonObject :
  never

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
    MainObjectType<
      meta.Property<SchemaMainObject, T, "type">,
      meta.Property<SchemaMainObject, T, "items", {}>
    > :
  Json

type SchemaMain = SchemaMainObject|boolean

export type Main<T extends SchemaMain> =
  T extends true ? Json :
  T extends false ? void :
  T extends SchemaMainObject ? MainObject<T> :
  never
*/