from flask import Flask, request, jsonify
import pandas as pd
import joblib
import datetime
from flask_cors import CORS

# Load the trained models
model = joblib.load('model_of_available_predictions.pkl')
model2 = joblib.load('parking_rush_hour_model.pkl')
# Load the trained model using joblib
model3 = joblib.load("kmeans_parking_model.pkl")

app = Flask(__name__)
CORS(app)

# Total Parking Slots Mapping based on Parking_Lot_ID
PARKING_SLOTS_MAPPING = {
    1: 1460, 2: 4372, 3: 3692, 4: 1066, 5: 4044,
    6: 3771, 7: 3519, 8: 730, 9: 2285, 10: 1369
}

def get_total_parking_slots(parking_lot_id):
    return PARKING_SLOTS_MAPPING.get(parking_lot_id, 500)  # Default to 500 if ID not found

def encode_weather(weather_value):
    return {
        "Weather_Rainy": 1 if weather_value == 1 else 0,
        "Weather_Snowy": 1 if weather_value == 2 else 0,
        "Weather_Sunny": 1 if weather_value == 3 else 0
    }

def process_timestamp(timestamp_str):
    try:
        dt = datetime.datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S")
        return int(dt.timestamp()), dt.hour
    except ValueError:
        return None, None

# Columns for model 1 (Parking Availability Prediction)
MODEL_COLUMNS_OF_AVAILABLE_PREDICTIONS = [
    "Timestamp", "Parking_Lot_ID", "Total_Parking_Slots", "Hour", "Event", "Holiday", 
    "Truck_Booking_Count", "Motorcycle_Booking_Count", "Total_Booking_Count", "Total_Used_Slots", 
    "Regular_Customer_Count", "VIP_Customer_Count", "Subscription_Customer_Count", "OneTime_Customer_Count", 
    "Total_Customer_Type", "Weather_Rainy", "Weather_Snowy", "Weather_Sunny"
]

DEFAULT_VALUES_MODEL_1 = {
    "Truck_Booking_Count": 5,
    "Motorcycle_Booking_Count": 2,
    "Total_Booking_Count": 10,
    "Total_Used_Slots": 8,
    "Regular_Customer_Count": 50,
    "VIP_Customer_Count": 10,
    "Subscription_Customer_Count": 20,
    "OneTime_Customer_Count": 5,
    "Total_Customer_Type": 85,
    "Weather_Rainy": 0,
    "Weather_Snowy": 0,
    "Weather_Sunny": 0
}
DEFAULT_VALUES_MODEL_2 = {

    "Weather_Rainy": 0,
    "Weather_Snowy": 0,
    "Weather_Sunny": 0
}

@app.route('/predict', methods=['POST'])
def predict():
    required_fields = ["Timestamp", "Parking_Lot_ID", "Event", "Holiday", "Weather"]
    request_data = request.get_json()

    missing_fields = [field for field in required_fields if field not in request_data]
    if missing_fields:
        return jsonify({"error": f"Missing required fields: {missing_fields}"}), 400

    timestamp_unix, hour = process_timestamp(request_data["Timestamp"])
    if timestamp_unix is None:
        return jsonify({"error": "Invalid Timestamp format. Use YYYY-MM-DD HH:MM:SS"}), 400

    parking_lot_id = request_data["Parking_Lot_ID"]
    total_parking_slots = get_total_parking_slots(parking_lot_id)
    weather_encoded = encode_weather(request_data["Weather"])

    input_data = {
        **DEFAULT_VALUES_MODEL_1,
        **request_data,
        "Timestamp": timestamp_unix,
        "Hour": hour,
        "Total_Parking_Slots": total_parking_slots,
        **weather_encoded
    }
    del input_data["Weather"]

    input_df = pd.DataFrame([input_data])
    input_df = input_df.reindex(columns=MODEL_COLUMNS_OF_AVAILABLE_PREDICTIONS, fill_value=0)

    predictions = model.predict(input_df)

    response = {
        "Available_Car_Spots": round(predictions[0][0]),
        "Available_Van_Spots": round(predictions[0][1]),
        "Available_Truck_Spots": round(predictions[0][2]),
        "Available_Motorcycle_Spots": round(predictions[0][3])
    }

    return jsonify(response)

# ====================================================================================

# Columns for model 2 (Parking Rush Hour Prediction)
MODEL_COLUMNS_OF_RUSH_HOUR_PREDICTION = ["Parking_Lot_ID","Timestamp",  "Hour","Avg_Entry_15Min", "Avg_Exit_15Min", "Avg_Waiting_Time",
    "Weather_Rainy", "Weather_Snowy", "Weather_Sunny",
    
]


