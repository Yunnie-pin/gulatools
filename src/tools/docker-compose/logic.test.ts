import { describe, expect, it } from "vitest"
import { parse } from "yaml"
import { dockerRunToCompose } from "./logic"

const compose = (input: string) => parse(dockerRunToCompose(input).yaml)

describe("dockerRunToCompose", () => {
  it("maps the common flags to their compose keys", () => {
    const result = compose(
      "docker run -d --name web -p 8080:80 -v ./html:/usr/share/nginx/html:ro -e TZ=Asia/Jakarta --restart unless-stopped nginx:1.27",
    )
    expect(result).toEqual({
      services: {
        web: {
          image: "nginx:1.27",
          container_name: "web",
          ports: ["8080:80"],
          volumes: ["./html:/usr/share/nginx/html:ro"],
          environment: ["TZ=Asia/Jakarta"],
          restart: "unless-stopped",
        },
      },
    })
  })

  it("expands combined short flags and attached values", () => {
    const { services } = compose("docker run -it -p3000:3000 -eNODE_ENV=production node:22 npm start")
    expect(services.node).toEqual({
      image: "node:22",
      stdin_open: true,
      tty: true,
      ports: ["3000:3000"],
      environment: ["NODE_ENV=production"],
      command: ["npm", "start"],
    })
  })

  it("keeps everything after the image as the command, even things that look like flags", () => {
    expect(compose("docker run --rm alpine ls -la /").services.alpine.command).toEqual(["ls", "-la", "/"])
  })

  it("declares custom networks as external but uses network_mode for built-in ones", () => {
    expect(compose("docker run --network=backend redis")).toEqual({
      services: { redis: { image: "redis", networks: ["backend"] } },
      networks: { backend: { external: true } },
    })
    expect(compose("docker run --net host redis").services.redis.network_mode).toBe("host")
  })

  it("builds healthcheck and logging blocks", () => {
    const { services } = compose(
      `docker run --health-cmd "curl -f http://localhost/" --health-interval 30s --log-driver json-file --log-opt max-size=10m app`,
    )
    expect(services.app.healthcheck).toEqual({ test: ["CMD-SHELL", "curl -f http://localhost/"], interval: "30s" })
    expect(services.app.logging).toEqual({ driver: "json-file", options: { "max-size": "10m" } })
  })

  it("turns several commands into several services with unique names", () => {
    const { services } = compose("docker run redis\ndocker container run \\\n  -p 6380:6379 redis")
    expect(Object.keys(services)).toEqual(["redis", "redis-2"])
  })

  it("reports flags it could not convert instead of dropping them silently", () => {
    expect(dockerRunToCompose("docker run --gpus all --mount type=tmpfs,dst=/x -P img").ignored).toEqual([
      "--gpus",
      "--mount",
      "--publish-all",
    ])
  })

  it("names the service after the image without registry or tag", () => {
    expect(Object.keys(compose("docker run ghcr.io/org/my.app:2@sha256:abc").services)).toEqual(["my-app"])
  })

  it("rejects input that is not docker run", () => {
    expect(() => dockerRunToCompose("docker ps")).toThrow("docker run")
    expect(() => dockerRunToCompose("docker run -d")).toThrow("image")
  })
})
