// code in standby, is complexity make what i wanted;
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
        const topContainer = $container.getBoundingClientRect().top;
        let canHover = true;
        // $container.addEventListener("click", (event) => {

        // })       
        $container.addEventListener("click", (event) => {
            const lampshadeHead = $lampshadeHead.getBoundingClientRect();
            const areaAfterLampX = lampshadeHead.left + $lampshadeHead.offsetWidth;
             if (event.clientX > areaAfterLampX && canHover) {
                // canHover = false
                const angle = getAngleDegressElement($lampshadeHead);
                console.log(angle, $lampshadeHead.style.transform)
                const translates = getTranslateXYInRem($lampshadeHead);
                $lampshadeBodyTop.style.animation = 'none';
                $lampshadeBodyMiddle.style.animation = 'none';
                $lampshadeBodyBottom.style.animation = 'none';
                $lampshadeHead.style.animation = "none";
                const angleFinal = getAngleFromCursorRelativeElement(event, $lampshadeHead);
                const transformInMoment = "rotate(" + angle + "deg)"// translate(" + translates.translateX + "rem," + translates.translateY + "rem)"
                $lampshadeHead.style.transform = transformInMoment;
                animateHead($lampshadeHead, angle, angleFinal, 500, () => {
                    // $lampshadeHead.style.transform = transformInMoment;
                    $lampshadeHead.style.animation = animeHead;
                    $lampshadeBodyTop.style.animation = animeBodyTop;
                    $lampshadeBodyMiddle.style.animation = animeBodyMiddle;
                    $lampshadeBodyBottom.style.animation = animeBodyBottom;
                    canHover = true

                });
            }
        });
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
        console.log(fontSizeComputed)
        const fontSizeConverted = parseFloat(fontSizeComputed);
        const matrix = new DOMMatrixReadOnly(transformComputed);

        return {
            translateX: matrix.m41 / fontSizeConverted,
            translateY: matrix.m42 / fontSizeConverted
        }
    }

    function getAngleFromCursorRelativeElement(event, $element) {
        console.log($element.clientWidth, $element.clientHeight)
        const x = event.clientX - $element.getBoundingClientRect().left// - $element.clientWidth/2
        const y = event.clientY - $element.getBoundingClientRect().top - $element.clientHeight/2
        const angle = Math.atan2(y,x) * 180 / Math.PI;
        return angle;
    }

    function animateHead(
        $element,
        initialRotation = 0,
        endDegress = 360,
        duration = 500,
        onFinish,
    ) {
        let currentDegress = initialRotation;
        let start = performance.now();
        let shouldReverse = false
        function animateRotation(timestamp) {
            const now = performance.now();
            const delta = Math.min((now - start) / duration, 1);
            currentDegress = (delta * (endDegress - initialRotation)) + initialRotation;
            if (shouldReverse) {
                currentDegress = endDegress - (currentDegress - initialRotation);
            }

//            const restTransform = $element.style.transform.split(') ')[1]
            $element.style.transform = "rotate(" + currentDegress + "deg) "// + restTransform;
            if (delta >= 1 || delta <= 0) {
                onFinish();
                return;
                if (shouldReverse) {
                    return;
                }
                start = performance.now();
                shouldReverse = true;
            }
            requestAnimationFrame(animateRotation);
        }

        return requestAnimationFrame(animateRotation);
    }
})()
