from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io

app = FastAPI()

# Allow React app to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev you can allow everything
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLO model once
model = YOLO(r"C:\Users\Dell\Desktop\Project1\Backennd\yolov8n.pt")  # or path to your custom model

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    results = model(image)
    
    detections = []
    for box, cls, score in zip(results[0].boxes.xyxy, results[0].boxes.cls, results[0].boxes.conf):
        detections.append({
            "x1": float(box[0]),
            "y1": float(box[1]),
            "x2": float(box[2]),
            "y2": float(box[3]),
            "score": float(score),
            "label": model.names[int(cls)]
        })
    
    return {
        "detections": detections,
        "width": results[0].orig_shape[1],
        "height": results[0].orig_shape[0]
    }