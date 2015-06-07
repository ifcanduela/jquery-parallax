# jquery-parallax

An image tilt effect plugin for jQuery.

Based on http://tympanus.net/codrops/2015/05/28/image-tilt-effect/.

## Usage

$('.container').parallax(options);

## Options

`options` is an object with the following optional properties:

- `imageSelector`: Selector for the image, is searched within 
    the containers. Default is just `img`. It will only pick 
    the first element that matches the selector.
 
- `shadowCount`: Number of shadow clones of the image. Default is 4. 
    Higher numbers will affect performance.
 
- `shadowOpacity`: Opacity of the shadow clones, between 0 (invisible) 
    to 1 (fully opaque). Default is `1 / (shadowCount + 1)`.
 
- `clipShadows`: Apply `overflow: hidden` to the image container so the 
    shadows don't overflow. Default is `true`.
 
- `hideOnMouseLeave`: Hide the image clones when the cursor leaves 
    the container. Default is `true`.
 
- `maxRotationDegree`: Degree of rotation of the image. Default is 
    `10`. Positive values push down on the corner of the image closer to 
    the mouse pointer, while negative values lift the closest corner up.

- `translateMultiplier`: Amount of horizontal and vertical movement as the 
    mouse hovers over the image. Default is `-10`, which pushes the center 
    of the picture away from the mouse. Positive values pull the image 
    toward the mouse.

- `imageScale`: Ratio by which the image will be scaled. Default is `1.1`.

- `perspective`: Value of the `transform: perspective()` CSS property. Lower 
    values increase the effect. Default is `500`.

- `baseZetaIndex`: Value of the `z-index` CSS property to apply to the first 
    clone of the image. Successive clones will receive `z-index` values 
    increased by 1. Default is `100`.

- `transformOrigin`: Translate the origin of the effect towards the mouse 
    pointer. Default is `false`. Can produce a trippy effect.
