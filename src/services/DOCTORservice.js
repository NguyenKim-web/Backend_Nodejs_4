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

let saveInfoDoctorService = (data)=>{
    console.log('data la: ', data)
    return new Promise(async(resolve, reject)=>{
        try {
            if(!data.doctorId || !data.contentHTML|| !data.contentMD){ //
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter(from DOCTORservice)'
                })
            }else{
                await db.Markdown.create({
                    contentHTML: data.contentHTML,
                    contentMD: data.contentMD,
                    description: data.description,
                    doctorId: data.doctorId,
                    
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Save info doctor is succeed(DOCTORservice)'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailInfoOfDoctor=(id)=>{
    return new Promise(async(resolve, reject) => {
        try {
            if(!id){
                resolve({
                    errCode: 1,
                    errMessage:'Missing required parameter'
                })
            }else{
                let data = await db.User.findOne({
                    where: { id: id},
                    attributes: {exclude:['password']},
                    include: [
                        {model: db.Markdown, attributes: ['contentHTML', 'contentMD', 'description']},
                        {model: db.AllCode, as:'positionData',attributes:['valueEn','valueVi']},
                    ],
                    raw: false,
                    nest: true
                })
                if(data && data.image){
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if(!data) data ={}
                resolve({
                    errCode: 0,
                    data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctorsService: getAllDoctorsService,
    saveInfoDoctorService: saveInfoDoctorService,
    getDetailInfoOfDoctor: getDetailInfoOfDoctor,

}