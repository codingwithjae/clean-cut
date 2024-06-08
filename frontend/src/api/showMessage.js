export function showMessage(message, type = "success") {
  // Configure Toastify options
  const options = {
    text: message,
    duration: 3000,
    destination: "https://github.com/apvarun/toastify-js",
    newWindow: true,
    close: true,
    gravity: "bottom", // Can be 'top' or 'bottom'
    position: "center", // Can be 'left', 'center', or 'right'
    stopOnFocus: true, // Prevent dismissing of toast on hover
    style: {
      // Set background color based on type
      background:
        type === "success"
          ? "linear-gradient(to right, #00b09b, #96c93d)"
          : "red",
    },
    onClick: function () {}, // Callback after click
  };

  // Show the toast
  Toastify(options).showToast();
}
