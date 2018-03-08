@extends('vendor.adminlte.layouts.app')

@section('main-content')
<div class="row">  
    <div class="col-md-3">
        <div class="box box-primary">
            <div class="box-body box-profile">
                <img class="profile-user-img img-responsive img-circle" src="/img/avatar5.png">
                <h3 class="profile-username text-center">{{ $user->name.' '.$user->last_name }}</h3>
                <p class="text-muted text-center"> Administrador</p>
                <ul class="list-group list-group-unbordered">
                    <li class="list-group-item">
                        <b>Abiertos:</b>
                        <a class="pull-right">10</a>
                    </li>
                    <li class="list-group-item">
                        <b>En proceso:</b>
                        <a class="pull-right">10</a>
                    </li>
                    <li class="list-group-item">
                        <b>Cerrados:</b>
                        <a class="pull-right">10</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="col-md-9">
        <div class="nav-tabs-custom">
            <ul class="nav nav-tabs">
                <li class="active">
                    <a href="#profile" data-toggle="tab" aria-expanded="true">Perfil</a>
                </li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane active" id="profile">
                    <div class="box-header with-border">
                        <button class="btn btn-primary btn-xs pull-right" id="active_edit_profile"><span class="fa fa-edit"></span> Editar perfil</button>
                    </div>
                    <form id="profile" action="{{ route('usuarios.update', $user->id) }}">
                        {{ csrf_field() }} {{ method_field('PUT') }}
                        <div class="box-body">
                            <div class="row">
                                <div class="form-group col-md-6">
                                    <div class="input-group">
                                        <div class="input-group-addon">
                                            <span class="fa fa-user-circle text-primary"></span>
                                        </div>
                                        <input type="text" id="name" name="name" class="form-control" placeholder="Nombres">
                                    </div>
                                    <small id="name" class="form-text text-muted">Nombres del usuario.</small>
                                </div>
                                <div class="form-group col-md-6">
                                    <div class="input-group">
                                        <div class="input-group-addon">
                                            <span class="fa fa-user-circle-o text-primary"></span>
                                        </div>
                                        <input type="text" id="last_name" name="last_name" class="form-control" placeholder="Apellidos">
                                    </div>
                                    <small id="last_name" class="form-text text-muted">Apellidos del usuario.</small>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-md-6">
                                    <div class="input-group">
                                        <div class="input-group-addon">
                                            <span class="fa fa-phone text-primary"></span>
                                        </div>
                                        <input type="text" id="phone" name="phone" class="form-control" placeholder="Telefono">
                                    </div>
                                    <small id="phone" class="form-text text-muted">Telefono de contacto.</small>
                                </div>
                                <div class="form-group col-md-6">
                                    <div class="input-group">
                                        <div class="input-group-addon">
                                            <span class="fa fa-envelope text-primary"></span>
                                        </div>
                                        <input type="email" id="email" name="email" class="form-control" placeholder="ejemplo@ejemplo.com">
                                    </div>
                                    <small id="email" class="form-text text-muted">Correo electronico.</small>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-md-6">
                                    <div class="input-group">
                                        <div class="input-group-addon">
                                            <span class="fa fa-id-card text-primary"></span>
                                        </div>
                                        <input type="text" id="num_id" name="num_id" class="form-control" placeholder="ID">
                                    </div>
                                    <small id="num_id" class="form-text text-muted">Documento de identidad.</small>
                                </div>
                                <div class="form-group col-md-6">
                                    <div class="input-group">
                                        <div class="input-group-addon">
                                            <span class="fa fa-globe text-primary"></span>
                                        </div>
                                        <select id="country_id" name="country_id" class="form-control"></select>
                                    </div>
                                    <small id="country_id" class="form-text text-muted">Pais de origen.</small>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-md-6">
                                    <div class="input-group">
                                        <div class="input-group-addon">
                                            <span class="fa fa-map text-primary"></span>
                                        </div>
                                        <input type="text" id="city" name="city" class="form-control" placeholder="Ciudad">
                                    </div>
                                    <small id="city" class="form-text text-muted">Ciudad de origen.</small>
                                </div>
                                <div class="form-group col-md-6"> 
                                    <textarea id="address" name="address" class="form-control" placeholder="Direccion principal"></textarea>
                                    <small  class="form-text text-muted" id="address">Direccion principal del usuario.</small>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-md-6"> 
                                    <textarea id="address_two" name="address_two" class="form-control" placeholder="Direccion secundaria"></textarea>
                                    <small id="address_two" class="form-text text-muted">Direccion secundaria del usuario.</small>
                                </div> 
                            </div>
                        </div>
                        <div id="buttons_edit_perfil" class="box-footer">
                            <div class="pull-right">
                                <div class="btn-group">
                                    <button id="cancel" type="button" class="btn btn-danger btn-sm"><span class="fa fa-close"></span> Cancelar</button>
                                </div>
                                <div class="btn-group">
                                    <button type="submit" class="btn btn-primary btn-sm"><span class="fa fa-send"></span> Enviar</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div> 
            </div>                                                 
        </div> 
    </div>
</div>
@endsection