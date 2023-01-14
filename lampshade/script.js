(() => {
    window.onload = () => {
        const animeBodyTop = 'body-top 4s ease-in-out 0s infinite alternate'
        const animeBodyMiddle = 'body-middle 4s ease-in-out 0s infinite alternate'
        const animeBodyBottom = 'body-bottom 4s ease-in-out 0s infinite alternate'
        const animeHead = 'head 4s ease-in-out 0s infinite alternate'
        const $container = document.querySelector(".container");
        const $lampshadeHead = document.querySelector(".lampshade__head");
        const $lampshadeBodyTop = document.querySelector(".lampshade__body-top")
        const $lampshadeBodyMiddle = document.querySelector(".lampshade__body-middle")
        const $lampshadeBodyBottom = document.querySelector(".lampshade__body-bottom")

        $container.addEventListener("click", async (event) => {
            if (canMoveHead(event)) {
                effectClicks(event)
                freezeAnimation($lampshadeBodyTop);
                freezeAnimation($lampshadeBodyMiddle);
                freezeAnimation($lampshadeBodyBottom);
                await animeHeadToCursor(event);
                playAnimation($lampshadeBodyTop, animeBodyTop)
                playAnimation($lampshadeBodyMiddle, animeBodyMiddle)
                playAnimation($lampshadeBodyBottom, animeBodyBottom)
            }
        });

        function canMoveHead(event) {
            const lampshadeHead = $lampshadeHead.getBoundingClientRect();
            const areaAfterLampX = lampshadeHead.left + $lampshadeHead.offsetWidth;
            return event.clientX > areaAfterLampX;
        }

        function effectClicks(event) {
            const { clientX, clientY } = event;
            const borderColor = '#E86464';
            const $element = document.createElement('span');
            $element.style.position = 'fixed';
            $element.style.top = `${clientY}px`;
            $element.style.left = `${clientX}px`;
            $element.style.zIndex = `9999`;
            $element.style.borderRadius = '50%';
            $element.style.transform = 'translate(-50%,-50%)';

            document.body.appendChild($element);
            $element.animate([
                {
                    width: '0px',
                    height: '0px',
                },
                {
                    width: '.5rem',
                    height: '.5rem',
                    border: '.25rem solid ' + borderColor,
                    filter: 'opacity(.2)',
                }
            ], {
                duration: 500
            });
        }

        function animeHeadToCursor(event) {
            return new Promise((resolve) => {
                const angleFinal = getAngleFromCursorRelativeElement(event, $lampshadeHead);
                $lampshadeHead.style.transform = getCurrentStrTransformFromElement($lampshadeHead);
                $lampshadeHead.style.animation = 'none';
                const translatesHead = getTranslateXYInRem($lampshadeHead)
                const animationLampshadeHeadMoveToCursor = $lampshadeHead.animate([
                    {
                        transform: getTransform({ x: translatesHead.translateX, y: translatesHead.translateY, rotate: angleFinal }),
                    }
                ], {
                    duration: 250,
                    iterations: 1,
                    fill: 'forwards'
                })
                animationLampshadeHeadMoveToCursor.onfinish = () => {
                    animationLampshadeHeadMoveToCursor.commitStyles();
                    animationLampshadeHeadMoveToCursor.cancel();
                    $lampshadeHead.style.animation = animeHead;
                    resolve()
                }
            })
        }

        function freezeAnimation($element) {
            const angleBodyTop = getAngleDegressElement($element);
            const translatesBodyTop = getTranslateXYInRem($element);
            const transformBodyTopInMoment = `translate(${translatesBodyTop.translateX}rem,${translatesBodyTop.translateY}rem) rotate(${angleBodyTop}deg)`
            $element.style.transform = transformBodyTopInMoment;
            $element.style.animation = 'none';
        }

        function playAnimation($element, strAnimation) {
            $element.style.animation = strAnimation;
        }
    };

    function getAngleDegressElement($element) {
        const computedStyles = getComputedStyle($element, null);
        const transformMatrix = computedStyles.getPropertyValue("transform");
        const values = transformMatrix.split("(")[1].split(")")[0].split(",");
        const numberToCalcRotation = values[1];
        const angles = Math.round(Math.asin(numberToCalcRotation) * (180 / Math.PI));
        return angles;
    }

    function getTranslateXYInRem($element) {
        const computedStyles = getComputedStyle($element);
        const transformComputed = computedStyles.getPropertyValue("transform");
        const fontSizeComputed = computedStyles.getPropertyValue("font-size");
        const fontSizeConverted = parseFloat(fontSizeComputed);
        const matrix = new DOMMatrixReadOnly(transformComputed);

        return {
            translateX: matrix.m41 / fontSizeConverted,
            translateY: matrix.m42 / fontSizeConverted
        }
    }

    function getTransform({ x, y, rotate }) {
        return `translate(${x}rem,${y}rem) rotate(${rotate}deg)`;
    }

    function getAngleFromCursorRelativeElement(event, $element) {
        const x = event.clientX - $element.getBoundingClientRect().left// - $element.clientWidth/2
        const y = event.clientY - $element.getBoundingClientRect().top - $element.clientHeight / 2
        const angle = Math.atan2(y, x) * 180 / Math.PI;
        return angle;
    }

    function getCurrentStrTransformFromElement($element) {
        const translates = getTranslateXYInRem($element)
        const angleCurrent = getAngleDegressElement($element);
        return getTransform({
            x: translates.translateX,
            y: translates.translateY,
            rotate: angleCurrent
        });
    }
})()

