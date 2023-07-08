<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Bodega;
use App\Repositories\BodegaRepository;
use Exception;
use Illuminate\Support\Facades\Log;

class BodegaController extends Controller
{
    protected BodegaRepository $bodegaRepository;

    public function __construct(BodegaRepository $bodegaRepository)
    {
        $this->bodegaRepository = $bodegaRepository;
    }

    public function createBodega(Request $request)
    {
        return $this->bodegaRepository->createBodega($request);
    }

    public function viewAllBodegas(Request $request)
    {
        return $this->bodegaRepository->viewAllBodegas($request);
    }

    public function viewBodega(Request $request)
    {
        return $this->bodegaRepository->viewBodega($request);
    }

    public function updateBodega(Request $request)
    {
        return $this->bodegaRepository->updateBodega($request);
    }

    public function deleteBodega(Request $request)
    {
        return $this->bodegaRepository->deleteBodega($request);
    }
}
