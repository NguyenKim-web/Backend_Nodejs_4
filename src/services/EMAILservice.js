require('dotenv').config()
const nodemailer = require("nodemailer");


// let sendSimpleEmail=async(dataSend)=>{
//     // console.log('datda send from emai service: ', dataSend)
//     const transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false, // true for port 465, false for other ports
//         auth: {
//             user: "nkim12368@gmail.com",
//             pass: "yscy uxfj ylab hvvm",
//         },
//     })

//     let info = await transporter.sendMail({
//         from: '"TEST 👻" <nkim12368@gmail.com>', // sender address
//         to: dataSend.receiverEmail, //list of receivers
//         subject:"Xac nhan thong tin dat lich kham benh", //subject line
//         text: "Hello world",//plain text
//         html: "<h1>hello confirm</h1>"//html body
//     })

// }

let sendSimpleEmail=async(dataSend)=>{
    // console.log('datda send from emai service: ', dataSend)
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: "nkim12368@gmail.com",
            pass: "yscy uxfj ylab hvvm",
        },
    })

    let info = await transporter.sendMail({
        from: '"TEST 👻" <nkim12368@gmail.com>', // sender address
        to: dataSend.receiverEmail, //list of receivers
        subject:"Xac nhan thong tin dat lich kham benh", //subject line
        //text: "Hello world",//plain text
        html: getBodyEmail(dataSend)//html body
    })

}

let getBodyEmail =(dataSend)=>{
    let result='';
    if(dataSend.language === 'vi'){
        result=
        `
        <h3>Xin chao ${dataSend.patientName}!</h3>
        <h4>Thong tin dat lich kham benh</h4>
        <p>Thoi gian: <b>${dataSend.time}</b></p>
        <p>Bac si: <b>${dataSend.doctorName}</b></p>
        <p>Hay click vao link duoi de xac nhan lich kham benh:</p>
        <a href=${dataSend.redirectLink} target ="_blank">Click here</a>
        <p>Xin chan thanh cam on</p>

        `
    }
    if(dataSend.language === 'en'){
        result =
        `
        <h3>Dear, ${dataSend.patientName}!</h3>
        <h4>Booking information</h4>
        <p>Time: <b>${dataSend.time}</b></p>
        <p>Doctor: <b>${dataSend.doctorName}</b></p>
        <p>Please click the link below to confirm the booking information:</p>
        <a href=${dataSend.redirectLink} target ="_blank">Click here:</a>
        <p>Thank you very much</p>

        `
    }
    return result;
}
let getBodyEmailRemedy =(dataSend)=>{
    let result='';
    if(dataSend.language === 'vi'){
        result=
        `
        <h3>Xin chao ${dataSend.patientName} !</h3>
   
        <p>Thong tin don thuoc/ hoa don duoc gui trong file dinh kem</p>
       
        <p>Xin chan thanh cam on</p>

        `
    }
    if(dataSend.language === 'en'){
        result =
        `
        <h3>Dear, ${dataSend.patientName} !</h3>
        
        <p>Please check remedy/ receipt in the file below:</p>
        
        <p>Thank you very much</p>

        `
    }
    return result;
}
let sendAttachment=(dataSend)=>{
    return new Promise(async(resolve, reject) => {
        try {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: "nkim12368@gmail.com",
                    pass: "yscy uxfj ylab hvvm",
                },
            })
        
            let info = await transporter.sendMail({
                from: '"TEST 👻" <nkim12368@gmail.com>', // sender address
                to: dataSend.email, //list of receivers
                subject:"Xac nhan thong tin dat lich kham benh", //subject line
                //text: "Hello world",//plain text
                html: getBodyEmailRemedy(dataSend),//html body,
                attachments: [
                    {
                        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                        content: dataSend.imageB64.split("base64,")[1],
                        encoding: "base64",
                    }
                ]
            })
            resolve()
            
        } catch (error) {
            reject(error)
        }
    
    })
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment
}