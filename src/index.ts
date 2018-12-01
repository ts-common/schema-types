import * as schema from "@ts-common/schema"
import * as json from "@ts-common/json"

export type SimpleTypes<T extends schema.SimpleTypes> =
  T extends "string" ? string :
  T extends "boolean" ? boolean :
  T extends "integer"|"number" ? number :
  T extends "null" ? null :
  T extends "array" ? json.JsonArray :
  T extends "object" ? json.JsonObject :
  never