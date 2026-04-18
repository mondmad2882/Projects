from ultralytics import YOLO

if __name__ == "__main__":
    # yolo26
    model = YOLO("yolo26n.pt")

    # training
    model.train(
        #data="data.yaml"
        data=r"D:\CODES\roadhazard_lowvisibility-main\roadhazard_lowvisibility-main\data.yaml",
        epochs=50,            
        imgsz=640,             # Standard resolution
        batch=-1,              
        device=0,              
        workers=0,             
        name="road_hazard_v1", 
        exist_ok=True,         
        plots=True             
    )