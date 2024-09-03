import bcrypt from'bcryptjs';
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data)=>{
    return new Promise(async(resolve, reject)=>{
        try {
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
                
            })
            resolve('Đã tạo thành công tài khoản mới')
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
let getAllUsers=()=>{
    return new Promise((resolve, reject)=>{
        try {
            let users= db.User.findAll({
                raw: true
            });
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

let getUserById =(userId)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            let user =await db.User.findOne({
                where: {id: userId},
                raw: true
            })
            if(user){
                // console.log('user: ', user)
                resolve(user)
            }else{
                console.log("Không tìm thấy nguòi dùng có Id đã cho");
                resolve([])
            }
        } catch (error) {
            reject(error)
        }
    })
}
let updateUserData =(data)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            let user = await db.User.findOne({
                where: {id : data.id}
            })
            if(user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phoneNumber = data.phoneNumber;
                await user.save();

                let allUsers = await db.User.findAll();
                resolve(allUsers)
            }else{
                console.log("Sorry! User is not found!")
            }
        } catch (error) {
            reject(error)
        }
    })
}

let deleteCRUDById = (id)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            let user = await db.User.findOne({
                where: { id: id}
            })
            if(user){
                user.destroy();
            }
            resolve();
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createNewUser: createNewUser,
    getAllUsers: getAllUsers,
    getUserById: getUserById,
    updateUserData: updateUserData,
    deleteCRUDById: deleteCRUDById,
}