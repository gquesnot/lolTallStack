<?php

namespace App\Traits;

use GuzzleHttp\Client;
use RiotAPI\Base\Definitions\Platform;
use RiotAPI\Base\Definitions\Region;
use RiotAPI\DataDragonAPI\DataDragonAPI;
use RiotAPI\LeagueAPI\LeagueAPI;

trait LolInit
{
    private LeagueAPI $api;

    public function initLol()
    {

            $this->api = new LeagueAPI([
                //  Your API key, you can get one at https://developer.riotgames.com/
                LeagueAPI::SET_KEY => config('lol.API_KEY'),
                //  Target region (you can change it during lifetime of the library instance)
                LeagueAPI::SET_REGION => Region::EUROPE_WEST,
                LeagueAPI::SET_PLATFORM => Platform::EUROPE

            ]);

            DataDragonAPI::initByCdn();



    }

    public function getMatchTimeline($matchId)
    {
        $client = new Client();
        $headers = [
            "User-Agent" => "Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0",
            "Accept-Language" => "en-US,en;q=0.5",
            "Accept-Charset" => "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin" => "https://developer.riotgames.com",
            "X-Riot-Token" => config('lol.API_KEY')
        ];
        return $client->get("https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}/timeline", ['headers' => $headers])->getBody()->getContents();

    }

}
