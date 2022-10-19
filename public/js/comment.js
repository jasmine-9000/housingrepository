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

function displayEditcommentForm(id){
    console.log("Comment ID: %s", id)
    const editCommentForm = document.getElementById("editComment" + id)
    console.log(editCommentForm);
    editCommentForm.classList.toggle('hidden');
    const commentTextForm = document.getElementById('commentTextForm' + id)
    console.log(commentTextForm.value.length)
    
    commentTextForm.setSelectionRange(commentTextForm.value.length, commentTextForm.value.length) // make user focus on end of comment.
    commentTextForm.focus()// make user focus
}
function editComment(e) {
    e.preventDefault()
    // console.log("hello");
    // console.log(e)
    const form = e.target;
    const formID = e.target.id
    const commentID = e.target.dataset.commentid// formID.substr('commentTextForm'.length, formID.length);
    // console.log("ID to be edited: %s", commentID)

    const newCommentText = e.target.querySelector('input[type=text]').value
    const commentSpanID = 'commentSpan' + commentID;
    // console.log(commentSpanID);
    const commentSpan = document.getElementById(commentSpanID)
    // console.log(newCommentText)
    // console.log(commentSpan)
    commentSpan.innerText = newCommentText;
    form.classList.toggle('hidden');              
}
function showLength(id) {
    const commentTextForm = document.getElementById('commentTextForm' + id)

    // console.log(commentTextForm.value.length)
}
