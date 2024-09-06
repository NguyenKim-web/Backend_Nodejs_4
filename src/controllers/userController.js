import db from '../models/index';
import USERservice from '../services/USERservice';

let handleLogin = async(req, res)=>{
    let email = req.body.email;
    let password = req.body.password;

    if(!email || !password){
        return res.status(500).json({
            errCode: 1,
            message: "Missing inputs parameter from userController nodeJs!"
        })
    }else{
        let userData = await USERservice.handleUserLogin(email, password);
        // console.log('userData la: ', userData)
        return res.status(200).json({
            errCode: userData.errCode,
            message: userData.errMessage,
            user:  userData.user?userData.user: {},
        })
    }
}
let handleGetAllUsers = async (req, res)=>{
    let id = req.query.id; // ALL or id
    if(!id){
        return res.status(200).json({
            errCode: 1,
            errMessage:'Missing require(from userController)',
            users: []
        })

    }
    let users = await USERservice.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Get all user succeed(from userController) ',
        users
    })
}

let handleCreateNewUser = async(req, res)=>{
    let message = await USERservice.createNewUser(req.body);
    // console.log('req.body (userController): ', req.body)
    return res.status(200).json(message);
}
let handleEditUser=async(req, res)=>{
    let data = req.body;
    let message = await USERservice.updateUserDataAPI(data);
    return res.status(200).json(message)
    
}

let handleDeleteUser= async(req, res)=>{
    if(!req.body.id){
        return res.status(200).json({
            errCode: 1,
            errMessage: "MIssing required parameters"
        })
    }
    let message = await USERservice.deleteUser(req.body.id);
    return res.status(200).json(message);
}
// vao database
let getAllCode=async (req, res)=>{
    try {
        let data = await USERservice.getAllCodeService(req.query.type);
        return res.status(200).json(data)
        
    } catch (e) {
        console.log('Get all code error: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server(userController)"
        })
    }
}
module.exports ={
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
}