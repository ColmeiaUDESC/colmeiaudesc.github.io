function displayProjects(x) {
    switch (x) {
        case 0:
            toggleElement("hardware","flex");
            toggleElement("software","flex");
            toggleElement("video","flex");
            break;
        case 1:
            toggleElement("hardware","flex");
            toggleElement("software","none");
            toggleElement("video","none");
            break;
        case 2:
            toggleElement("hardware","none");
            toggleElement("software","flex");
            toggleElement("video","none");
            break;
        case 3:
            toggleElement("hardware","none");
            toggleElement("software","none");
            toggleElement("video","flex");
            break;            
    }
}

function toggleElement(className,dispplayState) {
    var cards = document.getElementsByClassName(className);
    for (let index = 0; index < cards.length; index++) {
        cards[index].style.display = dispplayState
    }
}
