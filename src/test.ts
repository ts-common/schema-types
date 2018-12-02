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
    const x: index.MainObjectType<undefined> = "something"
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
    const x: index.MainObjectType<["integer", "boolean"]> = 56
    const r: number|boolean = x
    assert.deepStrictEqual(r, 56)
  })
})
