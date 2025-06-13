const app = require('./app');
const PORT = process.env.PORT || 5000;

app.get("/test", (req, res) => {
    res.json({ message: "Hello from backend!" });
  });
  
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


  
