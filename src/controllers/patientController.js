import db from '../models/index';
import PATIENTservice from '../services/PATIENTservice';

let postBookingAppointment  = async (req, res)=>{
    try {
        let info = await PATIENTservice.postBookingAppointmentService(req.body);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server( postBookingAppointment patientController)..."
        })
    }
}
let postVerifyBooking =async(req, res)=>{
    try {
        let info = await PATIENTservice.postVerifyBookingService(req.body);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server( verify booking patientController)..."
        })
    }
}
module.exports ={
    postBookingAppointment: postBookingAppointment,
    postVerifyBooking: postVerifyBooking
}