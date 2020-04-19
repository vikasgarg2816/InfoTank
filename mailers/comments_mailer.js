const nodeMailer = require('../config/nodemailer');


// this is another way of exporting a method
exports.newComment = (comment) => {
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
       from: 'amarjain9205251694@gmail.com',
       to: comment.user.email,
       subject: "New Comment Published!",
       html: htmlString
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }

        // console.log('Message sent', info);
        return;
    });
}
exports.verifypassword = (arr) => {
    let htmlString = nodeMailer.renderTemplate({otp:arr[1]},'/otp/otp_verify.ejs');
    nodeMailer.transporter.sendMail({
        from:'amarjain9205251694@gmail.com',
        to: arr[0],
        subject: "Reset Password",
        html : htmlString
    },(err,info) => {
        if(err){
            console.log('Error in sending mail for reset password',err);
            return;
        }
        return;
    });
}

