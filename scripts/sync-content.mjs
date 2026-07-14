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

function parseRssItems(xml) {
  const items = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]
    const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/i)
    const link = block.match(/<link><!\[CDATA\[(.*?)\]\]><\/link>|<link>(.*?)<\/link>/i)
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/i)
    const description = block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i)

    const text = (description?.[1] ?? title?.[1] ?? title?.[2] ?? "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    const url = (link?.[1] ?? link?.[2] ?? "").trim()

    if (text && url) {
      items.push({
        text,
        url,
        date: pubDate?.[1] ? new Date(pubDate[1]).toISOString() : new Date().toISOString(),
        source: "linkedin",
      })
    }
  }

  return items
}

async function fetchLinkedInFromRss() {
  const rssUrl = process.env.LINKEDIN_RSS_URL
  if (!rssUrl) return []

  const response = await fetch(rssUrl)
  if (!response.ok) {
    throw new Error(`LinkedIn RSS fetch failed (${response.status})`)
  }

  const xml = await response.text()
  return parseRssItems(xml).slice(0, 6)
}

async function fetchLinkedInFromApify() {
  const token = process.env.APIFY_API_TOKEN
  if (!token) return []

  const actorId = "apimaestro~linkedin-profile-posts"
  const response = await fetch(
    `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileUrls: [`https://www.linkedin.com/in/${LINKEDIN_USERNAME}/`],
        maxPosts: 6,
      }),
    },
  )

  if (!response.ok) {
    throw new Error(`Apify LinkedIn fetch failed (${response.status})`)
  }

  const items = await response.json()

  return items
    .map((item) => ({
      text: (item.text ?? item.content ?? item.postText ?? "").trim(),
      url: item.postUrl ?? item.url ?? item.link ?? "",
      date: item.postedAt ?? item.date ?? item.timestamp ?? new Date().toISOString(),
      source: "linkedin",
    }))
    .filter((item) => item.text && item.url)
    .slice(0, 6)
}

async function fetchLinkedInPosts() {
  try {
    const rssPosts = await fetchLinkedInFromRss()
    if (rssPosts.length > 0) return rssPosts
  } catch (error) {
    console.warn("LinkedIn RSS sync skipped:", error.message)
  }

  try {
    return await fetchLinkedInFromApify()
  } catch (error) {
    console.warn("LinkedIn Apify sync skipped:", error.message)
  }

  return []
}

async function main() {
  const existing = readExistingContent()
  let projects = existing?.projects ?? []
  let linkedinPosts = existing?.linkedinPosts ?? []
  let syncedAt = existing?.syncedAt ?? new Date().toISOString()
  let githubSynced = false
  let linkedinSynced = false

  try {
    console.log(`Syncing GitHub projects for @${GITHUB_USERNAME}...`)
    projects = await fetchGitHubProjects()
    githubSynced = true
    console.log(`Found ${projects.length} public repositories.`)
  } catch (error) {
    console.warn("GitHub sync failed:", error.message)
  }

  try {
    console.log(`Syncing LinkedIn posts for @${LINKEDIN_USERNAME}...`)
    const freshPosts = await fetchLinkedInPosts()
    if (freshPosts.length > 0) {
      linkedinPosts = freshPosts
      linkedinSynced = true
    }
    console.log(`Found ${linkedinPosts.length} LinkedIn posts.`)
  } catch (error) {
    console.warn("LinkedIn sync failed:", error.message)
  }

  if (githubSynced || linkedinSynced) {
    syncedAt = new Date().toISOString()
  }

  const payload = {
    syncedAt,
    githubUsername: GITHUB_USERNAME,
    linkedinUsername: LINKEDIN_USERNAME,
    profileImage: existing?.profileImage ?? PROFILE_IMAGE,
    projects,
    linkedinPosts,
  }

  mkdirSync(dirname(OUTPUT), { recursive: true })
  writeFileSync(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`)
  console.log(`Wrote ${OUTPUT}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
