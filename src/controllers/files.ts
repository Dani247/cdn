import { Router } from 'express'
import { existsSync } from 'fs';
import multer, { DiskStorageOptions, FileFilterCallback } from 'multer';
import path from 'path';
import { v4 } from 'uuid'
import { pool } from '../utils/db';
import { log } from 'console';

const router = Router();
const storagePath = process.env.STORAGE_PATH;
// Set storage engine for multer
const storage = (id: string) => multer.diskStorage({
    destination: storagePath,
    filename: async function (req, file, cb) {
        const extension = path.extname(file.originalname);
        cb(null, `${id}${extension}`);
    }
})


// Init upload
const upload = (id: string) => multer({
    storage: storage(id),
}).single('myFile')// 'myFile' is the field name in the form

// Upload route
router.post('/upload', (req, res, next) => {
    const id = v4();
    // @ts-ignore
    req.id = id;
    upload(id)(req, res, () => {
        next();
    })
}, async (req, res) => {
    // @ts-ignore
    const id = req.id;
    const file = req.file;
    console.log("file", file)
    console.log("id", id)
    if (!file) {
        return res.status(400).send('Please upload a file.');
    }

    const extension = path.extname(file.originalname);
    const record = {
        originalname: file.originalname,
        date: Date.now(),
        filename: `${id}${extension}`,
        mimetype: file.mimetype,
        extension,
        id,
        meta: file,
    }
    const query = `
    INSERT INTO public.files (id, date, extension, originalname, mimetype)
    VALUES ($1, $2, $3, $4, $5)
    `;

    const result = await pool.query(query, [id, new Date(), extension, record.originalname, record.mimetype]);
    log("NEW RECORD: ", record.filename)
    log('Insert successful:', result.rowCount);

    res.send(record);
});

// Download route
router.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;

    if (!storagePath) {
        res.status(500).send("SOMETHING WENT WRONG");
        return;
    }
    const file = path.join(storagePath, filename);
    res.download(file);
});

router.get('/files', async (req, res) => {
    try {
        const query = `
            SELECT * FROM files;
        `;
        const result = await pool.query(query);
        res.status(200).send(result.rows);
    } catch (error) {
        res.status(500).send({ error })
    }
})

export default router;