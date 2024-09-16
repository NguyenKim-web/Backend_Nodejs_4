import db from '../models/index';
require('dotenv').config();
import _ from 'lodash'

let createSpecialtyService =(data)=>{
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.name || !data.imageBase64 || !data.descHTML || !data.descMarkdown){
                resolve({
                    errCode: -1,
                    errMessage: "Missing parameter (from PATIENTservice)"
                })
            }else{
                let specialty = await db.Specialty.create({
                    image: data.imageBase64,
                    name: data.name,
                    descriptionHTML: data.descHTML,
                    descriptionMarkdown: data.descHTML,

                })
                resolve({
                    errCode: 0,
                    errMessage: 'Save specialty is succeed(SPECIALTYservice)'
                })
            }

            
        } catch (error) {
            reject(error)
        }
    })
}
let getAllSpecialtiesService =()=>{
    return new Promise(async(resolve, reject) => {
        try {
            let data = await db.Specialty.findAll()
            if(data && data.length>0){
                data.map(item=>{
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item
                })
            }
            resolve({
                errCode: 0,
                errMessage:"Get all specialties is succeed",
                data
            })
            
        } catch (error) {
            reject(error)
        }
       
    })
}
let getDetailSpecialtyByIdService =(inputId, location)=>{
    return new Promise(async(resolve, reject) => {
        try {
            if(!inputId || !location){
                resolve({
                    errCode: -1,
                    errMessage: "Missing parameter (from SPECIALTYservice)"
                })
            }else{
                let data = await db.Specialty.findOne({
                    where: {id: inputId},
                    attributes:['descriptionHTML','descriptionMarkdown' ]
                })
                if(data){
                    let doctorSpecialty =[];
                    if(location ==='ALL'){
                        doctorSpecialty = await db.DoctorInfo.findAll({
                            where: {specialtyId: inputId},
                            attributes:['doctorId','provinceId' ]
                        })
                    }else{
                        doctorSpecialty = await db.DoctorInfo.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location

                            },
                            attributes:['doctorId','provinceId' ]
                        })
                    }
                    data.doctorSpecialty =doctorSpecialty
                }else{
                    data = {}
                }

                resolve({
                    errCode: 0,
                    errMessage:"Get details specialty is succeed",
                    data
                })
            }
        } catch (error) {
            reject(error)
        }
       
    })
}

module.exports = {
    createSpecialtyService: createSpecialtyService,
    getAllSpecialtiesService: getAllSpecialtiesService,
    getDetailSpecialtyByIdService: getDetailSpecialtyByIdService,
}