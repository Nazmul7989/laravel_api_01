// alert('ok');

let tBody = $('#tBody');
let form = $('#form');
let students = [];
let editStudent = null;
let targetTr = null;

$(document).ready(function (){
    //Getting data from database
    axios.get('http://127.0.0.1:8000/api/test')
        .then(res => {
            let data = res.data;
            students = data;
            // console.log(tests)
            students.forEach(studentData =>{
                tBody.html(tBody.html() + `<tr>${makeTrContent(studentData)}</tr>`)
            })
        })
        .catch(err => console.log(err));
});


form.on('submit', function (e){
    e.preventDefault();

    //Inserting data into database

    let image = $('#image')[0].files[0];
    let name = $('#name').val();
    let phone = $('#phone').val();
    let email = $('#email').val();

    let formData = new FormData();
    formData.append('image', image);
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', email);

    if (editStudent != null){

        axios.post('http://127.0.0.1:8000/api/test/'+editStudent.id, formData,{
            headers: {
                'Content-Type' : 'multipart/form-data'
            }
        })
            .then(res => {
                let {status,error,data} = res.data;

                if (status){
                    targetTr.innerHTML = makeTrContent(data);
                }else {
                    alert(error)
                }

                resetForm();
                $('#modalClose').click();
            })
            .catch(err => console.log(err))
    }else {

        axios.post('http://127.0.0.1:8000/api/test',formData,{
            headers:{
                'Content-Type' : 'multipart/form-data'
            }
        })
            .then(res => {
                console.log(res);
                let {data} = res;

                tBody.html(tBody.html() + `<tr>${makeTrContent(data)}</tr>`)
                students.push(data);

                resetForm();
                $('#modalClose').click();
            })
            .catch(err => console.log(err));
    }


})


const makeTrContent = student =>{
    return`
            <td>${student.id}</td>
            <td><img style="width: 70px; height: 45px;" src="${mainURL}/assets/images/${student.image}" alt=""></td>
            <td>${student.name}</td>
            <td>${student.phone}</td>
            <td>${student.email}</td>
            <td>
                <button type="submit" onclick="editData(this, ${student.id})" data-toggle="modal" data-target="#test" class="btn-sm btn-warning">Edit</button>
                <button type="submit" onclick="deleteData(this, ${student.id})" class="btn-sm btn-danger">Delete</button>
            </td>`
}


const deleteData = (elm, id) =>{

    axios.delete(`http://127.0.0.1:8000/api/test/${id}`)

        .then( res => {
            let {status, message} = res.data;
            if (status){
                elm.parentElement.parentElement.remove();
                students.filter( student => student.id != id);

            }else {
               alert(message)
            }

        })
        .catch(err => console.log(err));

}

const editData = (elm, id) =>{
    editStudent = students.find(s => s.id == id)
    // console.log(editStudent.name)
    targetTr = elm.parentElement.parentElement;

    $('#image')[0].files[editStudent.image];
    $('#name').val(editStudent.name);
    $('#phone').val(editStudent.phone);
    $('#email').val(editStudent.email)

    $('#submitBtn').html('Update');
    $('#formTitle').html('Edit Students');

}

const resetForm = () =>{
    editStudent = null;
    targetTr =null;

    $('#image')[0].files[0];
    $('#name').val('');
    $('#phone').val('');
    $('#email').val('')

    $('#submitBtn').html('Add');
    $('#formTitle').html('Add Students');

}
