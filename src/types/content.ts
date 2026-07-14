export interface GitHubProject {
  title: string
  description: string[]
  tags: string[]
  url: string
  stars: number
  updatedAt: string
  source: "github"
}

export interface LinkedInPost {
  text: string
  url: string
  date: string
  source: "linkedin"
}

export interface AutoContent {
  syncedAt: string
  githubUsername: string
  linkedinUsername: string
  profileImage: string
  projects: GitHubProject[]
  linkedinPosts: LinkedInPost[]
}
