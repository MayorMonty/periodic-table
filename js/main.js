window.addEventListener("load", function() {
    var elements = document.getElementsByClassName("element");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function(e) {
            var number = this.classList.item(4).split("-")[1];
            e.stopPropagation(); // Stop event propagation so body listener doesn't trigger
            if(window.table) {
                makeDialog(number)
            } else {
                window.onTableLoad = makeDialog.bind(this, number);
            }
        });
    }
});

var dialog = document.querySelector(".element-dialog")
function makeDialog(number) {
    dialog.classList.toggle("active");
}

document.body.addEventListener("click", function() {
    dialog.classList.remove("active");
});


fetch("data/elements.json")
    .then( r => r.json() )
    .then( table => window.table = table ) // This is bad, I know
    .then( a => window.onTableLoad ? window.onTableLoad() : null );