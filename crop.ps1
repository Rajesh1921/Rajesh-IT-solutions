Add-Type -AssemblyName System.Drawing
$src = "C:\Users\Rajesh\.gemini\antigravity\brain\0c07dd04-ae06-464e-8035-d3dc20003c7f\rajesh_logo_five_1773992690447.png"
$dst = "C:\Users\Rajesh\.gemini\antigravity\scratch\Rajesh-IT-solutions\logo.png"

try {
    $img = [System.Drawing.Image]::FromFile($src)
    # Original is 1024x1024. Crop aggressively to perfectly frame the text.
    $rect = New-Object System.Drawing.Rectangle(60, 400, 900, 240)
    $bmp = New-Object System.Drawing.Bitmap(900, 240)
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)
    $gfx.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $bmp.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $gfx.Dispose()
    $bmp.Dispose()
    $img.Dispose()
    Write-Host "Cropped successfully to $dst"
} catch {
    Write-Host "Error cropping: $_"
}
