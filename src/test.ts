import * as index from "./index"
import * as assert from "assert"
import * as json from "@ts-common/json"

describe("compile time test", () => {
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
    const r: object = x
    assert.deepStrictEqual(r, {})
  })
  it("array", () => {
    const x: index.SimpleTypes<"array"> = []
    const r: json.JsonArray = x
    assert.deepStrictEqual(r, [])
  })
})