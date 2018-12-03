import * as index from "./index"
import * as json from "@ts-common/json"
import * as schema from "@ts-common/schema"
import * as iterator from "@ts-common/iterator"
import * as assert from "assert"

type Equal<A, B> = A | B extends A & B ? true : false

const typeEqualAssert = <A, B>(_true: Equal<A, B>) => {}

typeEqualAssert<number, number>(true)
typeEqualAssert<number, string>(false)
typeEqualAssert<never, never>(true)
typeEqualAssert<boolean|null, boolean>(false)

describe("Compile Time", () => {
  it("SimpleTypes", () => {
    typeEqualAssert<index.SimpleTypes<"number", undefined>, number>(true)
    typeEqualAssert<index.SimpleTypes<"integer", undefined>, number>(true)
    typeEqualAssert<index.SimpleTypes<"string", undefined>, string>(true)
    typeEqualAssert<index.SimpleTypes<"null", undefined>, null>(true)
    typeEqualAssert<index.SimpleTypes<"boolean", undefined>, boolean>(true)
    typeEqualAssert<index.SimpleTypes<"object", undefined>, json.JsonObject>(true)
    typeEqualAssert<index.SimpleTypes<"array", undefined>, json.JsonArray>(true)

    // example
    const validate = <T extends schema.SimpleTypes>(v: T): index.SimpleTypes<T, undefined> =>
      (v === "number" ? 501.32 : undefined) as index.SimpleTypes<T, undefined>
    const v = validate("number")
    assert.deepStrictEqual(v, 501.32)
  })
  it("MainObjectType", () => {
    typeEqualAssert<index.MainObjectType<undefined>, json.Json>(true)
    typeEqualAssert<index.MainObjectType<"number">, number>(true)
    typeEqualAssert<index.MainObjectType<"integer">, number>(true)
    typeEqualAssert<index.MainObjectType<"string">, string>(true)
    typeEqualAssert<index.MainObjectType<"null">, null>(true)
    typeEqualAssert<index.MainObjectType<"boolean">, boolean>(true)
    typeEqualAssert<index.MainObjectType<"object">, json.JsonObject>(true)
    typeEqualAssert<index.MainObjectType<"array">, index.JsonArray>(true)
    typeEqualAssert<index.MainObjectType<[]>, void>(true)
    typeEqualAssert<index.MainObjectType<["string"]>, string>(true)
    typeEqualAssert<index.MainObjectType<["integer", "boolean"]>, number|boolean>(true)
    typeEqualAssert<index.MainObjectType<["integer", "number"]>, number>(true)
    typeEqualAssert<index.MainObjectType<["integer", "boolean", "null"]>, number|boolean|null>(true)
    typeEqualAssert<
      index.MainObjectType<["integer", "boolean", "null", "string"]>,
      number|boolean|null|string
    >(true)
    typeEqualAssert<
      index.MainObjectType<["integer", "boolean", "null", "string", "array"]>,
      number|boolean|null|string|index.ArrayType<{}>
    >(true)
    typeEqualAssert<
      index.MainObjectType<["integer", "boolean", "null", "string", "array", "object"]>,
      index.Json
    >(true)
    typeEqualAssert<
      index.MainObjectType<["integer", "boolean", "null", "string", "array", "object", "number"]>,
      index.Json
    >(true)

    // example
    const validate = <T extends index.SchemaMainObjectType>(v: T): index.MainObjectType<T> => {
      if (iterator.isArray(v)) {
        for (const i of v) {
          if (i === "string") {
            return "some string" as index.MainObjectType<T>
          }
        }
      }
      if (v === "number") {
        return 89 as index.MainObjectType<T>
      }
      return undefined as index.MainObjectType<T>
    }
    const rs = validate(["boolean", "string"])
    assert.deepStrictEqual(rs, "some string")
    const rn = validate("number")
    assert.deepStrictEqual(rn, 89)
  })
  it("MainObject", () => {
    typeEqualAssert<index.MainObject<undefined>, index.Json>(true)
    typeEqualAssert<index.MainObject<{}>, index.Json>(true)
    typeEqualAssert<index.MainObject<{ type: "boolean" }>, boolean>(true)
    typeEqualAssert<index.MainObject<{ type: ["string"|"null"] }>, null|string>(true)
    typeEqualAssert<index.MainObjectType<"array", {}>, index.JsonArray>(true)
    typeEqualAssert<index.MainObject<{ type: "array" }>, index.JsonArray>(true)
  })
})
