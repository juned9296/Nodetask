import { Router } from 'express';
import multer from 'multer';
// import upload from '../multer/multer.js';
import { uploadCSV,getHighestVolume,getAverageClose,getAverageVWAP } from '../controller/stock.controller.js';
const router = Router();

const upload = multer({dest:'uploads/'})

router.post('/upload', upload.single('file'),  uploadCSV);
router.get('/highest_volume', getHighestVolume);
router.get('/average_close', getAverageClose);
router.get('/average_vwap', getAverageVWAP);

export default router


