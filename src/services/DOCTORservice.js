import db from '../models/index';
require('dotenv').config();
import _ from 'lodash'
import * as EMAILservice from './EMAILservice';

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
let checkRequiredFields=(inputData)=>{
    let arrFields =['doctorId','contentHTML','contentMD','action','selectedPrice',
        'selectedPayMethod','selectedProvince','clinicName','clinicAddress','note',
        'specialtyId' ]
    let isValid= true;
    let element='';
    for(let i=0; i < arrFields.length; i++){
        if(!inputData[arrFields[i]]){
            isValid = false;
            element = arrFields[i];
            break;
        }
    }
    return {
        isValid: isValid,
        element: element
    }
}

let saveInfoDoctorService = (data)=>{
    // console.log('data la: ', data)
    return new Promise(async(resolve, reject)=>{
        try {
            let checkObject = checkRequiredFields(data);
            if(checkObject.isValid ===false){ //
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter(from DOCTORservice): ${checkObject.element}`
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
                let resDoctorInfo = await db.DoctorInfo.findOne({
                    where: {
                        doctorId: data.doctorId
                    },
                    raw:false
                })
                // console.log('resDoctorInfo: ', resDoctorInfo)
                if(resDoctorInfo){
                    //update
                    resDoctorInfo.doctorId= data.doctorId;
                    resDoctorInfo.priceId= data.selectedPrice;
                    resDoctorInfo.provinceId= data.selectedProvince;
                    resDoctorInfo.paymentId= data.selectedPayMethod;
                    resDoctorInfo.clinicName= data.clinicName;
                    resDoctorInfo.clinicAddress= data.clinicAddress;
                    resDoctorInfo.note= data.note;
                    resDoctorInfo.specialtyId= data.specialtyId;
                    resDoctorInfo.clinicId= data.clinicId;
                    
                    
                        await resDoctorInfo.save()
                }else{
                    //create
                    await db.DoctorInfo.create({
                        doctorId: data.doctorId,
                        priceId: data.selectedPrice,
                        provinceId: data.selectedProvince,
                        paymentId: data.selectedPayMethod,
                        clinicName: data.clinicName,
                        clinicAddress: data.clinicAddress,
                        note: data.note,
                        specialtyId: data.specialtyId,
                        clinicId: data.clinicId,
                    })
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
                        {model: db.DoctorInfo, 
                            attributes: {exclude:['id', 'doctorId']},
                            include:[
                                {model: db.AllCode, as:'priceData',attributes:['valueEn','valueVi']},
                                {model: db.AllCode, as:'provinceData',attributes:['valueEn','valueVi']},
                                {model: db.AllCode, as:'paymentData',attributes:['valueEn','valueVi']},
                                
                            ]
                        },
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
                    data: data
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
                        {model: db.User, as:'doctorData',attributes:['firstName','lastName']},
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
let getExtraInfoDoctorByIdService =(doctorId)=>{
    return new Promise(async(resolve, reject) => {
        try {
            if(!doctorId){
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required parameter'
                })
            }else{
                let data = await db.DoctorInfo.findOne({
                    where: {doctorId: doctorId},
                    attributes: {exclude:['id', 'doctorId']},
                    include:[
                        {model: db.AllCode, as:'priceData',attributes:['valueEn','valueVi']},
                        {model: db.AllCode, as:'provinceData',attributes:['valueEn','valueVi']},
                        {model: db.AllCode, as:'paymentData',attributes:['valueEn','valueVi']},
                        
                    ],
                    raw: false,
                    nest: true
                })
                if(!data) data ={};
                // console.log('data la: ', data)
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
let getProfileDoctorByIdService=(id)=>{
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
                        {model: db.DoctorInfo, 
                            attributes: {exclude:['id', 'doctorId']},
                            include:[
                                {model: db.AllCode, as:'priceData',attributes:['valueEn','valueVi']},
                                {model: db.AllCode, as:'provinceData',attributes:['valueEn','valueVi']},
                                {model: db.AllCode, as:'paymentData',attributes:['valueEn','valueVi']},
                                
                            ]
                        },
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

let getListPatientByDoctorIdService =(doctorId, date)=>{
    return new Promise(async(resolve, reject) => {
        try {
            if(!doctorId || !date){
                resolve({
                    errCode: 1,
                    errMessage:'Missing required parameter '
                })
            }else{
                let data = await db.Booking.findAll({
                    where:{
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date,
                    },
                    include: [
                        {model: db.User, as:"patientData", attributes: ['email', 'firstName', 'address', 'gender'],
                            include:[ {model: db.AllCode, as:'genderData',attributes:['valueEn','valueVi']} ]},
                        {model: db.AllCode,as:"timeData", attributes: ['valueEn','valueVi']},

                    ],
                    raw: false,
                    nest: true
                })
                // console.log('data patient list:', data)
                resolve({
                    errCode: 0,
                    errMessage:"get patient 's appointment succeed",
                    data:  data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let sendRemedyService =(data)=>{
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.email || !data.doctorId || !data.patientId || !data.timeType){
                resolve({
                    errCode: 1,
                    errMessage:'Missing required parameter send remedy'
                })
            }else{
             //update patient status
             let appointment = await db.Booking.findOne({
                where:{
                    doctorId: data.doctorId,
                    timeType: data.timeType,
                    statusId: 'S2',
                    patientId: data.patientId
                },
                raw: false
                })
                if(appointment){
                    appointment.statusId='S3';
                    await appointment.save()

                }
             //send email remedy
                await EMAILservice.sendAttachment(data);

                resolve({
                    errCode: 0,
                    errMessage:"Send email remedy is succeed"
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
    getScheduleDoctorByDateService: getScheduleDoctorByDateService,
    getExtraInfoDoctorByIdService: getExtraInfoDoctorByIdService,
    getProfileDoctorByIdService: getProfileDoctorByIdService,
    getListPatientByDoctorIdService: getListPatientByDoctorIdService,
    sendRemedyService: sendRemedyService
}