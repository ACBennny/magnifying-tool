/*********************************************************************
 * Functionslities of the "Magnifying tool"
 * 
 * @author (Anyanwu Benedict Chuwkwuemeka)
 * @version 0.01
*********************************************************************/


(function () 
{
    const img = document.querySelector(".img-src");
    const lens = document.querySelector(".img-lens");
    const imgBox = document.querySelector(".img-box");
    const imgBcg = document.querySelector(".img-bcg");

    // Zoom factor (x2)
    const zoom = 2;

    // Wait for image to load to get natural size
    function init_magnifying_tool()
    {
        const naturalW = img.naturalWidth;
        const naturalH = img.naturalHeight;

        // Set background image & background-size to show zoomed area on lens
        lens.style.backgroundImage = `url("${img.src}")`;
        lens.style.backgroundSize = `${naturalW * zoom}px ${naturalH * zoom}px`;

        // pointer handling
        function moveLens(clientX, clientY)
        {
            
            // Get mouse/touch coords relative to image
            const rect = img.getBoundingClientRect();
            let x = clientX - rect.left;
            let y = clientY - rect.top;

            // clamp to image bounds
            x = Math.max(0, Math.min(rect.width, x));
            y = Math.max(0, Math.min(rect.height, y));

            // Display lens
            lens.style.display = "block";
            lens.style.left = `${x}px`;
            lens.style.top = `${y}px`;

            // position lens (center at pointer)
            const percentX = x / rect.width;
            const percentY = y / rect.height;
            const lensRect = lens.getBoundingClientRect();

            // Compute background-position for the lens
            const imgX = percentX * naturalW * zoom;
            const imgY = percentY * naturalH * zoom;

            // lens size in px
            const lensW = lensRect.width;
            const lensH = lensRect.height;

            const bgPosX = (imgX - lensW / 2) * -1;
            const bgPosY = (imgY - lensH / 2) * -1;
            lens.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
        }

        // Center image to allow zooming
        imgBcg.addEventListener("click", (e) => 
        {
            if((e.target.closest(".img-box"))) return;

            if(imgBcg.classList.contains("fixed")) 
            {
                imgBcg.classList.replace("fixed", "active");

                setTimeout(() => 
                {
                    imgBcg.classList.remove("active", "rough");
                    imgBcg.style.removeProperty("--offset-top");
                    imgBcg.style.removeProperty("--offset-left");
                    imgBcg.style.removeProperty("--pos-top");
                    imgBcg.style.removeProperty("--pos-left");
                }, 10);
            }
            else
            {
                const rect = imgBcg.getBoundingClientRect();

                imgBcg.style.setProperty("--offset-left", `${rect.left}px`);
                imgBcg.style.setProperty("--offset-top", `${rect.top}px`);

                imgBcg.classList.add("active");

                imgBcg.addEventListener("transitionend", function hndlTrntEnd()
                {
                    imgBcg.removeEventListener("transitionend", hndlTrntEnd);
                    imgBcg.classList.replace("active", "fixed");
                    imgBcg.classList.add("rough");
                });
            }
        });

        // Handle Mouse pointers
        imgBox.addEventListener("mouseenter", () => lens.style.display = "block");
        imgBox.addEventListener("mousemove", (e) => moveLens(e.clientX, e.clientY));
        imgBox.addEventListener("mouseleave", () => 
        {
            lens.style.display = "none";
            lens.style.left = "50%";
            lens.style.top = "50%";
        });

        // Handle touch devices
        imgBox.addEventListener("touchstart", (e) => 
        {
            e.preventDefault();
            const t = e.touches[0];
            moveLens(t.clientX, t.clientY);
        }, { passive: false });

        imgBox.addEventListener("touchmove", (e) => 
        {
            e.preventDefault();
            const t = e.touches[0];
            moveLens(t.clientX, t.clientY);
        }, { passive: false });

        imgBox.addEventListener("touchend", () => 
        {
            lens.style.display = "none";
            lens.style.left = "50%";
            lens.style.top = "50%";
        });
    }

    // Initialize when image has fully loaded
    if(img.complete)
    {
        init_magnifying_tool();
    }
    else
    {
        img.addEventListener("load", init_magnifying_tool);
    }

})();
