//"EmailPasswordAuth", "github", "google"

export const providerEnum = {
  GITHUB: "github",
  GOOGLE: "google",
  EMAIL_PASSWORD_AUTH: "EmailPasswordAuth"
}

const providers = [...Object.values(providerEnum)]

export default providers