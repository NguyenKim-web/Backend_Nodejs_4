import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController'
import doctorController from '../controllers/doctorController'
import patientController from '../controllers/patientController'
import specialtyController from '../controllers/specialtyController'
import clinicController from '../controllers/clinicController'

let router = express.Router();
let initWebRoutes=(app)=>{
    router.get('/', homeController.getHomePage)
    router.get('/crud', homeController.getCRUD)
    router.post('/post-crud', homeController.postCRUD)
    router.get('/get-crud', homeController.displayCRUD)
    router.get('/edit-crud', homeController.getEditCRUD)
    router.post('/put-crud', homeController.putCRUD)
    router.get('/delete-crud', homeController.deleteCRUD)

    router.post('/api/login', userController.handleLogin)
    router.get('/api/get-all-users', userController.handleGetAllUsers)
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.put('/api/edit-user', userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)
    //doctor
    router.get('/api/allcode', userController.getAllCode)
    router.get('/api/top-doctor-home',doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors',doctorController.getAllDoctors);
    router.post('/api/save-info-doctors',doctorController.postInfoDoctors);
    router.get('/api/get-detail-doctor',doctorController.getDetailDoctor);
    router.post('/api/bulk-create-schedule',doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-by-date',doctorController.getScheduleDoctorByDate);
    router.get('/api/get-extra-info-doctor-by-id',doctorController.getExtraInfoDoctorById);
    router.get('/api/get-profile-doctor-by-id',doctorController.getProfileDoctorById);
    
    router.get('/api/get-list-patient-for-doctor',doctorController.getListPatientByDoctorId);
    router.post('/api/send-remedy',doctorController.sendRemedy);
    //booking
    router.post('/api/patient-booking-appointment',patientController.postBookingAppointment);
    router.post('/api/verify-booking-appointment',patientController.postVerifyBooking);
    //specialty
    router.post('/api/create-new-specialty',specialtyController.createSpecialty);
    router.get('/api/get-all-specialties',specialtyController.getAllSpecialties);
    router.get('/api/get-detail-specialty-by-id',specialtyController.getDetailSpecialtyById);
    //clinic
    router.post('/api/create-new-clinic',clinicController.createClinic);
    router.get('/api/get-all-clinics',clinicController.getAllClinics);
    router.get('/api/get-detail-clinic-by-id',clinicController.getDetailClinicById);
   
    return app.use("/", router);

}

module.exports = initWebRoutes;