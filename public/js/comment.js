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
const DEBUG = false;
function editComment(e) {
    e.preventDefault()
    
    // extract form data 
    const form = e.target;
    const commentID = e.target.dataset.commentid
    const newCommentText = e.target.querySelector('input[type=text]').value
    const commentSpanID = 'commentSpan' + commentID;
    const commentSpan = document.getElementById(commentSpanID)
    if(commentSpan)
    
    if(DEBUG) {
        console.log("hello");
        console.log("Event: ")
        console.log(e)
        console.log("ID to be edited: %s", commentID)
        console.log("Comment Span ID: ")
        console.log(commentSpanID);
        console.log("New Comment Text: ")
        console.log(newCommentText)
        console.log("Comment Span Element: ")
        console.log(commentSpan)
    }
    if(newCommentText === '' || newCommentText === null) {
        generateToast({message: 'Comment cannot be blank', type: 'error'})
        return;
    }

    const URL = `/comment/edit/${commentID}`
    fetch(URL, {
        headers: {
            'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'PUT',
        body: JSON.stringify({newtext: newCommentText})
    }).then(response => response.json())
    .then(data => {
        if(data.status === "SUCCESS") {
            // modify on front end
            commentSpan.innerText = newCommentText;
            form.classList.toggle('hidden');     
            
            generateToast({message: 'Successfully updated comment.', type: 'success'})
        } else {
            throw data
        }
    })
    .catch(err => {
        console.log(err);
        generateToast({message: 'Error updating comment. Check browser console for details.', type: 'error'})
    })
             
}
function showLength(id) {
    const commentTextForm = document.getElementById('commentTextForm' + id)

    console.log(commentTextForm.value.length)
}
