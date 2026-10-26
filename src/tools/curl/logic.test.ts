import { describe, expect, it } from "vitest"
import { convertCurl, parseCurl } from "./logic"

describe("parseCurl", () => {
  it("defaults to POST with a form content type when data is sent, like curl", () => {
    expect(parseCurl("curl https://x.id -d a=1 -d b=2")).toEqual({
      method: "POST",
      url: "https://x.id",
      headers: [["Content-Type", "application/x-www-form-urlencoded"]],
      body: "a=1&b=2",
    })
  })

  it("reads attached and combined short flags without swallowing the URL", () => {
    const request = parseCurl("curl -sSL -XPUT -H'X-Id: 7' x.id/a")
    expect(request).toMatchObject({ method: "PUT", url: "http://x.id/a", headers: [["X-Id", "7"]] })
  })

  it("skips values of ignored flags so they are not mistaken for the URL", () => {
    expect(parseCurl("curl -o out.json --max-time 5 https://x.id").url).toBe("https://x.id")
  })

  it("turns --user into a Basic Authorization header", () => {
    expect(parseCurl("curl -u gula:manis https://x.id").headers).toEqual([["Authorization", "Basic Z3VsYTptYW5pcw=="]])
  })

  it("moves data into the query string with -G", () => {
    expect(parseCurl("curl -G https://x.id?a=1 --data-urlencode 'q=gula manis'")).toMatchObject({
      method: "GET",
      url: "https://x.id?a=1&q=gula%20manis",
      body: undefined,
    })
  })

  it("sets JSON headers for --json", () => {
    const request = parseCurl(`curl --json '{"a":1}' https://x.id`)
    expect(request.headers).toEqual([
      ["Content-Type", "application/json"],
      ["Accept", "application/json"],
    ])
    expect(request.body).toBe('{"a":1}')
  })

  it("refuses multipart uploads instead of silently dropping them", () => {
    expect(() => parseCurl("curl -F file=@a.png https://x.id")).toThrow("--form")
  })

  it("requires a curl command with a URL", () => {
    expect(() => parseCurl("wget https://x.id")).toThrow("curl")
    expect(() => parseCurl("curl -s")).toThrow("URL")
  })
})

describe("convertCurl", () => {
  const command = `curl -X POST https://x.id/api -H 'Content-Type: application/json' -d '{"name":"gula"}'`

  it("writes fetch code", () => {
    expect(convertCurl(command, "fetch")).toBe(
      `const response = await fetch("https://x.id/api", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: "{\\"name\\":\\"gula\\"}",
})
const text = await response.text()
console.log(text)
`,
    )
  })

  it("omits the init object for a plain GET", () => {
    expect(convertCurl("curl https://x.id", "fetch")).toContain('fetch("https://x.id")\n')
  })

  it("writes Python requests code", () => {
    const code = convertCurl(command, "python")
    expect(code).toContain('response = requests.post("https://x.id/api", headers=headers, data=data)')
    expect(convertCurl("curl -X PURGE https://x.id", "python")).toContain('requests.request("PURGE", "https://x.id")')
  })

  it("writes Go code that only imports strings when there is a body", () => {
    expect(convertCurl(command, "go")).toContain('body := strings.NewReader("{\\"name\\":\\"gula\\"}")')
    expect(convertCurl("curl https://x.id", "go")).not.toContain('"strings"')
  })
})
