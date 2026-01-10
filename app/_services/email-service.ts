import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendInvitationEmail = async (
  to: string,
  clientName: string,
  projectName: string,
  projectLink: string
) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Email not sent.')
    return { success: false, error: 'Resend API key missing' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'UVTester <onboarding@resend.dev>', // Update this with verified domain later
      to: [to],
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

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Send email exception:', error)
    return { success: false, error }
  }
}
