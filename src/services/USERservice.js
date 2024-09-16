import bcrypt from'bcryptjs';
import db from '../models/index';
var salt = bcrypt.genSaltSync(10);


let handleUserLogin = (email, password)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            let userData ={};
            let isExist = await checKEmail(email);
            if(isExist){
                let user = await db.User.findOne({
                    attributes:['id','email', 'firstName', 'password', 'lastName','roleId'],
                    where: {email: email},
                    raw: true
                })
                if(user){
                    let check = await bcrypt.compareSync(password, user.password);
                    if(check){
                        userData.errCode = 0;
                        userData.errMessage = "Login is succeed(from USERservice)";
                        delete user.password;
                        userData.user = user;
                    }else{
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password (from USERservice)";
                    }
                }else{
                    userData.errCode= 2;
                    userData.errMessage= "User is not found"
                }
            } else{
                userData.errCode = 1;
                userData.errMessage= `Sorry! your email is not exist (from USERservice)`;
            }
            resolve(userData);  
        } catch (error) {
            reject(error)
        }
    })
}
let checKEmail = (userEmail)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            let user = await db.User.findOne({
                where: {email: userEmail}
            });
            if(user){
                resolve(true)
            }else{
                resolve(false)
            }
            
        } catch (error) {
            reject(error)
        }
    })
}

let getAllUsers=(userId)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            let users = '';
            if(userId === 'ALL'){
                users = await db.User.findAll({
                    attributes:{
                        exclude: ['password']
                    }
                })
            }
            if(userId && userId !=='ALL'){
                users = await db.User.findOne({
                    where: {id: userId},
                    attributes:{
                        exclude: ['password']
                    }
                })
            }    
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

let createNewUser=(data)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            let check = await checKEmail(data.email);
            if(check === true){
                resolve({
                    errCode: 1,
                    errMessage: "Your email is already is user,(from USERservice)"
                })
            }else{

                let hashPW = await hashPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPW,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar
                    
                })
                resolve({
                    errCode: 0,
                    errMessage: "Create a new user is succeed(from USERservice)"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let hashPassword = (password)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            let hash = await bcrypt.hashSync(password, salt);
            resolve(hash);
        } catch (error) {
            reject(error)
        }
    })
}

let deleteUser=(id)=>{
    return new Promise(async(resolve, reject)=>{
        let user = await db.User.findOne({
            where: {id: id}
        })
        if(!user){
            resolve({
                errCode: 2,
                errMessage: "The user is not exist"
            })
        }
        await db.User.destroy({
            where: {id: id}
        });
        resolve({
            errCode: 0,
            errMessage:"The user is deleted"
        })
    })
}
let updateUserDataAPI=(data)=>{
    // console.log('data: ', data)
    return new Promise(async(resolve, reject)=>{
        try {
            if(!data.id || !data.roleId || !data.positionId || !data.gender){
                return resolve({
                     errCode:2,
                    errMessage: "Missing required parameter (from USERsevice)"
                })
            }
            let user = await db.User.findOne({
                where: {id : data.id},
                raw: false
            })
            if(user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phoneNumber = data.phoneNumber;
                user.positionId = data.positionId;
                user.gender = data.gender;
                user.roleId = data.roleId;
                if(data.avatar){
                    user.image = data.avatar;
                }
                await user.save();
                resolve({
                    errCode:0,
                    errMessage: "Update user is succeed(from USERsevice)"
                })
            }else{
                resolve({
                    errCode:1,
                    errMessage: "User is not found(from USERsevice)"
                })
            }
            
        } catch (error) {
            reject(error)
        }
    })
}

let getAllCodeService=(typeInput)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            if(!typeInput){
                resolve({
                    errCode: 1,
                    errMessage:"Missing required parameter"
                })
            }else{
                let res ={};
                let allCode = await db.AllCode.findAll({
                    where: {type: typeInput}
                });
                res.errCode= 0;
                res.data = allCode;
                resolve(res);
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
 handleUserLogin: handleUserLogin,
 getAllUsers: getAllUsers,
 createNewUser: createNewUser,
 deleteUser: deleteUser,
 updateUserDataAPI: updateUserDataAPI,
 getAllCodeService: getAllCodeService,

}