import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler


class SpoilageModel:
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = IsolationForest(contamination=0.05)
        self.train()

    def train(self):
        np.random.seed(42)

        temperature = np.random.normal(4, 0.5, 1000)
        humidity = np.random.normal(85, 2, 1000)
        gas = np.random.normal(100, 10, 1000)
        vibration = np.random.normal(0.5, 0.15, 1000)

        data = pd.DataFrame(
            {
                "temperature": temperature,
                "humidity": humidity,
                "gas": gas,
                "vibration": vibration,
            }
        )

        scaled = self.scaler.fit_transform(data)
        self.model.fit(scaled)

    def predict(self, temp, hum, gas, vib):
        new_data = pd.DataFrame(
            {"temperature": [temp], "humidity": [hum], "gas": [gas], "vibration": [vib]}
        )

        scaled = self.scaler.transform(new_data)
        prediction = self.model.predict(scaled)
        score = self.model.decision_function(scaled)[0]

        status = (
            "Spoilage Risk Detected" if prediction[0] == -1 else "Conditions Normal"
        )

        risk_percent = max(0, min(100, int((0.5 - score) * 100)))

        return {
            "status": status,
            "risk_percent": risk_percent,
            "anomaly_score": float(score),
        }
