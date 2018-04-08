$('.date').datepicker({
	format: "yyyy-mm-dd",
	todayBtn: true,
	clearBtn: true,
	language: "es",
	orientation: "bottom auto",
	autoclose: true,
	todayHighlight: true
});
"use strict";
toastr.options = {
	"closeButton": true,
	"newestOnTop": true,
	"positionClass": "toast-top-right",
	"showDuration": "300",
	"hideDuration": "1000",
	"timeOut": "5000",
	"extendedTimeOut": "1000",
	"showEasing": "swing",
	"hideEasing": "linear",
	"showMethod": "fadeIn",
	"hideMethod": "fadeOut"
}
$.ajaxSetup({
	headers: {
		'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
	},
	beforeSend: function (xhr) {
		xhr.setRequestHeader('Authorization');
	},
});
let translateTable = {
	sProcessing: 'Procesando...',
	sLengthMenu: 'Mostrar _MENU_ registros',
	sZeroRecords: 'No se encontraron resultados',
	sEmptyTable: 'Ningún dato disponible en esta tabla',
	sInfo: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
	sInfoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
	sInfoFiltered: '(filtrado de un total de _MAX_ registros)',
	sInfoPostFix: '',
	sSearch: 'Buscar:',
	sUrl: '',
	sInfoThousands: ',',
	sLoadingRecords: 'Cargando...',
	oPaginate: {
		sFirst: 'Primero',
		sLast: 'Último',
		sNext: 'Siguiente',
		sPrevious: 'Anterior'
	},
	oAria: {
		sSortAscending: ': Activar para ordenar la columna de manera ascendente',
		sSortDescending: ': Activar para ordenar la columna de manera descendente'
	}
};
let messages = {
	'name': 'Nombres del usuario.',
	'last_name': 'Apellidos del usuario.',
	'phone': 'Telefono de contacto.',
	'email': 'Correo electronico.',
	'num_id': 'Documento de identidad.',
	'country_id': 'Pais de origen.',
	'city': 'Ciudad de origen.',
	'address': 'Direccion principal del usuario.',
	'address_two': 'Direccion secundaria del usuario.',
	'role_id': 'Rol del usuario.',
	'avatar': 'Imagen Personal.',
	'state_id': 'Estado o Departamento.',
	'password2': 'Nueva contraseña.',
	'password2_confirmation': 'Repita nueva contraseña.',
};
let path = $('meta[name=url]')[0].content;
$('.notifications-menu').click(function () {
	let total = $('#notifications_total').text();
	if (total != 0) {
		$.post(path + 'notifications-view', function (response) {
			$('#notifications_total').html('0');
		});
	}
})
$.ajax({
	url: path + 'notifications',
	type: 'POST',
	dataType: 'json',
})
.done(function(response) {
	$('ul#notifications').html(response.html)
	$('#notifications_total').html(response.notifications_total)
	$('li#notification').click(function () {
		let consolidated = $(this).attr('consolidated');
		$('button#deleteConsolidated, button#viewConsolidated, button#editConsolidated, button#extendConsolidated')
		.attr('consolidated', consolidated);
		let url = path + 'consolidados/' + consolidated;
		$.get(url, function (response) {
			let modal = $('div#modal-send-show');
			modal.find('.modal-title').html('<span class="fa fa-cube"></span> Consolidado n° ' + response.number + '.');
			modal.find('td#number').text(response.number + '.');
			modal.find('td#user').text(response.user.name + ' ' + response.user.last_name + '.');
			modal.find('td#created_date').text(response.open + '.');
			modal.find('td#closed_date').text(response.close + '.');
			modal.find('td#state').text(response.shippingstate.state + '.');
			modal.find('td#cant').text(response.trackings.length + '.');
			modal.find('td#value').text(response.sum_total + '.');
			trackTableView.draw();
			modal.modal('toggle');
		});
	});
})
.fail(function(response) {
	toastr.error('Error al cargar notificaciones');
});
let translateTableCustom = translateTable;
translateTableCustom.sInfoFiltered = '';
var trackTableView = $('table#table-view-trackings').DataTable({
	lengthMenu: [[5, 10, 20, -1], [5, 10, 20, "Todos"]],	
	processing: true,
	serverSide: true,
	responsive: true,
	language: translateTableCustom,
	ajax: {
		url: path + 'tracking',
		data: function (d) {
			d.consolidated_id = $('a#view-formalized').attr('consolidated');
		}
	},
	columns: [
	{data: 'distributor.name', name: 'trackings.distributor_id'},
	{data: 'tracking', name: 'trackings.id'},
	{data: 'description', name: 'trackings.description'},
	{data: 'price', name: 'trackings.price'},
	{data: 'created_at', name: 'created_at'},
	{data: 'shippingstate.state', name: 'shippingstate.state'},
	]
});
if (location.href.indexOf('/perfil') > 0) {
	// al cargar la pagina se colocan los inputs con readonly
	let inputs = $('form#profile').find('input, textarea, select');
	inputs.attr('disabled', '');
	$('#buttons_edit_perfil').hide();
	// se altera el estado de los inputs con este boton
	$('button#active_edit_profile, button#cancel').click(function (e) {
		e.preventDefault();
		restoreSmallInputs(messages)
		if ($(inputs[0]).attr('disabled') == undefined) {
			inputs.attr('disabled', '');
			$('#buttons_edit_perfil').fadeOut();
			UserProfile();
		} else {
			$('#buttons_edit_perfil').fadeIn();
			inputs.removeAttr('disabled');
		}
	});
	UserProfile();
	function UserProfile() {
		let id = $('form#profile')[0].action.split('/')[4];
		$.get(path + 'usuarios/'+id, function (response) {
			let option = '<option value="" selected disabled>Seleccione un pais.</option>';
			let countries = response.countries;
			for (let i in countries) {
				option += '<option value="'+i+'">'+countries[i]+'</option>';
			}
			let user = response.user;
			$('select#country_id').html(option)
			$('a#sin-form').text(user.consolidateda);
			$('a#form').text(user.consolidatedc);
			if (user.state) {
				$('select#country_id').val(user.state.countrie_id);
				$.get(path + 'get-data-states/' + user.state.countrie_id, function (response) {
					if (user.country_id == 1) {
						option = '<option value="">Seleccione un Departamento</option>';
					} else {
						option = '<option value="">Seleccione un Estado</option>';
					}
					for (let i in response) {
						option += '<option value="'+i+'">'+response[i]+'</option>';
					}
					$('select#state_id').html(option);
					for(let i in inputs) {
						if (inputs[i].id && inputs[i].id != 'country_id') {
							let value = user[inputs[i].name];
							$(inputs[i]).val(value);
						}
					}
				});
			} else {
				for(let i in inputs) {
					if (inputs[i].id && inputs[i].id != 'country_id') {
						let value = user[inputs[i].name];
						$(inputs[i]).val(value);
					}
				}
			}
		});
	}
	// eventos al enviar el formulario del perfil
	$('form#profile').submit(function (e) {
		e.preventDefault();
		if ($(inputs[0]).attr('disabled') !== undefined) {
			toastr.warning("Debe activar la edición en el boton Editar Perfil!")
			return;
		}

		let url  = $(this).attr('action');
		let data = $(this).serializeArray();
		restoreSmallInputs(messages)
		$.ajax({
			url: url,
			type: 'POST',
			dataType: 'json',
			data: data,
		})
		.done(function(response) {
			toastr.success('Usuario editado exitosamente!');
			inputs.attr('disabled', '');
			$('#buttons_edit_perfil').hide();
			restoreSmallInputs(messages)
			UserProfile();
		})
		.fail(function(response) {
			mgs_errors(response.responseJSON)
		});
		if ($('input[name="avatar"]')[0].files[0]) {	
			$('#country_id').removeClass('text-danger')
			.text('Imagen Personal');
			let form = new FormData();
			let file = $('input[name="avatar"]')[0].files[0];
			form.append('avatar', file);
			let id = $('form#profile')[0].action.split('/')[4];
			axios
			.post(path+'save-image/'+id, form)
			.then(function (response) {
				toastr.success('Imagen editada con exito');
			})
			.catch(function (error) {
				$('#country_id').addClass('text-danger')
				.text(error.response.data.avatar[0])
			});
		}
	});
	// coloca un preview de la imagen subida
	$('input[name="avatar"]').change(function (e) {
		if (this.files && this.files[0]) {
			var reader = new FileReader();
			reader.readAsDataURL(this.files[0]);
			reader.onload = function (e) {
				$('div#avatar_profile img').attr({'src': e.target.result})
			}
		}
	});
}

