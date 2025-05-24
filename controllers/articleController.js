const axios = require("axios")
const sharp = require("sharp");
const routes = require("../config.js");
const { db, storage } = require("../firebaseConfig")
const { verifyIdToken } = require("./helpers.js");

// Dynamically route to shark article
exports.dynamic = async (req, res) => {
    try {
        const isAuth = await verifyIdToken(req,res);
        console.log(`IsAuth?${isAuth}`);

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
            shark_content: entry.shark_content,
            isAuth: isAuth,
            shark_id: shark_id,
            habitat: entry.range,
            length: entry.length,
            weight: entry.weight,
            lifespan: entry.lifespan,
            speed: entry.speed,
            status: entry.status
        });

    } catch (error) {
        console.error('Error retrieving document: ', error);
        res.status(500).send('Error retrieving document');
    }
};

// Create an entry page
exports.create = async (req,res) => {
    const isAuth = await verifyIdToken(req,res);
    console.log(`IsAuth?${isAuth}`);
    if(isAuth){
        res.render("create_entry_temp");
    } else {
        res.redirect("/admin")
    }
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

exports.firebaseEdit = async (req, res) => {
    try {
        const { shark_name, science_name, shark_content, range, status, length, weight, speed, lifespan } = req.body;
        const shark_id = shark_name;

        const querySnapshot = await db.collection('sharks')
            .where('shark_name', '==', shark_id)
            .get();

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const docRef = doc.ref;

            const updateData = {
                shark_name: shark_name,
                science_name: science_name,
                shark_content: shark_content,
                range: range,
                status: status,
                length: length,
                weight: weight,
                lifespan: lifespan,
                speed: speed

            };

            // Only process image if a valid one is uploaded
            if (
                req.files &&
                req.files.shark_image &&
                req.files.shark_image.data &&
                req.files.shark_image.data.length > 0
            ) {
                const sharkImage = req.files.shark_image;
                const fileName = sharkImage.name;
                const firebasefile = storage.file(fileName);

                await firebasefile.save(sharkImage.data, {
                    metadata: {
                        contentType: sharkImage.mimetype,
                    },
                });

                const [url] = await firebasefile.getSignedUrl({
                    action: 'read',
                    expires: '2100-01-01T00:00:00Z',
                });

                updateData.shark_image_url = url;
            }

            await docRef.update(updateData);

            console.log("Document updated successfully!");
        } else {
            console.log(`No document found with the given shark_name: ${shark_id}`);
        }

        res.redirect('/');
    } catch (e) {
        console.error("Error updating document: ", e);
        res.status(500).send("Error updating document");
    }
};


exports.firebaseDelete = async (req, res) => {
    try {
        const shark_id = req.params.id.replace(/_/g, ' ');

        const querySnapshot = await db.collection('sharks')
            .where('shark_name', '==', shark_id)
            .get();

        if (querySnapshot.empty) {
            console.log("No matching document found.");
            return res.status(404).send("Document not found");
        }

        // Loop through all matching documents and delete them
        querySnapshot.forEach(async (doc) => {
            await doc.ref.delete();
            console.log(`Deleted document: ${doc.id}`);
        });

        console.log("Document(s) successfully deleted.");

        res.redirect('/?reload=true');

    } catch (e) {
        console.error("Error deleting document: ", e);
        res.status(500).send("Error deleting document");
    }
};


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

exports.edit = async (req, res) => {
    try {
        console.log("Inside Edit Page");
        const isAuth = await verifyIdToken(req,res);
        console.log(`IsAuth?${isAuth}`);
        if(!isAuth){
            res.redirect("/admin")
        }

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

        res.render("edit_entry", {
            shark_name: entry.shark_name,
            scientific_name: entry.science_name,
            shark_content: entry.shark_content,
            shark_image_url: entry.shark_image_url,
            range: entry.range,
            status: entry.status,
            length: entry.length,
            weight: entry.weight,
            lifespan: entry.lifespan,
            speed: entry.speed
        });

    } catch (error) {
        console.error('Error retrieving document: ', error);
        res.status(500).send('Error retrieving document');
    }
};