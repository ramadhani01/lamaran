const nodemailer = require('nodemailer');

// ========== KONFIGURASI 10 AKUN EMAIL (GANTI DENGAN AKUN ASLI ANDA) ==========
const SENDER_ACCOUNTS = [
        { email: "rizkyramadhani060601@mail.com", password: "erye kpwt wwah cujm" },
        { email: "fianajah080801@mail.com", password: "qsmd lfda fswn uewy" },
        { email: "akuunn0033@mail.com", password: "rgvq ktuh pect mqnf" },
        { email: "akuunn0044@mail.com", password: "bkpl hrel gnjl genb" },
        { email: "akuunn0066@mail.com", password: "ofyx mstt jbai zaoy" },
        { email: "akuunn100@mail.com", password: "vaaw mqkv leup tlst" },
        { email: "lmgacor0066@mail.com", password: "prjm vsuv kvxq oskx" },
        { email: "akuunn1001@mail.com", password: "vrng wowp cvxr zgxz" },
        { email: "akuunn2001@mail.com", password: "qwvw ppmk qslk bcpi" },
        { email: "rimada060606@mail.com", password: "jhzi cmyg euob gxtd" }
    ];
// Konfigurasi SMTP Gmail (bisa diganti dengan provider lain)
const getTransporter = (email, password) => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user: email, pass: password },
        tls: { rejectUnauthorized: false }
    });
};

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
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
            from: `"Lamaran Pekerjaan" <${sender.email}>`,
            to: targetEmail,
            subject: subject,
            text: message,
            html: message.replace(/\n/g, '<br>')
        };
        
        // Tambahkan attachment jika ada CV
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
        console.error(`Error sending from ${sender.email}:`, error);
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};
