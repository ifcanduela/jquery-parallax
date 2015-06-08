/*!
 * jQuery Parallax
 *
 * http://github.com/ifcanduela/jquery-parallax
 *
 * Add a tilt/parallax effect to an image.
 * Based on http://tympanus.net/codrops/2015/05/28/image-tilt-effect/.
 *
 * $('.container').parallax(options);
 *
 * options is an object with the following optional properties:
 *
 * - imageSelector: Selector for the image, is searched within the containers.
 *     Default is 'img'. It will only pick the first element that matches the selector.
 *
 * - shadowCount: Number of shadow clones of the image. Default is 4. Higher
 *     numbers will affect performance.
 *
 * - shadowOpacity: Opacity of the shadow clones, between 0 (invisible) to 1
 *     (fully opaque). Default is 1 / (shadowCount + 1).
 *
 * - clipShadows: Apply 'overflow: hidden' to the image container so the shadows
 *     don't overflow. Default is true.
 *
 * - hideOnMouseLeave: Hide the image clones when the cursor leaves the container.
 *     Default is true.
 *
 * - hideOriginalImage: Hide the original image after creating the clones. Default
 *     is true. Does not have a big impact on anything.
 *
 * - maxRotationDegree: Degree of rotation of the image. Default is 10. Positive
 *     values push down on the corner of the image closer to the mouse pointer, while
 *     negative values lift the closest corner up.
 *
 * - translateMultiplier: Amount of horizontal and vertical movement as the mouse
 *     hovers over the image. Default is -10, which pushes the center of the
 *     picture away from the mouse. Positive values pull the image toward the
 *     mouse.
 *
 * - imageScale: Ratio by which the image will be scaled. Default is 1.1.
 *
 * - perspective: Value of the 'transform: perspective()' CSS property. Lower values
 *     increase the effect. Default is 500.
 *
 * - baseZetaIndex: Value of the z-index CSS property to apply to the first clone of the image.
 *     Successive clones will receive z-index values incresed by 1. Default is 100.
 *
 *  - transformOrigin: Translate the origin of the effect towards the mouse pointer.
 *      Default is false. Can produce a trippy effect.
 *
 */
 (function ($) {
     $.fn.parallax = function (options) {
        options = typeof options !== 'object' ? {} : options;

        // default settings
        var defaults = {
            imageSelector: 'img',
            shadowCount: 4,
            clipShadows: true,
            hideOnMouseLeave: true,
            hideOriginalImage: false,
            maxRotationDegree: 10,
            translateMultiplier: -10,
            imageScale: 1.1,
            perspective: 500,
            baseZetaIndex: 20,
            transformOrigin: false,
        };

        // merge user settings
        var settings = $.extend(defaults, options);

        // shadow opacity is calculated
        if (typeof settings.shadowOpacity === 'undefined') {
            var shadowCount = settings.shadowCount + (settings.hideOriginalImage ? 0 : 1);
            settings.shadowOpacity = Math.round(100 / shadowCount) / 100;
        }

        // apply the effect to all selected
        return this.each(function() {
            var $parallax = $(this),
                $base = $parallax.children(settings.imageSelector).eq(0),
                $shadow;

            if ($base.length === 0) {
                return this;
            }

            // container styling
            $parallax.css({
                'position': 'relative',
                'overflow': settings.clipShadows ? 'hidden' : '',
            });

            // image styling
            $base.css('transform', 'scale(' + settings.imageScale + ')');

            if (settings.hideOriginalImage) {
                $base.css('opacity', 0);
            }

            // create the clones
            for (var i = 1; i <= settings.shadowCount; i++) {
                $shadow = $base.clone();

                // basic attributes
                $shadow.addClass('parallax-shadow').data('layer', i);

                // styling
                $shadow.css({
                    'opacity': settings.shadowOpacity,
                    'z-index': settings.baseZetaIndex + i,
                    'position': 'absolute',
                    'top': '0',
                    'left': '0',
                    'transform': 'perspective(' + settings.perspective + 'px) translate3d(0px, 0px, 0px) rotate3d(0, 0, 0, ' + settings.maxRotationDegree + 'deg) scale(' + settings.imageScale + ')',
                    'display': settings.hideOnMouseLeave ? 'none' : 'block'
                });

                $shadow.appendTo($parallax);
            }

            $parallax.hover(function (e) {
                if (settings.hideOnMouseLeave) {
                    $parallax.find('.parallax-shadow').show();
                }
            }, function (e) {
                if (settings.hideOnMouseLeave) {
                    $parallax.find('.parallax-shadow').hide();
                }
            });

            $parallax.on('mousemove', function (e) {
                // x and y coordinates of the top-left corner of the container
                var min_x = $(this).offset().left;
                var min_y = $(this).offset().top;
                // width and height of the container
                var w = $parallax.width();
                var h = $parallax.height();
                // current x and y coordinates of the mouse cursor
                var x_pos = e.pageX - min_x;
                var y_pos = e.pageY - min_y;

                // amount of rotation proportional to the distance of the cursor
                // to the center of the container
                // rotation on the Y axis depends on the horizontal position of the cursor
                var rotate_y = 2 * (x_pos / w - 0.5);
                // rotation on the X axis depends on the vertical position of the cursor
                var rotate_x = -2 * (y_pos / h - 0.5);

                // the hypothenuse of the triangle created bu the cursor and the
                // center of the container
                var multiplier = Math.sqrt(rotate_y * rotate_y + rotate_x * rotate_x);

                // image panning
                var tr_x = rotate_y * settings.translateMultiplier;
                var tr_y = -rotate_x * settings.translateMultiplier;

                var percent, tr_o_x, tr_o_y, transform, degrees, partial_rotate_x, partial_rotate_y;

                // transform the shadows
                $parallax.find('.parallax-shadow').each(function (i) {
                    percent = i / settings.shadowCount;
                    partial_rotate_x = rotate_x * percent;
                    partial_rotate_y = rotate_y * percent;
                    degrees = Math.round(multiplier * settings.maxRotationDegree * percent);

                    move_x = tr_x * percent;
                    move_y = tr_y * percent;

                    // moving the origin of coordinates produces some ugly effects
                    if (settings.transformOrigin === true) {
                        tr_o_x = x_pos;
                        tr_o_y = y_pos;
                        $(this).css('transform-origin', tr_o_x + 'px ' + tr_o_y + 'px');
                    }

                    transform = 'perspective(' + settings.perspective + 'px) translate3d(' + move_x + 'px, ' + move_y + 'px, ' + i + 'px) rotate3d(' + partial_rotate_x + ', ' + partial_rotate_y + ', 0, ' + degrees + 'deg) scale(' + settings.imageScale + ')';

                    $(this).css('transform', transform);
                });
            });
        });
    };
} (jQuery));
