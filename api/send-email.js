const nodemailer = require('nodemailer');

// ========== GANTI DENGAN 10 EMAIL DAN APP PASSWORD ASLI ANDA ==========
const SENDER_ACCOUNTS = [
        { email: "rizkyramadhani060601@gmail.com", password: "eryekpwtwwahcujm" },
        { email: "fianajah080801@gmail.com", password: "qsmdlfdafswnuewy" },
        { email: "akuunn0033@gmail.com", password: "rgvqktuhpectmqnf" },
        { email: "akuunn0044@gmail.com", password: "bkplhrelgnjlgenb" },
        { email: "akuunn0066@gmail.com", password: "ofyxmsttjbaizaoy" },
        { email: "akuunn100@gmail.com", password: "vaawmqkvleuptlst" },
        { email: "lmgacor0066@gmail.com", password: "prjmvsuvkvxqoskx" },
        { email: "akuunn1001@gmail.com", password: "vrngwowpcvxrzgxz" },
        { email: "akuunn2001@gmail.com", password: "qwvwppmkqslkbcpi" },
        { email: "rimada060606@gmail.com", password: "jhzicmygeuobgxtd" }
];

const getTransporter = (email, password) => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user: email, pass: password }
    });
};

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { index, targetEmail, subject, message, cvBase64, cvFilename } = req.body;
    
    if (index === undefined || !targetEmail) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const sender = SENDER_ACCOUNTS[index];
    if (!sender) {
        return res.status(400).json({ error: `Akun ke-${index+1} tidak ditemukan` });
    }
    
    try {
        const transporter = getTransporter(sender.email, sender.password);
        
        const mailOptions = {
            from: `"Lamaran Kerja" <${sender.email}>`,
            to: targetEmail,
            subject: subject,
            text: message,
            html: message.replace(/\n/g, '<br>')
        };
        
        if (cvBase64 && cvFilename) {
            mailOptions.attachments = [{
                filename: cvFilename,
                content: cvBase64,
                encoding: 'base64'
            }];
        }
        
        await transporter.sendMail(mailOptions);
        
        return res.status(200).json({ 
            success: true, 
            sender: sender.email 
        });
        
    } catch (error) {
        console.error(`Error:`, error);
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};
