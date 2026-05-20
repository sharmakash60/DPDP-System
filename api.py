# api.py
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import io
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/upload")
async def analyze_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        
        # ==========================================
        # 1. ROBUST HYBRID INGESTION
        # ==========================================
        try:
            # Try parsing as standard structured CSV/Log
            df = pd.read_csv(io.BytesIO(contents))
            if len(df.columns) <= 1:
                raise ValueError("Re-routing to unstructured splitter.")
        except Exception:
            # Fallback for raw, space-separated, or corrupted text lines
            raw_lines = contents.decode('utf-8', errors='ignore').splitlines()
            token_matrix = [line.replace(',', ' ').split() for line in raw_lines if line.strip()]
            df = pd.DataFrame(token_matrix)

        # Drop entirely empty rows or columns to protect ML matrices
        df.dropna(how='all', inplace=True)
        df.fillna("N/A", inplace=True)
        
        # Standardize current column headers to lowercase strings
        df.columns = [str(col).replace('\ufeff', '').strip().lower() for col in df.columns]
        
        ml_anomalies = []
        rule_violations = []
        
        if len(df) == 0:
            return {"error": "The uploaded log file is completely empty."}

        # ==========================================
        # 2. SEMANTIC INTELLIGENCE THREAT IDENTIFIER
        # ==========================================
        # We search every row for explicit danger keywords added by the user
        danger_keywords = ["critical", "anomaly", "anmoalies", "error", "fail", "unauthorized", "breach", "attack"]
        
        def calculate_semantic_risk(row):
            row_str = " ".join(row.astype(str)).lower()
            # If any dangerous keyword is hidden inside this row, flag it as a 1 (Threat)
            if any(keyword in row_str for keyword in danger_keywords):
                return 1
            # Standard numeric threshold rule fallback
            for val in row:
                try:
                    if float(val) > 1000: 
                        return 1
                except ValueError:
                    continue
            return 0

        # Generate our dynamic ML target training label based on file content
        df["risk_label"] = df.apply(calculate_semantic_risk, axis=1)

        # ==========================================
        # 3. INTERACTIVE FEATURE EXTRACTION
        # ==========================================
        # Dynamically discover columns or assign layout backups safely
        cols = df.columns.tolist()
        
        # Pick standard variables or fall back to column positions
        action_col = "action" if "action" in cols else (cols[0] if len(cols) > 0 else "risk_label")
        table_col = "table" if "table" in cols else (cols[3] if len(cols) > 4 else (cols[1] if len(cols) > 1 else "risk_label"))
        rows_col = "rows_accessed" if "rows_accessed" in cols else (cols[4] if len(cols) > 4 else None)
        status_col = "status" if "status" in cols else (cols[2] if len(cols) > 2 else "risk_label")

        # Clean numerical components safely
        if rows_col:
            df["parsed_rows"] = pd.to_numeric(df[rows_col], errors='coerce').fillna(0).astype(int)
        else:
            df["parsed_rows"] = df["risk_label"].apply(lambda x: 5000 if x == 1 else 120)

        # ==========================================
        # 4. RANDOM FOREST CLASSIFIER EXECUTION
        # ==========================================
        # Vectorize and encode all string features safely
        encoder_df = pd.DataFrame()
        le = LabelEncoder()
        
        for col in [action_col, table_col, status_col]:
            encoder_df[f"{col}_encoded"] = le.fit_transform(df[col].astype(str))
            
        encoder_df["parsed_rows"] = df["parsed_rows"]
        
        X = encoder_df
        y = df["risk_label"]
        
        # If there are threats found, fit our pipeline model
        if len(y.unique()) > 1:
            clf = RandomForestClassifier(n_estimators=50, random_state=42)
            clf.fit(X, y)
            df["predicted_risk"] = clf.predict(X)
            df["risk_prob"] = clf.predict_proba(X)[:, 1]
        else:
            # Fallback if file contains all anomalies or all clean rows
            df["predicted_risk"] = y
            df["risk_prob"] = y.astype(float)

        # ==========================================
        # 5. UNIFORM PARSED RESPONSE COMPILATION
        # ==========================================
        # Filter rows out that our classifier identified as dangerous vectors
        detected_threats = df[df["predicted_risk"] == 1].sort_values(by="risk_prob", ascending=False)
        
        for idx, row in detected_threats.head(30).iterrows():
            prob = row["risk_prob"]
            row_text = " | ".join(row.drop(["risk_label", "predicted_risk", "risk_prob", "parsed_rows"], errors='ignore').astype(str))
            
            # Match the payload format the React charts are looping through
            ml_anomalies.append({
                "action": str(row[action_col]).upper().strip(),
                "table": str(row[table_col]).strip(),
                "rows": int(row["parsed_rows"]),
                "status": str(row[status_col]).lower().strip(),
                "time": f"Row {idx + 1}",
                "risk": "CRITICAL" if (prob > 0.75 or any(kw in row_text.lower() for kw in ["critical", "anomaly"])) else "MEDIUM"
            })

        # Calculate a variable risk score balance based on metrics found
        overall_score = max(8, 100 - (len(ml_anomalies) * 6))
        
        return {
            "filename": file.filename,
            "overallRiskScore": int(overall_score),
            "scannedLogs": len(df),
            "anomaliesDetected": len(ml_anomalies),
            "ruleViolations": rule_violations,
            "mlAnomalies": ml_anomalies
        }
        
    except Exception as e:
        return {"error": f"ML Parser execution failure context aborted: {str(e)}"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)