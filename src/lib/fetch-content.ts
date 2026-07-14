import type { AutoContent, GitHubProject } from "../types/content"

const GITHUB_USERNAME = "Sumit884-byte"

function formatRepoTitle(name: string) {
  return name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export async function fetchGitHubProjects(): Promise<GitHubProject[]> {
  const response = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&type=owner`,
  )

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }

  const repos = await response.json()

  return repos
    .filter((repo: { private: boolean; fork: boolean; name: string }) => {
      return !repo.private && !repo.fork && repo.name !== "rsume-site" && repo.name !== "resume-site"
    })
    .map(
      (repo: {
        name: string
        description: string | null
        html_url: string
        stargazers_count: number
        updated_at: string
        language: string | null
      }) => {
        const description = repo.description?.trim()
        const descriptionPoints = description
          ? description.split(/\.\s+/).filter(Boolean).map((part) => (part.endsWith(".") ? part : `${part}.`))
          : ["Open-source project hosted on GitHub."]

        return {
          title: formatRepoTitle(repo.name),
          description: descriptionPoints,
          tags: repo.language ? [repo.language] : [],
          url: repo.html_url,
          stars: repo.stargazers_count,
          updatedAt: repo.updated_at,
          source: "github" as const,
        }
      },
    )
    .sort((a: GitHubProject, b: GitHubProject) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export function mergeAutoContent(projects: GitHubProject[], base: AutoContent): AutoContent {
  return {
    ...base,
    syncedAt: new Date().toISOString(),
    projects,
  }
}
