import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

export const sendInvitationEmail = async (
  to: string,
  clientName: string,
  projectName: string,
  projectLink: string
) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('GMAIL credentials are not set. Email not sent.')
    return { success: false, error: 'Gmail credentials missing' }
  }

  try {
    const info = await transporter.sendMail({
      from: `"UVTester" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: `[UVTester] Bạn nhận được lời mời tham gia dự án "${projectName}"`,
      html: `
        <h1>Lời mời tham gia dự án</h1>
        <p>Xin chào,</p>
        <p>Client <strong>${clientName}</strong> trân trọng mời bạn tham gia dự án <strong>${projectName}</strong>.</p>
        <p>Vui lòng xem chi tiết dự án tại đường dẫn dưới đây:</p>
        <a href="${projectLink}" style="padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Xem dự án</a>
        <p>Trân trọng,<br/>Đội ngũ UVTester</p>
      `
    })

    console.log('Email sent: %s', info.messageId)
    return { success: true, data: info }
  } catch (error) {
    console.error('Send email exception:', error)
    return { success: false, error }
  }
}
