import db from '../models/index';
import SPECIALTYservice from '../services/SPECIALTYservice';

let createSpecialty  = async (req, res)=>{
    try {
        let info = await SPECIALTYservice.createSpecialtyService(req.body);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server(specialtyController)..."
        })
    }
}
let getAllSpecialties  = async (req, res)=>{
    try {
        let info = await SPECIALTYservice.getAllSpecialtiesService();
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server(specialtyController)..."
        })
    }
}
let getDetailSpecialtyById  = async (req, res)=>{
    try {
        let info = await SPECIALTYservice.getDetailSpecialtyByIdService(req.query.id, req.query.location);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server(specialtyController)..."
        })
    }
}


module.exports ={
    createSpecialty: createSpecialty,
    getAllSpecialties: getAllSpecialties,
    getDetailSpecialtyById: getDetailSpecialtyById
}