document.addEventListener("DOMContentLoaded", function() {
    const dots = document.querySelectorAll(".dots .dot");
    let previewImg = null; // Variable to keep track of the current preview

  
    dots.forEach(function(dot, index) {
      dot.addEventListener("click", function() {
        // Remove active class from all dots
        dots.forEach(function(dot) {
          dot.classList.remove("active");
        });
  
        // Add active class to the clicked dot
        this.classList.add("active");
  
        // Change background image of the header to the selected image
        const selectedImageIndex = index + 1; // Assumes the image file names are sequential like "image1.jpg", "image2.jpg", etc.
        const selectedImageSrc = `img/cog${selectedImageIndex}.png`; // Update the image source path accordingly
        document.getElementById("bg_img").style.backgroundImage = `url(${selectedImageSrc})`;
        document.getElementById("footer").style.backgroundImage = `url(${selectedImageSrc})`;
      });

      dot.addEventListener("mouseenter", function() {
        // Increase the size of the dot when hovered
        this.style.transform = "scale(1.2)";
  
        if (!previewImg) {
          // Create and append the image preview popup
          previewImg = document.createElement("img");

          const selectedImageIndex = index + 1; // Assumes the image file names are sequential like "image1.jpg", "image2.jpg", etc.
          const previewImageSrc = `img/cog${selectedImageIndex}.png`; // Update the image source path accordingly
          previewImg.src = previewImageSrc;
          previewImg.classList.add("preview-image");
          previewImg.style.opacity = 0; // Set initial opacity to 0 for fade-in effect
    
          const dotRect = dot.getBoundingClientRect();
          const popupTop = window.pageYOffset + dotRect.top - previewImg.offsetHeight - 210;
          const popupLeft = window.pageXOffset + dotRect.left + dotRect.width / 2 - previewImg.offsetWidth / 2 - 100;
          previewImg.style.top = `${popupTop}px`;
          previewImg.style.left = `${popupLeft}px`;
    
          document.body.appendChild(previewImg);

          // Trigger the fade-in effect
          setTimeout(function() {
            previewImg.style.opacity = 1;
          }, 10);
        }
      });

      dot.addEventListener("mouseleave", function() {
        // Reset the size of the dot when the mouse leaves
        this.style.transform = "scale(1)";
  
        // Find and fade out the image preview popup
        if (previewImg) {
          // Trigger the fade-out effect
          previewImg.style.opacity = 0;
  
          // Remove the image preview popup after fade-out
          setTimeout(function() {
            previewImg.parentNode.removeChild(previewImg);
            previewImg = null; // Reset the previewImg variable
          }, 300); // Adjust the fade-out duration as needed
        }
      });
    });
  });
 
  
  
  
  
  
  
  