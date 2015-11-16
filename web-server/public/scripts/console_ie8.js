var alertFallback = true;
if (typeof console === "undefined" || typeof console.log === "undefined") {
   console = {};
   if (alertFallback) {
       console.log = function(msg) {
            alert(msg);
       };
   } else {
       console.log = function() {};
   }
}