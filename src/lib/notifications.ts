import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCustomerNotification(userId: string, message: string) {
  // TODO: Retrieve user's email from your database or Clerk
  const userEmail = 'customer@example.com';

  try {
    const data = await resend.emails.send({
      from: 'William\'s Appliance Consult <onboarding@resend.dev>',
      to: userEmail,
      subject: 'Appliance Consult Info',
      text: message,
      // You can also use HTML for more styled emails
      // html: `<p>${message}</p>`,
    });

    console.log('Customer notification sent successfully:', data);
  } catch (error) {
    console.error('Error sending customer notification:', error);
  }
}

export async function sendAdminNotification(message: string) {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.error('Admin email not set in environment variables');
    return;
  }

  try {
    const data = await resend.emails.send({
      from: 'William\'s Appliance Consult <onboarding@resend.dev>',
      to: adminEmail,
      subject: 'New Upload Alert',
      text: message,
      // You can also use HTML for more styled emails
      // html: `<p>${message}</p>`,
    });

    console.log('Admin notification sent successfully:', data);
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}