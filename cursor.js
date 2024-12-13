document.addEventListener("mousemove", function (e) {    var cursorDot = document.getElementById("cursor-dot");
    var cursorOutline = document.getElementById("cursor-dot-outline");

    // Get mouse position
    var mouseX = e.clientX;
    var mouseY = e.clientY;

    // Update the position of both cursor dot and outline
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";
    cursorOutline.style.left = mouseX + "px";
    cursorOutline.style.top = mouseY + "px";
});

document.querySelectorAll('a, button, .link').forEach((el) => {
    el.addEventListener('mouseenter', () => {
        // When hovering over interactive elements, scale the cursor to 1.1
        document.getElementById('cursor-dot').style.transform = 'translate(-50%, -50%) scale(1.1)';
        document.getElementById('cursor-dot-outline').style.transform = 'translate(-50%, -50%) scale(1.1)';
    });

    el.addEventListener('mouseleave', () => {
        // Reset cursor size back to normal when not hovering over interactive elements
        document.getElementById('cursor-dot').style.transform = 'translate(-50%, -50%) scale(1)';
        document.getElementById('cursor-dot-outline').style.transform = 'translate(-50%, -50%) scale(1)';
    });
});



// Prevent the pointer cursor in textboxes and show the text cursor instead
document.querySelectorAll('input[type="text"], textarea').forEach((el) => {
    el.addEventListener('mouseenter', () => {
        // Hide custom cursor when hovering over textboxes but show the text cursor (I-beam)
        document.getElementById('cursor-dot').style.display = 'none';
        document.getElementById('cursor-dot-outline').style.display = 'none';
        el.style.cursor = 'text'; // Show the default text cursor in textareas and inputs
    });

    el.addEventListener('mouseleave', () => {
        // Show custom cursor again when leaving the textbox area
        document.getElementById('cursor-dot').style.display = 'block';
        document.getElementById('cursor-dot-outline').style.display = 'block';
        el.style.cursor = 'none'; // Prevent pointer cursor inside textboxes
    });

    // Make sure the cursor is hidden during focus to avoid overlapping with the text cursor
    el.addEventListener('focus', () => {
        document.getElementById('cursor-dot').style.display = 'none';
        document.getElementById('cursor-dot-outline').style.display = 'none';
        el.style.cursor = 'text';
    });

    el.addEventListener('blur', () => {
        document.getElementById('cursor-dot').style.display = 'block';
        document.getElementById('cursor-dot-outline').style.display = 'block';
        el.style.cursor = 'none';
    });
});

// Inner dot disappearing in specific areas (like in text areas)
document.querySelectorAll('.hide-cursor-dot').forEach((el) => {
    el.addEventListener('mouseenter', () => {
        // Make the inner dot disappear in specific areas
        document.getElementById('cursor-dot').style.opacity = 0;
        document.getElementById('cursor-dot-outline').style.opacity = 1;
    });

    el.addEventListener('mouseleave', () => {
        // Restore the cursor dot opacity
        document.getElementById('cursor-dot').style.opacity = 1;
        document.getElementById('cursor-dot-outline').style.opacity = 0.5;
    });
});


document.querySelectorAll('.replace-with-default-cursor').forEach((el) => {
    el.addEventListener('mouseenter', () => {
        // Hide custom cursor
        const cursorDot = document.getElementById('cursor-dot');
        const cursorOutline = document.getElementById('cursor-dot-outline');
        if (cursorDot && cursorOutline) {
            cursorDot.style.display = 'none';
            cursorOutline.style.display = 'none';
        }
    });

    el.addEventListener('mouseleave', () => {
        // Show custom cursor
        const cursorDot = document.getElementById('cursor-dot');
        const cursorOutline = document.getElementById('cursor-dot-outline');
        if (cursorDot && cursorOutline) {
            cursorDot.style.display = 'block';
            cursorOutline.style.display = 'block';
        }
    });
});

document.querySelectorAll('input, textarea, [draggable="true"]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
        // Ensure the default cursor is visible for text and draggable fields
        const cursorDot = document.getElementById('cursor-dot');
        const cursorOutline = document.getElementById('cursor-dot-outline');
        if (cursorDot && cursorOutline) {
            cursorDot.style.display = 'none';
            cursorOutline.style.display = 'none';
        }
        el.style.cursor = 'auto'; // Let the browser decide the cursor
    });

    el.addEventListener('mouseleave', () => {
        // Restore custom cursor when leaving the field
        const cursorDot = document.getElementById('cursor-dot');
        const cursorOutline = document.getElementById('cursor-dot-outline');
        if (cursorDot && cursorOutline) {
            cursorDot.style.display = 'block';
            cursorOutline.style.display = 'block';
        }
    });
});


// Initially hide the custom cursor
document.addEventListener("DOMContentLoaded", () => {
    const cursorDot = document.getElementById("cursor-dot");
    const cursorOutline = document.getElementById("cursor-dot-outline");
    if (cursorDot && cursorOutline) {
        cursorDot.style.display = "none";
        cursorOutline.style.display = "none";
    }
});

// Function to hide custom cursor when the mouse leaves the window
document.addEventListener("mouseleave", () => {
    const cursorDot = document.getElementById("cursor-dot");
    const cursorOutline = document.getElementById("cursor-dot-outline");
    if (cursorDot && cursorOutline) {
        cursorDot.style.opacity = "0";
        cursorOutline.style.opacity = "0";
    }
});

// Show the custom cursor when the mouse enters the webpage for the first time
document.addEventListener("mouseenter", () => {
    const cursorDot = document.getElementById("cursor-dot");
    const cursorOutline = document.getElementById("cursor-dot-outline");
    if (cursorDot && cursorOutline) {
        cursorDot.style.display = "block";
        cursorOutline.style.display = "block";
        cursorDot.style.opacity = "1";
        cursorOutline.style.opacity = "0.5"; // Restore outline opacity
    }
});
