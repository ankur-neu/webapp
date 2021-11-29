

export const RESPONSE = {
    statusCode:0,
    message:'',
    data:[],
    error:''
}

export const STATUS_CODE = {
    SERVER:{
        500:500
    },
    CLIENT:{
        401:401,
        404:404
    },
    SUCCESS:{
        200:200,
        201:201
    }
}

export const MESSAGES = {
    USER_NOT_EXIST: "User not exist",
    USER_EXIST: "User already exist",
    INVALID_USER: "Invalid user name",
    USER_ADD_SUCCESS: "User added successfully",
    USER_UPDATED_SUCCESS: "User updated successfully",
    USER_VERIFIED_SUCCESS: "User verified successfully",
    USER_VERIFIED_ALREADY: "User already verified successfully",
    INVALID_TOKEN: "User token is invalid or session is expired",
    SUCCESS: "Success",
    BAD_REQUEST: "Bad Request",
    UNAUTHORIZED:"Unauthorized",
    UNVERIFIED:"Unverified User",
    IMAGE_ADDED_SUCCESS: "Image added successfully",
    IMAGE_NOT_EXIST: "Image not exist",
    IMAGE_DELETE_SUCCESS: "Image deleted successfully",
}

