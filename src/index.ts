import { App } from "./app"

const app = new App()
app.init()

export const db = app.useDB
