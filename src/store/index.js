import { createStore } from 'vuex'

const store = createStore({
    state: {
        id:null,
        phone:'',
        username: '',
        userrole:0,
        is_guest:true,
        nickname:'',
        allowmenus:[]
    },
    mutations: {
        setNewObj(state,newobj) {
            Object.assign(state,newobj)
        },
        setAllowMenus(state,newmenus){
            state.allowmenus=newmenus
        }
    },
    getters:{
        username:state=>state.username,
        userrole:state=>state.userrole,
        is_guest:state=>state.is_guest,
        allowmenus:state=>state.allowmenus,
    }
})

export default store