@app.route('/predict2', methods=['POST'])
def predict2():
    request_data = request.get_json()

    # If request_data is a list, take the first item
    if isinstance(request_data, list):
        request_data = request_data[0]

    required_fields = ["Timestamp", "Parking_Lot_ID", "Weather", "Avg_Entry_15Min", "Avg_Exit_15Min", "Avg_Waiting_Time"]

    # Check for missing fields
    missing_fields = [field for field in required_fields if field not in request_data]
    if missing_fields:
        return jsonify({"error": f"Missing required fields: {missing_fields}"}), 400

    # Process timestamp
    timestamp_unix, hour = process_timestamp(request_data["Timestamp"])
    if timestamp_unix is None:
        return jsonify({"error": "Invalid Timestamp format. Use YYYY-MM-DD HH:MM:SS"}), 400

    # Extract other required fields
    parking_lot_id = request_data["Parking_Lot_ID"]
    weather_encoded = encode_weather(request_data["Weather"])

    # Prepare input data for the model
    input_data = {
        "Parking_Lot_ID": parking_lot_id,
        "Timestamp": timestamp_unix,
        "Hour": hour,
        "Avg_Entry_15Min": request_data["Avg_Entry_15Min"],
        "Avg_Exit_15Min": request_data["Avg_Exit_15Min"],
        "Avg_Waiting_Time": request_data["Avg_Waiting_Time"],
        **weather_encoded
    }

    # Convert input to DataFrame
    input_df = pd.DataFrame([input_data])

    # Ensure the correct columns are used for prediction
    input_df = input_df.reindex(columns=MODEL_COLUMNS_OF_RUSH_HOUR_PREDICTION, fill_value=0)

    # Make prediction using model2
    predictions = model2.predict(input_df)

    # Convert predictions to a structured response
    response = {
       
        "Rush_Hour_Prediction": int(predictions[0])  # Ensure it's a standard JSON number (1 or 0)
    }

    return jsonify(response)




#=======================================================================================================================




def preprocess_input(timestamp, total_used_slots, total_booking_count, weather):
    # Extract hour, day of the week, and is_weekend
    dt = pd.to_datetime(timestamp)
    hour = dt.hour
    day_of_week = dt.weekday()
    is_weekend = 1 if day_of_week >= 5 else 0
    
    # Set weather conditions based on integer input
    weather_conditions = {0: 'Weather_Rainy', 1: 'Weather_Snowy', 2: 'Weather_Sunny'}
    weather_mapping = {'Weather_Rainy': 0, 'Weather_Snowy': 0, 'Weather_Sunny': 0}
    if weather in weather_conditions:
        weather_mapping[weather_conditions[weather]] = 1
    
    # Default values for other columns
    default_values = {
        'Total_Parking_Slots': 100,  # Assuming default total parking slots
        'Available_Car_Spots': 50,   # Example default values
        'Available_Van_Spots': 10,
        'Available_Truck_Spots': 5,
        'Available_Motorcycle_Spots': 20,
        'Avg_Entry_15Min': 5,
        'Avg_Exit_15Min': 4,
        'Avg_Waiting_Time': 2,
        'Car_Booking_Count': 0,
        'Van_Booking_Count': 0,
        'Truck_Booking_Count': 0,
        'Motorcycle_Booking_Count': 0,
        'Total_Booking_Count': total_booking_count,
        'Total_Available_Slots': 30,  # Example default available slots
        'Total_Used_Slots': total_used_slots,
        'Regular_Customer_Count': 0,
        'VIP_Customer_Count': 0,
        'Subscription_Customer_Count': 0,
        'OneTime_Customer_Count': 0,
        'Total_Customer_Type': 0,
        'Hour': hour,
        'DayOfWeek': day_of_week,
        'IsWeekend': is_weekend,
        'Weather_Rainy': weather_mapping['Weather_Rainy'],
        'Weather_Snowy': weather_mapping['Weather_Snowy'],
        'Weather_Sunny': weather_mapping['Weather_Sunny']
    }
    
    # Convert to list preserving column order
    feature_values = [default_values[col] for col in [
        'Total_Parking_Slots', 'Available_Car_Spots', 'Available_Van_Spots',
        'Available_Truck_Spots', 'Available_Motorcycle_Spots', 'Avg_Entry_15Min',
        'Avg_Exit_15Min', 'Avg_Waiting_Time', 'Car_Booking_Count', 'Van_Booking_Count',
        'Truck_Booking_Count', 'Motorcycle_Booking_Count', 'Total_Booking_Count',
        'Total_Available_Slots', 'Total_Used_Slots', 'Regular_Customer_Count',
        'VIP_Customer_Count', 'Subscription_Customer_Count', 'OneTime_Customer_Count',
        'Total_Customer_Type', 'Hour', 'DayOfWeek', 'IsWeekend', 'Weather_Rainy',
        'Weather_Snowy', 'Weather_Sunny'
    ]]
    
    return feature_values

@app.route('/predict3', methods=['POST'])
def predict3():
    data = request.json
    timestamp = data.get("timestamp")
    total_used_slots = data.get("total_used_slots")
    total_booking_count = data.get("total_booking_count")
    weather = data.get("weather")
    
    if timestamp is None or total_used_slots is None or total_booking_count is None or weather is None:
        return jsonify({"error": "Missing required parameters"}), 400
    
    try:
        weather = int(weather)
        if weather not in [0, 1, 2]:
            raise ValueError("Invalid weather value")
    except ValueError:
        return jsonify({"error": "Weather must be an integer (0: Rainy, 1: Snowy, 2: Sunny)"}), 400
    
    features = preprocess_input(timestamp, total_used_slots, total_booking_count, weather)
    input_df = pd.DataFrame([features])
    
    # Make prediction
    prediction = model3.predict(input_df)[0]
    return jsonify({"prediction": int(prediction)})





















if __name__ == '__main__':
    app.run(debug=True, port=5000)
