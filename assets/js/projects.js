function displayProjects(x) {
    switch (x) {
        case 0:
            toggleElement("hardware","block");
            toggleElement("software","block");
            toggleElement("video","block");
            break;
        case 1:
            toggleElement("hardware","block");
            toggleElement("software","none");
            toggleElement("video","none");
            break;
        case 2:
            toggleElement("hardware","none");
            toggleElement("software","block");
            toggleElement("video","none");
            break;
        case 3:
            toggleElement("hardware","none");
            toggleElement("software","none");
            toggleElement("video","block");
            break;            
    }
}

function toggleElement(className,dispplayState) {
    var cards = document.getElementsByClassName(className);
    for (let index = 0; index < cards.length; index++) {
        cards[index].style.display = dispplayState
    }
}
