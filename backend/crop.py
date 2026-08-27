import sys
import subprocess

try:
    from PIL import Image
    import numpy as np
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow", "numpy"])
    from PIL import Image
    import numpy as np

img_path = r"C:\Users\Rajesh\.gemini\antigravity\brain\0c07dd04-ae06-464e-8035-d3dc20003c7f\rajesh_logo_five_1773992690447.png"
img = Image.open(img_path).convert("RGB")
data = np.array(img)

r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
brightness = np.maximum(np.maximum(r, g), b)

y_indices, x_indices = np.where(brightness > 45)

if len(y_indices) > 0 and len(x_indices) > 0:
    y_min, y_max = y_indices.min(), y_indices.max()
    x_min, x_max = x_indices.min(), x_indices.max()
    
    pad = 10
    y_min = max(0, y_min - pad)
    y_max = min(img.height, y_max + pad)
    x_min = max(0, x_min - pad)
    x_max = min(img.width, x_max + pad)
    
    cropped = img.crop((x_min, y_min, x_max, y_max))
    cropped.save("logo.png")
    print("Cropped successfully to logo.png")
else:
    print("Could not find logo bounding box.")
