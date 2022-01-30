<?php

namespace App\Http\Controllers;

use App\Models\Champion;
use App\Models\Item;
use App\Traits\LolInit;
use HtmlParser\Parser;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use SimpleXMLElement;
use function PHPUnit\Framework\stringContains;


class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests, LolInit;



    public function loadItems(){
        set_time_limit(120);
        $items = $this->api->getStaticItems()->getData()['data'];

        foreach($items as $itemId=> $item){
            $dbItem = Item::find($itemId);

            if (!$dbItem) {
                $dbItem = new Item;
                $dbItem->id = $itemId;
            }

            $dbItem->name = $item['name'];
            $dbItem->description = $item['description'];
            $dbItem->colloq = $item['colloq'];
            $dbItem->tags = implode(";",$item['tags']);
            $dbItem->gold =$item['gold']['total'];
            $dbItem->stats =$item['stats'];
            if (count($dbItem->stats) > 0){
                $statsDescription = $this->parseXmlDescription($dbItem->description);
                if ($dbItem->id === 4645){
                    $statsDescription['MagicPenetration'] = 15;
                }
                $dbItem->stats_description = $statsDescription;
            }

            $dbItem->img =$item['image']['full'];//http://ddragon.leagueoflegends.com/cdn/12.1.1/img/item/${image}
            $dbItem->save();


        }
    }

    public function loadChampions(){
        $champions = $this->api->getStaticChampions()->getData()['data'];

        foreach($champions as $championName=> $champion){
            $championId = $champion['key'];
            $dbChampion = Champion::where('id', $championId)->first();
            if ($dbChampion == null){

                $dbChampion = new Champion();
                $dbChampion->id = $championId;
                $dbChampion->name = $championName;
            }
            $dbChampion->stats = $champion['stats'];
            $dbChampion->img =$champion['image']['full'];//http://ddragon.leagueoflegends.com/cdn/12.1.1/img/item/${image}
            $dbChampion->save();

        }
    }




    public function getSummoner(string $summonerName){
        $this->initLol();
        $summoner = $this->api->getSummonerByName($summonerName)->getData();
        $matchList = $this->api->getMatchIdsByPUUID($summoner['puuid']);
        return response()->json(['matchIds' => $matchList]);

    }

    public function getSummonerMatch(string $summonerName, string $matchId){
        $this->initLol();
        $version = $this->api->getStaticVersions()[0];
        $this->loadChampions();

        $match = $this->api->getMatch($matchId)->getData()['info'];


        $matchTimeline = $matchTimeline = json_decode($this->getMatchTimeline($matchId), true)['info'];
        $maxFrame = count($matchTimeline['frames']) - 1;
        $summoners = $match['participants'];
        foreach ($summoners as $idx => $summoner) {
            $items = [];
            for($i = 0; $i <= 5;$i++){
                $item = $summoner['item'.$i];
                if ($item != 0)
                {
                    $items[] = $item;
                }

            }
            $summoners[$idx]['champion'] = Champion::find($summoner['championId']);
            $summoners[$idx]['items'] = $items;

        }
        return response()->json(["match" => $match, 'matchTimeline' => $matchTimeline, 'maxFrame' => $maxFrame, 'summoners' => $summoners]);

    }


    public function parseHtmlTag($text ,$htmlTag){
        $originalText = $text;
        $text = explode("</${htmlTag}>", $text)[0];
        $text = explode("<${htmlTag}>", $text);
        if (count($text) !== 2){
            dd($text, $originalText);
        }
        return $text[1];
    }

    // parse xml description
    public function parseXmlDescription($description){
        $stats = [];
        $description = $this->parseHtmlTag($description, 'mainText');
        $description = $this->parseHtmlTag($description, 'stats');
        if ($description === ""){
            return $stats;
        }
        $statsStr = explode('<br>',$description);

        foreach($statsStr as $stat){
            $value = $this->parseHtmlTag($stat, 'attention');
            if (str_contains($value, '%')){
                $value = str_replace('%', '', $value);
                $value = (float)$value / 100;
            }
            else{
                $value = (int)$value;
            }
            $stats[str_replace(' ', '', explode('</attention>',$stat)[1])] = $value;
        }
        return $stats;
    }

    public function allItems(){
        $this->initLol();
        $version = $this->api->getStaticVersions()[0];
        $this->loadItems();
        $items = Item::all()->filter(function ($item){
            return ! str_contains($item->tags, 'Consumable') && ! str_contains($item->tags, 'Jungle') && ! str_contains($item->tags, 'Trinket');
        });
        $newItemList = [];
        foreach($items as $id => $item){


            $newItemList[$item->id] = $item;


        }
        return response()->json(['items' => $newItemList, 'version' => $version]);
    }



}
