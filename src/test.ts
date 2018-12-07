import { schema, meta, json } from "./index"
import * as tscJson from "@ts-common/json"
import * as assert from "assert"

const typeEqualAssert = <A, B>(_true: meta.Equal<A, B>) => {}

typeEqualAssert<number, number>(true)
typeEqualAssert<number, string>(false)
typeEqualAssert<never, never>(true)
typeEqualAssert<boolean|null, boolean>(false)

describe("schema", () => {
  it("simpleTypes.FromMainObjectType", () => {
    typeEqualAssert<schema.simpleTypes.FromMainObjectType<undefined>, schema.SimpleTypes>(true)
    typeEqualAssert<schema.simpleTypes.FromMainObjectType<[]>, schema.SimpleTypes>(true)
    typeEqualAssert<schema.simpleTypes.FromMainObjectType<"number">, "number">(true)
    typeEqualAssert<schema.simpleTypes.FromMainObjectType<["integer"]>, "integer">(true)
    typeEqualAssert<schema.simpleTypes.FromMainObjectType<["integer", "string"]>, "string" | "integer">(true)
  })
  it("norm.FromMainObject", () => {
    typeEqualAssert<schema.norm.FromMainObject<{}>, {}>(true)
    typeEqualAssert<schema.norm.FromMainObject<{ type: "boolean" }>, { type: "boolean" }>(true)
    typeEqualAssert<schema.norm.FromMainObject<{ type: ["string"|"null"] }>, { type: "null"|"string" }>(true)
    typeEqualAssert<schema.norm.FromMainObject<{ type: "array" }>, { type: "array" }>(true)
    typeEqualAssert<schema.norm.FromMainObject<{ type: [] }>, {}>(true)
    typeEqualAssert<schema.norm.FromMainObject<{ type: "array", items: {} }>, { type: "array" }>(true)
    typeEqualAssert<schema.norm.FromMainObject<
      { type: "array", items: { type: ["number", "string"] } }>,
      { type: "array", items: { type: "number"|"string" } }
    >(true)
  })
  it("norm.FromMain", () => {
    typeEqualAssert<schema.norm.FromMain<true>, {}>(true)
    typeEqualAssert<schema.norm.FromMain<false>, never>(true)
    typeEqualAssert<
      schema.norm.FromMain<{ type: ["boolean", "number", "null"] }>,
      { type: "boolean"|"null"|"number" }
    >(true)
    typeEqualAssert<schema.norm.FromMain<{ type: "array" }>, { type: "array" }>(true)
    typeEqualAssert<schema.norm.FromMain<{ type: ["array", "boolean"] }>, { type: "array"|"boolean" }>(true)
    typeEqualAssert<
      schema.norm.FromMain<{ type: ["array", "string"], items: { type: "number" } }>,
      { type: "array"|"string", items: { type: "number" }}
    >(true)
    typeEqualAssert<
      schema.norm.FromMain<{ type: ["string"], items: { type: "number" } }>,
      { type: "string", items: { type: "number" }}
    >(false)
    typeEqualAssert<
      schema.norm.FromMain<{ type: ["string"], items: { type: "number" } }>,
      { type: "string" }
    >(true)
    typeEqualAssert<
      schema.norm.FromMain<{ items: { type: "number" } }>,
      { items: { type: "number" } }
    >(true)
  })
})

describe("json", () => {
  it("Types", () => {
    typeEqualAssert<json.FromMain<true>, tscJson.Json>(true)
    typeEqualAssert<json.FromMain<false>, never>(true)
    typeEqualAssert<json.FromMain<{}>, tscJson.Json>(true)
    typeEqualAssert<json.FromMain<{ type: "number" }>, number>(true)
    typeEqualAssert<json.FromMain<{ type: ["number"|"string"] }>, number|string>(true)
    typeEqualAssert<json.FromMain<{ type: ["array"|"string"] }>, tscJson.JsonArray|string>(true)
    typeEqualAssert<json.FromMain<{ type: "array" }>, tscJson.JsonArray>(true)
    typeEqualAssert<json.FromMain<{ type: ["array"], items: {} }>, tscJson.JsonArray>(true)
    typeEqualAssert<
      json.FromMain<{ type: ["array"], items: { type: ["number", "boolean", "null"] } }>,
      ReadonlyArray<number|boolean|null>
    >(true)
    typeEqualAssert<
      json.FromMain<{ type: ["array"], items: { type: "array", items: { type: "boolean" } } }>,
      ReadonlyArray<ReadonlyArray<boolean>>
    >(true)
    typeEqualAssert<
      json.FromMain<{ type: ["array"], items: { type: "array", items: { type: "boolean" } } }>,
      ReadonlyArray<ReadonlyArray<string>>
    >(false)
    typeEqualAssert<
      json.FromMain<{ type: ["array", "string"], items: { type: "array", items: { type: "boolean" } } }>,
      ReadonlyArray<ReadonlyArray<boolean>>|string
    >(true)
    typeEqualAssert<
      json.FromMain<{ items: { type: "number" }}>,
      ReadonlyArray<number>|string|number|boolean|null|tscJson.JsonObject
    >(true)
    typeEqualAssert<json.FromMain<{}>, tscJson.Json>(true)
    typeEqualAssert<json.FromMain<{ type: "boolean" }>, boolean>(true)
    typeEqualAssert<json.FromMain<{ type: ["string"|"null"] }>, null|string>(true)
    typeEqualAssert<json.FromMain<{ type: "array" }>, tscJson.JsonArray>(true)
    type Array = json.FromMain<{ type: "array", items: { type: "number" } }>
    const a: ReadonlyArray<number> = [5]
    const b: Array = a
    const c: ReadonlyArray<number> = b
    assert.deepStrictEqual(c, [5])
    typeEqualAssert<
      json.FromMain<{ type: "array", items: { type: "number" } }>,
      ReadonlyArray<number>
    >(true)
    typeEqualAssert<json.FromMain<true>, tscJson.Json>(true)
    typeEqualAssert<json.FromMain<false>, never>(true)
    typeEqualAssert<
      json.FromMain<{ type: ["boolean", "number", "null"] }>,
      boolean|null|number
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
