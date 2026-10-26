# Builds the 1200x630 link-preview card: her photo on the right, the hero title on the left.
import os
from PIL import Image, ImageDraw, ImageFont
W, H = 1200, 630
BG = (11, 16, 22)
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public') + '/'
card = Image.new('RGB', (W, H), BG)

photo = Image.open(P + 'images/gaze/center.jpg').convert('RGB')
pw = 780
ph = int(photo.height * pw / photo.width)
photo = photo.resize((pw, ph), Image.LANCZOS)
top = int(0.28 * ph - 0.28 * H)
card.paste(photo.crop((0, top, pw, top + H)), (W - pw, 0))

# Fade the photo into the dark background on the left and along the bottom.
shade = Image.new('RGBA', (W, H))
d = ImageDraw.Draw(shade)
for x in range(W):
    a = 255 if x < W - pw else int(255 * max(0.0, 1 - (x - (W - pw)) / 420) ** 1.6)
    d.line([(x, 0), (x, H)], fill=BG + (a,))
card = Image.alpha_composite(card.convert('RGBA'), shade)
# The bottom fade goes on as its own layer, so the two fades stack instead of overwriting.
bottom = Image.new('RGBA', (W, H))
d = ImageDraw.Draw(bottom)
for y in range(H - 200, H):
    d.line([(0, y), (W, y)], fill=BG + (int(255 * ((y - (H - 200)) / 200) ** 1.4),))
card = Image.alpha_composite(card, bottom)

F = '/System/Library/Fonts/Supplemental/'
draw = ImageDraw.Draw(card)
draw.text((70, 120), 'life original', font=ImageFont.truetype(F + 'Futura.ttc', 34, index=2), fill=(242, 244, 247))
draw.arc((70, 150, 250, 185), 20, 160, fill=(242, 244, 247), width=3)
draw.text((66, 180), "I'M YOUR", font=ImageFont.truetype(F + 'Impact.ttf', 132), fill=(242, 244, 247))

# "Next Hire" in pink script, tilted like the hero.
script = Image.new('RGBA', (620, 200))
ImageDraw.Draw(script).text((10, 10), 'Next Hire', font=ImageFont.truetype(F + 'Brush Script.ttf', 150), fill=(255, 95, 162))
script = script.rotate(4, resample=Image.BICUBIC, expand=True)
card.alpha_composite(script, (60, 286))

draw = ImageDraw.Draw(card)
draw.text((72, 520), 'Akshita Dhariwal  ·  Marketing Automation Manager', font=ImageFont.truetype(F + 'Futura.ttc', 27), fill=(170, 180, 191))
card.convert('RGB').save(P + 'og-image.jpg', quality=88, optimize=True)
print('ok')
