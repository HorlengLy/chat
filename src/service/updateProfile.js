
import makeAPI from "../composable/makeAPI"
import { UPDATE_INFOMATION } from "../util/endPoint"
export default class updateAPI extends makeAPI {
    constructor(){
        super()
    }
    CHANGE_ACCOUNT    = ({email,password})=>this.patch(`${UPDATE_INFOMATION.CHANGE_ACCOUNT}`,{email , password})
    CHNAGE_PASSWORD   = (password,confirmPassword)=>this.patch(`${UPDATE_INFOMATION.PASSWORD}`,{password,confirmPassword})
    CHNAGE_EMAIL      = (email)=>this.patch(UPDATE_INFOMATION.EMAIL,{email})
    CHANGE_INFOMATION = (state)=>this.patch(`${UPDATE_INFOMATION.PROFILE_INFO}`,state)
    CHANGE_IMAGE      = ({profileImage}) =>this.patch(UPDATE_INFOMATION.PROFILE_IMAGE,{profileImage})
    CHANGE_COVER      = ({profileCover}) =>this.patch(UPDATE_INFOMATION.PROFILE_COVER,{profileCover})
    CHNAGE_USERNAME   = (username) => this.patch(UPDATE_INFOMATION.USERNAME, {username})
}
