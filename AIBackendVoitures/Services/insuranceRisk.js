const axios = require('axios');

const INSURANCE_API_URL = process.env.INSURANCE_API_URL || 'http://localhost:5002/predict';

/**
 * Call the Insurance Risk Analyzer API to get risk score and insurance cost
 * @param {Object} data - Car and driver data
 * @param {number} data.carYear - Year of the car
 * @param {number} data.carValue - Value of the car in TND
 * @param {number} data.numberOfAccidents - Number of previous accidents
 * @param {number} data.yearsOfExperience - Driver's years of experience
 * @returns {Promise<Object>} Insurance risk analysis result
 */
async function getInsuranceRisk({ carYear, carValue, numberOfAccidents, yearsOfExperience }) {
  try {
    console.log('🔍 Calling Insurance Risk API...', { carYear, carValue, numberOfAccidents, yearsOfExperience });
    
    const response = await axios.post(INSURANCE_API_URL, {
      carYear: Number(carYear),
      carValue: Number(carValue),
      numberOfAccidents: Number(numberOfAccidents),
      yearsOfExperience: Number(yearsOfExperience)
    }, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.success) {
      console.log('✅ Insurance Risk API response:', response.data);
      return {
        riskScore: response.data.riskScore || null,
        insuranceCost: response.data.insuranceCost || null,
        riskLevel: response.data.riskLevel || null,
        message: response.data.message || ''
      };
    }

    console.log('⚠️ Insurance Risk API returned unsuccessful response');
    return {
      riskScore: null,
      insuranceCost: null,
      riskLevel: null,
      message: 'Insurance risk analysis unavailable'
    };

  } catch (error) {
    console.error('❌ Error calling Insurance Risk API:', error.message);
    return {
      riskScore: null,
      insuranceCost: null,
      riskLevel: null,
      message: 'Insurance risk analysis service unavailable'
    };
  }
}

module.exports = { getInsuranceRisk };
