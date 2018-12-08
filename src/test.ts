import { schema, meta, json } from "./index"
import * as assert from "assert"
import { SimpleTypes } from '@ts-common/schema';

const typeEqualAssert = <A, B>(_true: meta.Equal<A, B>) => {}

typeEqualAssert<number, number>(true)
typeEqualAssert<number, string>(false)
typeEqualAssert<never, never>(true)
typeEqualAssert<boolean|null, boolean>(false)

describe("schema", () => {
  it("simpleTypes.FromMainObjectType", () => {
    typeEqualAssert<schema.simpleTypes.FromMainObjectType<SimpleTypes>, schema.SimpleTypes>(true)
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
    typeEqualAssert<schema.norm.FromMain<false>, false>(true)
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
    typeEqualAssert<
      schema.norm.FromMain<{ additionalProperties: { type: "number" } }>,
      { additionalProperties: { type: "number" } }
    >(true)
    typeEqualAssert<
      schema.norm.FromMain<{ additionalProperties: { type: "number" }, type: "string" }>,
      { type: "string" }
    >(true)
    typeEqualAssert<
      schema.norm.FromMain<{
        additionalProperties: { type: "number" },
        items: { type: "string" }
        type: ["string", "array", "object"]
      }>,
      {
        type: "string"|"array"|"object",
        items: { type: "string" },
        additionalProperties: { type: "number" }
      }
    >(true)
    typeEqualAssert<
      schema.norm.FromMain<{ type: "object", properties: { x: { type: ["string", "number"] } } }>,
      { type: "object", properties: { x: { type: "string"|"number" } } }
    >(true)
    typeEqualAssert<
      schema.norm.FromMain<{ type: "object", properties: { x: { type: ["string", "number"] } } }>,
      { type: "object", properties: { x: { type: "string"|"number" } } }
    >(true)
    const zzz: schema.norm.FromMain<{ type: "object", additionalProperties: false }> = {
      type: "object",
      additionalProperties: false
    }
    typeEqualAssert<typeof zzz.additionalProperties, false>(true)
    typeEqualAssert<
      schema.norm.FromMain<{ type: "object", additionalProperties: false }>,
      { readonly type: "object", additionalProperties: false }
    >(true)
    typeEqualAssert<schema.mainObject.GetItems<{ items: false }>, false>(true)
    typeEqualAssert<schema.norm.FromMain<{ items: false }>, { items: false }>(true)
    typeEqualAssert<schema.norm.FromMain<{ properties: { a: false }}>, { properties: { a: false }}>(true)
    typeEqualAssert<schema.norm.FromMain<{ required: ["aa", "bcd" ] }>, { required: "aa"|"bcd" }>(true)
    typeEqualAssert<schema.norm.FromMain<{ required: [] }>, {}>(true)
  })
})

