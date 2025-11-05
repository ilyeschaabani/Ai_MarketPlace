const { pool } = require('../db');

async function applyInsuranceMigration() {
  let connection;
  try {
    console.log('🔄 Applying insurance fields migration...');
    connection = await pool.getConnection();
    
    // Add columns
    await connection.query(`
      ALTER TABLE annonces
        ADD COLUMN IF NOT EXISTS insurance_risk_score FLOAT NULL COMMENT 'AI-predicted insurance risk (0-1 scale)',
        ADD COLUMN IF NOT EXISTS insurance_cost DECIMAL(10,2) NULL COMMENT 'Estimated insurance premium (TND/year)',
        ADD COLUMN IF NOT EXISTS insurance_risk_level VARCHAR(20) NULL COMMENT 'Risk level: low, medium, high',
        ADD COLUMN IF NOT EXISTS number_of_accidents INT DEFAULT 0 COMMENT 'Number of previous accidents',
        ADD COLUMN IF NOT EXISTS years_of_experience INT DEFAULT 0 COMMENT 'Driver years of experience'
    `);
    
    console.log('✅ Insurance columns added');
    
    // Add indexes
    try {
      await connection.query('CREATE INDEX idx_insurance_risk_level ON annonces(insurance_risk_level)');
      console.log('✅ Index idx_insurance_risk_level created');
    } catch (e) {
      if (e.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️  Index idx_insurance_risk_level already exists');
      } else {
        throw e;
      }
    }
    
    try {
      await connection.query('CREATE INDEX idx_insurance_cost ON annonces(insurance_cost)');
      console.log('✅ Index idx_insurance_cost created');
    } catch (e) {
      if (e.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️  Index idx_insurance_cost already exists');
      } else {
        throw e;
      }
    }
    
    connection.release();
    console.log('✅ Insurance migration completed successfully!');
    
  } catch (error) {
    if (connection) connection.release();
    console.error('❌ Migration error:', error.message);
    throw error;
  } finally {
    process.exit(0);
  }
}

applyInsuranceMigration();
