const  Click  = require('../models/click'); 

const isClickExists = async (timestamp) => {
    try {
      // Round the timestamp to seconds
      const roundedTimestamp = new Date(Math.floor(timestamp / 1000) * 1000);
  
      // Check if a click with the same rounded timestamp already exists
      const existingClick = await Click.findOne({
        where: {
          createdAt: roundedTimestamp,
        },
      });
  
      return existingClick !== null; // Return true if exists, false otherwise
    } catch (error) {
      console.error('Error checking if click exists:', error);
      throw error;
    }
  };
module.exports = isClickExists;