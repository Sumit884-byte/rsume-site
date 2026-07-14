#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const OUTPUT = join(ROOT, "src/data/auto-content.json")

const GITHUB_USERNAME = "Sumit884-byte"
const LINKEDIN_USERNAME = "sumit0rn"
const PROFILE_IMAGE = "/images/profile.jpg"

const EXCLUDED_REPOS = new Set(["rsume-site", "resume-site"])

const githubHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "rsume-site-sync",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
}

function formatRepoTitle(name) {
  return name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function readExistingContent() {
  if (!existsSync(OUTPUT)) return null
  try {
    return JSON.parse(readFileSync(OUTPUT, "utf8"))
  } catch {
    return null
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}`)
  }
  return response.json()
}

async function fetchGitHubProjects() {
  const repos = await fetchJson(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&type=owner`,
    { headers: githubHeaders },
  )

  const publicRepos = repos.filter((repo) => !repo.private && !repo.fork && !EXCLUDED_REPOS.has(repo.name))

  const projects = await Promise.all(
    publicRepos.map(async (repo) => {
      let topics = []
      try {
        const topicData = await fetchJson(`https://api.github.com/repos/${repo.full_name}/topics`, {
          headers: {
            ...githubHeaders,
            Accept: "application/vnd.github.mercy-preview+json",
          },
        })
        topics = topicData.names ?? []
      } catch {
        topics = []
      }

      const description = repo.description?.trim()
      const descriptionPoints = description
        ? description.split(/\.\s+/).filter(Boolean).map((part) => (part.endsWith(".") ? part : `${part}.`))
        : [`Open-source project hosted on GitHub.`]

      const tags = [...new Set([repo.language, ...topics].filter(Boolean))].slice(0, 6)

      return {
        title: formatRepoTitle(repo.name),
        description: descriptionPoints,
        tags,
        url: repo.html_url,
        stars: repo.stargazers_count,
        updatedAt: repo.updated_at,
        source: "github",
      }
    }),
  )

  return projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

async function main() {
  const existing = readExistingContent()
  let projects = existing?.projects ?? []
  let syncedAt = existing?.syncedAt ?? new Date().toISOString()
  let githubSynced = false

  try {
    console.log(`Syncing GitHub projects for @${GITHUB_USERNAME}...`)
    projects = await fetchGitHubProjects()
    githubSynced = true
    console.log(`Found ${projects.length} public repositories.`)
  } catch (error) {
    console.warn("GitHub sync failed:", error.message)
  }

  if (githubSynced) {
    syncedAt = new Date().toISOString()
  }

  const payload = {
    syncedAt,
    githubUsername: GITHUB_USERNAME,
    linkedinUsername: LINKEDIN_USERNAME,
    profileImage: existing?.profileImage ?? PROFILE_IMAGE,
    projects,
  }

  mkdirSync(dirname(OUTPUT), { recursive: true })
  writeFileSync(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`)
  console.log(`Wrote ${OUTPUT}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
