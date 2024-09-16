import db from '../models/index';
require('dotenv').config();
import _ from 'lodash'
import EMAILservice from './EMAILservice'
import { v4 as uuidv4 } from 'uuid'

let buildUrlEmail =(doctorId, token)=>{
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;

}

let postBookingAppointmentService=async(data)=>{
    return new Promise(async(resolve, reject) => {
        try {
            if( !data.email || !data.doctorId || !data.timeType|| !data.date  || !data.fullName
                || !data.selectedGender || !data.address
            ){
                resolve({
                    errCode: -1,
                    errMessage: "Missing parameter 1 (from PATIENTservice)"
                })
            }else{
               
                let token = uuidv4();
                //    await EMAILservice.receiverEmail({
                await EMAILservice.sendSimpleEmail({
                   
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token),
                })
                // upsert patient info
               let user = await db.User.findOrCreate({
                    where: { email: data.email},
                    defaults: {
                        email: data.email,
                        roleId:  'R3', 
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName
                    }
                })
                //create booking record
                // console.log("user from server befor", user[0])
                if(user && user[0]){
                let bookingUser = await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id
                        },
                        defaults: {
                            statusId:'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }

                    })
                    // console.log("booking user from server after", bookingUser)//
                }
                // console.log("user from server after", user[0])
                resolve({
                    errCode: 0,
                    errMessage: "Find or create patient is succeed (from PATIENTservice)"
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
let postVerifyBookingService =(data)=>{
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.token || !data.doctorId){
                resolve({
                    errCode: -1,
                    errMessage: "Missing parameter (from PATIENTservice)"
                })
            }else{
                let appointment = await db.Booking.findOne({
                    where:{
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId:'S1'
                    },
                    raw:false,
                })
                // console.log("appointment", appointment)
                if(appointment){
                    appointment.statusId ='S2';
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: "Update status of appointment is succeed (from PATIENTservice)"
                    })
                }else{
                    resolve({
                        errCode: 2,
                        errMessage: "Appointment is not exist or has been activated (from PATIENTservice)"
                    })
                }
                
            }

            
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    postBookingAppointmentService: postBookingAppointmentService,
    postVerifyBookingService: postVerifyBookingService,

}