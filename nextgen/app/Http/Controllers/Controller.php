<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * Class Controller
 *
 * This is the base controller class for your Laravel application.
 * All your application's controllers should extend this class.
 * It includes common traits for authorization and validation.
 */
abstract class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}
