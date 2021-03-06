@extends('adminlte::layouts.auth')

@section('htmlheader_title')
    Register
@endsection

@section('content')
<body class="hold-transition register-page" style="margin-top: -120px;">
    <div id="app" v-cloak>
        <div class="register-box">
            <div class="login-logo">
                <img class="center-block" src="/img/skyimportglobal.png">
            </div><!-- /.login-logo -->
            @if (count($errors) > 0)
                <div class="alert alert-danger">
                    <strong>Whoops!</strong> {{ trans('adminlte_lang::message.someproblems') }}<br><br>
                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
            <div class="register-box-body">
                <p class="login-box-msg">{{ trans('adminlte_lang::message.registermember') }}</p>
                <form action="{{ url('/register') }}" method="post">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    <div class="form-group has-feedback">
                        <input type="text" class="form-control" placeholder="Nombre y apellido" name="name" value="{{ old('name') }}" autofocus/>
                        {{-- <input type="text" class="form-control" placeholder="{{ trans('adminlte_lang::message.fullname') }}" name="name" value="{{ old('name') }}" autofocus/> --}}
                        <span class="fa fa-user form-control-feedback"></span>
                    </div>

                    @if (config('auth.providers.users.field','email') === 'username')
                        <div class="form-group has-feedback">
                            <input type="text" class="form-control" placeholder="{{ trans('adminlte_lang::message.username') }}" name="username" autofocus/>
                            <span class="fa fa-user form-control-feedback"></span>
                        </div>
                    @endif

                    <div class="form-group has-feedback">
                        <input type="email" class="form-control" placeholder="{{ trans('adminlte_lang::message.email') }}" name="email" value="{{ old('email') }}"/>
                        <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
                    </div>
                    <div class="form-group has-feedback">
                        <input type="num_id" class="form-control" placeholder="Numero de identificación" name="num_id" value="{{ old('num_id') }}"/>
                        <span class="fa fa-id-card form-control-feedback"></span>
                    </div>
                    <div class="form-group has-feedback">
                        <input type="password" class="form-control" placeholder="{{ trans('adminlte_lang::message.password') }}" name="password"/>
                        <span class="fa fa-lock form-control-feedback"></span>
                    </div>
                    <div class="form-group has-feedback">
                        <input type="password" class="form-control" placeholder="{{ trans('adminlte_lang::message.retrypepassword') }}" name="password_confirmation"/>
                        <span class="fa fa-unlock form-control-feedback"></span>
                    </div>
                    <div class="row">
                        <div class="col-xs-2 checkbox_register icheck">
                            <input type="checkbox" name="terms" {{ old('terms') ? 'checked' : '' }}>
                        </div><!-- /.col -->
                        <div class="form-group">
                                <a class="btn" data-toggle="modal" style="margin-left: -10px; margin-top: -5px; " data-target="#termsModal">{{ trans('adminlte_lang::message.terms') }}</a>
                            <div class="col-xs-4 pull-right">
                                <button type="submit" class="btn btn-primary btn-block btn-flat"><span class="fa fa-send"></span> {{ trans('adminlte_lang::message.register') }}</button>
                            </div><!-- /.col -->
                        </div>
                    </div>    
                    <div class="row">
                        <div class="col-xs-8">
                         <a href="{{ url('/login') }}" class="text-center">{{ trans('adminlte_lang::message.membreship') }}</a>
                        </div>
                    </div>       
                </form>
                {{-- @include('adminlte::auth.partials.social_login') --}}
                <div class="row">
                    <div class="col-md-12">
                            <p class="text-justify" style="font-size: 12px;"><b>Ley de Protección de Datos Personales:</b> "La autorización suministrada en el presente formulario faculta a Deloitte para que dé a sus datos aquí recopilados el tratamiento señalado en la "Política de Privacidad para el Tratamiento de Datos Personales" de Deloitte, el cual incluye, entre otras, el envío de información promocional, así como la invitación de eventos. El titular de los datos podrá, en cualquier momento, solicitar que la información sea modificada, actualizada o retirada de las bases de datos de Deloitte.</p>
                    </div>
                </div>
            </div><!-- /.form-box -->
        </div><!-- /.register-box -->
    </div>

    @include('adminlte::layouts.partials.scripts_auth')

    @include('adminlte::auth.terms')

    <script>
      $(function () {
        $('input').iCheck({
          checkboxClass: 'icheckbox_square-blue',
          radioClass: 'iradio_square-blue',
          increaseArea: '20%' // optional
        });
      });
    </script>

    </body>

@endsection