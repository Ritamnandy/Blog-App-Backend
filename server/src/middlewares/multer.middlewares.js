
import multer from "multer"

const Storage = multer.diskStorage(
    {
        destination: function ( req, file, cb )
        {
            cb( null, "src/public/temp/" )
        },
        filename: function ( req, file, cb )
        {
            cb( null, Date.now().toLocaleString() + "-" + file.originalname )
        }
    }
)

const upload = multer.upload( { storage: Storage } )

export { upload }