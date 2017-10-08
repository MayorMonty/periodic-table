window.addEventListener("load", function() {
    var elements = document.getElementsByClassName("element");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function(e) {
            var number = this.dataset.element
            e.stopPropagation(); // Stop event propagation so body listener doesn't trigger
            if(window.table) {
                makeDialog(number)
            } else {

            }
        });
    }
    window.dialog = document.querySelector(".element-dialog");
    window.atomicName   = document.querySelectorAll(".element-data-name")
    window.atomic = document.querySelectorAll(".element-data-atomic");
    window.mass   = document.querySelectorAll(".element-data-mass");
    window.iso    = document.querySelectorAll(".element-data-iso");
    window.electrons = document.querySelectorAll(".element-data-electronconfig");
    window.atomicradius = document.querySelectorAll(".element-data-atomicradius");
    window.ionization = document.querySelectorAll(".element-data-ionization");
    window.affinity = document.querySelectorAll(".element-data-affinity");
    window.electronegativity = document.querySelectorAll(".element-data-electronegativity");
});


function makeDialog(number) {
    try {
        var data = window.table[number - 1];
        substitute(atomic, data.number);
        substitute(mass, data.atomic_weight.split("(")[0]);
        substitute(iso, data.iso);
        substitute(electrons, data.electron_configuration);
        substitute(atomicName, data.name);
        substitute(atomicradius, data.atomic_radius);
        substitute(ionization, data.ionization_energies);
        substitute(affinity, data.electron_affinity);
        substitute(electronegativity, data.electronegativity);

        var isotopes = access(data, "iso");
        var table = `<table class="responsive-table bordered">
            <thead><tr>
            <td>Isotope</td>
            <td>Abundance</td>
            <td>Half Life</td>
            <td>Decay Energy (MeV)</td>
            <td>Decay Product</td>
            </tr></thead>
            <tbody>
            ${isotopes.map( 
                a => 
                    `<tr>
                        <td>${a.isotope}</td>
                        <td>${a.abundance}</td>
                        <td>${a.halfLife}</td>
                        <td>${a.decayEnergy}</td>
                        <td>${a.decayProduct}</td>
                    </tr>` 
            ).join(" ")
            }
            </tbody>
        </table>`
        
        document.querySelector(".isotope-table").innerHTML = table;
        

    } catch(e) {
        console.log(e);
    }

    dialog.classList.toggle("active");
}

function splitEvery(n, list) {
    var result = [];
    var idx = 0;
    while (idx < list.length) {
      result.push(list.slice(idx, idx += n));
    }
    return result;
}

function access(data, prop) {
    return data && data[prop] ? data[prop] : "No Data"
}

function substitute(nodelist, value) {
    if (!nodelist instanceof NodeList) nodelist = [nodelist];
    nodelist.forEach(function(element) {
        element.innerText = value;
    }, this);
}


fetch("data/elements.json")
    .then( r => r.json() )
    .then( table => window.table = table ) // This is bad, I know
    .then( a => console.log("Loaded") )