export class ApiKeyValidation {
  static isValidApiKey(authorizedApiKeys: string[], apiKey: string) {
    return authorizedApiKeys.includes(apiKey) ? true : false
  }
}
