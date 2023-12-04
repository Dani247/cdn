import { Router } from 'express'
import { existsSync } from 'fs';
import multer, { DiskStorageOptions, FileFilterCallback } from 'multer';
import path from 'path';
import { v4 } from 'uuid'
import { pool } from '../utils/db';

const router = Router();
const storagePath = process.env.STORAGE_PATH;
// Set storage engine for multer
const storage = multer.diskStorage({
    destination: storagePath,
    filename: async function (req, file, cb) {
        await pool.query("BEGIN");
        const id = v4();
        const extension = path.extname(file.originalname);
        const record = {
            originalname: file.originalname,
            date: Date.now(),
            filename: `${id}${extension}`,
            mimetype: file.mimetype,
            extension,
            id,
            meta: file
        }
        const query = `
        INSERT INTO public.files (id, date, extension, originalname, mimetype)
        VALUES ($1, $2, $3, $4, $5)
        `;

        const res = await pool.query(query, [id, new Date(), extension, record.originalname, record.mimetype]);
        console.log("NEW RECORD: ", record.filename)
        console.log('Insert successful:', res.rowCount);
        cb(null, record.filename);
    }
});

// Init upload
const upload = multer({
    storage: storage
}).single('myFile'); // 'myFile' is the field name in the form

// Upload route
router.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.send('Error uploading file.');
        } else {
            res.send('File uploaded successfully.');
        }
    });
});

// Download route
router.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;

    if (!storagePath) {
        res.status(500).send("SOMETHING WENT WRONG");
        return;
    }
    const file = path.join(storagePath, filename);
    const fileExists = existsSync(file);
    if (!fileExists) {
        const htmlFile = path.join(__dirname, '../html/404.html');
        res.sendFile(htmlFile);
    } else {
        res.download(file);
    }
});

export default router;