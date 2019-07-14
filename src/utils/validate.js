//账号验证字母数字下划线
export function isAccount(account){
  return /^[a-zA-Z0-9_]{1,}$/.test(account)
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

