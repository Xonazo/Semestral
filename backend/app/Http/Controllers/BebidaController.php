<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Bebida;
use App\Repositories\BebidaRepository;
use Exception;
use Illuminate\Support\Facades\Log;

class BebidaController extends Controller
{
    protected BebidaRepository $bebidaRepository;

    public function __construct(
        BebidaRepository $bebidaRepository
        )
    {
        $this->bebidaRepository = $bebidaRepository;
    }


    public function createBebida(Request $request)
    {
        return $this->bebidaRepository->createBebida($request);
    }

    public function viewAllBebidas(Request $request)
    {
        return $this->bebidaRepository->viewAllBebidas($request);
    }

    public function viewBebida(Request $request)
    {
        return $this->bebidaRepository->viewBebida($request);
    }

    public function updateBebida(Request $request)
    {
        return $this->bebidaRepository->updateBebida($request);
    }

    public function deleteBebida(Request $request)
    {
        return $this->bebidaRepository->deleteBebida($request);
    }
}
