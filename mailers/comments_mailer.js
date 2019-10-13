const nodeMailer = require('../config/nodemailer');


// this is a another way of exporting a method
exports.newComment = (comment) => {
    console.log('inside new comment mailer',comment);
    nodeMailer.transporter.sendMail({
        from : 'amarjain9205251694@gmail.com',
        to: comment.user.email,
        subject:"New Comment Published",
        html:'<h1>Yup , Your Comment is now published</h1>'
    },(err,info) => {
        if(err){
            console.log('Error in sending mail' , err);
            return;
        }
        console.log('Message Sent',info);
        return;
    });
}