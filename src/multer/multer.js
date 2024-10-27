 
import multer from 'multer';
import path from 'path';


 
const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        console.log("hlo worlds")
        cb(null, './uploads'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});


const fileFilter = (req, file, cb) => {
    console.log("Hlo world")
    const filetypes = /csv/; 
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true); 
    }
    cb(new Error('Invalid file type, only CSV files are allowed!')); 
};


const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});


export default upload;