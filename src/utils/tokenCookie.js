import Cookies from 'js-cookie'

//token
const TokenKey = 'Mvtlabs_Mangement_token'
//user id
const UserKey = 'Mvtlabs_User_token'
//server Band
const BandKey = 'Mvtlabs_Band_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getMvtUser() {
  return Cookies.get(UserKey)
}

export function setMvtUser(username) {
  return Cookies.set(UserKey, username)
}

export function removeMvtUser() {
  return Cookies.remove(UserKey)
}

export function getBandKey() {
  return Cookies.get(BandKey)
}

export function setBandKey(band) {
  return Cookies.set(BandKey, band)
}

export function removeBandKey() {
  return Cookies.remove(BandKey)
}