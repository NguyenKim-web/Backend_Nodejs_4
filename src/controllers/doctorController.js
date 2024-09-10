import db from '../models/index';
import DOCTORservice from '../services/DOCTORservice';

let getTopDoctorHome = async (req, res)=>{
    let limit = req.query.limit;
    if(!limit){limit = 10;}
    try {
        let response = await DOCTORservice.getTopDoctorHome(+limit);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server(doctorController)..."
        })
    }
}

let getAllDoctors = async(req, res)=>{
    try {
        let doctors = await DOCTORservice.getAllDoctorsService();
        return res.status(200).json(doctors)
    } catch (error) {
        console.log('Error from the server(doctorController): ', error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server(doctorController)'
        })
    }
}

let postInfoDoctors = async (req, res)=>{
    try {
        let response = await DOCTORservice.saveInfoDoctorService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log('Error from the server(doctorController): ', error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server(doctorController)'
        })
    }
}
let getDetailDoctor =async (req, res)=>{
    try {
        if(!req.query.id){
            return({
                errCode: 3,
                errMessage: 'Error from the server(DOCTORcontroller)'
            })
        }
        let info = await DOCTORservice.getDetailInfoOfDoctor(req.query.id);
        return res.status(200).json(
            info
        )
    } catch (error) {
        console.log(error);
        return({
            errCode: -1,
            errMessage: 'Error from the server(DOCTORcontroller)'
        })
    }
}

let bulkCreateSchedule=async(req, res)=>{
    try {
        let response = await DOCTORservice.bulkCreateScheduleService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log('Error from the server(doctorController): ', error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server(doctorController)'
        })
    }
}
let getScheduleDoctorByDate =async (req, res)=>{
    try {
        let info = await DOCTORservice.getScheduleDoctorByDateService(req.query.doctorId, req.query.date );
        return res.status(200).json(info);
    } catch (error) {
        console.log('Error from the server(doctorController): ', error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server(doctorController)'
        })
    }
}

let getExtraInfoDoctorById=async(req, res)=>{
    try {
        let info = await DOCTORservice.getExtraInfoDoctorByIdService(req.query.doctorId);
        return res.status(200).json(info);

    } catch (error) {
        console.log('Error from the server(doctorController): ', error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server(doctorController)'
        })
    }
}

let getProfileDoctorById=async(req, res)=>{
    try {
        let info = await DOCTORservice.getProfileDoctorByIdService(req.query.id);
        return res.status(200).json(info);

    } catch (error) {
        console.log('Error from the server(doctorController): ', error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server(doctorController)'
        })
    }
}
module.exports ={
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInfoDoctors: postInfoDoctors,
    getDetailDoctor: getDetailDoctor,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleDoctorByDate: getScheduleDoctorByDate,
    getExtraInfoDoctorById: getExtraInfoDoctorById,
    getProfileDoctorById: getProfileDoctorById
}