// Animation using requestAnimationFrame
//$lampshadeHead.style.animationPlayState =  'running';

// animationLampshadeHeadReset.onfinish = () => {
//     animationLampshadeHeadReset.finish();
//     resolve();

//     $lampshadeHead.style.transform = getCurrentStrTransformFromElement($lampshadeHead);

//     const translatesHead2 = getTranslateXYInRem($lampshadeHead)
//     const animationLampshadeHeadMoveToCursor = $lampshadeHead.animate([{ transform: getTransform({ x: translatesHead2.translateX, y: translatesHead2.translateY, rotate: angleFinal }) }], {
//         duration: 500,
//         iterations: 1,
//         fill: 'forwards'
//     })

//     animationLampshadeHeadMoveToCursor.onfinish = () => {
//         animationLampshadeHeadMoveToCursor.finish();
//         $lampshadeHead.style.transform = getCurrentStrTransformFromElement($lampshadeHead);
//         $lampshadeHead.style.animation = animeHead
//     }
// }

// await toPromise(animationLampshadeHeadReset.onfinish)


// $lampshadeHead.style.animation = animeResetHead;
// setTimeout(() => {
// $lampshadeHead.style.animation = 'none';
// animateHead($lampshadeHead, angleHead2, angleFinal, 500, () => {
//     // $lampshadeHead.style.animation = animeHead;
//     // $lampshadeBodyTop.style.animation = animeBodyTop;
//     // $lampshadeBodyMiddle.style.animation = animeBodyMiddle;
//     // $lampshadeBodyBottom.style.animation = animeBodyBottom;
//     // $lampshadeHead.style.transform = 'none';
//     canHover = true
// });
//}, 1000)

//  function animateHead(
// $element,
//     initialRotation = 0,
//     endDegress = 360,
//     duration = 500,
//     onFinish,
//     ) {
//     let currentDegress = initialRotation;
//     let start = performance.now();
//     let shouldReverse = false
//     function animateRotation(timestamp) {
//         const now = performance.now();
//         const delta = Math.min((now - start) / duration, 1);
//         currentDegress = (delta * (endDegress - initialRotation)) + initialRotation;
//         if (shouldReverse) {
//             currentDegress = endDegress - (currentDegress - initialRotation);
//         }
//         const restTransform = $element.style.transform.split(' r')[0]
//         $element.style.transform = `${restTransform} rotate(${currentDegress}deg)`;

//         if (delta >= 1 || delta <= 0) {
//             // onFinish();
//             // return;
//             if (shouldReverse) {
//                 onFinish();
//                 return;
//             }
//             start = performance.now();
//             shouldReverse = true;
//             // setTimeout(() => {
//             //     start = performance.now();
//             //     shouldReverse = true;
//             //     requestAnimationFrame(animateRotation)
//             // }, duration * 2)
//             // return
//         }
//         requestAnimationFrame(animateRotation);
//     }

//     return requestAnimationFrame(animateRotation);
// }