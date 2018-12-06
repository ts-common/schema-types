import { schema, meta, json } from "./index"
import * as tscJson from "@ts-common/json"
import * as assert from "assert"
import * as iterator from "@ts-common/iterator"

const typeEqualAssert = <A, B>(_true: meta.Equal<A, B>) => {}

typeEqualAssert<number, number>(true)
typeEqualAssert<number, string>(false)
typeEqualAssert<never, never>(true)
typeEqualAssert<boolean|null, boolean>(false)

describe("schema", () => {
  it("MainObjectTypeNorm", () => {
    typeEqualAssert<schema.MainObjectTypeNorm<undefined>, schema.SimpleTypes>(true)
    typeEqualAssert<schema.MainObjectTypeNorm<[]>, schema.SimpleTypes>(true)
    typeEqualAssert<schema.MainObjectTypeNorm<"number">, "number">(true)
    typeEqualAssert<schema.MainObjectTypeNorm<["integer"]>, "integer">(true)
    typeEqualAssert<schema.MainObjectTypeNorm<["integer", "string"]>, "string" | "integer">(true)
  })
  it("MainObjectNorm", () => {
    typeEqualAssert<schema.MainObjectNorm<{}>, schema.SimpleTypes>(true)
    typeEqualAssert<schema.MainObjectNorm<{ type: "boolean" }>, "boolean">(true)
    typeEqualAssert<schema.MainObjectNorm<{ type: ["string"|"null"] }>, "null"|"string">(true)
    typeEqualAssert<schema.MainObjectNorm<{ type: "array" }>, "array">(true)
    typeEqualAssert<schema.MainObjectNorm<{ type: [] }>, schema.SimpleTypes>(true)
  })
  it("MainNorm", () => {
    typeEqualAssert<schema.MainNorm<true>, schema.SimpleTypes>(true)
    typeEqualAssert<schema.MainNorm<false>, never>(true)
    typeEqualAssert<
      schema.MainNorm<{ type: ["boolean", "number", "null"] }>,
      "boolean"|"null"|"number"
    >(true)
  })
})

describe("json", () => {
  it("SimpleTypes", () => {
    typeEqualAssert<json.SimpleTypes<"number">, number>(true)
    typeEqualAssert<json.SimpleTypes<"integer">, number>(true)
    typeEqualAssert<json.SimpleTypes<"string">, string>(true)
    typeEqualAssert<json.SimpleTypes<"null">, null>(true)
    typeEqualAssert<json.SimpleTypes<"boolean">, boolean>(true)
    typeEqualAssert<json.SimpleTypes<"object">, tscJson.JsonObject>(true)
    typeEqualAssert<json.SimpleTypes<"array">, tscJson.JsonArray>(true)

    // example
    const validate = <T extends schema.SimpleTypes>(v: T): json.SimpleTypes<T> =>
      (v === "number" ? 501.32 : undefined) as json.SimpleTypes<T>
    const v = validate("number")
    assert.deepStrictEqual(v, 501.32)
  })
  it("MainObjectType", () => {
    typeEqualAssert<json.MainObjectType<undefined>, tscJson.Json>(true)
    typeEqualAssert<json.MainObjectType<"number">, number>(true)
    typeEqualAssert<json.MainObjectType<"integer">, number>(true)
    typeEqualAssert<json.MainObjectType<"string">, string>(true)
    typeEqualAssert<json.MainObjectType<"null">, null>(true)
    typeEqualAssert<json.MainObjectType<"boolean">, boolean>(true)
    typeEqualAssert<json.MainObjectType<"object">, tscJson.JsonObject>(true)
    typeEqualAssert<json.MainObjectType<"array">, tscJson.JsonArray>(true)
    typeEqualAssert<json.MainObjectType<[]>, tscJson.Json>(true)
    typeEqualAssert<json.MainObjectType<["string"]>, string>(true)
    typeEqualAssert<json.MainObjectType<["integer", "boolean"]>, number|boolean>(true)
    typeEqualAssert<json.MainObjectType<["integer", "number"]>, number>(true)
    typeEqualAssert<json.MainObjectType<["integer", "boolean", "null"]>, number|boolean|null>(true)
    typeEqualAssert<
      json.MainObjectType<["integer", "boolean", "null", "string"]>,
      number|boolean|null|string
    >(true)
    typeEqualAssert<
      json.MainObjectType<["integer", "boolean", "null", "string", "array"]>,
      number|boolean|null|string|tscJson.JsonArray
    >(true)
    typeEqualAssert<
      json.MainObjectType<["integer", "boolean", "null", "string", "array", "object"]>,
      tscJson.Json
    >(true)
    typeEqualAssert<
      json.MainObjectType<["integer", "boolean", "null", "string", "array", "object", "number"]>,
      tscJson.Json
    >(true)

    // example
    const create = <T extends schema.MainObjectType>(v: T): json.MainObjectType<T> => {
      if (iterator.isArray(v)) {
        if (v.length === 0) {
          return "anything" as json.MainObjectType<T>
        }
        for (const i of v) {
          if (i === "string") {
            return "some string" as json.MainObjectType<T>
          }
        }
      }
      if (v === "number") {
        return 89 as json.MainObjectType<T>
      }
      return "anything" as json.MainObjectType<T>
    }
    const dd = create([])
    assert.deepStrictEqual(dd, "anything")
    const rs = create(["boolean", "string"])
    assert.deepStrictEqual(rs, "some string")
    const rn = create("number")
    assert.deepStrictEqual(rn, 89)
  })
  it("MainObject", () => {
    typeEqualAssert<json.MainObject<{}>, tscJson.Json>(true)
    typeEqualAssert<json.MainObject<{ type: "boolean" }>, boolean>(true)
    typeEqualAssert<json.MainObject<{ type: ["string"|"null"] }>, null|string>(true)
    typeEqualAssert<json.MainObject<{ type: "array" }>, tscJson.JsonArray>(true)
  })
  it("Main", () => {
    typeEqualAssert<json.Main<true>, tscJson.Json>(true)
    typeEqualAssert<json.Main<false>, never>(true)
    typeEqualAssert<
      schema.MainNorm<{ type: ["boolean", "number", "null"] }>,
      "boolean"|"null"|"number"
    >(true)
  })
})

  /*
  it("MainObject", () => {
    typeEqualAssert<index.MainObject<undefined>, index.Json>(true)
    typeEqualAssert<index.MainObject<{}>, index.Json>(true)
    typeEqualAssert<index.MainObject<{ type: "boolean" }>, boolean>(true)
    typeEqualAssert<index.MainObject<{ type: ["string"|"null"] }>, null|string>(true)
    typeEqualAssert<index.MainObject<{ type: "array" }>, index.JsonArray>(true)

    type Array = index.MainObject<{ type: "array", items: { type: "number" } }>
    const a: ReadonlyArray<number> = [5]
    const b: Array = a
    const c: ReadonlyArray<number> = b
    assert.deepStrictEqual(c, [5])
    typeEqualAssert<
      index.MainObject<{ type: "array", items: { type: "number" } }>,
      index.JsonArray<{type: "number"}>
    >(true)
  })
})
*/
