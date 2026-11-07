# Image prompts for the Basement Unlock hero

Use these in any image generator (ChatGPT images, Midjourney, Imagen, Firefly). The vector house in `assets/house-cutaway.svg` is a working stand-in. A real render will look better on the home screen and on stage.

Art direction: a calm night scene, one warm light source (the basement), cool moonlit everything else. Premium and quiet, not busy.

## 1. Hero: the cutaway house (main image)

```
Isometric cutaway diorama of a small suburban Utah house at night, Wasatch mountains silhouetted far behind under a clear starry sky and a soft moon. The house sits on a thick slab of earth that is sliced open at the front to reveal a cozy, fully furnished basement apartment glowing warm amber: a bed with teal blanket, a small kitchenette, a pendant lamp, a framed picture, a staircase up, a small egress window showing the dark blue night outside. The main floor windows glow warm and a person is silhouetted in one window. A gray sedan with its headlights on is parked on the driveway. Dark pine trees, a green road sign at the lot corner. Soil layers, roots and pebbles visible in the cut section. Soft volumetric light spilling from the basement onto the ground. Cinematic lighting, shallow depth of field on the background, miniature tilt-shift feel, premium 3D render, Blender Cycles look, matte materials, no text, no logos, no people besides the silhouette.
```

Settings: 16:10 or 3:2, 4K. Keep the camera at about 35 degrees, looking at the front-left face of the slab.

Negative (if the tool supports it): `text, watermark, extra floors, daylight, purple neon, cyberpunk, cartoon, messy clutter, deformed furniture, floating objects`

## 2. Variations to generate in the same session (keep the style consistent)

1. **Dark basement.** Same scene, but the basement is unlit and empty, with only a faint moonlit glow. This is the "before" for the home screen animation.
2. **Plan view.** Same lot seen from straight above: house footprint, driveway, car, city boundary as a dashed moon-blue line. Use it for the property screen.
3. **Window detail.** Close-up of a basement egress window well at night with a warm interior behind it. Use it for the photo coach screen.

## 3. How to use the result

1. Export the main image as WebP, 2400 px wide, under 400 KB.
2. Home screen: place it as a full-bleed image on the right of the hero, with a left-to-right dark gradient over it so the headline stays readable.
3. Result screen: keep the vector scene. It is the only version where the basement light changes with your answers.
4. Credit the generator in the repo README, as the hackathon rules ask you to cite what you build on.

## 4. Hackathon rule check

"Start from zero" means no code from before tonight. Generate the images after 5:30 PM, or after you confirm with the organizers that pre-made art is allowed.
