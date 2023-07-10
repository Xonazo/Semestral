<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Stock;
use App\Models\Bodega;
use App\Models\Bebida;
use App\Models\Ingreso;
use App\Models\DetalleIngreso;
use App\Repositories\StockRepository;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Response;

class StockController extends Controller
{

    protected StockRepository $stockRepository;

    public function __construct(StockRepository $stockRepository)
    {
        $this->stockRepository = $stockRepository;
    }

    public function viewAllStock(Request $request)
    {
        return $this->stockRepository->viewAllStock($request);
    }

    public function view(Request $request)
    {
        return $this->stockRepository->view($request);
    }

    public function egreso(Request $request)
    {
        return $this->stockRepository->egreso($request);
    }

}