if (location.href.indexOf('/usuarios') > 0 || location.href.indexOf('/perfil') > 0) {
	$('select#country_id').change(function (e) {
		let num = $(this).val();
		let option;
		$.get(path + 'get-data-states/' + num, function (response) {
			if (num == 1) {
				option = '<option value="">Seleccione un Departamento</option>';
			} else {
				option = '<option value="">Seleccione un Estado</option>';
			}
			for (let i in response) {
				option += '<option value="'+i+'">'+response[i]+'</option>';
			}
			$('select#state_id').html(option);
		});
	});
}
// abrir el modal de cambio de password
$('#btn-change-pass').click(function (e) {
	$('form#change_password_form')[0].reset();
	$('div#change_password').modal('toggle');
});
// enviar los datos por ajax del cambio de password
$('form#change_password_form').submit(function (e) {
	e.preventDefault();
	let mgs_profile = {
		'old_password': 'Contraseña actual.',
		'password': 'Nueva contraseña.',
		'password_confirmation': 'Repita nueva contraseña.',
	}
	let url  = $(this).attr('action');
	let data = $(this).serializeArray();
	restoreSmallInputs(mgs_profile);
	$.ajax({
		url: url,
		type: 'POST',
		dataType: 'json',
		data: data,
	})
	.done(function(response) {
		toastr.success('Contraseña editada exitosamente!');
		$('div#change_password').modal('toggle');
		$('form#change_password_form')[0].reset();
	})
	.fail(function(response) {
		mgs_errors(response.responseJSON)
	});
});

