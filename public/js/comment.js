function readmore(e) {
    /*console.log(e) */
    let elipsis = e.previousElementSibling
    let restofcomment = e.nextElementSibling;
    /*
    console.log(elipsis)
    console.log(restofcomment)
    */
    elipsis.classList.toggle('hidden');
    e.classList.toggle('hidden')
    restofcomment.classList.toggle('hidden');

}