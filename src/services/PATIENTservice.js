import db from '../models/index';
require('dotenv').config();
import _ from 'lodash'

let postBookingAppointmentService=(data)=>{
    console.log("data from server", data)
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.email || !data.doctorId || !data.timeType || !data.date){
                resolve({
                    errCode: -1,
                    errMessage: "Missing parameter (from PATIENTservice)"
                })
            }else{
                // upsert patient info
               let user= await db.User.findOrCreate({
                    where: { email: data.email},
                    defaults: {
                        email: data.email,
                        roleId:  'R3',
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
                            timeType: data.timeType
                        }

                    })
                    // console.log("bookinguser from server after", bookingUser)
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
module.exports = {
    postBookingAppointmentService: postBookingAppointmentService,

}