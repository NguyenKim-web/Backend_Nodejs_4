import db from '../models/index';


let getTopDoctorHome = (limitInput)=>{
    return new Promise( async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: {roleId: 'R2'},
                order: [['updatedAt', 'DESC']],
                attributes:{  exclude:['password'] },
                // include: db.AllCode, 
                include:[
                    {model: db.AllCode, as:'positionData',attributes:['valueEn','valueVi']},
                    {model: db.AllCode, as:'genderData',attributes:['valueEn','valueVi']}
                ] ,
                // {models: db.AllCode, as: 'positionData', attributes:['valueEn','valueVi']},
                // {models: db.AllCode, as: 'genderData', attributes:['valueEn','valueVi']}
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getAllDoctorsService =()=>{
    return new Promise(async(resolve, reject)=>{
        try {
            let doctors = await db.User.findAll({
                where:{roleId: 'R2'},
                attributes: {exclude:['password', 'image']}
            })
            resolve({
                errCode: 0,
                data: doctors,
            })
        } catch (error) {
            reject(error)
        }
    })
}



module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctorsService: getAllDoctorsService
}