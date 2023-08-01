import MakeAPI from "../composable/makeAPI"
import { AUTH, MESSAGE,OTP,USER,SET_ROLE,SET_VERIFIED} from "../util/endPoint"
class API extends MakeAPI {
    constructor() {
        super()
    }
    Login               =   state => this.post(AUTH.LOGIN, state);
    REGISTER            =   ({email,password}) => this.post(AUTH.REGISTER, {email,password})
    VERIFY_EMAIL        =   data => this.post(AUTH.VERIFY_EMAIL, data)
    GET_PROFILE         =   () => this.get(AUTH.GET_PROFILE)
    GET_FRIENDS         =   () => this.get(MESSAGE.GET_FRIENDS)
    GET_MESSAGES        =   id => this.get(`${MESSAGE.GET_MESSAGE}/${id}`)
    SEND_MESSAGE        =   ({ room, sender, text, file }) => this.post(`${MESSAGE.SEND_MESSAGE}/${room}`,{sender,text,file,})
    VERIFY_OTP          =   ({email,otp}) => this.post(AUTH.VERIFY_OTP,{email,otp})
    SET_NEW_PASSWORD    =   ({email,password})=> this.post(AUTH.SET_NEW_PASSWORD,{email,password})
    GET_OTP             =   email=> this.post(OTP.GET_OTP,{email})
    CHECK_EMAIL         =   email => this.get(AUTH.CHECK_EMAIL+email)
    CHECK_OTP           =   ({ otp,email }) => this.post(OTP.CHECK_OTP,{otp,email})
    CHECK_USERNAME      =   (username)=> this.post(AUTH.CHECK_USERNAME,{username})
    SEARCH_USER         =   (searchText)=> this.get(AUTH.SEARCH_USER+"?searchText="+searchText)
    CREATE_ROOM         =   (id,roomType)=> this.post(AUTH.CREATE_ROOM,{id,roomType})
    VIEW_FRIEND_PROFILE = id => this.get(`${AUTH.FRIEND}/${id}`)
    SET_ROLE            = (id,role)=> this.patch(`${SET_ROLE}/${id}`,{role})
    GET_ALL_USER        =  ()=> this.get(USER)
    CHNAGE_STATUS       = (id,isDeleted)=> this.patch(`${USER}/${id}`,{isDeleted})
    CHNAGE_VERIFIED     = (id,status)=> this.patch(`${SET_VERIFIED}/${id}`,{status})
}
export default API