<?php

namespace App\Http\Controllers;

use App\Models\Videogame;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VideogameController extends Controller
{
    /**
     * /videogames/[id]
     * GET
     */
    public function read($id) {
        // Get item or send 404 response if not
        $item = Videogame::find($id);

        // Si on a un résultat
        if (!empty($item)) {
            // Return JSON of this list
            return $this->sendJsonResponse($item, 200);
        }
        // Sinon
        else {
            // HTTP status code 404 Not Found
            return $this->sendEmptyResponse(404);
        }
    }

    /**
     * /videogames/[id]/reviews
     * GET
     */
    public function getReviews($id) {
        // Get item or send 404 response if not
        $item = Videogame::find($id);

        // Si on a un résultat
        if (!empty($item)) {
            // Retrieve all related Reviews (thanks to Relationships)
            // $reviews = $item->reviews->load(['videogame', 'platform']);
            // But, relationships with videogame & plaftorm are not configured yet
            $reviews = $item->reviews;

            // Return JSON of this list
            return $this->sendJsonResponse($reviews->load(['videogame', 'platform']), 200);
        }
        // Sinon
        else {
            // HTTP status code 404 Not Found
            return $this->sendEmptyResponse(404);
        }
    }
 
    /**
     * /videogames
     * GET
     */
    public function list() {
        // Get all items
        $list = Videogame::all();

        // Return JSON of this list
        return $this->sendJsonResponse($list, 200);
    }

    /**
     * /videogames
     * POST
     */
    public function add(Request $request)
    {
        $videogame = new Videogame();

        $this->validate( $request, [
            "name" => "required|min:3|max:128|unique:videogames",
            "editor" => "required",
            "status" => "required|numeric|integer|min:1|max:2"
        ]);

        $videogame->name = $request->input('name');
        $videogame->editor = $request->input('editor');
        $videogame->status = $request->input('status', 1);

        $videogame->save();

        if ($videogame->save()) {

            return response()->json($videogame, Response::HTTP_CREATED);
        }

        return response()->json("", Response::HTTP_INTERNAL_SERVER_ERROR);
    }

}
