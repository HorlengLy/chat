import MakeAPI from "../composable/makeAPI"
import { AUTH, MESSAGE,OTP} from "../util/endPoint"


class API extends MakeAPI {
    constructor() {
        super()
    }
    Login               =   (state) => this.post(AUTH.LOGIN, state);
    REGISTER            =   ({email,password}) => this.post(AUTH.REGISTER, {email,password})
    VERIFY_EMAIL        =   (data) => this.post(AUTH.VERIFY_EMAIL, data)
    VERIFY_TOKEN        =   (token) => this.get(AUTH.VERIFY_TOKEN,{headers:{"Authorization":token}})
    GET_FRIENDS         =   () => this.get(MESSAGE.GET_FRIENDS)
    GET_MESSAGES        =   ({ id }) => this.get(`${MESSAGE.GET_MESSAGE}/${id}`)
    SEND_MESSAGE        =   ({ room, sender, text, file }) => this.post(`${MESSAGE.SEND_MESSAGE}/${room}`,{sender,text,file,})
    VERIFY_OTP          =   ({email,otp}) => this.post(AUTH.VERIFY_OTP,{email,otp})
    SET_NEW_PASSWORD    =   ({email,password})=> this.post(AUTH.SET_NEW_PASSWORD,{email,password})
    GET_OTP             =   (email)=> this.post(OTP.GET_OTP,{email})
    CHECK_EMAIL         =   (email) => this.get(AUTH.CHECK_EMAIL+email)
    CHECK_OTP           =   ({ otp,email }) => this.post(OTP.CHECK_OTP,{otp,email})
    CHECK_USERNAME      =   (username)=> this.post(AUTH.CHECK_USERNAME,{username})
    SEARCH_USER         =   (searchText)=> this.get(`${AUTH.SEARCH_USER}${searchText}`)
    CREATE_ROOM         =   (id,roomType)=> this.post(AUTH.CREATE_ROOM,{id,roomType})
    VIEW_FRIEND_PROFILE = (id)=> this.get(`${AUTH.FRIEND}/${id}`)
}
export default API