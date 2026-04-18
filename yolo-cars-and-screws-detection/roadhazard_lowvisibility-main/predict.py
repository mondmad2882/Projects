from ultralytics import YOLO

model = YOLO("runs/detect/road_hazard_v1/weights/best.pt")

source_path = r"D:\CODES\roadhazard_lowvisibility-main\roadhazard_lowvisibility-main\test_2.mp4"

results = model.predict(
    source=source_path, 
    save=True,          
    show=False,         
    conf=0.35, 
    device=0,           
    stream=True,        
    imgsz=640           
)

print("Processing video...")
for r in results:
    pass 

print("Done! You can find the output video in: runs/detect/predict/")
