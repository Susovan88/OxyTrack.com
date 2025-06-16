import cron from 'node-cron';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import Medication from '../models/medicationModel.js';
import axios from 'axios';
import User from '../models/userModel.js';

// Create transport for email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
 
// voice call alert
const makeCall = async (to, medicationName) => {
  try {
    const call = await twilioClient.calls.create({
      url: process.env.TWIML_BIN_URL,  // Replace with your TwiML Bin URL
      to,
      from: process.env.TWILIO_PHONE_NUMBER
    });
    console.log('Call initiated:', call.sid);
  } catch (err) {
    console.error('Error making call:', err);
  }
};

const scheduleReminders = async () => {
  try {
    console.log("Starting Medication Reminder Scheduler...");

    // Schedule a cron job to run every minute
    cron.schedule('* * * * *', async () => {
      const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false }).slice(0,5);
      console.log(`Checking for reminders at ${currentTime}...`);

      // Fetch medications that are active and match the current time
      const medications = await Medication.find({ isActive: true, reminderTime: currentTime }).populate('userId');

      medications.forEach(async (med) => {
        console.log(`Sending reminder for medication: ${med.medicationName}`);

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: med.userId.email,  
          subject: 'Medication Reminder',
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
              <h2 style="color: #4CAF50; text-align: center; font-size: 24px;">💊 Medication Reminder</h2>
              <p style="font-size: 18px; line-height: 1.6; color: #333;">
                Hello <strong style="color: #2196F3;">${med.userId.name}</strong>,<br><br>
                This is a friendly reminder that it's time to take your medication: 
                <span style="color: #FF5722; font-weight: bold; font-size: 20px;">${med.medicationName}</span>.<br><br>
                Please remember to take it on time for your health and well-being!<br><br>
                <p style="font-size: 16px; color: #777;">
                  <em>Stay healthy and take care!</em>
                </p>
              </p>
            </div>
          `
        };
        

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) console.error('Error sending email:', error);
          else console.log('Email sent:', info.response);
        });

        // Send SMS reminder
        twilioClient.messages
          .create({
            body: `Reminder: Time to take your medication: ${med.medicationName}.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: med.userId.phone  // Assuming User model has phone
          })
          .then(message => console.log('SMS sent:', message.sid))
          .catch(err => console.error('Error sending SMS:', err));

          makeCall(med.userId.phone, med.medicationName);
      });
    });

  } catch (error) {
    console.error("Error scheduling reminders:", error);
  }
};

const emergencyAlert = async (req,res) => {
  try {
    console.log("Risky0000000000000000000000000000222");
    const userId= req.header('userId');

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }
    const user = await User.findById(userId);
    console.log(`Sending emergency alerts for ${user.name}`);

    if (user.emergencyContacts && user.emergencyContacts.length > 0) {
      for (const contact of user.emergencyContacts) {
        // Send Email Alert
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: contact.email,
          subject: '🚨 Emergency Alert!',
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #fff3f3; padding: 20px; border-radius: 8px; border: 1px solid #ff6666;">
              <h2 style="color: #D32F2F; text-align: center; font-size: 24px;">🚑 Emergency Alert</h2>
              <p style="font-size: 18px; line-height: 1.6; color: #333;">
                Hello <strong>${contact.name || 'Emergency Contact'}</strong>,<br><br>
                This is an emergency alert for <strong>${user.name}</strong>. Please check on them immediately.<br><br>
                If you need assistance, please call emergency services.<br><br>
                <p style="font-size: 16px; color: #777;">
                  <em>Stay safe and take action!</em>
                </p>
              </p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log('Emergency email sent to:', contact.email);

        // Send SMS Alert
        await twilioClient.messages.create({
          body: `🚨 Emergency Alert: Please check on ${user.name} immediately!`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: contact.phone
        });
        console.log('Emergency SMS sent to:', contact.phone);

        // Make Emergency Call
        await makeCall(contact.phone, `Emergency Alert: Check on ${user.name}`);
      }
      return res.json({success:true, message:"Send Alert."});
    }
    return res.json({success:false, message:"No emergency Contact"});
  } catch (error) {
    console.log("Error sending emergency alerts:", error);
    return res.json({success:false, message:error.message});
  }
};

export {scheduleReminders,emergencyAlert};
