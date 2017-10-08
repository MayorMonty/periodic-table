var elements = require("./data/elements");
var fs = require("fs");



function access(element, prop) {
    if (element[prop]) {
        return element[prop]
    } else {
        return "";
    }
}

function parseIsotopes(iso, symbol) {
    var list = isolateIsotopes(iso.split(/[,\n]/), symbol);
    return Array(list.length - 1).fill({}).map( (a,i,v) => ({
        "isotope": list[i+1][0] || "No Data",
        "abundance": list[i+1][1] || "No Data",
        "halfLife": 
            ~(v=~(list[i+1][2] || "No Data").indexOf("stable") ? "stable" : list[i+1][2] || "").indexOf("�") ? `${v.split("�")[0]} x 10<sup>${v.split(/(10)| /g)[2]}</sup> y` :  v,
        "decayEnergy": (e=list[i+1][4] || "No Data") === "�" ? "No Data" : e,
        "decayProduct": list[i+1][5 || "No Data"] === "�" ? "No Data" : list[i+1][5 || "No Data"]
    }))
}

function isolateIsotopes(iso, symbol) {
    var indicies = [0, ...iso.filter((v, i, a) => new RegExp(`[0-9]+${symbol}`).test(v) && !~v.indexOf("is stable")).map( v => iso.indexOf(v) )];
    return indicies.map( (v, i, a) => 
        iso.slice(v, a[i + 1])
    )
}

for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    element.covalent_radius = (element.covalent_radius || "").split(/[^0-9]/g).filter( a => +a !== NaN )[0]
    
}

fs.writeFile("data/elements.json", JSON.stringify(elements, null, "\t"), () => console.log("Done"));