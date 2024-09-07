import db from '../models/index';
require('dotenv').config();
import _ from 'lodash'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
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
    // console.log('data la: ', data)
    return new Promise(async(resolve, reject)=>{
        try {
            if(!data.doctorId || !data.contentHTML|| !data.contentMD || !data.action ||
                !data.selectedPrice || !data.selectedPayMethod|| !data.selectedProvince ||
                !data.clinicName || !data.clinicAddress || !data.note 
            ){ //
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter(from DOCTORservice)'
                })
            }else{
                //upsert markdown table
                if(data.action ==='CREATE'){
                    await db.Markdown.create({
                        contentHTML: data.contentHTML,
                        contentMD: data.contentMD,
                        description: data.description,
                        doctorId: data.doctorId,
                    })
                }else if(data.action ==='EDIT'){
                    let doctorMarkdown =await db.Markdown.findOne({
                        where: {doctorId: data.doctorId },
                        raw: false
                    })
                    if(doctorMarkdown){
                        doctorMarkdown.contentHTML= data.contentHTML,
                        doctorMarkdown.contentMD= data.contentMD,
                        doctorMarkdown.description= data.description,
                        doctorMarkdown.updatedAt= new Date(),
                        await doctorMarkdown.save()
                    }
    
                }
                //upsert doctor info
                let doctorInfo = await db.DoctorInfo.findOne({
                    where: {
                        doctorId: data.doctorId
                    },
                    raw:false
                })
                if(doctorInfo){
                    //update
                    doctorInfo.doctorId= data.doctorId;
                    doctorInfo.priceId= data.selectedPrice;
                    doctorInfo.provinceId= data.selectedProvince;
                    doctorInfo.paymentId= data.selectedPayMethod;
                    doctorInfo.clinicName= data.clinicName;
                    doctorInfo.clinicAddress= data.clinicAddress;
                    doctorInfo.note= data.note;
                    
                        await doctorMarkdown.save()
                }else{
                    await db.DoctorInfo.create({
                        doctorId: data.doctorId,
                        priceId: data.selectedPrice,
                        provinceId: data.selectedProvince,
                        paymentId: data.selectedPayMethod,
                        clinicName: data.clinicName,
                        clinicAddress: data.clinicAddress,
                        note: data.note,
                    })
                    //create
                }
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
let bulkCreateScheduleService = (data)=>{
    // console.log('data from doctorservice: ', data)
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.arrSchedule || !data.doctorId || !data.formattedDate ){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            }else{
                let schedule = data.arrSchedule;
                if(schedule && schedule.length>0){
                    schedule = schedule.map(item =>{
                        item.maxNumber =MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                    //get all existing data
                    let existing = await db.Schedule.findAll({
                        where: {doctorId: data.doctorId, date: data.formattedDate},
                        attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                        raw: true
                    })
                    //convert date
                    // if(existing && existing.length>0){
                    //     existing = existing.map(item=>{
                    //         item.date = new Date(item.date).getTime();
                    //         return item;
                    //     })
                    // }
                    //campare difference
                    let toCreate = _.differenceWith(schedule, existing, (a,b)=>{
                        return a.timeType === b.timeType && a.date === +b.date;
                    })
                  
                    if(toCreate && toCreate.length>0){
                        await db.Schedule.bulkCreate(toCreate)
                    }
                }
                resolve({
                    errCode:0,
                    errMessage: 'bulkCreate is ok'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getScheduleDoctorByDateService =(doctorId, date)=>{
    return new Promise(async(resolve, reject) => {
        try {
            if(!doctorId || !date){
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required parameter'
                })
            }else{
                let data = await db.Schedule.findAll({
                    where: {doctorId: doctorId, date: date},
                    include: [
                        // {model: db.Schedule, attributes: ['contentHTML', 'contentMD', 'description']},
                        {model: db.AllCode, as:'timeTypeData',attributes:['valueEn','valueVi']},
                    ],
                    raw: true,
                    nest: true
                })
                if(!data) data =[];

                resolve({
                    errCode: 0,
                    data: data,
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
    bulkCreateScheduleService: bulkCreateScheduleService,
    getScheduleDoctorByDateService: getScheduleDoctorByDateService

}