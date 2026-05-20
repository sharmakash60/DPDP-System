import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

# -------------------------
# CONFIG DATA
# -------------------------
def generate_config_data(n=1000):
    data = []

    for _ in range(n):
        encryption = np.random.choice([0, 1], p=[0.3, 0.7])
        audit = np.random.choice([0, 1], p=[0.4, 0.6])
        retention = np.random.randint(0, 365)
        access = random.choice(["admin", "user", "service"])
        backup = np.random.choice([0, 1], p=[0.2, 0.8])

        # Risk logic (label)
        risk = 0
        if encryption == 0 or audit == 0 or retention < 30:
            risk = 1

        data.append([
            encryption, audit, retention, access, backup, risk
        ])

    return pd.DataFrame(data, columns=[
        "encryption_enabled",
        "audit_logging",
        "retention_days",
        "access_level",
        "backup_enabled",
        "risk_label"
    ])


# -------------------------
# LOG DATA
# -------------------------
def generate_log_data(n=5000):
    actions = ["SELECT", "INSERT", "UPDATE", "DELETE", "EXPORT"]
    tables = ["users", "payments", "orders", "logs"]

    data = []

    for _ in range(n):
        action = random.choice(actions)
        table = random.choice(tables)
        rows = np.random.randint(1, 10000)
        status = random.choice(["success", "failed"])
        time = datetime.now() - timedelta(minutes=np.random.randint(0, 10000))

        # Risk logic
        risk = 0
        if action == "EXPORT" and rows > 1000:
            risk = 1
        if action == "DELETE" and table == "users":
            risk = 1
        if status == "failed" and rows > 5000:
            risk = 1

        data.append([
            action, table, rows, status, time, risk
        ])

    return pd.DataFrame(data, columns=[
        "action",
        "table",
        "rows_accessed",
        "status",
        "timestamp",
        "risk_label"
    ])


# -------------------------
# GENERATE DATA
# -------------------------
config_df = generate_config_data()
log_df = generate_log_data()

# Save to CSV
config_df.to_csv("config_data.csv", index=False)
log_df.to_csv("log_data.csv", index=False)

print("Dummy data generated successfully!")