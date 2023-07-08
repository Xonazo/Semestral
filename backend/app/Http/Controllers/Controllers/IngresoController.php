<?php

namespace App\Http\Controllers;

use App\Models\Bodega;
use App\Models\Bebida;
use App\Models\Ingreso;
use App\Models\DetalleIngreso;
use App\Models\Stock;
use App\Repositories\IngresoRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IngresoController extends Controller
{
    
    protected IngresoRepository $ingresoRepository;

    public function __construct(IngresoRepository $ingresoRepository)
    {
        $this->ingresoRepository = $ingresoRepository;
    }

    public function createIngreso(Request $request)
    {
        return $this->ingresoRepository->createIngreso($request);
    }

    public function view(Request $request)
    {
        return $this->ingresoRepository->view($request);
    }

    public function viewAll(Request $request)
    {
        return $this->ingresoRepository->viewAll($request);
    }

    public function viewPorBodega(Request $request)
    {
        return $this->ingresoRepository->viewPorBodega($request);
    }

}
