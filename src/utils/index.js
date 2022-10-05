import store from '@/store'
export function localGet (key) {
  const value = window.localStorage.getItem(key)
  try {
    return JSON.parse(window.localStorage.getItem(key))
  } catch (error) {
    return value
  }
}

export function localSet (key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function localRemove (key) {
  window.localStorage.removeItem(key)
}

export function has_menupermission (menupath){
 if(store.state.userrole==1){
   return true
 }
  return store.state.allowmenus.indexOf(menupath)!=-1
}
