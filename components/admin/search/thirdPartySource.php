<?php

class SearchThirdPartySourceaApi
{

    public function index($term, $lang)
    {

        $text = strtolower(str_replace(" ", "%", trim($term)));

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => "https://free-news.p.rapidapi.com/v1/search?q=$text&lang=$lang",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => [
                "X-RapidAPI-Host: free-news.p.rapidapi.com",
                "X-RapidAPI-Key: 1da86679d7msh5fa8798f7087a1ep165f98jsnc11b29d86db5"
            ],
        ]);

        $response = curl_exec($curl);
        $err = curl_error($curl);


        curl_close($curl);

        if ($err) {
            return "cURL Error #:" . $err;
        } else {
            $results = json_decode($response);

            return $results->articles;
        }
    }






}