"use server"

import { Resend } from 'resend'
import { prisma } from '@/lib/db'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(formData: FormData) {
    const username = formData.get('username') as string
    const senderName = formData.get('name') as string
    const senderEmail = formData.get('email') as string
    const message = formData.get('message') as string

    // Validation
    if (!senderName || !senderEmail || !message) {
        return { error: 'All fields are required' }
    }

    if (!senderEmail.includes('@')) {
        return { error: 'Invalid email address' }
    }

    // Get portfolio owner's email
    const user = await prisma.user.findUnique({
        where: { username },
        select: { email: true, name: true }
    })

    if (!user) {
        return { error: 'User not found' }
    }

    const recipientEmail = user.email

    try {
        await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>', // Change this after domain verification
            to: recipientEmail,
            replyTo: senderEmail,
            subject: `New message from ${senderName} via your portfolio`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">New Contact Form Submission</h2>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${senderName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${senderEmail}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            Reply directly to this email to respond to ${senderName}.
          </p>
        </div>
      `
        })

        return { success: true }
    } catch (error) {
        console.error('Failed to send email:', error)
        return { error: 'Failed to send message. Please try again.' }
    }
}
