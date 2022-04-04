<?php

namespace App\Http\Controllers;

use App\Models\Test;
use Illuminate\Http\Request;
use Image;

class TestController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $tests = Test::all();
        return $tests;
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if ($request->file('image')){
            $file      = $request->file('image');
            $extension = $file->getClientOriginalExtension();
            $image     = 'Test_'.time().'.'.$extension;
            Image::make($file)->resize(500,500)->save(public_path()."/assets/images/".$image);
        }

        $test = new Test();

        $test->image = $image;
        $test->name = $request->name;
        $test->phone = $request->phone;
        $test->email = $request->email;

        $test->save();

        return $test;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Test  $test
     * @return \Illuminate\Http\Response
     */
    public function show(Test $test,$id)
    {

        $test = Test::findOrFail($id);
        return $test;

    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Test  $test
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $res = [
            'status' => true,
            'data' => null,
            'error' => null
        ];

        $test = Test::find($id);

        if ($test){
            if ($request->file('image')){
                unlink(public_path()."/assets/images/".$test->image);
                $file      = $request->file('image');
                $extension = $file->getClientOriginalExtension();
                $image     = 'Test_'.time().'.'.$extension;
                Image::make($file)->resize(500,500)->save(public_path()."/assets/images/".$image);
                $test->image = $image;
            }

            $name = $request->name;
            $phone = $request->phone;
            $email = $request->email;

            if ($name){
                $test->name = $name;
            }
            if ($phone){
                $test->phone = $phone;
            }
            if ($email){
                $test->email = $email;
            }

            $test->save();

            $res['status'] = true;
            $res['data'] = $test;

        }else{

            $res['status'] = false;
            $res['error'] = 'Sorry!! Data update unsuccessful';
        }

        return $res;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Test  $test
     * @return \Illuminate\Http\Response
     */
    public function destroy(Test $test,$id)
    {
        $res = [
            'status' => true,
            'message' => ''
        ];

        $test = Test::find($id);

        if ($test){
            unlink(public_path()."/assets/images/".$test->image);
            $test->delete();

            $res['status'] = true;
            $res['message'] = 'Data deleted successfully';
        }else{
            $res['status'] = false;
            $res['message'] = 'Sorry!! Data delete unsuccessful';
        }

        return $res;

    }
}
