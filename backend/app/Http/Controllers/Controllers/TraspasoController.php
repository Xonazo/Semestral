<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Bebida;
use App\Repositories\TraspasoRepository;
use Exception;
use Illuminate\Support\Facades\Log;

class TraspasoController extends Controller
{
    protected TraspasoRepository $traspasoRepository;

    public function __construct(TraspasoRepository $traspasoRepository)
    {
        $this->traspasoRepository = $traspasoRepository;
    }

    public function traspasarStock (Request $request)
    {
        return $this->traspasoRepository->traspasarStock($request);
    }
   
}
