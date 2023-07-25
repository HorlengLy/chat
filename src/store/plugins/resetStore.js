import cloneDeep from 'lodash.clonedeep'
export default function({store}){
    const initialState = cloneDeep(store.$state)
    store.$reset = () => {
        store.$patch($state => {
          Object.assign($state, initialState)
        })
      }

}