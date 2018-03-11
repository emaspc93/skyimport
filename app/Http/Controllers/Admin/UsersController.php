<?php

namespace skyimport\Http\Controllers\Admin;

use Illuminate\Http\Request;
use skyimport\Http\Controllers\Controller;
use skyimport\Http\Requests\ { UserStoreRequest, UserUpdateRequest, changePasswordRequest };
use skyimport\User;
use Illuminate\Support\Facades\Storage;
use Yajra\DataTables\Datatables;

class UsersController extends Controller
{
    public function __construct()
    {
        $this->middleware('ajax')->except(['index', 'profile']);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (!request()->ajax()) return view('users.users');

        return Datatables::of(User::query())
        ->addColumn('action', function ($user) {
            return '<input type="radio" name="user" value='.$user->id.'>';
        })->make(true);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \skyimport\Http\Requests\UserStoreRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserStoreRequest $request)
    {
        $user = User::create($request->all());
        return response()->json($user);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        $countries = \DB::table('countries')->latest('id')->select('id', 'country')->get();
        return response()->json(compact('user', 'countries'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \skyimport\Http\Requests\UserUpdateRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UserUpdateRequest $request, $id)
    {
        // if($request->id == 1) return response(['errors' => 'Error al modificar usuario'], 422);
        $user = User::findOrFail($id)->update($request->all());
        return response()->json($user);
    }

    /**
     * Upload image 'avatar' from user.
     *
     * @param  \skyimport\Http\Requests\UserUpdateRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function saveImage(Request $request, $id)
    {
        $this->validate($request, ['avatar' => 'image']);
        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $ext = $request->avatar->getClientOriginalExtension();
            $name = $id.'.'.$ext;
            \Storage::disk('local')->put($name,  \File::get($file));
        }
        return response('', 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if($id == 1) return response(['error' => 'Error al modificar usuario'], 421);
        $user = User::findOrFail($id)->delete();
        return response()->json($user);
    }

    /**
     * Show the user's profile.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function profile($id = null)
    {
        if ($id) {
            $user = User::findOrFail($id);
        } else {
            $user = \Auth::user();
        }
        return view('users.profile', compact('user', 'id'));
    }

    /**
     * Change of password.
     *
     * @param \skyimport\Http\Requests\changePasswordRequest
     * @return \Illuminate\Http\Response
     */
    public function changePassword(changePasswordRequest $request)
    {
        $user = User::findOrFail(\Auth::user()->id)->fill([
            'password' => bcrypt($request->password)
        ]);
        return response()->json($user->save());
    }

    public function dataForRegister()
    {
        $countries = \DB::table('countries')->latest('id')->select('id', 'country')->get();
        $roles = \DB::table('roles')->latest('id')->select('id', 'rol')->get();
        return response()->json(compact('countries', 'roles'));
    }
}