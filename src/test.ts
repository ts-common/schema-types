import * as index from "./index"
import * as assert from "assert"
import * as json from "@ts-common/json"

describe("SchemaObjectType", () => {
  it("number", () => {
    const x: index.SimpleTypes<"number"> = 5
    const r: number = x
    assert.strictEqual(r, 5)
  })
  it("integer", () => {
    const x: index.SimpleTypes<"integer"> = 5
    const r: number = x
    assert.strictEqual(r, 5)
  })
  it("string", () => {
    const x: index.SimpleTypes<"string"> = "s"
    const r: string = x
    assert.strictEqual(r, "s")
  })
  it("null", () => {
    const x: index.SimpleTypes<"null"> = null
    const r: null = x
    assert.strictEqual(r, null)
  })
  it("boolean", () => {
    const x: index.SimpleTypes<"boolean"> = true
    const r: boolean = x
    assert.strictEqual(r, true)
  })
  it("object", () => {
    const x: index.SimpleTypes<"object"> = {}
    const r: json.JsonObject = x
    assert.deepStrictEqual(r, {})
  })
  it("array", () => {
    const x: index.SimpleTypes<"array"> = []
    const r: json.JsonArray = x
    assert.deepStrictEqual(r, [])
  })
})

describe("MainObjectType", () => {
  it("undefined", () => {
    const i: json.Json = "something"
    const x: index.MainObjectType<undefined> = i
    const r: json.Json = x
    assert.deepStrictEqual(r, "something")
  })
  it("number", () => {
    const x: index.MainObjectType<"number"> = 5
    const r: number = x
    assert.strictEqual(r, 5)
  })
  it("integer", () => {
    const x: index.MainObjectType<"integer"> = 5
    const r: number = x
    assert.strictEqual(r, 5)
  })
  it("string", () => {
    const x: index.MainObjectType<"string"> = "s"
    const r: string = x
    assert.strictEqual(r, "s")
  })
  it("null", () => {
    const x: index.MainObjectType<"null"> = null
    const r: null = x
    assert.strictEqual(r, null)
  })
  it("boolean", () => {
    const x: index.MainObjectType<"boolean"> = false
    const r: boolean = x
    assert.strictEqual(r, false)
  })
  it("object", () => {
    const x: index.MainObjectType<"object"> = {}
    const r: json.JsonObject = x
    assert.deepStrictEqual(r, {})
  })
  it("array", () => {
    const x: index.MainObjectType<"array"> = []
    const r: json.JsonArray = x
    assert.deepStrictEqual(r, [])
  })
  it("[]", () => {
    const x: index.MainObjectType<[]> = undefined as never
    const r: never = x
    assert.deepStrictEqual(r, undefined)
  })
  it('["string"]', () => {
    const x: index.MainObjectType<["string"]> = "some string"
    const r: string = x
    assert.deepStrictEqual(r, "some string")
  })
  it(`["integer", "boolean"]`, () => {
    const i: number|boolean = 56
    const x: index.MainObjectType<["integer", "boolean"]> = i
    const r: number|boolean = x
    assert.deepStrictEqual(r, 56)
  })
  it(`["integer", "number"]`, () => {
    const i: number = 156
    const x: index.MainObjectType<["integer", "number"]> = i
    const r: number = x
    assert.deepStrictEqual(r, 156)
  })
  it(`["integer", "boolean", "null"]`, () => {
    const i: number|boolean|null = null
    const x: index.MainObjectType<["integer", "boolean", "null"]> = i
    const r: number|boolean|null = x
    assert.deepStrictEqual(r, null)
  })
  it(`["integer", "boolean", "null", "string"]`, () => {
    const i: number|boolean|null|string = "null"
    const x: index.MainObjectType<["integer", "boolean", "null", "string"]> = i
    const r: number|boolean|null|string = x
    assert.deepStrictEqual(r, "null")
  })
  it(`["integer", "boolean", "null", "string", "array"]`, () => {
    const i: number|boolean|null|string|number[] = [34]
    const x: index.MainObjectType<["integer", "boolean", "null", "string", "array"]> = i
    const r: number|boolean|null|string|json.JsonArray = x
    assert.deepStrictEqual(r, [34])
  })
  it(`["integer", "boolean", "null", "string", "array", "object"]`, () => {
    const i: number|boolean|null|string|number[]|{} = {}
    const x: index.MainObjectType<["integer", "boolean", "null", "string", "array", "object"]> = i
    const r: json.Json = x
    assert.deepStrictEqual(r, {})
  })
  it(`["integer", "boolean", "null", "string", "array", "object", "number"]`, () => {
    const i: number|boolean|null|string|number[]|{} = 56.7
    const x: index.MainObjectType<
        ["integer", "boolean", "null", "string", "array", "object", "number"]
      > =i
    const r: json.Json = x
    assert.deepStrictEqual(r, 56.7)
  })
})
