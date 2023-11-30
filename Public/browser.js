
document.addEventListener("click",function(e){

    //update
    if(e.target.classList.contains("btn-warning")){
        e.preventDefault();
        let res = prompt("Enter New Value: ");
        console.log(res);

        axios.post('/update-item',{text:res,id:e.target.getAttribute("data-id")}).then(function(){
            e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = res;   
        }).catch(function(){
            console.log("error, try again!");
        })
    }

    //delete
    if(e.target.classList.contains("btn-danger")){
        e.preventDefault();
        confirm("Do you really want to Delete it");

        axios.post('/delete-item',{id:e.target.getAttribute("data-id")}).then(function(){
            e.target.parentElement.parentElement.remove();
        }).catch(function(){
            console.log("error, try again!");
        })
    }
})