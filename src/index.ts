import * as tscSchema from "@ts-common/schema"
import * as tuple from "@ts-common/tuple"

export namespace meta {

  export type Property<P, D = {}> =
    unknown extends P ? D :
    undefined extends P ? D :
    P extends undefined ? D :
    P

  export type Equal<A, B> = A | B extends A & B ? true : false

}

// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01
export namespace schema {

  export type SimpleTypes = tscSchema.SimpleTypes

  export namespace simpleTypes {
    // returns T extends SimpleType
    export type FromMainObjectType<T extends MainObjectType> =
      T extends tuple.Tuple0 ? SimpleTypes :
      T extends SimpleTypes ? T :
      T extends Iterable<infer U> ? U :
      never // error
  }

  export type MainObjectType =
    SimpleTypes |
    ReadonlyArray<SimpleTypes>

  export type MainObjectProperties = { readonly [k in string]?: Main }

  export type String<K extends string> =
    string extends K ? K : K

  export type MainObject = {
    readonly type?: MainObjectType
    readonly items?: Main
    readonly additionalProperties?: Main
    readonly properties?: MainObjectProperties
    readonly required?: ReadonlyArray<string>
    readonly const?: json.Json
  }

  export namespace mainObject {

    export type GetType<T extends MainObject> =
      simpleTypes.FromMainObjectType<meta.Property<T["type"], SimpleTypes>>

    export type GetItems<T extends MainObject> =
      meta.Property<T["items"]>

    export type GetAdditionalProperties<T extends MainObject> =
      meta.Property<T["additionalProperties"]>

    export type GetProperties<T extends MainObject> =
      meta.Property<T["properties"]>

    export type GetRequired<T extends MainObject> =
      meta.Property<T["required"], []>

    export type GetConst<T extends MainObject> =
      meta.Property<T["const"], json.Json>
  }

  export type Main = MainObject|boolean

  // Bug: can't handle `required` because it depends on ReadonlyArray<string> which can't be
  // infered as ReadonlyArray<"..."|"..."|...>
  // export const main = <T extends Main>(v: T): T => v

  export type NormProperties = { readonly [k in string]?: Norm }

  export type NormObject = {
    readonly type?: SimpleTypes
    readonly items?: Norm
    readonly additionalProperties?: Norm
    readonly properties?: NormProperties
    readonly required?: string
    readonly const?: json.Json
  }

  export type Norm = NormObject|false

  export namespace norm {

    // returns R extends SimpleTypes
    export type GetType<T extends NormObject> = meta.Property<T["type"], SimpleTypes>

    export type GetItems<T extends NormObject> = meta.Property<T["items"]>

    export type GetAdditionalProperties<T extends NormObject> = meta.Property<T["additionalProperties"]>

    export type GetProperties<T extends NormObject> = meta.Property<T["properties"]>

    export type GetRequired<T extends NormObject> = meta.Property<T["required"], never>

    export type GetConst<T extends NormObject> = meta.Property<T["const"], json.Json>

    export type FromSimpleTypes<Type extends SimpleTypes> =
      SimpleTypes extends Type ? {} :
      { readonly type: Type }

    export type ItemsFromMainObject<Items extends Main> =
      {} extends Items ? {} :
      { readonly items: FromMain<Items> }

    export type AdditionalPropertiesFromMainObject<AdditionalProperties extends MainObject> =
      {} extends AdditionalProperties ? {} :
      { readonly additionalProperties: FromMain<AdditionalProperties> }

    export type PropertiesFromMainObject<Properties extends MainObjectProperties> =
      {} extends Properties ? {} :
      { readonly properties: { readonly [K in keyof Properties]: FromMain<meta.Property<Properties[K]>> } }

    export type RequiredFromMainObject<Required extends ReadonlyArray<string>> =
      Required extends tuple.Tuple0 ? {} :
      Required extends ReadonlyArray<infer U> ? { readonly required: U } :
      {}

    export type FromParameters<Type extends SimpleTypes, M extends MainObject> =
      FromSimpleTypes<Type> &
      ("array" extends Type ? ItemsFromMainObject<mainObject.GetItems<M>> : {}) &
      ("object" extends Type ?
        ( AdditionalPropertiesFromMainObject<mainObject.GetAdditionalProperties<M>> &
          PropertiesFromMainObject<mainObject.GetProperties<M>> &
          RequiredFromMainObject<mainObject.GetRequired<M>>
        ):
        {}
      )

    // returns T extends Norm
    export type FromMainObject<T extends MainObject> =
      FromParameters<mainObject.GetType<T>, T>

    // returns T extends Norm
    export type FromMain<T extends Main> =
      T extends true ? {} :
      T extends false ? false :
      T extends MainObject ? FromMainObject<T> :
      never // error
  }
}

export namespace json {

  export interface JsonArray extends ReadonlyArray<Json>{}

  export type JsonObject = { readonly [k in string]?: Json }

  export type Json = boolean|string|null|number|JsonArray|JsonObject

  export interface SpecialArrayType<Items extends schema.NormObject> extends ReadonlyArray<FromNorm<Items>> {}

  export type ArrayType<Items extends schema.NormObject> =
    {} extends Items ? JsonArray : SpecialArrayType<Items>

  export type AdditionalPropertiesObject<AdditionalProperties extends schema.Norm> = {
    readonly [k in string]?: FromNorm<AdditionalProperties>
  }

  export type PropertiesObject<Properties extends schema.NormProperties> = {
    readonly [K in keyof Properties]?: FromNorm<meta.Property<Properties[K], {}>>
  }

  export type ObjectType<
    AdditionalProperties extends schema.Norm,
    Properties extends schema.NormProperties,
    Required extends string
  > =
    ( {} extends AdditionalProperties ? JsonObject :
      AdditionalProperties extends false ? {} :
      AdditionalPropertiesObject<AdditionalProperties | meta.Property<Properties[keyof Properties]>>
    ) &
    ({} extends Properties ? JsonObject : PropertiesObject<Properties>) &
    ({ readonly [K in Required]: Json })

  export type SimpleTypes<S extends schema.SimpleTypes, N extends schema.NormObject> =
    S extends "array" ? ArrayType<schema.norm.GetItems<N>> :
    S extends "boolean" ? boolean :
    S extends "integer" | "number" ? number :
    S extends "null" ? null :
    S extends "string" ? string :
    S extends "object" ?
      ObjectType<
        schema.norm.GetAdditionalProperties<N>,
        schema.norm.GetProperties<N>,
        schema.norm.GetRequired<N>
      > :
    never

  export type FromNorm<S extends schema.Norm> =
    S extends schema.NormObject ?
      SimpleTypes<schema.norm.GetType<S>, S> :
      never

  export type FromMain<S extends schema.Main> =
    FromNorm<schema.norm.FromMain<S>>
}
