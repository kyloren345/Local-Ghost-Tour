document.addEventListener("DOMContentLoaded", function () {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const group1 = document.querySelectorAll(".group-1");
    const group2 = document.querySelectorAll(".group-2");
    const textBox = document.querySelector(".text-box");
    const wheelOptions = { passive: false };
    let currentFeatureIndex = 0;
    let isRevealing = false;
    let phase = 1; // 1: Showing Group 1, 2: Switching to Group 2, 3: Showing Group 2, 4: Normal Scroll
    
    document.body.style.overflow = 'hidden';

    function showFeatures(group, index) {
        if (index < group.length) {
            group[index].classList.add("show");
        }
    }

    function hideFeatures(group, index) {
        if (index >= 0) {
            group[index].classList.remove("show");
        }
    }

    function onWheel(event) {
        if (isRevealing) return;
        isRevealing = true;
        event.preventDefault();

        if (event.deltaY > 0) { // Scroll Down
            if (phase === 1) { 
                if (currentFeatureIndex < group1.length) {
                    showFeatures(group1, currentFeatureIndex);
                    currentFeatureIndex++;
                    if (currentFeatureIndex === 1) {
                        textBox.style.display = "none";
                    }
                } else {
                    phase = 2;
                    currentFeatureIndex = 0;
                    group1.forEach(f => f.classList.remove("show"));
                    showFeatures(group2, currentFeatureIndex);
                    phase = 3;
                }
            } else if (phase === 3) {
                if (currentFeatureIndex < group2.length) {
                    showFeatures(group2, currentFeatureIndex);
                    currentFeatureIndex++;
                } else {
                    phase = 4;
                    document.body.style.overflow = '';
                    window.removeEventListener("wheel", onWheel, wheelOptions);
                }
            }
        } else { // Scroll Up
            if (phase === 3) {
                if (currentFeatureIndex > 0) {
                    currentFeatureIndex--;
                    hideFeatures(group2, currentFeatureIndex);
                } else {
                    phase = 2;
                    group2.forEach(f => f.classList.remove("show"));
                    group1.forEach(f => f.classList.add("show"));
                    textBox.style.display = "block";
                    phase = 1;
                    currentFeatureIndex = group1.length;
                }
            } else if (phase === 1) {
                if (currentFeatureIndex > 0) {
                    currentFeatureIndex--;
                    hideFeatures(group1, currentFeatureIndex);
                } else {
                    phase = 1;
                    document.body.style.overflow = 'hidden';
                    window.addEventListener("wheel", onWheel, wheelOptions);
                }
            }
        }

        setTimeout(() => {
            isRevealing = false;
        }, 200);
    }

    window.addEventListener("wheel", onWheel, wheelOptions);
});