<?php


class AutomaticPosts
{
    private $conectionDB;

    // public function __construct()
    // {
    //     $host = "localhost";
    //     $password = "u354253299_orbital";
    //     $username = '9Ha|fclS$O';
    //     $database = "u354253299_orbital";
    //     $this->conectionDB = mysqli_connect($host, $password, $username, $database);
    // }
    public function __construct()
    {
        $host = "172.22.0.1";
        $password = "root";
        $username = "root";
        $database = "orb";
        $this->conectionDB = mysqli_connect($host, $password, $username, $database);
    }


    public function index()
    {

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => "https://free-news.p.rapidapi.com/v1/search?q=brasil&lang=pt",
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


        $results = json_decode($response);
        $results = $results->articles;


        $title = str_replace("'", "\'", $results[0]->title);
        $filterToSlug = preg_replace(array("/(á|à|ã|â|ä)/", "/(Á|À|Ã|Â|Ä)/", "/(é|è|ê|ë)/", "/(É|È|Ê|Ë)/", "/(í|ì|î|ï)/", "/(Í|Ì|Î|Ï)/", "/(ó|ò|õ|ô|ö)/", "/(Ó|Ò|Õ|Ô|Ö)/", "/(ú|ù|û|ü)/", "/(Ú|Ù|Û|Ü)/", "/(ñ)/", "/(Ñ)/", "/(ç|Ç)/", "/(1º)/", "/(2º)/", "/(3º)/", "/(4º)/", "/(5º)/", "/(6º)/", "/(7º)/", "/(8º)/", "/(9º)/"), explode(" ", "a A e E i I o O u U n N c C 1 2 3 4 5 6 7 8 9"), $title);
        $slug = str_replace(array(" ", ":", ";", "?", "/", '"', ',', '.'), "-", strtolower($filterToSlug));
        $link = $results[0]->link;
        $summary = str_replace("'", "\'", $results[0]->summary);
        $image = $results[0]->media;
        $source = $results[0]->clean_url;

        $currentDate = new DateTime("now", new DateTimeZone('America/Sao_Paulo'));
        $timeNow = strtotime($currentDate->format('Y-m-d H:i'));
        $addPostQuery = "UPDATE autposts SET 
        title = '$title',
         link ='$link',
         image ='$image', 
         summary = '$summary',
         source  = '$source',
         slug = '$slug', 
         posted_at = $timeNow WHERE id = 1";
        mysqli_query($this->conectionDB, $addPostQuery);

        mysqli_close($this->conectionDB);
    }
}

$autoposts = new AutomaticPosts();
$autoposts->index();
