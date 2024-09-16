import db from '../models/index';
require('dotenv').config();
import _ from 'lodash'

let createClinicService =(data)=>{
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.name || !data.address|| !data.imageBase64 || !data.descHTML || !data.descMarkdown){
                resolve({
                    errCode: -1,
                    errMessage: "Missing parameter (from )"
                })
            }else{
                let clinic = await db.Clinic.create({
                    image: data.imageBase64,
                    name: data.name,
                    address: data.address,
                    descriptionHTML: data.descHTML,
                    descriptionMarkdown: data.descHTML,

                })
                resolve({
                    errCode: 0,
                    errMessage: 'Save clinic is succeed(CLINICservice)'
                })
            }

            
        } catch (error) {
            reject(error)
        }
    })
}
let getAllClinicsService =()=>{
    return new Promise(async(resolve, reject) => {
        try {
            let data = await db.Clinic.findAll()
            if(data && data.length>0){
                data.map(item=>{
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item
                })
            }
            resolve({
                errCode: 0,
                errMessage:"Get all Clinics is succeed",
                data
            })
            
        } catch (error) {
            reject(error)
        }
       
    })
}
let getDetailClinicByIdService =(inputId)=>{
    return new Promise(async(resolve, reject) => {
        try {
            if(!inputId){
                resolve({
                    errCode: -1,
                    errMessage: "Missing parameter (from CLINICservice)"
                })
            }else{
                let data = await db.Clinic.findOne({
                    where: {id: inputId},
                    attributes:['address', 'name','descriptionHTML','descriptionMarkdown' ]
                })
                if(data){
                    let doctorClinic =[];
                    
                        doctorClinic = await db.DoctorInfo.findAll({
                            where: {clinicId: inputId},
                            attributes:['doctorId','provinceId' ]
                        })
                    
                    data.doctorClinic = doctorClinic
                }else{
                    data = {}
                }

                resolve({
                    errCode: 0,
                    errMessage:"Get details clinic is succeed",
                    data
                })
            }
        } catch (error) {
            reject(error)
        }
       
    })
}

module.exports = {
    createClinicService: createClinicService,
    getAllClinicsService: getAllClinicsService,
    getDetailClinicByIdService: getDetailClinicByIdService,
}