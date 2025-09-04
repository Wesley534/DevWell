from fastapi import APIRouter, HTTPException, Request, status
from dotenv import load_dotenv
import requests
import os
import hmac
import hashlib
import json
from pathlib import Path

# Load .env file from the backend directory
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

router = APIRouter(prefix="/api/payments", tags=["payments"])

PAYSTACK_SECRET_KEY = os.getenv("PAYSTACK_SECRET_KEY")
PAYSTACK_API_URL = "https://api.paystack.co"

if not PAYSTACK_SECRET_KEY:
    raise ValueError("PAYSTACK_SECRET_KEY environment variable is not set")

@router.post("/initialize")
async def initialize_payment(payment_data: dict):
    email = payment_data.get("email")
    amount = payment_data.get("amount")  # Amount in cents (subunit for KES)

    if not email or not amount:
        raise HTTPException(status_code=400, detail="Email and amount are required")
    
    if amount < 100:  # Minimum 1 KES (100 cents)
        raise HTTPException(status_code=400, detail="Amount must be at least 1 KES")

    headers = {
        "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "email": email,
        "amount": amount,
        "currency": "KES",
        "callback_url": "https://your-live-website.com/callback",  # Replace with your actual live callback URL
        "metadata": {
            "custom_fields": [
                {
                    "display_name": "Buy Me a Coffee",
                    "variable_name": "buy_coffee",
                    "value": "Donation",
                }
            ]
        },
        "channels": ["mobile_money"]  # Specify M-Pesa as the payment channel
    }

    try:
        response = requests.post(f"{PAYSTACK_API_URL}/transaction/initialize", headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        if not data.get("status"):
            raise HTTPException(status_code=500, detail=data.get("message", "Failed to initialize transaction"))
        return {"access_code": data["data"]["access_code"]}
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/verify/{reference}")
async def verify_payment(reference: str):
    headers = {
        "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
    }

    try:
        response = requests.get(f"{PAYSTACK_API_URL}/transaction/verify/{reference}", headers=headers)
        response.raise_for_status()
        data = response.json()
        if not data.get("status"):
            raise HTTPException(status_code=500, detail=data.get("message", "Verification failed"))
        return data["data"]
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def payment_webhook(request: Request):
    payload = await request.body()
    signature = request.headers.get("x-paystack-signature")

    if not signature:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Signature missing")

    # Verify signature
    computed_signature = hmac.new(
        PAYSTACK_SECRET_KEY.encode(),
        payload,
        hashlib.sha512
    ).hexdigest()

    if signature != computed_signature:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid signature")

    event = json.loads(payload)

    # Handle the event (e.g., charge.success)
    if event["event"] == "charge.success":
        # Process successful payment, e.g., update database
        print("Payment successful:", event["data"])

    return {"status": "success"}