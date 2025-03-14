const express = require('express')
const connectDB = require('./utils/conn')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000;

connectDB();

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/complaint', require('./routes/complaintRoutes'));
app.use('/api/invoice', require('./routes/invoiceRoutes'));
app.use('/api/messoff', require('./routes/messoffRoutes'));
app.use('/api/request', require('./routes/requestRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/suggestion', require('./routes/suggestionRoutes'));
app.use('/api/announcement', require('./routes/announcementRoutes'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
