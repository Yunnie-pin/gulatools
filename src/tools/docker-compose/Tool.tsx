import { yaml } from "@codemirror/lang-yaml"
import { TransformTool } from "@/components/TransformTool"
import { currentMessages } from "@/i18n/locale"
import { dockerRunToCompose } from "./logic"
import { messages } from "./messages"

const language = yaml()

const SAMPLE = `docker run -d --name db \\
  -e POSTGRES_PASSWORD=change-me -v pgdata:/var/lib/postgresql/data \\
  --restart unless-stopped --network backend postgres:17
docker run -d --name api -p 8080:3000 --env-file .env \\
  --health-cmd "curl -f http://localhost:3000/health" --health-interval 30s \\
  --network backend ghcr.io/gula/api:latest`

function transform(input: string) {
  const { yaml, ignored } = dockerRunToCompose(input)
  return ignored.length ? `# ${currentMessages(messages).ignored(ignored.join(", "))}\n${yaml}` : yaml
}

export default function DockerCompose() {
  return <TransformTool transform={transform} outputLanguage={language} outputFileName="compose.yaml" sample={SAMPLE} />
}
