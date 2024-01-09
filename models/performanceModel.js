const db = require('../dbs'); 

const getClicksByInfluencerId = async (influencerId) => {
  try {
    const [rows] = await db.query('SELECT COUNT(DISTINCT created_at) AS count FROM clicks WHERE influencerId = ?', [influencerId]);

    if (rows.length > 0) {
      return { count: rows[0].count };
    } 

    return { count: 0 };
  } catch (error) {
    throw error;
  }
};


const getSignupsByInfluencerId = async (influencerId) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS count FROM signups WHERE influencerId = ?', [influencerId]);

    if (rows.length > 0) {
      return { count: rows[0].count };
    }

    return { count: 0 };
  } catch (error) {
    throw error;
  }
};

const getRegisteredPatientsByInfluencerId = async (influencerId) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS count FROM registeredpatients WHERE influencerId = ?', [influencerId]);

    if (rows.length > 0) {
      return { count: rows[0].count };
    }

    return { count: 0 };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getClicksByInfluencerId,
  getSignupsByInfluencerId,
  getRegisteredPatientsByInfluencerId,
};