function restoreSmallInputs(msg) {
	for (var i in msg) {
		$('small#'+i)
		.removeClass('text-danger')
		.addClass('text-muted')
		.text(msg[i]);
	}
}
function mgs_errors(msg) {
	for (var i in msg) {
		$('small#'+i)
		.addClass('text-danger')
		.text(msg[i][0]);
	}
	toastr.error('Ups, Al parecer ah ocurrido un error!');
	console.clear();
}

if (location.href.indexOf('/usuarios') > 0) {
	$.get('get-data-user/', function (response) {
		let option = '<option value="" selected disabled>Seleccione un pais.</option>';
		for (var i in response.countries) {
			option += '<option value="'+response.countries[i].id+'">'+response.countries[i].country+'</option>';
		}
		$('form#user_form').find('select#country_id').html(option);
		option = '<option value="" selected disabled>Seleccione un rol.</option>';
		for (var i in response.roles) {
			option += '<option value="'+response.roles[i].id+'">'+response.roles[i].rol+'</option>';
		}
		$('form#user_form').find('select#role_id').html(option);
	});
	var oTable = $('table#users-table').DataTable({
		processing: true,
		serverSide: true,
		responsive: true,
		render: true,
		language: translateTable,
		ajax: {
			url: path + 'usuarios',
			complete: function () {
				$('input[type="radio"][name="user"]').click(function (){
					$('a[data-title="Edit"]').attr('id', $(this).val());
					$('a[data-title="Delete"]').attr('id', $(this).val());
				});
				let tr = $('tr');
				for (var i = 0; i <= tr.length; i++) {
					let t = tr[i];
					let td = $(t).children('td')[3];
					let text = $(td).text();
					$(td).html(text);
				}
			}
		},
		order: [[0, 'DESC']],
		columns: [
		{data: 'action', name: 'action', orderable: false, searchable: false},
		{data: 'fullname', name: 'name'},
		{data: 'num_id', name: 'num_id'},
		{data: 'role.rol', name: 'role_id'},
		{data: 'email', name: 'email'},
		{data: 'pais', name: 'state_id'},
		{data: 'phone', name: 'phone'},
		]
	});
	$('a[data-title="Delete"]').click(function (e) {
		e.preventDefault();
		if (!$(this).attr('id')) {
			toastr.warning('Debe seleccionar un usuario.');
			return;
		}
		let id = $(this).attr('id');
		let url = path + 'usuarios/' + id;
		$.ajax({
			url: url,
			type: 'POST',
			dataType: 'json',
			data: {'_method': 'DELETE'}
		})
		.done(function(response) {
			toastr.success('Usuario Borrado exitosamente!');
			oTable.draw();
		})
		.fail(function(){
			toastr.success('Error al borrar usuario!');
		});
	});
	$('a[data-title="Edit"]').click(function (e) {
		e.preventDefault();
		if (!$(this).attr('id')) {
			toastr.warning('Debe seleccionar un usuario.');
			return;
		}
		let id = $(this).attr('id');
		let url = path + 'usuarios/' + id;
		restoreSmallInputs(messages);
		$('form#user_form')[0].reset();
		$('#modal_user_form form')
		.attr('action', url)
		.find('input[name="_method"]')
		.attr('value', 'PUT');
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'json',
		})
		.done(function(response) {
			if (response.user.state) {
				let countrie = response.user.state.countrie_id;
				let state = response.user.state.id;
				let option;
				$('select#country_id').val(countrie);
				$.get(path + 'get-data-states/' + countrie, function (response) {
					if (countrie == 1) {
						option = '<option value="">Seleccione un Departamento</option>';
					} else {
						option = '<option value="">Seleccione un Estado</option>';
					}
					for (let i in response) {
						option += '<option value="'+i+'">'+response[i]+'</option>';
					}
					$('select#state_id').html(option).val(state);
				});
			}
			for (var i in response.user) {
				$('form#user_form')
				.find('#'+i)
				.val(response.user[i]);
			}
			$('#modal_user_form')
			.modal('toggle')
			.find('h4.modal-title')
			.text('Editar Usuario: ' + response.user.name + ' ' + response.user.last_name + ' Sky.');
		})
		.fail(function(){
			toastr.success('Error al buscar usuario!');
		});
	})
	$('a#register_user').click(function () {
		$('#modal_user_form')
		.modal('toggle')
		.find('h4.modal-title')
		.text('Registrar Usuario.');
		restoreSmallInputs(messages);
		$('#modal_user_form form').attr('action', path + 'usuarios/');
		$('#modal_user_form input[name="_method"]').attr('value', 'POST');
		$('select#state_id').html('<option value="">Seleccione primero un pais.</option>');
		$('form#user_form')[0].reset();
	});
	$('form#user_form').submit(function (e) {
		e.preventDefault();
		let url = $(this).attr('action');
		if ($(this).attr('action') == path + 'usuarios/') {
			url = $(this).attr('action').substring(0, url.length-1);
		} else {
			url = $(this).attr('action');
		}
		let func = $(this).find('input[name="_method"]')[0].value;
		let data = $(this).serializeArray();
		restoreSmallInputs(messages);
		$.ajax({
			url: url,
			type: 'POST',
			dataType: 'json',
			data: data,
		})
		.done(function(response) {
			oTable.draw();
			if (func == 'POST') {
				toastr.success('Usuario creado exitosamente!');
			} else {
				toastr.success('Usuario editado exitosamente!');
			}
			$('#modal_user_form').modal('toggle');
		})
		.fail(function(response) {
			mgs_errors(response.responseJSON)
		});
	})
}

