export class ApiKeyValidation {
  isValidApiKey(authorizedApiKeys: string[], apiKey: string) {
    return authorizedApiKeys.includes(apiKey) ? true : false
  }
}
