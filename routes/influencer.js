const express = require('express');
const router = express.Router();
const Influencers = require('../models/Influencers');
const bcrypt = require('bcrypt');

// Route to get all influencers
router.get('/influencers', async (req, res) => {
  try {
    const influencers = await Influencers.findAll();
    res.json(influencers);
  } catch (error) {
    console.error('Error fetching influencers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
const extractInfluencerName = (promoCodeParam)=>{
  try{
  const promoCodeUrl = decodeURIComponent(promoCodeParam);
      // Extract influencer name
      const influencerStartIndex = promoCodeUrl.indexOf('?ref=') + 5;
      const promoIndex = promoCodeUrl.indexOf('/promo');
      const influencerEndIndex = promoIndex !== -1 ? promoIndex : promoCodeUrl.indexOf('&', influencerStartIndex);
      const influencerName = promoCodeUrl.slice(
        influencerStartIndex,
        influencerEndIndex !== -1 ? influencerEndIndex : undefined
      );
  
      return {
   
        influencerName
      };
    } catch (error) {
      console.error('Error encrypting promo code and influencer:', error);
      throw error;
    }
  
}
router.post('/get-influencer-id', async (req, res) => {
  try {
    const { promoCodeParam } = req.body;

    // Implement your logic to extract influencer name from promoCodeParam
    const influencerName = extractInfluencerName(promoCodeParam);

    // Find the influencer based on the name
    const influencerRecord = await Influencers.findOne({ where: { name: influencerName } });

    if (!influencerRecord) {
      console.error('Influencer not found');
      return res.status(404).json({ success: false, message: 'Influencer not found' });
    }
    
    res.status(200).json({ success: true, influencerId: influencerRecord.id });
  } catch (error) {
    console.error('Error getting influencerId:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Route to add a new influencer
router.post('/influencers', async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const role_id = 2;

    // Use bcrypt to hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new influencer in the database
    const newInfluencer = await Influencers.create({
      name,
      username,
      password: hashedPassword,
      role_id
    });

    // Respond with the newly created influencer
    res.json(newInfluencer);
  } catch (error) {
    console.error('Error adding influencer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update an influencer
router.put('/influencers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, password } = req.body;

    // Hash the password before updating it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the influencer in the database
    const [rowsUpdated, [updatedInfluencer]] = await Influencers.update(
      { name, username, password: hashedPassword },
      { where: { id }, returning: true }
    );

    // Check if the influencer was found and updated
    if (rowsUpdated === 0) {
      res.status(404).json({ error: 'Influencer not found' });
    } else {
      res.json(updatedInfluencer);
    }
  } catch (error) {
    console.error('Error updating influencer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete an influencer
router.delete('/influencers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the influencer from the database
    const rowsDeleted = await Influencers.destroy({ where: { id } });

    // Check if the influencer was found and deleted
    if (rowsDeleted === 0) {
      res.status(404).json({ error: 'Influencer not found' });
    } else {
      res.json({ message: 'Influencer deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting influencer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
