if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log("sw")
    }, function(err) {
      // fail silently
      console.error(err);
    });
  });
}