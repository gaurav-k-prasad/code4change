from flask import Flask, request, jsonify
from model import SpoilageModel

app = Flask(__name__)
model = SpoilageModel()


@app.route("/")
def home():
    return "SmartSpoilageDetection API Running"


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    try:
        temp = data["temperature"]
        hum = data["humidity"]
        gas = data["gas"]
        vib = data["vibration"]

        result = model.predict(temp, hum, gas, vib)
        return jsonify({"success": True, "result": result})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


if __name__ == "__main__":
    # set the port to 8080
    app.run(debug=True, port=8080)
