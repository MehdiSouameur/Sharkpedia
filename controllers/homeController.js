const { db, storage, admin } = require("../firebaseConfig")
const { verifyIdToken } = require("./helpers.js");

const getAllSharks = async () => {
    try {
      const sharksCollection = await db.collection('sharks').get();
      if (sharksCollection.empty) {
        console.log('No matching documents.');
        return [];
      }
  
      const sharks = [];
      sharksCollection.forEach(doc => {
        sharks.push({ id: doc.id, ...doc.data() });
      });
  
      return sharks;
    } catch (error) {
      console.error('Error retrieving sharks collection: ', error);
      throw new Error('Error retrieving sharks collection');
    }
  };

function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

exports.home = async (req, res) => {
    const sharks = await getAllSharks();
    const sharkRows = chunkArray(sharks, 2); 
    res.render('index', { 
        sharks: sharks,
        sharkRows: sharkRows,
        title: 'Home' 
    });
 };

 exports.missing_page = (req, res) => {
    res.render('article_notfound', { title: '404' });
 };

 exports.admin = async (req,res) => {
    const isAuth = await verifyIdToken(req,res);
    console.log(`IsAuth?${isAuth}`);
    if(!isAuth){
        res.render("admin");
    } else {
        res.redirect("/article")
    }
 };

 exports.authenticate = async (req,res) => {
      try {
        const id_token = req.cookies.firebaseIdToken; 

        if (!id_token) {
            return res.status(400).send('ID token is required');
        }

        // Verify the ID token using Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(id_token);

        // You can now use the decodedToken to access user info
        console.log('Decoded token:', decodedToken);

        // You can send back user information or proceed with the request
        res.json({
            message: 'User authenticated successfully!',
            user: decodedToken,
        });

    } catch (error) {
        // If token is invalid or expired
        console.error('Error verifying ID token:', error);
        res.status(401).send('Unauthorized');
    }
};



 
 