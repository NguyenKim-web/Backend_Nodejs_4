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

module.exports ={
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
}