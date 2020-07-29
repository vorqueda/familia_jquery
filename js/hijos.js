// lee el padre
db.collection("employees").doc(params['num']).get()
    .then(function(doc) {
        //        console.log(doc.data().name);
        $(document).ready(function() {
            $("p").text(doc.data().name);
        });
    });
//
// lee los hijos
db.collection('employees').doc(params['num']).collection('hijos')
    .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            const doc = change.doc;
            if (change.type === 'added') {
                listFamilia(doc.data(), doc.id);
            } else if (change.type === 'removed') {
                deleteFamilia(doc.id);
                //                location.reload();
            } else if (change.type === 'modified') {
                deleteFamilia(doc.id);
                listFamilia(doc.data(), doc.id);
            }
        });
    });
const deleteFamilia = id => {
    const familias = document.querySelectorAll('li');
    familias.forEach(familia => {
        if (familia.getAttribute('data-id') === id) {
            familia.remove();
        }
    });
};
// muestra datos en pantalla
const list = document.querySelector('ul');
const listFamilia = (familia, id) => {
    let html = `
    <li data-id="${id}">
    <div>${familia.name} -
    <a href="#" id="${id}" class="edit js-edit-hijo">
        <i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
    <a href="#" id="${id}" class="edit js-delete-hijo">
        <i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
    </div>
</li>
`;
    list.innerHTML += html;
};
//
// alta
$("#add-hijo-form").submit(function(event) {
    event.preventDefault();
    db.collection('employees').doc(params['num']).collection('hijos').add({
            name: $('#add-hijo-form #hijo-name').val(),
            email: $('#add-hijo-form #hijo-email').val(),
            address: $('#add-hijo-form #hijo-address').val(),
            phone: $('#add-hijo-form  #hijo-phone').val()
        })
        .then(() => console.log('hijo grabado'))
        .catch((err) => console.log(err));
    $('#addHijoModal').modal('hide');
});
// apaga modal
$("#addHijoModal").on('hidden.bs.modal', function() {
    $('#add-hijo-form.form-control').val('');
});
// 
// EDIT/UPDATE MODAL
// muestra datos modal
$(document).on('click', '.js-edit-hijo', function() {
    let id = $(this).attr('id');
    $('#edit-hijo-form').attr('edit-id', id);

    db.collection('employees').doc(params['num']).collection('hijos').doc(id).get().then(function(document) {
            if (document.exists) {
                $('#edit-hijo-form #hijo-name').val(document.data().name);
                $('#edit-hijo-form #hijo-email').val(document.data().email);
                $('#edit-hijo-form #hijo-address').val(document.data().address);
                $('#edit-hijo-form #hijo-phone').val(document.data().phone);
                $('#editHijoModal').modal('show');
            } else {
                console.log("No such document!");
            }
        })
        .catch(function(error) {
            console.log("Error getting document:", error);
        });
});
// update hijo
$("#edit-hijo-form").submit(function(event) {
    event.preventDefault();
    let id = $(this).attr('edit-id');
    db.collection('employees').doc(params['num']).collection('hijos').doc(id).update({
            name: $('#edit-hijo-form #hijo-name').val(),
            email: $('#edit-hijo-form #hijo-email').val(),
            address: $('#edit-hijo-form #hijo-address').val(),
            phone: $('#edit-hijo-form  #hijo-phone').val()
        })
        .then(() => console.log("Hijo Modificado!"))
        .catch((err) => console.log(err));
    $('#editHijoModal').modal('hide');
});
// apaga modal
$("#editHijoModal").on('hidden.bs.modal', function() {
    $('#edit-hijo-form .form-control').val('');
});
//
// borra
// muestra datos
$(document).on('click', '.js-delete-hijo', function() {
    let id = $(this).attr('id');
    db.collection('employees').doc(params['num']).collection('hijos').doc(id).get()
        .then(function(document) {
            if (document.exists) {
                $('#delete-hijo-form #employee-did').val(id);
                $('#delete-hijo-form #employee-name').val(document.data().name);
                $('#delete-hijo-form #employee-email').val(document.data().email);
                $('#delete-hijo-form #employee-address').val(document.data().address);
                $('#delete-hijo-form #employee-phone').val(document.data().phone);
                $('#deleteHijoModal').modal('show');
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
});

//
//borra datos
$("#delete-hijo-form").submit(function(event) {
    event.preventDefault();
    let id = $('#delete-hijo-form #hijo-did').val()
    db.collection('employees').doc(params['num']).collection('hijos').doc(id).delete()
        .then(() => console.log('hijo borrado'))
        .catch((err) => console.log(err));
    $('#deleteHijoModal').modal('hide');
});
// apaga modal
$("#deleteHijoModal").on('hidden.bs.modal', function() {
    $('#delete-hijo-form .form-control').val('');
});