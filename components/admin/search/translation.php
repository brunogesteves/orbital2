<?php



class Translation
{



    public function index($textToTranslate, $language)
    {



        $text = strtolower(trim(str_replace(" ", "%20", $textToTranslate)));

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => "https://google-translate113.p.rapidapi.com/api/v1/translator/text",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => "from=$language&to=pt&text=$text",
            CURLOPT_HTTPHEADER => [
                "X-RapidAPI-Host: google-translate113.p.rapidapi.com",
                "X-RapidAPI-Key: 1da86679d7msh5fa8798f7087a1ep165f98jsnc11b29d86db5",
                "content-type: application/x-www-form-urlencoded"
            ],
        ]);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);


        if ($response) {
            // echo $response;

            $res = json_decode($response);
            // echo $res->trans;
            // echo "<br />";


            return $res->trans;
        } else {
            return $err;
        }
    }

    // public function index($searchTerm, $language)
    // {
    //     return self::makeTranslation($searchTerm, $language);
    // }

}