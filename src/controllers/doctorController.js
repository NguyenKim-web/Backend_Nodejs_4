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
module.exports ={
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInfoDoctors: postInfoDoctors,
    getDetailDoctor: getDetailDoctor,
}