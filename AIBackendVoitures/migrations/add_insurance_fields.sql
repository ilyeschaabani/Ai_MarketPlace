-- Insurance Risk Analyzer Migration
-- Add insurance-related columns to annonces table

ALTER TABLE annonces
  ADD COLUMN insurance_risk_score FLOAT NULL COMMENT 'AI-predicted insurance risk (0-1 scale)' AFTER fraud_level,
  ADD COLUMN insurance_cost DECIMAL(10,2) NULL COMMENT 'Estimated insurance premium (TND/year)' AFTER insurance_risk_score,
  ADD COLUMN insurance_risk_level VARCHAR(20) NULL COMMENT 'Risk level: low, medium, high' AFTER insurance_cost,
  ADD COLUMN number_of_accidents INT DEFAULT 0 COMMENT 'Number of previous accidents' AFTER insurance_risk_level,
  ADD COLUMN years_of_experience INT DEFAULT 0 COMMENT 'Driver years of experience' AFTER number_of_accidents;

-- Add index for filtering by risk level
CREATE INDEX idx_insurance_risk_level ON annonces(insurance_risk_level);

-- Add index for sorting by insurance cost
CREATE INDEX idx_insurance_cost ON annonces(insurance_cost);
