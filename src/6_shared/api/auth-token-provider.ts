let getAccessToken: (() => Promise<string | null>) | null = null

export const setTokenProvider = (provider: () => Promise<string | null>) => {
  getAccessToken = provider
}

export const fetchToken = async () => {
  if (!getAccessToken) return null
  return await getAccessToken()
}

// NOTE
// FSD 철학상. shared는 Firebase 모름 -> provider만 받음
