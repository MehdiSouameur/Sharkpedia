const { db, storage } = require("../firebaseConfig")

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

exports.home = async (req, res) => {
    const sharks = await getAllSharks();
    console.log(sharks);
    res.render('index', { 
        sharks: sharks,
        title: 'Home' 
    });
 };

 exports.missing_page = (req, res) => {
    res.render('article_notfound', { title: '404' });
 };

 
 