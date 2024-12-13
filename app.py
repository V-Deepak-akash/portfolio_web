from flask import Flask, render_template, request, jsonify
import sqlite3
from datetime import datetime
import hashlib
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# Function to hash IP for privacy
def hash_ip(ip):
    return hashlib.sha256(ip.encode()).hexdigest()

# Initialize database
def init_db():
    conn = sqlite3.connect("reviews.db")
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_address TEXT UNIQUE,
            username TEXT,
            review TEXT,
            stars INTEGER,
            likes INTEGER DEFAULT 0,
            dislikes INTEGER DEFAULT 0,
            created_at TEXT,
            updated_at TEXT
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS views (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_address TEXT UNIQUE,
            visited_at TEXT
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS likes_dislikes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            review_id INTEGER NOT NULL,
            ip_address TEXT NOT NULL,
            action TEXT CHECK(action IN ('like', 'dislike')),
            UNIQUE(review_id, ip_address)
        );
    """)
    conn.commit()
    conn.close()

# Generate random username
def generate_username():
    adjectives = [
        "Agile", "Bold", "Brave", "Clever", "Fierce", "Gentle", "Mighty", "Steady", "Noble", "Strong",
        "Swift", "Wild", "Wise", "Smart", "Fearless", "Gracious", "Loyal", "Energetic", "Serene", "Majestic",
        "Lightning", "Vibrant", "Stealthy", "Powerful", "Silent", "Fearless", "Dashing", "Intelligent", "Radiant",
        "Mysterious", "Noble", "Steadfast", "Speedy", "Eternal", "Fierce", "Epic", "Invincible", "Resilient",
        "Warm", "Sharp", "Brilliant", "Flawless", "Unstoppable", "Loyal", "Sharp", "Agile", "Daring", "Tough",
        "Valiant", "Vicious"
    ]

    nouns = [
        "Panther", "Wolf", "Falcon", "Tiger", "Lion", "Hawk", "Shark", "Bear", "Gorilla", "Dolphin", "Rhino",
        "Leopard", "Owl", "Stallion", "Bison", "Cougar", "Fox", "Puma", "Raccoon", "Jaguar", "Crocodile",
        "Whale", "Elephant", "Dragon", "Cobra", "Alligator", "Vulture", "Seahorse", "Lizard", "Otter", "Coyote",
        "Falcon", "Eagle", "Raven", "Bison", "Lynx", "Zebra", "Chimpanzee", "Rhino", "Armadillo", "Bear",
        "Cheetah", "Wombat", "Hare", "Wildebeest", "Sloth", "Walrus", "Gazelle", "Mantis", "Tortoise"
    ]

    return f"{random.choice(adjectives)}{random.choice(nouns)}"

@app.route("/review", methods=["POST"])
def submit_review():
    ip = request.remote_addr
    hashed_ip = hash_ip(ip)
    data = request.json
    review = data.get("review")
    stars = data.get("stars")
    conn = sqlite3.connect("reviews.db")
    cur = conn.cursor()
    cur.execute("SELECT username FROM reviews WHERE ip_address = ?", (hashed_ip,))
    existing_review = cur.fetchone()

    if existing_review:
        return jsonify({"message": "You already reviewed. You can now only modify your comment.", "username": existing_review[0]}), 200

    username = generate_username()
    cur.execute(
        "INSERT INTO reviews (ip_address, username, review, stars, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        (hashed_ip, username, review, stars, datetime.now().isoformat(), datetime.now().isoformat())
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Review submitted successfully.", "username": username}), 201

@app.route("/modify", methods=["PUT"])
def modify_review():
    ip = request.remote_addr
    hashed_ip = hash_ip(ip)
    data = request.json
    review = data.get("review")
    stars = data.get("stars")
    conn = sqlite3.connect("reviews.db")
    cur = conn.cursor()
    cur.execute("UPDATE reviews SET review = ?, stars = ?, updated_at = ? WHERE ip_address = ?", (review, stars, datetime.now().isoformat(), hashed_ip))
    conn.commit()
    conn.close()
    return jsonify({"message": "Review modified successfully"})

@app.route("/reviews", methods=["GET"])
def get_reviews():
    ip = request.remote_addr
    hashed_ip = hash_ip(ip)
    conn = sqlite3.connect("reviews.db")
    cur = conn.cursor()
    cur.execute("""
        SELECT id, username, review, stars, likes, dislikes, created_at, updated_at, ip_address 
        FROM reviews
        ORDER BY CASE WHEN ip_address = ? THEN 1 ELSE 2 END, created_at DESC
    """, (hashed_ip,))
    reviews = cur.fetchall()
    conn.close()

    return jsonify([
        {
            "id": row[0],
            "username": row[1],
            "review": row[2],
            "stars": row[3],
            "likes": row[4],
            "dislikes": row[5],
            "created_at": row[6],
            "updated_at": row[7],
            "is_current_user": row[8] == hashed_ip
        }
        for row in reviews
    ])

@app.errorhandler(404)
def not_found_error(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.route("/like", methods=["POST"])
def like_review():
    ip = request.remote_addr
    hashed_ip = hash_ip(ip)
    data = request.json
    review_id = data.get("review_id")

    conn = sqlite3.connect("reviews.db")
    cur = conn.cursor()

    # Check if the user has already liked or disliked
    cur.execute("SELECT action FROM likes_dislikes WHERE review_id = ? AND ip_address = ?", (review_id, hashed_ip))
    record = cur.fetchone()

    if record and record[0] == "like":
        # If already liked, remove the like
        cur.execute("UPDATE reviews SET likes = likes - 1 WHERE id = ?", (review_id,))
        cur.execute("DELETE FROM likes_dislikes WHERE review_id = ? AND ip_address = ?", (review_id, hashed_ip))
        conn.commit()
        conn.close()
        return jsonify({"message": "Removed your like!"})

    elif record and record[0] == "dislike":
        # If disliked, switch to like
        cur.execute("UPDATE reviews SET dislikes = dislikes - 1 WHERE id = ?", (review_id,))
        cur.execute("UPDATE reviews SET likes = likes + 1 WHERE id = ?", (review_id,))
        cur.execute(
            "UPDATE likes_dislikes SET action = 'like' WHERE review_id = ? AND ip_address = ?",
            (review_id, hashed_ip),
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Switched to like!"})

    else:
        # Add a new like
        cur.execute("UPDATE reviews SET likes = likes + 1 WHERE id = ?", (review_id,))
        cur.execute(
            "INSERT INTO likes_dislikes (review_id, ip_address, action) VALUES (?, ?, 'like')",
            (review_id, hashed_ip),
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Liked successfully!"})

@app.route("/dislike", methods=["POST"])
def dislike_review():
    ip = request.remote_addr
    hashed_ip = hash_ip(ip)
    data = request.json
    review_id = data.get("review_id")

    conn = sqlite3.connect("reviews.db")
    cur = conn.cursor()

    # Check if the user has already liked or disliked
    cur.execute("SELECT action FROM likes_dislikes WHERE review_id = ? AND ip_address = ?", (review_id, hashed_ip))
    record = cur.fetchone()

    if record and record[0] == "dislike":
        # If already disliked, remove the dislike
        cur.execute("UPDATE reviews SET dislikes = dislikes - 1 WHERE id = ?", (review_id,))
        cur.execute("DELETE FROM likes_dislikes WHERE review_id = ? AND ip_address = ?", (review_id, hashed_ip))
        conn.commit()
        conn.close()
        return jsonify({"message": "Removed your dislike!"})

    elif record and record[0] == "like":
        # If liked, switch to dislike
        cur.execute("UPDATE reviews SET likes = likes - 1 WHERE id = ?", (review_id,))
        cur.execute("UPDATE reviews SET dislikes = dislikes + 1 WHERE id = ?", (review_id,))
        cur.execute(
            "UPDATE likes_dislikes SET action = 'dislike' WHERE review_id = ? AND ip_address = ?",
            (review_id, hashed_ip),
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Switched to dislike!"})

    else:
        # Add a new dislike
        cur.execute("UPDATE reviews SET dislikes = dislikes + 1 WHERE id = ?", (review_id,))
        cur.execute(
            "INSERT INTO likes_dislikes (review_id, ip_address, action) VALUES (?, ?, 'dislike')",
            (review_id, hashed_ip),
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Disliked successfully!"})

@app.route("/views", methods=["GET"])
def get_views():
    ip = request.remote_addr
    hashed_ip = hash_ip(ip)
    conn = sqlite3.connect("reviews.db")
    cur = conn.cursor()

    # Check if the IP has already been recorded recently (e.g., last 1 hour)
    cur.execute("SELECT visited_at FROM views WHERE ip_address = ?", (hashed_ip,))
    last_visit = cur.fetchone()
    current_time = datetime.now()

    if not last_visit :
        cur.execute("""
            INSERT OR REPLACE INTO views (ip_address, visited_at) VALUES (?, ?)
        """, (hashed_ip, current_time.isoformat()))

    cur.execute("SELECT COUNT(*) FROM views")
    views_count = cur.fetchone()[0]
    conn.commit()
    conn.close()
    return jsonify({"views": views_count})


if __name__ == "__main__":
    init_db()
    app.run(debug=False , host='0.0.0.0', port=5000)
