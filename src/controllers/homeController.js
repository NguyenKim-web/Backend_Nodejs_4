import db from '../models/index';
import CRUDservice from '../services/CRUDservice';


let getHomePage = async(req, res)=>{
    try {
        let data = await db.User.findAll();
        // console.log('data check: ', data)
        return res.render('homePage.ejs',{
            data: JSON.stringify(data)
        });
        
    } catch (error) {
        console.log('loi khi lay data: ', error)
    }
}

let getCRUD =(req, res)=>{
    return res.render('crud.ejs')
}

let postCRUD = async(req, res)=>{
    let message = await CRUDservice.createNewUser(req.body);
    // console.log(req.body)
    console.log(message);
    return res.send("Đã tạo tài khoản thành công!")
}

let displayCRUD =async(req, res)=>{
    let data = await CRUDservice.getAllUsers();
    return res.render('displayCRUD.ejs',{
        dataTable: data
    })
}
let getEditCRUD = async(req, res)=>{
    let userId = req.query.id;
    if(userId){
        let userData = await CRUDservice.getUserById(userId);
        // console.log('userData: ', userData)
        return res.render('editCRUD.ejs',{
            user: userData
        })
   
    }else{
        console.log("Không tìm thấy người dùng")
    }
    
}
let putCRUD= async(req,res)=>{
    let data = req.body;
    let allUsers = await CRUDservice.updateUserData(data);
    return res.render('displayCRUD.ejs',{
        dataTable: allUsers
    })
}

let deleteCRUD = async(req, res)=>{
    let id = req.query.id;
    if(id){
        await CRUDservice.deleteCRUDById(id);
        return res.send("User is deleted")

    }else{
        return res.send("Sorry! User is not found!")
    }
}
module.exports ={
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayCRUD: displayCRUD, 
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD, 

}