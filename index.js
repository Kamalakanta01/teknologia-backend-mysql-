const express = require("express");
const bcrypt = require('bcrypt');
const { sequelize } = require("./connection");
const { dataSchema } = require("./model"); // Assuming dataSchema is your Sequelize model
const multer = require('multer');
const { memoryStorage } = require('multer')
const storage = memoryStorage()
const upload = multer({ storage })
const cors = require("cors")
const app = express();
app.use(express.json());
app.use(cors())

app.get("/", async (req, res) => {
    res.json("welcome")
});

const ITEMS_PER_PAGE = 5;

app.get("/data", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * ITEMS_PER_PAGE;

        const totalCount = await dataSchema.count();
        const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

        const allData = await dataSchema.findAll({
            offset: offset,
            limit: ITEMS_PER_PAGE,
            order: [['id', 'DESC']]
        });

        res.json({
            data: allData,
            currentPage: page,
            totalPages,
            totalCount,
        });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.post("/upload", upload.single("resume"), async (req, res) => {
    try {
        const { name, password } = req.body;
        const fileBuffer = req.file.buffer;

        const existingData = await dataSchema.findOne({ where: { file: fileBuffer } });

        if (existingData) {
            return res.status(400).json({ error: "Duplicate resume detected" });
        }

        const hash = bcrypt.hashSync(password, 6);
        const newData = await dataSchema.create({ name, file: fileBuffer, password });

        res.status(201).json(newData);
    } catch (error) {
        console.error("Error uploading resume:", error);
        res.status(500).json({ error: "Failed to upload resume" });
    }
});

app.delete("/data/:id", async (req, res) => {
    try {
        const id = req.params.id; // Get the id from req.params

        // Check if id is not undefined or NaN
        if (!id || isNaN(id)) {
            return res.status(400).json({ error: "Invalid id" });
        }

        // Convert id to integer
        const dataId = parseInt(id);

        // Delete data by id
        const deletedData = await dataSchema.destroy({ where: { id: dataId } });

        if (!deletedData) {
            return res.status(404).json({ error: "Data not found" });
        }
        res.json(deletedData);
    } catch (error) {
        console.error("Error deleting data:", error.message);
        res.status(500).json({ error: "Failed to delete data" });
    }
});

const PORT = 8080;
app.listen(PORT, async (req, res) => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
    console.log(`listening on ${PORT}`);
});