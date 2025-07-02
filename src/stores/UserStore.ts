import { defineStore } from 'pinia'
import { isEmpty } from 'lodash'
import type { PersistedStateOptions } from 'pinia-plugin-persistedstate';

export type UserState  = {
  loggedInUser: UserModel
  onceAuth: boolean
  isLoggedIn: boolean
  isSaveId: boolean
  loginTime: string
  darkMode: boolean
}

export type UserModel = {
  isLogin: boolean
  accessToken: string
  validateKey: string
  expire: string
  user: {
      email: string | null
      loginId: string
      name: string
      role: string
      roleUrl: string
      lang: string
  }
}
export const useUserStore = defineStore('User', {
  state: (): UserState => ({
    loggedInUser: {
      accessToken: '',
      expire: '',
      isLogin: false,
      validateKey: '',
      user: {
          email: '',
          loginId: '',
          name: '',
          role: '',
          roleUrl: '',
          lang: ''
      }
    },
    onceAuth: false,
    isLoggedIn: false,
    isSaveId: false,
    loginTime:'',
    darkMode: true
  }),
  getters: {
    loginUser(): UserModel {
      return this.loggedInUser as UserModel
    },
    getDarkMode(): boolean {
      return this.darkMode
    },
    isOnceAuth(): boolean {
      const result = this.onceAuth
      this.onceAuth = false
      return result
    },
    hasLogin(): boolean {
      return this.isLoggedIn
    },
    getAuthToken(): string {
      const {  accessToken } = this.loggedInUser
      if ( isEmpty(accessToken)) return ''
      return accessToken
    },
  },
  actions: {
    init() {
      this.loggedInUser = {
          accessToken: '',
          expire: '',
          isLogin: false,
          validateKey: '',
          user: {
              email: '',
              loginId: '',
              name: '',
              role: '',
              roleUrl: '',
              lang: ''
          }
      } 
      this.isSaveId = false
    },
    set(info: UserModel) {
      this.loggedInUser = info
    },
    successOnceAuth() {
      this.onceAuth = true
    },
    setSaveId( value:boolean ){
      this.isSaveId = value
    },
    setLoginTime(value:string){
      this.loginTime = value
    },
    setDarkMode(){
      const htmlEl = document.querySelector('html')
      if (this.darkMode) {
          if (htmlEl) {
              htmlEl.className = 'dark'
          }
      } else {
          if (htmlEl) {
              htmlEl.className = ''
          }
      }
  }
  },
    persist: {
        enabled: true,
        storage: window.sessionStorage
    } as PersistedStateOptions
  
})
