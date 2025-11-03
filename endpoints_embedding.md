# Flask Recommendation Service - API

## Overview
This service provides two endpoints:
- POST `/v1/embed`: Normalize French car data and return an embedding.
- POST `/v1/similar`: Rank candidate embeddings by cosine similarity to a seed embedding.
- GET `/health`: Service status and metadata.

## POST /v1/embed
- Purpose: Accept a raw French car JSON and return:
  - Cleaned/normalized fields
  - Numeric embedding vector
  - Encoder version

- Request body:
```json
{
  "car": {
    "matricule": "MER-009",
    "marque": "Mercedes-Benz",
    "modele": "Classe A",
    "annee": 2021,
    "puissance": 163,
    "cylindres": 4,
    "carburant": "Essence",
    "transmission": "manuel",
    "traction": "FWD",
    "prix": 320.0
  }
}
```

- Response body:
```json
{
  "embedding": [0.012, -0.034, 0.045, ...],
  "encoder_version": "v1",
  "cleaned": {
    "Year": 2021,
    "Engine HP": 163.0,
    "Engine Cylinders": 4.0,
    "Make": "Mercedes-Benz",
    "Model": "Classe A",
    "Engine Fuel Type": "regular unleaded",
    "Transmission Type": "MANUAL",
    "Driven_Wheels": "front wheel drive"
  }
}
```

- Notes:
  - Unknown/missing numeric fields become null then imputed internally for embedding.
  - Categorical fields are trimmed, mapped to allowed sets, and normalized.

## POST /v1/similar
- Purpose: Compute top-k most similar candidates to a seed embedding using cosine similarity.

- Request body:
```json
{
  "seed": { "embedding": [0.012, -0.034, 0.045, ...] },
  "candidates": [
    { "id": "A1", "embedding": [0.009, -0.030, ...] },
    { "id": "A2", "embedding": [0.100, 0.001, ...] }
  ],
  "k": 10
}
```

- Successful response:
```json
{
  "topk": [
    { "id": "A2", "similarity": 0.9231 },
    { "id": "A1", "similarity": 0.8815 }
  ]
}
```

- Error responses:
  - Missing seed embedding:
    ```json
    { "error": "seed must include 'embedding'" }
    ```
  - Dimension mismatch:
    ```json
    { "error": "dimension mismatch: seed 512 vs candidates 256" }
    ```
  - Empty candidates:
    ```json
    { "topk": [] }
    ```

- Notes:
  - Both seed and candidates must be unit-compatible embeddings (same dimension).
  - Embeddings are unit-normalized internally before similarity.

## GET /health
- Purpose: Quick status and metadata.

- Response:
```json
{
  "ok": true,
  "encoder_version": "v1",
  "model": "gemini-2.0-flash-lite"
}
```

- Notes:
  - Use to verify service liveness and configuration.
