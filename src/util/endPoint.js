export const AUTH = {
    LOGIN               : "api/auth/login",
    REGISTER            : "api/auth/register",
    VERIFY_EMAIL        : "api/auth/verify-email",
    UPDATE_PASSWORD     : "api/auth//update-info",
    VERIFY_TOKEN        : "api/auth/verify-token",
    GET_PROFILE_DETAILS : "api/auth/get-profile-details",
    UPDATE_INFOMATION   : "api/auth/update-info",
    VERIFY_OTP          : "api/auth/verify-otp",
    GET_OTP             : "api/auth/get-otp",
    SET_NEW_PASSWORD    : "api/auth/set-password",
    CHECK_EMAIL         : 'api/auth/check-email?email=',
    CHECK_USERNAME      : 'api/auth/check-username',
    SEARCH_USER         : 'api/auth/search-user?searchText=',
    CREATE_ROOM         : 'api/ms/create-room',
    FRIEND              : 'api/auth/friend'
}

export const MESSAGE = {
    GET_FRIENDS         : "api/ms/get-friend",
    CREATE_ROOM         : "api/ms/create-room",
    GET_MESSAGE         : "api/ms/get-messages",
    SEND_MESSAGE        : "api/ms/send-message",
}

export const OTP = {
    GET_OTP             : "api/otp/get-otp",
    CHECK_OTP           : "api/otp/check-otp",
}

export const UPDATE_INFOMATION = {
    EMAIL               : 'api/update/email',
    PASSWORD            : 'api/update/password',
    CHANGE_ACCOUNT      : 'api/update/account',
    PROFILE_INFO        : 'api/update/profile-info',
    PROFILE_IMAGE       : 'api/update/profile-image',
    PROFILE_COVER       : 'api/update/profile-cover',
    USERNAME            : "api/update/username"
}