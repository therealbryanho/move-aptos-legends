const commonTemplate = (additionalStyles, dynamicContent) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
    <!-- Email styles, CSS, and meta tags -->
    <style>
        ${additionalStyles}
    </style>
    </head>
    <body>
    <!-- Common header content -->
    <header>
    <!-- Your company logo, navigation links, etc. -->
    </header>
    
    <!-- Dynamic content -->
    <section>
        ${dynamicContent}
    </section>
    
    <!-- Common footer content -->
    <footer>
    <!-- Copyright information, unsubscribe links, etc. -->
    </footer>
    </body>
    </html>
    `
}

exports.passwordResetEmailTemplate = (name, resetToken) => {
    let styles = `
    `
    let dynamicContent = `
    <div>
    <p>Hello ${name},</p>
    <p>You have requested a password reset for your account.</p>
    <p>Please click the following link to reset your password:</p>
    <p><a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">Reset Password</a ></p >
    <p>If you did not request this password reset, you can safely ignore this email.</p>
    <p>Thank you,</p>
    </div >
    `

    let emailContent = commonTemplate(styles, dynamicContent)
    return emailContent
}

exports.emailConfirmationTemplate = (name, link) => {
    let styles = `
    `
    let dynamicContent = `
    <div>
    <p>Hello ${name},</p>
    <p>Welcome to ${process.env.APP_NAME}</p>
    <p>Please click on the link below to confirm your email - </p>
    <p><a href="${link}">${link}</a></p>
    <p>If you did not register with us, you can safely ignore this email.</p>
    <p>Thank you,</p>
    </div >
    `

    let emailContent = commonTemplate(styles, dynamicContent)
    return emailContent
}