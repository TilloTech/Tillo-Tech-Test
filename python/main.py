from fastapi import FastAPI, HTTPException
import json
import uvicorn

app = FastAPI()

# Load order data
with open('./orders.json') as json_file:
    data = json.load(json_file)

@app.get("/api/orders")
def get_order_by_id(id):
    if not valid_order_id(id):
        raise HTTPException(status_code=400, detail=f"{id} is incorrectly formatted")

    # Find the order by ID
    order = next((order for order in data if order["id"] == id), None)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")

    return order


def valid_order_id(order_id: str) -> bool:
    try:
        int(order_id, 16)
        return True
    except ValueError:
        return False


def main():
    # Run the FastAPI app using uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")


if __name__ == "__main__":
    main()
