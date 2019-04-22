import * as tuple from "@ts-common/tuple"
import * as tscSchema from "@ts-common/schema"
import * as meta from "@ts-common/meta"
import * as json from "@ts-common/json"

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
    readonly SimpleTypes[]

  export type MainObjectProperties = { readonly [k in string]?: Main }

  export namespace mainObjectProperties {
    export type GetProperty<T extends MainObjectProperties, K extends keyof MainObjectProperties> =
      meta.Property<MainObjectProperties, T, K>
  }

  export type MainObject = {
    readonly type?: MainObjectType
    readonly items?: Main
    readonly additionalProperties?: Main
    readonly properties?: MainObjectProperties
    readonly required?: readonly string[]
    readonly const?: json.Json
  }

  export namespace mainObject {

    export type Property<
      T extends MainObject,
      K extends keyof MainObject,
      D extends MainObject[K] = MainObject[K]
    > =
      meta.Property<MainObject, T, K, D>

    export type GetType<T extends MainObject> =
      simpleTypes.FromMainObjectType<Property<T, "type">>

    export type GetItems<T extends MainObject> = Property<T, "items">

    export type GetAdditionalProperties<T extends MainObject> = Property<T, "additionalProperties">

    export type GetProperties<T extends MainObject> = Property<T, "properties">

    export type GetRequired<T extends MainObject> = meta.ArrayItem<Property<T, "required", []>>

    export type GetConst<T extends MainObject> = Property<T, "const">
  }

  export type Main = MainObject|boolean
}

/*
export namespace schema {

  // Bug: can't handle `required` because it depends on ReadonlyArray<string> which can't be
  // infered as ReadonlyArray<"..."|"..."|...>
  // export const main = <T extends Main>(v: T): T => v

  export namespace norm {

    export type ItemsFromMainObject<Items extends Main> =
      {} extends Items ? {} :
      { readonly items: FromMain<Items> }

    export type PropertiesFromMainObject<Properties extends MainObjectProperties> =
      {} extends Properties ? {} :
      { readonly properties: {
          readonly [K in keyof Properties]: FromMain<mainObjectProperties.GetProperty<Properties, K>>
        }
      }

    export type RequiredFromMainObject<Required extends ReadonlyArray<string>> =
      Required extends tuple.Tuple0 ? {} :
      Required extends ReadonlyArray<infer U> ? { readonly required: U } :
      {}
  }
}

export namespace json {

  export interface AnyArray extends ReadonlyArray<Any>{}

  export type AnyObject = { readonly [k in string]?: Any }

  export type Any = boolean|string|null|number|AnyArray|AnyObject

  export interface ArrayOf<Items extends schema.NormObject> extends ReadonlyArray<FromNorm<Items>> {}

  export type ArrayType<Items extends schema.NormObject> =
    {} extends Items ? AnyArray : ArrayOf<Items>

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
    ( {} extends AdditionalProperties ? AnyObject :
      AdditionalProperties extends false ? {} :
      AdditionalPropertiesObject<AdditionalProperties | meta.Property<Properties[keyof Properties]>>
    ) &
    ({} extends Properties ? AnyObject : PropertiesObject<Properties>) &
    ({ readonly [K in Required]: Any })

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
*/