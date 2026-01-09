from flask import Flask, request, render_template, redirect, url_for, session, jsonify, Response
from flask_session import Session
from flask_cors import CORS
import os
import numpy as np
import pickle
import jwt  # Make sure to install this with: pip install PyJWT

app = Flask(__name__)
app.secret_key = "your-secret-key"  # Must match Node.js JWT secret

app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_FILE_DIR'] = os.path.join(os.getcwd(), "flask_session")

CORS(app, supports_credentials=True, origins=["http://127.0.0.1:3000"])

Session(app)

model = pickle.load(open('farm.pkl', 'rb'))
sc = pickle.load(open('standscaler.pkl', 'rb'))
ms = pickle.load(open('minmaxscaler.pkl', 'rb'))

@app.route('/')
def home():
    if 'user' not in session:
        session['user'] = 'test_user'
    
    if 'user' in session:
        return redirect(url_for('index'))
    return "Please log in first. <a href='http://127.0.0.1:3000/'>Login Here</a>"


@app.route('/index')
def index():
    if 'user' not in session:
        return redirect(url_for('home'))
    return render_template("index.html", username=session.get('user'))

@app.route("/predict", methods=['POST'])
def predict():
    if 'user' not in session:
        return redirect(url_for('home'))

    N = request.form['Nitrogen']
    P = request.form['Phosporus']
    K = request.form['Potassium']
    temperature = request.form['Temperature']
    humidity = request.form['Humidity']
    ph = request.form['Ph']
    rainfall = request.form['Rainfall']

    feature_list = [int(N), int(P), int(K), int(temperature), int(humidity), int(ph), int(rainfall)]
    single_pred = np.array(feature_list).reshape(1, -1)

    scaled_features = ms.transform(single_pred)
    final_features = sc.transform(scaled_features)
    prediction = model.predict(final_features)

    crop_dict = {
        0: 'apple', 1: 'bajra', 2: 'banana', 3: 'barley', 4: 'blackgram', 5: 'cabbage', 6: 'chickpea',
        7: 'coconut', 8: 'coffee', 9: 'corn', 10: 'cotton', 11: 'grapes', 12: 'greengram', 13: 'jowar',
        14: 'jute', 15: 'kidneybeans', 16: 'ladyfinger', 17: 'lentil', 18: 'maize', 19: 'mango',
        20: 'mothbeans', 21: 'mungbean', 22: 'muskmelon', 23: 'onion', 24: 'orange', 25: 'papaya',
        26: 'pigeonpeas', 27: 'pomegranate', 28: 'potato', 29: 'ragi', 30: 'rice', 31: 'soybeans',
        32: 'sugarcane', 33: 'tur', 34: 'turmeric', 35: 'wheat', 36: 'watermelon'
    }

    result = crop_dict.get(prediction[0], "Sorry, we could not determine the best crop.").capitalize()

    return render_template('index.html', result=result, username=session['user'])
@app.route("/stepper")
def stepper():
    if 'user' not in session:
        return redirect(url_for('home'))

    # Get predicted crop from query parameter or session
    crop = request.args.get('crop', None)
    
    return render_template("index.html", crop=crop)

@app.route('/set_session', methods=['POST'])
def set_session():
    print("📥 Set session request received")
    print("🔍 Request headers:", request.headers)
    print("📦 Request data (raw):", request.get_data())

    try:
        data = request.get_json(force=True)  # ✅ force parsing JSON
    except Exception as e:
        print("❌ JSON parsing failed:", e)
        return jsonify({"error": "Invalid JSON"}), 400

    print("🧾 Parsed data:", data)

    if data and 'username' in data:
        session.clear()
        session['user'] = data['username']
        session.modified = True
        print("✅ Flask session after setting:", session)
        return jsonify({"message": "Session set successfully", "session": session['user']}), 200

    print("❌ Invalid data received in /set_session")
    return jsonify({"error": "Invalid data"}), 400
@app.route('/update_step', methods=['POST'])
def update_step():
    if 'user' not in session:
        return jsonify({"status": "error", "message": "Not logged in"}), 403
    
    user_id = session['user_id']
    crop = request.form['crop']
    step = int(request.form['step'])

    # Upsert logic
    cur.execute("""
        INSERT INTO users (id, crop_name, current_step)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE current_step = %s
    """, (id, crop, step, step))
    conn.commit()

    return jsonify({"status": "success"})

@app.route('/get_progress', methods=['GET'])
def get_progress():
    id = session['id']
    crop = request.args.get('crop')

    cur.execute("SELECT current_step FROM users WHERE id=%s AND crop_name=%s", (id, crop))
    result = cur.fetchone()
    if result:
        return jsonify({"step": result[0]})
    else:
        return jsonify({"step": 1})  # default to step 1

@app.route('/check_session')
def check_session():
    return jsonify({
        "session_exists": 'user' in session,
        "session_data": session.get('user', None),
        "session_id": id(session)
    })

@app.route('/logout')
def logout():
    session.pop('user', None)
    return Response(status=302, headers={"Location": "http://127.0.0.1:3000/"})

if __name__ == "__main__":
    app.run(debug=True)
