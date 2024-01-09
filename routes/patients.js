const express = require('express');
const router = express.Router();
const cors = require('cors'); // Import the cors middleware
const Patient = require('../models/patient');
const Users = require('../models/users');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const secretKey =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRydCIsInJvbGUiOiJVc2VycyIsImlkIjo0LCJpYXQiOjE3MDQ0ODg2NTAsImV4cCI6MTcwNDQ5MjI1MH0.SIqh641gfHlf14XU4N3wWTnaEJa7-aa1_HfozvOG738';

// Use cors middleware
router.use(cors());

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.log('Token:', token);
      console.log('Key', secretKey);
      console.log('Token verification failed:', err.message);
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    req.user = user;
    console.log('Authenticated user:', user);
    next();
  });
};

// Function to get promoCodeId from the users table by userId
const getPromoCodeIdById = async (userId) => {
  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      return null; 
    }
    return user.promoCodeId;
  } catch (error) {
    console.error('Error getting promoCodeId:', error);
    throw error;
  }
};
router.use(authenticateJWT);
// Route to register a new patient
const createPatient = async (patientDetails) => {
  try {
    const { fullName, age, gender, dateOfBirth, city, country, userId, promoCodeId } = patientDetails;

    // Your additional logic here, if needed

    const patient = await Patient.create({
      fullName,
      age,
      gender,
      dateOfBirth,
      city,
      country,
      userId,
      promoCodeId,
    });

    return patient;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

router.use(authenticateJWT);

router.post('/register-patient', async (req, res) => {
  try {
    const userId = req.header('user-id');
    console.log('Sent User Id from the Frontend', userId);

    const { fullName, age, gender, dateOfBirth, city, country } = req.body;

    const promoCodeId = await getPromoCodeIdById(userId);
    console.log('Promo Code ID:', promoCodeId);

    const patientDetails = {
      fullName,
      age,
      gender,
      dateOfBirth,
      city,
      country,
      userId,
      promoCodeId,
    };

    // Log patient details for debugging
    console.log('Patient Details:', patientDetails);

    const patient = await createPatient(patientDetails);
    console.log('Patient:', patient);

    res.json({ success: true, patientId: patient.id, userId, promoCodeId });
  } catch (error) {
    console.error('Error during patient registration:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
module.exports = router;
