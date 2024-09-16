import db from '../models/index';
import CLINICservice from '../services/CLINICservice';

let createClinic  = async (req, res)=>{
    try {
        let info = await CLINICservice.createClinicService(req.body);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server(clinicController)..."
        })
    }
}
let getAllClinics  = async (req, res)=>{
    try {
        let info = await CLINICservice.getAllClinicsService();
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server(clinicController)..."
        })
    }
}
let getDetailClinicById  = async (req, res)=>{
    try {
        let info = await CLINICservice.getDetailClinicByIdService(req.query.id);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server(clinicController)..."
        })
    }
}


module.exports ={
    createClinic: createClinic,
    getAllClinics: getAllClinics,
    getDetailClinicById: getDetailClinicById
}