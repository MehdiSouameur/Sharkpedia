const axios = require("axios")
const sharp = require("sharp");
const routes = require("../config.js");
const { db, storage } = require("../firebaseConfig")

// Dynamically route to shark article
exports.dynamic = async (req, res) => {
    try {
        const shark_id = req.params.id.replace(/_/g, ' ');

        const querySnapshot = await db.collection('sharks')
            .where('shark_name', '==', shark_id)
            .get();

        if (querySnapshot.empty) {
            return res.redirect(routes.pageNotFound);
        }

        const doc = querySnapshot.docs[0]; 
        const entry = doc.data();

        console.log(entry); 

        res.render("dynamic_article_temp", {
            shark_name: entry.shark_name,
            scientific_name: entry.science_name,
            shark_image_base64: entry.shark_image_url,
            shark_content: entry.shark_content
        });

    } catch (error) {
        console.error('Error retrieving document: ', error);
        res.status(500).send('Error retrieving document');
    }
};

// Create an entry page
exports.create = (req,res) => {
    res.render("create_entry_temp");
}

// Upload entry to firebase
exports.firebasePost = async (req,res) => {
    try {
        const { shark_name, science_name, shark_content, shark_image_name } = req.body;
        console.log(`Shark Name: ${shark_name}, Science Name: ${science_name}, Shark Content: ${shark_content}, Shark Image Name: ${shark_image_name}`);
        // Upload image to Storage and get the url
        let shark_image_url = "";
        if (req.files && req.files.shark_image) {
            const sharkImage = req.files.shark_image;
            const fileName = sharkImage.name;
            const firebasefile = storage.file(fileName);

            await firebasefile.save(sharkImage.data, {
                metadata: {
                    contentType: sharkImage.mimetype,
                },
            });

            // Get download URL
            const [url] = await firebasefile.getSignedUrl({
                action: 'read',
                expires: '2100-01-01T00:00:00Z'
            });

            shark_image_url = url;

        } else {
            console.log('No file uploaded.');
        }

        const docRef = await db.collection('sharks').add({
            shark_name,
            science_name,
            shark_content,
            shark_image_url
        });

        console.log("Document written with ID: ", docRef.id);
        res.redirect('/');
    } catch (e) {
        console.error("Error adding document: ", e);
        res.status(500).send("Error adding document");
    }
}


exports.gallery = async (req,res) => {
    const sharks = [];
    try {
        const sharksCollection = await db.collection('sharks').get();
        if (sharksCollection.empty) {
          console.log('No matching documents.');
          return [];
        }
    
        sharksCollection.forEach(doc => {
          sharks.push({ id: doc.id, ...doc.data() });
        });
    
      } catch (error) {
        console.error('Error retrieving sharks collection: ', error);
        throw new Error('Error retrieving sharks collection');
      }

    console.log(sharks);
    res.render('gallery', { 
        sharks: sharks,
        title: 'Home' 
    });
}