// lee padres
db.collection('employees')
.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        const doc = change.doc;
        if (change.type === 'added') {
            listFamilia(doc.data(), doc.id);
        } else if (change.type === 'removed') {
			deleteFamilia(doc.id);
 //location.reload();
        } else if (change.type === 'modified') {
            deleteFamilia(doc.id);
            listFamilia(doc.data(), doc.id);
        }
    });
});
//
const deleteFamilia = id => {
    const familias = document.querySelectorAll('li');
    familias.forEach(familia => {
        if (familia.getAttribute('data-id') === id) {
            familia.remove();
        }
    });
};
// lista por pantalla
const list = document.querySelector('ul');
const listFamilia = (familia, id) => {
    let html = `
        <li data-id="${id}">
            ${familia.name} - 
            <a href="#" id="${id}" class="edit js-edit-employee">
                <i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
            <a href="#" id="${id}" class="edit js-delete-employee">
                <i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
            <a href="hijos.html?num=${id}" class="edit js-edit-employee">
                <i class="material-icons" data-toggle="tooltip" title="Edit">&#xE87C;</i>
			
        </li>
    `;
    list.innerHTML += html;
};
//
// alta
$("#add-employee-form").submit(function(event) {
    event.preventDefault();
    db.collection('employees').add({
            name: $('#add-employee-form #employee-name').val(),
            email: $('#add-employee-form #employee-email').val(),
            address: $('#add-employee-form #employee-address').val(),
            phone: $('#add-employee-form  #employee-phone').val()
        })
        .then(() => console.log('padre grabado'))
        .catch((err) => console.log(err));
    $('#addEmployeeModal').modal('hide');
});
// apaga modal
$("#addEmployeeModal").on('hidden.bs.modal', function() {
    $('#edit-employee-form.form-control').val('');
});
// EDIT/UPDATE MODAL
// muestra datos
$(document).on('click', '.js-edit-employee', function() {
    let id = $(this).attr('id');
    $('#edit-employee-form').attr('edit-id', id);
    db.collection('employees').doc(id).get().then(function(document) {
            if (document.exists) {
                $('#edit-employee-form #employee-name').val(document.data().name);
                $('#edit-employee-form #employee-email').val(document.data().email);
                $('#edit-employee-form #employee-address').val(document.data().address);
                $('#edit-employee-form #employee-phone').val(document.data().phone);
                $('#editEmployeeModal').modal('show');
            } else {
                console.log("No such document!");
            }
        })
        .catch(function(error) {
            console.log("Error getting document:", error);
        });
});
// graba modificacion
$("#edit-employee-form").submit(function(event) {
    event.preventDefault();
    let id = $(this).attr('edit-id');
    db.collection('employees').doc(id).update({
            name: $('#edit-employee-form #employee-name').val(),
            email: $('#edit-employee-form #employee-email').val(),
            address: $('#edit-employee-form #employee-address').val(),
            phone: $('#edit-employee-form  #employee-phone').val()
        })
        .then(() => console.log('padre modificado'))
        .catch((err) => console.log(err));
    $('#editEmployeeModal').modal('hide');
});
// apaga modal
$("#editEmployeeModal").on('hidden.bs.modal', function() {
    $('#edit-employee-form .form-control').val('');
});
// borra
// muestra datos
$(document).on('click', '.js-delete-employee', function() {
    let id = $(this).attr('id');
    console.log("manda ", id);
    db.collection('employees').doc(id).get().then(function(document) {
        if (document.exists) {
            $('#delete-employee-form #employee-did').val(id);
            $('#delete-employee-form #employee-name').val(document.data().name);
            $('#delete-employee-form #employee-email').val(document.data().email);
            $('#delete-employee-form #employee-address').val(document.data().address);
            $('#delete-employee-form #employee-phone').val(document.data().phone);
            $('#deleteEmployeeModal').modal('show');
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
});
//borra datos
$("#delete-employee-form").submit(function(event) {
    event.preventDefault();
    let id = $('#delete-employee-form #employee-did').val()
    console.log("borado 1", id);
    db.collection('employees').doc(id).delete()
        .then(() => console.log('padre borrado'))
        .catch((err) => console.log(err));
    $('#deleteEmployeeModal').modal('hide');
    //    setTimeout(function() { location.reload() }, 1000);
});
// apaga modal
$("#deleteEmployeeModal").on('hidden.bs.modal', function() {
    $('#delete-employee-form .form-control').val('');
});