describe("json", () => {
  it("Types", () => {
    // const v: json.FromMain<true> =
    typeEqualAssert<json.FromMain<true>, json.Json>(true)
    typeEqualAssert<json.FromMain<false>, never>(true)
    typeEqualAssert<json.FromMain<{}>, json.Json>(true)
    typeEqualAssert<json.FromMain<{ type: "number" }>, number>(true)
    typeEqualAssert<json.FromMain<{ type: ["number"|"string"] }>, number|string>(true)
    typeEqualAssert<json.FromMain<{ type: ["array"|"string"] }>, json.JsonArray|string>(true)
    typeEqualAssert<json.FromMain<{ type: "array" }>, json.JsonArray>(true)
    typeEqualAssert<json.FromMain<{ type: ["array"], items: {} }>, json.JsonArray>(true)
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
      ReadonlyArray<number>|string|number|boolean|null|json.JsonObject
    >(true)
    typeEqualAssert<json.FromMain<{}>, json.Json>(true)
    typeEqualAssert<json.FromMain<{ type: "boolean" }>, boolean>(true)
    typeEqualAssert<json.FromMain<{ type: ["string"|"null"] }>, null|string>(true)
    typeEqualAssert<json.FromMain<{ type: "array" }>, json.JsonArray>(true)
    type Array = json.FromMain<{ type: "array", items: { type: "number" } }>
    const a: ReadonlyArray<number> = [5]
    const b: Array = a
    const c: ReadonlyArray<number> = b
    assert.deepStrictEqual(c, [5])
    typeEqualAssert<
      json.FromMain<{ type: "array", items: { type: "number" } }>,
      ReadonlyArray<number>
    >(true)
    typeEqualAssert<json.FromMain<true>, json.Json>(true)
    typeEqualAssert<json.FromMain<false>, never>(true)
    typeEqualAssert<
      json.FromMain<{ type: ["boolean", "number", "null"] }>,
      boolean|null|number
    >(true)
    typeEqualAssert<
      json.FromMain<{ type: "object", additionalProperties: { type: "number" } }>,
      { readonly [k in string]?: number }
    >(true)
    const x: json.FromMain<{ type: "object", additionalProperties: { type: "number" }}> = { x: 56 }
    assert.deepStrictEqual(x.x, 56)
    typeEqualAssert<
      json.FromMain<{ additionalProperties: { type: "number" }, items: { type: "string" } }>,
      { readonly [k in string]?: number }|string|number|null|boolean|ReadonlyArray<string>
    >(true)
    const xx: json.FromMain<{ type: "object", properties: { a: { type: "number" } } }> = { b: "56", a: 45 }
    assert.strictEqual(xx.a, 45)
    assert.strictEqual(xx.b, "56")
    typeEqualAssert<
      json.FromMain<{ type: "object", properties: { a: { type: "number" } } }>,
      { readonly a?: number } & {}
    >(true)
    const zzz: { readonly a?: number } & { readonly [v in string]?: boolean|number } = {
      a: 456,
      b: 678,
    }
    assert.strictEqual(zzz.b, 678)
    const zz: json.FromMain<{ type: "object", properties: { a: { type: "number" } }, additionalProperties: { type: "boolean"} }> = {
      a: 45,
      b: true,
    }
    typeEqualAssert<keyof typeof zz, string>(true)
    typeEqualAssert<typeof zz.a, number|undefined>(true)
    typeEqualAssert<typeof zz.b, number|boolean|undefined>(true)
    typeEqualAssert<
      json.FromMain<{ type: "object", properties: { a: { type: "number" } }, additionalProperties: { type: "boolean"} }>,
      { readonly a?: number, readonly [v: string]: number|undefined }
    >(true)
    const r: { readonly a?: number } & { readonly [v in string]: json.Json } = { b: 56 }
    assert.strictEqual(r.b, 56)
    typeEqualAssert<
      json.FromMain<{ type: "object", properties: { a: { type: "number" } }, additionalProperties: false }>,
      { readonly a?: number }
    >(true)
    typeEqualAssert<json.FromMain<{ type: "array", items: false }>, ReadonlyArray<never>>(true)
    const rr: json.FromMain<{ type: "object", properties: { a: { type: "number" } }, additionalProperties: false }> = { a: 56 }
    typeEqualAssert<typeof rr.a, number|undefined>(true)
    typeEqualAssert<keyof typeof rr, "a">(true)
    const dfg: json.FromMain<{ type: "object", properties: { a: false } }> = { }
    typeEqualAssert<typeof dfg.b, json.Json|undefined>(true)
    typeEqualAssert<typeof dfg.a, undefined>(true)
    const x98: json.FromMain<{ type: "object", required: ["a"] }> = { a: 5, b: 9 }
    typeEqualAssert<typeof x98.a, json.Json>(true)
    typeEqualAssert<keyof typeof x98, string>(true)
    typeEqualAssert<json.FromMain<{ type: "object", required: ["a"] }>, { readonly a: json.Json }>(true)
    typeEqualAssert<
      json.FromMain<{ type: "object", required: ["a"], additionalProperties: false }>,
      { readonly a: json.Json }
    >(true)
    const ytu: json.FromMain<{ type: "object", required: ["a"], additionalProperties: false }> = { a: 7 }
    const ytu2: {} & { readonly a: json.Json } = { a: 5 }
    typeEqualAssert<keyof typeof ytu2, "a">(true)
    typeEqualAssert<keyof typeof ytu, "a">(true)
    typeEqualAssert<json.FromMain<{ type: "object", additionalProperties: false }>, {}>(true)
    const empty: json.FromMain<{ type: "object", additionalProperties: false }> = {}
    typeEqualAssert<keyof typeof empty, never>(true)
    /*
    const s = schema.main({
      type: ["object", "string"],
      properties: {
        a: { type: "boolean" }
      },
      required: ["a"],
      additionalProperties: false,
    })
    */
    const requiredA: json.FromMain<{
      type: "object"
      properties: {
        a: { type: "boolean" }
      }
      required: ["a"]
      additionalProperties: false
    }> = { a: true }
    typeEqualAssert<keyof typeof requiredA, "a">(true)
    typeEqualAssert<
      json.FromMain<{
        type: "object",
        properties: {
          a: { type: "boolean" }
        },
        required: ["a"]
      }>,
      { readonly a: boolean }
    >(true)
  })
})