if (location.href.indexOf('/consolidados') > 0) {
	$('div#header-search-a').hide();
	$('#search-cons-a').click(function (e) {
		e.preventDefault();
		$('div#header-search-a').fadeToggle();
	});
	$.post(path + 'data-for-consolidated', function (response) {
		let d = response.distributors;
		let option = '<option value="">Seleccione un repartidor</option>';
		for (let i in d) {
			option += '<option value="'+i+'">'+d[i]+'</option>';
		}
		$('select#distributor_id').html(option);
		let s = response.states;
		option = '<option value="">Seleccione un estado</option>';
		for (let i in s) {
			option += '<option value="'+i+'">'+s[i]+'</option>';
		}
		$('form#searchconsolidate select#status').html(option);
	});
	var consTable = $('table#consolidated-a-table').DataTable({
		lengthMenu: [[5, 10, 20, -1], [5, 10, 20, "Todos"]],	
		processing: true,
		serverSide: true,
		responsive: true,
		render: true,
		language: translateTable,
		ajax: {
			url: path + 'consolidados',
			data: function (d) {
				d.consolidated = $('form#searchconsolidate input[name="consolidated"]').val();
				d.close_date = $('form#searchconsolidate input[name="close_date"]').val();
				d.create_date = $('form#searchconsolidate input[name="create_date"]').val();
				d.c = 'abierto';
			},
			complete: function () {
				$('input[type="radio"][name="consolidated"]').click(function () {
					let consolidated = $(this).val();
					$('button#deleteConsolidated, button#viewConsolidated, button#editConsolidated, button#extendConsolidated')
					.attr('consolidated', consolidated);
				});
				let tr = $('tr');
				for (var i = 0; i <= tr.length; i++) {
					let t = tr[i];
					let td = $(t).children('td');
					let text = $(td[4]).text();
					$(td[4]).html(text);
					text = $(td[5]).text();
					$(td[5]).html(text);
				}
			}
		},
		order: [[3, 'DESC']],
		columns: [
		{data: 'action', orderable: false, searchable: false},
		{data: 'number', name: 'number'},
		{data: 'fullname', name: 'user_id'},
		{data: 'created_at', name: 'created_at'},
		{data: 'shippingstate', name: 'shippingstate_id'},
		{data: 'num_trackings', orderable: false, searchable: false},
		{data: 'closed_at', name: 'closed_at'},
		]
	});
	var trackTable = $('table#tracking-table').DataTable({
		lengthMenu: [[5, 10, 20, -1], [5, 10, 20, "Todos"]],	
		processing: true,
		serverSide: true,
		responsive: true,
		render: true,
		language: translateTableCustom,
		ajax: {
			url: path + 'tracking/',
			data: function (d) {
				d.consolidated_id = $('form#tracking-form-register input#consolidated_id').val();
			},
			complete: function () {
				$('a#deleteTracking').click(function () {
					let tracking = $(this).attr('tracking');
					$('form#tracking-form-register')[0].reset();
					$('#tracking-form-register input[name=_method]').val('POST');
					$('form#tracking-form-register').attr('action', path + 'tracking');
					$('#btn-create-tracking').show();
					$('#btns-edit-tracking').hide();
					$.post(path + 'tracking/' + tracking, {'_method': 'DELETE'}, function () {
						trackTable.draw();
						toastr.success('Tracking Eliminado.');
					});
				});	
				$('a#editTracking').click(function () {
					let tracking = $(this).attr('tracking');
					$(this).parent().parent().addClass('info');
					$.get(path + 'tracking/' + tracking, function (response) {
						let entradas = $('form#tracking-form-register');
						for (let i in response) {
							entradas.find('input#'+i+', select#'+i).val(response[i])
						}
						$('#btn-create-tracking').hide();
						$('#btns-edit-tracking').show();
						$('#btns-edit-tracking').removeClass('hidden');
						$('#tracking-form-register input[name=_method]').val('PUT');
						$('#tracking-form-register').attr('action', path + 'tracking/' + tracking);
						toastr.info('Editar Tracking.');
					});
				});
			}
		},
		columns: [
		{data: 'distributor.name', name: 'trackings.distributor_id'},
		{data: 'tracking', name: 'trackings.id'},
		{data: 'description', name: 'trackings.description'},
		{data: 'action', searchable: false, sortable: false},
		]
	});
	var consTable2 = $('table#consolidated-b-table').DataTable({
		lengthMenu: [[5, 10, 20, -1], [5, 10, 20, "Todos"]],	
		processing: true,
		serverSide: true,
		responsive: true,
		render: true,
		language: translateTable,
		ajax: {
			url: path + 'consolidados',
			data: function (d) {
				d.consolidated = $('form#search-consolidate-formalized input[name="consolidated_formalized"]').val();
				d.close_date = $('form#search-consolidate-formalized input[name="closed_at"]').val();
				d.create_date = $('form#search-consolidate-formalized input[name="created_at"]').val();
				d.c = 'cerrado';
			},
			complete: function () {
				$('input[type="radio"][name="consolidated2"]').click(function () {
					let consolidated = $(this).val();
					$('a#view-formalized, a#edit-formalized, a#delete-formalized')
					.attr('consolidated', consolidated);
				});
			}
		},
		order: [[3, 'DESC']],
		columns: [
		{data: 'action', orderable: false, searchable: false},
		{data: 'number', name: 'number'},
		{data: 'fullname', name: 'user_id'},
		{data: 'created_at', name: 'created_at'},
		{data: 'num_trackings', orderable: false, searchable: false},
		{data: 'closed_at', name: 'closed_at'},
		]
	});
	$('#addForm').click(function (e) {
		e.preventDefault();
		$(this).attr('disabled', '');
		$.ajax({
			url: path + 'consolidados',
			type: 'POST',
			dataType: 'json',
			data: {
				index: 'create'
			}
		})
		.done(function(response) {
			trackTable.draw();
			$('.f-close').text(response.cierre);
			$('.f-create').text(response.creacion);
			$('form#tracking-form-register input#consolidated_id').val(response.id);
			$('#modal-send-form').modal('toggle').find('.modal-title').html('<span class="fa fa-plus"></span> Crear Nuevo Consolidado.');
			consTable.draw();
			$('#addForm').removeAttr('disabled');
			toastr.success('Nuevo Consolidado Abierto');
		})
		.fail(function(response) {
			toastr.error('Opps al parecer a ocurrido un error');
		});
	});
	$('form#tracking-form-register').submit(function (e) {
		e.preventDefault();
		let url = $(this).attr('action');
		let data = $(this).serializeArray();
		$.ajax({
			url: url,
			type: 'POST',
			dataType: 'json',
			data: data
		})
		.done(function(response) {
			if (response.msg) {
				toastr.error(response.msg);
				return;
			}
			$('form#tracking-form-register')[0].reset();
			trackTable.draw();
			toastr.success('Tracking Registrado');
		})
		.fail(function(response) {
			toastr.error('Opps al parecer a ocurrido un error');
		});
	});
	$('form#searchconsolidate').submit(function (e) {
		e.preventDefault();
		consTable.draw();
	});
	$('button#deleteConsolidated').click(function () {
		let consolidated = $(this).attr('consolidated');
		if (consolidated === undefined) {
			toastr.warning('Debe seleccionar un consolidado.')
			return;
		};
		$.post(path + 'consolidados/' + consolidated, {'_method': 'DELETE'}, function () {
			consTable.draw();
			toastr.success('Consolidado Eliminado.');
		});
	});
	$('button#btn-cancel-tracking, button#btn-edit-tracking').click(function () {
		if ($(this)[0].id == 'btn-edit-tracking') {
			let form = $('#tracking-form-register');
			let url = form.attr('action');
			let data = form.serializeArray();
			$.ajax({
				url: url,
				type: 'POST',
				dataType: 'json',
				data: data
			})
			.done(function(response) {
				trackTable.draw();
				if (response.msg) {
					toastr.error(response.msg);
					return;
				}
				toastr.success('Tracking Editado.');
			})
			.fail(function(response) {
				toastr.error('Opps al parecer a ocurrido un error');
			});
		}
		$('#tracking-form-register').attr('action', path + 'tracking');
		$('#tracking-form-register')[0].reset();
		$('#btn-create-tracking').show();
		$('#btns-edit-tracking').hide();
		$('#tracking-form-register input[name=_method]').val('POST')
		$('tr').removeClass('info');
		if ($(this)[0].id == 'btn-cancel-tracking') {
			toastr.info('Edición Cancelada.');
		}
	});
	$('button#extendConsolidated').click(function () {
		let consolidated = $(this).attr('consolidated');
		if (!consolidated) {
			toastr.warning('Debe seleccionar un consolidado.');
			return;
		}
		let url = path + 'extend-consolidated/' + consolidated;
		$.ajax({
			url: url,
			type: 'POST',
			dataType: 'json',
		})
		.done(function(response) {
			if (response.msg) {
				toastr.info(response.msg);
				return;
			}
			consTable.draw();
			toastr.success('Consolidado Extendido un día.');
		})
		.fail(function(response) {
			toastr.error('Opps al parecer a ocurrido un error');
		});
	});
	$('button#cancel-consolidated').click(function () {
		let id = $('form#tracking-form-register input#consolidated_id')[0].value;
		$.post(path + 'consolidados/'+id, {'_method':'DELETE'}, function (response) {
			consTable.draw();
			toastr.success('Consolidado Cancelado.');
		});
	});
	$('button#consolidated-consolidated').click(function () {
		let id = $('form#tracking-form-register input#consolidated_id')[0].value;
		$.post(path + 'formalize-consolidated/' + id, function (response) {
			consTable.draw();
			setTimeout(function () {
				consTable2.draw();
			}, 500);
			$('#modal-send-form').modal('toggle');
			toastr.success('Consolidado Formalizado.');
		})
		.fail(function(response) {
			toastr.warning(response.responseJSON.msg);
			console.clear();
		});
	});
	$('button#editConsolidated').click(function () {
		let consolidated = $(this).attr('consolidated');
		if (!consolidated) {
			toastr.warning('Debe seleccionar un consolidado.');
			return;
		}
		let url = path + 'consolidados/' + consolidated;
		$.get(url, function (response) {
			$('.f-close').text(response.close);
			$('.f-create').text(response.open);
			$('form#tracking-form-register input#consolidated_id').val(response.id);
			$('#modal-send-form').modal('toggle').find('.modal-title').html('<span class="fa fa-edit"></span> Editar Consolidado ' + response.number + '.');
			trackTable.draw();
		});
	});
	$('div#header-search-b').hide();
	$('#search-cons-b').click(function (e) {
		e.preventDefault();
		$('div#header-search-b').fadeToggle();
	});
	$('form#search-consolidate-formalized').submit(function (e) {
		e.preventDefault();
		consTable2.draw();
	});
	$('button#viewConsolidated, a#view-formalized').click(function (e) {
		e.preventDefault();
		let consolidated = $(this).attr('consolidated');
		if (!consolidated) {
			toastr.warning('Debe seleccionar un consolidado.');
			return;
		}
		let url = path + 'consolidados/' + consolidated;
		$.get(url, function (response) {
			let modal = $('div#modal-send-show');
			modal.find('.modal-title').html('<span class="fa fa-cube"></span> Consolidado n° ' + response.number + '.');
			modal.find('td#number').text(response.number + '.');
			modal.find('td#user').text(response.user.name + ' ' + response.user.last_name + '.');
			modal.find('td#created_date').text(response.open + '.');
			modal.find('td#closed_date').text(response.close + '.');
			modal.find('td#state').text(response.shippingstate.state + '.');
			modal.find('td#cant').text(response.trackings.length + '.');
			modal.find('td#value').text(response.sum_total + '.');
			trackTableView.draw();
			modal.modal('toggle');
		});
	});
	$('#consolidated-save').click(function () {
		consTable.draw();
	});
	$('a#delete-formalized').click(function (e) {
		e.preventDefault();
		let consolidated = $(this).attr('consolidated');
		if (consolidated === undefined) {
			toastr.warning('Debe seleccionar un consolidado.')
			return;
		};
		$.post(path + 'consolidados/' + consolidated, {'_method': 'DELETE'}, function () {
			consTable2.draw();
			toastr.success('Consolidado Eliminado.');
		});
	});
	$('a#edit-formalized').click(function (e) {
		e.preventDefault()
		if ($(this).attr('consolidated') == undefined) {
			toastr.warning('Debe seleccionar un consolidado.')
			return;
		};
		trackTable2.draw();
		cargarEventos($(this).attr('consolidated'));
		$('#modal-send_formalizated_edit').modal('toggle');
	});
	function cargarEventos(id) {
		$.post(path + 'formalized/' + id, function (response) {
			$('div#modal-send_formalizated_edit').find('h4')
			.html('<span class="fa fa-edit"></span> Editar Consolidado: ' + response.consolidated.number + '.');
			let event = response.event;
			let template, item;
			$('ul#events-formalized').html('');
			for(let e in event) {
				template = $('#timeline-template').html();
				item = $(template).clone();	
				item.find(".bg-teal").text(event[e].created);
				item.find(".time").html('<i class="fa fa-clock-o"></i> ' + event[e].hour);
				item.find(".timeline-header a").text('Consolidado ' + response.consolidated.number);
				item.find(".timeline-body").text(event[e].events.description);
				item.find(".timeline-footer a").attr('evento', event[e].id);
				$('ul#events-formalized').append(item);
			}
			$('a#delete-event').click(function (e) {
				e.preventDefault();
				let event = $(this).attr('evento');
				$.post(path + 'event/' + event, {'_method': 'DELETE'}, function () {
					cargarEventos(id)
					toastr.success('Evento Eliminado.');
				});
			});
		});
	}
	var trackTable2 = $('table#table-edit-formalized').DataTable({
		lengthMenu: [[5, 10, 20, -1], [5, 10, 20, "Todos"]],	
		processing: true,
		serverSide: true,
		responsive: true,
		render: true,
		language: translateTableCustom,
		ajax: {
			url: path + 'tracking/',
			data: function (d) {
				d.consolidated_id = $('a#edit-formalized').attr('consolidated');
			},
		},
		columns: [
		{data: 'distributor.name', name: 'trackings.distributor_id'},
		{data: 'tracking', name: 'trackings.id'},
		{data: 'description', name: 'trackings.description'},
		{data: 'price', name: 'trackings.description'},
		{data: 'created_at', name: 'trackings.created_at'},
		]
	});
}
